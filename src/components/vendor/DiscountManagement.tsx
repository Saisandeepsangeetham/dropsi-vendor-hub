import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Percent,
  IndianRupee,
  Save,
} from "lucide-react";
import {
  VendorProduct,
  Discount,
  DiscountManager,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface DiscountManagementProps {
  vendorProducts: VendorProduct[];
}

const DiscountManagement = ({ vendorProducts }: DiscountManagementProps) => {
  const { t } = useTranslation();
  const [discounts, setDiscounts] = useState<
    (Discount & {
      originalPrice: number;
      product: {
        name: string;
        description: string;
        imageUrl: string;
        uom: string;
        brandName: string;
      };
    })[]
  >([]);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<
    | (Discount & {
        originalPrice: number;
        product: {
          name: string;
          description: string;
          imageUrl: string;
          uom: string;
          brandName: string;
        };
      })
    | null
  >(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    discountType: "percentage",
    discountValue: 0,
    discountedPrice: 0,
    cardTitle: "",
    description: "",
    terms: "",
    startsAt: "",
    endsAt: "",
    isActive: true,
  });
  const { toast } = useToast();

  // Load discounts on component mount
  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await DiscountManager.getAllVendorDiscounts({
          isActive:
            activeFilter === "all" ? undefined : activeFilter === "active",
        });
        setDiscounts(response.discounts);
        setTotalDiscounts(response.totalDiscounts);
      } catch (error) {
        console.error("Error loading discounts:", error);
        toast({
          title: t("discount_management_extended.error_loading_discounts"),
          description:
            error instanceof Error
              ? error.message
              : t("discount_management_extended.error_loading_discounts"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscounts();
  }, [toast, activeFilter]);

  const calculateDiscountedPrice = (
    originalPrice: number,
    discountType: "percentage" | "flat",
    discountValue: number
  ) => {
    if (discountType === "percentage") {
      return originalPrice - (originalPrice * discountValue) / 100;
    } else {
      return originalPrice - discountValue;
    }
  };

  const handleCreateDiscount = async () => {
    if (
      !newDiscount.vendorProductId ||
      !newDiscount.cardTitle ||
      !newDiscount.discountValue
    ) {
      toast({
        title: t("discount_management_extended.missing_information"),
        description: t("discount_management_extended.fill_required_fields"),
        variant: "destructive",
      });
      return;
    }

    try {
      const vendorProduct = vendorProducts.find(
        (vp) => vp.id === newDiscount.vendorProductId
      );
      if (vendorProduct) {
        const discountedPrice = calculateDiscountedPrice(
          vendorProduct.price,
          newDiscount.discountType as "percentage" | "flat",
          newDiscount.discountValue!
        );

        const discountData = {
          vendorProductId: newDiscount.vendorProductId!,
          discountType: newDiscount.discountType as "percentage" | "flat",
          discountValue: newDiscount.discountValue!,
          discountedPrice: discountedPrice,
          cardTitle: newDiscount.cardTitle!,
          description: newDiscount.description || "",
          terms: newDiscount.terms || "",
          startsAt: newDiscount.startsAt!,
          endsAt: newDiscount.endsAt || "",
          isActive: newDiscount.isActive!,
        };

        const createdDiscount = await DiscountManager.createDiscount(
          discountData
        );
        // Reload all discounts to get the enhanced data with product information
        const response = await DiscountManager.getAllVendorDiscounts();
        setDiscounts(response.discounts);
        setTotalDiscounts(response.totalDiscounts);

        setNewDiscount({
          discountType: "percentage",
          discountValue: 0,
          discountedPrice: 0,
          cardTitle: "",
          description: "",
          terms: "",
          startsAt: "",
          endsAt: "",
          isActive: true,
        });
        setIsCreating(false);

        toast({
          title: t("discount_management_extended.discount_created"),
          description: t("discount_management_extended.discount_created_desc"),
        });
      }
    } catch (error) {
      toast({
        title: t("discount_management_extended.failed_create_discount"),
        description:
          error instanceof Error
            ? error.message
            : t("common.try_again_support"),
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (
    discount: Discount & {
      originalPrice: number;
      product: {
        name: string;
        description: string;
        imageUrl: string;
        uom: string;
        brandName: string;
      };
    }
  ) => {
    setEditingDiscount(discount);
    setIsEditing(true);
  };

  const handleUpdateDiscount = async () => {
    if (!editingDiscount) return;

    try {
      const discountData = {
        discountType: editingDiscount.discountType,
        discountValue: editingDiscount.discountValue,
        discountedPrice: calculateDiscountedPrice(
          editingDiscount.originalPrice,
          editingDiscount.discountType,
          editingDiscount.discountValue
        ),
        cardTitle: editingDiscount.cardTitle,
        description: editingDiscount.description || "",
        terms: editingDiscount.terms || "",
        startsAt: editingDiscount.startsAt,
        endsAt: editingDiscount.endsAt || "",
        isActive: editingDiscount.isActive,
      };

      await DiscountManager.updateDiscount(editingDiscount.id, discountData);

      // Reload discounts to get updated data
      const response = await DiscountManager.getAllVendorDiscounts({
        isActive:
          activeFilter === "all" ? undefined : activeFilter === "active",
      });
      setDiscounts(response.discounts);
      setTotalDiscounts(response.totalDiscounts);

      setIsEditing(false);
      setEditingDiscount(null);

      toast({
        title: t("discount_management_extended.discount_updated"),
        description: t("discount_management_extended.discount_updated_desc"),
      });
    } catch (error) {
      toast({
        title: t("discount_management_extended.failed_update_discount"),
        description:
          error instanceof Error
            ? error.message
            : t("common.try_again_support"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    try {
      await DiscountManager.deleteDiscount(discountId);
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));

      toast({
        title: t("discount_management_extended.discount_deleted"),
        description: t("discount_management_extended.discount_deleted_desc"),
      });
    } catch (error) {
      toast({
        title: t("discount_management_extended.failed_delete_discount"),
        description:
          error instanceof Error
            ? error.message
            : t("common.try_again_support"),
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.startsAt);
    const endDate = discount.endsAt ? new Date(discount.endsAt) : null;

    if (!discount.isActive) return "secondary";
    if (now < startDate) return "warning";
    if (endDate && now > endDate) return "destructive";
    return "default";
  };

  const getStatusText = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.startsAt);
    const endDate = discount.endsAt ? new Date(discount.endsAt) : null;

    if (!discount.isActive) return t("discount_management_extended.inactive");
    if (now < startDate) return t("discount_management_extended.scheduled");
    if (endDate && now > endDate)
      return t("discount_management_extended.expired");
    return t("discount_management_extended.active");
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {t("discount_management.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("discount_management_extended.create_manage")}
              </p>
            </div>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("discount_management.create_discount")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {t("discount_management_extended.create_new_discount")}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-select">
                    {t("discount_management_extended.select_product")}
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewDiscount((prev) => ({
                        ...prev,
                        vendorProductId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "discount_management_extended.choose_product"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorProducts.map((vp) => (
                        <SelectItem key={vp.id} value={vp.id}>
                          {vp.product.name} - ₹{vp.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-type">
                      {t("discount_management.discount_type")}
                    </Label>
                    <Select
                      value={newDiscount.discountType}
                      onValueChange={(value: "percentage" | "flat") =>
                        setNewDiscount((prev) => ({
                          ...prev,
                          discountType: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          {t("discount_management.percentage")} (%)
                        </SelectItem>
                        <SelectItem value="flat">
                          {t("discount_management.flat_amount")} (₹)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount-value">
                      {t("discount_management.discount_value")}{" "}
                      {newDiscount.discountType === "percentage"
                        ? "(%)"
                        : "(₹)"}
                    </Label>
                    <Input
                      id="discount-value"
                      type="number"
                      step="0.01"
                      value={newDiscount.discountValue || ""}
                      onChange={(e) =>
                        setNewDiscount((prev) => ({
                          ...prev,
                          discountValue: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-title">
                    {t("discount_management_extended.discount_title")}
                  </Label>
                  <Input
                    id="card-title"
                    placeholder={t(
                      "discount_management_extended.weekend_special"
                    )}
                    value={newDiscount.cardTitle || ""}
                    onChange={(e) =>
                      setNewDiscount((prev) => ({
                        ...prev,
                        cardTitle: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("discount_management.description")}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t(
                      "discount_management_extended.describe_offer"
                    )}
                    value={newDiscount.description || ""}
                    onChange={(e) =>
                      setNewDiscount((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">
                    {t("discount_management.terms_conditions")}
                  </Label>
                  <Textarea
                    id="terms"
                    placeholder={t(
                      "discount_management_extended.terms_conditions_placeholder"
                    )}
                    value={newDiscount.terms || ""}
                    onChange={(e) =>
                      setNewDiscount((prev) => ({
                        ...prev,
                        terms: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">
                      {t("discount_management_extended.start_date_time")}
                    </Label>
                    <Input
                      id="start-date"
                      type="datetime-local"
                      value={newDiscount.startsAt || ""}
                      onChange={(e) =>
                        setNewDiscount((prev) => ({
                          ...prev,
                          startsAt: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-date">
                      {t("discount_management_extended.end_date_time")}
                    </Label>
                    <Input
                      id="end-date"
                      type="datetime-local"
                      value={newDiscount.endsAt || ""}
                      onChange={(e) =>
                        setNewDiscount((prev) => ({
                          ...prev,
                          endsAt: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button onClick={handleCreateDiscount}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("discount_management.create_discount")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      {/* Edit Discount Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("discount_management_extended.edit_discount")}
            </DialogTitle>
          </DialogHeader>
          {editingDiscount && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("discount_management_extended.product")}</Label>
                <p className="text-sm text-muted-foreground">
                  {editingDiscount.product.name} -{" "}
                  {editingDiscount.product.brandName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-discount-type">
                    {t("discount_management.discount_type")}
                  </Label>
                  <Select
                    value={editingDiscount.discountType}
                    onValueChange={(value: "percentage" | "flat") =>
                      setEditingDiscount((prev) =>
                        prev ? { ...prev, discountType: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-discount-value">
                    Discount Value{" "}
                    {editingDiscount.discountType === "percentage"
                      ? "(%)"
                      : "(₹)"}
                  </Label>
                  <Input
                    id="edit-discount-value"
                    type="number"
                    step="0.01"
                    value={editingDiscount.discountValue}
                    onChange={(e) =>
                      setEditingDiscount((prev) =>
                        prev
                          ? {
                              ...prev,
                              discountValue: parseFloat(e.target.value) || 0,
                            }
                          : null
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-card-title">Discount Title</Label>
                <Input
                  id="edit-card-title"
                  value={editingDiscount.cardTitle}
                  onChange={(e) =>
                    setEditingDiscount((prev) =>
                      prev ? { ...prev, cardTitle: e.target.value } : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingDiscount.description || ""}
                  onChange={(e) =>
                    setEditingDiscount((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-terms">Terms & Conditions</Label>
                <Textarea
                  id="edit-terms"
                  value={editingDiscount.terms || ""}
                  onChange={(e) =>
                    setEditingDiscount((prev) =>
                      prev ? { ...prev, terms: e.target.value } : null
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start-date">Start Date & Time</Label>
                  <Input
                    id="edit-start-date"
                    type="datetime-local"
                    value={editingDiscount.startsAt}
                    onChange={(e) =>
                      setEditingDiscount((prev) =>
                        prev ? { ...prev, startsAt: e.target.value } : null
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-end-date">
                    End Date & Time (Optional)
                  </Label>
                  <Input
                    id="edit-end-date"
                    type="datetime-local"
                    value={editingDiscount.endsAt || ""}
                    onChange={(e) =>
                      setEditingDiscount((prev) =>
                        prev ? { ...prev, endsAt: e.target.value } : null
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingDiscount(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateDiscount}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary and Filters */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Total Discounts:</span>
              <span className="font-semibold ml-1">{totalDiscounts}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Showing:</span>
              <span className="font-semibold ml-1">{discounts.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>
      </div>

      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading discounts...</p>
            </div>
          ) : discounts.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No discounts created
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first discount to boost sales
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Discount
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {discounts.map((discount) => (
                <Card key={discount.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">
                            {discount.cardTitle}
                          </h4>
                          <Badge variant={getStatusColor(discount) as any}>
                            {getStatusText(discount)}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          Product: {discount.product.name} -{" "}
                          {discount.product.brandName}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            {discount.discountType === "percentage" ? (
                              <Percent className="h-3 w-3" />
                            ) : (
                              <IndianRupee className="h-3 w-3" />
                            )}
                            <span className="font-medium">
                              {discount.discountValue}
                              {discount.discountType === "percentage"
                                ? "%"
                                : "₹"}{" "}
                              off
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Price:
                            </span>
                            <span className="line-through text-muted-foreground ml-1">
                              ₹{discount.originalPrice}
                            </span>
                            <span className="font-medium text-primary ml-1">
                              ₹{discount.discountedPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(discount.startsAt).toLocaleDateString()}
                            </span>
                          </div>
                          {discount.endsAt && (
                            <div>
                              <span className="text-muted-foreground">
                                Ends:
                              </span>
                              <span className="ml-1">
                                {new Date(discount.endsAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {discount.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {discount.description}
                          </p>
                        )}

                        {discount.terms && (
                          <p className="text-xs text-muted-foreground">
                            T&C: {discount.terms}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(discount)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountManagement;
