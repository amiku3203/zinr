 import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './features/auth/authApi';
import { restoApi } from './features/restorent/restoApi';
import { orderApi } from './features/orders/orderApi';
import { subscriptionApi } from './features/subscription/subscriptionApi';
import { categoryApi } from './features/category/categoryApi';
import { menuItemApi } from './features/menuItem/menuItemApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [restoApi.reducerPath]: restoApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [menuItemApi.reducerPath]: menuItemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(restoApi.middleware)
      .concat(orderApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(categoryApi.middleware)
      .concat(menuItemApi.middleware),
});
