import React from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  return (
    <Layout>
      <SectionHeader eyebrow="Customer Cart" title="Review your selected dishes" subtitle="Adjust quantities before placing the final order." />
      {items.length === 0 ? (
        <EmptyState title="Your cart is empty" subtitle="Add a few dishes from the home page to begin an order." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="rounded-3xl bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900">{item.name}</h3>
                    <p className="mt-2 text-sm text-stone-600">Rs. {item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input className="w-20 rounded-xl border border-orange-200 px-3 py-2" type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item._id, Number(event.target.value))} />
                    <button className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600" onClick={() => removeFromCart(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-stone-900">Order Summary</h3>
            <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
              <span>Items total</span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-stone-600">
              <span>Estimated tax</span>
              <span>Rs. {(totalAmount * 0.05).toFixed(2)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4 text-lg font-bold text-stone-900">
              <span>Payable</span>
              <span>Rs. {(totalAmount * 1.05).toFixed(2)}</span>
            </div>
            <Link to="/place-order" className="mt-6 block rounded-2xl bg-stone-900 px-4 py-3 text-center font-semibold text-white">
              Continue to Place Order
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CartPage;
