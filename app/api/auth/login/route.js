import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';
import { json, isAdminUser } from '@/app/lib/auth';
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from '@/app/lib/session';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const password = body.password;

    if (!email || !password || typeof password !== 'string') {
      return json({ error: 'Email and password are required' }, 400);
    }

    const user = await User.findOne({ email }).select('+password');
    const passwordMatch = user ? await bcryptjs.compare(password, user.password) : false;
    if (!user || !passwordMatch) {
      return json({ error: 'Invalid email or password' }, 401);
    }

    const role = isAdminUser(user) ? 'admin' : 'student';
    const token = await signSession({ uid: user._id.toString(), role });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}
