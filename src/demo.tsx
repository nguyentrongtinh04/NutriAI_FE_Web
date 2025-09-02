import React, { useEffect } from "react";
import { http } from "./lib/http";
import { saveTokens, type AuthTokens } from "./lib/auth";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const googleIdToken = response.credential;
      const { data } = await http.post<AuthTokens>("/google", {
        id_token: googleIdToken,
      });
      saveTokens(data);
      navigate("/home");
    } catch (err: any) {
      console.error("Google login failed:", err);
      alert("❌ Đăng nhập Google thất bại");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div id="googleBtn"></div>
    </div>
  );
}
