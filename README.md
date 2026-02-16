<u><b>Dokumentasi Non-Teknis Istilah dan Formula Screener Saham</b></u>

Dokumen ini menjelaskan istilah yang dipakai di aplikasi screener, arti indikator teknikal, cara hitung formula yang digunakan sistem, dan penjelasan preset strategi.

<u><b>Pernyataan Pribadi dan Disclaimer</b></u>

- Screener ini saya buat sebagai alat bantu pribadi, bukan rekomendasi pemilihan saham.
- Isi dokumen ini menggambarkan kerangka pikir pribadi saya saat melakukan screening, bukan ajakan agar pengguna mengikuti sistem saya.
- Siapa pun yang memakai output screener ini untuk keputusan investasi atau trading bertanggung jawab penuh atas keputusan dan risikonya sendiri.
- Pengguna perlu memahami bahwa investasi dan trading memiliki risiko nyata, termasuk kemungkinan kehilangan sebagian atau seluruh modal.
- Sumber data utama berasal dari Yahoo Finance (pihak ketiga), bukan feed resmi bursa, sehingga data dapat mengalami keterlambatan, perbedaan penyesuaian, atau ketidaklengkapan.
- Metode pengambilan data memiliki keterbatasan teknis: bergantung pada endpoint publik dan jaringan, ada timeout permintaan, ada kemungkinan sebagian ticker gagal terambil, dan data mingguan dibentuk dari agregasi data harian (bukan feed mingguan native), sehingga hasil bisa berbeda tipis dari platform lain.
- Proses update juga bergantung pada job terjadwal; jika job gagal atau tertunda, data yang tampil bisa belum merefleksikan kondisi pasar terbaru.

<u><b>Tujuan Dokumen</b></u>

- Membantu pengguna non-IT memahami kolom, filter, dan preset di screener.
- Menjelaskan bagaimana angka utama dihitung agar interpretasi data lebih konsisten.
- Menjadi acuan internal tim saat membaca hasil screening.

<u><b>Istilah Utama di Tampilan Aplikasi</b></u>

<b>Ticker</b>

Kode saham emiten (contoh: BBCA, BBRI).

<b>Company</b>

Nama perusahaan emiten.

<b>Harga / Chg</b>

Harga penutupan terakhir dan perubahan harian.

Formula:

`%Chg = ((Harga_Terakhir - Harga_Sebelumnya) / Harga_Sebelumnya) x 100%`

<b>Papan</b>

Klasifikasi papan emiten yang tersedia di filter:

- Utama
- Pengembangan
- Akselerasi
- Ekonomi Baru
- Pemantauan Khusus

<b>Sektor</b>

Kategori sektor yang tersedia di filter:

- Bahan Baku
- Consumer
- Energi
- Industri
- Infrastruktur
- Kesehatan
- Keuangan
- Properti
- Siklikal
- Teknologi
- Transportasi

<b>Indeks</b>

Filter indeks yang tersedia:

- ISSI
- LQ45
- KOMPAS100
- BUMN

<b>Timeframe</b>

- 1D: data harian
- 1W: data mingguan (agregasi data harian)

<u><b>Penjelasan Kolom Tabel</b></u>

<b>MA / Vol</b>

Kolom ini menampilkan status harga dan volume terhadap rata-rata bergerak.

- MA:
  - E3, E5, E10, E20 = EMA 3, 5, 10, 20
  - S50, S1, S2 = SMA 50, 100, 200
- Vol:
  - V3, V5, V10, V20, V50, V1, V2 = VMA 3, 5, 10, 20, 50, 100, 200

Makna praktis:

- Semakin banyak MA aktif, tren harga cenderung lebih kuat.
- Semakin banyak VMA ditembus, aktivitas volume cenderung lebih tinggi.

<b>1% Transaksi 1D</b>

Satu persen dari nilai transaksi hari terakhir.

`1%Trx1D = (Volume_Hari_Ini x Harga_Hari_Ini) x 0.01`

<b>1% Transaksi 20D</b>

Satu persen dari rata-rata nilai transaksi 20 hari terakhir.

`AvgValue20 = rata-rata(Volume x Harga) 20 hari`

`1%Trx20D = AvgValue20 x 0.01`

<b>RSI / StochRSI</b>

- RSI menunjukkan kekuatan momentum harga (0 sampai 100).
- StochRSI menunjukkan posisi RSI saat ini terhadap rentang RSI terbaru (0 sampai 100).

