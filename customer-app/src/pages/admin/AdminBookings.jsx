import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase/supabaseClient";
import SearchBar from "@/components/admin/SearchBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import BookingDetailsDrawer from "@/components/admin/BookingDetailsDrawer";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import AdminPasswordModal from "@/components/admin/AdminPasswordModal";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Trash2, Eye } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");

  // Drawer states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    bookingId: null,
    booking: null,
  });
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    action: null,
    bookingId: null,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, bookingStatusFilter, paymentStatusFilter]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(search) ||
          b.booking_number.toLowerCase().includes(search) ||
          b.service.toLowerCase().includes(search)
      );
    }

    // Booking status filter
    if (bookingStatusFilter !== "All") {
      filtered = filtered.filter((b) => b.booking_status === bookingStatusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter !== "All") {
      filtered = filtered.filter((b) => b.payment_status === paymentStatusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDrawer(true);
  };

  const handleDeleteClick = (booking) => {
    setDeleteModal({
      show: true,
      bookingId: booking.id,
      booking: booking,
    });
  };

  const handleConfirmDelete = () => {
    setDeleteModal({ show: false, bookingId: null, booking: null });
    setPasswordModal({
      show: true,
      action: "delete",
      bookingId: deleteModal.bookingId,
    });
  };

  const handlePasswordVerified = async () => {
    if (passwordModal.action === "delete") {
      try {
        const { error } = await supabase
          .from("bookings")
          .delete()
          .eq("id", passwordModal.bookingId);

        if (error) throw error;

        setPasswordModal({ show: false, action: null, bookingId: null });
        fetchBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.booking_status === "Pending").length,
    confirmed: bookings.filter((b) => b.booking_status === "Confirmed").length,
    completed: bookings.filter((b) => b.booking_status === "Completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal">
          Bookings
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage photography, videography and event bookings.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Confirmed", value: stats.confirmed },
          { label: "Completed", value: stats.completed },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-charcoal mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by customer, booking #, or service..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <FilterDropdown
            label="Booking Status"
            options={["All", "Pending", "Confirmed", "Completed", "Cancelled"]}
            value={bookingStatusFilter}
            onChange={setBookingStatusFilter}
          />
          <FilterDropdown
            label="Payment Status"
            options={["All", "Pending", "Paid", "Failed", "Refunded"]}
            value={paymentStatusFilter}
            onChange={setPaymentStatusFilter}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Booking #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Date & Time
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Payment
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Booking
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Created
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-charcoal text-sm">
                        {booking.booking_number}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-charcoal text-sm">
                        {booking.customer_name}
                      </p>
                      <p className="text-gray-600 text-xs truncate">
                        {booking.email}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {booking.service}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {booking.booking_time}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-semibold text-charcoal text-sm">
                        ₹{booking.total_amount}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
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
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
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
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-msp-blue rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(booking)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>

      {/* Booking Details Drawer */}
      {selectedBooking && (
        <BookingDetailsDrawer
          booking={selectedBooking}
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          onDelete={() => {
            setShowDrawer(false);
            handleDeleteClick(selectedBooking);
          }}
          onUpdate={() => {
            fetchBookings();
            setShowDrawer(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <ConfirmDeleteModal
          title="Delete Booking?"
          message={`This will permanently delete the booking ${deleteModal.booking?.booking_number} from ${deleteModal.booking?.customer_name}.`}
          onConfirm={handleConfirmDelete}
          onCancel={() =>
            setDeleteModal({ show: false, bookingId: null, booking: null })
          }
        />
      )}

      {/* Password Verification Modal */}
      {passwordModal.show && (
        <AdminPasswordModal
          action={`Delete booking ${deleteModal.booking?.booking_number}`}
          onVerified={handlePasswordVerified}
          onCancel={() =>
            setPasswordModal({ show: false, action: null, bookingId: null })
          }
        />
      )}
    </div>
  );
}