import { Navigate, Route, Routes } from "react-router-dom";

import { ExpiredLink } from "@/views/expired-link/expired-link";
import { ForgotPassword } from "@/views/forgot-password/forgot-password";
import { Home } from "@/views/home/home";
import { Login } from "@/views/login/login";
import { PasswordUpdated } from "@/views/password-updated/password-updated";
import { Register } from "@/views/register/register";
import { ResetPassword } from "@/views/reset-password/reset-password";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <Login
            logoHref="/"
            forgotPasswordHref="/forgot-password"
            signUpHref="/register"
          />
        }
      />
      <Route
        path="/register"
        element={<Register logoHref="/" loginHref="/login" />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword logoHref="/" loginHref="/login" />}
      />
      <Route
        path="/reset-password"
        element={
          <ResetPassword
            logoHref="/"
            loginHref="/login"
            forgotPasswordHref="/forgot-password"
          />
        }
      />
      <Route
        path="/password-updated"
        element={<PasswordUpdated logoHref="/" loginHref="/login" />}
      />
      <Route
        path="/expired-link"
        element={
          <ExpiredLink logoHref="/" forgotPasswordHref="/forgot-password" />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
