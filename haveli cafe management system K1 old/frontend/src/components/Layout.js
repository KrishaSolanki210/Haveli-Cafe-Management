import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import BrandLogo from "./BrandLogo";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const dashboardMenus = {
  admin: [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/staff", label: "Staff" },
    { to: "/admin/menu", label: "Menu" },
    { to: "/admin/reports", label: "Reports" }
  ],
  staff: [
    { to: "/staff", label: "Dashboard" },
    { to: "/staff/orders", label: "Orders" },
    { to: "/staff/tables", label: "Tables" },
    { to: "/staff/update-status", label: "Change Status" }
  ]
};

function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdminDashboard =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const isStaffDashboard =
    location.pathname === "/staff" || location.pathname.startsWith("/staff/");
  const dashboardRole = isAdminDashboard ? "admin" : isStaffDashboard ? "staff" : null;

  if (!dashboardRole) {
    return (
      <div className="page-shell min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </div>
    );
  }

  const menu = dashboardMenus[dashboardRole];

  return (
    <div className="flex min-h-screen bg-[#eef4ff] text-slate-900">
      <aside className="sidebar-glow hidden w-80 shrink-0 flex-col justify-between bg-white px-6 py-8 lg:flex">
        <div>
          <Link to={dashboardRole === "admin" ? "/admin" : "/staff"} className="flex items-center gap-4 border-b border-slate-100 pb-8">
            <BrandLogo compact />
            <div>
              <p className="text-3xl font-light tracking-tight text-indigo-900">Haveli</p>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{dashboardRole} panel</p>
            </div>
          </Link>

          <nav className="mt-8 space-y-3">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === `/${dashboardRole}`}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-medium transition ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50 hover:text-indigo-700"}`
                }
              >
                <span>{item.label}</span>
                <span>{">"}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Signed in</p>
          <p className="mt-2 text-xl font-semibold capitalize text-slate-800">{user?.role || dashboardRole}</p>
          <button className="mt-4 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 shadow-sm lg:px-10">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Operations Workspace</p>
            <h1 className="text-3xl font-semibold text-slate-900">Welcome {dashboardRole === "admin" ? "Admin" : "Staff"}</h1>
          </div>
          <div className="rounded-full bg-white p-2 shadow-soft">
            <BrandLogo compact withText={false} className="animate-float" />
          </div>
        </header>
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
