export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">MessMate</h1>
        <div className="space-x-4">
          <a href="/login" className="hover:text-blue-100">Login</a>
          <a href="/register" className="hover:text-blue-100">Register</a>
        </div>
      </div>
    </nav>
  );
}