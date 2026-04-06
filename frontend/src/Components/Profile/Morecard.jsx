import React from 'react';
import { useSelector } from 'react-redux';
import { MdLocalPhone } from 'react-icons/md';

const MoreCard = () => {
  const { user } = useSelector((state) => state.posts);
  const isDark = useSelector((state) => state.theme.isDark);

  const base = isDark
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';
  const muted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`rounded-2xl border ${base} overflow-hidden w-full shadow-sm`}>

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>More</p>
      </div>

      {/* User row */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePicture}
            alt={user?.firstName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            {user?.phoneNumber && (
              <div className={`flex items-center gap-1 mt-0.5 ${muted}`}>
                <MdLocalPhone className="text-xs" />
                <span className="text-xs">{user.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MoreCard;