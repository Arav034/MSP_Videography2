import { AlertCircle } from "lucide-react";

export default function ConfirmDeleteModal({
  title,
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon & Title */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-charcoal">{title}</h3>
              <p className="text-gray-600 text-sm mt-1">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-charcoal rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}