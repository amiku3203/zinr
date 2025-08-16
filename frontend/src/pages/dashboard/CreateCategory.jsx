// src/pages/dashboard/CreateCategory.jsx
import { useState } from "react";
import DashboardForm from "./DashboardForm";


export default function CreateCategory() {
  const [formData, setFormData] = useState({ name: "" });

  const fields = [
    { name: "name", label: "Category Name", type: "text", placeholder: "E.g. Beverages, Desserts", required: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Category Data:", formData);
  };

  return (
    <DashboardForm
      title="Create Category"
      description="Add a category to group your menu items."
      fields={fields}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
    />
  );
}
