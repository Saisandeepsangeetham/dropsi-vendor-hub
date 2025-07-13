import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Package, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VendorAuthProps {
  onAuthenticated: (vendor: any) => void;
}

const VendorAuth = ({ onAuthenticated }: VendorAuthProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    legalName: "",
    displayName: "",
    phone: "",
    gstIn: "",
    address: ""
  });
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: loginForm.email,
      //   password: loginForm.password,
      // });

      // Mock authentication for demo
      setTimeout(() => {
        const mockVendor = {
          id: "vendor-1",
          email: loginForm.email,
          legal_name: "Test Vendor Legal Name",
          display_name: "Test Vendor",
          phone: "+91 9876543210",
          gst_in: "22AAAAA0000A1Z5",
          address: "123 Business Street, City, State - 123456",
          supports_own_delivery: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        onAuthenticated(mockVendor);
        toast({
          title: "Login successful",
          description: "Welcome to your vendor dashboard!",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase auth and vendor creation
      // const { data, error } = await supabase.auth.signUp({
      //   email: signupForm.email,
      //   password: signupForm.password,
      // });

      // if (data.user) {
      //   const { error: vendorError } = await supabase
      //     .from('vendors')
      //     .insert([{
      //       id: data.user.id,
      //       email: signupForm.email,
      //       legal_name: signupForm.legalName,
      //       display_name: signupForm.displayName,
      //       phone: signupForm.phone,
      //       gstin: signupForm.gstin,
      //       address: signupForm.address,
      //       delivery_capability: true
      //     }]);
      // }

      // Mock signup for demo
      setTimeout(() => {
        const mockVendor = {
          id: "vendor-new",
          email: signupForm.email,
          legal_name: signupForm.legalName,
          display_name: signupForm.displayName,
          phone: signupForm.phone,
          gst_in: signupForm.gstIn,
          address: signupForm.address,
          supports_own_delivery: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        onAuthenticated(mockVendor);
        toast({
          title: "Account created successfully",
          description: "Welcome to DropSi vendor portal!",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img 
                src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png" 
                alt="DropSi Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">DropSi Vendor</h1>
          <p className="text-muted-foreground mt-2">Join India's fastest growing grocery delivery platform</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="vendor@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="legal-name">Legal Name</Label>
                      <Input
                        id="legal-name"
                        placeholder="Legal business name"
                        value={signupForm.legalName}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, legalName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        placeholder="Store display name"
                        value={signupForm.displayName}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, displayName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="vendor@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+91 9876543210"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gst-in">GSTIN</Label>
                      <Input
                        id="gst-in"
                        placeholder="22AAAAA0000A1Z5"
                        value={signupForm.gstIn}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, gstIn: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      placeholder="Complete business address"
                      value={signupForm.address}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-card rounded-lg shadow-card">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Product Catalog</h3>
            <p className="text-xs text-muted-foreground">Choose from 1000+ products</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow-card">
            <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Delivery Support</h3>
            <p className="text-xs text-muted-foreground">We handle logistics for you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAuth;