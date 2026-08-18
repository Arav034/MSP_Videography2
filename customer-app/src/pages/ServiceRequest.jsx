import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, FileImage, FileVideo } from "lucide-react";
import TextField from "@/components/forms/TextField";
import TextArea from "@/components/forms/TextArea";
import Spinner from "@/components/common/Spinner";
import { useUpload } from "@/hooks/useUpload";
import { useRequests } from "@/hooks/useRequests";
import { BOOKING_SERVICE_OPTIONS } from "@/constants/bookingContent";

//supabase integration
import { createUpload } from "@/services/uploadService";
import { r2Service } from "@/services/r2Service";

// This form is reached via the "Upload for Editing" flow, so only show
// Editing-category services rather than the full service catalog.
const EDITING_SERVICE_OPTIONS = BOOKING_SERVICE_OPTIONS.filter(
  (opt) => opt.category === "Editing"
);
import { ROUTES } from "@/constants/routes";

const BUDGET_RANGES = ["Under ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹40,000", "₹40,000+"];

const INITIAL_STATE = {
  name: "",
  email: "",
  phone: "",
  serviceTitle: "",
  budget: "",
  deadline: "",
  description: "",
};


export default function ServiceRequest() {
  
  const { files, clearFiles } = useUpload();
  const { addRequest } = useRequests();
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString().split("T")[0];
};
  
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

// const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     // No backend wired yet — files stay in-memory (object URLs) for preview only.
//     // Once a backend exists, this is where files + form data get uploaded together.
//     setTimeout(() => {
//       addRequest({
//         serviceTitle: form.serviceTitle,
//         budget: form.budget,
//         deadline: form.deadline,
//         description: form.description,
//         fileCount: files.length,
//       });
//       console.log("Service request submitted:", { form, fileCount: files.length });
//       setSubmitting(false);
//       setSubmitted(true);
//       clearFiles();
//     }, 900);
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setSubmitting(true);

//     const uploadData = {
//   //    upload_number: `MSP${generateUploadNumber()}`,
//       customer_name: form.name,
//       email: form.email,
//       phone: form.phone,

//       service_needed: form.serviceTitle,
//       budget_range: form.budget || null,
//       preferred_deadline: form.deadline || null,
//       project_description: form.description || null,

//       upload_status: "Waiting",
//       admin_notes: null,
//     };


//     const result = await createUpload(uploadData);

//     // Keep your existing local request system
//     addRequest({
//       serviceTitle: form.serviceTitle,
//       budget: form.budget,
//       deadline: form.deadline,
//       description: form.description,
//       fileCount: files.length,
//     });

//     setSubmitted(true);
//     clearFiles();

//   } catch (error) {
//     console.error("Upload request failed:", error);
//     alert("Failed to submit your request. Please try again.");

//   } finally {
//     setSubmitting(false);
//   }
// };

// const generateUploadNumber = () => {
//   const today = new Date();

//   const day = String(today.getDate()).padStart(2, "0");
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const year = today.getFullYear();

//   // Daily counter stored in browser
//   const dateKey = `${day}${month}${year}`;
//   const storageKey = `msp_upload_count_${dateKey}`;

//   const currentCount =
//     Number(localStorage.getItem(storageKey)) || 0;

//   const nextCount = currentCount + 1;

//   localStorage.setItem(storageKey, nextCount);

//   const count = String(nextCount).padStart(3, "0");

//   return `${count}${dateKey}`;
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setSubmitting(true);

//     // Generate one upload number for this request
//    // const uploadNumber = `MSP${generateUploadNumber()}`;


//     // 1. Upload selected files to Cloudflare R2
//     for (const fileItem of files) {
//       // Supports both { file: File } and direct File objects
//       const actualFile = fileItem.file || fileItem;

//       if (!actualFile) {
//         throw new Error("Invalid file selected");
//       }

