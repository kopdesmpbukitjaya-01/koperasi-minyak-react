import { getLabaBersih } from "./dashboardPublic";


export async function getLabaKoperasi(){

 const data = await getLabaBersih();


 return {

   totalPenjualan:
   data.totalPenjualan,

   totalModalBerputar:
   data.totalModalTerjual,

   labaKotor:
   data.labaKotor,

   totalPengeluaran:
   data.totalPengeluaran,

   shuKoperasi:
   data.labaBersih,

   rekap:{}

 };

}