import { connectToDatabase } from '@/lib/mongodb';
import User from '@/app/models/user';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    const { name, email, password, role, rollNumber, batch, courseCodes } = await request.json();
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return Response.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        rollNumber,
        batch,
        courseCodes: Array.isArray(courseCodes) ? courseCodes : (courseCodes?.split(',') || [])
    });

    await newUser.save();
    return Response.json({ message: 'User registered successfully', user: newUser }, { status: 201 });
}
