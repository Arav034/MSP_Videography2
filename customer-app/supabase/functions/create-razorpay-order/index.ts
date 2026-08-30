import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { referenceNumber, type } = await req.json();

    if (!referenceNumber || !type) {
      return new Response(
        JSON.stringify({ error: "Missing referenceNumber or type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Supabase environment variables missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let paymentAmount = 0;
    let customerEmail = "";
    let customerName = "";
    let paymentStatus = "Pending";

    if (type === "booking") {
      const { data: bookings, error: bookingError } = await supabase.rpc(
        "get_booking_for_payment",
        { p_booking_number: referenceNumber.trim() }
      );

      if (bookingError || !bookings || bookings.length === 0) {
        return new Response(
          JSON.stringify({ error: "Booking not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const booking = bookings[0];
      paymentAmount = Number(booking.total_amount || 0);
      customerEmail = booking.email || "";
      customerName = booking.customer_name || "";
      paymentStatus = booking.payment_status || "Pending";
    }

    else if (type === "upload") {
      const { data: uploads, error: uploadError } = await supabase.rpc(
        "get_upload_for_payment",
        { p_upload_number: referenceNumber.trim() }
      );

      if (uploadError || !uploads || uploads.length === 0) {
        return new Response(
          JSON.stringify({ error: "Upload not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const upload = uploads[0];
      paymentAmount = Number(upload.final_price || 0);
      customerEmail = upload.email || "";
      customerName = upload.customer_name || "";
      paymentStatus = "Pending";
    }

    else {
      return new Response(
        JSON.stringify({ error: "Invalid type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid payment amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (paymentStatus === "Paid") {
      return new Response(
        JSON.stringify({ error: "Payment already completed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const credentials = `${razorpayKeyId}:${razorpayKeySecret}`;
    const encodedCredentials = btoa(credentials);

    const razorpayOrderResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify({
          amount: Math.round(paymentAmount * 100),
          currency: "INR",
          receipt: referenceNumber.trim(),
          notes: {
            reference_number: referenceNumber.trim(),
            type,
            customer_name: customerName,
            customer_email: customerEmail,
          },
        }),
      }
    );

    if (!razorpayOrderResponse.ok) {
      const errorData = await razorpayOrderResponse.text();
      console.error("RAZORPAY ERROR:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create Razorpay order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const razorpayOrder = await razorpayOrderResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        order_id: razorpayOrder.id,
        amount: paymentAmount,
        currency: "INR",
        customer_name: customerName,
        customer_email: customerEmail,
        reference_number: referenceNumber.trim(),
        type,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});