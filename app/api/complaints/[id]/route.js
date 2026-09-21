import connectDB from '@/app/lib/db';
import Complaint from '@/app/models/Complaint';
import { isValidId, json, requireAdmin } from '@/app/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;
    await connectDB();

    const { id } = await params; // params is a Promise in Next 15+
    if (!isValidId(id)) return json({ error: 'Invalid complaint id' }, 400);

    const { status } = await request.json().catch(() => ({}));
    if (!['Pending', 'Resolved'].includes(status)) {
      return json({ error: 'Invalid status' }, 400);
    }

    const complaint = await Complaint.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).populate(
      'studentId',
      'name email'
    );
    if (!complaint) return json({ error: 'Complaint not found' }, 404);

    return json({ success: true, message: 'Complaint updated successfully', complaint });
  } catch (error) {
    console.error('Complaint PATCH error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}
