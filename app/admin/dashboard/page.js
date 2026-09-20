'use client';

import { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('📤 Submitting menu to API...');

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to add menu' });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Menu added successfully!' });
      console.log('✅ Menu created');

      setFormData({
        breakfast: '',
        lunch: '',
        snacks: '',
        dinner: '',
        date: new Date().toISOString().split('T')[0],
      });

      setLoading(false);

    } catch (error) {
      console.error('❌ Error:', error.message);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AdminNavbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          📋 Add Menu
        </h1>

        {message.type === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message.text}
          </div>
        )}

        {message.type === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">🥐 Breakfast</label>
            <input
              type="text"
              name="breakfast"
              value={formData.breakfast}
              onChange={handleChange}
              placeholder="e.g., Dosa, Sambar, Chutney"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">🍜 Lunch</label>
            <input
              type="text"
              name="lunch"
              value={formData.lunch}
              onChange={handleChange}
              placeholder="e.g., Paneer Butter Masala, Rice, Naan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">🥤 Snacks</label>
            <input
              type="text"
              name="snacks"
              value={formData.snacks}
              onChange={handleChange}
              placeholder="e.g., Tea, Samosa, Biscuits"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">🍛 Dinner</label>
            <input
              type="text"
              name="dinner"
              value={formData.dinner}
              onChange={handleChange}
              placeholder="e.g., Dal Makhani, Roti, Rice"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-600"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? '⏳ Adding...' : '📤 Add Menu'}
          </button>
        </form>
      </div>
    </div>
  );
}