//       const uploadResult = await r2Service.uploadFile(
//         actualFile,
//         uploadNumber
//       );

//       if (!uploadResult.success) {
//         throw new Error(
//           uploadResult.error ||
//           `Failed to upload ${actualFile.name}`
//         );
//       }
//     }

//     // 2. Save request details to Supabase
//     const uploadData = {
//       // upload_number: uploadNumber,

//       customer_name: form.name,
//       email: form.email,
//       phone: form.phone,

//       service_needed: form.serviceTitle,
//       budget_range: form.budget || null,
//       preferred_deadline: form.deadline || null,
//       project_description: form.description || null,

//       upload_status: "Waiting",
//       admin_notes: null,
//     };

//     const result = await createUpload(uploadData);

//     // 3. Keep your existing local request system
//     addRequest({
//       serviceTitle: form.serviceTitle,
//       budget: form.budget,
//       deadline: form.deadline,
//       description: form.description,
//       fileCount: files.length,
//     });

//     // 4. Show success
//     setSubmitted(true);
//     clearFiles();

//   } catch (error) {
//     alert(
//       error.message ||
//       "Failed to submit your request. Please try again."
//     );

//   } finally {
//     setSubmitting(false);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setSubmitting(true);

//     // Generate a temporary ID for file organization in R2
//     const tempId = `CUSTOMER_${Date.now()}`;

//     // 1. Upload selected files to Cloudflare R2
//     for (const fileItem of files) {
//       const actualFile = fileItem.file || fileItem;

//       if (!actualFile) {
//         throw new Error("Invalid file selected");
//       }

//       const uploadResult = await r2Service.uploadFile(
//         actualFile,
//         tempId  // ✅ Use tempId instead of uploadNumber
//       );

//       if (!uploadResult.success) {
//         throw new Error(
//           uploadResult.error ||
//           `Failed to upload ${actualFile.name}`
//         );
//       }
//     }

//     // 2. Save request details to Supabase
//     const uploadData = {
//       // ✅ REMOVED: upload_number - Supabase generates it
//       customer_name: form.name,
//       email: form.email,
//       phone: form.phone,
//       service_needed: form.serviceTitle,
//       budget_range: form.budget || null,
//       preferred_deadline: form.deadline || null,
//       project_description: form.description || null,
//       upload_status: "Waiting",
//       admin_notes: null,
//     };

//     const result = await createUpload(uploadData);

//     // 3. Keep your existing local request system
//     addRequest({
//       serviceTitle: form.serviceTitle,
//       budget: form.budget,
//       deadline: form.deadline,
//       description: form.description,
//       fileCount: files.length,
//     });

//     // 4. Show success
//     setSubmitted(true);
//     clearFiles();

