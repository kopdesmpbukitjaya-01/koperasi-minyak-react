
import { supabase } from "../lib/supabase";

import {
  ambilQueueOffline,
  hapusQueueOffline,
  simpanTransaksiOffline,
  hapusTransaksiOffline,
} from "./offline_db";

// =====================================================
// SINKRONISASI TRANSAKSI OFFLINE
// =====================================================

export async function syncTransaksiOffline() {
  // Jangan melakukan sync kalau memang offline
  if (!navigator.onLine) {
    return;
  }

  const queue = await ambilQueueOffline();

  if (queue.length === 0) {
    return;
  }

  console.log(
    `Memulai sinkronisasi ${queue.length} transaksi offline...`
  );

  // ===================================================
  // PROSES SESUAI URUTAN QUEUE
  // ===================================================

  for (const item of queue) {
    try {
      const transaksi = item.transaksi;

      // =================================================
      // TAMBAH
      // =================================================

      if (item.action === "add") {
        const { data, error } = await supabase
          .from("transaksi")
          .insert([
            {
              warga_id: transaksi.warga_id,
              periode_id: transaksi.periode_id,
              jenis_bbm_id: transaksi.jenis_bbm_id,
              tanggal: transaksi.tanggal,
              liter: transaksi.liter,
              harga: transaksi.harga,
              total: transaksi.total,
            },
          ])
          .select()
          .single();

        if (error) {
          // Jika ternyata sudah ada di server,
          // jangan terus mencoba transaksi yang sama.
          if (error.code === "23505") {
            console.warn(
              "Transaksi sudah ada di server:",
              transaksi
            );

            await hapusTransaksiOffline(
              transaksi.id
            );

            await hapusQueueOffline(
              item.queue_id!
            );

            continue;
          }

          throw error;
        }

        // Hapus transaksi sementara
        await hapusTransaksiOffline(
          transaksi.id
        );

        // Simpan dengan ID Supabase yang asli
        await simpanTransaksiOffline({
          id: Number(data.id),
          warga_id: Number(data.warga_id),
          periode_id: Number(data.periode_id),
          jenis_bbm_id: Number(data.jenis_bbm_id),
          tanggal: data.tanggal,
          liter: Number(data.liter),
          harga: Number(data.harga),
          total: Number(data.total),
        });
      }

      // =================================================
      // UPDATE
      // =================================================

      if (item.action === "update") {
        // Update hanya berlaku untuk ID server.
        if (transaksi.id < 0) {
          console.warn(
            "Update transaksi dengan ID offline belum dapat disinkronkan:",
            transaksi.id
          );

          continue;
        }

        const { error } = await supabase
          .from("transaksi")
          .update({
            warga_id: transaksi.warga_id,
            periode_id: transaksi.periode_id,
            jenis_bbm_id: transaksi.jenis_bbm_id,
            tanggal: transaksi.tanggal,
            liter: transaksi.liter,
            harga: transaksi.harga,
            total: transaksi.total,
          })
          .eq("id", transaksi.id);

        if (error) {
          throw error;
        }

        // Cache lokal sudah berisi data terbaru
        await simpanTransaksiOffline(
          transaksi
        );
      }

      // =================================================
      // DELETE
      // =================================================

      if (item.action === "delete") {
        // Transaksi offline yang belum pernah masuk
        // Supabase cukup dihapus dari queue.
        if (transaksi.id >= 0) {
          const { error } = await supabase
            .from("transaksi")
            .delete()
            .eq("id", transaksi.id);

          if (error) {
            throw error;
          }
        }

        await hapusTransaksiOffline(
          transaksi.id
        );
      }

      // =================================================
      // QUEUE BERHASIL → HAPUS
      // =================================================

      await hapusQueueOffline(
        item.queue_id!
      );

      console.log(
        "Sinkronisasi berhasil:",
        item.action,
        transaksi.id
      );
    } catch (error) {
      console.error(
        "Gagal sinkronisasi transaksi:",
        item,
        error
      );

      // Jangan hapus queue.
      // Akan dicoba lagi ketika internet kembali.

      break;
    }
  }

  console.log("Sinkronisasi transaksi selesai.");
}

// =====================================================
// SINKRONISASI SAAT INTERNET KEMBALI
// =====================================================

export function mulaiSyncOtomatis() {
  // Saat aplikasi pertama kali dibuka
  if (navigator.onLine) {
    syncTransaksiOffline();
  }

  // Saat koneksi kembali online
  window.addEventListener("online", () => {
    console.log(
      "Internet kembali. Memulai sinkronisasi..."
    );

    syncTransaksiOffline();
  });
}

