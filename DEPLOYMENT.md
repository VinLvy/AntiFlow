# Panduan Deployment ke Google Cloud Platform (GCP)

Dokumen ini menjelaskan langkah-langkah untuk men-deploy aplikasi (Backend & Frontend) ke Google Cloud Run, mulai dari instalasi tools hingga proses deployment.

## 1. Persiapan & Instalasi (Hanya Pertama Kali)

Sebelum memulai, pastikan anda sudah memiliki akun Google Cloud Platform dengan billing (pembayaran) yang aktif.

### Install Google Cloud SDK (gcloud CLI)
Kita membutuhkan `gcloud` CLI untuk berinteraksi dengan GCP.

**Untuk Windows (menggunakan Winget):**
Buka PowerShell sebagai Administrator dan jalankan:
```powershell
winget install Google.CloudSDK
```

> **PENTING:** Setelah instalasi selesai, tutup semua jendela terminal (VS Code, PowerShell, CMD) dan buka kembali agar perintah `gcloud` terbaca.

### Login & Inisialisasi Project
Setelah terminal dibuka kembali, jalankan:
```bash
gcloud init
```
1. Browser akan terbuka, silakan login dengan akun Google anda.
2. Kembali ke terminal, pilih Project GCP yang ingin digunakan (buat baru jika belum ada).
3. (Opsional) Pilih region/zone default (misalnya: `asia-southeast2` untuk Jakarta).

### Setup Permission Service Account (PENTING)
Deployment menggunakan `--source` membutuhkan Google Cloud Build. Seringkali, *default service account* tidak memiliki izin yang cukup secara default. Jika, anda melihat error `PERMISSION_DENIED` saat deploy, jalankan perintah ini di PowerShell:

```powershell
# Setup variabel (sesuaikan jika nama project berbeda)
$ProjectId = "antiflow-backend"
$ProjectNumber = gcloud projects describe $ProjectId --format="value(projectNumber)"

# 1. Berikan akses Cloud Build Editor
gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:${ProjectNumber}-compute@developer.gserviceaccount.com" --role="roles/cloudbuild.builds.editor"

# 2. Berikan akses Storage Admin (untuk akses source code)
gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:${ProjectNumber}-compute@developer.gserviceaccount.com" --role="roles/storage.admin"
```

---

## 2. Deployment Backend (FastAPI)

Pastikan anda berada di root direktori project `prototype-6` di terminal.

1. Masuk ke folder backend:
   ```powershell
   cd backend
   ```

2. Jalankan perintah deploy:
   ```powershell
   gcloud run deploy antiflow-backend --source . --region asia-southeast2 --allow-unauthenticated
   ```
   
   **Penjelasan Command:**
   - `antiflow-backend`: Nama service di Cloud Run.
   - `--source .`: Menggunakan source code saat ini (Google Cloud akan otomatis mendeteksi `Dockerfile`).
   - `--region asia-southeast2`: Lokasi server (Jakarta).
   - `--allow-unauthenticated`: Membuat API bisa diakses publik (tanpa login Google IAM).

3. Jika sukses, terminal akan menampilkan URL URL Service (contoh: `https://antiflow-backend-xyz-et.a.run.app`). **Salin URL ini** karena akan digunakan di Frontend.

---

## 3. Deployment Frontend (Next.js)

Untuk men-deploy Next.js ke Cloud Run, kita perlu mengoptimalkan build dengan mode `standalone` dan menggunakan Dockerfile.

### Langkah A: Konfigurasi `next.config.ts`
Pastikan file `frontend/next.config.ts` anda memiliki konfigurasi `output: "standalone"`.

Edit `frontend/next.config.ts` menjadi seperti ini:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Wajib untuk deployment Docker/Cloud Run yang efisien
  // ... konfigurasi lainnya
};

export default nextConfig;
```

### Langkah B: Buat `Dockerfile` di folder Frontend
Buat file bernama `Dockerfile` (tanpa ekstensi) di dalam folder `frontend/` dengan isi berikut:

```dockerfile
# Gunakan base image Node.js
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file public dan standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

### Langkah C: Update URL Backend
Sebelum deploy, pastikan URL backend di kode frontend (jika di-hardcode) sudah mengarah ke URL Cloud Run Backend yang didapat dari Langkah 2.
*Disarankan menggunakan Environment Variable (`NEXT_PUBLIC_API_URL`) agar fleksibel.*

### Langkah D: Deploy
Kembali ke terminal:

1. Masuk ke folder frontend:
   ```powershell
   cd ../frontend
   ```
   *(atau cd frontend jika dari root)*

2. Jalankan perintah deploy:
   ```powershell
   gcloud run deploy antiflow-frontend --source . --region asia-southeast2 --allow-unauthenticated
   ```

Setelah selesai, anda akan mendapatkan URL untuk mengakses aplikasi web anda.

---

## Troubleshooting

- **Error "gcloud not recognized"**: Restart komputer atau terminal anda jika baru saja menginstall SDK.
- **Error Deployment**: Buka Console Google Cloud -> Cloud Run, klik tab "Logs" untuk melihat detail error pada service yang gagal.
- **Biaya**: Cloud Run memiliki free tier, namun pastikan mematikan service jika tidak digunakan untuk menghindari tagihan tak terduga jika traffic tinggi.
