export default function QuizQuestions({ questions, responses, onAnswerChange }) {
  return (
    <>
      {questions.map((question) => (
        <div key={question._id} className="mb-6">
          <p className="font-semibold text-lg mb-3 text-gray-800">
            {question.text}{" "}
            <span className="text-sm text-gray-500">
              ({question.points || 1} {question.points === 1 ? "mark" : "marks"})
            </span>
          </p>

          {question.type === "Subjective" ? (
            <SubjectiveQuestion
              questionId={question._id}
              value={responses[question._id]?.[0] || ""}
              onChange={(value) => onAnswerChange(question._id, value, question.type)}
            />
          ) : (
            <MultipleChoiceQuestion
              questionId={question._id}
              options={question.options}
              type={question.type}
              selectedOptions={responses[question._id] || []}
              onChange={(value) => onAnswerChange(question._id, value, question.type)}
            />
          )}
        </div>
      ))}
    </>
  );
}

function SubjectiveQuestion({ questionId, value, onChange }) {
  return (
    <textarea
      className="w-full p-3 border rounded-lg"
      placeholder="Type your answer here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function MultipleChoiceQuestion({ questionId, options, type, selectedOptions, onChange }) {
  const isSingleChoice = type === "Single Correct MCQ";

  return (
    <>
      {options.map((option) => (
        <label
          key={option}
          className="block p-3 border rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-2"
        >
          <input
            type={isSingleChoice ? "radio" : "checkbox"}
            name={`q-${questionId}`}
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(option)}
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </>
  );
}