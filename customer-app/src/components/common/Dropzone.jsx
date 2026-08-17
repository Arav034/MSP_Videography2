// import { useState, useRef } from "react";
// import { UploadCloud } from "lucide-react";
// import { cn } from "@/utils/cn";

// export default function Dropzone({
//   onFiles,
//   accept = "image/*,video/*",
//   label,
//   hint,
//   description,
//   buttonLabel,
//   formats,
//   sizeLimit,
// }) {
//   const [dragging, setDragging] = useState(false);
//   const inputRef = useRef(null);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
//   };

//   const handleChange = (e) => {
//     if (e.target.files?.length) onFiles(e.target.files);
//     e.target.value = "";
//   };

//   return (
//     <div
//       onDragOver={(e) => {
//         e.preventDefault();
//         setDragging(true);
//       }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={handleDrop}
//       className={cn(
//         "p-2 transition-colors duration-300 animate-glow-blink",
//         dragging && "brightness-95"
//       )}
//       style={{
//         backgroundImage: "linear-gradient(to bottom, #16406B 0%, #ffffff 100%)",
//       }}
//     >
//       <div className="border-2 border-dotted border-brand px-6 py-12 flex flex-col items-center justify-center text-center">
//         <UploadCloud
//           size={32}
//           strokeWidth={1.5}
//           className="mb-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
//         />

//         <p className="font-display text-lg text-white mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
//           {label ?? "Drag & drop your photos or videos"}
//         </p>

//         {description && (
//           <p className="text-sm text-white/90 mb-5 max-w-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
//             {description}
//           </p>
//         )}

//         <button
//           type="button"
//           onClick={() => inputRef.current?.click()}
//           className="btn-primary mb-5"
//         >
//           {buttonLabel ?? "Select File"}
//         </button>

//         {formats && formats.length > 0 && (
//           <p className="font-mono text-[11px] tracking-wideish text-brand-light mb-1">
//             {formats.map((f) => `.${f}`).join("  ")}
//           </p>
//         )}

//         {sizeLimit && (
//           <span className="font-mono text-[11px] tracking-widest2 uppercase text-brand-light">
//             {sizeLimit}
//           </span>
//         )}

//         {!formats && (
//           <span className="font-mono text-[11px] tracking-widest2 uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
//             {hint ?? "Images & Videos Accepted"}
//           </span>
//         )}

//         <input
//           ref={inputRef}
//           type="file"
//           multiple
//           accept={accept}
//           onChange={handleChange}
//           className="hidden"
//         />
//       </div>
//     </div>
//   );
// }



import { createContext, useState, useCallback } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { r2Service } from "@/services/r2Service";

export default function Dropzone({
  onFiles,
  accept = "image/*,video/*",
  label,
  hint,
  description,
  buttonLabel,
  formats,
  sizeLimit,
  uploadNumber,
  showProgress = true,
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.length) {
      handleFilesSelected(e.target.files);
    }
    e.target.value = "";
  };

  const handleFilesSelected = async (files) => {
    setError("");
    
    if (!uploadNumber) {
      // No upload number - just use files as before (in-memory)
      const accepted = Array.from(files).filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );
      onFiles(accepted);
      return;
    }

    // Upload to R2
    setUploading(true);
    const newUploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        setUploadProgress((prev) => ({ ...prev, [i]: 0 }));

        // Simulate progress
        for (let progress = 10; progress <= 90; progress += 20) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadProgress((prev) => ({ ...prev, [i]: progress }));
        }

        // Upload to R2
        const result = await r2Service.uploadFile(file, uploadNumber);

        if (result.success) {
          newUploadedFiles.push({
            id: `file_${Date.now()}_${i}`,
            name: result.name,
            key: result.key,
            url: result.url,
            size: r2Service.formatFileSize(result.size),
            type: r2Service.getFileType(result.type),
            mimeType: result.type,
            status: "Uploaded",
          });

          setUploadProgress((prev) => ({ ...prev, [i]: 100 }));
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(`Failed to upload ${file.name}`);
        setUploadProgress((prev) => ({ ...prev, [i]: 0 }));
      }
    }

    if (newUploadedFiles.length > 0) {
      setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
      onFiles(newUploadedFiles);
    }

    setUploading(false);
  };

  const handleRemoveFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFiles(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "p-2 transition-colors duration-300 animate-glow-blink",
          dragging && "brightness-95",
          uploading && "opacity-60"
        )}
        style={{
          backgroundImage: "linear-gradient(to bottom, #16406B 0%, #ffffff 100%)",
        }}
      >
        <div className="border-2 border-dotted border-brand px-6 py-12 flex flex-col items-center justify-center text-center">
          {/* <svg
            size={40}
            strokeWidth={1.5}
            className="mb-7 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" stroke="currentColor" fill="none" />
            <polyline points="17 8 12 3 7 8" strokeWidth="2" stroke="currentColor" fill="none" />
            <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" stroke="currentColor" />
          </svg> */}

          <p className="font-display text-lg text-white mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {uploading ? "Uploading files..." : label ?? "Drag & drop your photos or videos"}
          </p>

          {description && (
            <p className="text-sm text-white/90 mb-5 max-w-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {description}
            </p>
          )}

          <button
            type="button"
            onClick={() => document.getElementById("file-input")?.click()}
            disabled={uploading}
            className={cn("btn-primary mb-5", uploading && "opacity-50 cursor-not-allowed")}
          >
            {uploading ? "Uploading..." : buttonLabel ?? "Select File"}
          </button>

          {formats && formats.length > 0 && (
            <p className="font-mono text-[11px] tracking-wideish text-brand-light mb-1">
              {formats.map((f) => `.${f}`).join("  ")}
            </p>
          )}

          {sizeLimit && (
            <span className="font-mono text-[11px] tracking-widest2 uppercase text-brand-light">
              {sizeLimit}
            </span>
          )}

          {!formats && (
            <span className="font-mono text-[11px] tracking-widest2 uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {hint ?? "Images & Videos Accepted"}
            </span>
          )}

          <input
            id="file-input"
            type="file"
            multiple
            accept={accept}
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Uploaded Files List - R2 */}
      {uploadedFiles.length > 0 && showProgress && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">
            ✓ {uploadedFiles.length} file(s) uploaded to R2
          </p>

          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.size}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Check size={18} className="text-green-500" />
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Remove file"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}