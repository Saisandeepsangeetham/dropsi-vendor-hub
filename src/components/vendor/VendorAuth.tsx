import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Package,
  Truck,
  Mail,
  Lock,
  BarChart3,
  Clock,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Iridescence from "@/Backgrounds/Iridescence/Iridescence";
import { useTranslation } from "react-i18next";

const VendorAuth = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    legalName: "",
    displayName: "",
    phone: "",
    gstin: "",
    address: "",
    supportsOwnDelivery: false,
  });

  const { toast } = useToast();
  const { login, register, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(loginForm.email, loginForm.password);
      toast({
        title: t("vendor_auth.login_successful"),
        description: t("vendor_auth.welcome_dashboard"),
      });
    } catch (error) {
      toast({
        title: t("vendor_auth.login_failed"),
        description:
          error instanceof Error
            ? error.message
            : t("vendor_auth.check_credentials"),
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({
        legalName: signupForm.legalName,
        displayName: signupForm.displayName,
        email: signupForm.email,
        password: signupForm.password,
        phone: signupForm.phone || undefined,
        gstin: signupForm.gstin || undefined,
        address: signupForm.address || undefined,
        supportsOwnDelivery: signupForm.supportsOwnDelivery,
      });

      toast({
        title: t("vendor_auth.account_created"),
        description: t("vendor_auth.welcome_portal"),
      });
    } catch (error) {
      toast({
        title: t("vendor_auth.signup_failed"),
        description:
          error instanceof Error
            ? error.message
            : t("vendor_auth.try_again_support"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Hero Section (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#5CB8FF] text-white p-12 space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png"
            alt="DropSi Logo"
            className="w-16 h-16 object-cover rounded-full"
          />
          <h1 className="text-4xl font-extrabold">
            {t("vendor_auth.partner_with_dropsi")}
          </h1>
        </div>
        <p className="text-lg max-w-md leading-relaxed text-center">
          {t("vendor_auth.grow_business_desc")}
        </p>
        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {/* Card 1 - Product Catalog */}
          <div className="relative h-48 perspective-1000">
            <div
              className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${
                flippedCard === 0 ? "rotate-y-180" : ""
              }`}
              onMouseEnter={() => setFlippedCard(0)}
            >
              <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden">
                <div className="flex justify-center mb-2">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  {t("vendor_auth.standardized_catalog")}
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  {t("vendor_auth.access_thousands")}
                </p>
              </Card>
              <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden rotate-y-180">
                <div className="flex justify-center mb-2">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  {t("vendor_auth.easy_inventory")}
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  {t("vendor_auth.update_prices")}
                </p>
              </Card>
            </div>
          </div>

          {/* Card 2 - Delivery Options */}
          <div className="relative h-48 perspective-1000">
            <div
              className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${
                flippedCard === 1 ? "rotate-y-180" : ""
              }`}
              onMouseEnter={() => setFlippedCard(1)}
            >
              <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden">
                <div className="flex justify-center mb-2">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  {t("vendor_auth.flexible_delivery")}
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  {t("vendor_auth.choose_delivery")}
                </p>
              </Card>
              <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden rotate-y-180">
                <div className="flex justify-center mb-2">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  {t("vendor_auth.realtime_tracking")}
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  {t("vendor_auth.monitor_deliveries")}
                </p>
              </Card>
            </div>
          </div>

          {/* Card 3 - Analytics */}
          <div className="relative h-48 perspective-1000">
            <div
              className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${
                flippedCard === 2 ? "rotate-y-180" : ""
              }`}
              onMouseEnter={() => setFlippedCard(2)}
            >
              <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden">
                <div className="flex justify-center mb-2">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  Performance Analytics
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  Gain insights with detailed sales and customer reports.
                </p>
              </Card>
              <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden rotate-y-180">
                <div className="flex justify-center mb-2">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  Growth Metrics
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  Track your business growth with comprehensive dashboards.
                </p>
              </Card>
            </div>
          </div>

          {/* Card 4 - Payments */}
          <div className="relative h-48 perspective-1000">
            <div
              className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${
                flippedCard === 3 ? "rotate-y-180" : ""
              }`}
              onMouseEnter={() => setFlippedCard(3)}
            >
              <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden">
                <div className="flex justify-center mb-2">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  Seamless Payments
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  Get paid quickly with automated payment processing.
                </p>
              </Card>
              <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 absolute w-full h-full backface-hidden rotate-y-180">
                <div className="flex justify-center mb-2">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-white line-clamp-2">
                  Financial Reports
                </h3>
                <p className="text-sm text-white opacity-90 mt-2 line-clamp-2">
                  Download detailed statements for accounting purposes.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="flex items-center justify-center p-6 relative">
        <div className="absolute inset-0">
          <Iridescence
            color={[1, 1, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={1.0}
          />
        </div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground">
              {t("vendor_auth.welcome_back")}
            </h2>
            <p className="text-muted-foreground">
              {t("vendor_auth.sign_in_create")}
            </p>
          </div>

          <Card className="shadow-card backdrop-blur-sm/10 border border-white/20 bg-white/70">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {t("vendor_auth.get_started")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t("common.login")}</TabsTrigger>
                  <TabsTrigger value="signup">{t("common.signup")}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="vendor@example.com"
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          required
                          disabled={isLoading}
                          className="pl-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t("vendor_auth.signing_in")
                        : t("vendor_auth.sign_in")}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="legal-name">
                          {t("vendor_auth.legal_name")}
                        </Label>
                        <Input
                          id="legal-name"
                          placeholder={t("vendor_auth.legal_business_name")}
                          value={signupForm.legalName}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              legalName: e.target.value,
                            }))
                          }
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display-name">
                          {t("vendor_auth.display_name")}
                        </Label>
                        <Input
                          id="display-name"
                          placeholder={t("vendor_auth.store_display_name")}
                          value={signupForm.displayName}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              displayName: e.target.value,
                            }))
                          }
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="vendor@example.com"
                          value={signupForm.email}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signupForm.password}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          required
                          disabled={isLoading}
                          className="pl-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+91 9876543210"
                          value={signupForm.phone}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input
                          id="gstin"
                          placeholder="22AAAAA0000A1Z5"
                          value={signupForm.gstin}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              gstin: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Business Street, City, State - 123456"
                        value={signupForm.address}
                        onChange={(e) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="supports-delivery"
                        checked={signupForm.supportsOwnDelivery}
                        onChange={(e) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            supportsOwnDelivery: e.target.checked,
                          }))
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="supports-delivery" className="text-sm">
                        I provide my own delivery service
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t("vendor_auth.creating_account")
                        : t("vendor_auth.create_account")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorAuth;
