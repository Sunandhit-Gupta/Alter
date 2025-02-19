'use client'
import { useState } from 'react';

export default function AnswerInput() {
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Convert totalMarks to a number
    const marks = parseFloat(totalMarks);
    if (isNaN(marks)) {
      setError('Total marks must be a valid number.');
      return;
    }

    try {
      const res = await fetch('/api/subjectiveScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctAnswer, userAnswer, totalMarks: marks })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error calculating score.');
      } else {
        setScore(data.score);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting the answer.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Answer Evaluation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Correct Answer:</label>
          <textarea
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block font-medium">User Answer:</label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter the user's answer"
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block font-medium">Total Marks:</label>
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Enter total marks"
            className="w-full border p-2 rounded"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Submit
        </button>
      </form>

      {score !== null && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <p>Your score: {score}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
