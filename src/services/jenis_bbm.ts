import { supabase } from "../lib/supabase";

export async function getJenisBBM() {
  const { data, error } = await supabase
    .from("jenis_bbm")
    .select("*")
    .order("id");

  console.log("DATA JENIS BBM =", data);
  console.log("ERROR JENIS BBM =", error);

  if (error) throw error;

  return data;
}