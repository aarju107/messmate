import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-blue-600 text-white text-base" aria-hidden="true">🍽</span>
          MessMate
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Login</Link>
          <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700">Register</Link>
        </div>
      </div>
    </nav>
  );
}
