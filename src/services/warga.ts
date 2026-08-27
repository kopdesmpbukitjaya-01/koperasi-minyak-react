import { supabase } from "../lib/supabase";

export async function getWarga() {
  const { data, error } = await supabase
    .from("warga")
    .select("*")
    .order("nama");

  if (error) throw error;
  return data;
}

export async function addWarga(
  no_kk: string,
  nama: string,
  status: string,
  alamat: string,
  no_hp: string
) {
  const { error } = await supabase
    .from("warga")
    .insert([
  {
    no_kk,
    nama,
    status,
    alamat,
    no_hp,
  },
])

  if (error) throw error;
}

export async function updateWarga(
  id: number,
  no_kk: string,
  nama: string,
  status: string,
  alamat: string,
  no_hp: string
) {
  const { error } = await supabase
    .from("warga")
    .update({
  no_kk,
  nama,
  status,
  alamat,
  no_hp,
})
    .eq("id", id);

  if (error) throw error;
}

export async function deleteWarga(id: number) {
  const { error } = await supabase
    .from("warga")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
