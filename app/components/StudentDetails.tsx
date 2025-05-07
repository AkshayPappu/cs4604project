import { RoleDetails } from "../types";
import { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";

interface StudentDetailsProps {
  details: RoleDetails['student'];
}

export default function StudentDetails({ details }: StudentDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [availableClubs, setAvailableClubs] = useState<any[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [myClubs, setMyClubs] = useState<any[]>([]);
  const [loadingMyClubs, setLoadingMyClubs] = useState(false);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [signingUp, setSigningUp] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loadingRegisteredEvents, setLoadingRegisteredEvents] = useState(false);

  useEffect(() => {
    const fetchAvailableClubs = async () => {
      setLoadingClubs(true);
      try {
        const response = await fetch("/api/clubs/available");
        if (!response.ok) throw new Error("Failed to fetch available clubs");
        const data = await response.json();
        setAvailableClubs(data || []);
      } catch (err) {
        setAvailableClubs([]);
      } finally {
        setLoadingClubs(false);
      }
    };
    fetchAvailableClubs();
  }, []);

  // Fetch my clubs
  const fetchMyClubs = async () => {
    setLoadingMyClubs(true);
    try {
      const response = await fetch("/api/clubs/my");
      if (!response.ok) throw new Error("Failed to fetch my clubs");
      const data = await response.json();
      setMyClubs(data || []);
    } catch (err) {
      setMyClubs([]);
    } finally {
      setLoadingMyClubs(false);
    }
  };

  useEffect(() => {
    fetchMyClubs();
  }, []);

  // Fetch available events
  const fetchAvailableEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch("/api/events/available");
      if (!response.ok) throw new Error("Failed to fetch available events");
      const data = await response.json();
      setAvailableEvents(data || []);
    } catch (err) {
      setAvailableEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch registered events
  const fetchRegisteredEvents = async () => {
    setLoadingRegisteredEvents(true);
    try {
      const response = await fetch("/api/events/registered");
      if (!response.ok) throw new Error("Failed to fetch registered events");
      const data = await response.json();
      setRegisteredEvents(data || []);
    } catch (err) {
      setRegisteredEvents([]);
    } finally {
      setLoadingRegisteredEvents(false);
    }
  };

  // Handle event sign up
  const handleSignUp = async (eventId: string) => {
    setSigningUp(eventId);
    try {
      const response = await fetch("/api/events/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign up for event");
      }

      // Refresh both available and registered events lists
      await Promise.all([fetchAvailableEvents(), fetchRegisteredEvents()]);
    } catch (err) {
      console.error("Error signing up for event:", err);
      alert(err instanceof Error ? err.message : "Failed to sign up for event");
    } finally {
      setSigningUp(null);
    }
  };

  useEffect(() => {
    fetchAvailableEvents();
    fetchRegisteredEvents();
  }, [myClubs]);

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
        {loadingClubs ? (
          <div>Loading clubs...</div>
        ) : availableClubs.length === 0 ? (
          <div className="text-gray-500">No available clubs found.</div>
        ) : (
          <div className="space-y-4">
            {availableClubs.map((club) => (
              <div key={club.club_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">{club.club_name}</span>
                  <div className="text-xs text-gray-500">{club.club_description}</div>
                  <div className="text-xs text-gray-500">Budget: ${club.club_budget}</div>
                </div>
                <button
                  className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  onClick={async () => {
                    await fetch("/api/membership/join", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ club_id: club.club_id }),
                    });
                    setAvailableClubs((prev) => prev.filter((c) => c.club_id !== club.club_id));
                    fetchMyClubs();
                  }}
                >
                  Join Club
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Clubs Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Clubs</h3>
        {loadingMyClubs ? (
          <div>Loading clubs...</div>
        ) : myClubs.length === 0 ? (
          <div className="text-gray-500">You are not a member of any clubs.</div>
        ) : (
          <div className="space-y-4">
            {myClubs.map((club) => (
              <div key={club.club_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">{club.club_name}</span>
                  <div className="text-xs text-gray-500">{club.club_description}</div>
                  <div className="text-xs text-gray-500">Budget: ${club.club_budget}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Events Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Events</h3>
        {loadingRegisteredEvents ? (
          <div>Loading events...</div>
        ) : registeredEvents.length === 0 ? (
          <div className="text-gray-500">You are not registered for any events.</div>
        ) : (
          <div className="space-y-4">
            {registeredEvents.map((event) => (
              <div key={event.event_id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{event.event_name}</span>
                    <div className="text-xs text-gray-500">{event.club_name}</div>
                    <div className="text-xs text-gray-500">Date: {event.event_date}</div>
                    <div className="text-xs text-gray-500">Location: {event.event_location}</div>
                  </div>
                  <span className="text-sm text-green-600">Registered</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Events Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Events</h3>
        {loadingEvents ? (
          <div>Loading events...</div>
        ) : availableEvents.length === 0 ? (
          <div className="text-gray-500">No available events found.</div>
        ) : (
          <div className="space-y-4">
            {availableEvents.map((event) => (
              <div key={event.event_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">{event.event_name}</span>
                  <div className="text-xs text-gray-500">{event.club_name}</div>
                  <div className="text-xs text-gray-500">Date: {event.event_date}</div>
                  <div className="text-xs text-gray-500">Location: {event.event_location}</div>
                </div>
                <button
                  onClick={() => handleSignUp(event.event_id)}
                  disabled={signingUp === event.event_id}
                  className={`px-3 py-1 text-sm font-medium text-white rounded-md ${
                    signingUp === event.event_id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {signingUp === event.event_id ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            ))}
          </div>
        )}
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