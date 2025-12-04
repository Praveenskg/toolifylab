import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting
export function formatCurrency(amount: number, currency = "INR", locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

// Number formatting
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Percentage formatting
export function formatPercentage(value: number, decimals = 2): string {
  return `${formatNumber(value, decimals)}%`;
}

// Date formatting
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

// Input validation
export function validateNumber(value: string): boolean {
  return !isNaN(Number(value)) && Number(value) >= 0;
}

export function validatePercentage(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= 0 && num <= 100;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage utilities with enhanced error handling
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    const parsed = JSON.parse(item);
    return parsed;
  } catch {
    // If parsing fails, remove the corrupted data and return default
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.code === 22) {
      // Quota exceeded - try to clear some space
      try {
        // Clear old data if possible
        const keys = Object.keys(window.localStorage);
        if (keys.length > 0) {
          window.localStorage.removeItem(keys[0]);
          window.localStorage.setItem(key, JSON.stringify(value));
          return true;
        }
      } catch {
        // If clearing doesn't work, return false
      }
    }
    return false;
  }
}

export function removeFromStorage(key: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// Check if localStorage is available and working
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch {
    // Failed to copy text
    return false;
  }
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Calculate age
export function calculateAge(
  birthDate: Date,
  targetDate: Date = new Date()
): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor(
    (targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { years, months, days, totalDays };
}

// Calculate EMI
export function calculateEMI(
  principal: number,
  rate: number,
  tenure: number
): {
  emi: number;
  totalInterest: number;
  totalPayment: number;
} {
  const monthlyRate = rate / 100 / 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;

  return {
    emi: parseFloat(emi.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
  };
}
