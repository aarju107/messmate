import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import bcryptjs from 'bcryptjs';
import { json } from '@/app/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const { password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return json({ error: 'All fields are required' }, 400);
    }
    if (typeof password !== 'string' || password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, 400);
    }
    if (password !== confirmPassword) {
      return json({ error: 'Passwords do not match' }, 400);
    }

    if (await User.findOne({ email })) {
      return json({ error: 'User already exists with this email' }, 409);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    // role is never taken from the request: everyone registers as a student
    const newUser = await User.create({ name, email, password: hashedPassword });

    return json({ success: true, message: 'User registered successfully', userId: newUser._id }, 201);
  } catch (error) {
    if (error?.code === 11000) return json({ error: 'User already exists with this email' }, 409);
    if (error?.name === 'ValidationError') {
      return json({ error: Object.values(error.errors)[0].message }, 400);
    }
    console.error('Registration error:', error.message);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}
