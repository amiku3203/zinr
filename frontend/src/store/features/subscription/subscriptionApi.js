import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_URL;
export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    // Get available plans (public)
    getAvailablePlans: builder.query({
      query: () => "/subscriptions/plans",
      providesTags: ["Subscription"],
    }),

    // Create subscription order
    createSubscriptionOrder: builder.mutation({
      query: (orderData) => ({
        url: "/subscriptions/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // Verify payment
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/subscriptions/verify-payment",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // Get restaurant subscription
    getRestaurantSubscription: builder.query({
      query: (restaurantId) => `/subscriptions/restaurant/${restaurantId}`,
      providesTags: ["Subscription"],
    }),

    // Get subscription by ID
    getSubscriptionById: builder.query({
      query: (subscriptionId) => `/subscriptions/${subscriptionId}`,
      providesTags: ["Subscription"],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subscription"],
    }),

    // Link subscription to restaurant
    linkSubscriptionToRestaurant: builder.mutation({
      query: (data) => ({
        url: "/subscriptions/link-restaurant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetAvailablePlansQuery,
  useCreateSubscriptionOrderMutation,
  useVerifyPaymentMutation,
  useGetRestaurantSubscriptionQuery,
  useGetSubscriptionByIdQuery,
  useCancelSubscriptionMutation,
  useLinkSubscriptionToRestaurantMutation,
} = subscriptionApi;
