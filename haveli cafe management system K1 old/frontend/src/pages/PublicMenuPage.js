import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import MenuCard from "../components/MenuCard";
import Pagination from "../components/Pagination";
import { useCart } from "../context/CartContext";
import { getPublicMenu } from "../services/cafeService";

function PublicMenuPage() {
  const { addToCart } = useCart();
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await getPublicMenu();
        setMenu(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load menu right now.");
      }
    };

    loadMenu();
  }, []);

  const paginatedCategories = useMemo(() => {
    const paginatedMenu = menu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return paginatedMenu.reduce((accumulator, item) => {
      accumulator[item.category] = accumulator[item.category] || [];
      accumulator[item.category].push(item);
      return accumulator;
    }, {});
  }, [currentPage, menu]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(menu.length / itemsPerPage)), [menu]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <Layout>
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_40px_rgba(43,30,18,0.08)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand-gold-deep)]">Menu</p>
            <h1 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold text-[var(--brand-night)] md:text-6xl">
              Simple and unique food menu
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              This third page shows the menu with food photos and simple pagination, just the way you asked.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">
              Back to Dashboard
            </Link>
            <Link to="/cart" className="rounded-full bg-[var(--brand-night)] px-5 py-3 text-sm font-semibold text-white">
              View Cart
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-10">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {Object.entries(paginatedCategories).map(([category, items], categoryIndex) => (
          <div key={category} className="animate-enter" style={{ animationDelay: `${categoryIndex * 120}ms` }}>
            <div className="mb-5 flex items-center gap-4">
              <div className="h-1 w-20 rounded-full bg-[var(--brand-gold)]" />
              <h2 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[var(--brand-night)]">{category}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <MenuCard key={item._id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        ))}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </section>
    </Layout>
  );
}

export default PublicMenuPage;
