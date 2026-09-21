'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import MealGrid, { formatDateLong, localDateKey } from '../../components/MealCard';
import { Card, CardTitle, PageHeader, Spinner, StatusBadge, btn, btnBase } from '../../components/ui';
import { useMe } from '../../lib/useMe';

export default function AdminDashboard() {
  const { user, loading } = useMe('admin');
  const [stats, setStats] = useState(null);
  const [menu, setMenu] = useState(null);
  const [pending, setPending] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const today = localDateKey();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [s, m, c] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch(`/api/menu?date=${today}`),
          fetch('/api/complaints'),
        ]);
        if (s.ok) setStats((await s.json()).stats);
        if (m.ok) setMenu((await m.json()).menu);
        if (c.ok) setPending((await c.json()).complaints.filter((x) => x.status === 'Pending').slice(0, 5));
      } catch {} finally {
        setDataLoading(false);
      }
    })();
  }, [user, today]);

  const cards = stats && [
    ['👥', 'Users', stats.totalUsers, 'bg-blue-50 text-blue-700'],
    ['📋', 'Menus added', stats.totalMenus, 'bg-purple-50 text-purple-700'],
    ['⏳', 'Pending', stats.pendingComplaints, 'bg-amber-50 text-amber-700'],
    ['✅', 'Resolved', stats.resolvedComplaints, 'bg-emerald-50 text-emerald-700'],
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      {loading || !user ? (
        <Spinner />
      ) : (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Here's what's happening in the mess today." />

          {cards && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {cards.map(([icon, label, value, tint]) => (
                <Card key={label} className="!p-4 sm:!p-5">
                  <div className={`h-10 w-10 grid place-items-center rounded-xl text-xl mb-3 ${tint}`} aria-hidden="true">{icon}</div>
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
              <CardTitle icon="📋" right={
                <Link href="/admin/menu" className={`${btnBase} ${btn.purple}`}>{dataLoading ? 'Manage menu' : menu ? 'Edit menu' : 'Add menu'}</Link>
              }>Today&apos;s menu</CardTitle>
              <p className="text-sm text-slate-500 -mt-2 mb-4">{formatDateLong(today)}</p>
              <MealGrid menu={menu} loading={dataLoading} />
            </Card>

            <Card className="lg:col-span-2">
              <CardTitle icon="🎫" right={
                <Link href="/admin/complaints" className="text-sm font-semibold text-purple-700 hover:underline">View all</Link>
              }>Pending complaints</CardTitle>
              {dataLoading ? (
                <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
              ) : pending.length === 0 ? (
                <p className="text-slate-500 py-6 text-center">All caught up ✨</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {pending.map((c) => (
                    <li key={c._id} className="py-3">
                      <div className="flex justify-between gap-3">
                        <p className="font-medium text-slate-900 truncate">{c.title}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{c.studentId?.name || 'Unknown'} · {new Date(c.createdAt).toLocaleDateString()}</p>
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
