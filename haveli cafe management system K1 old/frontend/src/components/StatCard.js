import React from "react";

function StatCard({ label, value, helper, variant = "default" }) {
  const variantClass = variant === "rose" ? "dashboard-card rose" : variant === "alt" ? "dashboard-card alt" : "dashboard-card";

  return (
    <div className={`${variantClass} rounded-[2rem] p-6 text-white shadow-[0_18px_40px_rgba(79,70,183,0.22)] transition hover:-translate-y-1`}>
      <p className="text-sm font-medium text-white/80">{label}</p>
      <p className="mt-6 text-5xl font-light">{value}</p>
      {helper ? <p className="mt-4 text-sm text-white/80">{helper}</p> : null}
    </div>
  );
}

export default StatCard;
