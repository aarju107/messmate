import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-6xl mb-3" aria-hidden="true">🍽️</p>
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="text-slate-500 mt-1 mb-6">That page isn&apos;t on the menu.</p>
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Go home</Link>
      </div>
    </div>
  );
}
