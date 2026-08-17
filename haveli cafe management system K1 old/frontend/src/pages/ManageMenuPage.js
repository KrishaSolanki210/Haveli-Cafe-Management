import React, { useEffect, useMemo, useState } from "react";

import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import SectionHeader from "../components/SectionHeader";
import { createMenuItem, deleteMenuItem, getAdminMenu } from "../services/cafeService";
import { getMenuImage } from "../utils/menuImages";

const initialForm = {
  name: "",
  description: "",
  category: "Main Course",
  price: "",
  preparationTime: 15,
  imageUrl: ""
};

function ManageMenuPage() {
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const loadMenu = async () => {
    try {
      const response = await getAdminMenu();
      setMenu(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch menu.");
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createMenuItem({ ...formData, price: Number(formData.price), preparationTime: Number(formData.preparationTime) });
      setFormData(initialForm);
      setCurrentPage(1);
      loadMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create menu item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      loadMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete menu item.");
    }
  };

  const paginatedMenu = useMemo(() => {
    return menu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [currentPage, menu]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(menu.length / itemsPerPage));
  }, [menu]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <Layout>
      <SectionHeader eyebrow="Admin Menu" title="Manage menu items" subtitle="Add new dishes and remove outdated items." />
      <div className="grid gap-6 lg:grid-cols-[1.1fr,1.4fr]">
        <form className="rounded-3xl bg-white p-6 shadow-soft" onSubmit={handleCreate}>
          <input className="mb-4 w-full rounded-2xl border border-orange-200 px-4 py-3" placeholder="Item name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
          <textarea className="mb-4 w-full rounded-2xl border border-orange-200 px-4 py-3" rows="4" placeholder="Description" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-orange-200 px-4 py-3" placeholder="Category" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} required />
            <input className="rounded-2xl border border-orange-200 px-4 py-3" type="number" placeholder="Price" value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} required />
          </div>
          <input className="mt-4 w-full rounded-2xl border border-orange-200 px-4 py-3" type="number" placeholder="Preparation time" value={formData.preparationTime} onChange={(event) => setFormData({ ...formData, preparationTime: event.target.value })} />
          <input className="mt-4 w-full rounded-2xl border border-orange-200 px-4 py-3" placeholder="Food image URL" value={formData.imageUrl} onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })} />
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          <button className="mt-6 rounded-2xl bg-stone-900 px-5 py-3 font-semibold text-white">Add Menu Item</button>
        </form>
        <div className="space-y-4">
          {paginatedMenu.map((item) => (
            <div key={item._id} className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <img src={getMenuImage(item)} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900">{item.name}</h3>
                    <p className="mt-1 text-sm font-medium text-emerald-700">{item.category} - Rs. {item.price}</p>
                    <p className="mt-2 text-sm text-stone-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                    {item.preparationTime || 15} mins
                  </span>
                  <button className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </Layout>
  );
}

export default ManageMenuPage;
