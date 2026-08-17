import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { verifyOtp } from "../services/authService";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nextPath = params.get("next");
  const [formData, setFormData] = useState({
    purpose: params.get("purpose") || "registration",
    channel: params.get("channel") || "email",
    email: params.get("email") || "",
    phone: "",
    otp: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await verifyOtp(formData);
      setMessage("OTP verified successfully.");
      navigate(
        formData.purpose === "forgot_password"
          ? `/reset-password?email=${encodeURIComponent(formData.email)}`
          : nextPath || "/register"
      );
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-stone-900">Verify OTP</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-2xl border border-orange-200 px-4 py-3" placeholder="Email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
          <input className="w-full rounded-2xl border border-orange-200 px-4 py-3" placeholder="6-digit OTP" value={formData.otp} onChange={(event) => setFormData({ ...formData, otp: event.target.value })} required />
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="w-full rounded-2xl bg-stone-900 px-4 py-3 font-semibold text-white">Verify</button>
        </form>
      </div>
    </Layout>
  );
}

export default VerifyOtpPage;
