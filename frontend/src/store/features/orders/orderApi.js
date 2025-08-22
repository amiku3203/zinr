import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Create new order (public)
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    // Get restaurant orders (for owners)
    getRestaurantOrders: builder.query({
      query: ({ restaurantId, status = "all", page = 1, limit = 10 }) => ({
        url: `/orders/restaurant/${restaurantId}`,
        params: { status, page, limit },
      }),
      providesTags: ["Order"],
    }),

    // Get order by ID
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: ["Order"],
    }),

    // Get order by order number (for customers)
    getOrderByNumber: builder.query({
      query: (orderNumber) => `/orders/number/${orderNumber}`,
      providesTags: ["Order"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, estimatedTime }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: { status, estimatedTime },
      }),
      invalidatesTags: ["Order"],
    }),

    // Get order statistics
    getOrderStats: builder.query({
      query: ({ restaurantId, period = "today" }) => ({
        url: `/orders/stats/${restaurantId}`,
        params: { period },
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetRestaurantOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useUpdateOrderStatusMutation,
  useGetOrderStatsQuery,
} = orderApi;
