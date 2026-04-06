import { MdMonitor, MdSmartphone, MdTablet } from "react-icons/md";

export const getDeviceIcon = (device) => {
  const d = (device || "").toLowerCase();
  if (d === "mobile") return <MdSmartphone size={18} />;
  if (d === "tablet") return <MdTablet size={18} />;
  return < MdMonitor size={18} />;
};

export const getBrowserColor = (browser) => {
  const b = (browser || "").toLowerCase();
  if (b.includes("chrome"))  return "#4285F4";
  if (b.includes("firefox")) return "#FF7139";
  if (b.includes("safari"))  return "#006CFF";
  if (b.includes("edge"))    return "#0078D4";
  return "#6B7280";
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60)     return "Just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};