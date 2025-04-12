import { useState } from 'react';
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
                onChange={(e) => setFormData({ ...studentData, major: e.target.value })}
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
                onChange={(e) => setFormData({ ...studentData, classification: e.target.value })}
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
                onChange={(e) => setFormData({ ...officerData, position_title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="officer_start_date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="officer_start_date"
                value={officerData.officer_start_date || ''}
                onChange={(e) => setFormData({ ...officerData, officer_start_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="officer_end_date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="officer_end_date"
                value={officerData.officer_end_date || ''}
                onChange={(e) => setFormData({ ...officerData, officer_end_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
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
                onChange={(e) => setFormData({ ...organizerData, organizer_name: e.target.value })}
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
                onChange={(e) => setFormData({ ...organizerData, contact_email: e.target.value })}
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
                onChange={(e) => setFormData({ ...organizerData, contact_phone: e.target.value })}
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
                onChange={(e) => setFormData({ ...adminData, admin_name: e.target.value })}
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
                onChange={(e) => setFormData({ ...adminData, admin_email: e.target.value })}
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
                onChange={(e) => setFormData({ ...adminData, admin_phone: e.target.value })}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit {roleType.replace('_', ' ')} Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 