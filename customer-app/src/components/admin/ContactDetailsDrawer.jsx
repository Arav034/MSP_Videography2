import { X } from "lucide-react";

export default function ContactDetailsDrawer({
  contact,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
}) {
  if (!isOpen) return null;

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
          <h2 className="text-xl font-bold text-charcoal">Contact Details</h2>
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
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-charcoal">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-charcoal break-all">{contact.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-charcoal">{contact.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">Message</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Subject</p>
                <p className="text-charcoal">{contact.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Message</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-charcoal whitespace-pre-wrap">
                  {contact.message}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4">Status</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                contact.status === "New"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {contact.status}
            </span>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(contact.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          {contact.admin_notes && (
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4">
                Admin Notes
              </h3>
              <div className="p-3 bg-yellow-50 rounded-lg text-charcoal">
                {contact.admin_notes}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
          {contact.status === "New" && (
            <button
              onClick={onMarkAsRead}
              className="w-full px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
          >
            Delete Message
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-charcoal rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
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