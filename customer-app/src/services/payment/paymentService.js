import { supabase } from "@/services/supabase/supabaseClient";

// ========================================
// GET BOOKING FOR PAYMENT
// ========================================

export const getBookingForPayment = async (bookingNumber) => {
  const cleanNumber = bookingNumber?.trim();

  if (!cleanNumber) {
    return null;
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_number", cleanNumber)
    .maybeSingle();

  if (error) {
    console.error("BOOKING PAYMENT FETCH ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw error;
  }

  console.log("BOOKING PAYMENT DATA:", data);

  return data;
};

// ========================================
// GET UPLOAD FOR PAYMENT
// ========================================

export const getUploadForPayment = async (uploadNumber) => {
  const cleanNumber = uploadNumber?.trim();

  if (!cleanNumber) {
    return null;
  }

  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("upload_number", cleanNumber)
    .maybeSingle();

  if (error) {
    console.error("UPLOAD PAYMENT FETCH ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

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
//     .select(`
//       booking_number,
//       customer_name,
//       service,
//       category,
//       total_amount,
//       final_price,
//       payment_status
//     `)
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
//     .select(`
//       upload_number,
//       customer_name,
//       email,
//       phone,
//       service_needed,
//       budget_range,
//       preferred_deadline,
//       project_description,
//       upload_status,
//       admin_notes,
//       final_price
//     `)
//     .eq("upload_number", uploadNumber.trim())
//     .maybeSingle();

//   if (error) {
//     console.error("UPLOAD PAYMENT FETCH ERROR:", error);
//     throw error;
//   }

//   return data;
// };


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

// // import { supabase } from "@/services/supabase/supabaseClient";

// // export const getBookingForPayment = async (bookingNumber) => {
// //   const { data, error } = await supabase
// //     .from("bookings")
// //     .select(
// //       "booking_number, customer_name, service, category, total_amount, payment_status"
// //     )
// //     .eq("booking_number", bookingNumber.trim())
// //     .maybeSingle();

// //   if (error) {
// //     throw error;
// //   }

// //   return data;
// // };