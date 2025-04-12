import { Session } from "next-auth";

interface UserRoles {
  student_id?: string;
  officer_id?: string;
  organizer_id?: string;
  university_admin_id?: string;
}

interface RoleFormModalProps {
  isOpen: boolean;
  selectedRole: string | null;
  session: Session | null;
  userRoles: UserRoles;
  onSubmit: (formData: Record<string, string>) => void;
  onClose: () => void;
}

interface RoleFormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

const ROLE_FIELDS: Record<string, RoleFormField[]> = {
  student: [
    {
      name: "major",
      label: "Major",
      type: "text"
    },
    {
      name: "classification",
      label: "Classification",
      type: "select",
      options: [
        { value: "", label: "Select Classification" },
        { value: "Freshman", label: "Freshman" },
        { value: "Sophomore", label: "Sophomore" },
        { value: "Junior", label: "Junior" },
        { value: "Senior", label: "Senior" }
      ]
    }
  ],
  club_officer: [
    {
      name: "position_title",
      label: "Position Title",
      type: "text",
      required: true
    },
    {
      name: "officer_start_date",
      label: "Start Date",
      type: "date"
    },
    {
      name: "officer_end_date",
      label: "End Date",
      type: "date"
    }
  ],
  event_organizer: [
    {
      name: "organizer_name",
      label: "Organizer Name",
      type: "text"
    },
    {
      name: "contact_email",
      label: "Contact Email",
      type: "email"
    },
    {
      name: "contact_phone",
      label: "Contact Phone",
      type: "tel"
    }
  ],
  university_admin: [
    {
      name: "admin_name",
      label: "Admin Name",
      type: "text"
    },
    {
      name: "admin_email",
      label: "Admin Email",
      type: "email"
    },
    {
      name: "admin_phone",
      label: "Admin Phone",
      type: "tel"
    }
  ]
};

export default function RoleFormModal({ isOpen, selectedRole, session, userRoles, onSubmit, onClose }: RoleFormModalProps) {
  if (!isOpen || !selectedRole) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    ROLE_FIELDS[selectedRole]?.forEach((field) => {
      const value = formData.get(field.name);
      if (value) data[field.name] = value.toString();
    });
    onSubmit(data);
  };

  const renderForm = () => {
    // Check if user has required roles
    if (selectedRole !== "student" && !userRoles.student_id) {
      return (
        <div className="text-center text-red-600">
          You must be registered as a student first before becoming a {selectedRole.replace('_', ' ')}.
        </div>
      );
    }

    const fields = ROLE_FIELDS[selectedRole] || [];
    
    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).replace('_', ' ')} Role
              </h3>
              <div className="mt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderForm()}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      disabled={selectedRole !== "student" && !userRoles.student_id}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed sm:col-start-2 sm:text-sm"
                    >
                      Add Role
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 