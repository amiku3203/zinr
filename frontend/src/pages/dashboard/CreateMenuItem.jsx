// src/pages/dashboard/CreateMenuItem.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuItemsByRestaurantQuery,
} from "../../store/features/menuItem/menuItemApi";
import { useGetCategoriesByRestaurantQuery } from "../../store/features/category/categoryApi";
import { useGetMyRestaurantQuery } from "../../store/features/restorent/restoApi";
import { showSuccess, showError, showInfo } from "../../utils/toast";
import {
  UtensilsCrossed,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  Edit3,
  X,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

export default function CreateMenuItem() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    isAvailable: true
  });
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { data: restaurantData } = useGetMyRestaurantQuery();
  const { data: categoriesData } = useGetCategoriesByRestaurantQuery(
    restaurantData?.data?._id,
    { skip: !restaurantData?.data?._id }
  );
  const { data: menuItemsData, refetch: refetchMenuItems } = useGetMenuItemsByRestaurantQuery(
    restaurantData?.data?._id,
    { skip: !restaurantData?.data?._id }
  );

  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

  useEffect(() => {
    if (restaurantData?.data) {
      refetchMenuItems();
    }
  }, [restaurantData, refetchMenuItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurantData?.data?._id) {
      showError("Please create a restaurant first!");
      return;
    }

    if (!formData.categoryId) {
      showError("Please select a category!");
      return;
    }

    try {
      showInfo(editing ? "Updating menu item..." : "Creating menu item...");
      
      const itemData = {
        ...formData,
        restaurantId: restaurantData.data._id,
        price: parseFloat(formData.price)
      };
      
      if (editing && editingItem) {
        await updateMenuItem({
          id: editingItem._id,
          data: itemData
        }).unwrap();
        showSuccess("Menu item updated successfully!");
        setEditing(false);
        setEditingItem(null);
      } else {
        await createMenuItem(itemData).unwrap();
        showSuccess("Menu item created successfully!");
      }
      
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        image: "",
        isAvailable: true
      });
      refetchMenuItems();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (item) => {
    setEditing(true);
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      categoryId: item.categoryId || item.category?._id || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
      isAvailable: true
    });
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteMenuItem(itemToDelete._id).unwrap();
      showSuccess("Menu item deleted successfully!");
      setShowDeleteModal(false);
      setItemToDelete(null);
      refetchMenuItems();
    } catch (err) {
      showError("Failed to delete menu item!");
    }
  };

  if (!restaurantData?.data) {
    return (
      <div className="bg-gray-900 text-white w-full flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            <UtensilsCrossed className="h-6 w-6" /> Menu Item Management
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Create a restaurant first to manage menu items
          </p>
        </header>
        
        <main className="flex-1 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 w-full h-full">
            <div className="text-center">
              <UtensilsCrossed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl text-gray-400 mb-2">No Restaurant Found</h2>
              <p className="text-gray-500">
                Please create a restaurant first to start managing menu items
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!categoriesData?.data || categoriesData.data.length === 0) {
    return (
      <div className="bg-gray-900 text-white w-full flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            <UtensilsCrossed className="h-6 w-6" /> Menu Item Management
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Create categories first to organize your menu items
          </p>
        </header>
        
        <main className="flex-1 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 w-full h-full">
            <div className="text-center">
              <UtensilsCrossed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl text-gray-400 mb-2">No Categories Found</h2>
              <p className="text-gray-500">
                Please create some categories first to organize your menu items
              </p>
              <a 
                href="/dashboard/create-category" 
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition mt-4"
              >
                Create Categories First
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white w-full flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
          <UtensilsCrossed className="h-6 w-6" /> Menu Item Management
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Add delicious dishes to your menu
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create/Edit Form */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-2">
              {editing ? (
                <>
                  <Edit3 className="h-6 w-6" />
                  Edit Menu Item
                </>
              ) : (
                <>
                  <PlusCircle className="h-6 w-6" />
                  Create Menu Item
                </>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Butter Chicken, Margherita Pizza"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select a category</option>
                  {categoriesData.data.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your dish, ingredients, etc..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-400 bg-gray-900 border-gray-700 rounded focus:ring-yellow-400 focus:ring-2"
                />
                <label className="text-gray-300">
                  Item is available for ordering
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                {editing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-lg shadow-lg transition ${
                    isCreating || isUpdating
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}
                  {isCreating || isUpdating
                    ? (editing ? "Updating..." : "Creating...")
                    : (editing ? "Update Item" : "Create Item")}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Menu Items */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
              Existing Menu Items
            </h2>
            
            {menuItemsData?.data && menuItemsData.data.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {menuItemsData.data.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gray-700 border border-gray-600 rounded-lg p-4 ${
                      !item.isAvailable ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-lg">
                            {item.name}
                          </h3>
                          {!item.isAvailable && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              Unavailable
                            </span>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="text-gray-300 text-sm mb-2">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-yellow-400 font-semibold">
                            ₹{item.price}
                          </span>
                          <span className="text-gray-400">
                            Category: {item.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No menu items created yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Create your first menu item to get started
                </p>
              </div>
            )}
          </div>
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
                Are you sure you want to delete{" "}
                <span className="text-yellow-400 font-semibold">
                  "{itemToDelete?.name}"?
                </span>
                <br />
                <span className="text-red-400 font-semibold">
                  This action cannot be undone.
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
