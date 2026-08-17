import React from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

const rolePanels = [
  {
    title: "Admin Panel",
    icon: "A",
    description: "Admin can manage menu items, staff members, reports, and overall cafe operations.",
    actions: [
      { to: "/admin-login", label: "Admin Login" },
      { to: "/admin", label: "Open Admin" }
    ]
  },
  {
    title: "Customer Panel",
    icon: "C",
    description: "Customers can browse menu items, add to cart, place orders, track orders, and book tables.",
    actions: [
      { to: "/login", label: "Customer Login" },
      { to: "/menu", label: "View Menu" }
    ]
  },
  {
    title: "Staff Panel",
    icon: "S",
    description: "Staff can handle table status, order flow, and daily service management from one place.",
    actions: [
      { to: "/staff-login", label: "Staff Login" },
      { to: "/staff", label: "Open Staff" }
    ]
  }
];

function PublicDashboardPage() {
  return (
    <Layout>
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_40px_rgba(43,30,18,0.08)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand-gold-deep)]">Dashboard</p>
            <h1 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold text-[var(--brand-night)] md:text-6xl">
              Three simple panels
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              This second page keeps everything simple: one dashboard with three panels for admin, customer, and staff.
            </p>
          </div>
          <Link to="/menu" className="rounded-full bg-[var(--brand-night)] px-6 py-3 text-sm font-semibold text-white">
            Next: Menu
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {rolePanels.map((panel, index) => (
          <div
            key={panel.title}
            className="animate-enter overflow-hidden rounded-[2rem] border border-stone-200 bg-[#fffaf4] shadow-[0_20px_45px_rgba(43,30,18,0.08)]"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="bg-[linear-gradient(135deg,#171d2b,#5f3f29)] p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="font-['Cormorant_Garamond'] text-4xl font-semibold">{panel.title}</h2>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-[var(--brand-gold)]">
                  {panel.icon}
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm leading-7 text-stone-600">{panel.description}</p>
              <div className="mt-6 flex flex-col gap-3">
                {panel.actions.map((action, actionIndex) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className={`rounded-2xl px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.12em] transition ${
                      actionIndex === 0
                        ? "bg-[var(--brand-night)] text-white hover:bg-[#33251d]"
                        : "border border-stone-200 text-stone-700 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold-deep)]"
                    }`}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
}

export default PublicDashboardPage;
