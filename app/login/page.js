'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      console.log('📤 Sending login data to API...');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      if (!response.ok) {
        // Error response
        setMessage({ type: 'error', text: data.error || 'Login failed' });
        setLoading(false);
        return;
      }

      // Success
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      console.log('✅ User logged in:', data.user);

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('❌ Network error:', error.message);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="max-w-md mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Login
        </h2>

        {/* Success Message */}
        {message.type === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message.text}
          </div>
        )}

        {/* Error Message */}
        {message.type === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 rounded-lg transition ${
              loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}