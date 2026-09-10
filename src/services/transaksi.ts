
import { supabase } from "../lib/supabase";

import {
  simpanTransaksiOffline,
  ambilSemuaTransaksiOffline,
  hapusTransaksiOffline,
  tambahQueueOffline,
} from "./offline_db";

// =====================================================
// TIPE DATA TRANSAKSI OFFLINE
// =====================================================

type TransaksiOffline = {
  id: number;
  warga_id: number;
  periode_id: number;
  jenis_bbm_id: number;
  tanggal: string;
  liter: number;
  harga: number;
  total: number;
};

// =====================================================
// AMBIL SEMUA TRANSAKSI
// ONLINE  : ambil dari Supabase + simpan ke IndexedDB
// OFFLINE : ambil dari IndexedDB
// =====================================================

export async function getTransaksi() {
  try {
    const { data, error } = await supabase
      .from("transaksi")
      .select(`
        *,
        warga (
          id,
          nama
        ),
        periode (
          id,
          nama_periode
        ),
        jenis_bbm (
          id,
          nama,
          harga
        )
      `)
      .order("tanggal", { ascending: false });

    if (error) throw error;

    // Simpan transaksi ke IndexedDB
    for (const item of data ?? []) {
      await simpanTransaksiOffline({
        id: Number(item.id),
        warga_id: Number(item.warga_id),
        periode_id: Number(item.periode_id),
        jenis_bbm_id: Number(item.jenis_bbm_id),
        tanggal: item.tanggal,
        liter: Number(item.liter),
        harga: Number(item.harga),
        total: Number(item.total),
      });
    }

    return data;
  } catch (error) {
    console.warn(
      "Gagal mengambil transaksi dari Supabase. Menggunakan data offline.",
      error
    );

    const transaksiOffline =
      await ambilSemuaTransaksiOffline();

    if (transaksiOffline.length === 0) {
      throw new Error(
        "Data transaksi belum tersedia secara offline. Buka aplikasi saat online terlebih dahulu."
      );
    }

    // Ambil data pendukung dari IndexedDB
    const { ambilSemuaWargaOffline } = await import(
      "./offline_db"
    );

    const { ambilSemuaPeriodeOffline } = await import(
      "./offline_db"
    );

    const { ambilSemuaJenisBBMOffline } = await import(
      "./offline_db"
    );

    const warga = await ambilSemuaWargaOffline();
    const periode = await ambilSemuaPeriodeOffline();
    const jenisBBM = await ambilSemuaJenisBBMOffline();

    const hasil = transaksiOffline.map(
      (transaksi: TransaksiOffline) => {
        const wargaData = warga.find(
          (item) => Number(item.id) === transaksi.warga_id
        );

        const periodeData = periode.find(
          (item) => Number(item.id) === transaksi.periode_id
        );

        const jenisBBMData = jenisBBM.find(
          (item) => Number(item.id) === transaksi.jenis_bbm_id
        );

        return {
          ...transaksi,
          warga: wargaData
            ? {
                id: wargaData.id,
                nama: wargaData.nama,
              }
            : null,
          periode: periodeData
            ? {
                id: periodeData.id,
                nama_periode: periodeData.nama_periode,
              }
            : null,
          jenis_bbm: jenisBBMData
            ? {
                id: jenisBBMData.id,
                nama: jenisBBMData.nama,
                harga: jenisBBMData.harga,
              }
            : null,
        };
      }
    );

    return hasil.sort(
      (a, b) =>
        new Date(b.tanggal).getTime() -
        new Date(a.tanggal).getTime()
    );
  }
}

// =====================================================
// CEK TRANSAKSI WARGA
// CEK SUPABASE + CEK DATA LOKAL
// =====================================================

