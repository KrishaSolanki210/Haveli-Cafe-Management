import React, { useState } from "react";

import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { updateOrderStatus } from "../services/cafeService";

function UpdateOrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("confirmed");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await updateOrderStatus(orderId, { status });
      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order status.");
    }
  };

  return (
    <Layout>
      <SectionHeader eyebrow="Status Control" title="Update an order" subtitle="Paste an order id and push the next service status." />
      <form className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-soft" onSubmit={handleSubmit}>
        <input className="mb-4 w-full rounded-2xl border border-orange-200 px-4 py-3" placeholder="Order ID" value={orderId} onChange={(event) => setOrderId(event.target.value)} required />
        <select className="w-full rounded-2xl border border-orange-200 px-4 py-3" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="served">Served</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button className="mt-6 rounded-2xl bg-stone-900 px-5 py-3 font-semibold text-white">Update Status</button>
      </form>
    </Layout>
  );
}

export default UpdateOrderStatusPage;
