import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { getAllOrders, getReports, getStaffList } from "../services/cafeService";

function AdminDashboardPage() {
  const [reports, setReports] = useState({});
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [reportsResponse, ordersResponse, staffResponse] = await Promise.all([getReports(), getAllOrders(), getStaffList()]);
        setReports(reportsResponse.data.data || {});
        setOrders(ordersResponse.data.data || []);
        setStaff(staffResponse.data.data || []);
      } catch (error) {
        setReports({});
      }
    };

    loadDashboard();
  }, []);

  return (
    <Layout>
      <div className="animate-enter">
        <h2 className="text-5xl font-light text-slate-900">Welcome Admin</h2>
        <p className="mt-3 max-w-3xl text-base text-slate-500">Snapshot of staff, menu demand, customer traffic, and total receipts in a dashboard layout inspired by your reference screens.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Staff" value={reports.totalStaff || staff.length || 0} helper="Active team members" />
        <StatCard label="Menu Categories" value={(reports.topMenuItems || []).length || 5} helper="Popular menu groups" variant="alt" />
        <StatCard label="Total Orders" value={reports.totalOrders || orders.length || 0} helper="Orders in system" variant="alt" />
        <StatCard label="Total Revenue" value={reports.totalRevenue || 0} helper="Paid receipts" variant="rose" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bookings" value={reports.totalBookings || 0} helper="Reserved tables" />
        <StatCard label="Customers" value={reports.totalCustomers || 0} helper="Customer accounts" variant="alt" />
        <StatCard label="Tables" value={reports.tableCount || 0} helper="Operational capacity" variant="alt" />
        <StatCard label="Top Menu Items" value={(reports.topMenuItems || []).length || 0} helper="Trending dishes" variant="rose" />
      </div>
    </Layout>
  );
}

export default AdminDashboardPage;
