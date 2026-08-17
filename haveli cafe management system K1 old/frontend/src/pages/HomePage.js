import React from "react";
import { Link } from "react-router-dom";

import BrandLogo from "../components/BrandLogo";
import Layout from "../components/Layout";

const aboutPoints = [
  {
    title: "Warm Cafe Experience",
    description: "A clean landing page with your cafe photo, logo, and brand story right on the first screen."
  },
  {
    title: "Simple User Flow",
    description: "Visitors can move from Home to Dashboard and then directly to the Menu page without confusion."
  },
  {
    title: "Full Management Setup",
    description: "Customer, staff, and admin workflows still stay connected behind the scenes."
  }
];

function HomePage() {
  return (
    <Layout>
      <section className="animate-enter overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_28px_70px_rgba(43,30,18,0.14)]">
        <div className="coffee-showcase relative min-h-[540px] px-6 py-8 md:px-10">
          <div className="relative z-10 flex flex-col items-start gap-6 text-white md:max-w-3xl">
            <div className="flex items-center gap-4">
              <BrandLogo compact className="rounded-full bg-white/10 p-2" />
              <div>
                <p className="font-['Cormorant_Garamond'] text-5xl font-semibold leading-none">Haveli Cafe</p>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/65">Coffee House And Management System</p>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-gold)]">About Our Cafe</p>
              <h1 className="mt-4 font-['Cormorant_Garamond'] text-5xl font-semibold leading-none md:text-7xl">
                Fresh coffee, cozy vibes, and a simple digital cafe experience.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                This first page is your cafe introduction. It shows your logo, cafe photo, and brand story in a simple but unique way before users move to the dashboard and menu.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/dashboard" className="rounded-full bg-[var(--brand-gold)] px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--brand-night)] transition hover:bg-[#f3bf66]">
                  Open Dashboard
                </Link>
                <Link to="/menu" className="rounded-full border border-white/25 px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10">
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        {aboutPoints.map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-stone-200 bg-[#fffaf4] p-6 shadow-[0_18px_40px_rgba(43,30,18,0.08)]">
            <div className="mb-4 h-12 w-12 rounded-2xl bg-[var(--brand-gold-soft)]" />
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[var(--brand-night)]">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_40px_rgba(43,30,18,0.08)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand-gold-deep)]">Next Steps</p>
            <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-[var(--brand-night)]">
              Go to the dashboard first, then explore the menu
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" className="rounded-full bg-[var(--brand-night)] px-6 py-3 text-sm font-semibold text-white">
              Dashboard
            </Link>
            <Link to="/menu" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700">
              Menu
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
