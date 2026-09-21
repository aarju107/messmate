'use client';

import { btn, btnBase } from './ui';

export const MEALS = [
  { key: 'breakfast', icon: '🥐', label: 'Breakfast', tint: 'bg-amber-50 border-amber-200' },
  { key: 'lunch', icon: '🍛', label: 'Lunch', tint: 'bg-emerald-50 border-emerald-200' },
  { key: 'snacks', icon: '🥤', label: 'Snacks', tint: 'bg-sky-50 border-sky-200' },
  { key: 'dinner', icon: '🍽️', label: 'Dinner', tint: 'bg-violet-50 border-violet-200' },
];

// Local (browser) calendar date as YYYY-MM-DD
export function localDateKey(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(key, n) {
  const d = new Date(`${key}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatDateLong(key) {
  return new Date(`${key}T00:00:00.000Z`).toLocaleDateString(undefined, {
    timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// Prev / date input / next / Today
export function DateSwitcher({ value, onChange, tone = 'blue' }) {
  const today = localDateKey();
  const ringCls = tone === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-blue-500';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" aria-label="Previous day" onClick={() => onChange(addDays(value, -1))}
        className={`${btnBase} ${btn.ghost} !px-3`}>‹</button>
      <input
        type="date"
        aria-label="Date"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className={`px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 ${ringCls}`}
      />
      <button type="button" aria-label="Next day" onClick={() => onChange(addDays(value, 1))}
        className={`${btnBase} ${btn.ghost} !px-3`}>›</button>
      {value !== today && (
        <button type="button" onClick={() => onChange(today)} className={`${btnBase} ${btn.ghost}`}>Today</button>
      )}
    </div>
  );
}

export default function MealGrid({ menu, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-busy="true">
        {MEALS.map((m) => <div key={m.key} className="h-24 rounded-xl bg-slate-100 animate-pulse" />)}
      </div>
    );
  }
  if (!menu) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
        <p className="text-3xl mb-2" aria-hidden="true">🍽️</p>
        <p className="text-slate-600 font-medium">No menu added for this day yet</p>
        <p className="text-slate-400 text-sm">Check back later.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {MEALS.map((m) => (
        <div key={m.key} className={`rounded-xl border p-4 ${m.tint}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span aria-hidden="true">{m.icon}</span> {m.label}
          </p>
          <p className="mt-1.5 text-slate-900 font-medium break-words">{menu[m.key]}</p>
        </div>
      ))}
    </div>
  );
}
