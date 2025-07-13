import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, Building, Phone, Mail, MapPin, FileText, Truck, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VendorProfileProps {
  vendor: any;
  onUpdate: (updates: any) => void;
}

const VendorProfile = ({ vendor, onUpdate }: VendorProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    legal_name: vendor.legal_name || "",
    display_name: vendor.display_name || "",
    phone: vendor.phone || "",
    email: vendor.email || "",
    address: vendor.address || "",
    gst_in: vendor.gst_in || "",
    supports_own_delivery: vendor.supports_own_delivery || false
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // TODO: Replace with actual Supabase update
      // const { error } = await supabase
      //   .from('vendors')
      //   .update(editForm)
      //   .eq('id', vendor.id);

      onUpdate(editForm);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your vendor profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Vendor Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your business information</p>
            </div>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Vendor Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-legal-name">Legal Business Name</Label>
                    <Input
                      id="edit-legal-name"
                      value={editForm.legal_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, legal_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-display-name">Display Name</Label>
                    <Input
                      id="edit-display-name"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-gst-in">GSTIN</Label>
                  <Input
                    id="edit-gst-in"
                    value={editForm.gst_in}
                    onChange={(e) => setEditForm(prev => ({ ...prev, gst_in: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">Business Address</Label>
                  <Input
                    id="edit-address"
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.supports_own_delivery}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, supports_own_delivery: checked }))}
                  />
                  <Label className="text-sm">
                    I provide my own delivery service
                  </Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  <p className="text-sm text-muted-foreground">Legal Business Name</p>
                  <p className="font-semibold">{vendor.legal_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  <p className="font-semibold">{vendor.display_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">GSTIN</p>
                  <p className="font-semibold font-mono">{vendor.gst_in}</p>
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
                  <p className="font-semibold">{vendor.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Business Address</p>
                  <p className="font-semibold">{vendor.address}</p>
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
                    {vendor.supports_own_delivery 
                      ? "You handle your own deliveries"
                      : "DropSi assigns delivery partners"
                    }
                  </p>
                </div>
              </div>
              <Badge variant={vendor.supports_own_delivery ? "default" : "secondary"}>
                {vendor.supports_own_delivery ? "Self Delivery" : "DropSi Delivery"}
              </Badge>
            </div>
          </div>

          {/* Account Status */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Account Status</p>
                <p className="text-sm text-muted-foreground">Active since {new Date(vendor.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant="default" className="bg-success text-success-foreground">
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