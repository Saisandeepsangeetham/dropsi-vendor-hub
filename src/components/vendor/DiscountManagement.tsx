import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tag, Plus, Edit, Trash2, Calendar, Percent, IndianRupee, Save } from "lucide-react";
import { VendorProduct, Discount } from "@/pages/VendorDashboard";
import { useToast } from "@/hooks/use-toast";

interface DiscountManagementProps {
  vendorProducts: VendorProduct[];
}

const DiscountManagement = ({ vendorProducts }: DiscountManagementProps) => {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: "disc-1",
      vendor_product_id: "vp-1",
      discount_type: "percentage",
      discount_value: 10,
      discounted_price: 90,
      card_title: "Weekend Special",
      description: "Get 10% off on organic bananas this weekend",
      terms: "Valid till stocks last. Cannot be combined with other offers.",
      starts_at: "2024-01-15T00:00:00Z",
      ends_at: "2024-01-17T23:59:59Z",
      is_active: true
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    discount_type: "percentage",
    discount_value: 0,
    discounted_price: 0,
    card_title: "",
    description: "",
    terms: "",
    starts_at: "",
    ends_at: "",
    is_active: true
  });
  const { toast } = useToast();

  const calculateDiscountedPrice = (originalPrice: number, discountType: "percentage" | "flat", discountValue: number) => {
    if (discountType === "percentage") {
      return originalPrice - (originalPrice * discountValue / 100);
    } else {
      return originalPrice - discountValue;
    }
  };

  const handleCreateDiscount = async () => {
    if (!newDiscount.vendor_product_id || !newDiscount.card_title || !newDiscount.discount_value) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual Supabase insert
      // const { error } = await supabase
      //   .from('discounts')
      //   .insert([newDiscount]);

      const vendorProduct = vendorProducts.find(vp => vp.id === newDiscount.vendor_product_id);
      if (vendorProduct) {
        const discountedPrice = calculateDiscountedPrice(
          vendorProduct.price,
          newDiscount.discount_type as "percentage" | "flat",
          newDiscount.discount_value!
        );

        const discount: Discount = {
          id: `disc-${Date.now()}`,
          vendor_product_id: newDiscount.vendor_product_id!,
          discount_type: newDiscount.discount_type as "percentage" | "flat",
          discount_value: newDiscount.discount_value!,
          discounted_price: discountedPrice,
          card_title: newDiscount.card_title!,
          description: newDiscount.description || "",
          terms: newDiscount.terms || "",
          starts_at: newDiscount.starts_at!,
          ends_at: newDiscount.ends_at || "",
          is_active: newDiscount.is_active!
        };

        setDiscounts(prev => [...prev, discount]);
        setNewDiscount({
          discount_type: "percentage",
          discount_value: 0,
          discounted_price: 0,
          card_title: "",
          description: "",
          terms: "",
          starts_at: "",
          ends_at: "",
          is_active: true
        });
        setIsCreating(false);

        toast({
          title: "Discount created",
          description: "Discount has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to create discount",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('discounts')
      //   .delete()
      //   .eq('id', discountId);

      setDiscounts(prev => prev.filter(d => d.id !== discountId));

      toast({
        title: "Discount deleted",
        description: "Discount has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete discount",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const getVendorProductName = (vendorProductId: string) => {
    const vendorProduct = vendorProducts.find(vp => vp.id === vendorProductId);
    return vendorProduct ? vendorProduct.product.name : "Unknown Product";
  };

  const getStatusColor = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.starts_at);
    const endDate = discount.ends_at ? new Date(discount.ends_at) : null;

    if (!discount.is_active) return "secondary";
    if (now < startDate) return "warning";
    if (endDate && now > endDate) return "destructive";
    return "default";
  };

  const getStatusText = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.starts_at);
    const endDate = discount.ends_at ? new Date(discount.ends_at) : null;

    if (!discount.is_active) return "Inactive";
    if (now < startDate) return "Scheduled";
    if (endDate && now > endDate) return "Expired";
    return "Active";
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
              <h3 className="text-xl font-semibold">Discount Management</h3>
              <p className="text-sm text-muted-foreground">Create and manage product discounts</p>
            </div>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Discount</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-select">Select Product</Label>
                  <Select onValueChange={(value) => setNewDiscount(prev => ({ ...prev, vendor_product_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-type">Discount Type</Label>
                    <Select 
                      value={newDiscount.discount_type} 
                      onValueChange={(value: "percentage" | "flat") => setNewDiscount(prev => ({ ...prev, discount_type: value }))}
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
                    <Label htmlFor="discount-value">
                      Discount Value {newDiscount.discount_type === "percentage" ? "(%)" : "(₹)"}
                    </Label>
                    <Input
                      id="discount-value"
                      type="number"
                      step="0.01"
                      value={newDiscount.discount_value || ""}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-title">Discount Title</Label>
                  <Input
                    id="card-title"
                    placeholder="e.g., Weekend Special, Flash Sale"
                    value={newDiscount.card_title || ""}
                    onChange={(e) => setNewDiscount(prev => ({ ...prev, card_title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the discount offer"
                    value={newDiscount.description || ""}
                    onChange={(e) => setNewDiscount(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter terms and conditions"
                    value={newDiscount.terms || ""}
                    onChange={(e) => setNewDiscount(prev => ({ ...prev, terms: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date & Time</Label>
                    <Input
                      id="start-date"
                      type="datetime-local"
                      value={newDiscount.starts_at || ""}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, starts_at: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date & Time (Optional)</Label>
                    <Input
                      id="end-date"
                      type="datetime-local"
                      value={newDiscount.ends_at || ""}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, ends_at: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDiscount}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Discount
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discounts.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No discounts created</h3>
              <p className="text-muted-foreground mb-4">Create your first discount to boost sales</p>
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
                          <h4 className="font-semibold">{discount.card_title}</h4>
                          <Badge variant={getStatusColor(discount) as any}>
                            {getStatusText(discount)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          Product: {getVendorProductName(discount.vendor_product_id)}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            {discount.discount_type === "percentage" ? (
                              <Percent className="h-3 w-3" />
                            ) : (
                              <IndianRupee className="h-3 w-3" />
                            )}
                            <span className="font-medium">
                              {discount.discount_value}{discount.discount_type === "percentage" ? "%" : "₹"} off
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Final Price:</span>
                            <span className="font-medium ml-1">₹{discount.discounted_price}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(discount.starts_at).toLocaleDateString()}</span>
                          </div>
                          {discount.ends_at && (
                            <div>
                              <span className="text-muted-foreground">Ends:</span>
                              <span className="ml-1">{new Date(discount.ends_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {discount.description && (
                          <p className="text-sm text-muted-foreground mb-2">{discount.description}</p>
                        )}
                        
                        {discount.terms && (
                          <p className="text-xs text-muted-foreground">T&C: {discount.terms}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
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