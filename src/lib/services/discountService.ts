import { API_BASE_URL, handleApiResponse, snakeToCamel, getAuthToken } from '../utils';
import { 
  Discount, 
  CreateDiscountRequest, 
  UpdateDiscountRequest, 
  DiscountsResponse, 
  AllDiscountsResponse, 
  DiscountResponse 
} from '../types';

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

// Discount management class
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