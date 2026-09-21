'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../components/AuthShell';
import { Alert, Field, btn, btnBase, inputCls, ring } from '../components/ui';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Login failed' });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      router.replace(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see today's menu and track your complaints."
      footer={<>Don&apos;t have an account?{' '}<Link href="/register" className="text-blue-600 hover:underline font-semibold">Register here</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Alert type={message.type}>{message.text}</Alert>

        <Field label="Email" id="email">
          <input id="email" type="email" name="email" autoComplete="email" value={formData.email}
            onChange={handleChange} placeholder="you@example.com" disabled={loading} required
            className={`${inputCls} ${ring.blue}`} />
        </Field>

        <Field label="Password" id="password">
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password"
              value={formData.password} onChange={handleChange} placeholder="Your password" disabled={loading} required
              className={`${inputCls} ${ring.blue} pr-16`} />
            <button type="button" onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 text-sm text-slate-500 hover:text-slate-800"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={loading} className={`${btnBase} ${btn.blue} w-full`}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthShell>
  );
}
