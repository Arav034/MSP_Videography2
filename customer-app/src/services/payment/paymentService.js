import { supabase } from "@/services/supabase/supabaseClient";

// Fetch booking for payment
export const getBookingForPayment = async (bookingNumber) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "booking_number, customer_name, service, category, total_amount, payment_status"
    )
    .eq("booking_number", bookingNumber.trim())
    .maybeSingle();

  if (error) {
    console.error("BOOKING FETCH ERROR:", error);
    throw error;
  }

  return data;
};

// Fetch upload for payment
export const getUploadForPayment = async (uploadNumber) => {
  const { data, error } = await supabase
    .from("uploads")
    .select(`
      upload_number,
      customer_name,
      email,
      phone,
      service_needed,
      budget_range,
      preferred_deadline,
      upload_status,
      final_price
    `)
    .eq("upload_number", uploadNumber.trim())
    .maybeSingle();

  if (error) {
    console.error("UPLOAD FETCH ERROR:", error);
    throw error;
  }

  console.log("UPLOAD PAYMENT DATA:", data);

  return data;
};

// import { supabase } from "@/services/supabase/supabaseClient";

// // ========================================
// // GET BOOKING FOR PAYMENT
// // ========================================

// export const getBookingForPayment = async (bookingNumber) => {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select(
//       "booking_number, customer_name, service, category, total_amount, payment_status"
//     )
//     .eq("booking_number", bookingNumber.trim())
//     .maybeSingle();

//   if (error) {
//     console.error("BOOKING PAYMENT FETCH ERROR:", error);
//     throw error;
//   }

//   return data;
// };


// // ========================================
// // GET UPLOAD FOR PAYMENT
// // ========================================

// export const getUploadForPayment = async (uploadNumber) => {
//   const { data, error } = await supabase
//     .from("uploads")
//     .select("*")
//     .eq("upload_number", uploadNumber.trim())
//     .maybeSingle();

//   if (error) {
//     console.error("UPLOAD PAYMENT FETCH ERROR:", error);
//     throw error;
//   }

//   return data;
// };

// import { supabase } from "@/services/supabase/supabaseClient";

// export const getBookingForPayment = async (bookingNumber) => {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select(
//       "booking_number, customer_name, service, category, total_amount, payment_status"
//     )
//     .eq("booking_number", bookingNumber.trim())
//     .maybeSingle();

//   if (error) {
//     throw error;
//   }

//   return data;
// };