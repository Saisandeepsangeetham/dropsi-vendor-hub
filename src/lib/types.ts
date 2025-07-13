// Base types for API responses
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

// Discount types
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

// Pincode types
export interface PincodeDetails {
  pincode: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface VendorPincode {
  vendorId: string;
  pincode: string;
  pincodeDetails: PincodeDetails;
}

export interface CreateVendorPincodeRequest {
  pincode: string;
}

export interface VendorPincodeResponse {
  success: boolean;
  message: string;
  vendorPincode: VendorPincode;
}

export interface AvailablePincodesResponse {
  success: boolean;
  message: string;
  totalAvailable: number;
  pincodes: PincodeDetails[];
} 