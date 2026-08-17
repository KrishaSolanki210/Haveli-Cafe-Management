import React from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

const highlights = [
  {
    title: "Customer Friendly",
    description: "Guests can browse menu items with food photos, add items to cart, place orders, and review their history."
  },
  {
    title: "Operations Ready",
    description: "Staff dashboards keep orders, table flow, and service updates visible in one place."
  },
  {
    title: "Admin Control",
    description: "Admins can manage the cafe menu, staff, reports, and overall daily operations without juggling tools."
  }
];

function AboutPage() {
  return (
    <Layout>
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#171d2b,#5e3f2a)] px-6 py-14 text-white shadow-[0_28px_70px_rgba(43,30,18,0.18)] md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-gold)]">About Haveli Cafe</p>
        <h1 className="mt-4 max-w-4xl font-['Cormorant_Garamond'] text-5xl font-semibold leading-none md:text-6xl">
          A cafe management system with a front-of-house feel and a full digital workflow behind it.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/80">
          This setup focuses on simple ordering, visual menu browsing, and operational clarity. The public side now includes food photos and paginated menu browsing.
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-stone-200 bg-[#fffaf4] p-6 shadow-[0_18px_40px_rgba(43,30,18,0.08)]">
            <div className="mb-4 h-12 w-12 rounded-2xl bg-[var(--brand-gold-soft)]" />
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[var(--brand-night)]">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_40px_rgba(43,30,18,0.08)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand-gold-deep)]">Quick Navigation</p>
            <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-[var(--brand-night)]">Explore the main cafe experience</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">
              Home
            </Link>
            <Link to="/dashboard" className="rounded-full bg-[var(--brand-night)] px-5 py-3 text-sm font-semibold text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AboutPage;