Zona yang dipakai aplikasi:

- RSI:
  - <30: Oversold
  - 30 sampai <50: Lemah
  - 50 sampai 70: Sweet
  - >70 sampai 80: Kuat
  - >80: Overbought
- StochRSI:
  - <20: Oversold
  - 20 sampai 80: Netral
  - >80: Overbought

<b>ATR / ADR</b>

- ATR mengukur volatilitas nominal harian.
- ADR mengukur rata-rata rentang gerak harian.
- Aplikasi mengelompokkan volatilitas menjadi:
  - Lesu: <1.5%
  - Normal: 1.5% sampai <5%
  - Aktif: >=5%

<b>MACD</b>

- MACD Bull: histogram positif
- MACD Bear: histogram negatif
- MACD Cross: tanda histogram berubah dari periode sebelumnya

<b>Skor</b>

Skor setup komposit 0 sampai 10 untuk merangkum kekuatan teknikal.

<u><b>Formula Indikator yang Dipakai Aplikasi</b></u>

<b>EMA</b>

`k = 2 / (p + 1)`

`EMA_awal = rata-rata p data awal`

`EMA_baru = Harga_sekarang x k + EMA_sebelumnya x (1 - k)`

<b>SMA</b>

`SMA = rata-rata p data terakhir`

<b>RSI (14)</b>

Aplikasi memakai 15 data penutupan terakhir untuk menghasilkan RSI 14.

`AvgGain = total kenaikan / 14`

`AvgLoss = total penurunan / 14`

Jika `AvgLoss = 0`, RSI = 100.

Jika tidak:

`RS = AvgGain / AvgLoss`

`RSI = 100 - (100 / (1 + RS))`

<b>StochRSI</b>

`StochRSI = ((RSI_terakhir - RSI_min14) / (RSI_max14 - RSI_min14)) x 100`

Jika `RSI_max14 = RSI_min14`, aplikasi mengembalikan 50.

<b>MACD (12,26,9)</b>

`MACD_Line = EMA12 - EMA26`

`Signal = EMA9(MACD_Line)`

`Histogram = MACD_Line - Signal`

Turunan status:

- `macdBull = Histogram > 0`
- `macdCross = tanda(Histogram) berubah vs periode sebelumnya`

<b>ATR (14)</b>

`TR = max(High-Low, abs(High-Close_prev), abs(Low-Close_prev))`

`ATR14 = rata-rata 14 TR terakhir`

<b>ADR (14)</b>

`ADR_nom = rata-rata(High-Low) 14 hari`

`ADR_pct = rata-rata((High-Low)/Low) 14 hari x 100`

<b>ATR% untuk klasifikasi volatilitas</b>

`ATR_pct = (ATR / Harga) x 100`

<b>Konversi Nilai ke Lot</b>

`Lembar = Nilai_Uang / Harga`

`Lot = floor(Lembar / 100)`

Catatan: 1 lot = 100 lembar.

<b>Fraksi Harga (pembulatan tick)</b>

- Harga <200: tick 1
- 200 sampai <500: tick 2
- 500 sampai <2000: tick 5
- 2000 sampai <5000: tick 10
- >=5000: tick 25

`Harga_Fraksi_Bawah = floor(Harga / tick) x tick`

<b>Estimasi SL pada kolom ATR</b>

`SL = pembulatan fraksi dari (Harga - 2 x ATR)`

<u><b>Formula Skor Setup (0 sampai 10)</b></u>

`Skor = Poin_MA + Poin_RSI + Poin_MACD + Poin_Volume`

Skor dibatasi maksimum 10 dan dibulatkan 1 desimal.

<b>Komponen Poin MA (maks 7)</b>

+1 poin untuk setiap kondisi benar:

- Harga > EMA3
- Harga > EMA5
- Harga > EMA10
- Harga > EMA20
- Harga > SMA50
- Harga > SMA100
- Harga > SMA200

<b>Komponen Poin RSI (maks 1.5)</b>

- RSI 50 sampai 70: +1.5
- RSI >70 sampai 80: +0.5
- RSI >=40 sampai <50: +0.5

<b>Komponen Poin MACD (maks 1)</b>

- Jika `macdBull = true`: +1

<b>Komponen Poin Volume (maks 0.5)</b>

- Jika `Volume > VMA20`: +0.5

<b>Label Skor</b>

