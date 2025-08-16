import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Success Toast
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: {
      backgroundColor: "#16a34a", // green-600
      color: "#fff",
      fontWeight: "bold",
    },
  });
};

// ❌ Error Toast
export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: {
      backgroundColor: "#dc2626", // red-600
      color: "#fff",
      fontWeight: "bold",
    },
  });
};

// ⚠️ Warning Toast
export const showWarning = (message) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: {
      backgroundColor: "#d97706", // amber-600
      color: "#fff",
      fontWeight: "bold",
    },
  });
};

// ℹ️ Info Toast
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: {
      backgroundColor: "#2563eb", // blue-600
      color: "#fff",
      fontWeight: "bold",
    },
  });
};
