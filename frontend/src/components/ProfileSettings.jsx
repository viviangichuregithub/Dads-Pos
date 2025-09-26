"use client";

import { useState } from "react";
import { User, Upload, Save, Phone, UserCircle2, Key, Eye, EyeOff } from "lucide-react";

export default function ProfileSettings({ profile, setProfile, updateProfile, updatePassword }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    updatePassword(passwords)
      .then((msg) => setPasswordSuccess(msg || "Password updated successfully"))
      .catch((err) => setPasswordError(err || "Failed to update password"));

    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <section className="bg-gray-900 p-8 rounded-2xl shadow-xl space-y-8 border border-gray-800 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <User className="w-6 h-6 text-orange-400" />
        <h2 className="text-2xl font-bold text-orange-400">Profile Settings</h2>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="relative">
          <img
            src={profile.avatar || "/avatar.png"}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-1 rounded-full cursor-pointer">
            <Upload className="w-4 h-4 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile({ ...profile, avatar: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-300 font-medium text-lg">{profile.name || "Your Name"}</p>
          <p className="text-gray-500 text-sm">{profile.email || "you@example.com"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-gray-100 transition"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-gray-100 transition"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={profile.phone_number || ""}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 bg-transparent outline-none text-gray-100"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Gender</label>
        <div className="flex items-center gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={profile.gender === g}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="text-orange-500 focus:ring-orange-500"
              />
              <UserCircle2
                className={`w-4 h-4 ${g === "Male" ? "text-blue-400" : g === "Female" ? "text-pink-400" : "text-purple-400"}`}
              />
              {g}
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={updateProfile}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-medium transition"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
      <div className="mt-6 border-t border-gray-800 pt-4">
        <button
          className="w-full flex justify-between items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          <span>Change Password</span>
          <span className={`transform transition-transform ${showPasswordForm ? "rotate-180" : "rotate-0"}`}>▼</span>
        </button>
        {showPasswordForm && (
          <div className="mt-4 space-y-4 max-w-md mx-auto">
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}

            {["current", "new", "confirm"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={
                    field === "current" ? (showCurrent ? "text" : "password") :
                    field === "new" ? (showNew ? "text" : "password") :
                    showConfirm ? "text" : "password"
                  }
                  name={field}
                  placeholder={
                    field === "current" ? "Current Password" :
                    field === "new" ? "New Password" : "Confirm New Password"
                  }
                  value={passwords[field]}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-gray-100 pr-10"
                />
                <span
                  onClick={() =>
                    field === "current"
                      ? setShowCurrent(!showCurrent)
                      : field === "new"
                      ? setShowNew(!showNew)
                      : setShowConfirm(!showConfirm)
                  }
                  className="absolute right-3 top-2 cursor-pointer text-gray-400 hover:text-white"
                >
                  {field === "current" ? (showCurrent ? <EyeOff size={20} /> : <Eye size={20} />)
                  : field === "new" ? (showNew ? <EyeOff size={20} /> : <Eye size={20} />)
                  : showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={handlePasswordSubmit}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg text-white font-medium transition"
              >
                <Save className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
