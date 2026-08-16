import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/services/supabase/supabaseClient";
import AdminPasswordModal from "./AdminPasswordModal";
import AdminFileList from "./AdminFileList";

export default function UploadDetailsDrawer({
  upload,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState(upload.admin_notes || "");
  const [uploadStatus, setUploadStatus] = useState(upload.upload_status);
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
        .from("uploads")
        .update({
          upload_status: uploadStatus,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", upload.id);

      if (error) throw error;

      setShowPasswordModal(false);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating upload:", error);
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
          <h2 className="text-xl font-bold text-charcoal">Upload Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Customer Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-charcoal">{upload.customer_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-charcoal break-all text-sm">
                  {upload.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-charcoal">{upload.phone}</p>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Project Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upload Number
                </p>
                <p className="text-charcoal font-semibold">
                  {upload.upload_number}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Service Needed
                </p>
                <p className="text-charcoal">{upload.service_needed}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Budget Range
                </p>
                <p className="text-charcoal">{upload.budget_range || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Preferred Deadline
                </p>
                <p className="text-charcoal">
                  {upload.preferred_deadline
                    ? new Date(upload.preferred_deadline).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              {upload.project_description && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Project Description
                  </p>
                  <p className="text-charcoal text-sm mt-1">
                    {upload.project_description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Project Files */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Project Files
            </h3>
            <AdminFileList uploadNumber={upload.upload_number} />
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
                    <option value="Cancelled">Cancelled</option>
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
                    Upload Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
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
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes Display */}
          {upload.admin_notes && !isEditing && (
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4">
                Admin Notes
              </h3>
              <div className="p-3 bg-yellow-50 rounded-lg text-charcoal text-sm">
                {upload.admin_notes}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(upload.created_at).toLocaleString()}
              </p>
              {upload.updated_at && (
                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(upload.updated_at).toLocaleString()}
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
                  setAdminNotes(upload.admin_notes || "");
                  setUploadStatus(upload.upload_status);
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
                Delete Request
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
            action="Update upload details"
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