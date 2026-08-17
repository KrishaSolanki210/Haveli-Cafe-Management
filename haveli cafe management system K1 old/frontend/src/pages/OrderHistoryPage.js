import React, { useEffect, useState } from "react";

import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { getOrderHistory } from "../services/cafeService";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrderHistory();
        setOrders(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch order history.");
      }
    };

    loadOrders();
  }, []);

  return (
    <Layout>
      <SectionHeader eyebrow="History" title="Your previous orders" subtitle="Every order placed through the customer flow appears here." />
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" subtitle="Once you place an order, it will show up here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-stone-900">Order #{order._id.slice(-6)}</h3>
                  <p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold capitalize text-brand-700">{order.status}</span>
                  <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold capitalize text-stone-700">{order.paymentStatus}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-600">{order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</p>
              <p className="mt-3 text-base font-bold text-stone-900">Rs. {order.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default OrderHistoryPage;
