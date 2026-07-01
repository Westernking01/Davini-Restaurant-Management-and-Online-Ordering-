"use client";

import React, { useState } from "react";
import { Product, ProductOption } from "@/lib/data/mock-data";
import { useApp } from "@/lib/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { Search, Clock, Plus, Check, SlidersHorizontal, UtensilsCrossed, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export const MenuGrid: React.FC = () => {
  const { products, categories, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal states for customizing item
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [chosenOptions, setChosenOptions] = useState<ProductOption[]>([]);
  const [customNote, setCustomNote] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addingAnimationId, setAddingAnimationId] = useState<string | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === "ALL" || prod.categoryId === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.ingredients && prod.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleOpenCustomize = (prod: Product) => {
    if (!prod.options || prod.options.length === 0) {
      setAddingAnimationId(prod.id);
      setTimeout(() => {
        addToCart(prod, 1);
        setAddingAnimationId(null);
        triggerAddedAnimation(prod.id);
      }, 250);
    } else {
      setSelectedProduct(prod);
      setActiveImageIdx(0);
      const defaultSize = prod.options.find((o) => o.type === "Size" || o.type === "Spice Level");
      setChosenOptions(defaultSize ? [defaultSize] : []);
      setCustomNote("");
      setQuantity(1);
    }
  };

  const triggerAddedAnimation = (id: string) => {
    setAddedAnimationId(id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  const toggleOption = (option: ProductOption) => {
    if (option.type === "Size" || option.type === "Spice Level" || option.type === "Swallow Choice") {
      setChosenOptions((prev) => [...prev.filter((o) => o.type !== option.type), option]);
    } else {
      const exists = chosenOptions.some((o) => o.name === option.name);
      if (exists) {
        setChosenOptions(chosenOptions.filter((o) => o.name !== option.name));
      } else {
        setChosenOptions([...chosenOptions, option]);
      }
    }
  };

  const handleConfirmCustomAdd = () => {
    if (!selectedProduct) return;
    setAddingAnimationId(selectedProduct.id);
    setTimeout(() => {
      addToCart(selectedProduct, quantity, chosenOptions, customNote);
      setAddingAnimationId(null);
      triggerAddedAnimation(selectedProduct.id);
      setSelectedProduct(null);
    }, 250);
  };

  const calculateCustomPrice = () => {
    if (!selectedProduct) return 0;
    const optionsSum = chosenOptions.reduce((acc, opt) => acc + opt.extraPrice, 0);
    return (selectedProduct.price + optionsSum) * quantity;
  };

  return (
    <section id="menu" className="py-20 xl:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#C86D3B] font-semibold block">
          Culinary Feast Catalog
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1A1817]">
          Our Curated Dining Menu
        </h2>
        <p className="text-sm sm:text-base text-[#6B6560] leading-relaxed font-normal">
          Every dish is prepared freshly to order using sustainably harvested organic ingredients, prime halal meat cuts, and traditional firewood slow-cooking techniques.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 mt-3 w-4 h-4 text-[#6B6560]" />
          <input
            type="text"
            placeholder="Search by dish name, ingredient or spice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-16 py-3.5 rounded-md border border-[#E6E1DA] bg-[#FFFFFF] text-sm text-[#1A1817] shadow-2xs focus:outline-none focus:border-[#C86D3B] placeholder:text-[#6B6560] font-medium transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-3 text-xs font-semibold text-[#6B6560] hover:text-[#1A1817] bg-[#F4F0EA] px-2.5 py-1 rounded cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Selector Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-8 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === "ALL"
              ? "bg-[#1A1817] text-[#FAF8F5] shadow-xs"
              : "bg-[#FFFFFF] text-[#6B6560] border border-[#E6E1DA] hover:border-[#C86D3B] hover:text-[#1A1817]"
          }`}
        >
          <span>All Creations</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#1A1817] text-[#FAF8F5] shadow-xs"
                : "bg-[#FFFFFF] text-[#6B6560] border border-[#E6E1DA] hover:border-[#C86D3B] hover:text-[#1A1817]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {filteredProducts.map((prod, idx) => (
          <div
            key={prod.id}
            style={{ animationDelay: `${(idx % 6) * 120}ms` }}
            className="group rounded-lg bg-[#FFFFFF] border border-[#E6E1DA] hover:border-[#C86D3B] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg hover:-translate-y-1 animate-fade-in opacity-0"
          >
            <div className="relative h-60 overflow-hidden bg-[#F4F0EA]">
              <img
                src={prod.image}
                alt={prod.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              />
              
              {prod.featured && (
                <span className="absolute top-3 left-3 bg-[#1A1817] text-[#FAF8F5] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded shadow-xs">
                  Chef&apos;s Special
                </span>
              )}

              <div className="absolute bottom-3 left-3 bg-[#FAF8F5]/95 backdrop-blur-xs text-[#1A1817] font-semibold text-xs px-2.5 py-1 rounded flex items-center border border-[#E6E1DA]">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#C86D3B]" /> Prep: {prod.prepTime} mins
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {prod.dietary && prod.dietary.map((tag, tagIdx) => (
                    <span key={tagIdx} className="text-[10px] uppercase tracking-wider font-semibold text-[#1E3F20] bg-[#E8F0E9] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="font-serif font-bold text-xl text-[#1A1817] group-hover:text-[#C86D3B] transition-colors leading-snug">
                  {prod.name}
                </h3>
                
                <p className="text-xs text-[#6B6560] mt-2 line-clamp-2 leading-relaxed font-normal">
                  {prod.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E1DA] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#6B6560] uppercase tracking-wider block">Portion Price</span>
                  <span className="font-serif font-bold text-2xl text-[#1A1817]">
                    {formatCurrency(prod.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenCustomize(prod)}
                  disabled={addingAnimationId === prod.id}
                  className={`px-5 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    addedAnimationId === prod.id 
                      ? "bg-[#1E3F20] text-white animate-spring-pop shadow-md" 
                      : addingAnimationId === prod.id
                      ? "bg-[#C86D3B] text-white opacity-90"
                      : "bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] active:scale-95"
                  }`}
                >
                  {addingAnimationId === prod.id ? (
                    <span>Adding...</span>
                  ) : addedAnimationId === prod.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{prod.options && prod.options.length > 0 ? "Customize" : "Order Dish"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-[#FFFFFF] rounded-lg border border-[#E6E1DA] max-w-lg mx-auto shadow-2xs space-y-3 mt-8">
          <UtensilsCrossed className="w-10 h-10 text-[#6B6560] mx-auto" />
          <h3 className="font-serif font-bold text-2xl text-[#1A1817]">No culinary items match your criteria</h3>
          <p className="text-xs text-[#6B6560] max-w-xs mx-auto leading-relaxed">Try resetting your keyword search or selecting another culinary category.</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }} 
            className="mt-2 bg-[#1A1817] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Food Detail Modal Sheet - Luxury Ordering Experience */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Order Dish & Customization`}
          description="Personalize portion size, spice levels, and dietary notes."
          maxWidth="lg"
        >
          <div className="space-y-6 pt-2 font-sans">
            
            {/* Dish Header & Image Showcase */}
            <div className="space-y-4">
              {(() => {
                const modalImages = [
                  selectedProduct.image,
                  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                ];
                return (
                  <div className="space-y-2.5">
                    <div className="relative h-60 sm:h-72 w-full rounded-lg overflow-hidden border border-[#E6E1DA] bg-[#1A1817]">
                      <img
                        key={activeImageIdx}
                        src={modalImages[activeImageIdx] || selectedProduct.image}
                        alt={selectedProduct.name}
                        loading="lazy"
                        className="w-full h-full object-cover animate-fade-in"
                      />
                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        <span className="bg-[#1A1817] text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded shadow-sm">
                          Prep: {selectedProduct.prepTime} Mins
                        </span>
                      </div>
                    </div>

                    {/* Interactive Thumbnail Gallery */}
                    <div className="flex items-center gap-2">
                      {modalImages.map((imgUrl, thumbIdx) => (
                        <button
                          key={thumbIdx}
                          type="button"
                          onClick={() => setActiveImageIdx(thumbIdx)}
                          className={`relative h-14 w-20 rounded overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                            activeImageIdx === thumbIdx
                              ? "border-[#C86D3B] scale-105 shadow-xs"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1817]">
                    {selectedProduct.name}
                  </h3>
                  <span className="font-serif font-bold text-2xl text-[#C86D3B]">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B6560] mt-2 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Ingredients Breakdown */}
              {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                <div className="p-4 rounded bg-[#F4F0EA] border border-[#E6E1DA] space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1817] font-semibold block">
                    Key Ingredients & Spice Profile
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedProduct.ingredients.map((ing, i) => (
                      <span key={i} className="bg-[#FFFFFF] text-[#1A1817] text-xs px-2.5 py-1 rounded border border-[#E6E1DA]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Options Grouped By Type */}
            {selectedProduct.options && selectedProduct.options.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#E6E1DA]">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#C86D3B]" /> Select Culinary Preferences
                  </h5>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.options.map((opt, i) => {
                    const isSelected = chosenOptions.some((o) => o.name === opt.name);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleOption(opt)}
                        className={`p-3.5 rounded border text-left flex items-center justify-between transition-all duration-200 cursor-pointer active:scale-98 ${
                          isSelected
                            ? "border-[#C86D3B] bg-[#FAF8F5] text-[#1A1817] font-bold shadow-sm ring-1 ring-[#C86D3B]/20"
                            : "border-[#E6E1DA] bg-[#FFFFFF] hover:border-[#C86D3B]/50 hover:bg-[#F4F0EA] text-[#6B6560]"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                              isSelected ? "border-[#C86D3B] bg-[#C86D3B] text-white" : "border-[#C5BEBA] bg-[#FFFFFF]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 animate-spring-pop" />}
                          </div>
                          <span className="text-xs">{opt.name}</span>
                        </div>
                        {opt.extraPrice > 0 && (
                          <span className="text-xs font-semibold text-[#C86D3B]">
                            +{formatCurrency(opt.extraPrice)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Notes */}
            <div className="space-y-4 pt-4 border-t border-[#E6E1DA]">
              <div className="flex items-center justify-between bg-[#F4F0EA] p-4 rounded border border-[#E6E1DA]">
                <div>
                  <label className="text-xs font-semibold text-[#1A1817] block uppercase tracking-wider">Portion Quantity</label>
                  <span className="text-[11px] text-[#6B6560]">Select number of servings</span>
                </div>
                <div className="flex items-center border border-[#E6E1DA] rounded bg-[#FFFFFF] shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 hover:bg-[#F4F0EA] text-[#1A1817] font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-4 text-[#1A1817] min-w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-1.5 hover:bg-[#F4F0EA] text-[#1A1817] font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1817] block mb-1.5 uppercase tracking-wider">Kitchen & Dietary Notes</label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Extra pepper sauce on the side, well-done meat..."
                  className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FFFFFF] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] font-medium"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-[#E6E1DA] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#6B6560] uppercase tracking-wider block">Total Calculated Price</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1817]">
                  {formatCurrency(calculateCustomPrice())}
                </span>
              </div>
              <button 
                onClick={handleConfirmCustomAdd} 
                disabled={addingAnimationId === selectedProduct.id}
                className="bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded transition-all cursor-pointer shadow-sm disabled:opacity-75"
              >
                {addingAnimationId === selectedProduct.id ? "Adding..." : `Add to Bag • ${formatCurrency(calculateCustomPrice())}`}
              </button>
            </div>

          </div>
        </Modal>
      )}
    </section>
  );
};
