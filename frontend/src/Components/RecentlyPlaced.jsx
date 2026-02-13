import { useSelector } from "react-redux";
import { Colors } from "../constants";

const RecentlyPlaced = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      className={`  hidden xl:block fixed right-5 top-20 w-72 h-[420px] p-4 rounded-xl shadow-md  border ${isDark ? " text-white border-gray-800" : "bg-white text-black border-gray-200"}`}
      style={isDark ? Colors.RightPannelBG : {}}
    >
      Recently Placed
    </div>
  );
};

export default RecentlyPlaced;
