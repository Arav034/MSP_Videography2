import { createContext, useState, useCallback } from "react";

export const UploadContext = createContext(null);

let idCounter = 0;

export function UploadProvider({ children }) {
  const [files, setFiles] = useState([]);

  const addFiles = useCallback((fileList) => {
    const accepted = Array.from(fileList).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("audio/")
    );

    const withPreviews = accepted.map((file) => {
      let type = "image";

      if (file.type.startsWith("video/")) {
        type = "video";
      } else if (file.type.startsWith("audio/")) {
        type = "audio";
      }

      return {
        id: `upload-${idCounter++}`,
        file,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        type,
        previewUrl: URL.createObjectURL(file),
      };
    });

    setFiles((prev) => [...prev, ...withPreviews]);
  }, []);

  const removeFile = useCallback((id) => {
    setFiles((prev) => {
      const target = prev.find((file) => file.id === id);

      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return prev.filter((file) => file.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });

      return [];
    });
  }, []);

  return (
    <UploadContext.Provider
      value={{
        files,
        addFiles,
        removeFile,
        clearFiles,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

// import { createContext, useState, useCallback } from "react";

// export const UploadContext = createContext(null);

// let idCounter = 0;

// export function UploadProvider({ children }) {
//   const [files, setFiles] = useState([]);
//   const [dubbingFiles, setDubbingFiles] = useState([]);

//   const addFiles = useCallback((fileList) => {
//     const accepted = Array.from(fileList).filter(
//       (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
//     );

//     const withPreviews = accepted.map((file) => ({
//       id: `upload-${idCounter++}`,
//       file,
//       name: file.name,
//       size: file.size,
//       type: file.type.startsWith("video/") ? "video" : "image",
//       previewUrl: URL.createObjectURL(file),
//     }));

//     setFiles((prev) => [...prev, ...withPreviews]);
//   }, []);

//   const removeFile = useCallback((id) => {
//     setFiles((prev) => {
//       const target = prev.find((f) => f.id === id);
//       if (target) URL.revokeObjectURL(target.previewUrl);
//       return prev.filter((f) => f.id !== id);
//     });
//   }, []);

//   const addDubbingFiles = useCallback((fileList) => {
//     const accepted = Array.from(fileList).filter((f) => f.type.startsWith("audio/"));

//     const withMeta = accepted.map((file) => ({
//       id: `dub-${idCounter++}`,
//       file,
//       name: file.name,
//       size: file.size,
//       language: "",
//     }));

//     setDubbingFiles((prev) => [...prev, ...withMeta]);
//   }, []);

//   const removeDubbingFile = useCallback((id) => {
//     setDubbingFiles((prev) => prev.filter((f) => f.id !== id));
//   }, []);

//   const setDubbingLanguage = useCallback((id, language) => {
//     setDubbingFiles((prev) =>
//       prev.map((f) => (f.id === id ? { ...f, language } : f))
//     );
//   }, []);

//   const clearFiles = useCallback(() => {
//     setFiles((prev) => {
//       prev.forEach((f) => URL.revokeObjectURL(f.previewUrl));
//       return [];
//     });
//     setDubbingFiles([]);
//   }, []);

//   return (
//     <UploadContext.Provider
//       value={{
//         files,
//         addFiles,
//         removeFile,
//         dubbingFiles,
//         addDubbingFiles,
//         removeDubbingFile,
//         setDubbingLanguage,
//         clearFiles,
//       }}
//     >
//       {children}
//     </UploadContext.Provider>
//   );
// }