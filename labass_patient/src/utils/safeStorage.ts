/**
 * Safe localStorage wrapper that handles Safari private browsing mode,
 * mobile browser issues, and other edge cases where localStorage might not be available.
 */

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  }
};

/**
 * Helper to get the auth token safely
 */
export const getAuthToken = (): string | null => {
  return safeLocalStorage.getItem('labass_token');
};
