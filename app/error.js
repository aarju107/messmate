'use client';

export default function Error({ reset }) {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="text-slate-500 mt-1 mb-6">Please try again.</p>
        <button onClick={reset} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Retry</button>
      </div>
    </div>
  );
}
