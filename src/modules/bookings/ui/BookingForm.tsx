"use client";

import { useState } from "react";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { FormError, FormSuccess, SubmitButton } from "@/modules/shared/admin/ui";
import { formatPrice } from "@/modules/shared/money";
import { totalPrice } from "@/modules/experiences/domain";
import { requestBooking } from "../actions";

type Props = {
  experienceId: string;
  price: number | null;
  currency: string;
  pricingType: string;
  maxGroupSize: number | null;
  priceText: string | null;
  freeCancellation: boolean;
};

function tomorrow() {
  const d = new Date(Date.now() + 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

/** Booking request card shown on the experience page. */
export function BookingForm({ experienceId, price, currency, pricingType, maxGroupSize, priceText, freeCancellation }: Props) {
  const { state, onSubmit, pending } = useFormAction(requestBooking);
  const [guests, setGuests] = useState(2);
  const total = totalPrice(price, pricingType, guests);
  const max = maxGroupSize ?? 20;

  if (state?.success) {
    return (
      <div className="card space-y-3 p-6">
        <p className="text-2xl">🎉</p>
        <h3 className="font-display text-xl font-semibold">Request sent!</h3>
        <FormSuccess message={state.success} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        {priceText ? (
          <p className="text-sm text-stone-600">{price ? "From " : ""}<span className="text-2xl font-bold text-ink">{priceText}</span></p>
        ) : (
          <p className="text-lg font-semibold">Price on request</p>
        )}
      </div>
      <FormError error={state?.error} />
      <input type="hidden" name="experienceId" value={experienceId} />
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="date">Date</label>
          <input id="date" name="date" type="date" required min={tomorrow()} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="guests">Guests</label>
          <select id="guests" name="guests" className="input" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <input name="guestName" required placeholder="Your name" className="input" autoComplete="name" aria-label="Your name" />
      <input name="guestEmail" type="email" required placeholder="Email" className="input" autoComplete="email" aria-label="Email" />
      <input name="guestPhone" type="tel" placeholder="Phone (optional)" className="input" autoComplete="tel" aria-label="Phone" />
      <textarea name="message" rows={3} placeholder="Anything your host should know? Interests, dietary needs…" className="input" aria-label="Message" />
      {total !== null && total > 0 && (
        <p className="flex justify-between border-t border-stone-200 pt-3 text-sm">
          <span>Total for {guests} {guests === 1 ? "guest" : "guests"}</span>
          <span className="font-semibold">{formatPrice(total, currency)}</span>
        </p>
      )}
      <SubmitButton pending={pending} className="btn-primary w-full">Request to book</SubmitButton>
      <ul className="space-y-2 border-t border-stone-200 pt-4 text-sm text-stone-700">
        {freeCancellation && <li>✅ <strong>Free cancellation</strong> — see the policy below</li>}
        <li>✅ <strong>Request now, pay later</strong> — you won&apos;t be charged yet</li>
        <li>✅ Your host confirms availability, usually within a day</li>
      </ul>
    </form>
  );
}
