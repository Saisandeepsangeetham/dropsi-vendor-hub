import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to convert text to title case
export function toTitleCase(text: string): string {
  if (!text) return text;
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Handle special cases like "agave", "syrup", etc.
      if (word.length <= 3) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Utility function to convert snake_case to camelCase
export function snakeToCamel(obj: any): any {
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
export async function handleApiResponse<T>(response: Response): Promise<T> {
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
export function getStoredVendor(): any {
  const vendorData = localStorage.getItem('dropsi_vendor_data');
  return vendorData ? JSON.parse(vendorData) : null;
}

// Set stored vendor data
export function setStoredVendor(vendor: any): void {
  localStorage.setItem('dropsi_vendor_data', JSON.stringify(vendor));
}

// Remove stored vendor data
export function removeStoredVendor(): void {
  localStorage.removeItem('dropsi_vendor_data');
}

export { API_BASE_URL };
