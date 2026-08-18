import { useState } from "react";
import { getBookingForPayment } from "@/services/payment/paymentService";

export default function Payment() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleFindBooking = async () => {
  if (!bookingNumber.trim()) {
    setErrorMessage("Please enter your booking number.");
    return;
  }

  try {
    setIsLoading(true);
    setErrorMessage("");
    setBooking(null);

    const data = await getBookingForPayment(bookingNumber);

    if (!data) {
      setErrorMessage("Booking not found. Please check your booking number.");
      return;
    }

    console.log("Booking found:", data);

    setBooking(data);
  } catch (error) {
    console.error("Error finding booking:", error);
    setErrorMessage("Unable to find booking.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Pay Your Booking
        </h1>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Enter your booking number to view your final payment amount and
          continue with payment.
        </p>

        <div className="bg-gray-50 rounded-lg p-5">
          {booking && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5 space-y-4">
             <div className="mt-4 bg-white border border-gray-200 rounded-lg p-5">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-600">
        Amount to Pay
      </p>

      <p className="text-2xl font-bold text-msp-blue">
        ₹{Number(booking.total_amount).toLocaleString("en-IN")}
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        // Payment gateway will be added here
        console.log("Pay Now clicked", booking);
      }}
      className="w-full px-4 py-3 bg-msp-blue bg-blue-700 text-white rounded-lg font-semibold transition-colors"
    >
      Pay ₹{Number(booking.total_amount).toLocaleString("en-IN")}
    </button>

    <p className="text-xs text-gray-500 text-center mt-3">
      You will be redirected to a secure payment page.
    </p>
    </div>
            <h2 className="text-lg font-bold text-charcoal">
              Booking Details
            </h2>

            <div>
              <p className="text-sm text-gray-600">
                Booking Number
              </p>
              <p className="font-semibold text-charcoal">
                {booking.booking_number}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Customer Name
              </p>
              <p className="font-semibold text-charcoal">
                {booking.customer_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Service
              </p>
              <p className="text-charcoal">
                {booking.service}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Category
              </p>
              <p className="text-charcoal">
                {booking.category}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Final Payment Amount
              </p>

              <p className="text-3xl font-bold text-msp-blue">
                ₹{Number(booking.total_amount).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Payment Status
              </p>

              <p className="font-semibold text-charcoal">
                {booking.payment_status}
              </p>
            </div>
          </div>
        )}
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Booking Number
          </label>

          <input
            type="text"
            value={bookingNumber}
            onChange={(e) => setBookingNumber(e.target.value)}
            placeholder="Enter your booking number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <button
            onClick={handleFindBooking}
            disabled={isLoading}
            className="w-full mt-4 px-4 py-3 bg-blue-700 bg-msp-blue text-white rounded-lg font-semibold"
            
          >
            {isLoading ? "Finding..." : "Find Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}