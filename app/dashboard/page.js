'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('🔍 Fetching current user...');
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (!response.ok) {
          console.log('⚠️ Not authenticated, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('✅ User fetched:', data.user);
        setUser(data.user);
        setLoading(false);

      } catch (error) {
        console.error('❌ Error fetching user:', error.message);
        setError('Failed to load user info');
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      // Clear cookie by logging out
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('❌ Logout error:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Menu */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Today's Menu</h2>
            <div className="space-y-2 text-gray-600">
              <p>🥐 Breakfast: Aloo Puri</p>
              <p>🍜 Lunch: Paneer Butter Masala</p>
              <p>🥤 Snacks: Tea & Biscuits</p>
              <p>🍛 Dinner: Dal Rice</p>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎫 Complaints</h2>
            <div className="space-y-2 text-gray-600">
              <p>Status: <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span></p>
              <p className="text-sm">Complaint about lunch quality</p>
              <button className="text-blue-600 hover:underline mt-2">View all</button>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📢 Announcements</h2>
            <div className="space-y-2 text-gray-600 text-sm">
              <p>Menu updated for next week</p>
              <p>Mess maintenance on Saturday</p>
              <button className="text-blue-600 hover:underline mt-2">View all</button>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">🚀 Coming Soon</h3>
          <p className="text-gray-600">Rate meals, submit complaints, view detailed menus, and more!</p>
        </div>
      </div>
    </div>
  );
}