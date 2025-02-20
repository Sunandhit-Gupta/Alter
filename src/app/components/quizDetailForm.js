import axios from 'axios';
import { useSession } from "next-auth/react";
import { useState } from 'react';

export default function QuizDetailForm({ setQuizId, onNext }) {
    const { data: session } = useSession();
    const [quizTitle, setQuizTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [batch, setBatch] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [fromRoll, setFromRoll] = useState('');
    const [toRoll, setToRoll] = useState('');
    const [uniqueRoll, setUniqueRoll] = useState('');
    const [uniqueRolls, setUniqueRolls] = useState([]);

    const addUniqueRoll = () => {
        if (uniqueRoll && !uniqueRolls.includes(uniqueRoll)) {
            setUniqueRolls([...uniqueRolls, uniqueRoll]);
            setUniqueRoll('');
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
            uniqueRolls
        };

        try {
            if (!session?.user?.token) {
                alert("Unauthorized: No token found.");
                return;
            }

            const res = await axios.post('/api/quiz/create', quizDetails, {
                headers: { Authorization: `Bearer ${session.user.token}` }
            });

            setQuizId(res.data.quizId);
            alert('Quiz details saved successfully!');
            onNext();
        } catch (error) {
            console.error('Failed to save quiz:', error);
            alert('Failed to save quiz details.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Quiz Title:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Description:</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Duration (minutes):</label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Batch:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Course Code:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., CSPC-304"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Roll Range:</label>
                    <div className="flex space-x-4">
                        <div>
                            <label className="block text-gray-400 font-thin">From Roll:</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={fromRoll}
                                onChange={(e) => setFromRoll(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-thin">To Roll:</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={toRoll}
                                onChange={(e) => setToRoll(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Add Unique Roll Numbers:</label>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter Roll Number"
                            value={uniqueRoll}
                            onChange={(e) => setUniqueRoll(e.target.value)}
                        />
                        <button
                            type="button"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={addUniqueRoll}
                        >
                            Add
                        </button>
                    </div>

                    {uniqueRolls.length > 0 && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                            <h4 className="text-gray-700 font-medium">Added Roll Numbers:</h4>
                            <ul className="flex flex-wrap gap-2">
                                {uniqueRolls.map((roll, index) => (
                                    <li key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded">
                                        {roll}
                                        <button
                                            type="button"
                                            className="text-red-500 ml-2 hover:text-red-700"
                                            onClick={() => removeUniqueRoll(roll)}
                                        >
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Save & Proceed
                </button>
            </form>
        </div>
    );
}
