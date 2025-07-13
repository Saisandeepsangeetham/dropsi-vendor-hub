import { API_BASE_URL, handleApiResponse, snakeToCamel, getAuthToken } from '../utils';
import { 
  ProductsResponse, 
  VendorProductsResponse, 
  BulkAddProductsRequest, 
  BulkAddProductsResponse, 
  VendorProduct 
} from '../types';

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

// Product management class
export class ProductManager {
  static async getAllProducts() {
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