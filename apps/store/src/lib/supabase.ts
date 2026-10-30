import { createClient, type SupportedStorage } from "@supabase/supabase-js";

const REMEMBER_KEY = "weaveui-auth-remember";

function remembered() {
  return localStorage.getItem(REMEMBER_KEY) !== "0";
}

/** PKCE verifiers must survive a new tab from the email client. */
function isPkceKey(key: string) {
  return key.includes("code-verifier");
}

/** Called before sign-in so the session lands in localStorage or sessionStorage. */
export function setRememberSession(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
}

const authStorage: SupportedStorage = {
  getItem(key) {
    if (isPkceKey(key)) {
      return localStorage.getItem(key) ?? sessionStorage.getItem(key);
    }
    return (remembered() ? localStorage : sessionStorage).getItem(key);
  },
  setItem(key, value) {
    if (isPkceKey(key)) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
      return;
    }
    const target = remembered() ? localStorage : sessionStorage;
    const other = remembered() ? sessionStorage : localStorage;
    other.removeItem(key);
    target.setItem(key, value);
  },
  removeItem(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: authStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          flowType: "pkce",
        },
      })
    : null;

export function authRedirect(path: string) {
  return `${window.location.origin}${path}`;
}
