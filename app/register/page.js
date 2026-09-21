'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../components/AuthShell';
import { Alert, Field, btn, btnBase, inputCls, ring } from '../components/ui';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const mismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mismatch) return setMessage({ type: 'error', text: 'Passwords do not match' });
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Registration failed' });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Account created! Redirecting to login...' });
      setTimeout(() => router.push('/login'), 1200);
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setLoading(false);
    }
  };

  const input = `${inputCls} ${ring.blue}`;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join MessMate to view menus and raise complaints."
      footer={<>Already have an account?{' '}<Link href="/login" className="text-blue-600 hover:underline font-semibold">Login here</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Alert type={message.type}>{message.text}</Alert>

        <Field label="Full name" id="name">
          <input id="name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange}
            placeholder="Your name" disabled={loading} required className={input} />
        </Field>

        <Field label="Email" id="email">
          <input id="email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange}
            placeholder="you@example.com" disabled={loading} required className={input} />
        </Field>

        <Field label="Password" id="password" hint="At least 6 characters">
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password"
              value={formData.password} onChange={handleChange} minLength={6} disabled={loading} required
              className={`${input} pr-16`} />
            <button type="button" onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 text-sm text-slate-500 hover:text-slate-800"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>

        <Field label="Confirm password" id="confirmPassword">
          <input id="confirmPassword" type={showPassword ? 'text' : 'password'} name="confirmPassword" autoComplete="new-password"
            value={formData.confirmPassword} onChange={handleChange} disabled={loading} required
            aria-invalid={!!mismatch} className={`${input} ${mismatch ? '!border-red-400' : ''}`} />
          {mismatch && <p className="text-xs text-red-600 mt-1">Passwords do not match</p>}
        </Field>

        <button type="submit" disabled={loading} className={`${btnBase} ${btn.blue} w-full`}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
