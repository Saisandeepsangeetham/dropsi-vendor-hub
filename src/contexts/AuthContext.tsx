import React, { createContext, useContext, useEffect, useState } from 'react';
import { Vendor, AuthManager } from '@/lib/api';

interface AuthContextType {
  vendor: Vendor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  updateVendor: (updates: Partial<Vendor>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        const storedVendor = AuthManager.getStoredVendor();
        if (storedVendor && AuthManager.isAuthenticated()) {
          // Verify token is still valid
          const currentVendor = await AuthManager.getCurrentVendor();
          if (currentVendor) {
            setVendor(currentVendor);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthManager.logout();
      setVendor(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVendor = async (updates: Partial<Vendor>) => {
    try {
      setIsLoading(true);
      const updatedVendor = await AuthManager.updateVendorProfile(updates);
      setVendor(updatedVendor);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    vendor,
    isLoading,
    isAuthenticated: !!vendor,
    login,
    register,
    logout,
    updateVendor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 