import { RoleDetails } from "../types";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface StudentDetailsProps {
  details: RoleDetails['student'];
}

export default function StudentDetails({ details }: StudentDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/roles/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'student', formData })
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
      {/* Student Profile Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Student Profile</h3>
          <button 
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Major</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.major || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Classification</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.classification || 'Not specified'}</dd>
          </div>
        </dl>
      </div>

      {/* Available Clubs Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Clubs</h3>
        <div className="space-y-4">
          {/* Mock data for clubs */}
          {['Computer Science Club', 'Engineering Society', 'Math Club'].map((club) => (
            <div key={club} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{club}</span>
              <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Join Club
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Events Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Events</h3>
        <div className="space-y-4">
          {/* Mock data for registered events */}
          {['Hackathon 2024', 'Career Fair', 'Tech Talk'].map((event) => (
            <div key={event} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{event}</span>
                <span className="text-sm text-gray-500">Registered</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Events Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Events</h3>
        <div className="space-y-4">
          {/* Mock data for available events */}
          {['Workshop: Web Development', 'Guest Speaker: AI', 'Networking Event'].map((event) => (
            <div key={event} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{event}</span>
              <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Sign Up
              </button>
            </div>
          ))}
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        roleType="student"
        currentData={details}
      />
    </div>
  );
} 