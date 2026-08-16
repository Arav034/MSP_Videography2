export default function VideoPreview({ file }) {
  // Dummy video URL - In production, this will come from Cloudflare R2 via signed URL
  const videoUrl = "https://via.placeholder.com/800x600?text=Video+Preview";

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="flex justify-center bg-black rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="w-full max-h-[500px]"
          controlsList="nodownload"
        />
      </div>

      {/* Video Info */}
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

      {/* Note about video preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p>
          <span className="font-medium">Note:</span> Video playback uses placeholder content. 
          In production, actual videos will stream from Cloudflare R2.
        </p>
      </div>
    </div>
  );
}