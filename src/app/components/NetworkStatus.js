import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";

export default function NetworkStatus() {
    const [networkStrength, setNetworkStrength] = useState("Checking...");
    const [downlink, setDownlink] = useState(null);
    const [effectiveType, setEffectiveType] = useState("unknown");

    useEffect(() => {
        const updateNetworkStatus = () => {
            if (navigator.connection) {
                const { downlink, effectiveType } = navigator.connection;
                setDownlink(downlink);
                setEffectiveType(effectiveType);

                let strength = "Strong";
                if (effectiveType === "3g" || downlink < 2) strength = "Moderate";
                if (effectiveType === "2g" || downlink < 0.5) strength = "Weak";

                setNetworkStrength(strength);

                if (strength === "Moderate" || strength === "Weak") {
                    alert(`⚠️ Your network connection is ${strength}. Some features may not work smoothly.`);
                }
            } else {
                setNetworkStrength("Network API not supported");
            }
        };

        updateNetworkStatus();
        navigator.connection?.addEventListener("change", updateNetworkStatus);

        return () => {
            navigator.connection?.removeEventListener("change", updateNetworkStatus);
        };
    }, []);

    const getIndicatorColor = () => {
        switch (networkStrength) {
            case "Strong":
                return "text-green-500";
            case "Moderate":
                return "text-yellow-500";
            case "Weak":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="flex items-center space-x-2 text-sm">
            <FaWifi className={`text-lg ${getIndicatorColor()}`} />
            <span className={`${getIndicatorColor()} font-medium hidden md:block`}>
                {networkStrength}
            </span>
        </div>
    );
}
