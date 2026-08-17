import React from "react";

function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p> : null}
        <h2 className="mt-2 text-3xl font-bold text-stone-900">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-stone-600">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
