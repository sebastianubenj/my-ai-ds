import type { AuthError } from "@supabase/supabase-js";

import { authRedirect, setRememberSession, supabase } from "@/lib/supabase";

export type RegisterAuthResult = "network" | "confirm-email" | "signed-in";
export type LoginAuthResult =
  | "network"
  | "invalid-credentials"
  | "email-not-confirmed"
  | "signed-in";
export type ForgotAuthResult =
  | "network"
  | "sent"
  | {
      type: "wait";
      seconds?: number;
    };
export type ResetAuthResult = "network" | "updated";
export type ConfirmEmailAuthResult =
  | "network"
  | "sent"
  | {
      type: "wait";
      seconds?: number;
    };

function isNetwork(error: AuthError) {
  return (
    error.name === "AuthRetryableFetchError" ||
    error.status === 0 ||
    /failed to fetch|network|load failed/i.test(error.message)
  );
}

function isRateLimit(error: AuthError) {
  return (
    error.code === "over_email_send_rate_limit" ||
    error.code === "over_request_rate_limit" ||
    /rate limit|only request this after/i.test(error.message)
  );
}

export function readAuthLinkError() {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return search.get("error_code") ?? hash.get("error_code") ?? search.get("error") ?? hash.get("error");
}

export function readAuthCode() {
  return new URLSearchParams(window.location.search).get("code");
}

function stripAuthCode() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  const search = url.searchParams.toString();
  window.history.replaceState({}, "", `${url.pathname}${search ? `?${search}` : ""}`);
}

let authCallbackExchange: Promise<"ok" | "expired" | "none"> | null = null;
let authCallbackCode: string | null = null;

/**
 * Exchanges the email-link code once. Shared across StrictMode remounts so the
 * one-time code is not consumed twice. `detectSessionInUrl` stays off.
 */
export async function consumeAuthCallback(): Promise<"ok" | "expired" | "none"> {
  if (!supabase) return "none";
  if (readAuthLinkError()) return "expired";

  const code = readAuthCode();
  if (!code) return authCallbackExchange ?? "none";

  if (authCallbackExchange && authCallbackCode === code) return authCallbackExchange;

  authCallbackCode = code;
  authCallbackExchange = (async () => {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    stripAuthCode();
    if (!error) return "ok";

    const { data } = await supabase.auth.getSession();
    return data.session ? "ok" : "expired";
  })();

  return authCallbackExchange;
}

export async function registerAccount(values: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterAuthResult> {
  if (!supabase) return "network";

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: { full_name: values.name },
      emailRedirectTo: authRedirect("/login"),
    },
  });

  if (error) {
    if (isNetwork(error)) return "network";
    if (error.code === "user_already_exists" || /already registered/i.test(error.message)) {
      return "confirm-email";
    }
    return "network";
  }

  if ((data.user?.identities?.length ?? 0) === 0 || !data.session) return "confirm-email";
  return "signed-in";
}

export async function signInAccount(values: {
  email: string;
  password: string;
  rememberMe: boolean;
}): Promise<LoginAuthResult> {
  if (!supabase) return "network";

  setRememberSession(values.rememberMe);
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (!error) return "signed-in";
  if (isNetwork(error)) return "network";
  if (/email not confirmed/i.test(error.message)) return "email-not-confirmed";
  return "invalid-credentials";
}

export async function requestPasswordReset(email: string): Promise<ForgotAuthResult> {
  if (!supabase) return "network";

  // A failed exchange caches "expired" for that code; a new email needs a fresh attempt.
  authCallbackExchange = null;
  authCallbackCode = null;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authRedirect("/reset-password"),
  });

  if (!error) return "sent";
  if (isRateLimit(error)) {
    const seconds = error.message.match(/after (\d+) seconds?/i);
    if (seconds) return { type: "wait", seconds: Number(seconds[1]) };
    return { type: "wait" };
  }
  if (isNetwork(error)) return "network";
  return "network";
}

export async function updatePassword(password: string): Promise<ResetAuthResult> {
  if (!supabase) return "network";

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return "network";

  // Do not sign out here: ResetPasswordRoute treats a mid-submit logout as an
  // expired recovery link and navigates away from /password-updated.
  return "updated";
}

export async function resendConfirmationEmail(
  email: string,
): Promise<ConfirmEmailAuthResult> {
  if (!supabase) return "network";

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: authRedirect("/login"),
    },
  });

  if (!error) return "sent";
  if (isRateLimit(error)) {
    const seconds = error.message.match(/after (\d+) seconds?/i);
    if (seconds) return { type: "wait", seconds: Number(seconds[1]) };
    return { type: "wait" };
  }
  if (isNetwork(error)) return "network";
  return "network";
}

export async function signOutAccount() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
