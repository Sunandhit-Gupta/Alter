import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student'], required: true },
    rollNumber: { type: String, unique: true, sparse: true }, // Only for students
    batch: { type: String },
    courseCodes: [{ type: String }], // Courses user is associated with
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
