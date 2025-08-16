import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import WhatWeOffer from "../pages/WhatWeOffer";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../config/ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateRestaurant from "../pages/dashboard/CreateRestaurant";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateCategory from "../pages/dashboard/CreateCategory";
import CreateMenuItem from "../pages/dashboard/CreateMenuItem";

export default function AppRoute() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/what-we-offer" element={<MainLayout><WhatWeOffer /></MainLayout>} />

      {/* PublicRoute for non-authenticated users */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
      </Route>

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={ <Dashboard /> } />
        <Route path="/create-restaurant" element={<DashboardLayout> <CreateRestaurant/></DashboardLayout>} />
        <Route path="/create-category" element={<DashboardLayout> <CreateCategory/></DashboardLayout>} />
        <Route path="/create-menu-item" element={<DashboardLayout> <CreateMenuItem/></DashboardLayout>} />

      </Route>
    </Routes>
  );
}
