 import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetMyRestaurantQuery,
} from "../../store/features/restorent/restoApi";
import { restoApi } from "../../store/features/restorent/restoApi";
import { useDispatch } from "react-redux";
import { showSuccess, showError, showInfo } from "../../utils/toast";
import {
  Building2,
  MapPin,
  Phone,
  Pencil,
  Trash2,
  Loader2,
  PlusCircle,
  Download,
  Printer,
  Link,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";

export default function CreateRestaurant() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ 
    name: "", 
    address: "", 
    phone: "",
    razorpay: { keyId: "", keySecret: "" }
  });
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidatingCredentials, setIsValidatingCredentials] = useState(false);
  
  const { data: restaurantData, isLoading: isFetching, refetch } =
    useGetMyRestaurantQuery();
  const [createRestaurant, { isLoading: isCreating }] =
    useCreateRestaurantMutation();
  const [updateRestaurant, { isLoading: isUpdating }] =
    useUpdateRestaurantMutation();
  const [deleteRestaurant, { isLoading: isDeleting }] = useDeleteRestaurantMutation();

  // Validation functions
  const validateRazorpayKeyId = (keyId) => {
    if (!keyId) return "Razorpay Key ID is required";
    if (!keyId.startsWith('rzp_')) return "Key ID must start with 'rzp_'";
    if (keyId.length < 20) return "Key ID must be at least 20 characters long";
    if (keyId.length > 30) return "Key ID must be less than 30 characters long";
    return null;
  };

  const validateRazorpayKeySecret = (keySecret) => {
    if (!keySecret) return "Razorpay Key Secret is required";
    if (keySecret.length < 20) return "Key Secret must be at least 20 characters long";
    if (keySecret.length > 50) return "Key Secret must be less than 50 characters long";
    if (!/^[a-zA-Z0-9]+$/.test(keySecret)) return "Key Secret must contain only letters and numbers";
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    // Basic field validation
    if (!formData.name.trim()) errors.name = "Restaurant name is required";
    if (!formData.address.trim()) errors.address = "Restaurant address is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    
    // Razorpay validation
    const keyIdError = validateRazorpayKeyId(formData.razorpay.keyId);
    const keySecretError = validateRazorpayKeySecret(formData.razorpay.keySecret);
    
    if (keyIdError) errors.razorpayKeyId = keyIdError;
    if (keySecretError) errors.razorpayKeySecret = keySecretError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Test Razorpay credentials
  const testRazorpayCredentials = async () => {
    if (!formData.razorpay.keyId || !formData.razorpay.keySecret) {
      showError("Please enter both Key ID and Key Secret first");
      return;
    }

    const keyIdError = validateRazorpayKeyId(formData.razorpay.keyId);
    const keySecretError = validateRazorpayKeySecret(formData.razorpay.keySecret);
    
    if (keyIdError || keySecretError) {
      showError("Please fix validation errors before testing credentials");
      return;
    }

    setIsValidatingCredentials(true);
    
    try {
      // Test the credentials by making a simple API call
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${formData.razorpay.keyId}:${formData.razorpay.keySecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        showSuccess("✅ Razorpay credentials are valid!");
        setValidationErrors(prev => ({
          ...prev,
          razorpayKeyId: null,
          razorpayKeySecret: null
        }));
      } else if (response.status === 401) {
        showError("❌ Invalid Razorpay credentials. Please check your Key ID and Key Secret.");
        setValidationErrors(prev => ({
          ...prev,
          razorpayKeyId: "Invalid credentials",
          razorpayKeySecret: "Invalid credentials"
        }));
      } else {
        showError("❌ Unable to verify credentials. Please check your internet connection.");
      }
    } catch (error) {
      console.error('Credential validation error:', error);
      showError("❌ Error validating credentials. Please try again.");
    } finally {
      setIsValidatingCredentials(false);
    }
  };

  useEffect(() => {
    if (restaurantData?.data) {
      setFormData({
        name: restaurantData.data.name || "",
        address: restaurantData.data.address || "",
        phone: restaurantData.data.phone || "",
        razorpay: {
          keyId: restaurantData.data.razorpay?.keyId || "",
          keySecret: restaurantData.data.razorpay?.keySecret || ""
        }
      });
    } else {
      // Reset form when no restaurant data (after deletion)
      setFormData({
        name: "",
        address: "",
        phone: "",
        razorpay: { keyId: "", keySecret: "" }
      });
      setEditing(false);
    }
  }, [restaurantData]);

  // Additional effect to force re-render when restaurant is deleted
  useEffect(() => {
    if (!restaurantData?.data && !isFetching) {
      // Ensure form is reset when no restaurant exists
      setFormData({
        name: "",
        address: "",
        phone: "",
        razorpay: { keyId: "", keySecret: "" }
      });
      setEditing(false);
    }
  }, [restaurantData, isFetching]);

  // Debug logging
  useEffect(() => {
    console.log('Restaurant data changed:', {
      hasData: !!restaurantData?.data,
      data: restaurantData?.data,
      isFetching,
      formData
    });
  }, [restaurantData, isFetching, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation errors when user starts typing
    if (name.startsWith('razorpay.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        razorpay: {
          ...formData.razorpay,
          [field]: value
        }
      });
      
      // Clear specific validation errors
      if (field === 'keyId') {
        setValidationErrors(prev => ({ ...prev, razorpayKeyId: null }));
      } else if (field === 'keySecret') {
        setValidationErrors(prev => ({ ...prev, razorpayKeySecret: null }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      // Clear basic field validation errors
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'razorpay.keyId') {
      const error = validateRazorpayKeyId(value);
      if (error) {
        setValidationErrors(prev => ({ ...prev, razorpayKeyId: error }));
      }
    } else if (name === 'razorpay.keySecret') {
      const error = validateRazorpayKeySecret(value);
      if (error) {
        setValidationErrors(prev => ({ ...prev, razorpayKeySecret: error }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError("Please fix the validation errors before submitting");
      return;
    }

    try {
      showInfo(editing ? "Updating restaurant..." : "Creating restaurant...");
      let res;
      if (editing) {
        res = await updateRestaurant(formData).unwrap();
        showSuccess("Restaurant updated successfully!");
        setEditing(false);
      } else {
        res = await createRestaurant(formData).unwrap();
        showSuccess("Restaurant created successfully!");
      }
    } catch (err) {
      showError(err?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = () => setEditing(true);

  // Manual state reset function
  const resetComponentState = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      razorpay: { keyId: "", keySecret: "" }
    });
    setEditing(false);
    setShowDeleteModal(false);
    setValidationErrors({}); // Clear validation errors
  };

  // Clear validation errors
  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const confirmDelete = async () => {
    try {
      await deleteRestaurant().unwrap();
      showSuccess("Restaurant deleted successfully! You can now create a new one.");
      
      // Reset local state
      setFormData({ name: "", address: "", phone: "" });
      setShowDeleteModal(false);
      setEditing(false);
      
      // Multiple cache invalidation strategies
      try {
        // 1. Manually invalidate cache
        dispatch(restoApi.util.invalidateTags(['Restaurant']));
        
        // 2. Force refetch
        await refetch();
        
        // 3. Clear any cached data manually
        dispatch(restoApi.util.resetApiState());
        
        // 4. Force a fresh refetch
        setTimeout(() => {
          refetch();
        }, 100);
        
        // 5. Additional aggressive cache clearing
        setTimeout(() => {
          dispatch(restoApi.util.invalidateTags(['Restaurant']));
          refetch();
        }, 200);
        
      } catch (cacheError) {
        console.error('Cache invalidation error:', cacheError);
        // Fallback: force page reload if cache invalidation fails
        window.location.reload();
      }
    } catch (err) {
      showError("Failed to delete restaurant!");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mr-2" />
        <p className="text-lg">Loading restaurant data...</p>
      </div>
    );
  }

  // Show create form when no restaurant exists
  if (!restaurantData?.data) {
    return (
      <div className="bg-gray-900 text-white w-full flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            <Building2 className="h-6 w-6" /> Restaurant Management
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Create your first restaurant to get started
          </p>
        </header>
        
        <main className="flex-1 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 w-full h-full">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
                Create Your Restaurant
              </h2>
              
              {/* Validation Summary */}
              <div className="mb-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Form Validation & Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Real-time field validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Razorpay credential verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Format validation for all fields</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Secure credential storage</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-gray-300 font-medium">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="My Amazing Restaurant"
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-300 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123 Main Street, Delhi"
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                    validationErrors.address ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {validationErrors.address && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-300 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+91-9876543210"
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {validationErrors.phone && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* Razorpay Credentials Section */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  💳 Payment Gateway Setup
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Connect your Razorpay account to collect payments from customers
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-gray-300 font-medium">
                      Razorpay Key ID
                    </label>
                    <input
                      type="text"
                      name="razorpay.keyId"
                      value={formData.razorpay.keyId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="rzp_test_xxxxxxxxxxxxx"
                      required
                      className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                        validationErrors.razorpayKeyId ? 'border-red-500' : 'border-gray-700'
                      } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    />
                    {validationErrors.razorpayKeyId && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.razorpayKeyId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-300 font-medium">
                      Razorpay Key Secret
                    </label>
                    <input
                      type="password"
                      name="razorpay.keySecret"
                      value={formData.razorpay.keySecret}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                      required
                      className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                        validationErrors.razorpayKeySecret ? 'border-red-500' : 'border-gray-700'
                      } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    />
                    {validationErrors.razorpayKeySecret && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.razorpayKeySecret}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <strong>Note:</strong> These credentials are required to accept payments from customers. 
                    Orders cannot be placed without payment gateway configuration.
                  </p>
                  <div className="mt-3 text-xs text-blue-200 space-y-1">
                    <p><strong>Key ID Format:</strong> rzp_test_xxxxxxxxxxxxx (starts with 'rzp_')</p>
                    <p><strong>Key Secret:</strong> 20-50 characters, letters and numbers only</p>
                    <p><strong>Test Mode:</strong> Use test credentials for development, live credentials for production</p>
                  </div>
                </div>

                {/* Credential Status Indicator */}
                {formData.razorpay.keyId && formData.razorpay.keySecret && !validationErrors.razorpayKeyId && !validationErrors.razorpayKeySecret && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Credentials format looks valid</span>
                    </div>
                    <p className="text-xs text-green-200 mt-1">
                      Click "Test Razorpay Credentials" to verify they work with Razorpay
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={testRazorpayCredentials}
                  disabled={isValidatingCredentials}
                  className="w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg shadow-lg transition bg-green-500 hover:bg-green-600 text-white hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidatingCredentials ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  {isValidatingCredentials ? "Testing..." : "Test Razorpay Credentials"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg shadow-lg transition ${
                  isCreating
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-black hover:-translate-y-0.5 hover:shadow-xl"
                }`}
              >
                {isCreating && (
                  <Loader2 className="h-5 w-5 animate-spin text-black" />
                )}
                {isCreating ? "Creating..." : "Create Restaurant"}
              </button>
            </motion.form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white w-full flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
          <Building2 className="h-6 w-6" /> Restaurant Management
        </h1>
        {restaurantData?.data && !editing ? null : (
          <span className="text-sm text-gray-400">
            Fill the form to manage your restaurant
          </span>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 w-full h-full">
          <AnimatePresence mode="wait">
            {restaurantData?.data && !editing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
                  Your Restaurant
                </h2>

                <div className="space-y-4 w-full text-lg">
                  <p className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Name:</span>{" "}
                    {restaurantData.data.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Address:</span>{" "}
                    {restaurantData.data.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Phone:</span>{" "}
                    {restaurantData.data.phone}
                  </p>
                </div>

                {/* QR Code Section */}
                {restaurantData.data.qrCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-green-400 mb-2">
                        📱 Your Restaurant QR Code
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Customers can scan this QR code to access your digital menu and place orders
                      </p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                      {/* QR Code Display */}
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <img 
                            src={restaurantData.data.qrCode} 
                            alt="Restaurant QR Code" 
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Scan with any QR code app
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = restaurantData.data.qrCode;
                            link.download = `${restaurantData.data.name}-QR-Code.png`;
                            link.click();
                          }}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download QR Code
                        </button>
                        
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head>
                                  <title>${restaurantData.data.name} - QR Code</title>
                                  <style>
                                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                                    .qr-container { margin: 20px auto; }
                                    .qr-code { max-width: 300px; height: auto; }
                                    .restaurant-info { margin: 20px 0; }
                                    @media print { body { margin: 0; } }
                                  </style>
                                </head>
                                <body>
                                  <h1>${restaurantData.data.name}</h1>
                                  <div class="restaurant-info">
                                    <p><strong>Address:</strong> ${restaurantData.data.address}</p>
                                    <p><strong>Phone:</strong> ${restaurantData.data.phone}</p>
                                  </div>
                                  <div class="qr-container">
                                    <img src="${restaurantData.data.qrCode}" alt="QR Code" class="qr-code" />
                                    <p><strong>Scan to order from our digital menu!</strong></p>
                                  </div>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          Print QR Code
                        </button>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:5173'}/menu/${restaurantData.data._id}`);
                            showSuccess('Menu link copied to clipboard!');
                          }}
                          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Link className="w-4 h-4" />
                          Copy Menu Link
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">💡 How to Use:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Print this QR code and display it on your tables</li>
                        <li>• Add it to your printed menus and entrance</li>
                        <li>• Customers scan it to access your digital menu</li>
                        <li>• Orders come directly to your dashboard</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                <p className="text-gray-400 mt-6 text-center">
                  ⚠️ You can only have{" "}
                  <span className="font-semibold text-yellow-400">
                    one restaurant
                  </span>
                  . Edit or delete it to make changes.
                </p>

                <div className="flex gap-4 mt-8 w-full">
                  <button
                    onClick={handleEdit}
                    className="w-1/2 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Pencil className="h-5 w-5" /> Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-1/2 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="h-5 w-5" /> Delete
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 w-full"
              >
                <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center flex items-center justify-center gap-2">
                  {editing ? (
                    <Pencil className="h-6 w-6" />
                  ) : (
                    <PlusCircle className="h-6 w-6" />
                  )}
                  {editing ? "Edit Restaurant" : "Create Restaurant"}
                </h2>
                <p className="text-gray-400 mb-6 text-center">
                  {editing
                    ? "Update your restaurant details below."
                    : "Fill out your restaurant details to start managing your food business."}
                </p>

                {/* Validation Summary for Edit Form */}
                {editing && (
                  <div className="mb-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Validation Active
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Real-time field validation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Razorpay credential verification</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block mb-1 text-gray-300 font-medium">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Amit's Cafe"
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-300 font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="123 Main Street, Delhi"
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                      validationErrors.address ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-300 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+91-9876543210"
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isCreating || isUpdating || Object.keys(validationErrors).length > 0}
                  className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg shadow-lg transition ${
                    isCreating || isUpdating || Object.keys(validationErrors).length > 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="h-5 h-5 animate-spin text-black" />
                  )}
                  {isCreating || isUpdating ? "Saving..." : "Save & Continue"}
                </button>
                
                {/* Form Status Indicator for Edit Form */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-red-300 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Please fix the following errors:</span>
                    </div>
                    <ul className="text-xs text-red-200 space-y-1">
                      {Object.entries(validationErrors).map(([field, error]) => (
                        <li key={field} className="flex items-center gap-2">
                          <span>•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 text-white rounded-xl shadow-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                ⚠️ Confirm Deletion
              </h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this restaurant?
                <br />
                <span className="text-red-400 font-semibold">
                  You will lose everything related to this restaurant — menus,
                  categories, and all associated data.
                </span>
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                    isDeleting
                      ? "bg-red-700 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
