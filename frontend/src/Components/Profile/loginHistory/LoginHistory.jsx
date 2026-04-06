import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdSecurity } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";
import { fetchLoginHistory } from "../../../features/userSlice"; // ← adjust if needed
import HistoryCard from "./HistoryCard";
import SkeletonCard from "./SkeletonCard";

const LoginHistory = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);

  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);
    setError(null);

    const result = await dispatch(fetchLoginHistory());

    if (fetchLoginHistory.fulfilled.match(result)) {
      setHistory(result.payload || []);
    } else {
      setError("Couldn't load login history. Please try again.");
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-3xl p-6 ${
        isDark
          ? "bg-gray-900 ring-1 ring-gray-700/60"
          : "bg-gray-50 ring-1 ring-gray-200"
      }`}
    >
      {/* ── header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-600"
            }`}
          >
            <MdSecurity size={20} />
          </div>
          <div>
            <h2 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
              Login Activity
            </h2>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Last {history.length} sign-ins
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchHistory(true)}
          disabled={refreshing}
          title="Refresh"
          className={`p-2 rounded-xl transition-all duration-200 disabled:opacity-40 ${
            isDark
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-200 text-gray-500 hover:text-gray-800"
          }`}
        >
          <HiRefresh  size={16} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── content ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}
        </div>

      ) : error ? (
        <div className={`text-center py-10 rounded-2xl ${isDark ? "bg-gray-800/40" : "bg-white"}`}>
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button onClick={() => fetchHistory()} className="text-xs text-blue-500 hover:underline">
            Try again
          </button>
        </div>

      ) : history.length === 0 ? (
        <div className={`text-center py-12 rounded-2xl ${isDark ? "bg-gray-800/40" : "bg-white"}`}>
          <MdSecurity size={32} className={`mx-auto mb-3 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            No login history yet
          </p>
        </div>

      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <HistoryCard key={item._id} item={item} index={index} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoginHistory;