import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Get form data
    const { email, password } = await request.json();
    console.log('📝 Login attempt:', email);

    // Validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('⚠️ User not found:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 400 }
      );
    }
    console.log('✅ User found:', user._id);

    // Compare password
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      console.log('⚠️ Wrong password for:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 400 }
      );
    }
    console.log('✅ Password correct');

    // Create session cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', user._id.toString(), {
      httpOnly: true,        // Can't be accessed by JavaScript (security!)
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict',    // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    console.log('🍪 Session cookie set');

    // Return success (don't send password!)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Login error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}