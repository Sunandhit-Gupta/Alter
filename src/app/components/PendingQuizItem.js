import QuizEditForm from "./QuizEditForm";

export default function PendingQuizItem({
  quiz,
  isEditing,
  formData,
  onInputChange,
  onUpdateQuiz,
  onCancelEdit,
  onPublishQuiz,
  onStartQuiz,
  onEndQuiz,
  onAddQuestions,
  onEditQuiz,
  onSetSettings,
  onDeleteQuiz,
}) {
  return (
    <li className="p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md">
      {isEditing ? (
        <QuizEditForm
          formData={formData}
          onChange={onInputChange}
          onSave={() => onUpdateQuiz(quiz._id)}
          onCancel={onCancelEdit}
        />
      ) : (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">{quiz.quizTitle}</h2>
          <p className="text-sm sm:text-base text-gray-700">{quiz.description}</p>
          <p className="text-sm sm:text-base">Course: {quiz.courseCode}</p>
          <p className="text-sm sm:text-base">Batch: {quiz.batch}</p>
          <p className="text-sm sm:text-base">
            Status: <strong>{quiz.status}</strong>
          </p>
          <p className="text-sm sm:text-base">
            Created by: {quiz.createdByName || "Unknown"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            {quiz.status === "Draft" && (
              <button
                onClick={() => onPublishQuiz(quiz._id)}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-sm sm:text-base w-full sm:w-auto"
              >
                🚀 Publish
              </button>
            )}
            {quiz.status === "Published" && (
              <button
                onClick={() => onStartQuiz(quiz._id)}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
              >
                ▶️ Start
              </button>
            )}
            {quiz.status === "Ongoing" && (
              <button
                onClick={() => onEndQuiz(quiz._id)}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base w-full sm:w-auto"
              >
                ⏹️ End
              </button>
            )}
            <button
              onClick={() => onAddQuestions(quiz._id)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
            >
              ➕ Add Questions
            </button>
            <button
              onClick={() => onEditQuiz(quiz)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm sm:text-base w-full sm:w-auto"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onSetSettings(quiz._id)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm sm:text-base w-full sm:w-auto"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => onDeleteQuiz(quiz._id)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base w-full sm:w-auto"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}