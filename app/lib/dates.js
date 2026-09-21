// Menus are stored at UTC midnight of a calendar date ("YYYY-MM-DD"),
// so results don't depend on the server's timezone.
export function parseDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return null;
  return d;
}

export function dayRange(date) {
  return { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) };
}
