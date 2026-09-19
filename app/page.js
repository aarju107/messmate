import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MessMate
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Manage your hostel mess meals, give feedback, and track complaints in one place.
        </p>
        <div className="space-x-4">
          <a href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block">
            Get Started
          </a>
          <a href="/login" className="bg-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-400 inline-block">
            Sign In
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-12">Why MessMate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h4 className="font-bold text-lg mb-3">📋 View Menus</h4>
              <p className="text-gray-600">Check today's meals and upcoming menus.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h4 className="font-bold text-lg mb-3">⭐ Rate & Feedback</h4>
              <p className="text-gray-600">Rate meals and give honest feedback.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h4 className="font-bold text-lg mb-3">🎫 Track Complaints</h4>
              <p className="text-gray-600">Submit and track issue resolution.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-16">
        <p>&copy; 2024 MessMate. All rights reserved.</p>
      </footer>
    </div>
  );
}