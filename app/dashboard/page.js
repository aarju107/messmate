'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
  });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintMessage, setComplaintMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching user...');
        const userResponse = await fetch('/api/auth/me');
        
        if (!userResponse.ok) {
          console.log('⚠️ Not authenticated');
          router.push('/login');
          return;
        }

        const userData = await userResponse.json();
        console.log('✅ User fetched');
        setUser(userData.user);

        console.log('🍽️ Fetching menu...');
        const menuResponse = await fetch('/api/menu');
        
        if (menuResponse.ok) {
          try {
            const menuData = await menuResponse.json();
            console.log('✅ Menu fetched:', menuData);
            setMenu(menuData.menu);
          } catch (parseError) {
            console.log('⚠️ Menu parse error:', parseError.message);
            setMenu(null);
          }
        } else {
          console.log('⚠️ Menu not found (status:', menuResponse.status + ')');
          setMenu(null);
        }

        setLoading(false);

      } catch (error) {
        console.error('❌ Error:', error.message);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setSubmittingComplaint(true);
    setComplaintMessage({ type: '', text: '' });

    try {
      console.log('📤 Submitting complaint...');

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintForm),
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      if (!response.ok) {
        setComplaintMessage({ type: 'error', text: data.error || 'Failed to submit complaint' });
        setSubmittingComplaint(false);
        return;
      }

      setComplaintMessage({ type: 'success', text: '✅ Complaint submitted successfully!' });
      console.log('✅ Complaint created');

      setComplaintForm({
        title: '',
        description: '',
      });

      setSubmittingComplaint(false);

    } catch (error) {
      console.error('❌ Error:', error.message);
      setComplaintMessage({ type: 'error', text: 'Network error. Please try again.' });
      setSubmittingComplaint(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('❌ Logout error:', error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600">Loading...</p>
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
            
            {loading ? (
              <p className="text-gray-600">Loading menu...</p>
            ) : menu ? (
              <div className="space-y-2 text-gray-600">
                <p>🥐 Breakfast: <span className="font-semibold">{menu.breakfast}</span></p>
                <p>🍜 Lunch: <span className="font-semibold">{menu.lunch}</span></p>
                <p>🥤 Snacks: <span className="font-semibold">{menu.snacks}</span></p>
                <p>🍛 Dinner: <span className="font-semibold">{menu.dinner}</span></p>
              </div>
            ) : (
              <p className="text-yellow-600">Menu not available for today</p>
            )}
          </div>

          {/* Submit Complaint */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎫 Submit Complaint</h2>
            
            {complaintMessage.type === 'success' && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {complaintMessage.text}
              </div>
            )}

            {complaintMessage.type === 'error' && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {complaintMessage.text}
              </div>
            )}

            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={complaintForm.title}
                  onChange={handleComplaintChange}
                  placeholder="e.g., Food quality issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm placeholder-gray-600"
                  disabled={submittingComplaint}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Description</label>
                <textarea
                  name="description"
                  value={complaintForm.description}
                  onChange={handleComplaintChange}
                  placeholder="Describe your complaint..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm placeholder-gray-600"
                  disabled={submittingComplaint}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingComplaint}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 text-sm"
              >
                {submittingComplaint ? '⏳ Submitting...' : '📤 Submit Complaint'}
              </button>
            </form>
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
    </div>
  );
}