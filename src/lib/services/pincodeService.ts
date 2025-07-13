import { API_BASE_URL, handleApiResponse, snakeToCamel, getAuthToken } from '../utils';
import { 
  VendorPincode, 
  VendorPincodeResponse, 
  AvailablePincodesResponse, 
  PincodeDetails 
} from '../types';

// API class for pincode management
export class PincodeAPI {
  static async createVendorPincode(pincode: string): Promise<VendorPincodeResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/pincodes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pincode }),
    });

    const data = await handleApiResponse<VendorPincodeResponse>(response);
    
    return {
      ...data,
      vendorPincode: snakeToCamel(data.vendorPincode),
    };
  }

  static async getVendorPincode(): Promise<VendorPincodeResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/pincodes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<VendorPincodeResponse>(response);
    
    return {
      ...data,
      vendorPincode: snakeToCamel(data.vendorPincode),
    };
  }

  static async getAvailablePincodes(): Promise<AvailablePincodesResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/v1/vendor/pincodes/available`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleApiResponse<AvailablePincodesResponse>(response);
    
    return {
      ...data,
      pincodes: data.pincodes.map(snakeToCamel),
    };
  }
}

// Pincode management class
export class PincodeManager {
  static async createVendorPincode(pincode: string): Promise<VendorPincode> {
    try {
      const response = await PincodeAPI.createVendorPincode(pincode);
      return response.vendorPincode;
    } catch (error) {
      throw error;
    }
  }

  static async getVendorPincode(): Promise<VendorPincode> {
    try {
      const response = await PincodeAPI.getVendorPincode();
      return response.vendorPincode;
    } catch (error) {
      throw error;
    }
  }

  static async getAvailablePincodes(): Promise<{
    totalAvailable: number;
    pincodes: PincodeDetails[];
  }> {
    try {
      const response = await PincodeAPI.getAvailablePincodes();
      return {
        totalAvailable: response.totalAvailable,
        pincodes: response.pincodes,
      };
    } catch (error) {
      throw error;
    }
  }
} 