- >=8: KUAT
- >=6 sampai <8: BAGUS
- >=4 sampai <6: PANTAU
- <4: LEMAH

<u><b>Logika Filter di Aplikasi</b></u>

- Preset aktif bekerja sebagai filter utama.
- Indeks menggunakan mode AND (saham harus memenuhi semua indeks yang dipilih).
- Papan, sektor, rentang harga, rentang RSI, rentang StochRSI, rentang ATR, rentang ADR menggunakan OR dalam satu grup.
- MA dan VMA memakai AND antar item yang dipilih.
- Min/Max harga manual membatasi harga absolut.

<u><b>Preset Strategi di Aplikasi dan Penjelasan Tambahan</b></u>

<b>1) Trend Kuat</b>

Aturan di aplikasi:

- Minimal 5 dari 7 MA aktif
- EMA20 aktif
- SMA50 aktif
- MACD Bull
- RSI 45 sampai 80

Penjelasan tambahan:

Preset ini sejalan dengan ide <i>trend template</i> ala Minervini, yaitu memilih saham yang sudah menunjukkan struktur uptrend matang (harga di atas MA penting, posisi relatif kuat, dan umumnya dekat area high tahunan). Tujuan utamanya bukan menangkap saham murah, melainkan memilih saham yang sudah terbukti memimpin.

<b>2) Siap Breakout</b>

Aturan di aplikasi:

- EMA3, EMA5, EMA10, EMA20 aktif
- RSI 50 sampai 70
- MACD Bull
- Salah satu dari VMA3 atau VMA5 atau VMA20 aktif

Penjelasan tambahan:

Preset ini mewakili pendekatan breakout berbasis momentum ala O'Neil/CAN SLIM: fokus pada saham pemimpin yang keluar dari basis harga dengan dukungan volume. Dalam praktik umum breakout, kualitas sinyal biasanya lebih baik jika breakout disertai peningkatan volume, entry dekat area pivot, dan disiplin risiko yang ketat.

<b>3) Momentum</b>

Aturan di aplikasi:

- EMA10 aktif
- EMA20 aktif
- RSI 50 sampai 75
- MACD Bull

Penjelasan tambahan:

Preset ini konsisten dengan gagasan Elder Impulse: menggabungkan arah tren dan percepatan momentum. Secara konsep klasik Elder, tren dibaca dari kemiringan EMA dan momentum dari perubahan MACD histogram. Artinya, setup momentum yang baik menuntut keduanya mengarah selaras.

<b>4) Akumulasi Vol</b>

Aturan di aplikasi:

- Minimal 4 dari 7 VMA aktif
- EMA20 aktif

Penjelasan tambahan:

Preset ini menangkap indikasi akumulasi, yaitu saat partisipasi beli meningkat dan volume menguat lebih luas dari rata-rata normal. Dalam literatur stage analysis, fase awal transisi dari dasar ke uptrend sering ditandai oleh aktivitas akumulasi dan volume yang semakin dominan, terutama menjelang breakout yang valid.

<b>5) Jenuh Jual</b>

Aturan di aplikasi:

- RSI <35

Penjelasan tambahan:

Preset ini bersifat kontra-tren jangka pendek (mencari potensi pantulan). Secara teori RSI klasik, area oversold sering berada di bawah 30. Namun pada tren turun kuat, RSI dapat bertahan lama di area lemah, sehingga sinyal oversold perlu konfirmasi tambahan (misalnya support, pembalikan candle, atau perbaikan volume).

<b>6) Golden Cross</b>

Aturan di aplikasi:

- EMA10 aktif
- EMA20 aktif
- Belum di atas SMA200
- MACD Bull
- Ada MACD Cross

Penjelasan tambahan:

Preset ini adalah versi cepat untuk mendeteksi fase transisi bullish awal. Dalam definisi klasik, golden cross biasanya memakai MA pendek (contoh 50) yang menembus MA panjang (contoh 200). Sinyal ini sering dipakai sebagai konfirmasi perubahan rezim tren, tetapi tetap bisa memberikan sinyal palsu saat pasar sideways.

<u><b>Catatan Implementasi Preset</b></u>

- Preset di aplikasi adalah rule-based filter praktis, bukan salinan identik seluruh rule strategi asli.
- Rule dibuat agar cepat dipakai pada alur screening harian.
- Hasil preset tetap perlu validasi chart dan manajemen risiko sebelum keputusan trading.

<u><b>Versi Ringkas untuk User Umum</b></u>

