import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["teacher", "student"], required: true },

        // ✅ Unique only for students (null values are ignored)
        rollNumber: { type: String, unique: true, sparse: true, default: null },

        // ✅ Only students will have batch & courses
        batch: { type: String, default: null },
        courseCodes: { type: [String], default: [] },

        // ✅ Quizzes submitted by the user (students only)
        submittedQuizzes: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
            default: []
        },

        // ✅ Automatically managed timestamps
    },
    { timestamps: true } // Adds `createdAt` and `updatedAt`
);

// ✅ Ensure model isn't recompiled if already defined
export default mongoose.models.User || mongoose.model("User", userSchema);
