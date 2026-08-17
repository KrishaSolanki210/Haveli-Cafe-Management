import React, { useEffect, useMemo, useState } from "react";

import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { getOrderHistory } from "../services/cafeService";

function OrderTrackingPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrderHistory();
        setOrders(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch order status.");
      }
    };

    loadOrders();
  }, []);

  const latestOrder = useMemo(() => orders[0], [orders]);

  return (
    <Layout>
      <SectionHeader eyebrow="Order Tracking" title="Track your latest order" subtitle="We show the newest order from your history feed." />
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {!latestOrder ? (
        <EmptyState title="No active order found" subtitle="Place a new order to see live status updates here." />
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Order ID</p>
              <h3 className="mt-2 text-2xl font-bold text-stone-900">{latestOrder._id}</h3>
            </div>
            <span className="rounded-full bg-orange-50 px-5 py-2 text-sm font-semibold capitalize text-brand-700">{latestOrder.status}</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-orange-50 p-4"><p className="text-sm text-stone-500">Payment</p><p className="mt-2 font-semibold capitalize text-stone-900">{latestOrder.paymentStatus}</p></div>
            <div className="rounded-2xl bg-orange-50 p-4"><p className="text-sm text-stone-500">Order type</p><p className="mt-2 font-semibold capitalize text-stone-900">{latestOrder.orderType}</p></div>
            <div className="rounded-2xl bg-orange-50 p-4"><p className="text-sm text-stone-500">Total</p><p className="mt-2 font-semibold text-stone-900">Rs. {latestOrder.totalAmount}</p></div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderTrackingPage;