export async function cekTransaksiWarga(
  warga_id: number,
  periode_id: number
) {
  try {
    const { data, error } = await supabase
      .from("transaksi")
      .select("id")
      .eq("warga_id", warga_id)
      .eq("periode_id", periode_id)
      .limit(1);

    if (error) throw error;

    if ((data?.length ?? 0) > 0) {
      return true;
    }
  } catch (error) {
    console.warn(
      "Tidak dapat mengecek transaksi di Supabase. Mengecek data lokal.",
      error
    );
  }

  // Cek transaksi yang tersimpan di IndexedDB
  const transaksiOffline =
    await ambilSemuaTransaksiOffline();

  return transaksiOffline.some(
    (item) =>
      Number(item.warga_id) === Number(warga_id) &&
      Number(item.periode_id) === Number(periode_id)
  );
}

// =====================================================
// AMBIL HARGA BBM
// ONLINE : Supabase
// OFFLINE: IndexedDB
// =====================================================

async function ambilHargaBBM(
  jenis_bbm_id: number
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("jenis_bbm")
      .select("harga")
      .eq("id", jenis_bbm_id)
      .single();

    if (error) throw error;

    return Number(data.harga);
  } catch (error) {
    console.warn(
      "Gagal mengambil harga BBM dari Supabase. Menggunakan data offline.",
      error
    );

    const { ambilSemuaJenisBBMOffline } =
      await import("./offline_db");

    const jenisBBM =
      await ambilSemuaJenisBBMOffline();

    const bbm = jenisBBM.find(
      (item) =>
        Number(item.id) === Number(jenis_bbm_id)
    );

    if (!bbm) {
      throw new Error(
        "Data harga BBM belum tersedia secara offline. Buka aplikasi saat online terlebih dahulu."
      );
    }

    return Number(bbm.harga);
  }
}

// =====================================================
// BUAT ID SEMENTARA UNTUK TRANSAKSI OFFLINE
// ID NEGATIF = TRANSAKSI BELUM ADA DI SUPABASE
// =====================================================

function buatIdOffline(): number {
  return -Date.now();
}

// =====================================================
// TAMBAH TRANSAKSI
// ONLINE  : langsung Supabase
// OFFLINE : IndexedDB + queue
// =====================================================

export async function addTransaksi(
  warga_id: number,
  periode_id: number,
  jenis_bbm_id: number,
  tanggal: string,
  liter: number
) {
  // =====================================================
  // CEK DUPLIKAT
  // =====================================================

  const sudahAda = await cekTransaksiWarga(
    warga_id,
    periode_id
  );

  if (sudahAda) {
    throw new Error(
      "Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
    );
  }

  // =====================================================
  // AMBIL HARGA
  // =====================================================

  const harga = await ambilHargaBBM(jenis_bbm_id);
  const total = harga * liter;

  // =====================================================
  // COBA SIMPAN KE SUPABASE
  // =====================================================

  try {
    const { error } = await supabase
      .from("transaksi")
      .insert([
        {
          warga_id,
          periode_id,
          jenis_bbm_id,
          tanggal,
          liter,
          harga,
          total,
        },
      ]);

    if (error) {
      // Database menolak duplikat
      if (error.code === "23505") {
        throw new Error(
          "Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
        );
      }

      throw error;
    }

    return;
  } catch (error) {
    // Jangan masukkan error duplikat ke queue
    if (
      error instanceof Error &&
      error.message.includes(
        "sudah melakukan pengambilan"
      )
    ) {
      throw error;
    }

    // ===================================================
    // OFFLINE
    // ===================================================

    console.warn(
      "Gagal menyimpan ke Supabase. Menyimpan transaksi secara offline."
    );

    const transaksiOffline: TransaksiOffline = {
      id: buatIdOffline(),
      warga_id,
      periode_id,
      jenis_bbm_id,
      tanggal,
      liter,
      harga,
      total,
    };

    // Simpan transaksi
    await simpanTransaksiOffline(
      transaksiOffline
    );

    // Masukkan ke antrean sinkronisasi
    await tambahQueueOffline({
      action: "add",
      transaksi: transaksiOffline,
      created_at: new Date().toISOString(),
    });
  }
}

// =====================================================
// UPDATE TRANSAKSI
// ONLINE  : Supabase
// OFFLINE : IndexedDB + queue
// =====================================================

