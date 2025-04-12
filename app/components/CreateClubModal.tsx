import { useState } from 'react';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { club_name: string; club_description: string; club_budget: string }) => void;
}

export default function CreateClubModal({ isOpen, onClose, onSubmit }: CreateClubModalProps) {
  const [formData, setFormData] = useState({
    club_name: '',
    club_description: '',
    club_budget: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-transparent bg-opacity-80 transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Club</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="club_name" className="block text-sm font-medium text-gray-700">
              Club Name
            </label>
            <input
              type="text"
              id="club_name"
              value={formData.club_name}
              onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="club_description" className="block text-sm font-medium text-gray-700">
              Club Description
            </label>
            <textarea
              id="club_description"
              value={formData.club_description}
              onChange={(e) => setFormData({ ...formData, club_description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="club_budget" className="block text-sm font-medium text-gray-700">
              Club Budget
            </label>
            <input
              type="number"
              id="club_budget"
              value={formData.club_budget}
              onChange={(e) => setFormData({ ...formData, club_budget: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
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
              Create Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 