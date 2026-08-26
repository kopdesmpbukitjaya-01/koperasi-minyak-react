import { supabase } from "../lib/supabase";

export async function getPeriode() {
  const { data, error } = await supabase
    .from("periode")
    .select(`
      *,
      jenis_bbm (
        id,
        nama
      )
    `)
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addPeriode(
  nama_periode: string,
  jenis_bbm_id: number,
  kuota_liter: number,
  aktif: boolean
) {
  const { error } = await supabase
    .from("periode")
    .insert([
      {
        nama_periode,
        jenis_bbm_id,
        kuota_liter,
        aktif,
      },
    ]);

  if (error) throw error;
}

export async function updatePeriode(
  id: number,
  nama_periode: string,
  jenis_bbm_id: number,
  kuota_liter: number,
  aktif: boolean
) {
  const { error } = await supabase
    .from("periode")
    .update({
      nama_periode,
      jenis_bbm_id,
      kuota_liter,
      aktif,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deletePeriode(id: number) {
  const { error } = await supabase
    .from("periode")
    .delete()
    .eq("id", id);

  if (error) throw error;
}