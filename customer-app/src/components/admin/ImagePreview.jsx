import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function ImagePreview({ file }) {
  const [zoom, setZoom] = useState(100);

  // Dummy image URL - In production, this will come from Cloudflare R2 via signed URL
  const imageUrl = "https://via.placeholder.com/800x600?text=" + encodeURIComponent(file.file_name);

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-4 bg-gray-100 p-3 rounded-lg">
        <button
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="text-gray-600" />
        </button>
        <span className="text-sm font-medium text-gray-600 w-12 text-center">
          {zoom}%
        </span>
        <button
          onClick={() => setZoom(Math.min(200, zoom + 10))}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} className="text-gray-600" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          onClick={() => setZoom(100)}
          className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors text-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Image Display */}
      <div className="flex justify-center bg-gray-100 rounded-lg overflow-auto max-h-[500px]">
        <img
          src={imageUrl}
          alt={file.file_name}
          style={{ maxWidth: zoom + "%" }}
          className="transition-all"
        />
      </div>

      {/* Image Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 font-medium">Filename</p>
            <p className="text-charcoal">{file.file_name}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">File Size</p>
            <p className="text-charcoal">{file.file_size}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">File Type</p>
            <p className="text-charcoal">{file.mime_type}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Status</p>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">
              {file.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}