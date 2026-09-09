const DB_NAME = "kdmp_offline_db";
const DB_VERSION = 1;

const STORE_TRANSAKSI = "transaksi";
const STORE_WARGA = "warga";
const STORE_PERIODE = "periode";
const STORE_JENIS_BBM = "jenis_bbm";
const STORE_QUEUE = "offline_queue";

export type OfflineTransaksi = {
  id: number;
  warga_id: number;
  periode_id: number;
  jenis_bbm_id: number;
  tanggal: string;
  liter: number;
  harga: number;
  total: number;
};

export type OfflineQueueItem = {
  queue_id?: number;
  action: "add" | "update" | "delete";
  transaksi: OfflineTransaksi;
  created_at: string;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_TRANSAKSI)) {
        db.createObjectStore(STORE_TRANSAKSI, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(STORE_WARGA)) {
        db.createObjectStore(STORE_WARGA, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(STORE_PERIODE)) {
        db.createObjectStore(STORE_PERIODE, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(STORE_JENIS_BBM)) {
        db.createObjectStore(STORE_JENIS_BBM, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, {
          keyPath: "queue_id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// =====================================================
// TRANSAKSI
// =====================================================

export async function simpanTransaksiOffline(
  transaksi: OfflineTransaksi
) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_TRANSAKSI,
      "readwrite"
    );

    transaction.objectStore(STORE_TRANSAKSI).put(transaksi);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function ambilSemuaTransaksiOffline(): Promise<
  OfflineTransaksi[]
> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_TRANSAKSI,
      "readonly"
    );

    const request = transaction
      .objectStore(STORE_TRANSAKSI)
      .getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function hapusTransaksiOffline(id: number) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_TRANSAKSI,
      "readwrite"
    );

    transaction.objectStore(STORE_TRANSAKSI).delete(id);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// =====================================================
// QUEUE OFFLINE
// =====================================================

export async function tambahQueueOffline(
  item: OfflineQueueItem
) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_QUEUE,
      "readwrite"
    );

    transaction.objectStore(STORE_QUEUE).add(item);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function ambilQueueOffline(): Promise<
  OfflineQueueItem[]
> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_QUEUE,
      "readonly"
    );

    const request = transaction
      .objectStore(STORE_QUEUE)
      .getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function hapusQueueOffline(
  queue_id: number
) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_QUEUE,
      "readwrite"
    );

    transaction.objectStore(STORE_QUEUE).delete(queue_id);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
// =====================================================
// DATA WARGA
// =====================================================

export async function simpanSemuaWargaOffline(
  warga: any[]
) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_WARGA,
      "readwrite"
    );

    const store = transaction.objectStore(STORE_WARGA);

    warga.forEach((item) => {
      store.put(item);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function ambilSemuaWargaOffline(): Promise<any[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_WARGA,
      "readonly"
    );

    const request = transaction
      .objectStore(STORE_WARGA)
      .getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
// =====================================================
// DATA PERIODE
// =====================================================

export async function simpanSemuaPeriodeOffline(
  periode: any[]
) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_PERIODE,
      "readwrite"
    );

    const store = transaction.objectStore(STORE_PERIODE);

    periode.forEach((item) => {
      store.put(item);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function ambilSemuaPeriodeOffline(): Promise<any[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_PERIODE,
      "readonly"
    );

    const request = transaction
      .objectStore(STORE_PERIODE)
      .getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}