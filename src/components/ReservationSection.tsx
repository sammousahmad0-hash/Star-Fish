import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import type { Reservation } from '../types.js';
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MessageSquare,
  Sparkles,
  Loader2,
  CalendarCheck
} from 'lucide-react';

export function ReservationSection() {
  const { t, addReservation } = useRestaurant();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(() => {
    // Tomorrow as default date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('20:00');
  const [specialRequest, setSpecialRequest] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const timeslots = [
    '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !date || !time) return;

    setLoading(true);
    try {
      const res = await addReservation({
        fullName,
        phone,
        email,
        guests: Number(guests),
        date,
        time,
        specialRequest
      });
      setConfirmedReservation(res);
    } catch (err) {
      console.error('Reservation booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setGuests(2);
    setSpecialRequest('');
  };

  return (
    <section id="reservation" className="py-24 bg-[#040810] text-[#E2E8F0] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/4 w-[32rem] h-[32rem] bg-[#004A75]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1A2C] border border-[#E2B774]/30 text-[#E2B774] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TABLES & PRIVILEGE</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t.resTitle}
          </h2>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-[#C59A53] max-w-xl mx-auto">
            {t.resSubtitle}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#081220]/95 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {confirmedReservation ? (
            /* Confirmation Screen */
            <div className="py-8 px-4 text-center max-w-xl mx-auto animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C59A53] block mb-2">
                {t.resSuccessTitle}
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                {t.resSuccessSubtitle}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light">
                {t.resNotice}
              </p>

              {/* Reference Details Box */}
              <div className="p-6 rounded-2xl bg-[#040810] border border-slate-800 mb-8 text-left rtl:text-right space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400">{t.resRefLabel}</span>
                  <span className="font-mono text-base font-bold text-[#E2B774]">
                    {confirmedReservation.refCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block mb-0.5">{t.resFullName}</span>
                    <strong className="text-white">{confirmedReservation.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">{t.resGuests}</span>
                    <strong className="text-white">{confirmedReservation.guests} Persons</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">{t.resDate}</span>
                    <strong className="text-white">{confirmedReservation.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">{t.resTime}</span>
                    <strong className="text-white">{confirmedReservation.time}</strong>
                  </div>
                </div>

                {confirmedReservation.specialRequest && (
                  <div className="pt-2 text-xs border-t border-slate-800">
                    <span className="text-slate-500 block mb-0.5">{t.resRequests}</span>
                    <p className="text-slate-300 italic">« {confirmedReservation.specialRequest} »</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#E2B774]" />
                <span>{t.bookAnother}</span>
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6 text-left rtl:text-right">
              {/* Row 1: Name, Phone, Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {t.resFullName} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lord Edward Hastings"
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {t.resPhone} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {t.resEmail} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@luxury.com"
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Guests, Date, Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {t.resGuests}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white outline-none transition-all cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map(num => (
                        <option key={num} value={num} className="bg-[#081220]">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {t.resDate} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {t.resTime} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Clock className="w-4 h-4" />
                    </div>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white outline-none transition-all cursor-pointer"
                    >
                      {timeslots.map(slot => (
                        <option key={slot} value={slot} className="bg-[#081220]">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Special Request */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  {t.resRequests}
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 text-slate-500 pointer-events-none">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder={t.resRequestsPlaceholder}
                    className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-3 rounded-xl bg-[#040810] border border-slate-700 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C59A53] via-[#E2B774] to-[#B3873F] text-[#050C17] text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-xl shadow-[#C59A53]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.loading}</span>
                    </>
                  ) : (
                    <>
                      <CalendarDays className="w-4 h-4" />
                      <span>{t.resSubmitBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
