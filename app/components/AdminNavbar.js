'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from './LogoutButton';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/complaints', label: 'Complaints' },
];

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const linkCls = (href) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      pathname === href ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-20 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex justify-between items-center">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/20 text-base" aria-hidden="true">📊</span>
            MessMate <span className="text-xs font-semibold bg-white/20 rounded-full px-2 py-0.5">Admin</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)} aria-current={pathname === l.href ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
            <LogoutButton className="ml-3 !bg-white/10 !text-white !border-white/30 hover:!bg-white/20" />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl px-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`block ${linkCls(l.href)}`} onClick={() => setIsOpen(false)}>
                {l.label}
              </Link>
            ))}
            <LogoutButton className="w-full mt-2 !bg-white/10 !text-white !border-white/30" onDone={() => setIsOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  );
}
