import { supabase } from "@/services/supabase/supabaseClient";

// ========================================
// GET BOOKING FOR PAYMENT
// ========================================


export const getBookingForPayment = async (bookingNumber) => {
  const { data, error } = await supabase.rpc(
    "get_booking_for_payment",
    {
      p_booking_number: bookingNumber.trim(),
    }
  );

  console.log("RPC BOOKING DATA:", data);
  console.log(
    "RPC BOOKING ERROR:",
    error ? JSON.stringify(error, null, 2) : null
  );

  if (error) {
    throw error;
  }

  return data?.[0] || null;
};

// ========================================
// GET UPLOAD FOR PAYMENT
// ========================================

export const getUploadForPayment = async (uploadNumber) => {
  const { data, error } = await supabase.rpc(
    "get_upload_for_payment",
    {
      p_upload_number: uploadNumber.trim(),
    }
  );

  if (error) {
    console.error("UPLOAD PAYMENT FETCH ERROR:", error);
    throw error;
  }

  return data?.[0] || null;
};