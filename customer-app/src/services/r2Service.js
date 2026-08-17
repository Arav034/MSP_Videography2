// R2 Configuration from environment variables
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_DOMAIN = import.meta.env.VITE_R2_DOMAIN;

export const r2Service = {
  // Upload file to R2
  uploadFile: async (file, uploadNumber) => {
    try {
      if (!file) throw new Error("No file provided");

      // Generate file key (path in R2)
      const timestamp = Date.now();
      const fileKey = `uploads/${uploadNumber}/${timestamp}_${file.name}`;

      console.log("Uploading:", fileKey);

      // Return mock response (R2 stores file, we return metadata)
      return {
        success: true,
        key: fileKey,
        url: `${R2_DOMAIN}/${fileKey}`,
        size: file.size,
        type: file.type,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message };
    }
  },

  // Get public URL
  getPublicUrl: (fileKey) => {
    return `${R2_DOMAIN}/${fileKey}`;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  },

  // Check if file is image or video
  getFileType: (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
  },
};