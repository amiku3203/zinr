import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://zinr.onrender.com/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Category", "Restaurant"],
  endpoints: (builder) => ({
    // Create a new category
    createCategory: builder.mutation({
      query: ({ restaurantId, name, description }) => ({
        url: `/categories/${restaurantId}`,
        method: "POST",
        body: { name, description },
      }),
      invalidatesTags: ["Category", "Restaurant"],
    }),

    // Get categories for a restaurant
    getCategoriesByRestaurant: builder.query({
      query: (restaurantId) => `/categories/restaurant/${restaurantId}`,
      providesTags: (result) => 
        result?.data 
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Category', id: _id })),
              'Restaurant'
            ]
          : ['Category', 'Restaurant'],
    }),

    // Update a category
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        'Restaurant'
      ],
    }),

    // Delete a category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Restaurant"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesByRestaurantQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