export async function updateTransaksi(
  id: number,
  warga_id: number,
  periode_id: number,
  jenis_bbm_id: number,
  tanggal: string,
  liter: number
) {
  // =====================================================
  // AMBIL HARGA
  // =====================================================

  const harga = await ambilHargaBBM(jenis_bbm_id);
  const total = harga * liter;

  const transaksiBaru: TransaksiOffline = {
    id,
    warga_id,
    periode_id,
    jenis_bbm_id,
    tanggal,
    liter,
    harga,
    total,
  };

  // =====================================================
  // TRANSAKSI OFFLINE YANG BELUM DISINKRON
  // =====================================================

  if (id < 0) {
    await simpanTransaksiOffline(
      transaksiBaru
    );

    await tambahQueueOffline({
      action: "update",
      transaksi: transaksiBaru,
      created_at: new Date().toISOString(),
    });

    return;
  }

  // =====================================================
  // COBA UPDATE ONLINE
  // =====================================================

  try {
    const { error } = await supabase
      .from("transaksi")
      .update({
        warga_id,
        periode_id,
        jenis_bbm_id,
        tanggal,
        liter,
        harga,
        total,
      })
      .eq("id", id);

    if (error) throw error;

    // Perbarui cache lokal
    await simpanTransaksiOffline(
      transaksiBaru
    );

    return;
  } catch (error) {
    console.warn(
      "Gagal update ke Supabase. Menyimpan perubahan secara offline.",
      error
    );

    // Simpan perubahan ke IndexedDB
    await simpanTransaksiOffline(
      transaksiBaru
    );

    // Masukkan ke queue
    await tambahQueueOffline({
      action: "update",
      transaksi: transaksiBaru,
      created_at: new Date().toISOString(),
    });
  }
}

// =====================================================
// DELETE TRANSAKSI
// ONLINE  : Supabase
// OFFLINE : IndexedDB + queue
// =====================================================

export async function deleteTransaksi(id: number) {
  // =====================================================
  // TRANSAKSI OFFLINE
  // =====================================================

  if (id < 0) {
    await hapusTransaksiOffline(id);

    await tambahQueueOffline({
      action: "delete",
      transaksi: {
        id,
        warga_id: 0,
        periode_id: 0,
        jenis_bbm_id: 0,
        tanggal: "",
        liter: 0,
        harga: 0,
        total: 0,
      },
      created_at: new Date().toISOString(),
    });

    return;
  }

  // =====================================================
  // COBA DELETE ONLINE
  // =====================================================

  try {
    const { error } = await supabase
      .from("transaksi")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Hapus dari cache lokal
    await hapusTransaksiOffline(id);

    return;
  } catch (error) {
    console.warn(
      "Gagal delete dari Supabase. Menandai transaksi untuk dihapus saat online.",
      error
    );

    // Hapus dari tampilan/cache lokal
    await hapusTransaksiOffline(id);

    // Masukkan ke queue
    await tambahQueueOffline({
      action: "delete",
      transaksi: {
        id,
        warga_id: 0,
        periode_id: 0,
        jenis_bbm_id: 0,
        tanggal: "",
        liter: 0,
        harga: 0,
        total: 0,
      },
      created_at: new Date().toISOString(),
    });
  }
}

// =====================================================
// REKAP TOTAL LITER PER PERIODE
// =====================================================

export async function getRekapLiterPeriode() {
  try {
    const { data, error } = await supabase
      .from("transaksi")
      .select("periode_id, liter");

    if (error) throw error;

    const rekap: Record<number, number> = {};

    (data ?? []).forEach((item) => {
      const periodeId = Number(item.periode_id);
      const liter = Number(item.liter) || 0;

      rekap[periodeId] =
        (rekap[periodeId] || 0) + liter;
    });

    return rekap;
  } catch (error) {
    console.warn(
      "Gagal mengambil rekap dari Supabase. Menggunakan data offline.",
      error
    );

    const transaksiOffline =
      await ambilSemuaTransaksiOffline();

    const rekap: Record<number, number> = {};

    transaksiOffline.forEach((item) => {
      const periodeId = Number(item.periode_id);
      const liter = Number(item.liter) || 0;

      rekap[periodeId] =
        (rekap[periodeId] || 0) + liter;
    });

    return rekap;
  }
}
