import { API_BASE_URL, handleApiResponse, getAuthToken, setAuthToken, setStoredVendor, removeAuthToken, removeStoredVendor, getStoredVendor } from '../utils';
import { AuthResponse, ProfileResponse, UpdateProfileResponse, Vendor } from '../types';

// API class for vendor authentication
export class VendorAuthAPI {
  static async register(vendorData: {
    legalName: string;
    displayName: string;
    email: string;
    password: string;
    phone?: string;
    gstin?: string;
    address?: string;
    supportsOwnDelivery?: boolean;
  }): Promise<AuthResponse> {
    // Convert camelCase to snake_case for backend
    const backendData = {
      legal_name: vendorData.legalName,
      display_name: vendorData.displayName,
      email: vendorData.email,
      password: vendorData.password,
      phone: vendorData.phone,
      gst_in: vendorData.gstin,
      address: vendorData.address,
      supports_own_delivery: vendorData.supportsOwnDelivery || false,
    };

    const response = await fetch(`${API_BASE_URL}/v1/vendor/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    return handleApiResponse<AuthResponse>(response);
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/vendor/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return handleApiResponse<AuthResponse>(response);
  }

  static async getProfile(): Promise<ProfileResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleApiResponse<ProfileResponse>(response);
  }

  static async updateProfile(updates: Partial<{
    legalName: string;
    displayName: string;
    email: string;
    phone: string;
    gstin: string;
    address: string;
    supportsOwnDelivery: boolean;
  }>): Promise<UpdateProfileResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Convert camelCase to snake_case for backend
    const backendUpdates: any = {};
    if (updates.legalName !== undefined) backendUpdates.legal_name = updates.legalName;
    if (updates.displayName !== undefined) backendUpdates.display_name = updates.displayName;
    if (updates.email !== undefined) backendUpdates.email = updates.email;
    if (updates.phone !== undefined) backendUpdates.phone = updates.phone;
    if (updates.gstin !== undefined) backendUpdates.gst_in = updates.gstin;
    if (updates.address !== undefined) backendUpdates.address = updates.address;
    if (updates.supportsOwnDelivery !== undefined) backendUpdates.supports_own_delivery = updates.supportsOwnDelivery;

    const response = await fetch(`${API_BASE_URL}/v1/vendor/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendUpdates),
    });

    return handleApiResponse<UpdateProfileResponse>(response);
  }

  static async verifyToken(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/vendor/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Authentication management class
export class AuthManager {
  static async login(email: string, password: string): Promise<Vendor> {
    try {
      const response = await VendorAuthAPI.login({ email, password });
      setAuthToken(response.token);
      setStoredVendor(response.vendor);
      return response.vendor;
    } catch (error) {
      throw error;
    }
  }

  static async register(vendorData: {
    legalName: string;
    displayName: string;
    email: string;
    password: string;
    phone?: string;
    gstin?: string;
    address?: string;
    supportsOwnDelivery?: boolean;
  }): Promise<Vendor> {
    try {
      const response = await VendorAuthAPI.register(vendorData);
      setAuthToken(response.token);
      setStoredVendor(response.vendor);
      return response.vendor;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    removeAuthToken();
    removeStoredVendor();
  }

  static async getCurrentVendor(): Promise<Vendor | null> {
    try {
      const isTokenValid = await VendorAuthAPI.verifyToken();
      if (!isTokenValid) {
        this.logout();
        return null;
      }

      const response = await VendorAuthAPI.getProfile();
      setStoredVendor(response.vendor);
      return response.vendor;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  static async updateVendorProfile(updates: Partial<Vendor>): Promise<Vendor> {
    try {
      const response = await VendorAuthAPI.updateProfile(updates);
      setStoredVendor(response.vendor);
      return response.vendor;
    } catch (error) {
      throw error;
    }
  }

  static isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  static getStoredVendor(): Vendor | null {
    return getStoredVendor();
  }
} 