import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/services/supabase/supabaseClient";
import AdminPasswordModal from "./AdminPasswordModal";

export default function BookingDetailsDrawer({
  booking,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || "");
  const [paymentStatus, setPaymentStatus] = useState(booking.payment_status);
  const [bookingStatus, setBookingStatus] = useState(booking.booking_status);
  const [uploadStatus, setUploadStatus] = useState(booking.upload_status);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: paymentStatus,
          booking_status: bookingStatus,
          upload_status: uploadStatus,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id);

      if (error) throw error;

      setShowPasswordModal(false);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-white shadow-lg z-50 overflow-y-auto animate-slideIn">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-charcoal">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Information */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Booking Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Booking Number
                </p>
                <p className="text-charcoal font-semibold">
                  {booking.booking_number}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Service</p>
                <p className="text-charcoal">{booking.service}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-charcoal">{booking.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-charcoal">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Time</p>
                  <p className="text-charcoal">{booking.booking_time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Customer Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-charcoal">{booking.customer_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-charcoal break-all text-sm">
                  {booking.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-charcoal">{booking.phone}</p>
              </div>
              {booking.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Customer Notes
                  </p>
                  <p className="text-charcoal text-sm">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Payment Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subtotal</p>
                  <p className="text-charcoal font-semibold">
                    ₹{booking.subtotal}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Discount</p>
                  <p className="text-charcoal font-semibold">
                    ₹{booking.discount || 0}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-msp-blue">
                  ₹{booking.total_amount}
                </p>
              </div>
              {booking.coupon_code && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Coupon Code
                  </p>
                  <p className="text-charcoal">{booking.coupon_code}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Management */}
          {isEditing ? (
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4">
                Update Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Booking Status
                  </label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Upload Status
                  </label>
                  <select
                    value={uploadStatus}
                    onChange={(e) => setUploadStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue"
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue"
                    placeholder="Add any notes..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4">
                Current Status
              </h3>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Payment Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                      booking.payment_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.payment_status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : booking.payment_status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booking.payment_status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Booking Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                      booking.booking_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.booking_status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : booking.booking_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.booking_status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Upload Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                      booking.upload_status === "Waiting"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.upload_status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {booking.upload_status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes Display */}
          {booking.admin_notes && !isEditing && (
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4">
                Admin Notes
              </h3>
              <div className="p-3 bg-yellow-50 rounded-lg text-charcoal text-sm">
                {booking.admin_notes}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(booking.created_at).toLocaleString()}
              </p>
              {booking.updated_at && (
                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(booking.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setAdminNotes(booking.admin_notes || "");
                  setPaymentStatus(booking.payment_status);
                  setBookingStatus(booking.booking_status);
                  setUploadStatus(booking.upload_status);
                }}
                className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-charcoal rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={onDelete}
                className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
              >
                Delete Booking
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-charcoal rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <AdminPasswordModal
            action="Update booking details"
            onVerified={handlePasswordVerified}
            onCancel={() => setShowPasswordModal(false)}
          />
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}