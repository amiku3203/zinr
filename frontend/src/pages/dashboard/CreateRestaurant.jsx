 // src/pages/dashboard/CreateRestaurant.jsx
import { useState } from "react";
import DashboardForm from "./DashboardForm";


export default function CreateRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const fields = [
    { name: "name", label: "Restaurant Name", type: "text", placeholder: "Amit's Cafe", required: true },
    { name: "address", label: "Address", type: "text", placeholder: "123 Main Street, Delhi", required: true },
    { name: "phone", label: "Phone Number", type: "text", placeholder: "+91-9876543210", required: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Restaurant Data:", formData);
  };

  return (
    <DashboardForm
      title="Create Restaurant"
      description="Add your restaurant details to start managing your menu."
      fields={fields}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
    />
  );
}
