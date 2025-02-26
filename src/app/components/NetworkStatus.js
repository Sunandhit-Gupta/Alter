"use client";
import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true);
  const [networkStrength, setNetworkStrength] = useState("unknown");

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        setNetworkStrength("disconnected");
      } else {
        updateNetworkStrength();
      }
    };

    const updateNetworkStrength = () => {
      if (!navigator.onLine) {
        setNetworkStrength("disconnected");
        return;
      }

      if ("connection" in navigator && navigator.connection) {
        let downlink = navigator.connection.downlink;
        let effectiveType = navigator.connection.effectiveType;

        console.log("downlink", downlink);
        console.log("effectiveType", effectiveType);
        if (downlink && effectiveType) {
          if (downlink < 1 || effectiveType === "slow-2g" || effectiveType === "2g") {
            setNetworkStrength("weak");
          } else if (downlink < 5 || effectiveType === "3g") {
            setNetworkStrength("medium");
          } else {
            setNetworkStrength("strong");
          }
        } else {
          setNetworkStrength("unknown");
        }
      } else {
        setNetworkStrength("unknown");
      }
    };

    updateNetworkStatus();
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    const interval = setInterval(updateNetworkStatus, 3000);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      clearInterval(interval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (networkStrength) {
      case "disconnected":
        return { activeBars: 0, color: "bg-gray-400", label: "Disconnected" };
      case "weak":
        return { activeBars: 1, color: "bg-red-500", label: "Weak" };
      case "medium":
        return { activeBars: 2, color: "bg-yellow-500", label: "Medium" };
      case "strong":
        return { activeBars: 3, color: "bg-green-500", label: "Strong" };
      default:
        return { activeBars: 0, color: "bg-gray-400", label: "Unknown" };
    }
  };

  const { activeBars, color, label } = getStatusConfig();

  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg shadow-md bg-white dark:bg-gray-800">
      {/* Signal Bars */}
      <div className="flex items-end space-x-1">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`w-1 md:w-1.5 transition-all duration-300 ease-in-out ${
              activeBars >= bar ? color : "bg-gray-300 dark:bg-gray-600"
            } rounded-sm`}
            style={{ height: `${bar * 6}px` }}
          />
        ))}
      </div>

      {/* Status Text */}
      <span className={`text-xs md:text-sm font-medium ${color.replace("bg-", "text-")}`}>
        {label}
      </span>
    </div>
  );
}
