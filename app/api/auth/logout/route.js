import { cookies } from 'next/headers';
import { json } from '@/app/lib/auth';
import { SESSION_COOKIE } from '@/app/lib/session';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return json({ success: true, message: 'Logged out successfully' });
}
