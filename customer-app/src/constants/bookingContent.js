import { SERVICE_CATEGORIES } from "@/constants/homeContent";

export const BOOKING_SERVICE_OPTIONS = SERVICE_CATEGORIES.flatMap((cat) => {
  if (cat.groups) {
    return cat.groups.flatMap((group) =>
      group.items.map((item) => ({
        title: item.title,
        category: cat.label,
      }))
    );
  }

  return cat.items.map((item) => ({
    title: item.title,
    category: cat.label,
  }));
});

export const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
];

/**
 * Mock availability.
 * Replace with real backend availability later.
 */
export function getUnavailableSlots(dateStr) {
  if (!dateStr) return [];

  let seed = 0;

  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i);
  }

  const first = seed % TIME_SLOTS.length;
  const second = (seed * 3 + 1) % TIME_SLOTS.length;

  const unavailable = [TIME_SLOTS[first]];

  if (second !== first) {
    unavailable.push(TIME_SLOTS[second]);
  }

  return unavailable;
}

/**
 * Coupon codes
 * The coupon is collected with the booking.
 * Final discount/value can be confirmed by admin.
 */
export const COUPONS = [
  {
    code: "WELCOME10",
    type: "percentage",
    discount: 10,
  },
  {
    code: "MSP500",
    type: "fixed",
    discount: 500,
  },
  {
    code: "NEWCLIENT",
    type: "percentage",
    discount: 15,
  },
];

// /**
//  * Pricing message
//  */
// export const PRICING_MESSAGE =
//   "Admin will contact you to confirm the final price.";









//older code

// import { SERVICE_CATEGORIES } from "@/constants/homeContent";

// /**
//  * Mock base pricing per service - deterministically derived from the
//  * category + title so every option gets a stable, plausible price without
//  * hand-writing one for all ~20 services. Replace with real pricing once
//  * a backend/catalog exists.
//  */
// function mockPrice(category, title) {
//   const BASE_BY_CATEGORY = {
//     Editing: 80,
//     Photography: 220,
//     Videography: 450,
//     Broadcast: 900,
//   };
//   let seed = 0;
//   for (let i = 0; i < title.length; i++) seed += title.charCodeAt(i);
//   const base = BASE_BY_CATEGORY[category] ?? 150;
//   return base + (seed % 120);
// }

// export const BOOKING_SERVICE_OPTIONS = SERVICE_CATEGORIES.flatMap((cat) => {
//   if (cat.groups) {
//     return cat.groups.flatMap((group) =>
//       group.items.map((item) => ({
//         title: item.title,
//         category: cat.label,
//         price: mockPrice(cat.label, item.title),
//       }))
//     );
//   }
//   return cat.items.map((item) => ({
//     title: item.title,
//     category: cat.label,
//     price: mockPrice(cat.label, item.title),
//   }));
// });

// export const TIME_SLOTS = [
//   "09:00 AM",
//   "10:30 AM",
//   "12:00 PM",
//   "01:30 PM",
//   "03:00 PM",
//   "04:30 PM",
// ];

// /**
// /**
//  * Mock availability - deterministically derives... 1-2 "already booked" slots
//  * per date from the date string itself, so the same date always shows the
//  * same unavailable slots (no backend, no randomness on re-render).
//  * Replace this with a real API call once bookings are backend-driven.
//  */
// export function getUnavailableSlots(dateStr) {
//   if (!dateStr) return [];

//   let seed = 0;
//   for (let i = 0; i < dateStr.length; i++) {
//     seed += dateStr.charCodeAt(i);
//   }

//   const first = seed % TIME_SLOTS.length;
//   const second = (seed * 3 + 1) % TIME_SLOTS.length;

//   const unavailable = [TIME_SLOTS[first]];
//   if (second !== first) unavailable.push(TIME_SLOTS[second]);

//   return unavailable;
// }

// export const COUPONS = [
//   {
//     code: "WELCOME10",
//     discount: 10,
//     type: "percentage",
//   },
//   {
//     code: "MSP500",
//     discount: 500,
//     type: "fixed",
//   },
//   {
//     code: "NEWCLIENT",
//     discount: 15,
//     type: "percentage",
//   },
// ];