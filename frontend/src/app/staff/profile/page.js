"use client";

import { useState, useEffect } from "react";
import StaffNavbar from "@/components/StaffNavbar";
import { toast } from "react-hot-toast";
import { Settings } from "lucide-react";
import ProfileSettings from "../../../components/ProfileSettings";
import api from "../../../lib/api";

export default function StaffProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    gender: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.data.user) {
          setProfile(res.data.user);
        } else {
          toast.error("You are not logged in");
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const updateProfile = async () => {
    try {
      const res = await api.patch("/users/me", profile, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      const msg = err.response?.data?.error || "Failed to update profile";
      toast.error(msg);
    }
  };
  const updatePassword = async ({ current, new: newPassword }) => {
    try {
      const res = await api.patch(
        "/users/me/password",
        { current, new: newPassword },
        { withCredentials: true }
      );
      if (res.status === 200) return "Password updated successfully!";
      throw new Error("Failed to update password");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update password";
      throw new Error(msg);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <StaffNavbar />
      <main className="p-6 md:p-10">
        <h1 className="text-3xl font-bold text-blue-500 mb-6 flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-400" /> Profile
        </h1>
        <div className="flex gap-4 border-b border-gray-700 mb-6 overflow-x-auto">
          <button
            className={`pb-2 ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-400"
                : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>
        {activeTab === "profile" && (
          <ProfileSettings
            profile={profile}
            setProfile={setProfile}
            updateProfile={updateProfile}
            updatePassword={updatePassword}
          />
        )}
      </main>
    </div>
  );
}
