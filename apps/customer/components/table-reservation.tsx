"use client";

import React, { useState } from "react";
import { Users, Phone, User, CheckCircle2, GlassWater, Clock, Award, Heart, MapPin } from "lucide-react";

export const TableReservation: React.FC = () => {
  const [lounge, setLounge] = useState("Lagos - Victoria Island Flagship Lounge");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState("Casual Dining");
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<{ id: string } | null>(null);

  const lounges = [
    "Lagos - Victoria Island Flagship Lounge",
    "Abuja - Maitama Executive Dining",
    "Port Harcourt - GRA VIP Lounge",
  ];

  const occasions = [
    "Casual Dining",
    "Birthday Celebration",
    "Romantic Anniversary",
    "Executive Banquet",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedReservation({ id: `VIP-${Math.floor(1000 + Math.random() * 9000)}` });
    }, 1000);
  };

  return (
    <section id="reservations" className="py-24 xl:py-32 bg-[#FAF8F5] border-t border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C86D3B] font-semibold block">
            Hospitality Concierge
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1A1817]">
            Reserve Your Dining Table
          </h2>
          <p className="text-sm sm:text-base text-[#6B6560] max-w-xl mx-auto leading-relaxed font-normal">
            Experience authentic West African gastronomy in serene luxury. Enjoy attentive concierge service, private dining booths, and master chef curation.
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg border border-[#E6E1DA] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 bg-[#1A1817] p-8 sm:p-12 text-[#FAF8F5] flex flex-col justify-between relative">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-[#FAF8F5] text-[10px] uppercase tracking-widest px-3 py-1 rounded">
                <Award className="w-3 h-3 text-[#C86D3B]" /> Exclusive Lounge
              </span>
              
              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#FAF8F5]">
                An Atmosphere Crafted for Distinction.
              </h3>
              
              <p className="text-xs sm:text-sm text-[#E6E1DA] leading-relaxed font-normal">
                Whether hosting a milestone anniversary or high-stakes executive dinners, Davini&apos;s delivers the golden standard of hospitality.
              </p>

              <div className="space-y-6 pt-6 border-t border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded bg-[#C86D3B]/20 flex items-center justify-center text-[#C86D3B] shrink-0 mt-0.5">
                    <GlassWater className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FAF8F5]">Welcome Toast Nectar</h4>
                    <p className="text-xs text-[#C5BEBA] mt-0.5 leading-relaxed">Complimentary chilled palm wine nectar or sparkling beverage upon arrival.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded bg-[#C86D3B]/20 flex items-center justify-center text-[#C86D3B] shrink-0 mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FAF8F5]">Personal Table Steward</h4>
                    <p className="text-xs text-[#C5BEBA] mt-0.5 leading-relaxed">Dedicated concierge attending exclusively to your dining party.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-10 space-y-2 border-t border-white/15 text-xs text-[#C5BEBA]">
              <div className="flex items-center text-[#C86D3B] font-semibold">
                <Clock className="w-3.5 h-3.5 mr-2" />
                <span>Hours: Mon - Sun (11:00 AM - 11:30 PM)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-2 shrink-0" />
                <span>Victoria Island &bull; Maitama &bull; Port Harcourt GRA</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Booking Form */}
          <div className="lg:col-span-7 p-8 sm:p-14 bg-[#FFFFFF] flex flex-col justify-center">
            {confirmedReservation ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-scale-fade">
                <div className="w-16 h-16 rounded-full bg-[#E8F0E9] text-[#1E3F20] flex items-center justify-center animate-spring-pop">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#1E3F20] font-semibold">
                    Table Secured
                  </span>
                  <h4 className="font-serif text-3xl font-bold text-[#1A1817]">We Eagerly Await You</h4>
                  <p className="text-xs text-[#6B6560] max-w-sm mx-auto leading-relaxed">
                    Your reservation has been logged into our master ledger. Present your reference code upon arrival:
                  </p>
                </div>
                
                <div className="bg-[#F4F0EA] px-8 py-4 rounded font-serif font-bold text-3xl text-[#1A1817] border border-[#E6E1DA] tracking-wider">
                  {confirmedReservation.id}
                </div>

                <div className="p-5 rounded bg-[#FAF8F5] border border-[#E6E1DA] text-xs text-[#6B6560] max-w-sm w-full space-y-2 text-left">
                  <div className="flex justify-between font-semibold text-[#1A1817]">
                    <span>Lounge:</span>
                    <span className="text-right truncate max-w-[180px]">{lounge.split("-")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occasion:</span>
                    <span className="font-semibold text-[#1A1817]">{occasion}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E6E1DA]">
                    <span>Party & Schedule:</span>
                    <span className="font-semibold text-[#C86D3B]">{guests} Guests @ {time} ({date || "Today"})</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConfirmedReservation(null);
                    setGuestName("");
                    setSpecialRequest("");
                  }}
                  className="bg-transparent hover:bg-[#F4F0EA] text-[#1A1817] border border-[#E6E1DA] text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded cursor-pointer transition-all duration-200 active:scale-95"
                >
                  Book Another Table
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-[#E6E1DA] flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#1A1817]">Reservation Protocol</h4>
                    <p className="text-xs text-[#6B6560] mt-0.5">Complete details to secure private dining priority</p>
                  </div>
                </div>

                {/* Lounge Location Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider block">Select Lounge Location</label>
                  <select
                    value={lounge}
                    onChange={(e) => setLounge(e.target.value)}
                    className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-semibold cursor-pointer"
                  >
                    {lounges.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Occasion Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1817] uppercase tracking-wider block">Dining Occasion</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {occasions.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setOccasion(occ)}
                        className={`p-3 rounded border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 text-center ${
                          occasion === occ
                            ? "bg-[#1A1817] text-[#FAF8F5] border-[#1A1817] shadow-xs"
                            : "bg-[#FFFFFF] text-[#6B6560] border-[#E6E1DA] hover:border-[#C86D3B] hover:text-[#1A1817]"
                        }`}
                      >
                        <span className="truncate">{occ}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1817] flex items-center mb-1.5 uppercase tracking-wider">
                      <User className="w-3.5 h-3.5 mr-1.5 text-[#C86D3B]" /> Lead Guest Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Chief Adebayo O."
                      className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1817] flex items-center mb-1.5 uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-[#C86D3B]" /> Mobile Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>

                {/* Date, Time, Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1817] block mb-1.5 uppercase tracking-wider">Date *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1817] block mb-1.5 uppercase tracking-wider">Time *</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1817] block mb-1.5 uppercase tracking-wider">Party Size</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 font-semibold cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1817] block mb-1.5 uppercase tracking-wider">Concierge Notes</label>
                  <textarea
                    rows={2}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="E.g., Quiet booth preferences, dietary restrictions..."
                    className="w-full text-xs p-3.5 rounded border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 resize-none font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.15em] py-4 rounded transition-all duration-300 active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Securing Table..." : "Confirm Table Reservation"}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
