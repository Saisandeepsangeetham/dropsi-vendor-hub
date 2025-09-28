import { useState, useEffect } from "react";
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
    Type,
    Languages,
    Minus,
    Plus,
    LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useNavigate } from "react-router-dom";

const TopNavbar = () => {
    const { vendor, logout } = useAuth();
    const { language, setLanguage, t } = useTranslation();
    const navigate = useNavigate();
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [isChangingFont, setIsChangingFont] = useState(false);
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);

    const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
        setIsChangingFont(true);
        setFontSize(size);
        // Apply font size to document
        const root = document.documentElement;
        root.style.fontSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px';

        // Reset animation after delay
        setTimeout(() => {
            setIsChangingFont(false);
        }, 600);
    };

    const handleLanguageToggle = () => {
        setIsChangingLanguage(true);
        setShowTranslation(true);

        // Show translation effect
        setTimeout(() => {
            setLanguage(prev => prev === 'en' ? 'ta' : 'en');
        }, 300);

        // Reset animations after delay
        setTimeout(() => {
            setShowTranslation(false);
            setIsChangingLanguage(false);
        }, 800);
    };

    const handleProfileClick = () => {
        navigate('/vendor/profile');
    };

    const handleLogout = async () => {
        await logout();
    };

    // Load font size preference from localStorage on component mount
    useEffect(() => {
        const savedFontSize = localStorage.getItem('vendor-font-size') as 'small' | 'medium' | 'large';
        if (savedFontSize) {
            setFontSize(savedFontSize);
            handleFontSizeChange(savedFontSize);
        }
    }, []);

    // Save font size preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('vendor-font-size', fontSize);
    }, [fontSize]);

    if (!vendor) return null;

    return (
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#50a2f4] to-[#3b82f6] text-white shadow-xl backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 lg:py-4">
                {/* Left side - Brand/Title (visible on larger screens) */}
                <div className="hidden md:flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                            <img
                                src="/android-chrome-512x512.png"
                                alt="DropSi"
                                className="w-7 h-7 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">{t('navbar.dropSiPartner')}</h1>
                            <p className="text-xs text-blue-100 font-medium">{t('navbar.vendorDashboard')}</p>
                        </div>
                    </div>
                </div>

                {/* Mobile logo (visible on small screens) */}
                <div className="md:hidden flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                        <img
                            src="/android-chrome-512x512.png"
                            alt="DropSi"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                </div>

                {/* Right side - Controls */}
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                    {/* Font Size Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const sizes = ['small', 'medium', 'large'] as const;
                            const currentIndex = sizes.indexOf(fontSize);
                            const nextIndex = (currentIndex + 1) % sizes.length;
                            handleFontSizeChange(sizes[nextIndex]);
                        }}
                        disabled={isChangingFont}
                        className={`h-8 w-12 p-0 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-bold ${isChangingFont
                            ? 'bg-green-400/30 scale-110 border-green-300/50 animate-pulse'
                            : 'bg-white/10 border border-white/20'
                            }`}
                    >
                        <span className={`transition-all duration-300 ${isChangingFont ? 'animate-bounce' : ''}`}>
                            {fontSize === 'small' ? 'A-' : fontSize === 'medium' ? 'A' : 'A+'}
                        </span>
                    </Button>

                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLanguageToggle}
                        disabled={isChangingLanguage}
                        className={`h-8 w-20 p-0 text-white hover:bg-white/20 rounded-lg transition-all duration-500 font-bold relative overflow-hidden ${isChangingLanguage
                            ? 'bg-gradient-to-r from-purple-400/40 to-pink-400/40 border-purple-300/50 scale-105'
                            : 'bg-white/10 border border-white/20'
                            }`}
                    >
                        <div className={`absolute inset-0 transition-all duration-500 ${isChangingLanguage ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse' : ''
                            }`} />

                        {/* Translation Animation */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                            {showTranslation ? (
                                <div className="flex flex-col items-center">
                                    <span className={`text-xs transition-all duration-300 ${showTranslation ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
                                        }`}>
                                        {language === 'en' ? 'English' : 'தமிழ்'}
                                    </span>
                                    <span className={`text-xs transition-all duration-300 ${showTranslation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                        }`}>
                                        {language === 'en' ? 'தமிழ்' : 'English'}
                                    </span>
                                </div>
                            ) : (
                                <span className="transition-all duration-300">
                                    {language === 'en' ? 'English' : 'தமிழ்'}
                                </span>
                            )}
                        </div>
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-2 sm:px-3 py-2 border border-white/20 shadow-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-white/30 shadow-md">
                                <AvatarImage src={undefined} alt={vendor.displayName} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-sm">
                                    {vendor.displayName?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-semibold leading-none">{vendor.displayName}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-sm animate-pulse"></div>
                                    <span className="text-xs text-blue-100 font-medium">{t('navbar.vendor')}</span>
                                </div>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-white hover:bg-white/20 hover:scale-105 rounded-lg transition-all shadow-sm"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{vendor.displayName}</p>
                                    <p className="text-xs text-gray-500">{t('navbar.vendor')}</p>
                                </div>
                                <DropdownMenuItem
                                    onClick={handleProfileClick}
                                    className="cursor-pointer hover:bg-gray-50 rounded-lg mx-1 my-1 px-3 py-2"
                                >
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 focus:text-red-700 cursor-pointer hover:bg-red-50 rounded-lg mx-1 mb-1 px-3 py-2"
                                >
                                    <LogOut className="h-4 w-4 mr-2" /> {t('navbar.signOut')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TopNavbar;
