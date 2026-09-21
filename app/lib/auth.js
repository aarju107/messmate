import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import User from '@/app/models/User';
import connectDB from './db';
import { SESSION_COOKIE, verifySession } from './session';

export const json = (data, status = 200) => Response.json(data, { status });

export function isValidId(id) {
  return typeof id === 'string' && mongoose.isValidObjectId(id);
}

// Admin = role "admin" in DB, or email listed in ADMIN_EMAILS (comma separated),
// or _id equal to ADMIN_ID.
export function isAdminUser(user) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const emails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (user.email && emails.includes(user.email.toLowerCase())) return true;
  return !!process.env.ADMIN_ID && user._id.toString() === process.env.ADMIN_ID;
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

// Current user from a verified session (null if not logged in / user deleted)
export async function getCurrentUser() {
  const session = await getSession();
  if (!session || !isValidId(session.uid)) return null;
  await connectDB();
  return User.findById(session.uid);
}

// For API routes: returns { user } or { error: Response }
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { error: json({ error: 'Not authenticated' }, 401) };
  return { user };
}

export async function requireAdmin() {
  const { user, error } = await requireUser();
  if (error) return { error };
  if (!isAdminUser(user)) {
    return { error: json({ error: 'Admin access only' }, 403) };
  }
  return { user };
}
