import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PincodeManager, VendorPincode, PincodeDetails } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface PincodeManagementProps {
  vendorId: string;
}

const PincodeManagement = ({ vendorId }: PincodeManagementProps) => {
  const { t } = useTranslation();
  const [vendorPincode, setVendorPincode] = useState<VendorPincode | null>(
    null
  );
  const [availablePincodes, setAvailablePincodes] = useState<PincodeDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVendorPincode();
    loadAvailablePincodes();
  }, []);

  const loadVendorPincode = async () => {
    try {
      setIsLoading(true);
      const pincode = await PincodeManager.getVendorPincode();
      setVendorPincode(pincode);
    } catch (error) {
      console.error("Error loading vendor pincode:", error);
      // If no pincode is assigned, this is expected
      setVendorPincode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailablePincodes = async () => {
    try {
      const { pincodes } = await PincodeManager.getAvailablePincodes();
      setAvailablePincodes(pincodes);
    } catch (error) {
      console.error("Error loading available pincodes:", error);
      toast({
        title: t("pincode_management_extended.error_loading_pincodes"),
        description: t("pincode_management_extended.error_loading_pincodes"),
        variant: "destructive",
      });
    }
  };

  const validatePincode = (pincode: string): boolean => {
    // Must be exactly 6 digits
    if (!/^\d{6}$/.test(pincode)) {
      toast({
        title: t("pincode_management_extended.invalid_pincode"),
        description: t("pincode_management_extended.pincode_6_digits"),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddPincode = async () => {
    if (!selectedPincode) {
      toast({
        title: t("discount_management_extended.missing_information"),
        description: t("pincode_management_extended.select_pincode"),
        variant: "destructive",
      });
      return;
    }

    if (!validatePincode(selectedPincode)) {
      return;
    }

    try {
      setIsCreating(true);
      const newVendorPincode = await PincodeManager.createVendorPincode(
        selectedPincode
      );
      setVendorPincode(newVendorPincode);
      setSelectedPincode("");
      setIsAdding(false);

      toast({
        title: t("pincode_management_extended.pincode_assigned"),
        description: t("pincode_management_extended.pincode_assigned_desc", {
          pincode: selectedPincode,
        }),
      });

      // Reload available pincodes to update the list
      await loadAvailablePincodes();
    } catch (error) {
      console.error("Error creating vendor pincode:", error);
      toast({
        title: t("pincode_management_extended.failed_assign_pincode"),
        description:
          error instanceof Error
            ? error.message
            : t("common.try_again_support"),
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemovePincode = async () => {
    if (!vendorPincode) return;

    try {
      // Note: According to business rules, pincodes cannot be deleted once assigned
      // This would require a separate API endpoint for deletion if needed
      toast({
        title: "Cannot remove pincode",
        description:
          "Pincodes cannot be removed once assigned. Please contact support if you need to change your service area.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Failed to remove pincode",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const getSelectedPincodeDetails = (): PincodeDetails | undefined => {
    return availablePincodes.find((p) => p.pincode === selectedPincode);
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading service area...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Service Area</h3>
              <p className="text-sm text-muted-foreground">
                Manage your delivery pincode
              </p>
            </div>
          </div>
          {!vendorPincode && (
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Pincode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Service Pincode</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pincode-select">Select Pincode</Label>
                    <Select
                      value={selectedPincode}
                      onValueChange={setSelectedPincode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a pincode" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePincodes.map((pincode) => (
                          <SelectItem
                            key={pincode.pincode}
                            value={pincode.pincode}
                          >
                            {pincode.pincode} - {pincode.city}, {pincode.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPincode && getSelectedPincodeDetails() && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          Pincode Details
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">City:</span>{" "}
                          {getSelectedPincodeDetails()?.city}
                        </p>
                        <p>
                          <span className="font-medium">State:</span>{" "}
                          {getSelectedPincodeDetails()?.state}
                        </p>
                        <p>
                          <span className="font-medium">Coordinates:</span>{" "}
                          {getSelectedPincodeDetails()?.lat},{" "}
                          {getSelectedPincodeDetails()?.lng}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddPincode}
                      disabled={!selectedPincode || isCreating}
                    >
                      {isCreating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Assign Pincode
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!vendorPincode ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No service area assigned
              </h3>
              <p className="text-muted-foreground mb-4">
                Assign a pincode to start delivering in that area
              </p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Assign Your First Pincode
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-muted/30 gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-xl break-words">
                        {vendorPincode.pincode}
                      </span>
                      <Badge
                        variant="default"
                        className="bg-success hover:bg-success/80 flex-shrink-0"
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">
                      {vendorPincode.pincodeDetails.city},{" "}
                      {vendorPincode.pincodeDetails.state}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Coordinates: {vendorPincode.pincodeDetails.lat},{" "}
                      {vendorPincode.pincodeDetails.lng}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePincode}
                    className="text-destructive hover:text-destructive"
                    disabled
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Important Notice
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Once a pincode is assigned, it cannot be changed or removed.
                  This ensures consistent service delivery to your customers.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PincodeManagement;
