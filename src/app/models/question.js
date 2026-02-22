import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  type: {
    type: String,
    enum: ['Single Correct MCQ', 'Multiple Correct MCQ', 'Subjective'],
    required: true
  },
  images: {
  type: [String],
  default: []
},
  text: { type: String, required: true },
  options: [{ type: String }], // For MCQs
  correctAnswers: [{ type: String }], // Array for all types
  points: { type: Number, default: 1 }
},
{ timestamps: true }
);

// 🟢 Prevent OverwriteModelError
export default mongoose.models.Question || mongoose.model('Question', questionSchema);
