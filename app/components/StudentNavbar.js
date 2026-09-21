import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function StudentNavbar() {
  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-blue-600 text-white text-base" aria-hidden="true">🍽</span>
          MessMate
        </Link>
        <LogoutButton variant="ghost" />
      </div>
    </nav>
  );
}
