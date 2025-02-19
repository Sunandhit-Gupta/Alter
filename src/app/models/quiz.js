import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  quizTitle: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // In minutes
  batch: { type: String, required: true },
  courseCode: { type: String, required: true },
  rollRange: {
    from: { type: String },
    to: { type: String }
  },
  uniqueRolls: [{ type: String }], // Specific roll numbers
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  shuffleQuestions: { type: Boolean, default: false },
  status: { type: String, enum: ['Draft', 'Published', 'Ongoing', 'Completed'], default: 'Draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', quizSchema);
