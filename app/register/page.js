'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // 'success' or 'error'

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
      console.log('📤 Sending registration data to API...');
      
      const response = await fetch('/api/auth/register', {
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
        setMessage({ type: 'error', text: data.error || 'Registration failed' });
        setLoading(false);
        return;
      }

      // Success
      setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
      console.log('✅ User registered:', data.userId);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);

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
          Create Account
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
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

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
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
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
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}