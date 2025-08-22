 import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const restoApi = createApi({
  reducerPath: "restoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://zinr.onrender.com/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Restaurant"],
  endpoints: (builder) => ({
    getMyRestaurant: builder.query({
      query: () => "/restaurants/me",
      providesTags: (result) => 
        result?.data 
          ? [{ type: 'Restaurant', id: result.data._id }]
          : ['Restaurant'],
    }),  
    createRestaurant: builder.mutation({
      query: (body) => ({
        url: "/restaurants",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    updateRestaurant: builder.mutation({
      query: (body) => ({
        url: "/restaurants",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    deleteRestaurant: builder.mutation({
      query: () => ({
        url: "/restaurants",
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurant"],
      // Force refetch after deletion
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
          // Manually invalidate and refetch
          dispatch(
            restoApi.util.invalidateTags(['Restaurant'])
          );
        } catch (error) {
          console.error('Delete restaurant error:', error);
        }
      },
    }),
  }),
});

export const {
  useGetMyRestaurantQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} = restoApi;
