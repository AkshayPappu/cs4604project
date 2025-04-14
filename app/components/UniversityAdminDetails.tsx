import { RoleDetails } from "../types";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface UniversityAdminDetailsProps {
  details: RoleDetails['university_admin'];
}

export default function UniversityAdminDetails({ details }: UniversityAdminDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Total Students</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">2,500</dd>
          </div>
          <div className="p-4 border rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Active Clubs</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">45</dd>
          </div>
          <div className="p-4 border rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Upcoming Events</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">12</dd>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            'New club registration: Robotics Club',
            'Event approval: Career Fair 2024',
            'Budget allocation: Computer Science Club',
            'New student registration: John Smith'
          ].map((activity, index) => (
            <div key={index} className="flex items-center p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{activity}</span>
              <span className="ml-auto text-sm text-gray-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Reports Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Reports</h3>
        <div className="space-y-4">
          {[
            'Monthly User Activity Report',
            'Club Budget Utilization Report',
            'Event Attendance Analysis',
            'System Performance Metrics'
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{report}</span>
              <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Download
              </button>
            </div>
          ))}
        </div>
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