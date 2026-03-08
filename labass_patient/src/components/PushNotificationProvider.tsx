/**
 * PushNotificationProvider Component
 * Automatically manages push notification permission requests after user authentication
 */

'use client';

import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export function PushNotificationProvider({ children }: PushNotificationProviderProps) {
  const { supported, permission, requestPermission } = usePushNotifications();

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    try {
      // Check if user is authenticated (with safe localStorage access)
      let isAuthenticated: string | null = null;
      let hasRequestedPermission: string | null = null;

      try {
        isAuthenticated = localStorage.getItem('labass_token');
        hasRequestedPermission = localStorage.getItem('push_permission_requested');
      } catch (storageError) {
        console.warn('[PushNotificationProvider] localStorage not available:', storageError);
        return;
      }

      if (!isAuthenticated) {
        console.log('[PushNotificationProvider] User not authenticated, skipping permission request');
        return;
      }

      if (hasRequestedPermission === 'true') {
        console.log('[PushNotificationProvider] Permission already requested, skipping');
        return;
      }

      // Check if push is supported and permission is default
      if (!supported) {
        console.log('[PushNotificationProvider] Push notifications not supported');
        return;
      }

      if (permission === 'denied') {
        console.log('[PushNotificationProvider] Permission denied, skipping');
        try {
          localStorage.setItem('push_permission_requested', 'true');
        } catch (e) {
          console.warn('[PushNotificationProvider] Could not save to localStorage:', e);
        }
        return;
      }

      // For both 'default' (will prompt user) and 'granted' (will silently register token)
      const timeoutId = setTimeout(() => {
        console.log('[PushNotificationProvider] Requesting push notification permission...');
        requestPermission()
          .then(() => {
            // Mark as requested regardless of outcome
            try {
              localStorage.setItem('push_permission_requested', 'true');
            } catch (e) {
              console.warn('[PushNotificationProvider] Could not save to localStorage:', e);
            }
            console.log('[PushNotificationProvider] Permission request completed');
          })
          .catch((error) => {
            console.error('[PushNotificationProvider] Permission request failed:', error);
            // Still mark as requested to avoid repeated prompts
            try {
              localStorage.setItem('push_permission_requested', 'true');
            } catch (e) {
              console.warn('[PushNotificationProvider] Could not save to localStorage:', e);
            }
          });
      }, 3000); // 3 second delay

      return () => {
        clearTimeout(timeoutId);
      };
    } catch (error) {
      console.error('[PushNotificationProvider] Unexpected error in useEffect:', error);
    }
  }, [supported, permission, requestPermission]);

  // This provider doesn't render any UI, just manages permission lifecycle
  return <>{children}</>;
}
