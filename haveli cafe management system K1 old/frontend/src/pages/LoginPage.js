import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const copyByMode = {
  default: {
    title: "Customer Login",
    breadcrumb: "Home  Login",
    banner: "Sign in to access menu, orders, bookings, and your full Haveli profile.",
    accent: "#39b54a",
    registerLink: "/register",
    registerLabel: "Create Customer Account"
  },
  admin: {
    title: "Admin Login",
    breadcrumb: "Home  Admin Login",
    banner: "Manage staff, menu, reports, and all cafe operations from the control room.",
    accent: "#433b76",
    registerLink: "/admin-register",
    registerLabel: "Create Admin Account"
  },
  staff: {
    title: "Staff Login",
    breadcrumb: "Home  Staff Login",
    banner: "Track table flow, update order status, and keep service moving smoothly.",
    accent: "#23943a",
    registerLink: "/staff-register",
    registerLabel: "Create Staff Account"
  }
};

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mode = useMemo(() => {
    if (location.pathname === "/admin-login") return "admin";
    if (location.pathname === "/staff-login") return "staff";
    return "default";
  }, [location.pathname]);

  const pageCopy = copyByMode[mode];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData, mode);
      const role = response.data.user.role;
      navigate(role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/");
    } catch (err) {
      const routeMissing = err.response?.status === 404;
      if (routeMissing && mode !== "default") {
        setError("Backend restart required for new admin/staff auth routes. Please restart backend server.");
      } else {
        setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(22,163,74,0.92),rgba(9,90,37,0.88))] px-8 py-14 text-white shadow-soft">
        <p className="text-lg text-white/70">{pageCopy.breadcrumb}</p>
        <h1 className="mt-3 text-5xl font-light tracking-tight">{pageCopy.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">{pageCopy.banner}</p>
      </section>

      <section className="-mt-12 pb-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.12)] md:p-12 animate-enter">
          <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em]" style={{ color: pageCopy.accent }}>Portal Access</p>
              <h2 className="mt-4 text-5xl font-light text-slate-800">{pageCopy.title} Form</h2>
              <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-3 block text-lg text-slate-500">Email Id</label>
                  <input className="w-full border-b border-slate-200 px-0 py-4 text-lg outline-none placeholder:text-slate-300" placeholder="Enter Email Id" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
                </div>
                <div>
                  <label className="mb-3 block text-lg text-slate-500">Password</label>
                  <input className="w-full border-b border-slate-200 px-0 py-4 text-lg outline-none placeholder:text-slate-300" placeholder="Enter Password" type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button className="rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:opacity-90" style={{ backgroundColor: pageCopy.accent }} disabled={loading}>
                  {loading ? "Logging In..." : "Login"}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(180deg,#eef5ff,#f8fbff)] p-8 text-slate-700">
              <div className="animate-float rounded-[1.75rem] bg-white p-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Quick links</p>
                <div className="mt-6 space-y-4 text-base font-medium">
                  <Link to="/forgot-password" className="block rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-emerald-200 hover:text-emerald-700">Forgot Password</Link>
                  <Link to={pageCopy.registerLink} className="block rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-emerald-200 hover:text-emerald-700">{pageCopy.registerLabel}</Link>
                  <Link to="/" className="block rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-emerald-200 hover:text-emerald-700">Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default LoginPage;
