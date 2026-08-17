import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { getStaffTables, updateTableStatus } from "../services/cafeService";

function TableManagementPage() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");

  const loadTables = async () => {
    try {
      const response = await getStaffTables();
      setTables(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch tables.");
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleStatusChange = async (tableId, status) => {
    try {
      await updateTableStatus(tableId, { status });
      loadTables();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update table.");
    }
  };

  return (
    <Layout>
      <SectionHeader eyebrow="Table Control" title="Manage table status" subtitle="Quickly move tables between available, occupied, reserved, and maintenance." />
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <div key={table._id} className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-stone-900">Table {table.tableNumber}</h3>
            <p className="mt-2 text-sm text-stone-500">Capacity: {table.capacity}</p>
            <select className="mt-4 w-full rounded-2xl border border-orange-200 px-4 py-3" value={table.status} onChange={(event) => handleStatusChange(table._id, event.target.value)}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default TableManagementPage;
