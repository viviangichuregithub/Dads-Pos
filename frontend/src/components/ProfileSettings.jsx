"use client";

import { User, Upload, Save, Phone, UserCircle2 } from "lucide-react";

export default function ProfileSettings({ profile, setProfile, updateProfile }) {
  return (
    <section className="bg-gray-900 p-6 rounded-2xl shadow-xl space-y-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <User className="w-6 h-6 text-orange-400" />
        <h2 className="text-2xl font-bold text-orange-400">Profile Settings</h2>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover"
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
        <div>
          <p className="text-gray-300 font-medium">{profile.name || "Your Name"}</p>
          <p className="text-gray-500 text-sm">{profile.email || "you@example.com"}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-gray-100"
          />
        </div>

        {/* Phone Number */}
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

        {/* Gender */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Gender</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={profile.gender === "Male"}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="text-orange-500 focus:ring-orange-500"
              />
              <UserCircle2 className="w-4 h-4 text-blue-400" /> Male
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={profile.gender === "Female"}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="text-orange-500 focus:ring-orange-500"
              />
              <UserCircle2 className="w-4 h-4 text-pink-400" /> Female
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={profile.gender === "Other"}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="text-orange-500 focus:ring-orange-500"
              />
              <UserCircle2 className="w-4 h-4 text-purple-400" /> Other
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={updateProfile}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-medium transition"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </section>
  );
}
