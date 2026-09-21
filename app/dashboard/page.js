'use client';

import { useEffect, useState } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import MealGrid, { DateSwitcher, formatDateLong, localDateKey } from '../components/MealCard';
import { Alert, Card, CardTitle, Field, PageHeader, Spinner, StatusBadge, btn, btnBase, inputCls, ring } from '../components/ui';
import { useMe } from '../lib/useMe';

export default function Dashboard() {
  const { user, loading } = useMe('student');
  const [menuState, setMenuState] = useState({ key: null, menu: null });
  const [menuDate, setMenuDate] = useState(() => localDateKey());
  const [reload, setReload] = useState(0);
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/complaints');
        if (res.ok) setComplaints((await res.json()).complaints);
      } catch {}
    })();
  }, [user, reload]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      let menu = null;
      try {
        const res = await fetch(`/api/menu?date=${menuDate}`);
        menu = res.ok ? (await res.json()).menu : null;
      } catch {}
      if (!cancelled) setMenuState({ key: menuDate, menu });
    })();
    return () => { cancelled = true; };
  }, [user, menuDate]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to submit' });
        return;
      }
      setMessage({ type: 'success', text: 'Complaint submitted. We\'ll update its status here.' });
      setForm({ title: '', description: '' });
      setReload((n) => n + 1);
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const input = `${inputCls} ${ring.blue}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />
      {loading || !user ? (
        <Spinner />
      ) : (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <PageHeader title={`Hi, ${user.name.split(' ')[0]} 👋`} subtitle={user.email}>
            {complaints.length > 0 && (
              <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2">
                {pending} pending · {complaints.length - pending} resolved
              </p>
            )}
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
              <CardTitle icon="📋">Mess menu</CardTitle>
              <div className="mb-4">
                <DateSwitcher value={menuDate} onChange={setMenuDate} />
                <p className="text-sm text-slate-500 mt-2">{formatDateLong(menuDate)}</p>
              </div>
              <MealGrid menu={menuState.menu} loading={menuState.key !== menuDate} />
            </Card>

            <Card className="lg:col-span-2">
              <CardTitle icon="🎫">Submit a complaint</CardTitle>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Alert type={message.type}>{message.text}</Alert>
                <Field label="Title" id="title">
                  <input id="title" type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Cold food at dinner" maxLength={120} disabled={submitting} required className={input} />
                </Field>
                <Field label="Description" id="description" hint={`${form.description.length}/2000`}>
                  <textarea id="description" name="description" value={form.description} onChange={handleChange}
                    placeholder="What happened?" rows={4} maxLength={2000} disabled={submitting} required className={input} />
                </Field>
                <button type="submit" disabled={submitting} className={`${btnBase} ${btn.blue} w-full`}>
                  {submitting ? 'Submitting...' : 'Submit complaint'}
                </button>
              </form>
            </Card>

            <Card className="lg:col-span-5">
              <CardTitle icon="📨">My complaints</CardTitle>
              {complaints.length === 0 ? (
                <p className="text-slate-500">You haven&apos;t submitted any complaints.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <li key={c._id} className="py-3 flex justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{c.title}</p>
                        <p className="text-sm text-slate-600 break-words">{c.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="shrink-0"><StatusBadge status={c.status} /></div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </main>
      )}
    </div>
  );
}
