"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ParticleBackground from "@/components/ui/particlebackground";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        Cookies.set("token", data.token, { expires: 1, path: "/" }); 
        console.log("Token set in cookies:", data.token);
   
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-krypton-900/20">
      <ParticleBackground />
      <div className="bg-krypton-400/20 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-white text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-emerald-500 p-2 rounded text-white">
            Login
          </button>
          <p className="text-white text-center mt-4">
          Don't have an account? <a href="/register" className="text-emerald-400">Register</a>
            </p>

        </form>
      </div>
    </div>
  );
}