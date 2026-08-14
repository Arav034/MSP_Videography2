import { supabase } from "./supabase/supabaseClient";

export async function createUpload(uploadData) {

  // Generate upload number
  const { data: numberData, error: numberError } =
    await supabase.rpc("generate_upload_number");

  if (numberError) {
    throw numberError;
  }

  const finalData = {
    ...uploadData,
    upload_number: numberData,
  };


  // Insert
  const { data, error } = await supabase
    .from("uploads")
    .insert([finalData])
    

  if (error) {
    throw error;
  }


  return data;
}




