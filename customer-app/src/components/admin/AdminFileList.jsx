// import { useState } from "react";
// import { File, Image, Video, Download, Eye } from "lucide-react";
// import FilePreviewModal from "./FilePreviewModal";
// export default function AdminFileList({ uploadNumber }) {
//   const [files, setFiles] = useState([
//     {
//       id: "file-1",
//       upload_number: uploadNumber,
//       file_name: "video_01.mp4",
//       file_key: `uploads/${uploadNumber}/video_01.mp4`,
//       file_type: "video",
//       mime_type: "video/mp4",
//       file_size: "245 MB",
//       status: "Uploaded",
//     },
//     {
//       id: "file-2",
//       upload_number: uploadNumber,
//       file_name: "image_01.jpg",
//       file_key: `uploads/${uploadNumber}/image_01.jpg`,
//       file_type: "image",
//       mime_type: "image/jpeg",
//       file_size: "4.2 MB",
//       status: "Uploaded",
//     },
//     {
//       id: "file-3",
//       upload_number: uploadNumber,
//       file_name: "image_02.png",
//       file_key: `uploads/${uploadNumber}/image_02.png`,
//       file_type: "image",
//       mime_type: "image/png",
//       file_size: "5.8 MB",
//       status: "Uploaded",
//     },
//   ]);

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   const handlePreview = (file) => {
//     setSelectedFile(file);
//     setShowPreview(true);
//   };

//   const getFileIcon = (fileType) => {
//     if (fileType === "video") return <Video size={24} className="text-blue-600" />;
//     if (fileType === "image") return <Image size={24} className="text-green-600" />;
//     return <File size={24} className="text-gray-600" />;
//   };

//   if (files.length === 0) {
//     return (
//       <div className="text-center py-8 border border-gray-200 rounded-lg">
//         <p className="text-gray-500">No files attached to this request.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-3">
//         {files.map((file) => (
//           <div
//             key={file.id}
//             className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <div className="flex-shrink-0">
//                 {getFileIcon(file.file_type)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium text-charcoal text-sm truncate">
//                   {file.file_name}
//                 </p>
//                 <p className="text-xs text-gray-600">
//                   {file.file_size} • {file.file_type}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 flex-shrink-0">
//               <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">
//                 {file.status}
//               </span>
//               <button
//                 onClick={() => handlePreview(file)}
//                 className="p-1.5 bg-blue-50 hover:bg-blue-100 text-msp-blue rounded transition-colors"
//                 title="Preview"
//               >
//                 <Eye size={16} />
//               </button>
//               <button
//                 className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
//                 title="Download"
//               >
//                 <Download size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* File Preview Modal */}
//       {selectedFile && (
//         <FilePreviewModal
//           file={selectedFile}
//           isOpen={showPreview}
//           onClose={() => setShowPreview(false)}
//         />
//       )}
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { File, Image, Video, Download, Eye } from "lucide-react";
import FilePreviewModal from "./FilePreviewModal";

const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;

export default function AdminFileList({ uploadNumber }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!uploadNumber) return;

    fetchFiles();
  }, [uploadNumber]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!WORKER_URL) {
        throw new Error(
          "Cloudflare Worker URL is not configured"
        );
      }

      console.log(
        "📂 Fetching R2 files for:",
        uploadNumber
      );

      const response = await fetch(
        `${WORKER_URL}/files/${encodeURIComponent(uploadNumber)}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to fetch R2 files"
        );
      }

      console.log(
        "✅ R2 files received:",
        result
      );

      setFiles(result.files || []);
    } catch (error) {
      console.error(
        "❌ Failed to fetch R2 files:",
        error
      );

      setError(error.message);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleDownload = (file) => {
    if (!file.url) {
      console.error("No file URL available");
      return;
    }

    window.open(file.url, "_blank");
  };

  const getFileIcon = (fileType) => {
    if (fileType === "video") {
      return (
        <Video
          size={24}
          className="text-blue-600"
        />
      );
    }

    if (fileType === "image") {
      return (
        <Image
          size={24}
          className="text-green-600"
        />
      );
    }

    return (
      <File
        size={24}
        className="text-gray-600"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 border border-gray-200 rounded-lg">
        <p className="text-gray-500">
          Loading project files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">
          Failed to load files
        </p>

        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>

        <button
          onClick={fetchFiles}
          className="mt-3 px-3 py-1.5 bg-msp-blue text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 border border-gray-200 rounded-lg">
        <p className="text-gray-500">
          No files attached to this request.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.key || file.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {getFileIcon(file.file_type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal text-sm truncate">
                  {file.file_name}
                </p>

                <p className="text-xs text-gray-600">
                  {file.file_size} • {file.file_type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">
                Uploaded
              </span>

              <button
                onClick={() =>
                  handlePreview(file)
                }
                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-msp-blue rounded transition-colors"
                title="Preview"
              >
                <Eye size={16} />
              </button>

              <button
                onClick={() =>
                  handleDownload(file)
                }
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          isOpen={showPreview}
          onClose={() =>
            setShowPreview(false)
          }
        />
      )}
    </>
  );
}