
export default function QuestionForm({ newQuestion, setNewQuestion, handleSaveQuestion }) {
    if (!newQuestion) return null;

    return (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <label className="block text-gray-700 font-medium">Question:</label>
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter your question"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            />
            <label className="block text-gray-700 font-medium mt-4">Maximum Score:</label>
            <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                min="1"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })}
            />


            {(newQuestion.type.includes("MCQ")) && (
                <div className="mt-4">
                    <label className="block text-gray-700 font-medium">Options:</label>
                    {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={option}
                                onChange={(e) => {
                                    const updatedOptions = [...newQuestion.options];
                                    updatedOptions[index] = e.target.value;
                                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                                }}
                            />
                            <input
                                type={newQuestion.type === "Single Correct MCQ" ? "radio" : "checkbox"}
                                className="ml-2"
                                checked={newQuestion.correctAnswers.includes(option)}
                                onChange={() => {
                                    let updatedAnswers;
                                    if (newQuestion.type === "Single Correct MCQ") {
                                        updatedAnswers = [option];
                                    } else {
                                        updatedAnswers = newQuestion.correctAnswers.includes(option)
                                            ? newQuestion.correctAnswers.filter((ans) => ans !== option)
                                            : [...newQuestion.correctAnswers, option];
                                    }
                                    setNewQuestion({ ...newQuestion, correctAnswers: updatedAnswers });
                                }}
                            />
                        </div>
                    ))}
                    <button
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] })}
                    >
                        ➕ Add Option
                    </button>
                </div>
            )}
            {newQuestion.type === "Subjective" && (
                <div className="mt-4">
                    <label className="block text-gray-700 font-medium">Correct Answer:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter correct answer"
                        value={newQuestion.correctAnswers[0]}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswers: [e.target.value] })}
                    />
                </div>
            )}
            <button
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleSaveQuestion}
            >
                💾 Save Question
            </button>
        </div>
    );
}
