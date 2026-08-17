import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { sendOtp } from "../services/authService";

const copyByMode = {
  default: {
    title: "Customer Registration",
    breadcrumb: "Home  Register",
    banner:
      "Create your customer account with OTP verification and unlock booking, ordering, and payment features.",
    formTitle: "Create your Haveli profile",
    loginPath: "/login"
  },
  admin: {
    title: "Admin Registration",
    breadcrumb: "Home  Admin Register",
    banner: "Register an admin account to manage staff, menu, tables, and reports.",
    formTitle: "Create admin credentials",
    loginPath: "/admin-login"
  },
  staff: {
    title: "Staff Registration",
    breadcrumb: "Home  Staff Register",
    banner: "Register a staff account for order, table, and service-floor operations.",
    formTitle: "Create staff credentials",
    loginPath: "/staff-login"
  }
};

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mode = useMemo(() => {
    if (location.pathname === "/admin-register") return "admin";
    if (location.pathname === "/staff-register") return "staff";
    return "default";
  }, [location.pathname]);

  const pageCopy = copyByMode[mode];
  const verifyOtpLink = `/verify-otp?purpose=registration&channel=email&email=${encodeURIComponent(formData.email)}&next=${encodeURIComponent(location.pathname)}`;

  const handleSendOtp = async () => {
    if (!formData.email.trim()) {
      setError("Enter your email first so OTP can be sent to the right account.");
      return;
    }

    setError("");
    setMessage("");
    try {
      await sendOtp({ purpose: "registration", channel: "email", email: formData.email });
      setOtpSent(true);
      setMessage("OTP sent to your email. Verify it before registering.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await register(formData, mode);
      const role = response.data.user.role;
      navigate(role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/");
    } catch (err) {
      const routeMissing = err.response?.status === 404;
      if (routeMissing && mode !== "default") {
        setError("Backend restart required for new admin/staff register routes. Please restart backend server.");
      } else {
        setError(err.response?.data?.message || err.message || "Registration failed. Verify OTP first.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(67,59,118,0.95),rgba(31,41,55,0.9))] px-8 py-14 text-white shadow-soft">
        <p className="text-lg text-white/70">{pageCopy.breadcrumb}</p>
        <h1 className="mt-3 text-5xl font-light tracking-tight">{pageCopy.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">{pageCopy.banner}</p>
      </section>
      <section className="-mt-12 pb-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.12)] md:p-12 animate-enter">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <form onSubmit={handleSubmit}>
              <h2 className="text-4xl font-light text-slate-800">{pageCopy.formTitle}</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <input className="rounded-2xl border border-slate-200 px-5 py-4" placeholder="Full Name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
                <input className="rounded-2xl border border-slate-200 px-5 py-4" placeholder="Phone" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
                <input className="rounded-2xl border border-slate-200 px-5 py-4 md:col-span-2" placeholder="Email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
                <input className="rounded-2xl border border-slate-200 px-5 py-4 md:col-span-2" placeholder="Password" type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className="rounded-xl bg-[var(--brand-green)] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white" onClick={handleSendOtp}>
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
                <Link to={verifyOtpLink} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
                  Verify OTP
                </Link>
              </div>
              {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
              <button className="mt-8 rounded-xl bg-[var(--brand-indigo-dark)] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,#f4f7ff,#ffffff)] p-8">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-soft animate-float">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Why register</p>
                <ul className="mt-6 space-y-4 text-base text-slate-600">
                  <li>Track order history and current order status.</li>
                  <li>Book your table in advance.</li>
                  <li>Use Razorpay checkout from place-order page.</li>
                </ul>
                <p className="mt-6 text-sm text-slate-500">Already registered? <Link to={pageCopy.loginPath} className="font-semibold text-[var(--brand-green)]">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default RegisterPage;
