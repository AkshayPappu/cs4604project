import { useState } from 'react';

interface RoleBoxProps {
  roleName: string;
  roleId: string | undefined | null;
  userRoles: {
    student_id?: string;
    officer_id?: string;
    organizer_id?: string;
    admin_id?: string;
  };
  onAddRole: (roleName: string) => void;
  isSelected: boolean;
  onSelect: (roleName: string) => void;
}

export default function RoleBox({ roleName, roleId, userRoles, onAddRole, isSelected, onSelect }: RoleBoxProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const getRoleStatus = () => {
    if (roleId) {
      return {
        status: "Added ✓",
        isAdded: true,
      };
    }
    return {
      status: "Add Role",
      isAdded: false,
      isDisabled: roleName === 'club_officer' && !userRoles.student_id,
      tooltip: roleName === 'club_officer' && !userRoles.student_id 
        ? "Must be a student first"
        : undefined
    };
  };

  const roleStatus = getRoleStatus();

  const handleUnaffiliate = async () => {
    if (!confirm('Are you sure you want to unaffiliate from this role? This action cannot be undone.')) {
      return;
    }

    try {
      setIsRemoving(true);
      const response = await fetch('/api/roles/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: roleName,
          roleId: roleId // Pass the role ID to identify which entity to delete
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove role');
      }

      // Reset the role box state
      setIsRemoving(false);
      
      // Refresh the parent component
      window.location.reload();
    } catch (error) {
      console.error('Error removing role:', error);
      alert('Failed to remove role. Please try again.');
      setIsRemoving(false);
    }
  };

  return (
    <div 
      className={`bg-white overflow-hidden shadow rounded-lg ${
        roleId ? 'cursor-pointer' : 'cursor-default'
      } transition-all duration-200 ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={() => roleId && onSelect(roleName)}
    >
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 capitalize">
          {roleName.replace('_', ' ')}
        </h3>
        <div className="mt-5">
          {roleStatus.isAdded ? (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700">
                {roleStatus.status}
              </span>
              <button
                onClick={handleUnaffiliate}
                disabled={isRemoving}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isRemoving ? 'Removing...' : 'Unaffiliate'}
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddRole(roleName);
                }}
                disabled={roleStatus.isDisabled}
                onMouseEnter={() => roleStatus.isDisabled && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  roleStatus.isDisabled
                    ? 'bg-gray-400 hover:bg-gray-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {roleStatus.status}
              </button>
              {showTooltip && roleStatus.tooltip && (
                <div className="absolute z-10 w-48 px-3 py-2 mt-2 text-sm text-white bg-gray-900 rounded-md shadow-lg">
                  {roleStatus.tooltip}
                </div>
              )}
            </div>
          )}
          {roleStatus.isDisabled && (
            <p className="mt-2 text-sm text-gray-500">
              Requires Student Role
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 