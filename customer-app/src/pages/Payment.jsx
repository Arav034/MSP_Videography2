export default function Payment() {
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
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Booking Number
          </label>

          <input
            type="text"
            placeholder="Enter your booking number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-msp-blue"
          />

          <button
            type="button"
            className="w-full mt-4 px-4 py-3 bg-msp-blue
                       hover:bg-blue-700 text-white rounded-lg
                       font-semibold transition-colors"
          >
            Find Booking
          </button>
        </div>
      </div>
    </div>
  );
}