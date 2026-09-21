import connectDB from '@/app/lib/db';
import Menu from '@/app/models/Menu';
import { json, requireAdmin, requireUser } from '@/app/lib/auth';
import { dayRange, parseDateKey } from '@/app/lib/dates';

const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];

// GET /api/menu?date=YYYY-MM-DD  -> that day's menu ({ menu: null } if none)
// GET /api/menu?recent=1         -> (admin) latest 14 menus
export async function GET(request) {
  try {
    const { user, error } = await requireUser();
    if (error) return error;
    await connectDB();

    const params = request.nextUrl.searchParams;

    if (params.get('recent')) {
      const admin = await requireAdmin();
      if (admin.error) return admin.error;
      const menus = await Menu.find().sort({ date: -1 }).limit(14);
      return json({ success: true, menus });
    }

    const date = parseDateKey(params.get('date') || new Date().toISOString().slice(0, 10));
    if (!date) return json({ error: 'Invalid date, use YYYY-MM-DD' }, 400);

    const menu = await Menu.findOne({ date: dayRange(date) });
    return json({ success: true, menu });
  } catch (error) {
    console.error('Menu GET error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}

// POST (admin) creates the menu for a date, or updates it if one already exists
export async function POST(request) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const date = parseDateKey(body.date);
    if (!date) return json({ error: 'A valid date is required' }, 400);

    const meals = {};
    for (const meal of MEALS) {
      const value = String(body[meal] || '').trim();
      if (!value) return json({ error: 'All fields are required' }, 400);
      if (value.length > 300) return json({ error: `${meal} is too long (max 300 characters)` }, 400);
      meals[meal] = value;
    }

    const existing = await Menu.findOne({ date: dayRange(date) });
    if (existing) {
      Object.assign(existing, meals);
      await existing.save();
      return json({ success: true, message: 'Menu updated', menu: existing });
    }

    const menu = await Menu.create({ ...meals, date, createdBy: user._id });
    return json({ success: true, message: 'Menu added successfully', menu }, 201);
  } catch (error) {
    console.error('Menu POST error:', error.message);
    return json({ error: 'Something went wrong' }, 500);
  }
}
