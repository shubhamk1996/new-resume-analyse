'use client';

/**
 * Real Google Identity Services (GSI) & Official Google OAuth 2.0 Client Utility
 */

export interface GoogleAuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

/**
 * Loads the official Google Identity Services library from accounts.google.com
 */
export function loadGoogleGsiScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).google?.accounts?.id) return resolve(true);

    const existing = document.getElementById('google-gsi-client');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Safely decodes Google's returned JWT ID token
 */
export function decodeGoogleJwt(token: string): {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  email: string;
  email_verified: boolean;
} | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode Google JWT:', e);
    return null;
  }
}

/**
 * Triggers authentic Google OAuth 2.0 popup
 */
export function triggerGoogleOAuth(callbackUrl: string = '/dashboard') {
  // Direct redirect or popup to Google Auth API
  window.location.href = `/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
