import { supabase } from "@/services/supabase/supabaseClient";

// ========================================
// CREATE RAZORPAY ORDER (Call Edge Function)
// ========================================

export const createRazorpayOrder = async (referenceNumber, type) => {
  try {
    // Get your Supabase project URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error("Supabase URL not configured");
    }

    // Call the Edge Function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-razorpay-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceNumber: referenceNumber.trim(),
          type: type, // "booking" or "upload"
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create order");
    }

    const orderData = await response.json();

    console.log("Order created:", orderData);

    return orderData;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};