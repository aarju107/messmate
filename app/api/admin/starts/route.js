import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import Menu from '@/app/models/Menu';
import Complaint from '@/app/models/Complaint';
import { json, requireAdmin } from '@/app/lib/auth';

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;
    await connectDB();

    const [totalUsers, totalMenus, totalComplaints, pendingComplaints] = await Promise.all([
      User.countDocuments(),
      Menu.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
    ]);

    return json({
      success: true,
      stats: {
        totalUsers,
        totalMenus,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints: totalComplaints - pendingComplaints,
      },
    });
  } catch (error) {
    console.error('Stats error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}
