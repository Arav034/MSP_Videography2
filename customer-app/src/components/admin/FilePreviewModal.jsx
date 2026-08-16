import { X, Download } from "lucide-react";
import ImagePreview from "./ImagePreview";
import VideoPreview from "./VideoPreview";

export default function FilePreviewModal({ file, isOpen, onClose }) {
  if (!isOpen) return null;

  const isImage = file.file_type === "image";
  const isVideo = file.file_type === "video";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-charcoal">
                {file.file_name}
              </h3>
              <p className="text-sm text-gray-600">
                {file.file_size} • {file.file_type}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Preview Content */}
          <div className="p-6">
            {isImage && <ImagePreview file={file} />}
            {isVideo && <VideoPreview file={file} />}
            {!isImage && !isVideo && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Preview not available for this file type.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-charcoal rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}