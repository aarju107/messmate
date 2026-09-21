import Link from 'next/link';
import Navbar from './components/Navbar';

const features = [
  { icon: '📋', title: 'View menus', text: "Check any day's breakfast, lunch, snacks and dinner from your phone." },
  { icon: '🎫', title: 'Raise complaints', text: 'Report an issue in seconds and follow it until it is resolved.' },
  { icon: '📊', title: 'Admin tools', text: 'Mess staff publish menus and resolve complaints from one dashboard.' },
];

const steps = [
  ['1', 'Create an account', 'Register with your email in under a minute.'],
  ['2', 'Check the menu', "See what's being served today or plan ahead."],
  ['3', 'Speak up', 'Submit a complaint and watch its status change.'],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <header className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="inline-block text-sm font-medium text-blue-700 bg-blue-100 rounded-full px-3 py-1 mb-5">
            Hostel mess, simplified
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Know what&apos;s on the plate. <span className="text-blue-600">Fix what isn&apos;t.</span>
          </h1>
          <p className="text-lg text-slate-600 mt-5 max-w-2xl mx-auto">
            MessMate puts your hostel mess menu and complaints in one place, for students and mess staff.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="px-7 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
              Get started
            </Link>
            <Link href="/login" className="px-7 py-3 rounded-xl bg-white text-slate-800 font-semibold border border-slate-300 hover:bg-slate-50">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Why MessMate?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-blue-50 text-2xl mb-4" aria-hidden="true">{f.icon}</div>
              <h3 className="font-semibold text-lg text-slate-900 mb-1">{f.title}</h3>
              <p className="text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">How it works</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(([n, title, text]) => (
              <li key={n} className="flex gap-4">
                <span className="h-9 w-9 shrink-0 grid place-items-center rounded-full bg-blue-600 text-white font-bold">{n}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="text-slate-600 text-sm">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="text-center text-sm text-slate-500 py-8">
        &copy; {new Date().getFullYear()} MessMate. All rights reserved.
      </footer>
    </div>
  );
}
