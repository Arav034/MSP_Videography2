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
        JSON.stringify({
          error: "Missing referenceNumber or type",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({
          error: "Supabase environment variables are missing",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    let paymentAmount = 0;
    let customerEmail = "";
    let customerName = "";
    let paymentStatus = "Pending";

    // ========================================
    // BOOKING PAYMENT
    // ========================================

    if (type === "booking") {
      const { data: booking, error: bookingError } =
        await supabase
          .from("bookings")
          .select(
            "total_amount, email, customer_name, payment_status"
          )
          .eq(
            "booking_number",
            referenceNumber.trim()
          )
          .maybeSingle();

      if (bookingError) {
        console.error(
          "BOOKING LOOKUP ERROR:",
          bookingError
        );

        return new Response(
          JSON.stringify({
            error: "Unable to find booking",
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!booking) {
        return new Response(
          JSON.stringify({
            error: "Booking not found",
          }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      paymentAmount = Number(booking.total_amount || 0);
      customerEmail = booking.email || "";
      customerName = booking.customer_name || "";
      paymentStatus = booking.payment_status || "Pending";
    }

    // ========================================
    // UPLOAD PAYMENT
    // ========================================

    else if (type === "upload") {
      const { data: upload, error: uploadError } =
        await supabase
          .from("uploads")
          .select(
            "final_price, email, customer_name"
          )
          .eq(
            "upload_number",
            referenceNumber.trim()
          )
          .maybeSingle();

      if (uploadError) {
        console.error(
          "UPLOAD LOOKUP ERROR:",
          uploadError
        );

        return new Response(
          JSON.stringify({
            error: "Unable to find upload",
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!upload) {
        return new Response(
          JSON.stringify({
            error: "Upload not found",
          }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      paymentAmount = Number(upload.final_price || 0);
      customerEmail = upload.email || "";
      customerName = upload.customer_name || "";

      // uploads table does not currently have payment_status
      paymentStatus = "Pending";
    }

    // ========================================
    // INVALID TYPE
    // ========================================

    else {
      return new Response(
        JSON.stringify({
          error: "Invalid type. Use 'booking' or 'upload'",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid payment amount",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ========================================
    // CHECK PAYMENT STATUS
    // ========================================

    if (paymentStatus === "Paid") {
      return new Response(
        JSON.stringify({
          error: "Payment already completed",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ========================================
    // RAZORPAY CREDENTIALS
    // ========================================

    const razorpayKeyId =
      Deno.env.get("RAZORPAY_KEY_ID");

    const razorpayKeySecret =
      Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({
          error:
            "Razorpay credentials not configured",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ========================================
    // RAZORPAY BASIC AUTH
    // ========================================

    const credentials =
      `${razorpayKeyId}:${razorpayKeySecret}`;

    const encodedCredentials =
      btoa(credentials);

    // ========================================
    // CREATE RAZORPAY ORDER
    // ========================================

    const razorpayOrderResponse =
      await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Basic ${encodedCredentials}`,
          },

          body: JSON.stringify({
            amount: Math.round(
              paymentAmount * 100
            ),

            currency: "INR",

            receipt: referenceNumber.trim(),

            notes: {
              reference_number:
                referenceNumber.trim(),

              type,

              customer_name:
                customerName,

              customer_email:
                customerEmail,
            },
          }),
        }
      );

    // ========================================
    // RAZORPAY ERROR
    // ========================================

    if (!razorpayOrderResponse.ok) {
      const errorData =
        await razorpayOrderResponse.text();

      console.error(
        "RAZORPAY ORDER ERROR:",
        errorData
      );

      return new Response(
        JSON.stringify({
          error:
            "Failed to create Razorpay order",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ========================================
    // SUCCESS
    // ========================================

    const razorpayOrder =
      await razorpayOrderResponse.json();

    console.log(
      "RAZORPAY ORDER CREATED:",
      razorpayOrder.id
    );

    return new Response(
      JSON.stringify({
        success: true,

        order_id:
          razorpayOrder.id,

        amount:
          paymentAmount,

        currency: "INR",

        customer_name:
          customerName,

        customer_email:
          customerEmail,

        reference_number:
          referenceNumber.trim(),

        type,
      }),
      {
        status: 200,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );

  } catch (error) {
    console.error(
      "CREATE RAZORPAY ORDER ERROR:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          "Internal server error",
      }),
      {
        status: 500,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});