"use client";

import React from "react";
import { INITIAL_REVIEWS } from "@/lib/data/mock-data";
import { Star, Check } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 xl:py-32 bg-[#FAF8F5] border-t border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Story Banner */}
        <ScrollReveal direction="up" duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C86D3B] font-semibold block">
                Our Culinary Heritage
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-[#1A1817] leading-tight">
                Where Ancient Firewood Traditions Meet Modern Dining.
              </h2>
              
              <p className="text-sm sm:text-base text-[#6B6560] leading-relaxed font-normal">
                Founded on the philosophy that Nigerian gastronomy deserves imperial presentation, Davini&apos;s Food Bank elevates authentic party recipes into an extraordinary culinary experience. We slow-cook our sauces for hours over organic firewood to capture that unmistakable smoky depth.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#E6E1DA]">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-lg text-[#1A1817]">100% Organic Spices</h4>
                  <p className="text-xs text-[#6B6560] leading-normal">Sustainably harvested peppers and farm-fresh tubers sourced weekly.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-lg text-[#1A1817]">Master Chef Curation</h4>
                  <p className="text-xs text-[#6B6560] leading-normal">Every platter is taste-tested for spice balance and aroma before dispatch.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-[#1A1817] uppercase tracking-wider">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3F20]" /> Halal Certified</span>
                <span>&bull;</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3F20]" /> ISO 22000 Hygiene</span>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                  alt="Restaurant Ambience"
                  className="rounded-lg object-cover h-72 w-full border border-[#E6E1DA] shadow-2xs hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="p-6 rounded-lg bg-[#1A1817] text-[#FAF8F5] space-y-2">
                  <span className="text-[#C86D3B] text-[10px] uppercase tracking-widest font-semibold block">Chef Guarantee</span>
                  <p className="font-serif text-sm font-medium leading-relaxed italic">&ldquo;We do not rush excellence. Every grain of rice tells our story.&rdquo;</p>
                </div>
              </div>
              <div className="pt-8">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                  alt="Chef Plating"
                  className="rounded-lg object-cover h-80 w-full border border-[#E6E1DA] shadow-2xs hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Verified Guest Testimonials */}
        <div className="space-y-12 pt-16 border-t border-[#E6E1DA]">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C86D3B] font-semibold">
                Guest Experiences
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817]">Words From Our Diners</h3>
              <p className="text-sm text-[#6B6560]">Read genuine reviews from executives, families, and food critics across Lagos.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_REVIEWS.map((rev, idx) => (
              <ScrollReveal key={rev.id} direction="up" delay={idx * 150} duration={600}>
                <div className="p-8 rounded-lg bg-[#FFFFFF] border border-[#E6E1DA] flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-[#C86D3B] transition-all duration-300 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#C86D3B] gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#C86D3B] text-[#C86D3B]" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1E3F20] bg-[#E8F0E9] px-2 py-0.5 rounded">
                        Verified Dine
                      </span>
                    </div>
                    <p className="text-sm text-[#1A1817] font-normal italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E6E1DA] text-xs">
                    <span className="font-semibold text-[#1A1817]">{rev.customerName}</span>
                    <span className="text-[#6B6560] text-[11px]">{rev.date}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
