const API_BASE_URL = 'https://api.dropsi.in';

// Types for API responses
export interface Vendor {
  id: string;
  legalName: string;
  displayName: string;
  gstin?: string;
  phone?: string;
  email?: string;
  address?: string;
  supportsOwnDelivery: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  vendor: Vendor;
}

export interface ProfileResponse {
  success: boolean;
  vendor: Vendor;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  vendor: Vendor;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  uom: string;
  imageUrl: string;
  isActive: boolean;
}

export interface VendorProduct {
  id: string;
  vendorId: string;
  productId: string;
  price: number;
  mrp: number;
  stockQty: number;
  isActive: boolean;
  deliverySupported: boolean;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
}

export interface VendorProductsResponse {
  success: boolean;
  message: string;
  vendorProducts: VendorProduct[];
}

export interface BulkAddProductsRequest {
  products: {
    productId: string;
    price: number;
    mrp: number;
    stockQty: number;
    deliverySupported: boolean;
  }[];
}

export interface BulkAddProductsResponse {
  success: boolean;
  message: string;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  results: {
    success: VendorProduct[];
    errors: any[];
  };
}

export interface Discount {
  id: string;
  vendorProductId: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountedPrice: number;
  cardTitle: string;
  description: string;
  terms: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountRequest {
  vendorProductId: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountedPrice: number;
  cardTitle: string;
  description: string;
  terms: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface UpdateDiscountRequest {
  discountType?: "percentage" | "flat";
  discountValue?: number;
  discountedPrice?: number;
  cardTitle?: string;
  description?: string;
  terms?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
}

export interface DiscountsResponse {
  success: boolean;
  message: string;
  discounts: Discount[];
}

export interface AllDiscountsResponse {
  success: boolean;
  message: string;
  totalDiscounts: number;
  discounts: (Discount & {
    originalPrice: number;
    product: {
      name: string;
      description: string;
      imageUrl: string;
      uom: string;
      brandName: string;
    };
  })[];
}

export interface DiscountResponse {
  success: boolean;
  message: string;
  discount: Discount;
}

// Utility function to convert snake_case to camelCase
function snakeToCamel(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (typeof obj !== 'object') return obj;
  
  const camelObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelObj[camelKey] = snakeToCamel(obj[key]);
    }
  }
  return camelObj;
}

// Utility function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Get stored token
export function getAuthToken(): string | null {
  return localStorage.getItem('dropsi_vendor_token');
}

// Set stored token
export function setAuthToken(token: string): void {
  localStorage.setItem('dropsi_vendor_token', token);
}

// Remove stored token
export function removeAuthToken(): void {
  localStorage.removeItem('dropsi_vendor_token');
}

// Get stored vendor data
export function getStoredVendor(): Vendor | null {
  const vendorData = localStorage.getItem('dropsi_vendor_data');
  return vendorData ? JSON.parse(vendorData) : null;
}

// Set stored vendor data
export function setStoredVendor(vendor: Vendor): void {
  localStorage.setItem('dropsi_vendor_data', JSON.stringify(vendor));
}

// Remove stored vendor data
export function removeStoredVendor(): void {
  localStorage.removeItem('dropsi_vendor_data');
}

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

// API class for product management
export class ProductAPI {
  static async getAllProducts(): Promise<ProductsResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/vendor/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleApiResponse<ProductsResponse>(response);
  }

  static async getVendorProducts(): Promise<VendorProductsResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/vendor-products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<VendorProductsResponse>(response);
    return {
      ...data,
      vendorProducts: data.vendorProducts.map(snakeToCamel),
    };
  }

  static async bulkAddProducts(products: BulkAddProductsRequest['products']): Promise<BulkAddProductsResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/vendor-products/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    const data = await handleApiResponse<BulkAddProductsResponse>(response);
    
    return {
      ...data,
      results: {
        ...data.results,
        success: data.results.success.map(snakeToCamel),
      },
    };
  }

  static async updateVendorProduct(vendorProductId: string, updates: {
    price?: number;
    mrp?: number;
    stockQty?: number;
    isActive?: boolean;
    deliverySupported?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    vendorProduct: VendorProduct;
  }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/vendor-products/${vendorProductId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await handleApiResponse<{
      success: boolean;
      message: string;
      vendorProduct: VendorProduct;
    }>(response);
    
    return {
      ...data,
      vendorProduct: snakeToCamel(data.vendorProduct),
    };
  }

  static async deleteVendorProduct(vendorProductId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/vendor-products/${vendorProductId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleApiResponse<{
      success: boolean;
      message: string;
    }>(response);
  }
}

// API class for discount management
export class DiscountAPI {
  static async createDiscount(discountData: CreateDiscountRequest): Promise<DiscountResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    });

    const data = await handleApiResponse<DiscountResponse>(response);
    
    return {
      ...data,
      discount: snakeToCamel(data.discount),
    };
  }

  static async getDiscounts(filters?: {
    vendorProductId?: string;
    isActive?: boolean;
  }): Promise<DiscountsResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const params = new URLSearchParams();
    if (filters?.vendorProductId) params.append('vendorProductId', filters.vendorProductId);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<DiscountsResponse>(response);
    
    return {
      ...data,
      discounts: data.discounts.map(snakeToCamel),
    };
  }

  static async getAllVendorDiscounts(filters?: {
    isActive?: boolean;
  }): Promise<AllDiscountsResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts/all?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<AllDiscountsResponse>(response);
    
    return {
      ...data,
      discounts: data.discounts.map(snakeToCamel),
    };
  }

  static async getDiscount(discountId: string): Promise<DiscountResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts/${discountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<DiscountResponse>(response);
    
    return {
      ...data,
      discount: snakeToCamel(data.discount),
    };
  }

  static async updateDiscount(discountId: string, updates: UpdateDiscountRequest): Promise<DiscountResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts/${discountId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await handleApiResponse<DiscountResponse>(response);
    
    return {
      ...data,
      discount: snakeToCamel(data.discount),
    };
  }

  static async deleteDiscount(discountId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts/${discountId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleApiResponse<{
      success: boolean;
      message: string;
    }>(response);
  }

  static async toggleDiscount(discountId: string): Promise<DiscountResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/discounts/${discountId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<DiscountResponse>(response);
    
    return {
      ...data,
      discount: snakeToCamel(data.discount),
    };
  }
}

