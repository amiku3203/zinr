import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import WhatWeOffer from "../pages/WhatWeOffer";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Pricing from "../pages/Pricing";
import Demo from "../pages/Demo";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import ProtectedRoute from "../config/ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateRestaurant from "../pages/dashboard/CreateRestaurant";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateCategory from "../pages/dashboard/CreateCategory";
import CreateMenuItem from "../pages/dashboard/CreateMenuItem";
import OrderManagement from "../pages/dashboard/OrderManagement";
import SubscriptionManagement from "../pages/dashboard/SubscriptionManagement";
import CustomerOrder from "../pages/CustomerOrder";
import Analytics from "../pages/dashboard/Analytics";
import RestaurantDashboard from "../pages/dashboard/RestaurantDashboard";
import QRTest from "../pages/QRTest";

export default function AppRoute() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/what-we-offer" element={<MainLayout><WhatWeOffer /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
      <Route path="/demo" element={<MainLayout><Demo /></MainLayout>} />

      {/* PublicRoute for non-authenticated users */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
        <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/verify-email" element={<MainLayout><VerifyEmail /></MainLayout>} />
      </Route>

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={ <Dashboard /> } />
        <Route path="/create-restaurant" element={<DashboardLayout> <CreateRestaurant/></DashboardLayout>} />
        <Route path="/create-category" element={<DashboardLayout> <CreateCategory/></DashboardLayout>} />
        <Route path="/create-menu-item" element={<DashboardLayout> <CreateMenuItem/></DashboardLayout>} />
        <Route path="/order-management" element={<DashboardLayout> <OrderManagement/></DashboardLayout>} />
        <Route path="/subscription" element={<DashboardLayout> <SubscriptionManagement/></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout> <Analytics /></DashboardLayout>} />
        <Route path="/restaurant-dashboard" element={<DashboardLayout> <RestaurantDashboard /></DashboardLayout>} />
      </Route>

      {/* Public customer order page */}
      <Route path="/menu/:restaurantId" element={<CustomerOrder />} />
      
      {/* QR Code test page */}
      <Route path="/qr-test/:restaurantId" element={<QRTest />} />
    </Routes>
  );
}
