const SkeletonCard = ({ isDark }) => (
  <div
    className={`rounded-2xl p-5 animate-pulse ${
      isDark ? "bg-gray-800/60" : "bg-gray-100"
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-4 w-1/3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-3 w-1/2 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-3 w-1/4 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
      </div>
    </div>
  </div>
);

export default SkeletonCard;