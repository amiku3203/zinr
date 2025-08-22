// src/components/dashboard/DashboardForm.jsx
import { useNavigate } from "react-router-dom";

export default function DashboardForm({
  title,
  description,
  fields,
  formData,
  setFormData,
  onSubmit,
  isLoading = false, // Default to false if not provided
  submitButtonText = "Save", // Default button text
}) {
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Page Heading */}
      <div className="w-full bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">{title}</h1>
        {description && (
          <p className="text-gray-400 mt-2">{description}</p>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-gray-800 border border-gray-700 p-8 rounded-lg shadow-lg w-full max-w-2xl"
      >
        {fields.map((field) => (
          <div key={field.name} className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 
                           text-white focus:outline-none focus:ring-2 
                           focus:ring-yellow-400 transition"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-yellow-400 transition"
              />
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-medium transition"
          >
            Cancel
          </button>
          <button
  type="submit"
  disabled={isLoading} // disable while loading
  className={`px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-xl 
    ${isLoading ? 'opacity-50 cursor-not-allowed hover:bg-yellow-400 hover:shadow-none' : 'hover:bg-yellow-500'}`}
>
  {isLoading ? (
    <svg
      className="animate-spin h-5 w-5 text-black mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  ) : (
    submitButtonText
  )}
</button>

        </div>
      </form>
    </div>
  );
}
