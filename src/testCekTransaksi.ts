import { cekTransaksiAnggota } from "./services/transaksi";


async function test(){

const hasil =
await cekTransaksiAnggota(
  "KDMP0200"
);


console.log(
  "HASIL CEK TRANSAKSI:",
  hasil
);


}


test();