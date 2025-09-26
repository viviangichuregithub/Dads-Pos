"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import AdminNavbar from "../../../components/AdminNavbar";
import { toast } from "react-hot-toast";
import { Settings } from "lucide-react";
import ProfileSettings from "../../../components/ProfileSettings";
import UserManagement from "../../../components/UserManagement";
import InventoryAudit from "../../../components/InventoryAudit";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  useEffect(() => {
    fetchProfile();
    fetchUsers();
  }, []);
  const fetchProfile = async () => {
    try {
      const res = await api.get("/settings/profile");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };
  const updateProfile = async () => {
    try {
      await api.put("/settings/profile", profile);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await api.get("/settings/users");
      setUsers(res.data);
    } catch {
    }
  };
  const addUser = async () => {
    try {
      await api.post("/settings/users", newUser);
      toast.success("User added!");
      setNewUser({ name: "", email: "", password: "", role: "staff" });
      fetchUsers();
    } catch {
      toast.error("Failed to add user");
    }
  };
  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/settings/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />
      <main className="p-6 md:p-10">
        <h1 className="text-3xl font-bold text-blue-500 mb-6 flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-400" /> Settings
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
          <button
            className={`pb-2 ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-400"
                : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`pb-2 ${
              activeTab === "audit"
                ? "border-b-2 border-blue-500 text-blue-400"
                : ""
            }`}
            onClick={() => setActiveTab("audit")}
          >
            Inventory Audit
          </button>
        </div>
        {activeTab === "profile" && (
          <ProfileSettings
            profile={profile}
            setProfile={setProfile}
            updateProfile={updateProfile}
          />
        )}
        {activeTab === "users" && (
          <UserManagement
            users={users}
            newUser={newUser}
            setNewUser={setNewUser}
            addUser={addUser}
            deleteUser={deleteUser}
          />
        )}
        {activeTab === "audit" && <InventoryAudit />}
      </main>
    </div>
  );
}
