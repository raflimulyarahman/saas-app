# Catatan Debugging & Pembelajaran (Troubleshooting Notes)

Dokumen ini berisi rangkuman masalah penting yang pernah terjadi di project ini beserta penyebab dan solusinya agar mudah diingat di masa depan.

---

## 1. Masalah Filter & Search Bar "Nyangkut" / Tidak Smooth (Race Condition URL)

### Gejala (Symptom)

Saat mengganti dropdown filter (`SubjectFilter`) beberapa kali di halaman `/companions`, filter terasa lambat, nyangkut, atau kadang berhenti bekerja sama sekali.

### Penyebab (Root Cause)

Ada **3 kesalahan utama** pada cara pengelolaan state dan URL (`searchParams`):

1. **State Lokal vs URL di `SubjectFilter.tsx` (Dual Source of Truth)**
   - Sebelumnya `SubjectFilter` menyimpan pilihan di `useState(query)` lalu menggunakan `useEffect([subject])` untuk memanggil `router.push()`.
   - Untuk komponen dropdown (Select), memakai `useEffect` tidak diperlukan dan justru berbahaya karena setiap halaman pertama kali dimuat (mount), `useEffect` ikut jalan. Saat URL berubah dari luar, state lokal tidak sinkron dengan URL.

2. **`SearchInput.tsx` Ikut-ikutan Mengubah URL Saat `SubjectFilter` Diklik**
   - Di `SearchInput.tsx`, `useEffect` memiliki dependency `[pathname, router, searchParams, searchQuery]`.
   - Saat kamu memilih _Subject_ di dropdown, URL berubah (contoh: `?subject=math`). Ini membuat objek `searchParams` berubah.
   - Karena `searchParams` berubah, `useEffect` milik `SearchInput` ikut terpicu! Padahal user sama sekali tidak sedang mengetik di kolom search.
   - Setelah 500ms, `SearchInput` memanggil `router.push()` dan menabrak navigasi yang sedang dilakukan oleh `SubjectFilter`.

3. **Lupa `clearTimeout` pada Debounce di `SearchInput.tsx`**
   - `setTimeout` dibuat tanpa fungsi cleanup `return () => clearTimeout(delayDebounceFn)`.
   - Akibatnya, jika ada perubahan berturut-turut dalam waktu kurang dari 500ms, semua timer lama tetap hidup dan menembak `router.push()` secara beruntun.

---

### Solusi (Best Practice)

#### A. Untuk Dropdown / Select (`SubjectFilter.tsx`)

**Jangan pakai `useState` + `useEffect` untuk navigasi URL.**
Langsung baca nilai dari `searchParams`, dan jalankan `router.push()` langsung di dalam event handler `onValueChange`:

```tsx
const SubjectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 1. Single source of truth langsung dari URL
  const currentSubject = searchParams.get("subject") || "all";

  // 2. Eksekusi langsung saat user memilih opsi
  const handleSelect = (val: string | null) => {
    let newUrl = "";
    if (!val || val === "all") {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["subject"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "subject",
        value: val,
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={handleSelect} value={currentSubject}>
      ...
    </Select>
  );
};
```

#### B. Untuk Input Teks dengan Debounce (`SearchInput.tsx`)

1. **Pasang Guard (Penjaga):** Cek `if (searchQuery === query) return;` di baris paling atas `useEffect`. Jadi kalau perubahan `searchParams` berasal dari filter `subject` (sedangkan `topic` tidak berubah), `SearchInput` diam dan tidak ikut-ikutan melakukan `router.push()`.
2. **Selalu Cleanup Timer:** Tambahkan `return () => clearTimeout(delayDebounceFn);` agar timer sebelumnya dibatalkan jika ada ketikan baru.

```tsx
const query = searchParams.get("topic") || "";
const [searchQuery, setSearchQuery] = useState(query);

useEffect(() => {
  // Jangan jalankan router.push jika nilai input sudah sama dengan URL!
  if (searchQuery === query) return;

  const delayDebounceFn = setTimeout(() => {
    // ... logika router.push
  }, 500);

  // Wajib bersihkan timer!
  return () => clearTimeout(delayDebounceFn);
}, [pathname, router, searchParams, searchQuery, query]);
```

---

## 2. Error Supabase RLS: `new row violates row-level security policy`

### Gejala

Gagal melakukan `INSERT` ke tabel `companions` dari Server Action Next.js.

### Penyebab

- Tabel di Supabase mengaktifkan **Row Level Security (RLS)**.
- Aplikasi menggunakan **Clerk** untuk autentikasi, sedangkan Supabase dipanggil menggunakan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key) tanpa sesi login Supabase.
- Database menganggap request berasal dari role `anon` (tamu) yang hanya diberi izin `SELECT` (baca), bukan `INSERT`.

### Solusi

Untuk operasi di **Server Action (`"use server"`)**, pastikan user sudah terautentikasi lewat Clerk (`await auth()`), lalu gunakan **`SUPABASE_SERVICE_ROLE_KEY`** (admin client di `lib/supabase.admin.ts`) yang otomatis melewati (bypass) RLS dengan aman di sisi server.
