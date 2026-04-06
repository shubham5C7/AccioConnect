import { MdLanguage, MdLocationPin, MdWifi } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { getDeviceIcon, getBrowserColor, formatDate } from "./loginHistoryHelpers";

const HistoryCard = ({ item, index, isDark }) => {
  const isCurrent    = index === 0;
  const browserColor = getBrowserColor(item.browser);

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all duration-300 group
        ${
          isDark
            ? "bg-gray-800/60 hover:bg-gray-800 ring-1 ring-gray-700/50 hover:ring-gray-600"
            : "bg-white hover:bg-gray-50 ring-1 ring-gray-200 hover:ring-gray-300"
        }
        ${isCurrent ? (isDark ? "ring-blue-500/40" : "ring-blue-400/50") : ""}
      `}
    >
      {isCurrent && (
        <span
          className={`absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5
            rounded-full flex items-center gap-1
            ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
          Current
        </span>
      )}

      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
            transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: browserColor + "22", color: browserColor }}
        >
          {getDeviceIcon(item.device)}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
            {item.browser || "Unknown Browser"}{" "}
            <span className={`font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              on {item.os || "Unknown OS"}
            </span>
          </p>

          <div className={`mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <span className="flex items-center gap-1">
              <MdWifi size={13} />
              {item.ip || "—"}
            </span>

            <span className="flex items-center gap-1">
              <MdLocationPin size={13} />
              {item.location?.city !== "Unknown"
                ? `${item.location.city}, ${item.location.country}`
                : item.location?.lat
                ? `${Number(item.location.lat).toFixed(2)}, ${Number(item.location.lng).toFixed(2)}`
                : "Location unavailable"}
            </span>

            <span className="flex items-center gap-1 capitalize">
              <MdLanguage size={13} />
              {item.device || "desktop"}
            </span>
          </div>

          <p className={`mt-2 text-xs flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            <BiTime size={13} />
            {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;