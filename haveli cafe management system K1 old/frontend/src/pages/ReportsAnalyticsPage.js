import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { getReports } from "../services/cafeService";

function ReportsAnalyticsPage() {
  const [reports, setReports] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await getReports();
        setReports(response.data.data || {});
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load reports.");
      }
    };

    loadReports();
  }, []);

  return (
    <Layout>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders" value={reports.totalOrders || 0} />
        <StatCard label="Revenue" value={reports.totalRevenue || 0} variant="alt" />
        <StatCard label="Bookings" value={reports.totalBookings || 0} variant="alt" />
        <StatCard label="Tables" value={reports.tableCount || 0} variant="rose" />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h3 className="text-4xl font-light text-slate-900">Order Status Breakdown</h3>
          <div className="mt-8 space-y-4">
            {(reports.orderStatusBreakdown || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                <span className="text-lg capitalize text-slate-600">{item._id}</span>
                <span className="text-2xl font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h3 className="text-4xl font-light text-slate-900">Top Menu Items</h3>
          <div className="mt-8 space-y-4">
            {(reports.topMenuItems || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                <span className="text-lg text-slate-600">{item._id}</span>
                <span className="text-2xl font-semibold text-slate-900">{item.orderedQuantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ReportsAnalyticsPage;
