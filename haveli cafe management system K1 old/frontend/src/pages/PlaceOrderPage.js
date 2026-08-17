import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";
import { createPaymentOrder, placeOrder, verifyPayment } from "../services/cafeService";

function PlaceOrderPage() {
  const { items, totalAmount, clearCart } = useCart();
  const [tableId, setTableId] = useState("");
  const [orderType, setOrderType] = useState("dine-in");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const launchPayment = async (order) => {
    const paymentResponse = await createPaymentOrder({ orderId: order._id });
    const { razorpayOrder, keyId } = paymentResponse.data.data;

    if (!window.Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    const razorpay = new window.Razorpay({
      key: keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Haveli Cafe",
      description: `Order ${order._id}`,
      order_id: razorpayOrder.id,
      handler: async function (response) {
        await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });
        setMessage("Order placed and payment verified successfully.");
        clearCart();
      },
      theme: { color: "#c2410c" }
    });

    razorpay.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        orderType,
        tableId: tableId || undefined,
        notes,
        items: items.map((item) => ({ menuItemId: item._id, quantity: item.quantity }))
      };
      const response = await placeOrder(payload);
      const order = response.data.data;

      try {
        await launchPayment(order);
      } catch (paymentError) {
        setMessage(`Order ${order._id} was created, but payment could not start.`);
        setError(paymentError.response?.data?.message || paymentError.message || "Payment checkout is unavailable right now.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SectionHeader eyebrow="Checkout" title="Place your order" subtitle="This screen creates the order first and then opens Razorpay payment checkout." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <form className="rounded-3xl bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Order Type</label>
          <select className="mb-4 w-full rounded-2xl border border-orange-200 px-4 py-3" value={orderType} onChange={(event) => setOrderType(event.target.value)}>
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Table ID (optional)</label>
          <input className="mb-4 w-full rounded-2xl border border-orange-200 px-4 py-3" placeholder="Enter table object id for dine-in" value={tableId} onChange={(event) => setTableId(event.target.value)} />
          <label className="mb-2 block text-sm font-semibold text-stone-700">Notes</label>
          <textarea className="w-full rounded-2xl border border-orange-200 px-4 py-3" rows="4" placeholder="Special instructions" value={notes} onChange={(event) => setNotes(event.target.value)} />
          {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          <button className="mt-6 rounded-2xl bg-stone-900 px-5 py-3 font-semibold text-white" disabled={submitting || items.length === 0}>
            {submitting ? "Processing..." : "Place Order and Pay"}
          </button>
        </form>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-stone-900">Payment Preview</h3>
          <p className="mt-2 text-sm text-stone-600">Razorpay checkout opens after the order is created from your cart items.</p>
          <div className="mt-5 space-y-3 text-sm text-stone-600">
            <div className="flex justify-between"><span>Cart total</span><span>Rs. {totalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>Rs. {(totalAmount * 0.05).toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-orange-100 pt-3 text-base font-bold text-stone-900"><span>Estimated total</span><span>Rs. {(totalAmount * 1.05).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PlaceOrderPage;
