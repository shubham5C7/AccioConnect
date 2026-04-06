import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoLocationSharp, IoPricetagsOutline } from "react-icons/io5";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import { GiLaptop } from "react-icons/gi";
import { CiClock2 } from "react-icons/ci";
import { MdLocalPhone, MdOutlinePhotoCamera } from "react-icons/md";

const AboutCard = () => {
  const { user } = useSelector((state) => state.posts);
  const isDark = useSelector((state) => state.theme.isDark);

  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
  const fileInputRef = useRef(null);

  const base    = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
  const muted   = isDark ? 'text-gray-400' : 'text-gray-500';
  const row     = isDark ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50';
  const divider = isDark ? 'border-gray-700' : 'border-gray-100';

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
    // TODO: dispatch upload action with `file` here
  };

  const infoItems = [
    {
      icon: <IoLocationSharp className="text-blue-500" />,
      label: 'Location',
      value: user?.centerLocation
        ? user.centerLocation.charAt(0).toUpperCase() + user.centerLocation.slice(1)
        : '—',
    },
    {
      icon: <FaGraduationCap className="text-blue-500" />,
      label: 'Role',
      value: user?.role || '—',
    },
    {
      icon: <GiLaptop className="text-blue-500" />,
      label: 'Course',
      value: user?.courseType ? user.courseType.toUpperCase() : '—',
    },
    {
      icon: <IoPricetagsOutline className="text-blue-500" />,
      label: 'Batch',
      value: user?.batch || '—',
    },
    {
      icon: user?.isPlaced
        ? <FaCheckCircle className="text-green-500" />
        : <CiClock2 className="text-orange-400" />,
      label: 'Placement',
      badge: true,
      placed: user?.isPlaced,
      value: user?.isPlaced ? 'Placed' : 'Not Placed Yet',
    },
  ];

  return (
    <div className={`rounded-2xl border ${base} overflow-hidden w-full shadow-sm`}>

      {/* Header: Avatar Upload + Name + Email */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b ${divider}`}>

        {/* Clickable avatar with camera overlay */}
        <div
          className="relative w-10 h-10 shrink-0 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
          title="Change profile picture"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={user?.firstName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400"
            />
          ) : (
            <div className="w-10 h-10 rounded-full ring-2 ring-blue-400 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-lg font-semibold">
              {user?.firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}

          {/* Camera icon overlay on hover */}
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <MdOutlinePhotoCamera className="text-white text-sm" />
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className={`text-xs mt-0.5 truncate ${muted}`}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 pt-3 pb-1">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${muted}`}>Info</p>
      </div>

      <div className="px-3 pb-3 flex flex-col">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-2 py-2.5 rounded-xl transition-colors ${row}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base w-5 flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              <span className={`text-xs ${muted}`}>{item.label}</span>
            </div>

            {item.badge ? (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  item.placed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-600'
                }`}
              >
                {item.value}
              </span>
            ) : (
              <span className="text-xs font-semibold truncate max-w-[120px] text-right">
                {item.value}
              </span>
            )}
          </div>
        ))}

        {/* Phone row */}
        {user?.phoneNumber && (
          <div className={`flex items-center justify-between px-2 py-2.5 rounded-xl transition-colors ${row}`}>
            <div className="flex items-center gap-2.5">
              <span className="text-base w-5 flex items-center justify-center shrink-0">
                <MdLocalPhone className="text-blue-500" />
              </span>
              <span className={`text-xs ${muted}`}>Phone</span>
            </div>
            <span className="text-xs font-semibold">{user.phoneNumber}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default AboutCard;