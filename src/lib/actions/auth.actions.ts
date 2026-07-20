/**
 * Client-side token management utilities (pure static exports, kept compatible).
 *
 * The token is stored in the zeraix.userInfo.auth_token field of localStorage,
 * compatible with the write format of setStorage("zeraix.userInfo", { auth_token, ...user }).
 */

import { getStorage, setStorage, removeStorage } from "@zzcpt/zztool";

const STORAGE_KEY = "zeraix.userInfo";

/**
 * Read the auth token from localStorage
 *
 * @returns The token string, or null (returns null during SSR/build)
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const data = getStorage(STORAGE_KEY);
    if (!data) return null;
    return data?.auth_token || null;
  } catch {
    return null;
  }
}

/**
 * Write the token into the zeraix.userInfo.auth_token field of localStorage
 * without overwriting the rest of the user info, compatible with setStorage writes
 *
 * @param token - JWT token
 */
export function setAuthCookie(token: string): void {
  if (typeof window === "undefined") return;
  try {
    const data = getStorage(STORAGE_KEY) || {};
    data.auth_token = token;
    // Force-clear the old cookie to ensure the new token takes effect
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.zeraix.com; Secure; SameSite=None";
    // Set the new cookie to ensure the new token takes effect
    document.cookie = `token=${`${token}`}; path=/; domain=.zeraix.com; Secure; SameSite=None`;
    setStorage(STORAGE_KEY, data);
  } catch (e) {
    console.warn("[auth] setAuthCookie failed:", e);
  }
}

/**
 * Fired on `window` right after the session is cleared.
 *
 * Sessions also end outside React — a 401 in `lib/api/request.ts`, a failed periodic refresh — and those
 * modules cannot call a hook. Without this signal they emptied localStorage while the auth store kept the
 * old `userInfo`, so the UI went on showing a signed-in user whose data was already gone.
 * SafetyRootLayout listens and resets the store; see [[authStore]].logOut.
 */
export const SESSION_CLEARED_EVENT = "zeraix:session-cleared";

/**
 * Clear the user's auth data from localStorage (called on logout and whenever the session expires).
 *
 * Always announce it: every caller wants the in-memory auth state gone too, and making that automatic
 * is what keeps storage and store from drifting apart.
 */
export function clearAuthCookie(): void {
  // if (typeof window === "undefined") return;
  removeStorage('zeraix');

  document.cookie =
    "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.zeraix.com; Secure; SameSite=None";

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
  }
}

/**
 * Check whether the user is authenticated
 *
 * @returns whether the user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Refresh the auth token (called by a client-side scheduled task)
 * Calls the backend /auth/refresh-me endpoint and, on success, updates the token in localStorage
 *
 * @returns whether the refresh succeeded
 */
export async function refreshTokenAction(): Promise<{ success: boolean }> {
  const currentToken = getAuthToken();
  if (!currentToken) return { success: false };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.warn("[refreshTokenAction] NEXT_PUBLIC_API_BASE_URL is not configured");
    return { success: false };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/refresh-me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ token: currentToken }),
    })

    const data = await response.json();

    if (data.success && data.data?.token) {
      setAuthCookie(data.data.token);
      
      return { success: true };
    }

    clearAuthCookie();
    return { success: false };
  } catch (error) {
    console.error("[refreshTokenAction] token refresh failed:", error);
    return { success: false };
  }
}
