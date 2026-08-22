import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  X,
  FileImage,
  FileVideo,
  Play,
} from "lucide-react";

import Dropzone from "@/components/common/Dropzone";
import SectionHeading from "@/components/common/SectionHeading";
import FilePreviewModal from "@/components/common/FilePreviewModal";
import { useUpload } from "@/hooks/useUpload";
import { ROUTES } from "@/constants/routes";

function formatSize(bytes) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STEPS = {
  MAIN: "main",
};

export default function UploadSection() {
  const {
    files,
    addFiles,
    removeFile,
  } = useUpload();

  const navigate = useNavigate();

  const [step] = useState(STEPS.MAIN);
  const [previewFile, setPreviewFile] = useState(null);

  return (
    <section
      id="upload-section"
      className="relative overflow-hidden border-y border-mist"
    >
      {/* ================= BACKGROUND ================= */}

      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 blur-sm"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
        }}
      />

      <div className="absolute inset-0 z-0 bg-white/10" />

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-20">

        {/* Heading */}

        <SectionHeading
          eyebrow="Start a Project"
          title="Upload for Editing"
          align="center"
          light
        />

        <p className="mt-4 text-white/90 text-center max-w-lg mx-auto">
          Have raw photos, footage, or audio ready? Upload them here and tell
          us what you need — our editing team will take it from there.
        </p>

        {/* ================= UPLOAD ================= */}

        {step === STEPS.MAIN && (
          <div className="mt-10">

            <div className="shadow-sm">

              <Dropzone
                onFiles={addFiles}
                accept="
                  image/*
                  ,video/mp4
                  ,video/quicktime
                  ,video/webm
                  ,audio/*
                  ,.mxf
                  ,.braw
                  ,.r3d
                "
                label="Drag and drop your files here"
                description="Or click below to browse images, videos, or audio files from your computer."
                buttonLabel="Select Files"
                formats={[
                  "MP4",
                  "MOV",
                  "WEBM",
                  "MXF",
                  "BRAW",
                  "R3D",
                  "JPG",
                  "PNG",
                  "TIFF",
                  "MP3",
                  "WAV",
                  "M4A",
                ]}
                sizeLimit="4K / 8K RAW"
              />

            </div>

            {/* ================= FILE COUNT ================= */}

            {files.length > 0 && (
              <div className="mt-8">

                <p className="font-mono text-xs tracking-wideish uppercase text-steel mb-4">
                  {files.length} file
                  {files.length > 1 ? "s" : ""} added
                </p>

                {/* ================= FILE GRID ================= */}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                  {files.map((file) => (

                    <div
                      key={file.id}
                      onClick={() => setPreviewFile(file)}
                      className="
                        relative
                        aspect-square
                        bg-mist
                        border
                        border-mist
                        group
                        cursor-pointer
                        overflow-hidden
                      "
                    >

                      {/* ================================================= */}
                      {/* IMAGE */}
                      {/* ================================================= */}

                      {file.type === "image" && (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* ================================================= */}
                      {/* VIDEO */}
                      {/* ================================================= */}

                      {file.type === "video" && (
                        <>
                          <video
                            src={file.previewUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          />

                          {/* Video Play Icon */}

                          <div
                            className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              opacity-0
                              group-hover:opacity-100
                              transition-opacity
                              duration-300
                            "
                          >
                            <div
                              className="
                                w-10
                                h-10
                                rounded-full
                                bg-white/90
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <Play
                                size={16}
                                className="text-ink ml-0.5"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* ================================================= */}
                      {/* AUDIO */}
                      {/* ================================================= */}

                      {file.type === "audio" && (
                        <div
                          className="
                            w-full
                            h-full
                            bg-mist
                            flex
                            flex-col
                            items-center
                            justify-center
                            p-3
                          "
                          onClick={(e) => e.stopPropagation()}
                        >

                          {/* Microphone */}

                          <div
                            className="
                              w-14
                              h-14
                              rounded-full
                              bg-white
                              flex
                              items-center
                              justify-center
                              shadow-sm
                              mb-3
                            "
                          >
                            <Mic
                              size={28}
                              className="text-steel"
                            />
                          </div>

                          {/* Audio filename */}

                          <p
                            className="
                              text-xs
                              text-steel
                              font-medium
                              truncate
                              max-w-full
                              mb-3
                              px-1
                            "
                            title={file.name}
                          >
                            {file.name}
                          </p>

                          {/* ================================================= */}
                          {/* AUDIO PLAYER */}
                          {/* ================================================= */}

                          <audio
                            src={file.previewUrl}
                            controls
                            preload="metadata"
                            className="w-full"
                            onClick={(e) => e.stopPropagation()}
                          />

                        </div>
                      )}

                      {/* ================= HOVER OVERLAY ================= */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-ink/0
                          group-hover:bg-ink/30
                          transition-colors
                          duration-300
                          pointer-events-none
                        "
                      />

                      {/* ================= REMOVE BUTTON ================= */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="
                          absolute
                          top-2
                          right-2
                          w-6
                          h-6
                          bg-ink/70
                          text-white
                          flex
                          items-center
                          justify-center
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                          duration-300
                          z-20
                        "
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={14} />
                      </button>

                      {/* ================= FILE INFO ================= */}

                      <div
                        className="
                          absolute
                          bottom-0
                          left-0
                          right-0
                          p-2
                          flex
                          items-center
                          gap-1.5
                          bg-ink/60
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                          duration-300
                          z-20
                        "
                      >

                        {/* Image icon */}

                        {file.type === "image" && (
                          <FileImage
                            size={12}
                            className="text-white shrink-0"
                          />
                        )}

                        {/* Video icon */}

                        {file.type === "video" && (
                          <FileVideo
                            size={12}
                            className="text-white shrink-0"
                          />
                        )}

                        {/* Audio icon */}

                        {file.type === "audio" && (
                          <Mic
                            size={12}
                            className="text-white shrink-0"
                          />
                        )}

                        {/* Size */}

                        <span
                          className="
                            text-[10px]
                            text-white
                            truncate
                          "
                        >
                          {formatSize(file.size)}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>
            )}

            {/* ================= NEXT BUTTON ================= */}

            {files.length > 0 && (
              <div className="mt-8 flex justify-center">

                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTES.SERVICE_REQUEST)
                  }
                  className="btn-primary rounded-lg"
                >
                  Next
                </button>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ================= FILE PREVIEW MODAL ================= */}

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

    </section>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Mic, X, FileImage, FileVideo, Play, Check, ArrowLeft } from "lucide-react";
// import Dropzone from "@/components/common/Dropzone";
// import SectionHeading from "@/components/common/SectionHeading";
// import DubbingFileCard from "@/components/cards/DubbingFileCard";
// import FilePreviewModal from "@/components/common/FilePreviewModal";
// import { useUpload } from "@/hooks/useUpload";
// import { ROUTES } from "@/constants/routes";

// function formatSize(bytes) {
//   if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// }

// const STEPS = {
//   MAIN: "main",
//   DUBBING_CHOICE: "dubbing_choice",
//   DUBBING_UPLOAD: "dubbing_upload",
// };

// export default function UploadSection() {
//   const {
//     files,
//     addFiles,
//     removeFile,
//     dubbingFiles,
//     addDubbingFiles,
//     removeDubbingFile,
//     setDubbingLanguage,
//   } = useUpload();
//   const navigate = useNavigate();
//   const [step, setStep] = useState(STEPS.MAIN);
//   const [previewFile, setPreviewFile] = useState(null);

//   return (
    
//     <section
//     id="upload-section"
//     className="relative overflow-hidden border-y border-mist"
//   >
//     {/* Blurred background */}
//     <div
//       className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 blur-sm"
//       style={{
//         backgroundImage: "url('/images/bg.jpg')",
//       }}
//     />

//     {/* Background overlay */}
//     <div className="absolute inset-0 z-0 bg-white/10" />

//     {/* Main content */}
//     <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-20">

//       <SectionHeading
//         eyebrow="Start a Project"
//         title="Upload for Editing"
//         align="center"
//         light
//       />

//       <p className="mt-4 text-white/90 text-center max-w-lg mx-auto">
//         Have raw photos or footage ready? Upload them here and tell us what
//         you need — our editing team will take it from there.
//       </p>

//       {/* Everything else stays exactly the same */}    
    
//         {step === STEPS.MAIN && (
//           <div className="mt-10">
//             {/* <div className="mt-10 shadow-sm">
//           <Dropzone onFiles={addFiles} accept="image/*,video/*" />
//         </div> */}
//             <div className="shadow-sm">
//               <Dropzone
//                 onFiles={addFiles}
//                 accept="video/mp4,video/quicktime,.mxf,.braw,.r3d,image/*"
//                 label="Drag and drop raw footage files here"
//                 description="Or click below to browse files from your computer."
//                 buttonLabel="Select Footage File"
//                 formats={["MP4", "MOV", "MXF", "JPG", "PNG", "TIFF"]}
//                 sizeLimit="4K / 8K RAW"
//               />
//             </div>

//             {files.length > 0 && (
//               <div className="mt-8">
//                 <p className="font-mono text-xs tracking-wideish uppercase text-steel mb-4">
//                   {files.length} file{files.length > 1 ? "s" : ""} added
//                 </p>

//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                   {files.map((f) => (
//                     <div
//                       key={f.id}
//                       onClick={() => setPreviewFile(f)}
//                       className="relative aspect-square bg-mist border border-mist group cursor-pointer"
//                     >
//                       {f.type === "image" ? (
//                         <img src={f.previewUrl} alt={f.name} className="w-full h-full object-cover" />
//                       ) : (
//                         <video src={f.previewUrl} muted playsInline className="w-full h-full object-cover" />
//                       )}

//                       <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors duration-300" />

//                       {f.type === "video" && (
//                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
//                             <Play size={16} className="text-ink ml-0.5" fill="currentColor" />
//                           </div>
//                         </div>
//                       )}

//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeFile(f.id);
//                         }}
//                         className="absolute top-2 right-2 w-6 h-6 bg-ink/70 text-white flex items-center justify-center
//                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                         aria-label={`Remove ${f.name}`}
//                       >
//                         <X size={14} />
//                       </button>

//                       <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center gap-1.5 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         {f.type === "image" ? (
//                           <FileImage size={12} className="text-white shrink-0" />
//                         ) : (
//                           <FileVideo size={12} className="text-white shrink-0" />
//                         )}
//                         <span className="text-[10px] text-white truncate">{formatSize(f.size)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {files.length > 0 && (
//               <div className="mt-8 flex justify-center">
//                 <button
//                   type="button"
//                   // onClick={() => setStep(STEPS.DUBBING_CHOICE)}
//                   onClick={() => navigate(ROUTES.SERVICE_REQUEST)}
//                   className="btn-primary"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {step === STEPS.DUBBING_CHOICE && (
//           <div className="mt-14 flex flex-col items-center text-center">
//             <div className="w-14 h-14 flex items-center justify-center bg-white/30  text-blue mb-6">
//               <Mic size={24} strokeWidth={1.5} />
//             </div>
//             <h3 className="font-display text-2xl text-white mb-3">
//               Do you have dubbing files to add?
//             </h3>
//             <p className="text-s text-white max-w-sm mb-8">
//               If you have a voice-over or dubbing audio track to sync with
//               your edit, you can upload it next. This step is optional.
//             </p>

//             <div className="flex flex-wrap items-center justify-center gap-4">
//               <button
//                 type="button"
//                 onClick={() => navigate(ROUTES.SERVICE_REQUEST)}
//                 className="btn-ghost text-white/90 hover:text-white transition-colors"
//               >
//                 No, Skip
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setStep(STEPS.DUBBING_UPLOAD)}
//                 className="btn-primary"
//               >
//                 Yes, Add Dubbing Files
//               </button>
//             </div>

//             <button
//               type="button"
//               onClick={() => setStep(STEPS.MAIN)}
//               className="mt-8 flex items-center gap-2 text-x text-white"
//             >
//               <ArrowLeft size={14} />
//               Back to Files
//             </button>
//           </div>
//         )}

//         {/* {step === STEPS.DUBBING_UPLOAD && (
//           <div className="mt-10">
//             <div className="flex items-center gap-2 mb-4">
//               <Mic size={16} className="text-brand" />
//               <p className="font-mono text-xs tracking-widest2 uppercase text-white">
//                 Dubbing Audio
//               </p>
//             </div>
//             <p className="text-sm text-white mb-5">
//               Upload your voice-over or dubbing track and select the language
//               for each file.
//             </p>

//             <div className="bg-white p-1 shadow-sm">
//               <Dropzone
//                 onFiles={addDubbingFiles}
//                 accept="audio/*"
//                 label="Drag & drop your dubbing audio files"
//                 hint="Audio Files Accepted"
//               />
//             </div>

//             {dubbingFiles.length > 0 && (
//               <div className="mt-6 flex flex-col gap-3">
//                 {dubbingFiles.map((f) => (
//                   <DubbingFileCard
//                     key={f.id}
//                     file={f}
//                     onRemove={removeDubbingFile}
//                     onLanguageChange={setDubbingLanguage}
//                   />
//                 ))}
//               </div>
//             )}

//             <div className="mt-8 flex flex-col items-center gap-4">
//               <button
//                 type="button"
//                 onClick={() => navigate(ROUTES.SERVICE_REQUEST)}
//                 disabled={dubbingFiles.length === 0}
//                 className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <Check size={16} />
//                 Next: Add Project Details
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setStep(STEPS.DUBBING_CHOICE)}
//                 className="flex items-center gap-2 text-xs text-white hover:text-brand transition-colors"
//               >
//                 <ArrowLeft size={14} />
//                 Back
//               </button>
//             </div>
//           </div>
//         )} */}
//       </div>
   
//       <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
//     </section>
//   );
// }
