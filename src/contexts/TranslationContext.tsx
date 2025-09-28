import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation data
const translations = {
    en: {
        // Navigation
        'nav.fullCart': 'Full Cart',
        'nav.productCatalog': 'Product Catalog',
        'nav.discounts': 'Discounts',
        'nav.serviceAreas': 'Service Areas',
        'nav.performance': 'Performance',
        'nav.profile': 'Profile',

        // Top Navbar
        'navbar.dropSiPartner': 'DropSi Partner',
        'navbar.vendorDashboard': 'Vendor Dashboard',
        'navbar.vendor': 'Vendor',
        'navbar.signOut': 'Sign out',
        'navbar.privacyPolicy': 'Privacy Policy',
        'navbar.legal': 'Legal',

        // Product Catalog
        'catalog.searchProducts': 'Search products...',
        'catalog.selectBrand': 'Select Brand',
        'catalog.selectProduct': 'Select Product',
        'catalog.addToCart': 'Add to Cart',
        'catalog.mrp': 'MRP',
        'catalog.sellingPrice': 'Selling Price',
        'catalog.stockQuantity': 'Stock Quantity',
        'catalog.addProducts': 'Add Products',
        'catalog.cancel': 'Cancel',
        'catalog.noProductsFound': 'No products found',
        'catalog.loading': 'Loading...',

        // Dashboard
        'dashboard.welcome': 'Welcome to your dashboard',
        'dashboard.totalProducts': 'Total Products',
        'dashboard.totalOrders': 'Total Orders',
        'dashboard.totalRevenue': 'Total Revenue',
        'dashboard.addMoreProducts': 'Add More Products',

        // Discounts
        'discounts.title': 'Discount Management',
        'discounts.createDiscount': 'Create Discount',
        'discounts.discountName': 'Discount Name',
        'discounts.discountPercentage': 'Discount Percentage',
        'discounts.validFrom': 'Valid From',
        'discounts.validTo': 'Valid To',
        'discounts.save': 'Save',
        'discounts.cancel': 'Cancel',

        // Service Areas
        'areas.title': 'Service Area Management',
        'areas.addPincode': 'Add Pincode',
        'areas.pincode': 'Pincode',
        'areas.areaName': 'Area Name',
        'areas.deliveryCharge': 'Delivery Charge',
        'areas.add': 'Add',

        // Performance
        'performance.title': 'Performance Analytics',
        'performance.orders': 'Orders',
        'performance.revenue': 'Revenue',
        'performance.topProducts': 'Top Products',
        'performance.lastWeek': 'Last Week',
        'performance.lastMonth': 'Last Month',
        'performance.lastQuarter': 'Last Quarter',
        'performance.lastYear': 'Last Year',

        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.clear': 'Clear',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.confirm': 'Confirm',
        'common.close': 'Close',
    },
    ta: {
        // Navigation
        'nav.fullCart': 'முழு வண்டி',
        'nav.productCatalog': 'தயாரிப்பு பட்டியல்',
        'nav.discounts': 'தள்ளுபடிகள்',
        'nav.serviceAreas': 'சேவை பகுதிகள்',
        'nav.performance': 'செயல்திறன்',
        'nav.profile': 'சுயவிவரம்',

        // Top Navbar
        'navbar.dropSiPartner': 'டிராப்சி பங்குதாரர்',
        'navbar.vendorDashboard': 'விற்பனையாளர் டாஷ்போர்டு',
        'navbar.vendor': 'விற்பனையாளர்',
        'navbar.signOut': 'வெளியேறு',
        'navbar.privacyPolicy': 'தனியுரிமைக் கொள்கை',
        'navbar.legal': 'சட்டப்பூர்வ',

        // Product Catalog
        'catalog.searchProducts': 'தயாரிப்புகளைத் தேடுங்கள்...',
        'catalog.selectBrand': 'பிராண்டைத் தேர்ந்தெடுக்கவும்',
        'catalog.selectProduct': 'தயாரிப்பைத் தேர்ந்தெடுக்கவும்',
        'catalog.addToCart': 'வண்டியில் சேர்க்கவும்',
        'catalog.mrp': 'எம்ஆர்பி',
        'catalog.sellingPrice': 'விற்பனை விலை',
        'catalog.stockQuantity': 'பங்கு அளவு',
        'catalog.addProducts': 'தயாரிப்புகளைச் சேர்க்கவும்',
        'catalog.cancel': 'ரத்து செய்',
        'catalog.noProductsFound': 'தயாரிப்புகள் எதுவும் கிடைக்கவில்லை',
        'catalog.loading': 'ஏற்றுகிறது...',

        // Dashboard
        'dashboard.welcome': 'உங்கள் டாஷ்போர்டுக்கு வரவேற்கிறோம்',
        'dashboard.totalProducts': 'மொத்த தயாரிப்புகள்',
        'dashboard.totalOrders': 'மொத்த ஆர்டர்கள்',
        'dashboard.totalRevenue': 'மொத்த வருவாய்',
        'dashboard.addMoreProducts': 'மேலும் தயாரிப்புகளைச் சேர்க்கவும்',

        // Discounts
        'discounts.title': 'தள்ளுபடி மேலாண்மை',
        'discounts.createDiscount': 'தள்ளுபடியை உருவாக்கவும்',
        'discounts.discountName': 'தள்ளுபடி பெயர்',
        'discounts.discountPercentage': 'தள்ளுபடி சதவீதம்',
        'discounts.validFrom': 'செல்லுபடியாகும் தேதி',
        'discounts.validTo': 'காலாவதி தேதி',
        'discounts.save': 'சேமி',
        'discounts.cancel': 'ரத்து செய்',

        // Service Areas
        'areas.title': 'சேவை பகுதி மேலாண்மை',
        'areas.addPincode': 'பின்கோட் சேர்க்கவும்',
        'areas.pincode': 'பின்கோட்',
        'areas.areaName': 'பகுதி பெயர்',
        'areas.deliveryCharge': 'டெலிவரி கட்டணம்',
        'areas.add': 'சேர்க்கவும்',

        // Performance
        'performance.title': 'செயல்திறன் பகுப்பாய்வு',
        'performance.orders': 'ஆர்டர்கள்',
        'performance.revenue': 'வருவாய்',
        'performance.topProducts': 'சிறந்த தயாரிப்புகள்',
        'performance.lastWeek': 'கடந்த வாரம்',
        'performance.lastMonth': 'கடந்த மாதம்',
        'performance.lastQuarter': 'கடந்த காலாண்டு',
        'performance.lastYear': 'கடந்த ஆண்டு',

        // Common
        'common.loading': 'ஏற்றுகிறது...',
        'common.error': 'பிழை',
        'common.success': 'வெற்றி',
        'common.save': 'சேமி',
        'common.cancel': 'ரத்து செய்',
        'common.delete': 'நீக்கு',
        'common.edit': 'திருத்து',
        'common.add': 'சேர்க்கவும்',
        'common.search': 'தேடு',
        'common.filter': 'வடிகட்டு',
        'common.clear': 'அழி',
        'common.yes': 'ஆம்',
        'common.no': 'இல்லை',
        'common.confirm': 'உறுதிப்படுத்து',
        'common.close': 'மூடு',
    }
};

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('vendor-language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ta')) {
            setLanguage(savedLanguage);
        }
    }, []);

    // Save language preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('vendor-language', language);
    }, [language]);

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations[typeof language]] || key;
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};
