import axios from "axios";
import { useEffect, useState } from "react";

export default function QuizSettingsComp({ quizId, onSubmit }) {
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [showSingleQuestion, setShowSingleQuestion] = useState(false); // New State
    const [duration, setDuration] = useState(30);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const convertUTCToLocal = (utcDateString) => {
        if (!utcDateString) return "";
        const utcDate = new Date(utcDateString);
        return utcDate.toLocaleString("sv").slice(0, 16);
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`/api/quiz/settings?quizId=${quizId}`);
                const { shuffleQuestions, showSingleQuestion, duration, startTime, endTime } = res.data.settings;

                setShuffleQuestions(shuffleQuestions);
                setShowSingleQuestion(showSingleQuestion); // Set the state
                setDuration(duration);
                setStartTime(startTime ? convertUTCToLocal(startTime) : "");
                setEndTime(endTime ? convertUTCToLocal(endTime) : "");
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch quiz settings:", error);
                setError("Failed to load quiz settings.");
                setLoading(false);
            }
        };

        if (quizId) fetchSettings();
    }, [quizId]);

    useEffect(() => {
        if (startTime && duration) {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + duration * 60 * 1000);
            setEndTime(end.toLocaleString("sv").slice(0, 16));
        } else {
            setEndTime("");
        }
    }, [startTime, duration]);

    const validateInputs = () => {
        const now = new Date();
        const start = new Date(startTime);

        if (startTime && start < now) {
            setError("Start time cannot be in the past.");
            return false;
        }

        if (duration <= 0) {
            setError("Duration must be at least 1 minute.");
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = () => {
        if (!validateInputs()) return;

        const quizSettings = {
            shuffleQuestions,
            showSingleQuestion, // Include in submission
            duration,
            startTime,
        };

        console.log("Submitting Settings:", quizSettings);
        onSubmit(quizSettings);
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Settings</h2>

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    ⚠️ {error}
                </div>
            )}

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

            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Quiz Start Time:</label>
                <input
                    type="datetime-local"
                    className="w-full p-2 border rounded"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min={new Date().toLocaleString("sv").slice(0, 16)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Quiz End Time (auto-calculated):</label>
                <input
                    type="datetime-local"
                    className="w-full p-2 border rounded bg-gray-100"
                    value={endTime}
                    readOnly
                />
            </div>

            <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium">Shuffle Questions:</label>
                <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={shuffleQuestions}
                    onChange={() => setShuffleQuestions(!shuffleQuestions)}
                />
            </div>

            {/* New Toggle Field */}
            <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium">Show Single Question at a Time:</label>
                <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={showSingleQuestion}
                    onChange={() => setShowSingleQuestion(!showSingleQuestion)}
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                💾 Save Settings
            </button>
        </div>
    );
}
