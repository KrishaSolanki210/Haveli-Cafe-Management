import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { sendOtp } from "../services/authService";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await sendOtp({ purpose: "forgot_password", channel: "email", email });
      setMessage("OTP sent successfully. Continue to verify OTP.");
      navigate(`/verify-otp?purpose=forgot_password&channel=email&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP.");
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-stone-900">Forgot Password</h1>
        <p className="mt-2 text-sm text-stone-600">We will send an OTP to your registered email.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-2xl border border-orange-200 px-4 py-3" type="email" placeholder="Registered email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="w-full rounded-2xl bg-stone-900 px-4 py-3 font-semibold text-white">Send OTP</button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm font-semibold text-brand-700">Back to login</Link>
      </div>
    </Layout>
  );
}

export default ForgotPasswordPage;
