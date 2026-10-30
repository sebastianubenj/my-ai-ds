import * as React from "react";
import type { Session } from "@supabase/supabase-js";

import { consumeAuthCallback, readAuthCode, signOutAccount } from "@/lib/auth";
import { AuthContext } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [ready, setReady] = React.useState(supabase === null);
  const [linkError, setLinkError] = React.useState(false);

  React.useEffect(() => {
    if (!supabase) return;

    let cancelled = false;
    const code = readAuthCode();
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      // Wait for the email-link exchange before accepting the boot session.
      if (event === "INITIAL_SESSION" && code) return;
      setSession(next);
    });

    void (async () => {
      const result = await consumeAuthCallback();
      if (cancelled) return;

      if (result === "expired") {
        setLinkError(true);
        setReady(true);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(sessionData.session);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const logOut = React.useCallback(() => signOutAccount(), []);
  const clearLinkError = React.useCallback(() => setLinkError(false), []);

  const value = React.useMemo(
    () => ({
      ready,
      loggedIn: session !== null,
      linkError,
      clearLinkError,
      logOut,
    }),
    [ready, session, linkError, clearLinkError, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
