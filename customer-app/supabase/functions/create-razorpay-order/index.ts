import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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
          headers: corsHeaders,
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let paymentAmount = 0;
    let customerEmail = "";
    let customerName = "";
    let paymentStatus = "";

    if (type === "booking") {
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("total_amount, email, customer_name, payment_status")
        .eq("booking_number", referenceNumber)
        .single();

      if (bookingError || !booking) {
        return new Response(
          JSON.stringify({ error: "Booking not found" }),
          { status: 404, headers: corsHeaders }
        );
      }

      paymentAmount = Number(booking.total_amount);
      customerEmail = booking.email;
      customerName = booking.customer_name;
      paymentStatus = booking.payment_status;
    } else if (type === "upload") {
      const { data: upload, error: uploadError } = await supabase
        .from("uploads")
        .select("final_price, email, customer_name, payment_status")
        .eq("upload_number", referenceNumber)
        .single();

      if (uploadError || !upload) {
        return new Response(
          JSON.stringify({ error: "Upload not found" }),
          { status: 404, headers: corsHeaders }
        );
      }

      paymentAmount = Number(upload.final_price);
      customerEmail = upload.email;
      customerName = upload.customer_name;
      paymentStatus = upload.payment_status;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid type. Use 'booking' or 'upload'" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (paymentAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid payment amount" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (paymentStatus === "Paid") {
      return new Response(
        JSON.stringify({ error: "Payment already completed" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay credentials not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create Basic Auth header using Deno's encodeBase64
    const credentials = `${razorpayKeyId}:${razorpayKeySecret}`;
    const encodedCredentials = encodeBase64(credentials);

    const razorpayOrderResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify({
          amount: paymentAmount * 100,
          currency: "INR",
          receipt: referenceNumber,
          notes: {
            reference_number: referenceNumber,
            type: type,
            customer_name: customerName,
            customer_email: customerEmail,
          },
        }),
      }
    );

    if (!razorpayOrderResponse.ok) {
      const errorData = await razorpayOrderResponse.text();
      console.error("Razorpay error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create Razorpay order" }),
        { status: 500, headers: corsHeaders }
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
        reference_number: referenceNumber,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type",
// };

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { referenceNumber, type } = await req.json();

//     if (!referenceNumber || !type) {
//       return new Response(
//         JSON.stringify({
//           error: "Missing referenceNumber or type",
//         }),
//         {
//           status: 400,
//           headers: corsHeaders,
//         }
//       );
//     }

//     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
//     const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

//     const supabase = createClient(supabaseUrl, supabaseAnonKey);

//     let paymentAmount = 0;
//     let customerEmail = "";
//     let customerName = "";
//     let paymentStatus = "";

//     if (type === "booking") {
//       const { data: booking, error: bookingError } = await supabase
//         .from("bookings")
//         .select("total_amount, email, customer_name, payment_status")
//         .eq("booking_number", referenceNumber)
//         .single();

//       if (bookingError || !booking) {
//         return new Response(
//           JSON.stringify({ error: "Booking not found" }),
//           { status: 404, headers: corsHeaders }
//         );
//       }

//       paymentAmount = Number(booking.total_amount);
//       customerEmail = booking.email;
//       customerName = booking.customer_name;
//       paymentStatus = booking.payment_status;
//     } else if (type === "upload") {
//       const { data: upload, error: uploadError } = await supabase
//         .from("uploads")
//         .select("final_price, email, customer_name, payment_status")
//         .eq("upload_number", referenceNumber)
//         .single();

//       if (uploadError || !upload) {
//         return new Response(
//           JSON.stringify({ error: "Upload not found" }),
//           { status: 404, headers: corsHeaders }
//         );
//       }

//       paymentAmount = Number(upload.final_price);
//       customerEmail = upload.email;
//       customerName = upload.customer_name;
//       paymentStatus = upload.payment_status;
//     } else {
//       return new Response(
//         JSON.stringify({ error: "Invalid type. Use 'booking' or 'upload'" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     if (paymentAmount <= 0) {
//       return new Response(
//         JSON.stringify({ error: "Invalid payment amount" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     if (paymentStatus === "Paid") {
//       return new Response(
//         JSON.stringify({ error: "Payment already completed" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
//     const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

//     if (!razorpayKeyId || !razorpayKeySecret) {
//       return new Response(
//         JSON.stringify({ error: "Razorpay credentials not configured" }),
//         { status: 500, headers: corsHeaders }
//       );
//     }

//     const razorpayOrderResponse = await fetch(
//       "https://api.razorpay.com/v1/orders",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${btoa(
//             `${razorpayKeyId}:${razorpayKeySecret}`
//           )}`,
//         },
//         body: JSON.stringify({
//           amount: paymentAmount * 100,
//           currency: "INR",
//           receipt: referenceNumber,
//           notes: {
//             reference_number: referenceNumber,
//             type: type,
//             customer_name: customerName,
//             customer_email: customerEmail,
//           },
//         }),
//       }
//     );

//     if (!razorpayOrderResponse.ok) {
//       const errorData = await razorpayOrderResponse.text();
//       console.error("Razorpay error:", errorData);
//       return new Response(
//         JSON.stringify({ error: "Failed to create Razorpay order" }),
//         { status: 500, headers: corsHeaders }
//       );
//     }

//     const razorpayOrder = await razorpayOrderResponse.json();

//     return new Response(
//       JSON.stringify({
//         success: true,
//         order_id: razorpayOrder.id,
//         amount: paymentAmount,
//         currency: "INR",
//         customer_name: customerName,
//         customer_email: customerEmail,
//         reference_number: referenceNumber,
//       }),
//       {
//         status: 200,
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal server error" }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// });