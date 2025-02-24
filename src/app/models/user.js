import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student"], required: true },
    rollNumber: { type: String, unique: true, sparse: true },
    batch: { type: String },
    courseCodes: [{ type: String }],
    submittedQuizzes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Ensure the model isn't recompiled
export default mongoose.models.User || mongoose.model("User", userSchema);
