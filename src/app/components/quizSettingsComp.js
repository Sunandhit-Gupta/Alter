import axios from "axios";
import { useEffect, useState } from "react";

export default function QuizSettingsComp({ quizId, onSubmit }) {
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [duration, setDuration] = useState(30);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`/api/quiz/settings?quizId=${quizId}`);
                const { shuffleQuestions, duration } = res.data.settings;
                setShuffleQuestions(shuffleQuestions);
                setDuration(duration);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch quiz settings:", error);
                setLoading(false);
            }
        };

        if (quizId) {
            fetchSettings();
        }
    }, [quizId]);

    const handleSubmit = () => {
        const quizSettings = { shuffleQuestions, duration };
        onSubmit(quizSettings);
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Settings</h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Quiz Duration (minutes):</label>
                <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
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

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                💾 Save Settings
            </button>
        </div>
    );
}
