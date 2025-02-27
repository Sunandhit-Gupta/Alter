
export default function QuizEditForm({ formData, onChange, onSave, onCancel }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        name="quizTitle"
        value={formData.quizTitle}
        onChange={onChange}
        placeholder="Quiz Title"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
      ></textarea>
      <input
        type="text"
        name="courseCode"
        value={formData.courseCode}
        onChange={onChange}
        placeholder="Course Code"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="batch"
        value={formData.batch}
        onChange={onChange}
        placeholder="Batch"
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          💾 Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}
