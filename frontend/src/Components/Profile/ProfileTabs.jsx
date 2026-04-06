import { useSelector } from "react-redux";

const TABS = ["Posts", "About", "LoginHistory"];

// ✅ activeTab comes FROM parent — this component just displays & notifies
const ProfileTabs = ({ activeTab, onTabChange }) => {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? isDark ? "text-white" : "text-gray-900"
                : isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;