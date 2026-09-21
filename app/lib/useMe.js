'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Loads the logged-in user and redirects if they're not allowed on this page.
// requiredRole: 'student' | 'admin'
export function useMe(requiredRole) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return router.replace('/login');
        const { user } = await res.json();
        if (requiredRole === 'admin' && user.role !== 'admin') return router.replace('/dashboard');
        if (requiredRole === 'student' && user.role === 'admin') return router.replace('/admin/dashboard');
        if (!off) setUser(user);
      } catch {
        // network error: leave user null
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, [router, requiredRole]);

  return { user, loading };
}
