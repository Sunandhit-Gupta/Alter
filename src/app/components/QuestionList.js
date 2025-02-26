export default function QuestionList({ questions }) {
    return (
        <div>
            {questions.length > 0 ? (
                questions.map((q, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-100">
                        <p className="font-semibold">{index + 1}. {q.text}</p>
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
