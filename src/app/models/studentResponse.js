import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String, required: true },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      givenAnswer: [{ type: String }], // Array for MCQ and Subjective
      autoScore: { type: Number, default: 0 },
      finalScore: { type: Number, default: 0 },
      feedback: { type: String }
    }
  ],
  totalAutoScore: { type: Number, default: 0 },
  totalFinalScore: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.StudentResponse || mongoose.model('StudentResponse', responseSchema);
