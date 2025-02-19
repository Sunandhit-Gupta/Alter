import { useState } from "react";

export default function QuizQuesComp() {
  const [questions, setQuestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newQuestion, setNewQuestion] = useState(null);

  const handleAddQuestion = (type) => {
    setNewQuestion({
      type,
      text: "",
      options: [],
      correctAnswers: type === "Subjective" ? [""] : [], // Allow correct answer for subjective
    });
    setShowPopup(false);
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.text.trim()) {
      alert("Question cannot be empty!");
      return;
    }
    setQuestions([...questions, newQuestion]);
    setNewQuestion(null);
  };

  const handleOptionChange = (index, value) => {
    let updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleCorrectAnswerToggle = (option) => {
    if (newQuestion.type === "Single Correct MCQ") {
      setNewQuestion({ ...newQuestion, correctAnswers: [option] });
    } else if (newQuestion.type === "Multiple Correct MCQ") {
      let updatedCorrectAnswers = [...newQuestion.correctAnswers];
      if (updatedCorrectAnswers.includes(option)) {
        updatedCorrectAnswers = updatedCorrectAnswers.filter((ans) => ans !== option);
      } else {
        updatedCorrectAnswers.push(option);
      }
      setNewQuestion({ ...newQuestion, correctAnswers: updatedCorrectAnswers });
    }
  };

  const handleSubjectiveAnswerChange = (e) => {
    setNewQuestion({ ...newQuestion, correctAnswers: [e.target.value] });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Questions</h2>

      {questions.map((q, index) => (
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

          {/* Show 'Add Next Question' only for the last question */}
          {index === questions.length - 1 && !newQuestion && (
            <button
              className="mt-2 text-blue-500 font-bold"
              onClick={() => setShowPopup(true)}
            >
              ➕ Add Next Question
            </button>
          )}
        </div>
      ))}

      {/* Show Popup for selecting question type */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">Select Question Type</h3>
            {["Single Correct MCQ", "Multiple Correct MCQ", "Subjective"].map((type) => (
              <button
                key={type}
                className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
                onClick={() => handleAddQuestion(type)}
              >
                {type}
              </button>
            ))}
            <button className="block mt-4 text-red-500 font-bold" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Input fields for adding a new question */}
      {newQuestion && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <label className="block text-gray-700 font-medium">Question:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter your question"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
          />

          {/* Options for MCQs */}
          {(newQuestion.type === "Single Correct MCQ" || newQuestion.type === "Multiple Correct MCQ") && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium">Options:</label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <input
                    type={newQuestion.type === "Single Correct MCQ" ? "radio" : "checkbox"}
                    className="ml-2"
                    checked={newQuestion.correctAnswers.includes(option)}
                    onChange={() => handleCorrectAnswerToggle(option)}
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

          {/* Subjective Answer */}
          {newQuestion.type === "Subjective" && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium">Correct Answer:</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter correct answer"
                value={newQuestion.correctAnswers[0]}
                onChange={handleSubjectiveAnswerChange}
              />
            </div>
          )}

          {/* Save Button */}
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            onClick={handleSaveQuestion}
          >
            Save Question
          </button>
        </div>
      )}

      {/* Show "Add First Question" if no questions exist */}
      {questions.length === 0 && !newQuestion && (
        <button
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          onClick={() => setShowPopup(true)}
        >
          ➕ Add First Question
        </button>
      )}
    </div>
  );
}
