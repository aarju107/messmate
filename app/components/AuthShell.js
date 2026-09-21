import Navbar from './Navbar';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">{children}</div>
        <p className="text-center text-slate-600 mt-6 text-sm">{footer}</p>
      </div>
    </div>
  );
}
