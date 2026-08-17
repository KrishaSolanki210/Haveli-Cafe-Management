import React from "react";

import { getMenuImage } from "../utils/menuImages";

function MenuCard({ item, onAddToCart }) {
  return (
    <div className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-[#fffdf9] shadow-[0_20px_45px_rgba(43,30,18,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(43,30,18,0.14)]">
      <div className="relative h-52 overflow-hidden">
        <img
          src={getMenuImage(item)}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1711] via-[#2b2119]/35 to-transparent p-6 text-white">
          <div className="flex h-full flex-col justify-end">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-gold)]">{item.category}</p>
            <h3 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold">{item.name}</h3>
            <p className="mt-3 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">Rs. {item.price}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm leading-7 text-stone-600">{item.description || "Freshly prepared with signature Haveli flavors."}</p>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500">Prep time: {item.preparationTime || 15} mins</p>
          {onAddToCart ? (
            <button className="rounded-full bg-[var(--brand-night)] px-5 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-gold-deep)]" onClick={() => onAddToCart(item)}>
              Add
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
