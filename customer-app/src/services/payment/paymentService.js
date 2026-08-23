import { supabase } from "@/services/supabase/supabaseClient";

// ========================================
// GET BOOKING FOR PAYMENT
// ========================================

export const getBookingForPayment = async (bookingNumber) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "booking_number, customer_name, service, category, total_amount, payment_status"
    )
    .eq("booking_number", bookingNumber.trim())
    .maybeSingle();

  if (error) {
    console.error("BOOKING PAYMENT FETCH ERROR:", error);
    throw error;
  }

  return data;
};


// ========================================
// GET UPLOAD FOR PAYMENT
// ========================================

export const getUploadForPayment = async (uploadNumber) => {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("upload_number", uploadNumber.trim())
    .maybeSingle();

  if (error) {
    console.error("UPLOAD PAYMENT FETCH ERROR:", error);
    throw error;
  }

  return data;
};

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