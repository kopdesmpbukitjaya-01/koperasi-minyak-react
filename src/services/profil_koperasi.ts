import { supabase } from "../lib/supabase";


export async function getProfilKoperasi(){

const {data,error}=await supabase
.from("profil_koperasi")
.select("*")
.single();


if(error){

console.error(
"ERROR PROFIL KOPERASI:",
error
);

throw error;

}


return data;

}