"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { login, user, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect already logged-in users only on login page
  useEffect(() => {
    if (!loading && mounted && user && pathname === "/auth/login") {
      if (user.role === "admin") router.push("/admin/dashboard");
      else if (user.role === "staff") router.push("/staff/dashboard");
      else router.push("/dashboard");
    }
  }, [user, loading, router, pathname, mounted]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingForm(true);

    try {
      const loggedInUser = await login(form.email, form.password);

      if (loggedInUser?.role === "admin") router.push("/admin/dashboard");
      else if (loggedInUser?.role === "staff") router.push("/staff/dashboard");
      else router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoadingForm(false);
    }
  };

  if (!mounted) return null; // prevents SSR mismatch

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-blue-400">Login</h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={loadingForm}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg shadow-md hover:shadow-blue-500/40 transition"
        >
          {loadingForm ? "Logging in..." : "Login"}
        </Button>

        <p className="text-gray-400 text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            className="text-orange-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </main>
  );
}
