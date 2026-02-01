import { useSelector } from "react-redux";
import { Colors } from "../constants";

const RecentlyPlaced = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      className={`fixed right-5 top-20 w-72 h-108 p-4 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.55)]  ${isDark ? " text-white " : "bg-white text-black"}`}
      style={isDark ? Colors.RightPannelBG : {}}
    >
      Recently Placed
    </div>
  );
};

export default RecentlyPlaced;
