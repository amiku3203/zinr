// src/pages/dashboard/CreateMenuItem.jsx
import { useState } from "react";
import DashboardForm from "./DashboardForm";

export default function CreateMenuItem() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const fields = [
    { name: "name", label: "Menu Item Name", type: "text", placeholder: "E.g. Cappuccino", required: true },
    { name: "price", label: "Price", type: "number", placeholder: "199", required: true },
    { name: "description", label: "Description", type: "text", placeholder: "Rich espresso with steamed milk", required: false },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Menu Item Data:", formData);
  };

  return (
    <DashboardForm
      title="Create Menu Item"
      description="Add a new item to your restaurant's menu."
      fields={fields}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
    />
  );
}
