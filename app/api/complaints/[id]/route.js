import connectDB from '@/app/lib/db';
import Complaint from '@/app/models/Complaint';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    const { id } = params;
    console.log('📝 Updating complaint:', id);

    // Get update data
    const { status } = await request.json();

    // Validation
    if (!status || !['Pending', 'Resolved'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status' }),
        { status: 400 }
      );
    }

    // Update complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('studentId', 'name email');

    if (!updatedComplaint) {
      return new Response(
        JSON.stringify({ error: 'Complaint not found' }),
        { status: 404 }
      );
    }

    console.log('✅ Complaint updated:', updatedComplaint._id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Complaint updated successfully',
        complaint: updatedComplaint,
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