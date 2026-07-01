"use client";

import React from "react";
import { AppProvider, useApp } from "@/lib/context/app-context";
import { CartDrawer } from "@/components/cart-drawer";

const GlobalCartDrawerContainer: React.FC = () => {
  const { isCartOpen, setIsCartOpen } = useApp();
  return <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
};

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      {children}
      <GlobalCartDrawerContainer />
    </AppProvider>
  );
};
