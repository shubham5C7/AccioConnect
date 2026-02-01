import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useSelector } from "react-redux";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div className="flex-1 flex justify-center px-2">
      <div className="relative w-full max-w-115">
        <LuSearch
          className={`absolute left-3 top-1/2 -translate-y-1/2
          ${isDark ? "text-white" : "text-black"}`}
        />

        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full h-10 pl-10 pr-3 rounded-2xl outline-none transition-all
          ${
            isDark
              ? "bg-black text-white ring-1 ring-gray-500/60 shadow-[0_0_8px_rgba(59,130,246,0.25)]"
              : "bg-[#ececec] text-black ring-1 ring-gray-500/40"
          }`}
        />
      </div>
    </div>
  );
};

export default SearchBar;
