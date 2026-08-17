import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import { createStaffMember, deleteStaffMember, getStaffList } from "../services/cafeService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "staff"
};

function ManageStaffPage() {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const loadStaff = async () => {
    try {
      const response = await getStaffList();
      setStaff(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch staff.");
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await createStaffMember(formData);
      setFormData(initialForm);
      loadStaff();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create staff member.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStaffMember(id);
      loadStaff();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete staff member.");
    }
  };

  return (
    <Layout>
      <div className="grid gap-6 xl:grid-cols-[1.05fr,1fr]">
        <form className="rounded-[2rem] bg-white p-8 shadow-soft" onSubmit={handleCreate}>
          <h2 className="text-4xl font-light text-slate-900">Add Staff</h2>
          <div className="mt-8 space-y-5">
            <input className="w-full rounded-2xl border border-slate-200 px-5 py-4" placeholder="Staff Name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
            <input className="w-full rounded-2xl border border-slate-200 px-5 py-4" placeholder="Mobile Number" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
            <input className="w-full rounded-2xl border border-slate-200 px-5 py-4" type="email" placeholder="Email Address" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
            <input className="w-full rounded-2xl border border-slate-200 px-5 py-4" type="password" placeholder="Password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
            <select className="w-full rounded-2xl border border-slate-200 px-5 py-4" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          <button className="mt-8 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white">Create Staff</button>
        </form>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h2 className="text-4xl font-light text-slate-900">Staff List</h2>
          <div className="mt-8 space-y-4">
            {staff.map((member, index) => (
              <div key={member._id} className="grid items-center gap-4 rounded-2xl border border-slate-100 px-5 py-5 md:grid-cols-[0.5fr,1fr,1.2fr,0.9fr]">
                <div className="text-lg font-semibold text-slate-500">{index + 1}</div>
                <div>
                  <p className="font-semibold text-slate-900">{member._id.slice(-8)}</p>
                  <p className="text-sm text-slate-400">Staff ID</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm capitalize text-slate-400">{member.role}</p>
                </div>
                <div className="flex gap-3 md:justify-end">
                  <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                  <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white" onClick={() => handleDelete(member._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ManageStaffPage;
