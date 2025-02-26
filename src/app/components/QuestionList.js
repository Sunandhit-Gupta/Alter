export default function QuestionList({ questions, handleDelete }) {
    return (
        <div>
            {questions.length > 0 ? (
                questions.map((q, index) => (
                    <div
                        key={q._id || index}
                        className="mb-6 p-4 border rounded-lg bg-gray-100 relative flex flex-col"
                    >
                        {/* Question Text */}
                        <p className="font-semibold pr-10"> {/* Padding added to prevent overlap */}
                            {index + 1}. {q.text}
                        </p>

                        {/* Options or Correct Answer */}
                        {q.type !== "Subjective" ? (
                            <ul className="mt-2">
                                {q.options.map((opt, i) => (
                                    <li key={i} className={`p-2 rounded ${q.correctAnswers.includes(opt) ? "bg-green-200" : ""}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 italic text-gray-700">Correct Answer: {q.correctAnswers[0]}</p>
                        )}

                        {/* 🗑️ Delete Button (Fixing Position and Showing for Unsaved Questions Too) */}
                        <button
                            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDelete(q._id || index)} // Handle both saved & unsaved questions
                        >
                            🗑️ Delete
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No questions added yet.</p>
            )}
        </div>
    );
}
