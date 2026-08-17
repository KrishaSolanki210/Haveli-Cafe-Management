import React, { useState } from "react";

import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { bookTable } from "../services/cafeService";

function TableBookingPage() {
  const [formData, setFormData] = useState({ tableId: "", bookingDate: "", guests: 2, notes: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await bookTable({ ...formData, guests: Number(formData.guests) });
      setMessage("Table booked successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to book table.");
    }
  };

  return (
    <Layout>
      <SectionHeader eyebrow="Reservations" title="Book a table" subtitle="Use a table ID created by the admin panel and reserve your preferred slot." />
      <form className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-soft" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-orange-200 px-4 py-3" placeholder="Table ID" value={formData.tableId} onChange={(event) => setFormData({ ...formData, tableId: event.target.value })} required />
          <input className="rounded-2xl border border-orange-200 px-4 py-3" type="datetime-local" value={formData.bookingDate} onChange={(event) => setFormData({ ...formData, bookingDate: event.target.value })} required />
          <input className="rounded-2xl border border-orange-200 px-4 py-3" type="number" min="1" placeholder="Guests" value={formData.guests} onChange={(event) => setFormData({ ...formData, guests: event.target.value })} required />
          <input className="rounded-2xl border border-orange-200 px-4 py-3" placeholder="Notes" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} />
        </div>
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button className="mt-6 rounded-2xl bg-stone-900 px-5 py-3 font-semibold text-white">Book Table</button>
      </form>
    </Layout>
  );
}

export default TableBookingPage;
