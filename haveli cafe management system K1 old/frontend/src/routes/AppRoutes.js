import React from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AboutPage from "../pages/AboutPage";
import CartPage from "../pages/CartPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ManageMenuPage from "../pages/ManageMenuPage";
import ManageOrdersPage from "../pages/ManageOrdersPage";
import ManageStaffPage from "../pages/ManageStaffPage";
import NotFoundPage from "../pages/NotFoundPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import OrderTrackingPage from "../pages/OrderTrackingPage";
import PlaceOrderPage from "../pages/PlaceOrderPage";
import PublicDashboardPage from "../pages/PublicDashboardPage";
import PublicMenuPage from "../pages/PublicMenuPage";
import RegisterPage from "../pages/RegisterPage";
import ReportsAnalyticsPage from "../pages/ReportsAnalyticsPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import StaffDashboardPage from "../pages/StaffDashboardPage";
import TableBookingPage from "../pages/TableBookingPage";
import TableManagementPage from "../pages/TableManagementPage";
import UpdateOrderStatusPage from "../pages/UpdateOrderStatusPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<PublicDashboardPage />} />
      <Route path="/menu" element={<PublicMenuPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<LoginPage />} />
      <Route path="/staff-login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-register" element={<RegisterPage />} />
      <Route path="/staff-register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute roles={["customer"]} />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/book-table" element={<TableBookingPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["staff", "admin"]} />}>
        <Route path="/staff" element={<StaffDashboardPage />} />
        <Route path="/staff/orders" element={<ManageOrdersPage />} />
        <Route path="/staff/update-status" element={<UpdateOrderStatusPage />} />
        <Route path="/staff/tables" element={<TableManagementPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/menu" element={<ManageMenuPage />} />
        <Route path="/admin/staff" element={<ManageStaffPage />} />
        <Route path="/admin/reports" element={<ReportsAnalyticsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
