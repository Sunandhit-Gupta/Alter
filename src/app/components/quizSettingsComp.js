import { useState } from "react";

export default function QuizSettingsComp({ onSubmit }) {
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  const handleSubmit = () => {
    const quizSettings = { shuffleQuestions };
    console.log("Submitting Quiz Settings:", quizSettings);
    onSubmit(quizSettings);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Settings</h2>

      <div className="flex items-center justify-between">
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
        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Submit Quiz
      </button>
    </div>
  );
}
