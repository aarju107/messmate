import connectDB from '@/app/lib/db';
import Complaint from '@/app/models/Complaint';
import { isAdminUser, json, requireUser } from '@/app/lib/auth';

// Admins get every complaint; students only get their own.
export async function GET() {
  try {
    const { user, error } = await requireUser();
    if (error) return error;
    await connectDB();

    const filter = isAdminUser(user) ? {} : { studentId: user._id };
    const complaints = await Complaint.find(filter)
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    return json({ success: true, complaints });
  } catch (error) {
    console.error('Complaints GET error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireUser();
    if (error) return error;
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();

    if (!title || !description) {
      return json({ error: 'Title and description are required' }, 400);
    }
    if (title.length > 120) return json({ error: 'Title is too long (max 120 characters)' }, 400);
    if (description.length > 2000) {
      return json({ error: 'Description is too long (max 2000 characters)' }, 400);
    }

    const complaint = await Complaint.create({
      title,
      description,
      studentId: user._id,
      status: 'Pending',
    });

    return json(
      { success: true, message: 'Complaint submitted successfully', complaintId: complaint._id },
      201
    );
  } catch (error) {
    console.error('Complaints POST error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}
