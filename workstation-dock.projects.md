# Project: Workstation Dock (Tauri + Vue)

## 1. Project Overview
Aplikasi *desktop* produktivitas yang bertindak sebagai "Command Center" dan pengelola *workspace*. Dibangun menggunakan arsitektur Tauri (Rust + Vue.js/TypeScript). Aplikasi berjalan sebagai *daemon* (System Tray) dan dapat dipanggil kapan saja sebagai *floating panel* layaknya Spotlight/Raycast, serta memiliki antarmuka utama (Dashboard) untuk manajemen *workspace*.

## 2. Tech Stack & Requirements
- **Frontend:** Vue 3 (Composition API), TypeScript, Vite, Tailwind CSS (untuk *styling* UI modern/transparan).
- **Backend:** Rust (Tauri Core API).
- **Database:** SQLite (melalui `tauri-plugin-sql`) untuk manajemen relasional *workspace* dan metadata.
- **Storage Strategy (Hybrid):** Konfigurasi dan *link shortcut* di SQLite. Catatan (Notes) disimpan sebagai file `.md` *native* di OS (`~/.nook/`).
- **System API:** `tauri-plugin-global-shortcut` (untuk pemanggilan panel), `tauri-plugin-shell` (untuk eksekusi *path* lokal dan *browser*).

## 3. Core Features & Enhancements
1. **Workspace Manager:**
   - Direktori virtual untuk mengelompokkan *resource*.
2. **Smart Shortcuts:**
   - Mendukung tipe: URL Web, Direktori Folder Lokal, dan Eksekusi File/Aplikasi.
   - Fitur Web: Dapat mendefinisikan *custom browser* (misal: secara spesifik membuka link proyek di Brave, dan link hiburan di Edge).
3. **Markdown Notes Integration:**
   - Setiap *workspace* memiliki satu atau lebih dokumen Markdown.
   - Mendukung sintaks *GitHub Flavored Markdown*.
   - *Enhancement:* Auto-save ke sistem file lokal.
4. **Dock Toggle:**
   - Pemanggilan *floating search/command bar* via *shortcut* global.

## 4. Development Workflow & Branching Strategy

Agen AI harus mematuhi alur kerja *branching* berikut dalam implementasi fitur:

### `init/core-setup`
- Inisialisasi Tauri + Vue + Tailwind.
- Konfigurasi jendela ganda (`main` dan `floating`) di `tauri.conf.json`.
- Konfigurasi System Tray dan *intercept* tombol 'Close' (berjalan di *background*).

### `feature/database-layer`
- Instalasi `tauri-plugin-sql` dan inisialisasi SQLite lokal.
- Pembuatan skema relasional: tabel `workspaces` dan tabel `shortcuts` (termasuk *field* `browser_path`).
- Pembuatan direktori fisik `~/.nook/notes/` via Rust `fs` module.

### `feature/workspace-crud`
- Pembuatan UI antarmuka utama (Vue).
- Implementasi fungsionalitas CRUD untuk Workspace.
- Pembuatan komponen *routing* internal antar *workspace*.

### `feature/shortcut-execution`
- UI untuk menambah/mengedit *shortcut* dengan selektor tipe (Web/Folder/File).
- **Backend Bridge:** Fungsi Rust untuk mengeksekusi *path* menggunakan `tauri::api::process::Command`.
- Implementasi logika pemilihan eksekusi *custom browser*.

### `feature/markdown-integration`
- Integrasi *library* parser Markdown (seperti `marked` atau editor *WYSIWYG* Vue ringan).
- Fungsi Rust untuk membaca/menulis (`I/O`) file `.md` fisik ke dalam UI Vue saat *workspace* diakses.

### `feature/floating-command-bar`
- Implementasi UI panel transparan.
- Integrasi global *shortcut* (misal: `Alt + W`).
- Implementasi baris pencarian yang memfilter *shortcut* dari database SQLite secara *real-time*.