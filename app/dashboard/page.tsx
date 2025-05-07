"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import RoleFormModal from "../components/RoleFormModal";
import RoleBox from "../components/RoleBox";
import { useRouter } from "next/navigation";
import StudentDetails from "../components/StudentDetails";
import ClubOfficerDetails from "../components/ClubOfficerDetails";
import UniversityAdminDetails from "../components/UniversityAdminDetails";
import { RoleDetails, UserRoles } from "../types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoles>({});
  const [isLoading, setIsLoading] = useState(true);
  const [roleDetails, setRoleDetails] = useState<RoleDetails>({});
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);

  // Effect to fetch user roles
  const fetchUserRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/roles');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user roles');
      }
      
      const data = await response.json();
      setUserRoles(data);
      setError(null); // Clear any previous errors

      // Fetch details for all roles at once
      const roleDetailsPromises = Object.entries(data).map(async ([key, value]) => {
        if (!value) return null;
        
        const roleType = key.replace('_id', '');
        const roleName = (roleType === 'officer' ? 'club_officer' :
                        roleType === 'admin' ? 'university_admin' :
                        roleType === 'organizer' ? 'event_organizer' :
                        roleType) as keyof RoleDetails;

        try {
          const response = await fetch('/api/roles/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: roleName, roleId: value })
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch ${roleName} details`);
          }

          const details = await response.json();
          return { roleName, details: details.details };
        } catch (error) {
          console.error(`Error fetching ${roleName} details:`, error);
          return null;
        }
      });

      const roleDetailsResults = await Promise.all(roleDetailsPromises);
      const newRoleDetails = roleDetailsResults.reduce((acc, result) => {
        if (result) {
          acc[result.roleName] = result.details;
        }
        return acc;
      }, {} as RoleDetails);

      setRoleDetails(newRoleDetails);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setError('Failed to load user roles');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles when session is ready
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserRoles();
      // Get the stored role type from localStorage, default to 'student' if not found
      const storedRole = localStorage.getItem('selectedRole') as 'student' | 'club_officer' | 'event_organizer' | 'university_admin' | null;
      setSelectedRoleName(storedRole || 'student');
    }
  }, [status]);

  // Effect to clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleModalSubmit = async (formData: Record<string, string>) => {
    try {
      console.log('Dashboard - Form Data being sent:', formData);
      console.log('Dashboard - Selected Role:', selectedRole);
      
      const response = await fetch('/api/roles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: selectedRole,
          ...formData  // Spread the formData directly instead of nesting it
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Dashboard - API Error:', error);
        throw new Error(error);
      }

      const responseData = await response.json();
      console.log('Dashboard - API Response:', responseData);

      setSuccess(`Successfully added ${selectedRole?.replace('_', ' ')} role`);
      setShowModal(false);
      setSelectedRole(null);
      // Immediately refresh the roles
      await fetchUserRoles();
    } catch (error) {
      console.error('Dashboard - Error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleAddRole = (roleName: string) => {
    setSelectedRole(roleName);
    setShowModal(true);
  };

  const handleSelectRole = (roleName: string) => {
    setSelectedRoleName(roleName);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signin" });
  };

  const renderRoleDetails = () => {
    if (!selectedRoleName || !roleDetails[selectedRoleName as keyof RoleDetails]) return null;

    const details = roleDetails[selectedRoleName as keyof RoleDetails];
    if (!details) return null;

    switch (selectedRoleName) {
      case 'student':
        return <StudentDetails details={details as RoleDetails['student']} />;
      case 'club_officer':
        return (
          <ClubOfficerDetails 
            details={details as RoleDetails['club_officer']}
            onShowCreateClubModal={() => setShowModal(true)}
            onShowCreateEventModal={() => setShowModal(true)}
          />
        );
      case 'university_admin':
        return <UniversityAdminDetails details={details as RoleDetails['university_admin']} />;
      default:
        return null;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Log out
            </button>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Your Roles</h2>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {['student', 'club_officer', 'university_admin'].map((roleName) => {
                const roleId = roleName === 'club_officer' ? 'officer_id' : 
                             roleName === 'university_admin' ? 'admin_id' : 
                             roleName === 'event_organizer' ? 'organizer_id' :
                             `${roleName}_id`;
                return (
                  <RoleBox
                    key={roleName}
                    roleName={roleName}
                    roleId={userRoles[roleId as keyof typeof userRoles]}
                    userRoles={userRoles}
                    onAddRole={handleAddRole}
                    isSelected={selectedRoleName === roleName}
                    onSelect={handleSelectRole}
                  />
                );
              })}
            </div>
            {renderRoleDetails()}
          </div>
        </div>
      </div>

      <RoleFormModal
        isOpen={showModal}
        selectedRole={selectedRole || ''}
        session={session}
        userRoles={userRoles}
        onSubmit={handleModalSubmit}
        onClose={() => {
          setShowModal(false);
          setSelectedRole(null);
        }}
      />
    </div>
  );
} 