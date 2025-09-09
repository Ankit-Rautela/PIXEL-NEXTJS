'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("Password123!");
  const params = useSearchParams();
  const error = params.get("error");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", { email, password, redirect: true, callbackUrl: "/orders" });
  }

  return (
    <div className="max-w-md mx-auto card mt-10">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      {error && <p className="text-red-600 mb-2 text-sm">Authentication failed. Try again.</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        </div>
        <button className="btn btn-secondary w-full" type="submit">Sign in</button>
        <p className="text-xs text-zinc-500">Try manager@example.com or user@example.com with password Password123!</p>
      </form>
    </div>
  );
}
