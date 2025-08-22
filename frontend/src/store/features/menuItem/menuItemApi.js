import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const menuItemApi = createApi({
  reducerPath: "menuItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["MenuItem", "Category", "Restaurant"],
  endpoints: (builder) => ({
    // Create a new menu item
    createMenuItem: builder.mutation({
      query: (data) => ({
        url: `/items/${data.categoryId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MenuItem", "Category", "Restaurant"],
    }),

    // Get menu items for a category
    getMenuItemsByCategory: builder.query({
      query: (categoryId) => `/items/${categoryId}`,
      providesTags: (result) => 
        result?.data?.items 
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'MenuItem', id: _id })),
              { type: 'Category', id: result.data._id }
            ]
          : ['MenuItem', 'Category'],
    }),

    // Update a menu item
    updateMenuItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'MenuItem', id },
        'Category',
        'Restaurant'
      ],
    }),

    // Delete a menu item
    deleteMenuItem: builder.mutation({
      query: (menuItemId) => ({
        url: `/items/${menuItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MenuItem", "Category", "Restaurant"],
    }),

    // Get all menu items for a restaurant
    getMenuItemsByRestaurant: builder.query({
      query: (restaurantId) => `/items/restaurant/${restaurantId}`,
      providesTags: (result) => 
        result?.data 
          ? [
              ...result.data.map(item => ({ type: 'MenuItem', id: item._id })),
              'Category',
              'Restaurant'
            ]
          : ['MenuItem', 'Category', 'Restaurant'],
    }),
  }),
});

export const {
  useCreateMenuItemMutation,
  useGetMenuItemsByCategoryQuery,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuItemsByRestaurantQuery,
} = menuItemApi;
