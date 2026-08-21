import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase/supabaseClient";
import SearchBar from "@/components/admin/SearchBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import UploadDetailsDrawer from "@/components/admin/UploadDetailsDrawer";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import AdminPasswordModal from "@/components/admin/AdminPasswordModal";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Trash2, Eye } from "lucide-react";

export default function AdminUploads() {
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Drawer states
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    uploadId: null,
    upload: null,
  });
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    action: null,
    uploadId: null,
  });

  useEffect(() => {
    fetchUploads();
  }, []);

  useEffect(() => {
    filterUploads();
  }, [uploads, searchTerm, statusFilter]);

  const fetchUploads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("uploads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUploads = () => {
    let filtered = uploads;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.customer_name.toLowerCase().includes(search) ||
          u.upload_number.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.service_needed.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((u) => u.upload_status === statusFilter);
    }

    setFilteredUploads(filtered);
  };

  const handleViewUpload = (upload) => {
    setSelectedUpload(upload);
    setShowDrawer(true);
  };

  const handleDeleteClick = (upload) => {
    setDeleteModal({
      show: true,
      uploadId: upload.id,
      upload: upload,
    });
  };

  const handleConfirmDelete = () => {
    setDeleteModal({ show: false, uploadId: null, upload: null });
    setPasswordModal({
      show: true,
      action: "delete",
      uploadId: deleteModal.uploadId,
    });
  };

  const handlePasswordVerified = async () => {
    if (passwordModal.action === "delete") {
      try {
        const { error } = await supabase
          .from("uploads")
          .delete()
          .eq("id", passwordModal.uploadId);

        if (error) throw error;

        setPasswordModal({ show: false, action: null, uploadId: null });
        fetchUploads();
      } catch (error) {
        console.error("Error deleting upload:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats = {
    total: uploads.length,
    waiting: uploads.filter((u) => u.upload_status === "Waiting").length,
    processing: uploads.filter((u) => u.upload_status === "Processing").length,
    completed: uploads.filter((u) => u.upload_status === "Completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal">
          Upload Requests
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage customer video and image editing requests.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Uploads", value: stats.total },
          { label: "Waiting", value: stats.waiting },
          { label: "Processing", value: stats.processing },
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
            placeholder="Search by customer, upload #, email, or service..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="w-full sm:w-48">
          <FilterDropdown
            label="Status"
            options={["All", "Waiting", "Processing", "Completed", "Cancelled"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Uploads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredUploads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Upload #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Budget
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Deadline
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Status
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
                {filteredUploads.map((upload) => (
                  <tr
                    key={upload.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-charcoal text-sm">
                        {upload.upload_number}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-charcoal text-sm">
                        {upload.customer_name}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm truncate">
                        {upload.email}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {upload.service_needed}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-charcoal text-sm">
                        {upload.budget_range || "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {upload.preferred_deadline
                          ? new Date(upload.preferred_deadline).toLocaleDateString()
                          : "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          upload.upload_status === "Waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : upload.upload_status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : upload.upload_status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {upload.upload_status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewUpload(upload)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-msp-blue rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(upload)}
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
            <p className="text-gray-500">No upload requests found.</p>
          </div>
        )}
      </div>

      {/* Upload Details Drawer */}
      {selectedUpload && (
        <UploadDetailsDrawer
          upload={selectedUpload}
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          onDelete={() => {
            setShowDrawer(false);
            handleDeleteClick(selectedUpload);
          }}
          onUpdate={() => {
            fetchUploads();
            setShowDrawer(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <ConfirmDeleteModal
          title="Delete Upload Request?"
          message={`This will permanently delete the upload request ${deleteModal.upload?.upload_number} from ${deleteModal.upload?.customer_name}.`}
          onConfirm={handleConfirmDelete}
          onCancel={() =>
            setDeleteModal({ show: false, uploadId: null, upload: null })
          }
        />
      )}

      {/* Password Verification Modal */}
      {passwordModal.show && (
        <AdminPasswordModal
          action={`Delete upload ${deleteModal.upload?.upload_number}`}
          onVerified={handlePasswordVerified}
          onCancel={() =>
            setPasswordModal({ show: false, action: null, uploadId: null })
          }
        />
      )}
      
      
    </div>
  );
}