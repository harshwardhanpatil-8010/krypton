"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ui/particlebackground";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-krypton-900/20">
      <ParticleBackground />
      <div className="bg-krypton-400/20 p-8 rounded-xl shadow-lg w-96">
      
        <h2 className="text-white text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleRegister}>
          <input type="username"
          placeholder="Username"
          className="w-full p-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required />
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
            Register
          </button>
          <p className="text-white text-center mt-4">
          Already have an account <a href="/login" className="text-emerald-400">Login</a>
          </p>

        </form>
      </div>
    </div>
  );
}
