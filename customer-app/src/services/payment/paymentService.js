import { supabase } from "@/services/supabase/supabaseClient";

export const getBookingForPayment = async (bookingNumber) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "booking_number, customer_name, service, category, total_amount, payment_status"
    )
    .eq("booking_number", bookingNumber.trim())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};