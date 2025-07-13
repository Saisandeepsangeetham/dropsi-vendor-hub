import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PincodeManagementProps {
  vendorId: string;
}

const PincodeManagement = ({ vendorId }: PincodeManagementProps) => {
  const [pincodes, setPincodes] = useState([
    { id: "1", pincode: "110001", area: "Connaught Place, New Delhi", is_active: true },
    { id: "2", pincode: "110002", area: "Darya Ganj, New Delhi", is_active: true },
    { id: "3", pincode: "110003", area: "Kashmere Gate, New Delhi", is_active: false },
  ]);
  const [newPincode, setNewPincode] = useState("");
  const [newArea, setNewArea] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddPincode = async () => {
    if (!newPincode || !newArea) {
      toast({
        title: "Missing information",
        description: "Please enter both pincode and area name.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual Supabase insert
      // const { error } = await supabase
      //   .from('vendor_service_pincodes')
      //   .insert([{
      //     vendor_id: vendorId,
      //     pincode: newPincode,
      //     area: newArea,
      //     is_active: true
      //   }]);

      const newEntry = {
        id: Date.now().toString(),
        pincode: newPincode,
        area: newArea,
        is_active: true
      };

      setPincodes(prev => [...prev, newEntry]);
      setNewPincode("");
      setNewArea("");
      setIsAdding(false);

      toast({
        title: "Pincode added",
        description: `${newPincode} has been added to your service areas.`,
      });
    } catch (error) {
      toast({
        title: "Failed to add pincode",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleRemovePincode = async (pincodeId: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('vendor_service_pincodes')
      //   .delete()
      //   .eq('id', pincodeId);

      setPincodes(prev => prev.filter(p => p.id !== pincodeId));

      toast({
        title: "Pincode removed",
        description: "Service area has been removed from your coverage.",
      });
    } catch (error) {
      toast({
        title: "Failed to remove pincode",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const togglePincodeStatus = async (pincodeId: string) => {
    try {
      // TODO: Replace with actual Supabase update
      // const pincode = pincodes.find(p => p.id === pincodeId);
      // const { error } = await supabase
      //   .from('vendor_service_pincodes')
      //   .update({ is_active: !pincode?.is_active })
      //   .eq('id', pincodeId);

      setPincodes(prev => 
        prev.map(p => 
          p.id === pincodeId ? { ...p, is_active: !p.is_active } : p
        )
      );

      toast({
        title: "Status updated",
        description: "Pincode service status has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "Please try again or contact support.",
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
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Service Areas</h3>
              <p className="text-sm text-muted-foreground">Manage delivery pincodes</p>
            </div>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Pincode
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Service Pincode</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-pincode">Pincode</Label>
                  <Input
                    id="new-pincode"
                    placeholder="110001"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-area">Area Name</Label>
                  <Input
                    id="new-area"
                    placeholder="Connaught Place, New Delhi"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPincode}>
                    <Save className="h-4 w-4 mr-2" />
                    Add Pincode
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pincodes.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No service areas added</h3>
              <p className="text-muted-foreground mb-4">Add pincodes where you can deliver products</p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Pincode
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {pincodes.map((pincode) => (
                <div key={pincode.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="font-mono font-semibold text-lg">{pincode.pincode}</div>
                    <div>
                      <p className="font-medium">{pincode.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={pincode.is_active ? "default" : "secondary"}
                      className={`cursor-pointer ${pincode.is_active ? "bg-success hover:bg-success/80" : ""}`}
                      onClick={() => togglePincodeStatus(pincode.id)}
                    >
                      {pincode.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePincode(pincode.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PincodeManagement;