import React from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

function NotFoundPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
        <h1 className="mt-3 text-4xl font-bold text-stone-900">Page not found</h1>
        <p className="mt-4 text-sm text-stone-600">The route you opened does not exist in the frontend workspace.</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-stone-900 px-5 py-3 font-semibold text-white">Return home</Link>
      </div>
    </Layout>
  );
}

export default NotFoundPage;
