import { useState } from 'react';

export default function QuizDetailForm() {
  const [quizTitle, setQuizTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [batch, setBatch] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [fromRoll, setFromRoll] = useState('');
  const [toRoll, setToRoll] = useState('');
  const [uniqueRoll, setUniqueRoll] = useState('');
  const [uniqueRolls, setUniqueRolls] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizDetails = {
      quizTitle,
      description,
      duration,
      batch,
      courseCode,
      rollRange: { from: fromRoll, to: toRoll },
      uniqueRolls,
    };
    console.log('Quiz Details Submitted:', quizDetails);
    alert('Quiz details saved successfully!');
  };

  const addUniqueRoll = () => {
    if (uniqueRoll && !uniqueRolls.includes(uniqueRoll)) {
      setUniqueRolls([...uniqueRolls, uniqueRoll]);
      setUniqueRoll('');
    }
  };

  const removeUniqueRoll = (roll) => {
    setUniqueRolls(uniqueRolls.filter((r) => r !== roll));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Quiz Title:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Description:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Duration (minutes):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Batch:</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Course Code:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., CSPC-304"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
        </div>

        {/* Access Section */}
        <div>
          <label className="block text-gray-700 font-medium">Access:</label>

          {/* Roll Number Range */}
          <label className="block text-gray-400 font-thin">Roll Number Range:</label>
          <div className="flex space-x-4">
            <div>
              <label className="block text-gray-400 font-thin">From:</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={fromRoll}
                onChange={(e) => setFromRoll(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 font-thin">To:</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={toRoll}
                onChange={(e) => setToRoll(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Unique Roll Numbers */}
          <div className="mt-4">
            <label className="block text-gray-400 font-thin">Add Individual Roll Numbers:</label>
            <div className="flex space-x-4">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Roll Number"
                value={uniqueRoll}
                onChange={(e) => setUniqueRoll(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={addUniqueRoll}
              >
                Add
              </button>
            </div>
          </div>

          {/* Display Added Roll Numbers */}
          {uniqueRolls.length > 0 && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <h4 className="text-gray-700 font-medium">Added Roll Numbers:</h4>
              <ul className="flex flex-wrap gap-2">
                {uniqueRolls.map((roll, index) => (
                  <li
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex items-center space-x-2"
                  >
                    <span>{roll}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeUniqueRoll(roll)}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Save Quiz Details
        </button>
      </form>
    </div>
  );
}
