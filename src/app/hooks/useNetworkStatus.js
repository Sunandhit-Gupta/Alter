import { useEffect, useState } from "react";

export default function useNetworkStatus() {
    const [networkStrength, setNetworkStrength] = useState("Checking...");

    useEffect(() => {
        const updateNetworkStatus = () => {
            console.log("Network status changed"); // Debugging

            if (!navigator.onLine) {
                console.log("Offline detected"); // Debugging
                setNetworkStrength("Offline");
                return;
            }

            if (navigator.connection) {
                const { downlink, effectiveType } = navigator.connection;
                let strength = "Strong";
                if (effectiveType === "3g" || downlink < 2) strength = "Moderate";
                if (effectiveType === "2g" || downlink < 0.5) strength = "Weak";

                setNetworkStrength(strength);
            } else {
                setNetworkStrength("Unknown");
            }
        };

        updateNetworkStatus(); // Initial call
        window.addEventListener("online", updateNetworkStatus);
        window.addEventListener("offline", updateNetworkStatus);
        navigator.connection?.addEventListener("change", updateNetworkStatus);

        return () => {
            window.removeEventListener("online", updateNetworkStatus);
            window.removeEventListener("offline", updateNetworkStatus);
            navigator.connection?.removeEventListener("change", updateNetworkStatus);
        };
    }, []);

    return networkStrength;
}
