import { useState, useEffect } from 'react';
import { RoleDetails } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  roleType: 'student' | 'club_officer' | 'event_organizer' | 'university_admin';
  currentData: RoleDetails[keyof RoleDetails];
}

export default function EditProfileModal({ isOpen, onClose, onSubmit, roleType, currentData }: EditProfileModalProps) {
  const [formData, setFormData] = useState<RoleDetails[typeof roleType]>(currentData as RoleDetails[typeof roleType]);
  const [initialData, setInitialData] = useState<RoleDetails[typeof roleType]>(currentData as RoleDetails[typeof roleType]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(currentData as RoleDetails[typeof roleType]);
      setInitialData(currentData as RoleDetails[typeof roleType]);
      setHasChanges(false);
    }
  }, [isOpen, currentData]);

  const handleChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Check if any field has changed from initial data
    const hasChanges = initialData ? Object.keys(newFormData).some(key => 
      newFormData[key as keyof typeof newFormData] !== initialData[key as keyof typeof initialData]
    ) : true;
    setHasChanges(hasChanges);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasChanges && formData && initialData) {
      try {
        // Create a clean form data object with only the fields that have changed
        const cleanFormData = Object.keys(formData).reduce((acc, key) => {
          const formValue = formData[key as keyof typeof formData];
          const initialValue = initialData[key as keyof typeof initialData];
          if (formValue !== initialValue || (roleType === 'university_admin' && key === 'admin_phone')) {
            acc[key] = formValue || null;
          }
          return acc;
        }, {} as Record<string, any>);

        const response = await fetch('/api/roles/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            role: roleType, 
            formData: cleanFormData 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update profile');
        }

        // Store the current role type in localStorage before reloading
        localStorage.setItem('selectedRole', roleType);
        
        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error('Error updating profile:', error);
        alert(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  const renderFields = () => {
    const typedData = formData as RoleDetails[typeof roleType];
    if (!typedData) return null;

    switch (roleType) {
      case 'student': {
        const studentData = typedData as RoleDetails['student'];
        if (!studentData) return null;
        return (
          <>
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Major
              </label>
              <input
                type="text"
                id="major"
                value={studentData.major || ''}
                onChange={(e) => handleChange('major', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="classification" className="block text-sm font-medium text-gray-700">
                Classification
              </label>
              <select
                id="classification"
                value={studentData.classification || ''}
                onChange={(e) => handleChange('classification', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select classification</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </>
        );
      }
      case 'club_officer': {
        const officerData = typedData as RoleDetails['club_officer'];
        if (!officerData) return null;
        return (
          <>
            <div>
              <label htmlFor="position_title" className="block text-sm font-medium text-gray-700">
                Position Title
              </label>
              <input
                type="text"
                id="position_title"
                value={officerData.position_title || ''}
                onChange={(e) => handleChange('position_title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="officer_start_date" className="block text-sm font-medium text-gray-700">
                Start Date (Optional)
              </label>
              <input
                type="date"
                id="officer_start_date"
                value={officerData.officer_start_date || ''}
                onChange={(e) => handleChange('officer_start_date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="officer_end_date" className="block text-sm font-medium text-gray-700">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="officer_end_date"
                value={officerData.officer_end_date || ''}
                onChange={(e) => handleChange('officer_end_date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </>
        );
      }
      case 'event_organizer': {
        const organizerData = typedData as RoleDetails['event_organizer'];
        if (!organizerData) return null;
        return (
          <>
            <div>
              <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700">
                Organizer Name
              </label>
              <input
                type="text"
                id="organizer_name"
                value={organizerData.organizer_name || ''}
                onChange={(e) => handleChange('organizer_name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                id="contact_email"
                value={organizerData.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contact_phone"
                value={organizerData.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </>
        );
      }
      case 'university_admin': {
        const adminData = typedData as RoleDetails['university_admin'];
        if (!adminData) return null;
        return (
          <>
            <div>
              <label htmlFor="admin_name" className="block text-sm font-medium text-gray-700">
                Admin Name
              </label>
              <input
                type="text"
                id="admin_name"
                value={adminData.admin_name || ''}
                onChange={(e) => handleChange('admin_name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                type="email"
                id="admin_email"
                value={adminData.admin_email || ''}
                onChange={(e) => handleChange('admin_email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="admin_phone" className="block text-sm font-medium text-gray-700">
                Admin Phone
              </label>
              <input
                type="tel"
                id="admin_phone"
                value={adminData.admin_phone || ''}
                onChange={(e) => handleChange('admin_phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {renderFields()}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                hasChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 