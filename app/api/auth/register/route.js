import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Get form data
    const { name, email, password, confirmPassword } = await request.json();
    console.log('📝 Received data:', { name, email });

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ error: 'Passwords do not match' }),
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return new Response(
        JSON.stringify({ error: 'User already exists with this email' }),
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log('🔐 Password hashed');

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log('✅ User created:', newUser._id);

    // Return success (don't send password back!)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
        userId: newUser._id,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}