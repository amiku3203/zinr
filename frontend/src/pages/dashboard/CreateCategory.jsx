// src/pages/dashboard/CreateCategory.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesByRestaurantQuery,
} from "../../store/features/category/categoryApi";
import { useGetMyRestaurantQuery } from "../../store/features/restorent/restoApi";
import { showSuccess, showError, showInfo } from "../../utils/toast";
import {
  Layers,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  Edit3,
  X,
  Check,
} from "lucide-react";

export default function CreateCategory() {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { data: restaurantData } = useGetMyRestaurantQuery();
  const { data: categoriesData, refetch: refetchCategories } = useGetCategoriesByRestaurantQuery(
    restaurantData?.data?._id,
    { skip: !restaurantData?.data?._id }
  );

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  useEffect(() => {
    if (restaurantData?.data) {
      refetchCategories();
    }
  }, [restaurantData, refetchCategories]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurantData?.data?._id) {
      showError("Please create a restaurant first!");
      return;
    }

    try {
      showInfo(editing ? "Updating category..." : "Creating category...");
      
      if (editing && editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          data: { ...formData, restaurantId: restaurantData.data._id }
        }).unwrap();
        showSuccess("Category updated successfully!");
        setEditing(false);
        setEditingCategory(null);
      } else {
        await createCategory({
          ...formData,
          restaurantId: restaurantData.data._id
        }).unwrap();
        showSuccess("Category created successfully!");
      }
      
      setFormData({ name: "", description: "" });
      refetchCategories();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (category) => {
    setEditing(true);
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ""
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete._id).unwrap();
      showSuccess("Category deleted successfully!");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      refetchCategories();
    } catch (err) {
      showError("Failed to delete category!");
    }
  };

  if (!restaurantData?.data) {
    return (
      <div className="bg-gray-900 text-white w-full flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            <Layers className="h-6 w-6" /> Category Management
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Create a restaurant first to manage categories
          </p>
        </header>
        
        <main className="flex-1 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 w-full h-full">
            <div className="text-center">
              <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl text-gray-400 mb-2">No Restaurant Found</h2>
              <p className="text-gray-500">
                Please create a restaurant first to start managing categories
              </p>
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
          <Layers className="h-6 w-6" /> Category Management
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Organize your menu with categories
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
                  Edit Category
                </>
              ) : (
                <>
                  <PlusCircle className="h-6 w-6" />
                  Create Category
                </>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Starters, Main Course, Desserts"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of this category..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
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
                    : (editing ? "Update Category" : "Create Category")}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Categories */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
              Existing Categories
            </h2>
            
            {categoriesData?.data && categoriesData.data.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categoriesData.data.map((category) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-300 text-sm mt-1">
                            {category.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Items: {category.items?.length || 0}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          title="Delete Category"
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
                <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No categories created yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Create your first category to get started
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
                Are you sure you want to delete the category{" "}
                <span className="text-yellow-400 font-semibold">
                  "{categoryToDelete?.name}"?
                </span>
                <br />
                <span className="text-red-400 font-semibold">
                  This will also delete all menu items in this category!
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
