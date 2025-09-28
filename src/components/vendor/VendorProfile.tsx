import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Edit,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  Truck,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import React from "react";

const VendorProfile = () => {
  const { t } = useTranslation();
  const { vendor, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    legalName: vendor?.legalName || "",
    displayName: vendor?.displayName || "",
    phone: vendor?.phone || "",
    email: vendor?.email || "",
    address: vendor?.address || "",
    gstin: vendor?.gstin || "",
    supportsOwnDelivery: vendor?.supportsOwnDelivery || false,
  });
  const { toast } = useToast();

  // Update edit form when vendor data changes
  React.useEffect(() => {
    if (vendor) {
      setEditForm({
        legalName: vendor.legalName || "",
        displayName: vendor.displayName || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        address: vendor.address || "",
        gstin: vendor.gstin || "",
        supportsOwnDelivery: vendor.supportsOwnDelivery || false,
      });
    }
  }, [vendor]);

  const handleSave = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast({
        title: t("vendor_profile.profile_updated"),
        description: t("vendor_profile.profile_updated"),
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!vendor) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No vendor data available</p>
      </div>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {t("vendor_profile.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your business information
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Legal Business Name
                  </p>
                  <p className="font-semibold">{vendor.legalName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  <p className="font-semibold">{vendor.displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">GSTIN</p>
                  <p className="font-semibold font-mono">
                    {vendor.gstin || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{vendor.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">
                    {vendor.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Business Address
                  </p>
                  <p className="font-semibold">
                    {vendor.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Capability */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Delivery Service</p>
                  <p className="text-sm text-muted-foreground">
                    {vendor.supportsOwnDelivery
                      ? "You handle your own deliveries"
                      : "DropSi assigns delivery partners"}
                  </p>
                </div>
              </div>
              <Badge
                variant={vendor.supportsOwnDelivery ? "default" : "secondary"}
              >
                {vendor.supportsOwnDelivery
                  ? "Self Delivery"
                  : "DropSi Delivery"}
              </Badge>
            </div>
          </div>

          {/* Account Status */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Account Status</p>
                <p className="text-sm text-muted-foreground">
                  Active since {new Date(vendor.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge
                variant="default"
                className="bg-success text-success-foreground"
              >
                Active
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorProfile;
