import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import {
  registerAccount,
  requestPasswordReset,
  signInAccount,
  signOutAccount,
  updatePassword,
} from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { ExpiredLink } from "@/views/expired-link/expired-link";
import { ForgotPassword } from "@/views/forgot-password/forgot-password";
import { Home } from "@/views/home/home";
import { Login } from "@/views/login/login";
import { PasswordUpdated } from "@/views/password-updated/password-updated";
import { Register } from "@/views/register/register";
import { ResetPassword } from "@/views/reset-password/reset-password";

const EMAIL_NOT_CONFIRMED =
  "Confirm your email before signing in. Check your inbox for the confirmation link.";

function AuthLinkRedirect() {
  const { ready, linkError, clearLinkError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready || !linkError) return;
    clearLinkError();
    navigate("/expired-link", { replace: true });
  }, [ready, linkError, clearLinkError, navigate]);

  return null;
}

function LoginRoute() {
  const navigate = useNavigate();
  const { ready, loggedIn } = useAuth();
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    if (ready && loggedIn) navigate("/", { replace: true });
  }, [ready, loggedIn, navigate]);

  return (
    <Login
      logoHref="/"
      forgotPasswordHref="/forgot-password"
      signUpHref="/register"
      notice={notice}
      onSubmit={async (values) => {
        setNotice(undefined);
        const result = await signInAccount(values);
        if (result === "email-not-confirmed") {
          setNotice(EMAIL_NOT_CONFIRMED);
          return;
        }
        if (result === "signed-in") {
          navigate("/");
          return;
        }
        return result;
      }}
    />
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  const [confirmationEmail, setConfirmationEmail] = useState<string>();

  return (
    <Register
      logoHref="/"
      loginHref="/login"
      confirmationEmail={confirmationEmail}
      onSubmit={async (values) => {
        const result = await registerAccount(values);
        if (result === "confirm-email") {
          setConfirmationEmail(values.email);
          return;
        }
        if (result === "signed-in") {
          navigate("/");
          return;
        }
        return result;
      }}
    />
  );
}

function ForgotPasswordRoute() {
  return (
    <ForgotPassword
      logoHref="/"
      loginHref="/login"
      onSubmit={async ({ email }) => {
        const result = await requestPasswordReset(email);
        if (result === "sent") return;
        return result;
      }}
    />
  );
}

function ResetPasswordRoute() {
  const navigate = useNavigate();
  const { ready, loggedIn, linkError } = useAuth();
  const completingRef = useRef(false);

  useEffect(() => {
    // Wait until the email-link exchange finishes. "Not logged in yet" is not
    // the same as an expired link while that exchange is still running.
    if (!ready || linkError || completingRef.current) return;
    if (!loggedIn) navigate("/expired-link", { replace: true });
  }, [ready, loggedIn, linkError, navigate]);

  if (!ready || linkError || (!loggedIn && !completingRef.current)) return null;

  return (
    <ResetPassword
      logoHref="/"
      loginHref="/login"
      forgotPasswordHref="/forgot-password"
      onSubmit={async ({ password }) => {
        const result = await updatePassword(password);
        if (result === "updated") {
          completingRef.current = true;
          navigate("/password-updated", { replace: true });
          void signOutAccount();
          return;
        }
        return result;
      }}
    />
  );
}

export function App() {
  return (
    <>
      <AuthLinkRedirect />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
        <Route path="/reset-password" element={<ResetPasswordRoute />} />
        <Route
          path="/password-updated"
          element={<PasswordUpdated logoHref="/" loginHref="/login" />}
        />
        <Route
          path="/expired-link"
          element={<ExpiredLink logoHref="/" forgotPasswordHref="/forgot-password" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
