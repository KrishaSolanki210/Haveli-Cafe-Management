import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/admin-login", label: "Admin Login" },
  { to: "/staff-login", label: "Staff Login" }
];

const customerLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/cart", label: "Cart" },
  { to: "/place-order", label: "Place Order" },
  { to: "/book-table", label: "Book Table" },
  { to: "/order-history", label: "Order History" },
  { to: "/track-order", label: "Track Order" }
];

function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  const isAdminDashboard =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const isStaffDashboard =
    location.pathname === "/staff" || location.pathname.startsWith("/staff/");

  if (isAdminDashboard || isStaffDashboard) {
    return null;
  }

  const links = user?.role === "customer" ? customerLinks : publicLinks;

  return (
    <header className="relative z-20 animate-enter">
      <div className="border-b border-white/10 bg-[var(--brand-night)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo compact className="rounded-full bg-white/5 p-1" />
            <div>
              <p className="font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-[var(--brand-cream)]">Haveli Cafe</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.34em] text-white/50">Coffee House Experience</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition ${isActive ? "text-[var(--brand-gold)]" : "hover:text-[var(--brand-gold)]"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user?.role === "customer" ? (
              <Link to="/cart" className="rounded-full border border-[var(--brand-gold)]/40 px-4 py-2 text-sm font-semibold text-[var(--brand-cream)]">
                Cart ({items.length})
              </Link>
            ) : null}
            {isAuthenticated ? (
              <>
                <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-semibold capitalize text-[var(--brand-cream)]">{user?.role}</span>
                <button className="rounded-full bg-[var(--brand-gold)] px-5 py-2 text-sm font-semibold text-[var(--brand-night)]" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white">Login</Link>
                <Link to="/register" className="rounded-full bg-[var(--brand-gold)] px-5 py-2 text-sm font-semibold text-[var(--brand-night)]">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
