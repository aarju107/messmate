'use client';

import { useRouter } from 'next/navigation';
import { btn, btnBase } from './ui';

export default function LogoutButton({ className = '', onDone, variant = 'ghost' }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      onDone?.();
      router.replace('/login');
    }
  };

  return (
    <button onClick={handleLogout} className={`${btnBase} ${btn[variant]} ${className}`}>
      Logout
    </button>
  );
}
