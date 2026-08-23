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
