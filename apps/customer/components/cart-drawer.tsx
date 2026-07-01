"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ShoppingCart, Sparkles, ArrowRight, CheckCircle2, Truck, Store, Utensils, CreditCard, Banknote, ShieldCheck } from "lucide-react";

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, placeOrderAsync, cartCount } = useApp();
  
  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP" | "DINE_IN">("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH">("CARD");
  const [name, setName] = useState("Chief Adebayo O.");
  const [phone, setPhone] = useState("+234 803 123 4567");
  const [email, setEmail] = useState("customer@davinisfoodbank.com");
  const [address, setAddress] = useState("14 Victoria Island Way, Lagos");
  const [note, setNote] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const deliveryFee = orderType === "DELIVERY" ? (subtotal > 0 ? 1500 : 0) : 0;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    const res = await placeOrderAsync({
      name,
      phone,
      email,
      address: orderType === "DELIVERY" ? address : undefined,
      note: `[Payment: ${paymentMethod}] ${note}`.trim(),
      orderType,
      paymentMethod,
    });

    if (res.success && res.authorizationUrl) {
      window.location.href = res.authorizationUrl;
      return;
    }

    setIsCheckingOut(false);
    if (res.success && res.orderNumber) {
      setOrderSuccess(res.orderNumber);
    } else {
      setCheckoutError(res.errorMessage || "Failed to process order transaction.");
    }
  };

  const handleResetAndClose = () => {
    setOrderSuccess(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-fade-in font-sans flex justify-end items-start overflow-y-auto"
      onClick={onClose}
    >
      <div className="w-full sm:w-screen max-w-md bg-[#FAF8F5] sm:border-l border-[#E6E1DA] shadow-2xl flex flex-col max-h-[100dvh] overflow-hidden animate-slide-in-right ml-auto">
        
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-[#E6E1DA] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#1A1817] flex items-center justify-center text-[#FAF8F5]">
              <ShoppingBag className="w-4 h-4 text-[#C86D3B]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#1A1817] leading-none">Dining Concierge Bag</h2>
              <span className="text-[10px] text-[#6B6560] uppercase tracking-widest font-semibold mt-1 block">VIP Order Service</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {cart.length > 0 && !orderSuccess && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-[#DC2626] hover:underline px-2 py-1 rounded cursor-pointer flex items-center gap-1 active:scale-95 transition-transform"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-[#F4F0EA] text-[#1A1817] transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 pb-7">
            {orderSuccess ? (
              <div className="py-12 text-center space-y-6 bg-[#FFFFFF] p-8 rounded border border-[#E6E1DA] shadow-2xs my-4 animate-scale-fade">
                <div className="w-16 h-16 bg-[#E8F0E9] text-[#1E3F20] rounded-full flex items-center justify-center mx-auto animate-spring-pop">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-3xl text-[#1A1817]">Royal Order Confirmed</h3>
                  <p className="text-xs text-[#6B6560] max-w-xs mx-auto leading-relaxed">
                    Your culinary request has been transmitted directly to our executive chef lounge.
                  </p>
                  <div className="bg-[#FAF8F5] p-3 rounded border border-[#E6E1DA] inline-block mt-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#6B6560] block font-semibold">Reference Code</span>
                    <span className="font-serif font-bold text-lg text-[#C86D3B] tracking-wider">{orderSuccess}</span>
                  </div>
                </div>
                <button 
                  onClick={handleResetAndClose} 
                  className="w-full bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] py-3.5 rounded text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Return to Lounge
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in my-auto">
                <div className="relative mx-auto my-4">
                  <div className="w-24 h-24 rounded-full bg-[#FFFFFF] border-2 border-dashed border-[#D97706]/40 flex items-center justify-center shadow-md animate-subtle-zoom">
                    <ShoppingCart className="w-10 h-10 text-[#D97706]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1A1817] text-[#FAF8F5] flex items-center justify-center shadow-lg border-2 border-[#FAF8F5]">
                    <span className="text-xs font-bold">0</span>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#D97706] absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-serif font-bold text-2xl text-[#1A1817]">Your Dining Card is Empty</h3>
                  <p className="text-xs text-[#6B6560] leading-relaxed font-medium">
                    Your VIP dining cart currently has 0 items. Explore our culinary catalog and select executive dishes to craft your authentic feast.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3.5 rounded-lg bg-[#1A1817] hover:bg-[#D97706] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Fulfillment Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider block">Fulfillment Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("DELIVERY")}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                        orderType === "DELIVERY"
                          ? "bg-[#1A1817] text-[#FAF8F5] border-[#1A1817] shadow-xs"
                          : "bg-[#FFFFFF] text-[#6B6560] border-[#E6E1DA] hover:border-[#C86D3B]"
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("PICKUP")}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                        orderType === "PICKUP"
                          ? "bg-[#1A1817] text-[#FAF8F5] border-[#1A1817] shadow-xs"
                          : "bg-[#FFFFFF] text-[#6B6560] border-[#E6E1DA] hover:border-[#C86D3B]"
                      }`}
                    >
                      <Store className="w-4 h-4 mb-1" />
                      <span>Pickup</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("DINE_IN")}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                        orderType === "DINE_IN"
                          ? "bg-[#1A1817] text-[#FAF8F5] border-[#1A1817] shadow-xs"
                          : "bg-[#FFFFFF] text-[#6B6560] border-[#E6E1DA] hover:border-[#C86D3B]"
                      }`}
                    >
                      <Utensils className="w-4 h-4 mb-1" />
                      <span>Dine-In</span>
                    </button>
                  </div>
                </div>

                {/* Selected Dishes */}
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider block">
                    Selected Items (<span key={cartCount} className="inline-block animate-spring-pop">{cartCount}</span>)
                  </label>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{ animationDelay: `${idx * 60}ms` }}
                        className="flex gap-3 p-3.5 rounded bg-[#FFFFFF] border border-[#E6E1DA] shadow-2xs animate-fade-in transition-all duration-200 hover:border-[#C86D3B]/50"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          loading="lazy"
                          className="w-14 h-14 rounded object-cover shrink-0 bg-[#F4F0EA]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-serif font-bold text-sm text-[#1A1817] truncate">{item.product.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#6B6560] hover:text-[#DC2626] p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {item.selectedOptions.length > 0 && (
                            <p className="text-[11px] text-[#C86D3B] font-semibold mt-0.5 truncate">
                              + {item.selectedOptions.map((o) => o.name).join(", ")}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2.5">
                            <span className="font-serif font-bold text-sm text-[#1A1817]">
                              {formatCurrency(item.itemPrice * item.quantity)}
                            </span>
                            <div className="flex items-center border border-[#E6E1DA] rounded bg-[#F4F0EA] overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-0.5 hover:bg-[#E6E1DA] text-[#1A1817] font-bold transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-2.5 text-[#1A1817] min-w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-0.5 hover:bg-[#E6E1DA] text-[#1A1817] font-bold transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider block">Payment Channel</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CARD")}
                      className={`p-3 rounded border flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === "CARD"
                          ? "border-[#C86D3B] bg-[#FFFFFF] text-[#1A1817] font-bold shadow-2xs"
                          : "border-[#E6E1DA] bg-[#FFFFFF] text-[#6B6560] hover:bg-[#F4F0EA]"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#C86D3B]" />
                      <div className="text-left">
                        <span className="text-xs font-semibold block">Paystack Card</span>
                        <span className="text-[10px] text-[#6B6560]">Instant Gateway</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CASH")}
                      className={`p-3 rounded border flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === "CASH"
                          ? "border-[#C86D3B] bg-[#FFFFFF] text-[#1A1817] font-bold shadow-2xs"
                          : "border-[#E6E1DA] bg-[#FFFFFF] text-[#6B6560] hover:bg-[#F4F0EA]"
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-[#1E3F20]" />
                      <div className="text-left">
                        <span className="text-xs font-semibold block">Pay on Delivery</span>
                        <span className="text-[10px] text-[#6B6560]">POS / Cash</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <form onSubmit={handleCheckout} className="pt-4 border-t border-[#E6E1DA] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider">Guest Delivery Details</h4>
                    <span className="text-[10px] text-[#1E3F20] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Secure Protocol
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-[#1A1817] block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs p-3 rounded border border-[#E6E1DA] bg-[#FFFFFF] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#1A1817] block mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-3 rounded border border-[#E6E1DA] bg-[#FFFFFF] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#1A1817] block mb-1">Email Address (for Paystack Receipt)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full text-xs p-3 rounded border border-[#E6E1DA] bg-[#FFFFFF] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                    />
                  </div>

                  {orderType === "DELIVERY" && (
                    <div>
                      <label className="text-[11px] font-semibold text-[#1A1817] block mb-1">Delivery Street Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street / Area in Lagos"
                        className="w-full text-xs p-3 rounded border border-[#E6E1DA] bg-[#FFFFFF] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-[#1A1817] block mb-1">Delivery / Kitchen Notes</label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Extra spice, gate code..."
                      className="w-full text-xs p-3 rounded border border-[#E6E1DA] bg-[#FFFFFF] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                    />
                  </div>

                  {/* Summary & Checkout */}
                  <div className="pt-4 border-t border-[#E6E1DA] space-y-3">
                    <div className="space-y-2 text-xs bg-[#FFFFFF] p-4 rounded border border-[#E6E1DA]">
                      <div className="flex justify-between text-[#6B6560]">
                        <span>Dishes Subtotal</span>
                        <span className="font-semibold text-[#1A1817]">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[#6B6560]">
                        <span>Fulfillment Fee ({orderType})</span>
                        <span className="font-semibold text-[#1A1817]">
                          {deliveryFee === 0 ? <span className="text-[#1E3F20] font-bold">FREE</span> : formatCurrency(deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#6B6560]">
                        <span>VAT Included</span>
                        <span className="font-semibold text-[#1A1817]">{formatCurrency(tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-[#1A1817] pt-2.5 border-t border-[#E6E1DA]">
                        <span>Total Payable</span>
                        <span className="font-serif text-lg text-[#C86D3B]">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="p-3 rounded bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs font-semibold">
                        ⚠️ {checkoutError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isCheckingOut || cart.length === 0}
                      className="w-full bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.15em] py-4 rounded transition-all duration-300 active:scale-98 cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>{isCheckingOut ? "Processing order..." : `Place Feast Order (${formatCurrency(total)})`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};
