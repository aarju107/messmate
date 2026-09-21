// Small shared UI kit (no hooks, usable from server and client components)

export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ icon, children, right }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </h2>
      {right}
    </div>
  );
}

const alertStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
};

export function Alert({ type = 'info', children, className = '' }) {
  if (!children) return null;
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`border rounded-xl px-4 py-3 text-sm ${alertStyles[type]} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  const resolved = status === 'Resolved';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${resolved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
}

export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500" role="status">
      <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function Field({ label, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-500';

// tone: 'blue' (student) | 'purple' (admin)
export const ring = { blue: 'focus:ring-blue-500 focus:border-blue-500', purple: 'focus:ring-purple-500 focus:border-purple-500' };

export const btn = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500',
  ghost: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

export const btnBase =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
