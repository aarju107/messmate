'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Logout error:', error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/admin/dashboard" className="text-2xl font-bold hover:text-purple-200 transition">
            📊 MessMate Admin
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/admin/dashboard" className="hover:text-purple-200 transition font-medium">
              Dashboard
            </Link>
            <Link href="/admin/dashboard" className="hover:text-purple-200 transition font-medium">
              📋 Menu
            </Link>
            <Link href="/admin/complaints" className="hover:text-purple-200 transition font-medium">
              🎫 Complaints
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link
              href="/admin/dashboard"
              className="block hover:text-purple-200 transition font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard"
              className="block hover:text-purple-200 transition font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              📋 Menu
            </Link>
            <Link
              href="/admin/complaints"
              className="block hover:text-purple-200 transition font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              🎫 Complaints
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}