import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function QuizDetailForm({ setQuizId, onNext }) {
    const { data: session } = useSession();
    const [quizTitle, setQuizTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [batch, setBatch] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [fromRoll, setFromRoll] = useState("");
    const [toRoll, setToRoll] = useState("");
    const [uniqueRoll, setUniqueRoll] = useState("");
    const [uniqueRolls, setUniqueRolls] = useState([]);

    const addUniqueRoll = () => {
        if (uniqueRoll && !uniqueRolls.includes(uniqueRoll)) {
            setUniqueRolls([...uniqueRolls, uniqueRoll]);
            setUniqueRoll("");
        }
    };

    const removeUniqueRoll = (roll) => {
        setUniqueRolls(uniqueRolls.filter((r) => r !== roll));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const quizDetails = {
            quizTitle,
            description,
            duration,
            batch,
            courseCode,
            rollRange: { from: fromRoll, to: toRoll },
            uniqueRolls,
        };

        try {
            if (!session?.user?.token) {
                toast.error("Unauthorized: No token found.");
                return;
            }

            const res = await axios.post("/api/quiz/create", quizDetails, {
                headers: { Authorization: `Bearer ${session.user.token}` },
            });

            setQuizId(res.data.quizId);
            toast.success("Quiz details saved successfully!");
            onNext();
        } catch (error) {
            console.error("Failed to save quiz:", error);
            toast.error("Failed to save quiz details.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📄 Quiz Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid Layout to Optimize Space */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-700 font-medium">Quiz Title:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 font-medium">Course Code:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            placeholder="e.g., CSPC-304"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 font-medium">Batch:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 font-medium">Duration (minutes):</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-lg"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Description Field - Full Width */}
                <div>
                    <label className="text-gray-700 font-medium">Description:</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Roll Number Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-700 font-medium">From Roll:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            value={fromRoll}
                            onChange={(e) => setFromRoll(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 font-medium">To Roll:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            value={toRoll}
                            onChange={(e) => setToRoll(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Unique Rolls Section */}
                <div>
                    <label className="text-gray-700 font-medium">Add Unique Roll Numbers:</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg"
                            placeholder="Enter Roll Number"
                            value={uniqueRoll}
                            onChange={(e) => setUniqueRoll(e.target.value)}
                        />
                        <button
                            type="button"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            onClick={addUniqueRoll}
                        >
                            Add
                        </button>
                    </div>

                    {/* Display Added Rolls */}
                    {uniqueRolls.length > 0 && (
                        <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                            <h4 className="text-gray-700 font-medium">Added Roll Numbers:</h4>
                            <div className="flex flex-wrap gap-2">
                                {uniqueRolls.map((roll, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg flex items-center"
                                    >
                                        {roll}
                                        <button
                                            type="button"
                                            className="text-red-500 ml-2 hover:text-red-700"
                                            onClick={() => removeUniqueRoll(roll)}
                                        >
                                            ✖
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg hover:bg-blue-600 transition"
                >
                    🚀 Save & Proceed
                </button>
            </form>
        </div>
    );
}
