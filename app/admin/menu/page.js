'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { DateSwitcher, MEALS, formatDateLong, localDateKey } from '../../components/MealCard';
import { Alert, Card, CardTitle, Field, PageHeader, Spinner, btn, btnBase, inputCls, ring } from '../../components/ui';
import { useMe } from '../../lib/useMe';

const EMPTY = { breakfast: '', lunch: '', snacks: '', dinner: '' };
const dateKeyOf = (menu) => new Date(menu.date).toISOString().slice(0, 10);

export default function AdminMenu() {
  const { user, loading } = useMe('admin');
  const [date, setDate] = useState(() => localDateKey());
  const [form, setForm] = useState(EMPTY);
  const [exists, setExists] = useState(false);
  const [loadedFor, setLoadedFor] = useState(null);
  const [recent, setRecent] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/menu?recent=1');
        if (res.ok) setRecent((await res.json()).menus);
      } catch {}
    })();
  }, [user, reload]);

  const changeDate = (d) => {
    setDate(d);
    setMessage({ type: '', text: '' });
  };

  // Prefill the form when the date changes and a menu already exists
  useEffect(() => {
    if (!user || !date) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/menu?date=${date}`);
        const menu = res.ok ? (await res.json()).menu : null;
        if (cancelled) return;
        setExists(!!menu);
        setForm(menu ? Object.fromEntries(MEALS.map(({ key }) => [key, menu[key]])) : EMPTY);
        setLoadedFor(date);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [user, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to save menu' });
        return;
      }
      setExists(true);
      setMessage({ type: 'success', text: data.message });
      setReload((n) => n + 1);
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const input = `${inputCls} ${ring.purple}`;
  const formLoading = loadedFor !== date;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      {loading || !user ? (
        <Spinner />
      ) : (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <PageHeader title="Manage menu" subtitle="Pick a date, then add or edit what's being served." />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <DateSwitcher value={date} onChange={changeDate} tone="purple" />
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm text-slate-500">{formatDateLong(date)}</p>
                    {formLoading ? (
                      <span className="text-xs text-slate-400">Loading...</span>
                    ) : (
                    <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${exists ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                      {exists ? 'Editing existing menu' : 'New menu'}
                    </span>
                    )}
                  </div>
                </div>

                <Alert type={message.type}>{message.text}</Alert>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MEALS.map(({ key, icon, label }) => (
                    <Field key={key} label={`${icon} ${label}`} id={key}>
                      <input id={key} type="text" value={form[key]} maxLength={300} disabled={saving || formLoading} required
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder="e.g. Poha, tea" className={input} />
                    </Field>
                  ))}
                </div>

                <button type="submit" disabled={saving || formLoading} className={`${btnBase} ${btn.purple} w-full`}>
                  {saving ? 'Saving...' : exists ? 'Update menu' : 'Save menu'}
                </button>
              </form>
            </Card>

            <Card className="lg:col-span-2">
              <CardTitle icon="🗓️">Recent menus</CardTitle>
              {recent.length === 0 ? (
                <p className="text-slate-500">No menus yet.</p>
              ) : (
                <ul className="space-y-2">
                  {recent.map((m) => {
                    const key = dateKeyOf(m);
                    return (
                      <li key={m._id}>
                        <button type="button" onClick={() => changeDate(key)}
                          className={`w-full text-left rounded-xl border px-3 py-2.5 transition ${key === date ? 'border-purple-400 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <p className="font-medium text-slate-900 text-sm">{formatDateLong(key)}</p>
                          <p className="text-xs text-slate-500 truncate">{m.breakfast} · {m.lunch} · {m.snacks} · {m.dinner}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>
        </main>
      )}
    </div>
  );
}
