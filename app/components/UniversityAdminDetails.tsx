import { RoleDetails } from "../types";
import { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";

interface UniversityAdminDetailsProps {
  details: RoleDetails['university_admin'];
}

export default function UniversityAdminDetails({ details }: UniversityAdminDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({ total_students: 0, total_clubs: 0, total_upcoming_events: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const response = await fetch("/api/university/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setStats({ total_students: 0, total_clubs: 0, total_upcoming_events: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleEditSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/roles/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'university_admin', formData })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const response = await fetch("/api/university/report");
      if (!response.ok) throw new Error("Failed to generate report");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "university-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* University Admin Profile Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">University Admin Profile</h3>
          <button 
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Admin Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.admin_name || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Admin Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.admin_email || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Admin Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.admin_phone || 'Not specified'}</dd>
          </div>
        </dl>
      </div>

      {/* University Statistics Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">University Statistics</h3>
        {loadingStats ? (
          <div>Loading statistics...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Total Students</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.total_students}</dd>
            </div>
            <div className="p-4 border rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Active Clubs</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.total_clubs}</dd>
            </div>
            <div className="p-4 border rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Upcoming Events</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.total_upcoming_events}</dd>
            </div>
          </div>
        )}
      </div>

      {/* Generate University Report Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate University Report</h3>
        <button
          onClick={handleGenerateReport}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          disabled={generatingReport}
        >
          {generatingReport ? "Generating..." : "Generate Report"}
        </button>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        roleType="university_admin"
        currentData={details}
      />
    </div>
  );
} 