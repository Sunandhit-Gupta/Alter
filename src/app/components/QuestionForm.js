import axios from "axios";

export default function QuestionForm({
  newQuestion,
  setNewQuestion,
  handleSaveQuestion,
}) {
  if (!newQuestion) return null;

  // ⭐ Upload image handler (Cloudinary)
  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post("/api/db/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Save image URL in question state
        setNewQuestion((prev) => ({
          ...prev,
          images: [...(prev.images || []), res.data.url],
        }));
      } catch (err) {
        console.error(err);
        alert("Image upload failed");
      }
    }
  };

  // ⭐ Remove uploaded image
  const removeImage = (index) => {
    setNewQuestion({
      ...newQuestion,
      images: newQuestion.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      {/* Question Text */}
      <label className="block text-gray-700 font-medium">Question:</label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mt-1"
        placeholder="Enter your question"
        value={newQuestion.text}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, text: e.target.value })
        }
      />

      {/* Maximum Score */}
      <label className="block text-gray-700 font-medium mt-4">
        Maximum Score:
      </label>
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded mt-1"
        min="1"
        value={newQuestion.points}
        onChange={(e) =>
          setNewQuestion({
            ...newQuestion,
            points: parseInt(e.target.value) || 1,
          })
        }
      />

      {/* ⭐ IMAGE UPLOAD SECTION (PER QUESTION) */}
      <label className="block text-gray-700 font-medium mt-4">
        Upload Question Images (optional)
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUploadImage}
        className="mt-1"
      />

      {/* Image Preview */}
      {newQuestion.images?.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {newQuestion.images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="h-24 rounded border" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MCQ Options */}
      {newQuestion.type.includes("MCQ") && (
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">Options:</label>

          {newQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center mt-2 gap-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...newQuestion.options];
                  updatedOptions[index] = e.target.value;
                  setNewQuestion({
                    ...newQuestion,
                    options: updatedOptions,
                  });
                }}
              />

              <input
                type={
                  newQuestion.type === "Single Correct MCQ"
                    ? "radio"
                    : "checkbox"
                }
                checked={newQuestion.correctAnswers.includes(option)}
                onChange={() => {
                  let updatedAnswers;

                  if (newQuestion.type === "Single Correct MCQ") {
                    updatedAnswers = [option];
                  } else {
                    updatedAnswers =
                      newQuestion.correctAnswers.includes(option)
                        ? newQuestion.correctAnswers.filter(
                            (ans) => ans !== option
                          )
                        : [...newQuestion.correctAnswers, option];
                  }

                  setNewQuestion({
                    ...newQuestion,
                    correctAnswers: updatedAnswers,
                  });
                }}
              />
            </div>
          ))}

          <button
            type="button"
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            onClick={() =>
              setNewQuestion({
                ...newQuestion,
                options: [...newQuestion.options, ""],
              })
            }
          >
            ➕ Add Option
          </button>
        </div>
      )}

      {/* Subjective Answer */}
      {newQuestion.type === "Subjective" && (
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">
            Correct Answer:
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter correct answer"
            value={newQuestion.correctAnswers[0]}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                correctAnswers: [e.target.value],
              })
            }
          />
        </div>
      )}

      {/* Save Button */}
      <button
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={handleSaveQuestion}
      >
        💾 Save Question
      </button>
    </div>
  );
}