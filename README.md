This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# saas-app

## Alur Sistem Pencarian & Filter (Search & Filter Architecture)

Sistem pencarian dan filter berjalan seperti rantai estafet melalui 3 bagian utama:

```
[User Input: Search/Filter] 
        ⬇
[1. URL Query String di Browser] (topic & subject)
        ⬇
[2. Server Page (app/companions/page.tsx)] (baca searchParams)
        ⬇
[3. Server Action (lib/actions/companion.actions.ts)] (query ke database)
        ⬇
[Database Supabase] ➔ [UI Cards Terupdate]
```

### 1. Penulis URL (Frontend Client Components)
Bertugas menangkap input user dan memperbarui URL tanpa reload halaman:
- **`components/SearchInput.tsx`**: Mengisi parameter `topic` saat user mengetik kata kunci materi/pelajaran.
  ```tsx
  // Contoh: ?topic=algebra
  router.push(`...?topic=${searchQuery}`);
  ```
- **`components/SubjectFilter.tsx`**: Mengisi parameter `subject` saat user memilih kategori mata pelajaran.
  ```tsx
  // Contoh: ?subject=math
  router.push(`...?subject=${selectedSubject}`);
  ```
- **Catatan**: Helper seperti `formUrlQuery` dari `@jsmastery/utils` digunakan agar kedua parameter (`subject` & `topic`) bisa digabung tanpa saling menimpa.

---

### 2. Perantara Pembaca URL (Server Component Page)
- **`app/companions/page.tsx`**: Menangkap parameter query dari URL browser via `searchParams`, lalu mengopernya ke fungsi backend:
  ```tsx
  const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : "";
    const topic = filters.topic ? filters.topic : "";

    // Kirim data filter ke Server Action:
    const companions = await getAllCompanions({ subject, topic });
    ...
  }
  ```

---

### 3. Eksekutor Database (Server Action / Backend)
- **`lib/actions/companion.actions.ts` (`getAllCompanions`)**: Memfilter data secara dinamis di database Supabase berdasarkan input yang diterima:
  ```tsx
  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }
  ```

---

## Getting Started
