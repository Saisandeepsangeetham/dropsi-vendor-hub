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
