"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const res = await signIn("credentials", {
      password,
      redirect: true,
      callbackUrl: "/",
    });

    if (res?.error) {
      setError("❌ Access Denied – Wrong password");
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🔐 Password Login</h2>
      <input
        type="password"
        value={password}
        placeholder="Enter secret password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin} style={{ marginTop: 10 }}>
        Login
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
