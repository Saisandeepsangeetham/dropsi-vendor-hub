import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthManager, Vendor, ProductManager } from "@/lib/api";

interface AuthContextType {
  vendor: Vendor | null;
  isLoading: boolean;
  isNewVendor: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (vendorData: {
    legalName: string;
    displayName: string;
    email: string;
    password: string;
    phone?: string;
    gstin?: string;
    address?: string;
    supportsOwnDelivery?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Vendor>) => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewVendor, setIsNewVendor] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentVendor = await AuthManager.getCurrentVendor();
        if (currentVendor) {
          setVendor(currentVendor);
          
          // Check if vendor has products - if not, they need onboarding
          try {
            const vendorProducts = await ProductManager.getVendorProducts();
            setIsNewVendor(vendorProducts.length === 0);
          } catch (error) {
            // If we can't fetch products, assume they need onboarding
            setIsNewVendor(true);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const vendorData = await AuthManager.login(email, password);
      setVendor(vendorData);
      
      // Check if vendor has products - if not, they need onboarding
      try {
        const vendorProducts = await ProductManager.getVendorProducts();
        setIsNewVendor(vendorProducts.length === 0);
      } catch (error) {
        // If we can't fetch products, assume they need onboarding
        setIsNewVendor(true);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (vendorData: {
    legalName: string;
    displayName: string;
    email: string;
    password: string;
    phone?: string;
    gstin?: string;
    address?: string;
    supportsOwnDelivery?: boolean;
  }) => {
    try {
      setIsLoading(true);
      const newVendor = await AuthManager.register(vendorData);
      setVendor(newVendor);
      setIsNewVendor(true); // New vendor just signed up
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthManager.logout();
      setVendor(null);
      setIsNewVendor(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates: Partial<Vendor>) => {
    try {
      const updatedVendor = await AuthManager.updateVendorProfile(updates);
      setVendor(updatedVendor);
    } catch (error) {
      throw error;
    }
  };

  const completeOnboarding = () => {
    setIsNewVendor(false);
  };

  const value = {
    vendor,
    isLoading,
    isNewVendor,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 