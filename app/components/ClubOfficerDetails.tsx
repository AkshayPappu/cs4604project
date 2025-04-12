import { RoleDetails } from "../types";
import { useState } from "react";
import CreateClubModal from "./CreateClubModal";
import EditProfileModal from "./EditProfileModal";

interface ClubOfficerDetailsProps {
  details: RoleDetails['club_officer'];
  onShowCreateClubModal: () => void;
  onShowCreateEventModal: () => void;
}

export default function ClubOfficerDetails({ 
  details, 
  onShowCreateClubModal,
  onShowCreateEventModal 
}: ClubOfficerDetailsProps) {
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCreateClub = async (formData: { club_name: string; club_description: string; club_budget: string }) => {
    try {
      const response = await fetch('/api/clubs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create club');
      }

      setShowCreateClubModal(false);
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  const handleEditSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/roles/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'club_officer', formData })
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
      {/* Club Officer Profile Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Club Officer Profile</h3>
          <button 
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Position</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.position_title || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.officer_start_date || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">End Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{details?.officer_end_date || 'Not specified'}</dd>
          </div>
        </dl>
      </div>

      {/* Create Club Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Create New Club</h3>
          <button 
            onClick={() => setShowCreateClubModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Club
          </button>
        </div>
      </div>

      {/* Club Members Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Club Members</h3>
        <div className="space-y-4">
          {/* Mock data for club members */}
          {['John Doe', 'Jane Smith', 'Bob Johnson'].map((member) => (
            <div key={member} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{member}</span>
              <span className="text-sm text-gray-500">Member</span>
            </div>
          ))}
        </div>
      </div>

      {/* Club Events Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Club Events</h3>
          <button 
            onClick={onShowCreateEventModal}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create New Event
          </button>
        </div>
        <div className="space-y-4">
          {/* Mock data for club events */}
          {['Weekly Meeting', 'Guest Speaker', 'Workshop'].map((event) => (
            <div key={event} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{event}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Reports Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Reports</h3>
        <div className="space-y-4">
          {/* Mock data for previous reports */}
          {['Monthly Activity Report - March 2024', 'Event Attendance Report - Spring 2024', 'Member Engagement Report - Q1 2024'].map((report) => (
            <div key={report} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{report}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Download
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Generation Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Generate New Report</h3>
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Generate Report
          </button>
        </div>
      </div>

      <CreateClubModal
        isOpen={showCreateClubModal}
        onClose={() => setShowCreateClubModal(false)}
        onSubmit={handleCreateClub}
      />

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        roleType="club_officer"
        currentData={details}
      />
    </div>
  );
} 