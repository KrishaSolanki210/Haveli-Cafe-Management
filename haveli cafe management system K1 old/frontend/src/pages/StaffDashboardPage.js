import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { getDailyTransactions, getStaffTables } from "../services/cafeService";

function StaffDashboardPage() {
  const [transactions, setTransactions] = useState({ totalRevenue: 0, transactions: 0 });
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [transactionsResponse, tablesResponse] = await Promise.all([getDailyTransactions(), getStaffTables()]);
        setTransactions(transactionsResponse.data.data || { totalRevenue: 0, transactions: 0 });
        setTables(tablesResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load staff dashboard.");
      }
    };

    loadDashboard();
  }, []);

  const occupiedTables = tables.filter((table) => table.status === "occupied").length;

  return (
    <Layout>
      <div className="animate-enter">
        <h2 className="text-5xl font-light text-slate-900">Welcome Staff</h2>
        <p className="mt-3 max-w-3xl text-base text-slate-500">Manage the service floor with clear card metrics and quick navigation for orders, tables, and status changes.</p>
      </div>
      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tracked Tables" value={tables.length} helper="Visible to staff" />
        <StatCard label="Occupied Tables" value={occupiedTables} helper="Currently in service" variant="alt" />
        <StatCard label="Today's Revenue" value={transactions.totalRevenue || 0} helper="Paid transactions" variant="alt" />
        <StatCard label="Transactions" value={transactions.transactions || 0} helper="Processed today" variant="rose" />
      </div>
    </Layout>
  );
}

export default StaffDashboardPage;
