const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;

export const r2Service = {
  uploadFile: async (file, uploadNumber) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      if (!WORKER_URL) {
        throw new Error("Cloudflare Worker URL is not configured");
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("uploadNumber", uploadNumber);
      const response = await fetch(`${WORKER_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "R2 upload failed");
      }

      return {
        success: true,
        key: result.key,
        url: result.url,
        size: file.size,
        type: file.type,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {

      return {
        success: false,
        error: error.message,
      };
    }
  },

  getPublicUrl: (fileKey) => {
    return `${WORKER_URL}/file/${encodeURIComponent(fileKey)}`;
  },

  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      Math.round((bytes / Math.pow(k, i)) * 100) / 100 +
      " " +
      sizes[i]
    );
  },

  getFileType: (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";

    return "document";
  },
};