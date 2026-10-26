import Layout from "../components/Layout";
import { getBackupData } from "../services/backup";
import * as XLSX from "xlsx";


export default function Backup(){


async function downloadBackup(){


try{


const data = await getBackupData();



const workbook = XLSX.utils.book_new();



XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(data.warga),
"Warga"
);



XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(data.transaksi),
"Transaksi"
);



XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(data.pembelian),
"Pembelian BBM"
);



XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(data.pengeluaran),
"Pengeluaran"
);



XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(data.simpanan),
"Simpanan"
);



XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(data.rat),
"RAT"
);



XLSX.writeFile(
workbook,
"Backup_KDMP_Bukit_Jaya.xlsx"
);



alert(
"Backup berhasil dibuat"
);



}catch(error){


console.error(error);


alert(
"Gagal membuat backup"
);


}


}



return (

<Layout>


<div className="
p-8
rounded-3xl
bg-white/5
border
border-white/10
">


<h1 className="
text-3xl
font-black
text-white
mb-5
">

💾 Backup Data KDMP

</h1>



<p className="
text-gray-300
mb-8
">

Download seluruh data koperasi dalam format Excel.

</p>



<button

onClick={downloadBackup}

className="
px-8
py-3
rounded-xl

bg-gradient-to-r
from-red-600
to-purple-600

text-white
font-bold

"

>

⬇️ Download Backup Excel

</button>



</div>


</Layout>

);

}