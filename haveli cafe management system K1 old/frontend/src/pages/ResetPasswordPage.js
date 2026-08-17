import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { resetPassword } from "../services/authService";

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [email, setEmail] = useState(params.get("email") || "");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await resetPassword({ email, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset password failed.");
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-stone-900">Reset Password</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-2xl border border-orange-200 px-4 py-3" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="w-full rounded-2xl border border-orange-200 px-4 py-3" type="password" placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="w-full rounded-2xl bg-stone-900 px-4 py-3 font-semibold text-white">Update Password</button>
        </form>
      </div>
    </Layout>
  );
}

export default ResetPasswordPage;
