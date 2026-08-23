import { supabase } from "./supabase/supabaseClient";

export async function createUpload(uploadData) {
  const { data: uploadNumber, error: numberError } =
    await supabase.rpc("generate_upload_number");

  if (numberError) {
    console.error("UPLOAD NUMBER ERROR:", numberError);
    throw numberError;
  }

  const finalUploadData = {
    ...uploadData,
    upload_number: uploadNumber,
  };

  const { error } = await supabase
    .from("uploads")
    .insert([finalUploadData]);

  if (error) {
    console.error("UPLOAD INSERT ERROR:", error);
    throw error;
  }

  return {
    success: true,
    uploadNumber,
  };
}


// ========================================
// GET UPLOAD BY UPLOAD NUMBER
// ========================================

export async function getUploadByNumber(uploadNumber) {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("upload_number", uploadNumber.trim())
    .maybeSingle();

  if (error) {
    console.error("UPLOAD FETCH ERROR:", error);
    throw error;
  }

  return data;
}

// import { supabase } from "./supabase/supabaseClient";

// export async function createUpload(uploadData) {
//   const { data: uploadNumber, error: numberError } =
//     await supabase.rpc("generate_upload_number");

//   if (numberError) {
//     console.error("UPLOAD NUMBER ERROR:", numberError);
//     throw numberError;
//   }

//   const finalUploadData = {
//     ...uploadData,
//     upload_number: uploadNumber,
//   };

//   const { error } = await supabase
//     .from("uploads")
//     .insert([finalUploadData]);

//   if (error) {
//     console.error("UPLOAD INSERT ERROR:", error);
//     throw error;
//   }

//   return {
//     success: true,
//     uploadNumber,
//   };
  
// }