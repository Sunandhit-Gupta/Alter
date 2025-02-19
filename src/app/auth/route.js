"use client";
// src/app/api/auth/route.js
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register API
export async function POST(request) {
    const { name, email, password, rollNumber } = await request.json();
    await connectToDatabase();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, rollNumber, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email }, JWT_SECRET, { expiresIn: '1h' });
        return Response.json({ token, user: newUser }, { status: 201 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

// Login API
export async function PUT(request) {
    const { email, password } = await request.json();
    await connectToDatabase();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return Response.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '1h' });
        return Response.json({ token, user }, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
