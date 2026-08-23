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

      // Clear old result
      setBooking(null);
      setUpload(null);

      const number = referenceNumber.trim();

      // ========================================
      // FIRST: TRY BOOKING
      // ========================================

      const bookingData = await getBookingForPayment(number);

      if (bookingData) {
        console.log("BOOKING PAYMENT DATA:", bookingData);

        setBooking(bookingData);
        return;
      }

      // ========================================
      // SECOND: TRY UPLOAD
      // ========================================

      const uploadData = await getUploadForPayment(number);

      if (uploadData) {
        console.log("UPLOAD PAYMENT DATA:", uploadData);

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
    ? Number(booking.total_amount || 0)
    : upload
    ? Number(upload.final_price || 0)
    : 0;

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

        {/* ==================================================
            BOOKING DETAILS
        ================================================== */}

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

            {/* ========================================
                BOOKING FINAL PAYMENT
            ======================================== */}

            <div className="pt-4 border-t border-gray-200">

              <p className="text-sm text-gray-600">
                Final Payment Amount
              </p>

              <p className="text-3xl font-bold text-msp-blue">
                ₹{Number(booking.total_amount || 0).toLocaleString("en-IN")}
              </p>

            </div>

            {/* ========================================
                BOOKING PAY BUTTON
            ======================================== */}

            {booking.payment_status !== "Paid" && (
              <div className="pt-2">

                <button
                  type="button"
                  onClick={() => {
                    console.log(
                      "Booking payment clicked:",
                      booking
                    );
                  }}
                  disabled={Number(booking.total_amount || 0) <= 0}
                  className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Pay ₹
                  {Number(
                    booking.total_amount || 0
                  ).toLocaleString("en-IN")}
                </button>

                {Number(booking.total_amount || 0) <= 0 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Final price has not been set yet.
                  </p>
                )}

                <p className="text-xs text-gray-500 text-center mt-3">
                  You will be redirected to a secure payment page.
                </p>

              </div>
            )}

            {/* PAID */}

            {booking.payment_status === "Paid" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm font-semibold text-green-700">
                  Payment Already Completed
                </p>
              </div>
            )}

          </div>
        )}

        {/* ==================================================
            UPLOAD DETAILS
        ================================================== */}

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

            {/* ========================================
                UPLOAD FINAL PAYMENT
            ======================================== */}

            <div className="pt-4 border-t border-gray-200">

              <p className="text-sm text-gray-600">
                Final Payment Amount
              </p>

              <p className="text-3xl font-bold text-msp-blue">
                ₹{Number(upload.final_price || 0).toLocaleString("en-IN")}
              </p>

            </div>

            {/* ========================================
                UPLOAD PAY BUTTON
            ======================================== */}

            <button
              type="button"
              onClick={() => {
                console.log(
                  "Upload payment clicked:",
                  upload
                );
              }}
              disabled={Number(upload.final_price || 0) <= 0}
              className="w-full px-4 py-3 bg-blue-700 text-white rounded-lg font-semibold transition-colors hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Pay ₹
              {Number(
                upload.final_price || 0
              ).toLocaleString("en-IN")}
            </button>

            {Number(upload.final_price || 0) <= 0 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Final price has not been set yet.
              </p>
            )}

            <p className="text-xs text-gray-500 text-center mt-3">
              You will be redirected to a secure payment page.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

