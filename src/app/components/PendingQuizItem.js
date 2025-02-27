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
    <li className="p-4 bg-gray-100 rounded-lg shadow">
      {isEditing ? (
        <QuizEditForm
          formData={formData}
          onChange={onInputChange}
          onSave={() => onUpdateQuiz(quiz._id)}
          onCancel={onCancelEdit}
        />
      ) : (
        <div>
          <h2 className="text-xl font-semibold">{quiz.quizTitle}</h2>
          <p>{quiz.description}</p>
          <p>Course: {quiz.courseCode}</p>
          <p>Batch: {quiz.batch}</p>
          <p>
            Status: <strong>{quiz.status}</strong>
          </p>
          <p>Created by: {quiz.createdByName || "Unknown"}</p>
          <div className="mt-3 flex gap-3">
            {quiz.status === "Draft" && (
              <button
                onClick={() => onPublishQuiz(quiz._id)}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                🚀 Publish
              </button>
            )}
            {quiz.status === "Published" && (
              <button
                onClick={() => onStartQuiz(quiz._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ▶️ Start
              </button>
            )}
            {quiz.status === "Ongoing" && (
              <button
                onClick={() => onEndQuiz(quiz._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ⏹️ End
              </button>
            )}
            <button
              onClick={() => onAddQuestions(quiz._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ Add Questions
            </button>
            <button
              onClick={() => onEditQuiz(quiz)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onSetSettings(quiz._id)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => onDeleteQuiz(quiz._id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
