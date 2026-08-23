import { useState } from "react";
import {
  getBookingForPayment,
  getUploadForPayment,
} from "@/services/payment/paymentService";

export default function Payment() {
  const [referenceNumber, setReferenceNumber] = useState("");

  const [booking, setBooking] = useState(null);
  const [upload, setUpload] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ========================================
  // FIND BOOKING OR UPLOAD
  // ========================================

  const handleFindPayment = async () => {
    if (!referenceNumber.trim()) {
      setErrorMessage("Please enter your booking or upload number.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      // Clear previous result
      setBooking(null);
      setUpload(null);

      const number = referenceNumber.trim();

      // ========================================
      // FIRST: TRY BOOKING
      // ========================================

      const bookingData = await getBookingForPayment(number);

      if (bookingData) {
        console.log("Booking found:", bookingData);

        setBooking(bookingData);
        return;
      }

      // ========================================
      // SECOND: TRY UPLOAD
      // ========================================

      const uploadData = await getUploadForPayment(number);

      if (uploadData) {
        console.log("Upload found:", uploadData);

        setUpload(uploadData);
        return;
      }

      // ========================================
      // NOTHING FOUND
      // ========================================

      setErrorMessage(
        "No booking or upload found. Please check your number and try again."
      );
    } catch (error) {
      console.error("Error finding payment details:", error);

      setErrorMessage(
        "Unable to find payment details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // PAYMENT AMOUNT
  // ========================================

  const paymentAmount = booking
    ? Number(booking.final_price ?? booking.total_amount ?? 0)
    : upload
    ? Number(upload.final_price ?? 0)
    : 0;

  // ========================================
  // FORMAT PRICE
  // ========================================

  const formattedPaymentAmount = paymentAmount.toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* ========================================
            PAGE TITLE
        ======================================== */}

        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Make a Payment
        </h1>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Enter your booking or upload number to view your final
          payment amount and continue with payment.
        </p>

        {/* ========================================
            SEARCH BOX
        ======================================== */}

        <div className="bg-gray-50 rounded-lg p-5">

          <label className="block text-sm font-medium text-gray-600 mb-2">
            Booking / Upload Number
          </label>

          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => {
              setReferenceNumber(e.target.value);
              setErrorMessage("");
            }}
            placeholder="Enter your booking or upload number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
          />

          <button
            type="button"
            onClick={handleFindPayment}
            disabled={isLoading}
            className="w-full mt-4 px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-60"
          >
            {isLoading ? "Finding..." : "Find Details"}
          </button>

          {/* ERROR */}

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}
        </div>

        {/* =========================================================
            BOOKING DETAILS
        ========================================================= */}

        {booking && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5 space-y-4">

            <h2 className="text-lg font-bold text-charcoal">
              Booking Details
            </h2>

            {/* Booking Number */}

            <div>
              <p className="text-sm text-gray-600">
                Booking Number
              </p>

              <p className="font-semibold text-charcoal">
                {booking.booking_number || "—"}
              </p>
            </div>

            {/* Customer */}

            <div>
              <p className="text-sm text-gray-600">
                Customer Name
              </p>

              <p className="font-semibold text-charcoal">
                {booking.customer_name || "—"}
              </p>
            </div>

            {/* Service */}

            <div>
              <p className="text-sm text-gray-600">
                Service
              </p>

              <p className="text-charcoal">
                {booking.service || "—"}
              </p>
            </div>

            {/* Category */}

            <div>
              <p className="text-sm text-gray-600">
                Category
              </p>

              <p className="text-charcoal">
                {booking.category || "—"}
              </p>
            </div>

            {/* Payment Status */}

            <div>
              <p className="text-sm text-gray-600">
                Payment Status
              </p>

              <p className="font-semibold text-charcoal">
                {booking.payment_status || "Pending"}
              </p>
            </div>

            {/* FINAL PRICE */}

            <div className="pt-4 border-t border-gray-200">

              <p className="text-sm text-gray-600">
                Final Payment Amount
              </p>

              <p className="text-3xl font-bold text-msp-blue">
                ₹{formattedPaymentAmount}
              </p>

            </div>

            {/* PAY BUTTON */}

            {booking.payment_status !== "Paid" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Booking payment clicked:", {
                      booking,
                      amount: paymentAmount,
                    });
                  }}
                  disabled={paymentAmount <= 0}
                  className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Pay ₹{formattedPaymentAmount}
                </button>

                {paymentAmount <= 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    Final price has not been set yet.
                  </p>
                )}

                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to a secure payment page.
                </p>
              </>
            )}

            {/* ALREADY PAID */}

            {booking.payment_status === "Paid" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm font-semibold text-green-700">
                  Payment Already Completed
                </p>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            UPLOAD DETAILS
        ========================================================= */}

        {upload && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5 space-y-4">

            <h2 className="text-lg font-bold text-charcoal">
              Upload Details
            </h2>

            {/* Upload Number */}

            <div>
              <p className="text-sm text-gray-600">
                Upload Number
              </p>

              <p className="font-semibold text-charcoal">
                {upload.upload_number || "—"}
              </p>
            </div>

            {/* Customer Name */}

            <div>
              <p className="text-sm text-gray-600">
                Customer Name
              </p>

              <p className="font-semibold text-charcoal">
                {upload.customer_name || "—"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm text-gray-600">
                Email
              </p>

              <p className="text-charcoal">
                {upload.email || "—"}
              </p>
            </div>

            {/* Phone */}

            <div>
              <p className="text-sm text-gray-600">
                Phone
              </p>

              <p className="text-charcoal">
                {upload.phone || "—"}
              </p>
            </div>

            {/* Service */}

            <div>
              <p className="text-sm text-gray-600">
                Service
              </p>

              <p className="text-charcoal">
                {upload.service_needed || "—"}
              </p>
            </div>

            {/* Budget */}

            <div>
              <p className="text-sm text-gray-600">
                Budget
              </p>

              <p className="text-charcoal">
                {upload.budget_range || "—"}
              </p>
            </div>

            {/* Deadline */}

            <div>
              <p className="text-sm text-gray-600">
                Deadline
              </p>

              <p className="text-charcoal">
                {upload.preferred_deadline
                  ? new Date(
                      upload.preferred_deadline
                    ).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </div>

            {/* Project Description */}

            <div>
              <p className="text-sm text-gray-600">
                Project Description
              </p>

              <p className="text-charcoal">
                {upload.project_description || "—"}
              </p>
            </div>

            {/* Upload Status */}

            <div>
              <p className="text-sm text-gray-600">
                Upload Status
              </p>

              <p className="font-semibold text-charcoal">
                {upload.upload_status || "—"}
              </p>
            </div>

            {/* Admin Notes */}

            {upload.admin_notes && (
              <div>
                <p className="text-sm text-gray-600">
                  Admin Notes
                </p>

                <p className="text-charcoal">
                  {upload.admin_notes}
                </p>
              </div>
            )}

            {/* FINAL PRICE */}

            <div className="pt-4 border-t border-gray-200">

              <p className="text-sm text-gray-600">
                Final Payment Amount
              </p>

              <p className="text-3xl font-bold text-msp-blue">
                ₹{formattedPaymentAmount}
              </p>

            </div>

            {/* PAY BUTTON */}

            <button
              type="button"
              onClick={() => {
                console.log("Upload payment clicked:", {
                  upload,
                  amount: paymentAmount,
                });
              }}
              disabled={paymentAmount <= 0}
              className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Pay ₹{formattedPaymentAmount}
            </button>

            {paymentAmount <= 0 && (
              <p className="text-xs text-gray-500 text-center">
                Final price has not been set yet.
              </p>
            )}

            <p className="text-xs text-gray-500 text-center">
              You will be redirected to a secure payment page.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

// import { useState } from "react";
// import {
//   getBookingForPayment,
//   getUploadForPayment,
// } from "@/services/payment/paymentService";

// export default function Payment() {
//   const [referenceNumber, setReferenceNumber] = useState("");
//   const [booking, setBooking] = useState(null);
//   const [upload, setUpload] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // ========================================
//   // FIND BOOKING OR UPLOAD
//   // ========================================

//   const handleFindPayment = async () => {
//     if (!referenceNumber.trim()) {
//       setErrorMessage("Please enter your booking or upload number.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setErrorMessage("");

//       setBooking(null);
//       setUpload(null);

//       const number = referenceNumber.trim();

//       // ----------------------------------------
//       // FIRST: Try Booking
//       // ----------------------------------------

//       const bookingData = await getBookingForPayment(number);

//       if (bookingData) {
//         console.log("Booking found:", bookingData);

//         setBooking(bookingData);
//         return;
//       }

//       // ----------------------------------------
//       // SECOND: Try Upload
//       // ----------------------------------------

//       const uploadData = await getUploadForPayment(number);

//       if (uploadData) {
//         console.log("Upload found:", uploadData);

//         setUpload(uploadData);
//         return;
//       }

//       // ----------------------------------------
//       // NOTHING FOUND
//       // ----------------------------------------

//       setErrorMessage(
//         "No booking or upload found. Please check your number and try again."
//       );
//     } catch (error) {
//       console.error("Error finding payment details:", error);

//       setErrorMessage(
//         "Unable to find payment details. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ========================================
//   // PAYMENT AMOUNT
//   // ========================================

//   const paymentAmount = booking
//     ? Number(booking.total_amount)
//     : upload
//     ? Number(upload.total_amount || upload.final_amount || 0)
//     : 0;

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-md">

//         {/* ========================================
//             PAGE TITLE
//         ======================================== */}

//         <h1 className="text-2xl font-bold text-charcoal mb-2">
//           Pay Your Booking
//         </h1>

//         <p className="text-sm text-gray-600 mb-6 leading-relaxed">
//           Enter your booking or upload number to view your final
//           payment amount and continue with payment.
//         </p>

//         {/* ========================================
//             SEARCH BOX
//         ======================================== */}

//         <div className="bg-gray-50 rounded-lg p-5">

//           <label className="block text-sm font-medium text-gray-600 mb-2">
//             Booking / Upload Number
//           </label>

//           <input
//             type="text"
//             value={referenceNumber}
//             onChange={(e) => {
//               setReferenceNumber(e.target.value);
//               setErrorMessage("");
//             }}
//             placeholder="Enter your booking or upload number"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
//           />

//           <button
//             type="button"
//             onClick={handleFindPayment}
//             disabled={isLoading}
//             className="w-full mt-4 px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-60"
//           >
//             {isLoading ? "Finding..." : "Find Details"}
//           </button>

//           {/* ========================================
//               ERROR
//           ======================================== */}

//           {errorMessage && (
//             <p className="mt-4 text-sm text-red-600 text-center">
//               {errorMessage}
//             </p>
//           )}
//         </div>

//         {/* ========================================
//             BOOKING DETAILS
//         ======================================== */}

//         {booking && (
//           <div className="mt-6 bg-gray-50 rounded-lg p-5 space-y-4">

//             <h2 className="text-lg font-bold text-charcoal">
//               Booking Details
//             </h2>

//             {/* Booking Number */}

//             <div>
//               <p className="text-sm text-gray-600">
//                 Booking Number
//               </p>

//               <p className="font-semibold text-charcoal">
//                 {booking.booking_number}
//               </p>
//             </div>

//             {/* Customer */}

//             <div>
//               <p className="text-sm text-gray-600">
//                 Customer Name
//               </p>

//               <p className="font-semibold text-charcoal">
//                 {booking.customer_name}
//               </p>
//             </div>

//             {/* Service */}

//             <div>
//               <p className="text-sm text-gray-600">
//                 Service
//               </p>

//               <p className="text-charcoal">
//                 {booking.service}
//               </p>
//             </div>

//             {/* Category */}

//             <div>
//               <p className="text-sm text-gray-600">
//                 Category
//               </p>

//               <p className="text-charcoal">
//                 {booking.category}
//               </p>
//             </div>

//             {/* Payment Status */}

//             <div>
//               <p className="text-sm text-gray-600">
//                 Payment Status
//               </p>

//               <p className="font-semibold text-charcoal">
//                 {booking.payment_status}
//               </p>
//             </div>

//             {/* ========================================
//                 AMOUNT
//             ======================================== */}

//             <div className="pt-3 border-t border-gray-200">

//               <p className="text-sm text-gray-600">
//                 Final Payment Amount
//               </p>

//               <p className="text-3xl font-bold text-msp-blue">
//                 ₹{Number(upload.final_price || 0).toLocaleString("en-IN")}
//               </p>

//             </div>

//             {/* ========================================
//                 PAY BUTTON
//             ======================================== */}

//             {booking.payment_status !== "Paid" && (
//               <div className="pt-2">

//                 {/* <button
//                   type="button"
//                   onClick={() => {
//                     console.log(
//                       "Pay Now clicked:",
//                       booking
//                     );

//                     // Payment gateway will be integrated here
//                   }}
//                   className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors"
//                 >
//                   Pay ₹{paymentAmount.toLocaleString("en-IN")}
//                 </button> */}
//                 <button
//                 type="button"
//                 onClick={() => {
//                   console.log("Pay Now clicked:", upload);
//                 }}
//                 disabled={!upload.final_price || Number(upload.final_price) <= 0}
//                 className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 Pay ₹{Number(upload.final_price || 0).toLocaleString("en-IN")}
//               </button>

//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   You will be redirected to a secure payment page.
//                 </p>

//               </div>
//             )}

//             {booking.payment_status === "Paid" && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
//                 <p className="text-sm font-semibold text-green-700">
//                   Payment Already Completed
//                 </p>
//               </div>
//             )}

//           </div>
//         )}

//         {/* ========================================
//             UPLOAD DETAILS
//         ======================================== */}

//         {upload && (
//   <div className="mt-6 bg-gray-50 rounded-lg p-5 space-y-4">

//     <h2 className="text-lg font-bold text-charcoal">
//       Upload Details
//     </h2>

//     {/* Upload Number */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Upload Number
//       </p>

//       <p className="font-semibold text-charcoal">
//         {upload.upload_number || "—"}
//       </p>
//     </div>

//     {/* Customer Name */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Customer Name
//       </p>

//       <p className="font-semibold text-charcoal">
//         {upload.customer_name || "—"}
//       </p>
//     </div>

//     {/* Email */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Email
//       </p>

//       <p className="text-charcoal">
//         {upload.email || "—"}
//       </p>
//     </div>

//     {/* Phone */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Phone
//       </p>

//       <p className="text-charcoal">
//         {upload.phone || "—"}
//       </p>
//     </div>

//     {/* Service */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Service
//       </p>

//       <p className="text-charcoal">
//         {upload.service_needed || "—"}
//       </p>
//     </div>

//     {/* Budget */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Budget
//       </p>

//       <p className="text-charcoal">
//         {upload.budget_range || "—"}
//       </p>
//     </div>

//     {/* Deadline */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Deadline
//       </p>

//       <p className="text-charcoal">
//         {upload.preferred_deadline
//           ? new Date(upload.preferred_deadline).toLocaleDateString("en-IN")
//           : "—"}
//       </p>
//     </div>

//     {/* Project Description */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Project Description
//       </p>

//       <p className="text-charcoal">
//         {upload.project_description || "—"}
//       </p>
//     </div>

//     {/* Upload Status */}
//     <div>
//       <p className="text-sm text-gray-600">
//         Upload Status
//       </p>

//       <p className="font-semibold text-charcoal">
//         {upload.upload_status || "—"}
//       </p>
//     </div>

//     {/* Admin Notes */}
//     {upload.admin_notes && (
//       <div>
//         <p className="text-sm text-gray-600">
//           Admin Notes
//         </p>

//         <p className="text-charcoal">
//           {upload.admin_notes}
//         </p>
//       </div>
//     )}

//     {/* ========================================
//         FINAL PAYMENT AMOUNT
//     ======================================== */}

//     <div className="pt-4 border-t border-gray-200">

//       <p className="text-sm text-gray-600">
//         Final Payment Amount
//       </p>

//       <p className="text-3xl font-bold text-msp-blue">
//         ₹{Number(paymentAmount || 0).toLocaleString("en-IN")}
//       </p>

//     </div>

//     {/* ========================================
//         PAY BUTTON
//     ======================================== */}

//     <button
//       type="button"
//       onClick={() => {
//         console.log("Pay Now clicked:", upload);

//         // Payment gateway will be integrated here
//       }}
//       className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors hover:bg-blue-800"
//     >
//       Pay ₹{Number(paymentAmount || 0).toLocaleString("en-IN")}
//     </button>

//     <p className="text-xs text-gray-500 text-center mt-3">
//       You will be redirected to a secure payment page.
//     </p>

//   </div>
//         )}

//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { getBookingForPayment } from "@/services/payment/paymentService";

// export default function Payment() {
//   const [bookingNumber, setBookingNumber] = useState("");
//   const [booking, setBooking] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const handleFindBooking = async () => {
//   if (!bookingNumber.trim()) {
//     setErrorMessage("Please enter your booking number.");
//     return;
//   }

//   try {
//     setIsLoading(true);
//     setErrorMessage("");
//     setBooking(null);

//     const data = await getBookingForPayment(bookingNumber);

//     if (!data) {
//       setErrorMessage("Booking not found. Please check your booking number.");
//       return;
//     }

//     console.log("Booking found:", data);

//     setBooking(data);
//   } catch (error) {
//     console.error("Error finding booking:", error);
//     setErrorMessage("Unable to find booking.");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-md">
//         <h1 className="text-2xl font-bold text-charcoal mb-2">
//           Pay Your Booking
//         </h1>

//         <p className="text-sm text-gray-600 mb-6 leading-relaxed">
//           Enter your booking number to view your final payment amount and
//           continue with payment.
//         </p>

//         <div className="bg-gray-50 rounded-lg p-5">
//           {booking && (
//           <div className="mt-6 bg-gray-50 rounded-lg p-5 space-y-4">
//              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-5">
//     <div className="flex items-center justify-between mb-4">
//       <p className="text-sm font-medium text-gray-600">
//         Amount to Pay
//       </p>

//       <p className="text-2xl font-bold text-msp-blue">
//         ₹{Number(booking.total_amount).toLocaleString("en-IN")}
//       </p>
//     </div>

//     <button
//       type="button"
//       onClick={() => {
//         // Payment gateway will be added here
//         console.log("Pay Now clicked", booking);
//       }}
//       className="w-full px-4 py-3 bg-msp-blue bg-blue-700 text-white rounded-lg font-semibold transition-colors"
//     >
//       Pay ₹{Number(booking.total_amount).toLocaleString("en-IN")}
//     </button>

//     <p className="text-xs text-gray-500 text-center mt-3">
//       You will be redirected to a secure payment page.
//     </p>
//     </div>
//             <h2 className="text-lg font-bold text-charcoal">
//               Booking Details
//             </h2>

//             <div>
//               <p className="text-sm text-gray-600">
//                 Booking Number
//               </p>
//               <p className="font-semibold text-charcoal">
//                 {booking.booking_number}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-600">
//                 Customer Name
//               </p>
//               <p className="font-semibold text-charcoal">
//                 {booking.customer_name}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-600">
//                 Service
//               </p>
//               <p className="text-charcoal">
//                 {booking.service}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-600">
//                 Category
//               </p>
//               <p className="text-charcoal">
//                 {booking.category}
//               </p>
//             </div>

//             <div className="pt-3 border-t border-gray-200">
//               <p className="text-sm text-gray-600">
//                 Final Payment Amount
//               </p>

//               <p className="text-3xl font-bold text-msp-blue">
//                 ₹{Number(booking.total_amount).toLocaleString("en-IN")}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-600">
//                 Payment Status
//               </p>

//               <p className="font-semibold text-charcoal">
//                 {booking.payment_status}
//               </p>
//             </div>
//           </div>
//         )}
//           <label className="block text-sm font-medium text-gray-600 mb-2">
//             Booking Number
//           </label>

//           <input
//             type="text"
//             value={bookingNumber}
//             onChange={(e) => setBookingNumber(e.target.value)}
//             placeholder="Enter your booking number"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//           />

//           <button
//             onClick={handleFindBooking}
//             disabled={isLoading}
//             className="w-full mt-4 px-4 py-3 bg-blue-700 bg-msp-blue text-white rounded-lg font-semibold"
            
//           >
//             {isLoading ? "Finding..." : "Find Booking"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }