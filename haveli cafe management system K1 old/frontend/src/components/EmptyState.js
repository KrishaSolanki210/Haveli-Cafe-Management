import React from "react";

function EmptyState({ title, subtitle }) {
  return (
    <div className="rounded-3xl border border-dashed border-orange-200 bg-white/80 p-10 text-center">
      <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
      <p className="mt-3 text-sm text-stone-600">{subtitle}</p>
    </div>
  );
}

export default EmptyState;
