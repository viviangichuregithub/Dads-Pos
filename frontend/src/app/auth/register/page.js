"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import api from "../../../lib/api";
import { Eye, EyeOff } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: Yup.string().required("Phone number is required"),
    role: Yup.string().oneOf(["staff", "admin"]).required("Role is required"),
    admin_secret: Yup.string().when("role", {
      is: "admin",
      then: Yup.string().required("Admin secret is required"),
      otherwise: Yup.string(),
    }),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const payload = {
        ...values,
        admin_secret: values.role === "admin" ? values.admin_secret : "",
      };
      const res = await api.post("/auth/register", payload);
      setSuccess(res.data.message || "Registered successfully!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      setFieldError("general", msg);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone_number: "",
          password: "",
          confirm_password: "",
          role: "staff",
          admin_secret: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
            <h1 className="text-3xl font-bold text-center text-orange-400">Register</h1>
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <ErrorMessage name="general" component="p" className="text-red-500 text-sm text-center" />

            <Field
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />

            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />

            <Field
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <ErrorMessage name="phone_number" component="p" className="text-red-500 text-sm" />

            <Field
              as="select"
              name="role"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Field>
            <ErrorMessage name="role" component="p" className="text-red-500 text-sm" />

            {values.role === "admin" && (
              <>
                <Field
                  type="password"
                  name="admin_secret"
                  placeholder="Admin Secret Password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <ErrorMessage name="admin_secret" component="p" className="text-red-500 text-sm" />
              </>
            )}

            <div className="relative">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>

            <div className="relative">
              <Field
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              <ErrorMessage name="confirm_password" component="p" className="text-red-500 text-sm" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg shadow-md hover:shadow-orange-500/40 transition"
            >
              Register
            </Button>

            <p className="text-gray-400 text-sm text-center">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/auth/login")}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </main>
  );
}
