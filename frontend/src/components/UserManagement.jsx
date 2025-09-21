"use client";

import { useState } from "react";
import { UserPlus, Trash2, Users, Eye, EyeOff, Phone } from "lucide-react";

export default function UserManagement({ users, newUser, setNewUser, addUser, deleteUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  // Validate inputs before adding user
  const handleAddUser = () => {
    if (!newUser.name) {
      alert("Full name is required.");
      return;
    }
    if (!newUser.email) {
      alert("Email is required.");
      return;
    }
    if (!newUser.phone) {
      alert("Phone number is required.");
      return;
    }
    if (!newUser.password) {
      alert("Password is required.");
      return;
    }
    if (newUser.role === "admin" && !newUser.admin_secret) {
      alert("Admin secret key is required to create an admin.");
      return;
    }

    addUser();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      {/* Users List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200">Existing Users</h3>
        </div>
        <ul className="divide-y divide-gray-800">
          {users.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">No users found</li>
          )}
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition"
            >
              <div>
                <p className="font-medium text-gray-100">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-400">{user.phone}</p>
                <span className="text-xs text-blue-400 font-semibold uppercase">{user.role}</span>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Add User Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-gray-200">Add New User</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.name || ""}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={newUser.email || ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Phone Number */}
          <div className="relative w-full">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newUser.phone || ""}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="w-full pl-10 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={newUser.password || ""}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Role */}
          <select
            value={newUser.role || "staff"}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          {/* Admin Secret Key */}
          {newUser.role === "admin" && (
            <div className="relative w-full">
              <input
                type={showAdminSecret ? "text" : "password"}
                placeholder="Admin Secret Key"
                value={newUser.admin_secret || ""}
                onChange={(e) => setNewUser({ ...newUser, admin_secret: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAdminSecret(!showAdminSecret)}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-200"
              >
                {showAdminSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-medium transition"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}
