export default function QuestionPopup({ showPopup, setShowPopup, handleAddQuestion }) {
    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-lg font-bold mb-4">Select Question Type</h3>
                {['Single Correct MCQ', 'Multiple Correct MCQ', 'Subjective'].map((type) => (
                    <button
                        key={type}
                        className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
                        onClick={() => handleAddQuestion(type)}
                    >
                        {type}
                    </button>
                ))}
                <button className="block mt-4 text-red-500 font-bold" onClick={() => setShowPopup(false)}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