<b>Cara saya membaca cepat tabel</b>

- Saya biasanya melihat <b>Skor</b> lebih dulu: >=8 kandidat paling kuat, 6 sampai <8 tren masih sehat, 4 sampai <6 tahap pantau, <4 belum prioritas.
- Setelah itu saya cek <b>MA / Vol</b>: makin banyak indikator aktif, biasanya tren dan minat pasar makin baik.
- Lalu saya lihat <b>MACD</b> dan <b>RSI</b>: MACD Bull + RSI 50 sampai 70 biasanya menunjukkan momentum lebih seimbang; RSI >80 bisa lanjut naik tetapi risiko pullback juga meningkat.
- Berikutnya saya lihat <b>ATR / ADR</b>: Lesu berarti gerak kecil, Normal berarti gerak wajar, Aktif berarti gerak besar sehingga peluang dan risiko sama-sama meningkat.
- Terakhir saya cocokkan <b>1% Transaksi 1D/20D</b> untuk menilai apakah ukuran modal saya sesuai likuiditas saham.

<b>Kapan saya memakai preset tertentu</b>

- <b>Trend Kuat</b>: saat saya ingin fokus ke saham yang sudah stabil naik.
- <b>Siap Breakout</b>: saat saya mencari kandidat menembus resistance dengan dukungan momentum.
- <b>Momentum</b>: saat saya mencari saham yang sedang lanjut naik, bukan yang baru mulai.
- <b>Akumulasi Vol</b>: saat saya mencari tanda minat beli yang mulai menguat.
- <b>Jenuh Jual</b>: saat saya mencari peluang pantulan jangka pendek.
- <b>Golden Cross</b>: saat saya mencari fase awal perubahan tren naik.

<b>Alur harian sederhana yang biasanya saya pakai</b>

- Saya mulai dari preset sesuai tujuan saya (tren lanjut atau rebound).
- Saya perkecil universe pakai papan, sektor, dan indeks.
- Saya pakai filter harga untuk menyesuaikan tipe saham dan ukuran modal.
- Saya memprioritaskan saham dengan kombinasi skor lebih tinggi, MACD Bull, MA aktif yang konsisten, dan likuiditas cukup (1% transaksi memadai).
- Sebelum eksekusi, saya tetap validasi ulang di chart.

<b>Batasan penting</b>

- Hasil screener adalah daftar kandidat, bukan sinyal beli otomatis.
- Keputusan tetap perlu level entry, stop loss, dan batas risiko per transaksi.
- Jika sinyal teknikal bertentangan, prioritaskan manajemen risiko daripada memaksakan entry.

<u><b>Rujukan Eksternal untuk Penjelasan Preset</b></u>

- Minervini trend template dan kriteria uptrend: [ChartMill](https://www.chartmill.com/documentation/stock-screener/technical-analysis-trading-strategies/496-Mark-Minervini-Trend-Template-A-Step-by-Step-Guide-for-Beginners)
- Prinsip CAN SLIM (ringkasan kerangka O'Neil): [Investopedia CANSLIM](https://www.investopedia.com/terms/c/canslim.asp)
- Konsep buy zone 5% dan disiplin 7%-8% (metodologi IBD): [Investor's Business Daily](https://www.investors.com/how-to-invest/investors-corner/buy-zone-nvidia-stock/)
- Elder Impulse System (EMA + MACD Histogram): [StockCharts ChartSchool](https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-types/elder-impulse-system)
- Stage Analysis (Stage 1 sampai Stage 4): [Investopedia Stage Analysis](https://www.investopedia.com/articles/investing/070715/trading-stage-analysis.asp)
- Golden Cross dan interpretasi crossover MA: [StockCharts Golden Cross](https://chartschool.stockcharts.com/table-of-contents/trading-strategies-and-models/trading-strategies/moving-average-trading-strategies/trading-using-the-golden-cross)
- Konfirmasi breakout dengan volume: [StockCharts PVO](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/percentage-volume-oscillator-pvo)
- RSI dan batas overbought/oversold: [Fidelity RSI](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/RSI)
- StochRSI dan formula: [Fidelity StochRSI](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/stochrsi)

<u><b>Disclaimer</b></u>

Dokumen ini untuk edukasi penggunaan screener. Konten ini bukan rekomendasi beli atau jual efek. Keputusan investasi dan risiko sepenuhnya tanggung jawab pengguna.