//   } catch (error) {
//     alert(
//       error.message ||
//       "Failed to submit your request. Please try again."
//     );
//   } finally {
//     setSubmitting(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSubmitting(true);

    // ============================================
    // 1. CREATE UPLOAD REQUEST IN SUPABASE
    // ============================================
    const uploadData = {
      customer_name: form.name,
      email: form.email,
      phone: form.phone,
      service_needed: form.serviceTitle,
      budget_range: form.budget || null,
      preferred_deadline: form.deadline || null,
      project_description: form.description || null,
      upload_status: "Waiting",
      admin_notes: null,
    };

    // const result = await createUpload(uploadData);

    // // createUpload must return the created row
    // const createdUpload = result?.data || result;

    // if (!createdUpload?.upload_number) {
    //   throw new Error(
    //     "Upload number was not generated by Supabase."
    //   );
    // }

    // const uploadNumber = createdUpload.upload_number;
    
    const result = await createUpload(uploadData);

    if (!result?.uploadNumber) {
      throw new Error("Upload number was not generated.");
    }

    const uploadNumber = result.uploadNumber;

    console.log("✅ Upload created:", uploadNumber);

    // ============================================
    // 2. UPLOAD FILES TO CLOUDFLARE R2
    // ============================================
    for (const fileItem of files) {
      const actualFile = fileItem.file || fileItem;

      if (!actualFile) {
        throw new Error("Invalid file selected");
      }

      console.log(
        "📤 Uploading file:",
        actualFile.name
      );

      const uploadResult =
        await r2Service.uploadFile(
          actualFile,
          uploadNumber
        );

      if (!uploadResult?.success) {
        throw new Error(
          uploadResult?.error ||
            `Failed to upload ${actualFile.name}`
        );
      }

      console.log(
        "✅ Uploaded:",
        actualFile.name
      );
    }

    // ============================================
    // 3. KEEP EXISTING LOCAL REQUEST SYSTEM
    // ============================================
    addRequest({
      serviceTitle: form.serviceTitle,
      budget: form.budget,
      deadline: form.deadline,
      description: form.description,
      fileCount: files.length,
    });

    // ============================================
    // 4. SUCCESS
    // ============================================
    console.log(
      "✅ Service request completed:",
      uploadNumber
    );

    setSubmitted(true);
    clearFiles();

  } catch (error) {
    console.error(
      "❌ Upload request failed:",
      error
    );

    alert(
      error.message ||
        "Failed to submit your request. Please try again."
    );

  } finally {
    setSubmitting(false);
  }
};

  if (submitted) {
    return (
      <section className="max-w-2xl mx-auto px-6 md:px-10 py-32 text-center">
        <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6">
          <Check size={28} />
        </div>
        <h1 className="font-display text-3xl mb-4">Request received</h1>
        <p className="text-steel max-w-md mx-auto mb-10">
          Thanks — our editing team will review your files and project
          details, and reach out to confirm scope and turnaround.
        </p>
        <Link to={ROUTES.HOME} className="btn-primary">
          Back to Home
        </Link>
      </section>
    );
  }

  
  
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 py-20">
      <div className="text-center mb-12">
        <span className="eyebrow mb-4 block">Almost There</span>
        <h1 className="font-display text-4xl md:text-5xl">Project Details</h1>
        <p className="mt-4 text-steel max-w-lg mx-auto">
          Tell us a bit more about the edit you're looking for.
        </p>
      </div>

      {files.length > 0 && (
        <div className="mb-10">
          <p className="font-mono text-xs tracking-wideish uppercase text-steel mb-3">
            {files.length} file{files.length > 1 ? "s" : ""} attached
          </p>
          <div className="flex flex-wrap gap-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="w-14 h-14 bg-mist border border-mist relative overflow-hidden"
              >
                {f.type === "image" ? (
                  <img src={f.previewUrl} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={f.previewUrl} muted playsInline className="w-full h-full object-cover" />
                )}
                <div className="absolute bottom-0 right-0 p-0.5 bg-ink/70">
                  {f.type === "image" ? (
                    <FileImage size={10} className="text-white" />
                  ) : (
                    <FileVideo size={10} className="text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-mist bg-white p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

       <TextField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

            setForm((prev) => ({
              ...prev,
              phone: value,
            }));
          }}
          required
          pattern="[0-9]{10}"
          minLength={10}
          maxLength={10}
          placeholder="Enter 10-digit phone number"
        />

{form.phone.length > 0 &&
  form.phone.length < 10 && (
    <p className="text-xs text-red-500 -mt-4">
      Please enter a valid 10-digit phone number.
    </p>
)}

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
            Service Needed
          </span>
          <select
            name="serviceTitle"
            value={form.serviceTitle}
            onChange={handleChange}
            required
            className="border border-mist bg-white px-4 py-3 text-sm text-ink
                       focus:outline-none focus:border-brand transition-colors duration-300"
          >
            <option value="" disabled>
              Select a service
            </option>
            {EDITING_SERVICE_OPTIONS.map((opt) => (
              <option key={opt.title} value={opt.title}>
                {opt.title}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
              Budget Range
            </span>
            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="border border-mist bg-white px-4 py-3 text-sm text-ink
                         focus:outline-none focus:border-brand transition-colors duration-300"
            >
              <option value="" disabled>
                Select a range
              </option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
              Preferred Deadline
            </span>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={getTomorrowDate()}
              style={{ colorScheme: "light" }}
              className="border border-mist bg-white px-4 py-3 text-sm text-ink
                        focus:outline-none focus:border-brand transition-colors duration-300"
            />
          </label>
        </div>

        <TextArea
          label="Project Description"
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          placeholder="Tell us about the style, tone, or specific edits you're looking for..."
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary self-start mt-2 disabled:opacity-70"
        >
          {submitting ? <Spinner /> : null}
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </section>
  );
}


// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Check, FileImage, FileVideo } from "lucide-react";
// import TextField from "@/components/forms/TextField";
// import TextArea from "@/components/forms/TextArea";
// import Spinner from "@/components/common/Spinner";
// import { useUpload } from "@/hooks/useUpload";
// import { useRequests } from "@/hooks/useRequests";
// import { BOOKING_SERVICE_OPTIONS } from "@/constants/bookingContent";
// import { createUpload } from "@/services/uploadService";
// import { ROUTES } from "@/constants/routes";

// const EDITING_SERVICE_OPTIONS = BOOKING_SERVICE_OPTIONS.filter(
//   (opt) => opt.category === "Editing"
// );

// const BUDGET_RANGES = ["Under ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹40,000", "₹40,000+"];

// const INITIAL_STATE = {
//   name: "",
//   email: "",
//   phone: "",
//   serviceTitle: "",
//   budget: "",
//   deadline: "",
//   description: "",
// };

// export default function ServiceRequest() {
//   const { files, clearFiles } = useUpload();
//   const { addRequest } = useRequests();
//   const [form, setForm] = useState(INITIAL_STATE);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const getTomorrowDate = () => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow.toISOString().split("T")[0];
//   };

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setSubmitting(true);

//       const uploadData = {
//         customer_name: form.name,
//         email: form.email,
//         phone: form.phone,
//         service_needed: form.serviceTitle,
//         budget_range: form.budget || null,
//         preferred_deadline: form.deadline || null,
//         project_description: form.description || null,
//         upload_status: "Waiting",
//         admin_notes: null,
//       };

//       const result = await createUpload(uploadData);

//       addRequest({
//         serviceTitle: form.serviceTitle,
//         budget: form.budget,
//         deadline: form.deadline,
//         description: form.description,
//         fileCount: files.length,
//       });

//       setSubmitted(true);
//       clearFiles();
//     } catch (error) {
//       console.error("Upload request failed:", error);
//       alert("Failed to submit your request. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <section className="max-w-2xl mx-auto px-6 md:px-10 py-32 text-center">
//         <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6">
//           <Check size={28} />
//         </div>
//         <h1 className="font-display text-3xl mb-4">Request received</h1>
//         <p className="text-steel max-w-md mx-auto mb-10">
//           Thanks — our editing team will review your files and project
//           details, and reach out to confirm scope and turnaround.
//         </p>
//         <Link to={ROUTES.HOME} className="btn-primary">
//           Back to Home
//         </Link>
//       </section>
//     );
//   }

//   return (
//     <section className="max-w-3xl mx-auto px-6 md:px-10 py-20">
//       <div className="text-center mb-12">
//         <span className="eyebrow mb-4 block">Almost There</span>
//         <h1 className="font-display text-4xl md:text-5xl">Project Details</h1>
//         <p className="mt-4 text-steel max-w-lg mx-auto">
//           Tell us a bit more about the edit you're looking for.
//         </p>
//       </div>

//       {/* Show uploaded files from first Dropzone */}
//       {files.length > 0 && (
//         <div className="mb-10">
//           <p className="font-mono text-xs tracking-wideish uppercase text-steel mb-3">
//             {files.length} file{files.length > 1 ? "s" : ""} attached
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {files.map((f) => (
//               <div
//                 key={f.id}
//                 className="w-14 h-14 bg-mist border border-mist relative overflow-hidden"
//               >
//                 {f.type === "image" ? (
//                   <img src={f.previewUrl} alt={f.name} className="w-full h-full object-cover" />
//                 ) : (
//                   <video src={f.previewUrl} muted playsInline className="w-full h-full object-cover" />
//                 )}
//                 <div className="absolute bottom-0 right-0 p-0.5 bg-ink/70">
//                   {f.type === "image" ? (
//                     <FileImage size={10} className="text-white" />
//                   ) : (
//                     <FileVideo size={10} className="text-white" />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="border border-mist bg-white p-8 flex flex-col gap-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <TextField 
//             label="Full Name" 
//             name="name" 
//             value={form.name} 
//             onChange={handleChange} 
//             required 
//           />
//           <TextField 
//             label="Email" 
//             name="email" 
//             type="email" 
//             value={form.email} 
//             onChange={handleChange} 
//             required 
//           />
//         </div>

//         <TextField
//           label="Phone"
//           name="phone"
//           type="tel"
//           value={form.phone}
//           onChange={(e) => {
//             const value = e.target.value.replace(/\D/g, "").slice(0, 10);
//             setForm((prev) => ({ ...prev, phone: value }));
//           }}
//           required
//           pattern="[0-9]{10}"
//           minLength={10}
//           maxLength={10}
//           placeholder="Enter 10-digit phone number"
//         />

//         {form.phone.length > 0 && form.phone.length < 10 && (
//           <p className="text-xs text-red-500 -mt-4">
//             Please enter a valid 10-digit phone number.
//           </p>
//         )}

//         <label className="flex flex-col gap-2">
//           <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
//             Service Needed
//           </span>
//           <select
//             name="serviceTitle"
//             value={form.serviceTitle}
//             onChange={handleChange}
//             required
//             className="border border-mist bg-white px-4 py-3 text-sm text-ink
//                        focus:outline-none focus:border-brand transition-colors duration-300"
//           >
//             <option value="" disabled>
//               Select a service
//             </option>
//             {EDITING_SERVICE_OPTIONS.map((opt) => (
//               <option key={opt.title} value={opt.title}>
//                 {opt.title}
//               </option>
//             ))}
//           </select>
//         </label>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <label className="flex flex-col gap-2">
//             <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
//               Budget Range
//             </span>
//             <select
//               name="budget"
//               value={form.budget}
//               onChange={handleChange}
//               className="border border-mist bg-white px-4 py-3 text-sm text-ink
//                          focus:outline-none focus:border-brand transition-colors duration-300"
//             >
//               <option value="" disabled>
//                 Select a range
//               </option>
//               {BUDGET_RANGES.map((range) => (
//                 <option key={range} value={range}>
//                   {range}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className="flex flex-col gap-2">
//             <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
//               Preferred Deadline
//             </span>
//             <input
//               type="date"
//               name="deadline"
//               value={form.deadline}
//               onChange={handleChange}
//               min={getTomorrowDate()}
//               style={{ colorScheme: "light" }}
//               className="border border-mist bg-white px-4 py-3 text-sm text-ink
//                         focus:outline-none focus:border-brand transition-colors duration-300"
//             />
//           </label>
//         </div>

//         <TextArea
//           label="Project Description"
//           name="description"
//           rows={5}
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Tell us about the style, tone, or specific edits you're looking for..."
//         />

//         <button
//           type="submit"
//           disabled={submitting}
//           className="btn-primary self-start mt-2 disabled:opacity-70"
//         >
//           {submitting ? <Spinner /> : null}
//           {submitting ? "Submitting..." : "Submit Request"}
//         </button>
//       </form>
//     </section>
//   );
// }