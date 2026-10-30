import * as React from "react";

export interface AuthState {
  ready: boolean;
  loggedIn: boolean;
  linkError: boolean;
  clearLinkError: () => void;
  logOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthState>({
  ready: true,
  loggedIn: false,
  linkError: false,
  clearLinkError: () => {},
  logOut: async () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}
