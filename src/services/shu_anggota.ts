import { supabase } from "../lib/supabase";


export async function getPembagianSHUAnggota(
  totalSHUAnggota:number,
  shuSimpananPersen:number,
  shuJasaPersen:number,
  tahun:number
){

  const {data:anggota,error}=await supabase
  .from("warga")
  .select(`
    id,
    nama,
    status
  `)
  .in(
    "status",
    [
      "Anggota",
      "Pengurus",
      "Pengawas"
    ]
  );


  if(error) throw error;



  const {data:simpanan}=await supabase
  .from("simpanan_anggota")
  .select(`
    warga_id,
    simpanan_pokok,
    simpanan_wajib,
    simpanan_sukarela
  `);



  const {data:transaksi}=await supabase
.from("transaksi")
.select(`
  id,
  warga_id,
  total,
  tanggal,
  warga(
    id,
    nama,
    status
  )
`)
.gte(
  "tanggal",
  `${tahun}-01-01`
)
.lte(
  "tanggal",
  `${tahun}-12-31`
)
.order(
  "tanggal",
  {
    ascending:false
  }
);
const transaksiAnggotaKoperasi =
transaksi?.filter(
(t:any)=>
[
"Anggota",
"Pengurus",
"Pengawas"
]
.includes(
t.warga?.status
)
)
|| [];


const totalTransaksiAnggota =
transaksiAnggotaKoperasi.reduce(
(sum:any,t:any)=>
sum + Number(t.total || 0),
0
);


console.log(
"JUMLAH TRANSAKSI SEMUA",
transaksi?.length
);


console.log(
"JUMLAH TRANSAKSI ANGGOTA KOPERASI",
transaksiAnggotaKoperasi.length
);


console.log(
"TOTAL TRANSAKSI ANGGOTA KOPERASI",
totalTransaksiAnggota
);
  /*
  ==========================
  TOTAL GLOBAL
  ==========================
  */


  const totalSimpanan =
  simpanan?.reduce(
    (a,b)=>
      a+
      Number(b.simpanan_pokok||0)+
      Number(b.simpanan_wajib||0)+
      Number(b.simpanan_sukarela||0)
    ,0
  ) || 0;



  



 /*
==========================
ALOKASI SHU
SAMA DENGAN PORTAL
==========================
*/


// TOTAL TRANSAKSI SELURUH ANGGOTA
const totalTransaksi =
transaksi?.reduce(
(a,b)=>
a + Number(b.total || 0),
0
) || 0;




console.log(
"TOTAL TRANSAKSI SEMUA",
totalTransaksi
);


console.log(
"TOTAL TRANSAKSI ANGGOTA",
totalTransaksiAnggota
);


console.log(
"SELISIH TRANSAKSI",
totalTransaksi-totalTransaksiAnggota
);

// SHU SIMPANAN 50%
const jasaSimpananTotal =
(
totalSHUAnggota *
shuSimpananPersen /
100
);



// SHU JASA 50%
const jasaUsahaTotal =
(
totalSHUAnggota *
shuJasaPersen /
100
);



// ==========================
// DEBUG GLOBAL
// ==========================

console.log(
"JUMLAH DATA TRANSAKSI",
transaksi?.length
);


console.log(
"CONTOH TRANSAKSI",
transaksi?.[0]
);


console.log(
"TOTAL TRANSAKSI KOPERASI",
totalTransaksi
);


console.log(
"TOTAL SIMPANAN KOPERASI",
totalSimpanan
);


console.log(
"SHU SIMPANAN TERSEDIA",
jasaSimpananTotal
);


console.log(
"SHU JASA TERSEDIA",
jasaUsahaTotal
);


// ==========================
// PEMBAGIAN PER ANGGOTA
// ==========================

return anggota?.map((item:any)=>{


const simpananAnggota =
simpanan
?.filter(
(s:any)=>
Number(s.warga_id) === Number(item.id)
)
.reduce(
(a,s)=>
a+
Number(s.simpanan_pokok || 0)+
Number(s.simpanan_wajib || 0)+
Number(s.simpanan_sukarela || 0),
0
)
||0;



const transaksiAnggota =
transaksi
?.filter(
(t:any)=>
Number(t.warga_id) === Number(item.id)
)
.reduce(
(sum:any,t:any)=>
sum + Number(t.total || 0),
0
)
||0;



if(item.id === 235){

console.log(
"=== CEK RAT IQOM ==="
);

console.log(
transaksi?.filter(
(t:any)=>
Number(t.warga_id)===235
)
);


console.log(
"TOTAL TRANSAKSI IQOM",
transaksiAnggota
);

}



// ==========================
// SHU SIMPANAN
// ==========================

const shuSimpanan =
totalSimpanan > 0
?
(
simpananAnggota /
totalSimpanan
)
*
jasaSimpananTotal
:
0;




// ==========================
// SHU JASA
// ==========================

const shuJasa =
totalTransaksiAnggota
?
(transaksiAnggota / totalTransaksiAnggota)
*
jasaUsahaTotal
:
0;



return {

id:item.id,

nama:item.nama,

status:item.status,

simpanan:simpananAnggota,

transaksi:transaksiAnggota,

shu_simpanan:shuSimpanan,

shu_jasa:shuJasa,

shu:
shuSimpanan + shuJasa

};


});

}
export async function simpanSHUAnggota(
  tahun:number,
  data:any[]
){

  console.log(
    "MASUK SIMPAN SHU ANGGOTA"
  );


  console.log(
    "TAHUN:",
    tahun
  );


  console.log(
    "DATA YANG AKAN INSERT:",
    data
  );

console.log(
  "TOTAL SHU SIMPANAN ANGGOTA",
  data.reduce(
    (a:any,b:any)=>
    a + Number(b.shu_simpanan || 0),
    0
  )
);


console.log(
  "TOTAL SHU JASA ANGGOTA",
  data.reduce(
    (a:any,b:any)=>
    a + Number(b.shu_jasa || 0),
    0
  )
);


console.log(
  "TOTAL SHU DITERIMA ANGGOTA",
  data.reduce(
    (a:any,b:any)=>
    a + Number(b.shu || 0),
    0
  )
);
  const insertData = data.map((item:any)=>({

warga_id:item.id,

tahun,

shu_jasa:
Number(item.shu_jasa || 0),

shu_simpanan:
Number(item.shu_simpanan || 0),

shu:
Number(item.shu || 0)

}));


  console.log(
    "HASIL MAP INSERT:",
    insertData
  );



  const {data:hasil,error}=await supabase
  .from("shu_anggota")
  .upsert(
    insertData,
    {
      onConflict:"warga_id,tahun"
    }
  )
  .select();



console.log(
  "HASIL INSERT:",
  hasil
);


console.log(
  "ERROR INSERT:",
  error
);


  if(error)
  throw error;


  return true;

}