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
    throw error;
  }

  return data?.[0] || null;
};