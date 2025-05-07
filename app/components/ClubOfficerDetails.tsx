import { RoleDetails } from "../types";
import { useState, useEffect } from "react";
import CreateClubModal from "./CreateClubModal";
import EditProfileModal from "./EditProfileModal";
import CreateEventModal from "./CreateEventModal";

interface ClubOfficerDetailsProps {
  details: RoleDetails['club_officer'];
  onShowCreateClubModal: () => void;
  onShowCreateEventModal: () => void;
  onClubCreated?: () => void;
}

export default function ClubOfficerDetails({ 
  details, 
  onShowCreateClubModal,
  onShowCreateEventModal,
  onClubCreated
}: ClubOfficerDetailsProps) {
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [myClubs, setMyClubs] = useState<any[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Fetch officer's clubs
  const fetchMyClubs = async () => {
    if (!details?.club_ids || details.club_ids.length === 0) {
      setMyClubs([]);
      return;
    }
    setLoadingClubs(true);
    try {
      const response = await fetch(`/api/clubs/list-by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_ids: details.club_ids })
      });
      if (!response.ok) throw new Error('Failed to fetch clubs');
      const data = await response.json();
      setMyClubs(data.clubs || []);
    } catch (err) {
      setMyClubs([]);
    } finally {
      setLoadingClubs(false);
    }
  };

  useEffect(() => {
    fetchMyClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details?.club_ids]);

  // When myClubs changes, set the default selected club
  useEffect(() => {
    if (myClubs.length > 0) {
      setSelectedClubId(myClubs[0].club_id);
    } else {
      setSelectedClubId(null);
    }
  }, [myClubs]);

  // Fetch members when selectedClubId changes
  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedClubId) {
        setClubMembers([]);
        return;
      }
      setLoadingMembers(true);
      try {
        const response = await fetch(`/api/clubs/${selectedClubId}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setClubMembers(data || []);
      } catch (err) {
        setClubMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [selectedClubId]);

  // Fetch events when selectedClubId changes
  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedClubId) {
        setClubEvents([]);
        return;
      }
      setLoadingEvents(true);
      try {
        const response = await fetch(`/api/clubs/${selectedClubId}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setClubEvents(data || []);
      } catch (err) {
        setClubEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [selectedClubId]);

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
      if (onClubCreated) await onClubCreated();
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

  const handleCreateEvent = async (formData: { event_name: string; date: string; location: string }) => {
    if (!selectedClubId) return;
    try {
      const response = await fetch(`/api/clubs/${selectedClubId}/events/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("Failed to create event");
      setShowCreateEventModal(false);
      // Refresh events
      const eventsRes = await fetch(`/api/clubs/${selectedClubId}/events`);
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setClubEvents(data || []);
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const handleGenerateReport = async () => {
    try {
      console.log("[GenerateReport] Button clicked");
      setGeneratingReport(true);
      const response = await fetch("/api/reports/generate");
      console.log("[GenerateReport] Response status:", response.status);
      
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      // Get the blob from the response
      const blob = await response.blob();
      console.log("[GenerateReport] Blob received:", blob);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "club-report.pdf";
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[GenerateReport] Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
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

      {/* My Clubs Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">My Clubs</h3>
          <button
            onClick={fetchMyClubs}
            className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            disabled={loadingClubs}
          >
            {loadingClubs ? "Reloading..." : "Reload"}
          </button>
        </div>
        {myClubs.length > 0 && (
          <div className="mb-4">
            <label htmlFor="club-select" className="block text-sm font-medium text-gray-700 mb-1">Select Club:</label>
            <select
              id="club-select"
              value={selectedClubId || ''}
              onChange={e => setSelectedClubId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {myClubs.map(club => (
                <option key={club.club_id} value={club.club_id}>{club.club_name}</option>
              ))}
            </select>
          </div>
        )}
        {loadingClubs ? (
          <div>Loading clubs...</div>
        ) : myClubs.length === 0 ? (
          <div className="text-gray-500">You are not part of any clubs yet.</div>
        ) : (
          <div className="space-y-4">
            {myClubs.filter(club => club.club_id === selectedClubId).map((club) => (
              <div key={club.club_id} className="p-4 border rounded-lg">
                <div className="font-semibold text-gray-900">{club.club_name}</div>
                <div className="text-gray-700 text-sm mb-1">{club.club_description}</div>
                <div className="text-gray-500 text-xs">Budget: ${club.club_budget}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Club Members Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Club Members</h3>
        {loadingMembers ? (
          <div>Loading members...</div>
        ) : clubMembers.length === 0 ? (
          <div className="text-gray-500">No members found for this club.</div>
        ) : (
          <div className="space-y-4">
            {clubMembers.map((member) => (
              <div key={member.student_id} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm font-medium text-gray-900">{member.name}</span>
                <span className="text-sm text-gray-500">Member</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Club Events Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Club Events</h3>
          <button 
            onClick={() => setShowCreateEventModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create New Event
          </button>
        </div>
        {loadingEvents ? (
          <div>Loading events...</div>
        ) : clubEvents.length === 0 ? (
          <div className="text-gray-500">No events found for this club.</div>
        ) : (
          <div className="space-y-4">
            {clubEvents.map((event) => (
              <div key={event.event_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">{event.event_name}</span>
                  <span className="block text-xs text-gray-500">{event.event_date} | {event.event_location}</span>
                </div>
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
        )}
      </div>

      {/* Report Generation Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Generate New Report</h3>
          <button 
            onClick={handleGenerateReport}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            disabled={generatingReport}
          >
            {generatingReport ? "Generating..." : "Generate Report"}
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

      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
} 