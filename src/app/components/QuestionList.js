export default function QuestionList({ questions, handleDelete }) {
    return (
        <div>
            {questions.length > 0 ? (
                questions.map((q, index) => (
                    <div
                        key={q._id || index}
                        className="mb-6 p-4 border rounded-lg bg-gray-100 relative flex flex-col gap-2"
                    >
                        {/* Flex container to separate text and delete button */}
                        <div className="flex justify-between items-start">
                            <p className="font-semibold flex-1">
                                {index + 1}. {q.text}
                            </p>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => handleDelete(q._id)}
                            >
                                🗑️ Delete
                            </button>
                        </div>

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
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No questions added yet.</p>
            )}
        </div>
    );
}
