import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  type: {
    type: String,
    enum: ['Single Correct MCQ', 'Multiple Correct MCQ', 'Subjective'],
    required: true
  },
  text: { type: String, required: true },
  options: [{ type: String }], // For MCQs
  correctAnswers: [{ type: String }], // Array for all types
  points: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', questionSchema);