// Authentication context and hooks
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

// Product management hooks
export class ProductManager {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await ProductAPI.getAllProducts();
      return response.products;
    } catch (error) {
      throw error;
    }
  }

  static async getVendorProducts(): Promise<VendorProduct[]> {
    try {
      const response = await ProductAPI.getVendorProducts();
      console.log('Raw API response:', response); // Debug log
      return response.vendorProducts;
    } catch (error) {
      throw error;
    }
  }

  static async bulkAddProducts(products: {
    productId: string;
    price: number;
    mrp: number;
    stockQty: number;
    deliverySupported: boolean;
  }[]): Promise<BulkAddProductsResponse> {
    try {
      return await ProductAPI.bulkAddProducts(products);
    } catch (error) {
      throw error;
    }
  }

  static async updateVendorProduct(vendorProductId: string, updates: {
    price?: number;
    mrp?: number;
    stockQty?: number;
    isActive?: boolean;
    deliverySupported?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    vendorProduct: VendorProduct;
  }> {
    try {
      return await ProductAPI.updateVendorProduct(vendorProductId, updates);
    } catch (error) {
      throw error;
    }
  }

  static async deleteVendorProduct(vendorProductId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      return await ProductAPI.deleteVendorProduct(vendorProductId);
    } catch (error) {
      throw error;
    }
  }
}

// Discount management hooks
export class DiscountManager {
  static async createDiscount(discountData: CreateDiscountRequest): Promise<Discount> {
    try {
      const response = await DiscountAPI.createDiscount(discountData);
      return response.discount;
    } catch (error) {
      throw error;
    }
  }

  static async getDiscounts(filters?: {
    vendorProductId?: string;
    isActive?: boolean;
  }): Promise<Discount[]> {
    try {
      const response = await DiscountAPI.getDiscounts(filters);
      return response.discounts;
    } catch (error) {
      throw error;
    }
  }

  static async getAllVendorDiscounts(filters?: {
    isActive?: boolean;
  }): Promise<{
    totalDiscounts: number;
    discounts: (Discount & {
      originalPrice: number;
      product: {
        name: string;
        description: string;
        imageUrl: string;
        uom: string;
        brandName: string;
      };
    })[];
  }> {
    try {
      const response = await DiscountAPI.getAllVendorDiscounts(filters);
      return {
        totalDiscounts: response.totalDiscounts,
        discounts: response.discounts,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getDiscount(discountId: string): Promise<Discount> {
    try {
      const response = await DiscountAPI.getDiscount(discountId);
      return response.discount;
    } catch (error) {
      throw error;
    }
  }

  static async updateDiscount(discountId: string, updates: UpdateDiscountRequest): Promise<Discount> {
    try {
      const response = await DiscountAPI.updateDiscount(discountId, updates);
      return response.discount;
    } catch (error) {
      throw error;
    }
  }

  static async deleteDiscount(discountId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      return await DiscountAPI.deleteDiscount(discountId);
    } catch (error) {
      throw error;
    }
  }

  static async toggleDiscount(discountId: string): Promise<Discount> {
    try {
      const response = await DiscountAPI.toggleDiscount(discountId);
      return response.discount;
    } catch (error) {
      throw error;
    }
  }
} 