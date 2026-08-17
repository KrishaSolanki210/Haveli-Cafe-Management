import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (menuItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item._id === menuItem._id);

      if (existingItem) {
        return currentItems.map((item) =>
          item._id === menuItem._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...menuItem, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => (item._id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item._id !== itemId));
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount
  }), [items, totalAmount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
