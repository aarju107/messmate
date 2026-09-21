import { cookies } from 'next/headers';
import { getCurrentUser, getSession, isAdminUser, json } from '@/app/lib/auth';
import { SESSION_COOKIE } from '@/app/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return json({ error: 'Not authenticated' }, 401);

    const user = await getCurrentUser();
    if (!user) {
      // Valid token but the account no longer exists: drop the cookie so the
      // proxy doesn't bounce the browser between /login and /dashboard.
      (await cookies()).delete(SESSION_COOKIE);
      return json({ error: 'Not authenticated' }, 401);
    }

    return json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: isAdminUser(user) ? 'admin' : 'student',
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}
