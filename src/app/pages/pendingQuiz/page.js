"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function PendingQuiz() {
    const [pendingQuizzes, setPendingQuizzes] = useState([]);

    useEffect(() => {
        const fetchPendingQuizzes = async () => {
            try {
                const res = await axios.get('/api/quiz/pending');
                setPendingQuizzes(res.data);
            } catch (error) {
                console.error('Failed to fetch pending quizzes:', error);
            }
        };

        fetchPendingQuizzes();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pending Quizzes</h1>
            {pendingQuizzes.length > 0 ? (
                <ul className="space-y-4">
                    {pendingQuizzes.map((quiz) => (
                        <li key={quiz._id} className="p-4 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{quiz.quizTitle}</h2>
                            <p>{quiz.description}</p>
                            <p>Course: {quiz.courseCode}</p>
                            <p>Batch: {quiz.batch}</p>
                            <p>Created by: {quiz.createdBy?.name || 'Unknown'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending quizzes found.</p>
            )}
        </div>
    );
}
