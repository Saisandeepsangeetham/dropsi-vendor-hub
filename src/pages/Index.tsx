import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  Users,
  BarChart3,
  CheckCircle,
  ShoppingCart,
  Store,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Wave Background */}
      <div className="relative bg-[#5CB8FF] text-white overflow-hidden pb-32">
        {/* Language Switcher in top right corner */}
        <div className="absolute top-6 right-6 z-20">
          <LanguageSwitcher />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:[grid-template-columns:1.2fr_1fr] gap-10 items-center">
            <div className="text-left lg:pr-4">
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/20 backdrop-blur-sm text-white"
              >
                {t("homepage.platform_badge")}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight hero-title">
                {t("homepage.hero_title")}{" "}
                <span className="text-blue-100">
                  {t("homepage.hero_title_highlight")}
                </span>{" "}
                {t("homepage.hero_title_end")}
              </h1>
              <p className="text-xl mb-8 text-blue-50 max-w-lg">
                {t("homepage.hero_description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 tags">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#5CB8FF] hover:bg-blue-50 text-lg px-8 rounded-full cta-btn"
                >
                  <Link to="/vendor" className="flex items-center gap-2">
                    <span className="cta-label">{t("homepage.start_vendor_btn")}</span>
                    <Store className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-white text-white hover:bg-white/20 rounded-full cta-btn"
                >
                  <Link to="/customer" className="flex items-center gap-2">
                    <span className="cta-label">{t("homepage.order_groceries_btn")}</span>
                    <ShoppingCart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-7 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="flex items-center">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {t("homepage.fast_delivery")}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {t("homepage.fresh_products")}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {t("homepage.local_vendors")}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://img.freepik.com/premium-photo/indian-family-managing-local-grocery-store-interacting-with-happy-customers_868783-50218.jpg"
                  alt="Grocery Delivery"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://www.dropsi.in/assets/images/partner.png";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-[#5CB8FF]/10 rounded-full p-3">
                    <Truck className="h-8 w-8 text-[#5CB8FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {t("homepage.fast_delivery")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("homepage.within_30_minutes")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-[#5CB8FF]/10 rounded-full p-3">
                    <Package className="h-8 w-8 text-[#5CB8FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {t("homepage.fresh_products")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("homepage.farm_to_table")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom - moved down to extend the blue background */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,197.3C960,213,1056,203,1152,170.7C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* How It Works Section - added margin-top to account for the wave overlap */}
      <div className="py-24 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-1.5 text-sm font-medium border-[#5CB8FF] bg-[#5CB8FF] text-white"
            >
              {t("homepage.how_it_works")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t("homepage.simple_process")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("homepage.process_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8 text-center relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#5CB8FF] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="w-16 h-16 bg-[#5CB8FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="h-8 w-8 text-[#5CB8FF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {t("homepage.register_vendor")}
              </h3>
              <p className="text-gray-600">
                {t("homepage.register_vendor_desc")}
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 text-center relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#5CB8FF] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="w-16 h-16 bg-[#5CB8FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-[#5CB8FF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {t("homepage.manage_products")}
              </h3>
              <p className="text-gray-600">
                {t("homepage.manage_products_desc")}
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 text-center relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#5CB8FF] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="w-16 h-16 bg-[#5CB8FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-[#5CB8FF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {t("homepage.fulfill_orders")}
              </h3>
              <p className="text-gray-600">
                {t("homepage.fulfill_orders_desc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-1.5 text-sm font-medium border-[#5CB8FF] bg-[#5CB8FF] text-white"
            >
              {t("homepage.platform_features")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t("homepage.why_choose_title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("homepage.why_choose_desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
              <div className="h-2 bg-[#5CB8FF]"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#5CB8FF]/10 rounded-full flex items-center justify-center mb-6">
                  <Package className="h-8 w-8 text-[#5CB8FF]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {t("homepage.easy_product_management")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("homepage.easy_product_desc")}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-blue-600 text-white font-medium"
                  >
                    {t("homepage.for_vendors")}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-[#5CB8FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
              <div className="h-2 bg-green-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {t("homepage.flexible_delivery")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("homepage.flexible_delivery_desc")}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-green-500 bg-green-500 text-white font-medium"
                  >
                    {t("homepage.smart_logistics")}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
              <div className="h-2 bg-amber-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {t("homepage.real_time_analytics")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("homepage.analytics_desc")}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-amber-500 bg-amber-500 text-white font-medium"
                  >
                    {t("homepage.data_driven")}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
              <div className="h-2 bg-purple-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {t("homepage.customer_management")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("homepage.customer_management_desc")}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-purple-500 bg-purple-500 text-white font-medium"
                  >
                    {t("homepage.loyalty_first")}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
              <div className="h-2 bg-red-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {t("homepage.fast_onboarding")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("homepage.fast_onboarding_desc")}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-red-500 bg-red-500 text-white font-medium"
                  >
                    {t("homepage.quick_setup")}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
              <div className="h-2 bg-blue-700"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-700/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {t("homepage.secure_payments")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("homepage.secure_payments_desc")}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-blue-700 bg-blue-700 text-white font-medium"
                  >
                    {t("homepage.trusted_secure")}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-blue-700" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <div className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-[#5CB8FF] bg-[#5CB8FF] text-white">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Our Vendors Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of vendors already using DropSi to grow their grocery business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Rahul Sharma</p>
                    <p className="text-sm text-gray-500">Fresh Grocers, Mumbai</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "DropSi has transformed our business. We've increased our customer base by 200% in just three months!"
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Priya Patel</p>
                    <p className="text-sm text-gray-500">Organic Harvest, Delhi</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The analytics dashboard gives me insights I never had before. I can now predict demand and manage inventory better."
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Vikram Singh</p>
                    <p className="text-sm text-gray-500">City Grocers, Bangalore</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The flexible delivery options allow me to focus on product quality while DropSi handles the logistics."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div> */}

      {/* Vendor CTA Section */}
      <div className="relative py-24 bg-[#5CB8FF] text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/20 backdrop-blur-sm text-white"
          >
            {t("homepage.get_started_today")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("homepage.ready_to_grow")}
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            {t("homepage.join_thousands")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#5CB8FF] hover:bg-blue-50 text-lg px-12 py-6 rounded-full"
          >
            <Link to="/vendor" className="flex items-center">
              {t("homepage.start_vendor_journey")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("homepage.free_to_start")}
              </h3>
              <p className="text-blue-100 text-sm">
                {t("homepage.free_to_start_desc")}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("homepage.quick_setup")}
              </h3>
              <p className="text-blue-100 text-sm">
                {t("homepage.quick_setup_desc")}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("homepage.support_24_7")}
              </h3>
              <p className="text-blue-100 text-sm">
                {t("homepage.support_desc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/android-chrome-512x512.png"
                  alt="DropSi Logo"
                  className="w-12 h-12 object-contain mr-2"
                />
                <span className="text-xl font-bold text-gray-900">DropSi</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {t("homepage.footer_description")}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("homepage.quick_links")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-[#5CB8FF] text-sm"
                  >
                    {t("nav.home")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features"
                    className="text-gray-600 hover:text-[#5CB8FF] text-sm"
                  >
                    {t("common.features")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendor"
                    className="text-gray-600 hover:text-[#5CB8FF] text-sm"
                  >
                    {t("homepage.for_retailers")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-[#5CB8FF] text-sm"
                  >
                    {t("homepage.about_us")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-[#5CB8FF] text-sm"
                  >
                    {t("common.contact_us")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("common.features")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-600 text-sm">
                    {t("homepage.delivery_planning")}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600 text-sm">
                    {t("homepage.real_time_tracking")}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600 text-sm">
                    {t("homepage.aezer_chatbot")}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600 text-sm">
                    {t("homepage.meal_planning")}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600 text-sm">
                    {t("homepage.discounts_offers")}
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("common.contact_us")}
              </h3>
              <address className="not-italic">
                <p className="text-gray-600 text-sm mb-2">
                  {t("homepage.company_address")}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  {t("homepage.company_phone")}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  {t("homepage.company_email")}
                </p>
              </address>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              {t("homepage.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-[#5CB8FF] text-sm"
              >
                {t("common.privacy_policy")}
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-[#5CB8FF] text-sm"
              >
                {t("common.terms_of_service")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;