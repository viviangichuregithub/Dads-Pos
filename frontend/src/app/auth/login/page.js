"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { login, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted && user && pathname === "/auth/login") {
      if (user.role === "admin") router.push("/admin/dashboard");
      else if (user.role === "staff") router.push("/staff/dashboard_staff");
      else router.push("/dashboard");
    }
  }, [user, loading, router, pathname, mounted]);

  if (!mounted) return null;

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(""); 
    try {
      const loggedInUser = await login(values.email, values.password);
      if (loggedInUser?.role === "admin") router.push("/admin/dashboard");
      else if (loggedInUser?.role === "staff") router.push("/staff/dashboard");
      else router.push("/dashboard");
    } catch (err) {
      setStatus(err.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
            <h1 className="text-3xl font-bold text-center text-blue-400">Login</h1>

            {status && (
              <p className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm text-center">
                {status}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg shadow-md hover:shadow-blue-500/40 transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-gray-400 text-sm text-center">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/auth/register")}
                className="text-orange-400 cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </main>
  );
}
