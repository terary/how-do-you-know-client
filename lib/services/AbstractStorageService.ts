export interface IStorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class SessionStorageService implements IStorageService {
  getItem(key: string): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  }
}

export class CookieStorageService implements IStorageService {
  getItem(key: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  setItem(key: string, value: string): void {
    if (typeof document === "undefined") return;
    // In production, you'd add secure flags: Secure; SameSite=Strict
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/`;
  }

  removeItem(key: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
}

// Create a factory to get the appropriate storage service based on environment
export const createStorageService = (): IStorageService => {
  if (process.env.NODE_ENV === "development") {
    return new SessionStorageService();
  }
  return new CookieStorageService();
};

// Export a singleton instance
export const storageService = createStorageService();
