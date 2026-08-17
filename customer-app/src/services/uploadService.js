// import { supabase } from "./supabase/supabaseClient";

// export async function createUpload(uploadData) {
//   console.log("📤 Creating upload...");

//   // Generate the unique daily upload number from Supabase
//   const {
//     data: uploadNumber,
//     error: numberError,
//   } = await supabase.rpc("generate_upload_number");

//   if (numberError) {
//     console.error(
//       "❌ Upload number generation failed:",
//       numberError
//     );

//     throw numberError;
//   }

//   console.log(
//     "✅ Generated upload number:",
//     uploadNumber
//   );

//   // Add the generated number to the upload data
//   const finalData = {
//     ...uploadData,
//     upload_number: uploadNumber,
//   };

//   console.log(
//     "📦 Final data:",
//     finalData
//   );

//   // Insert into uploads table
//   const {
//     data,
//     error,
//   } = await supabase
//     .from("uploads")
//     .insert([finalData]);

//   if (error) {
//     console.error(
//       "❌ Upload insert failed:",
//       error
//     );

//     throw error;
//   }

//   console.log(
//     "✅ ROW CREATED IN SUPABASE:",
//     uploadNumber
//   );

//   return {
//     uploadNumber,
//     data,
//   };
// }



import { supabase } from "./supabase/supabaseClient";

export async function createUpload(uploadData) {

  // Upload number is generated in ServiceRequest.jsx
  // and passed here through uploadData.

  const {
    data,
    error,
  } = await supabase
    .from("uploads")
    .insert([uploadData])
    .select()
    .single();

  if (error) {

    throw error;
  }


  return {
    data,
    uploadNumber: data.upload_number,
  };
}