// import { supabase } from "./supabase/supabaseClient";

// export async function createBooking(bookingData) {
//   // Generate unique booking number from Supabase
//   const { data: bookingNumber, error: numberError } =
//     await supabase.rpc("generate_booking_number");

//   if (numberError) {
//     throw numberError;
//   }


//   // Add booking number to the booking data
//   const finalBookingData = {
//     ...bookingData,
//     booking_number: bookingNumber,
//   };

//   // Insert booking into Supabase
//   const { data, error } = await supabase
//     .from("bookings")
//     .insert([finalBookingData]);

//   if (error) {

//     throw error;
//   }

//   return data;
// }

import { supabase } from "./supabase/supabaseClient";

export async function createBooking(bookingData) {
  const { data: bookingNumber, error: numberError } =
    await supabase.rpc("generate_booking_number");

  if (numberError) {
    console.error("BOOKING NUMBER ERROR:", numberError);
    throw numberError;
  }

  console.log("Generated booking number:", bookingNumber);

  const finalBookingData = {
    ...bookingData,
    booking_number: bookingNumber,
  };

  console.log("FINAL BOOKING DATA:", finalBookingData);

  const { data, error } = await supabase
    .from("bookings")
    .insert([finalBookingData]);

  if (error) {
    console.error("BOOKING INSERT ERROR:", error);
    throw error;
  }

  return data;
}