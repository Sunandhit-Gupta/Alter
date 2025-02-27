import axios from "axios";
import { useEffect, useState } from "react";

export default function QuizSettingsComp({ quizId, onSubmit }) {
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [duration, setDuration] = useState(30);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Convert UTC to local time for display
    // Convert UTC to local datetime-local format (YYYY-MM-DDTHH:MM)
const convertToLocalTime = (utcDateString) => {
    if (!utcDateString) return "";
    const localDate = new Date(utcDateString);
    console.log("fetched time", localDate);
    console.log("Local Time",localDate.toLocaleString("en-GB", { timeZone: "UTC" }));

    return localDate.toISOString().slice(0, 16);  // Format for datetime-local
};



    // Convert local time to UTC for storing
    const convertToUTC = (localDateString) => {
        if (!localDateString) return null;
        const localDate = new Date(localDateString);
        if (isNaN(localDate.getTime())) {
            console.error("Invalid date string provided:", localDateString);
            return null;
        }
        return localDate.toISOString();
    };

    // Calculate endTime whenever startTime or duration changes
    useEffect(() => {
        if (startTime && duration > 0) {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + duration * 60 * 1000);
            setEndTime(end.toISOString().slice(0, 16));  // Display in local time
        } else {
            setEndTime("");
        }
    }, [startTime, duration]);

    // Fetch settings from the backend
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`/api/quiz/settings?quizId=${quizId}`);
                const { shuffleQuestions, duration, startTime } = res.data.settings;

                setShuffleQuestions(shuffleQuestions);
                setDuration(duration);
                setStartTime(startTime ? convertToLocalTime(startTime) : "");

            } catch (error) {
                console.error("Failed to fetch quiz settings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) fetchSettings();
    }, [quizId]);

    // Validate inputs before submitting
    const validateInputs = () => {
        const now = new Date();
        const start = new Date(startTime);

        // Ensure startTime is not in the past
        if (startTime && start < now) {
            setError("Start time cannot be in the past.");
            return false;
        }

        // Ensure duration is at least 1 minute
        if (duration <= 0) {
            setError("Duration must be at least 1 minute.");
            return false;
        }

        setError("");
        return true;
    };

    // Handle save: convert startTime to UTC before submitting
    const handleSubmit = () => {
        if (!validateInputs()) return;

        const quizSettings = {
            shuffleQuestions,
            duration,
            startTime: convertToUTC(startTime)
        };

        onSubmit(quizSettings);
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Settings</h2>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    ⚠️ {error}
                </div>
            )}

            {/* Quiz Duration */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Quiz Duration (minutes):</label>
                <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min="1"
                />
            </div>

            {/* Start Time */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Quiz Start Time:</label>
                <input
                    type="datetime-local"
                    className="w-full p-2 border rounded"
                    value={convertToLocalTime(startTime)}
                    onChange={(e) => setStartTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}  //prevent past dates
                />
            </div>

            {/* End Time (Auto-calculated) */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Quiz End Time (auto-calculated):</label>
                <input
                    type="datetime-local"
                    className="w-full p-2 border rounded bg-gray-100"
                    value={endTime}
                    readOnly
                />
            </div>

            {/* Shuffle Questions */}
            <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium">Shuffle Questions:</label>
                <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={shuffleQuestions}
                    onChange={() => setShuffleQuestions(!shuffleQuestions)}
                />
            </div>

            {/* Save Settings Button */}
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                💾 Save Settings
            </button>
        </div>
    );
}
