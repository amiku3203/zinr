// src/components/dashboard/DashboardForm.jsx
import { useNavigate } from "react-router-dom";

export default function DashboardForm({
  title,
  description,
  fields,
  formData,
  setFormData,
  onSubmit,
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
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold 
                       rounded-lg shadow-lg transform transition hover:-translate-y-0.5 
                       hover:shadow-xl"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
