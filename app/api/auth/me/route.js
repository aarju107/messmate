import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Get userId from cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      console.log('⚠️ No userId cookie found');
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401 }
      );
    }

    console.log('🔍 Looking for user:', userId);

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log('⚠️ User not found');
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    console.log('✅ User found:', user.name);

    // Return user info (not password!)
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}