'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../../components/AdminNavbar';

export default function AdminComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        console.log('🔍 Fetching all complaints...');
        const response = await fetch('/api/complaints');
        const data = await response.json();

        if (!response.ok) {
          console.log('⚠️ Error fetching complaints:', data.error);
          setError(data.error || 'Failed to load complaints');
          setLoading(false);
          return;
        }

        console.log('✅ Complaints fetched:', data.complaints.length);
        setComplaints(data.complaints);
        setLoading(false);

      } catch (error) {
        console.error('❌ Error:', error.message);
        setError('Failed to load complaints');
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Mark complaint as resolved
  const handleResolve = async (complaintId) => {
    setUpdating(prev => ({ ...prev, [complaintId]: true }));

    try {
      console.log('📤 Updating complaint status...');
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Resolved' }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('⚠️ Error:', data.error);
        setUpdating(prev => ({ ...prev, [complaintId]: false }));
        return;
      }

      console.log('✅ Complaint updated');

      // Update local state
      setComplaints(prev =>
        prev.map(complaint =>
          complaint._id === complaintId
            ? { ...complaint, status: 'Resolved' }
            : complaint
        )
      );

      setUpdating(prev => ({ ...prev, [complaintId]: false }));

    } catch (error) {
      console.error('❌ Error:', error.message);
      setUpdating(prev => ({ ...prev, [complaintId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🎫 Student Complaints
        </h1>

        {loading && (
          <div className="text-center text-gray-600">Loading complaints...</div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            No complaints yet. Great! ✨
          </div>
        )}

        {!loading && complaints.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              {/* Header */}
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{complaint.studentId?.name || 'Unknown'}</p>
                        <p className="text-gray-600">{complaint.studentId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {complaint.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          complaint.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {complaint.status === 'Pending' && (
                        <button
                          onClick={() => handleResolve(complaint._id)}
                          disabled={updating[complaint._id]}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
                        >
                          {updating[complaint._id] ? '⏳' : '✅ Resolve'}
                        </button>
                      )}
                      {complaint.status === 'Resolved' && (
                        <span className="text-gray-600 text-sm">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}