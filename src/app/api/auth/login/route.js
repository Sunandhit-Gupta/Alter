import User from '@/app/models/user';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(request) {
    const { email, password } = await request.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
        return Response.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return Response.json({ token, user }, { status: 200 });
}
