'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Alert, Card, PageHeader, Spinner, StatusBadge, btn, btnBase } from '../../components/ui';
import { useMe } from '../../lib/useMe';

const FILTERS = ['All', 'Pending', 'Resolved'];

export default function AdminComplaints() {
  const { user, loading: authLoading } = useMe('admin');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/complaints');
        const data = await res.json();
        if (!res.ok) setError(data.error || 'Failed to load complaints');
        else setComplaints(data.complaints);
      } catch {
        setError('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const setStatus = async (id, status) => {
    setUpdating((p) => ({ ...p, [id]: true }));
    setError('');
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Failed to update complaint');
      else setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch {
      setError('Network error');
    } finally {
      setUpdating((p) => ({ ...p, [id]: false }));
    }
  };

  const count = (f) => (f === 'All' ? complaints.length : complaints.filter((c) => c.status === f).length);
  const visible = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

  const action = (c) =>
    c.status === 'Pending' ? (
      <button onClick={() => setStatus(c._id, 'Resolved')} disabled={updating[c._id]} className={`${btnBase} ${btn.purple} !py-1.5`}>
        {updating[c._id] ? 'Saving...' : 'Resolve'}
      </button>
    ) : (
      <button onClick={() => setStatus(c._id, 'Pending')} disabled={updating[c._id]} className={`${btnBase} ${btn.ghost} !py-1.5`}>
        {updating[c._id] ? 'Saving...' : 'Reopen'}
      </button>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      {authLoading || !user ? (
        <Spinner />
      ) : (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <PageHeader title="Student complaints" subtitle="Review issues raised by students and mark them resolved." />

          <div className="flex gap-2 mb-5" role="tablist" aria-label="Filter complaints">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-purple-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                {f} <span className={filter === f ? 'text-purple-200' : 'text-slate-400'}>{count(f)}</span>
              </button>
            ))}
          </div>

          <Alert type="error" className="mb-5">{error}</Alert>

          {loading ? (
            <Spinner label="Loading complaints..." />
          ) : visible.length === 0 ? (
            <Card className="text-center py-12 text-slate-500">
              {filter === 'All' ? 'No complaints yet. Great! ✨' : `No ${filter.toLowerCase()} complaints.`}
            </Card>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Student', 'Complaint', 'Status', 'Date', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 align-top">
                        <td className="px-5 py-4 text-sm">
                          <p className="font-medium text-slate-900">{c.studentId?.name || 'Unknown'}</p>
                          <p className="text-slate-500">{c.studentId?.email || 'N/A'}</p>
                        </td>
                        <td className="px-5 py-4 text-sm max-w-md">
                          <p className="font-medium text-slate-900">{c.title}</p>
                          <p className="text-slate-600 break-words">{c.description}</p>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                        <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4 text-right">{action(c)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="md:hidden space-y-3">
                {visible.map((c) => (
                  <li key={c._id}>
                    <Card>
                      <div className="flex justify-between gap-3 mb-2">
                        <p className="font-semibold text-slate-900">{c.title}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-slate-600 break-words">{c.description}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {c.studentId?.name || 'Unknown'} · {c.studentId?.email || 'N/A'} · {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3">{action(c)}</div>
                    </Card>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      )}
    </div>
  );
}
