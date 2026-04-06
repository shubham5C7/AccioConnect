import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../features/userSlice";

export default function EditProfileModal({ user, closeModal, refreshUser }) {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role: user?.role || "",
    isPlaced: user?.isPlaced || false,
    organizationName: user?.organizationName || "",
    profilePicture: user?.profilePicture || "",
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      // Remove password if empty
      if (!payload.password) delete payload.password;
      await dispatch(updateUserProfile(payload)).unwrap();
      refreshUser();
      closeModal();
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
        isDark ? "bg-black/70" : "bg-black/55"
      }`}
    >
      <div
        className={`w-full max-w-[460px] rounded-[20px] border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #6741d9 100%)" }}
          className="px-7 py-5 flex-shrink-0"
        >
          <h2 className="text-[18px] font-medium text-white m-0 mb-1">
            Edit your profile
          </h2>
          <p className="text-[13px] text-white/70 m-0">
            Update your details and save changes
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Avatar Upload */}
          <div
            className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
              isDark ? "border-gray-700" : "border-gray-200"
            } ${isDragging ? "border-blue-500 bg-gray-100" : ""}`}
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileRead(file);
            }}
          >
            <div className="w-[64px] h-[64px] rounded-full border-[3px] border-blue-200 p-0.5">
              <img
                src={
                  formData.profilePicture ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-gray-100"
              />
            </div>
            <p className={`text-[13px] m-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Drag & drop or{" "}
              <span className="text-blue-600 font-medium">click to upload</span>
            </p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileRead(file);
              }}
            />
          </div>

          {/* Name Row */}
          <div className="flex gap-3">
            {["firstName", "lastName"].map((name) => (
              <div key={name} className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  {name === "firstName" ? "First Name" : "Last Name"}
                </label>
                <input
                  className={`px-3.5 py-2.5 rounded-[10px] text-[14px] outline-none w-full transition-all ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/30"
                      : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={name === "firstName" ? "First name" : "Last name"}
                />
              </div>
            ))}
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Role
            </label>
            <input
              className={`px-3.5 py-2.5 rounded-[10px] text-[14px] outline-none w-full transition-all ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/30"
                  : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100"
              }`}
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          {/* Placement Toggle */}
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  formData.isPlaced ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              <div>
                <p className={`text-[14px] font-medium m-0 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                  Placement status
                </p>
                <p className={`text-[12px] m-0 text-gray-400`}>
                  {formData.isPlaced ? "Placed" : "Not placed"}
                </p>
              </div>
            </div>
            <label className="relative w-[44px] h-6 cursor-pointer">
              <input
                type="checkbox"
                name="isPlaced"
                checked={formData.isPlaced}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="absolute inset-0 rounded-full peer-checked:bg-blue-600 transition-colors bg-gray-300" />
              <div className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
            </label>
          </div>

          {/* Organization */}
          {formData.isPlaced && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Organization
              </label>
              <input
                className={`px-3.5 py-2.5 rounded-[10px] text-[14px] outline-none w-full transition-all ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/30"
                    : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100"
                }`}
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Company or university name"
              />
            </div>
          )}

         
          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-2.5 px-7 py-4 flex-shrink-0 border-t transition-all ${
            isDark ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-gray-50"
          }`}
        >
          <button
            onClick={closeModal}
            className={`px-[18px] py-2 rounded-[10px] border text-[14px] hover:bg-white transition-colors ${
              isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-[22px] py-2 rounded-[10px] bg-blue-600 text-white text-[14px] font-medium hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}