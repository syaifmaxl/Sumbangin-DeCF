# Platform Donasi Terdesentralisasi di Avalanche

![Avalanche Logo](https://img.shields.io/badge/Blockchain-Avalanche-E84142?style=for-the-badge&logo=avalanche)
![Solidity Logo](https://img.shields.io/badge/Language-Solidity-363636?style=for-the-badge&logo=solidity)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

Proyek ini adalah implementasi *smart contract* sederhana untuk sebuah platform donasi DeCF (Desentralized CrowdFunding) yang dibangun di atas blockchain **Avalanche (AVAX)**. Sistem ini memungkinkan siapa saja untuk membuat kampanye penggalangan dana, dan siapa pun dapat berdonasi ke kampanye tersebut menggunakan token AVAX.

---

## Konsep Utama

Proyek ini menggunakan pola desain **"Factory"**. Artinya, ada satu kontrak utama (`CampaignFactory`) yang bertugas untuk membuat dan melacak semua instance dari kontrak kampanye lainnya (`Campaign`).

1.  **`CampaignFactory`** : Kontrak ini berfungsi sebagai titik masuk utama. Pengguna berinteraksi dengan kontrak ini untuk membuat kampanye donasi baru. Setiap kampanye yang dibuat akan dicatat alamatnya dalam sebuah *array*.
2.  **`Campaign`** : Setiap kali seseorang membuat kampanye baru melalui `CampaignFactory`, sebuah kontrak `Campaign` baru akan di-*deploy*. Kontrak inilah yang akan menyimpan semua detail spesifik tentang satu kampanye (judul, deskripsi, pencipta) dan juga akan menerima serta mengelola dana donasi.



---

## Struktur Smart Contract

Proyek ini terdiri dari dua *smart contract* utama:

### 1. `CampaignFactory.sol`

Kontrak ini adalah pusat dari platform.
* **Fungsi Utama:**
    * `createCampaign(string memory _judul, string memory _deskripsi)`: Fungsi publik yang memungkinkan siapa saja untuk membuat kampanye baru. Fungsi ini akan men-*deploy* kontrak `Campaign` baru dan menyimpan alamatnya.
    * `getAllCampaigns()`: Fungsi *view* untuk mendapatkan daftar semua alamat kontrak kampanye yang pernah dibuat.

### 2. `Campaign.sol`

Kontrak ini merepresentasikan satu kampanye donasi.
* **State Variables :**
    * `creator`: Alamat wallet yang membuat kampanye. Hanya alamat ini yang bisa menarik dana.
    * `judul`: Judul dari kampanye donasi.
    * `deskripsi`: Penjelasan detail mengenai kampanye.
    * `totalDonasi`: Melacak total donasi yang masuk (nilai ini hanya untuk catatan, saldo riil ada di `address(this).balance`).

* **Fungsi Utama :**
    * `constructor()`: Dijalankan sekali saat kontrak `Campaign` dibuat oleh `CampaignFactory`. Mengatur `creator`, `judul`, dan `deskripsi`.
    * `receive() external payable`: Fungsi khusus yang secara otomatis dieksekusi ketika kontrak ini menerima transfer AVAX. Inilah mekanisme utama donasi. Setiap AVAX yang dikirim ke alamat kontrak ini akan diterima dan ditambahkan ke saldo kontrak.
    * `getBalance()`: Fungsi *view* untuk melihat saldo AVAX saat ini yang tersimpan di dalam kontrak.
    * `tarikDana(address payable _to)`: Fungsi yang hanya bisa dipanggil oleh `creator` kampanye untuk menarik seluruh dana yang terkumpul ke alamat wallet yang dituju.

---

## Alur Kerja Penggunaan

Berikut adalah alur penggunaan platform dari awal hingga akhir:

1.  **Membuat Kampanye**
    * Seorang pengguna memanggil fungsi `createCampaign()` pada kontrak `CampaignFactory`.
    * Pengguna menyertakan `judul` dan `deskripsi` untuk kampanyenya.
    * `CampaignFactory` men-*deploy* sebuah kontrak `Campaign` baru dan alamat kontrak baru ini disimpan.

2.  **Mencari Kampanye**
    * Untuk melihat semua kampanye yang tersedia, aplikasi (atau pengguna) dapat memanggil `getAllCampaigns()` pada `CampaignFactory` untuk mendapatkan daftar alamat semua kampanye.

3.  **Memberi Donasi**
    * Seorang donatur memilih sebuah kampanye dari daftar.
    * Donatur mengirimkan sejumlah **AVAX** langsung ke **alamat kontrak `Campaign`** yang dipilih.
    * Transaksi ini akan memicu fungsi `receive()` pada kontrak `Campaign`, dan saldo kontrak akan bertambah.

4.  **Menarik Dana**
    * Setelah dana dirasa cukup atau periode kampanye berakhir, **pembuat kampanye (`creator`)** memanggil fungsi `tarikDana()` pada kontrak `Campaign`-nya.
    * Seluruh saldo AVAX yang ada di dalam kontrak akan ditransfer ke alamat wallet yang ditentukan oleh `creator`.

---

## Catatan Keamanan & Disclaimer

⚠️ **PENTING** : Kode ini dibuat untuk tujuan demonstrasi dan edukasi. Kode ini **belum melalui proses audit keamanan profesional**. Terdapat beberapa pertimbangan keamanan dasar seperti:

* **Otorisasi Penarikan**: Penarikan dana dibatasi hanya untuk `creator` kampanye melalui `require(msg.sender == creator)`.
* **Risiko**: Tanpa mekanisme tambahan (seperti batas waktu atau target donasi), dana akan selamanya tersimpan di kontrak jika `creator` kehilangan akses ke *private key*-nya.

Gunakan dengan risiko Anda sendiri. Jangan menggunakan kode ini di *mainnet* dengan dana sungguhan tanpa audit keamanan terlebih dahulu.

---

## Potensi Pengembangan di Masa Depan

Proyek ini dapat dikembangkan lebih lanjut dengan menambahkan fitur-fitur berikut:
* **Target Donasi**: Menambahkan batas minimal dana yang harus terkumpul.
* **Batas Waktu**: Memberikan durasi untuk setiap kampanye.
* **Mekanisme Refund**: Jika target tidak tercapai dalam batas waktu, donatur bisa menarik kembali dananya.
* **Struktur Data yang Lebih Baik**: Menambahkan lebih banyak detail pada kampanye seperti gambar, kategori, dll.
* **Integrasi dengan Frontend**: Membangun antarmuka web (dApp) menggunakan React/Vue dan Ethers.js/Web3.js untuk interaksi yang lebih mudah.

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.