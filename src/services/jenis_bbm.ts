import { supabase } from "../lib/supabase";

export async function getJenisBBM() {
  const { data, error } = await supabase
    .from("jenis_bbm")
    .select("*")
    .order("nama");

  if (error) throw error;

  return data;
}