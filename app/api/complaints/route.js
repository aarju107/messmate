import connectDB from '@/app/lib/db';
import Complaint from '@/app/models/Complaint';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Get all complaints
    const complaints = await Complaint.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    console.log('✅ Fetched complaints:', complaints.length);

    return new Response(
      JSON.stringify({
        success: true,
        complaints,
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

export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Get userId from cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401 }
      );
    }

    // Get form data
    const { title, description } = await request.json();
    console.log('📝 Received complaint from user:', userId);

    // Validation
    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: 'Title and description are required' }),
        { status: 400 }
      );
    }

    // Create complaint
    const newComplaint = await Complaint.create({
      title,
      description,
      studentId: userId,
      status: 'Pending',
    });

    console.log('✅ Complaint created:', newComplaint._id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Complaint submitted successfully',
        complaintId: newComplaint._id,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}