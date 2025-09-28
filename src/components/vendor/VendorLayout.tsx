import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    ShoppingCart,
    Package,
    Tag,
    MapPin,
    BarChart3,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { cn } from "@/lib/utils";
import TopNavbar from "./TopNavbar";

const VendorLayout = () => {
    const { vendor, logout } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            id: 'overview',
            name: t('nav.fullCart'),
            href: '/vendor',
            icon: ShoppingCart
        },
        {
            id: 'catalog',
            name: t('nav.productCatalog'),
            href: '/catalog',
            icon: Package
        },
        {
            id: 'discounts',
            name: t('nav.discounts'),
            href: '/vendor/discounts',
            icon: Tag
        },
        {
            id: 'areas',
            name: t('nav.serviceAreas'),
            href: '/vendor/areas',
            icon: MapPin
        },
        {
            id: 'performance',
            name: t('nav.performance'),
            href: '/vendor/performance',
            icon: BarChart3
        }
    ];

    const handleLogout = async () => {
        await logout();
    };

    const handleNavigation = (href: string) => {
        navigate(href);
        setSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    return (
        <div className="min-h-screen bg-gradient-card flex flex-col">
            {/* Top Navbar */}
            <TopNavbar />

            <div className="flex flex-1">
                {/* Mobile Menu Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="fixed top-16 left-4 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={cn(
                    "w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0 lg:static lg:z-auto",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "fixed lg:fixed z-50 h-full"
                )}>
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-center">
                        <div
                            className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                            onClick={() => navigate('/')}
                        >
                            <img
                                src="/android-chrome-512x512.png"
                                alt="DropSi Logo"
                                className="w-14 h-14 object-contain"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.href)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                                        isActive
                                            ? "bg-[#5CB8FF] text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto lg:ml-64">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default VendorLayout;
