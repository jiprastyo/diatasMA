<h1 align="center">Skriner Saham Pribadi</h1>
<p align="center"><em>Dokumentasi istilah, formula, preset, dan hasil backtest terbaru</em></p>

---

## Daftar Isi

1. [Prolog](#prolog)
2. [Tujuan Dokumen](#tujuan-dokumen)
3. [Ruang Lingkup Sistem](#ruang-lingkup-sistem)
4. [Istilah Utama di Aplikasi](#istilah-utama-di-aplikasi)
5. [Penjelasan Kolom dan Filter](#penjelasan-kolom-dan-filter)
6. [Formula Indikator](#formula-indikator)
7. [Formula Skor Setup](#formula-skor-setup)
8. [Preset Strategi Aktif di UI (6 Preset)](#preset-strategi-aktif-di-ui-6-preset)
9. [Preset Arsip (Untuk Compare Internal)](#preset-arsip-untuk-compare-internal)
10. [Kerangka Backtest Long-Only](#kerangka-backtest-long-only)
11. [Hasil Backtest Terbaru](#hasil-backtest-terbaru)
12. [Operasional Data dan Perintah Penting](#operasional-data-dan-perintah-penting)
13. [Keterbatasan Data dan Metode](#keterbatasan-data-dan-metode)
14. [Lampiran Referensi](#lampiran-referensi)
15. [Penutup](#penutup)

---

## Prolog

> Skriner ini dibuat sebagai alat bantu pribadi, bukan sinyal beli/jual otomatis.

Dokumen ini adalah dokumentasi kerja untuk menjaga konsistensi cara baca data, aturan preset, dan evaluasi hasil backtest.

Semua keputusan trading tetap tanggung jawab pengguna.

---

## Tujuan Dokumen

Dokumen ini disusun untuk:

- Menjelaskan istilah yang tampil di aplikasi dalam bahasa praktis.
- Menjelaskan formula indikator dan skor yang dipakai.
- Mendokumentasikan preset aktif terbaru dan hasil backtest terakhir.
- Menjaga jejak metodologi agar update berikutnya tetap konsisten.

---

## Ruang Lingkup Sistem

Sistem saat ini mencakup 3 komponen:

1. **Skriner UI** (card view) untuk shortlist kandidat saham.
2. **Backtest long-only** untuk evaluasi preset dan tuning parameter.
3. **Pipeline data offline** (cache + incremental update) agar rerun cepat dan repeatable.

Ringkasannya:

- Universe utama: data ISSI dengan metadata indeks/sektor/papan.
- Timeframe UI: `1D` dan `1W`.
- Backtest history default: `5y`.
- Data disimpan lokal di `data/` dan cache di `data/offline-cache/` + `data/backtest-cache/`.

---

## Istilah Utama di Aplikasi

### Identitas saham

- **Ticker**: kode emiten, mis. `BBCA`, `BBRI`, `TLKM`.
- **Company**: nama perusahaan.
- **Harga / %Chg**: harga terakhir dan perubahan harian.

```text
%Chg = ((Harga_Terakhir - Harga_Sebelumnya) / Harga_Sebelumnya) x 100%
```

### Klasifikasi emiten (tag)

Urutan tampilan tag di kartu saham:

1. **Indeks** (ISSI/LQ45/KOMPAS100/BUMN)
2. **Sektor**
3. **Papan**

### Timeframe

- `1D`: harian.
- `1W`: mingguan (agregasi dari data harian).

---

## Penjelasan Kolom dan Filter

### 1) PxMA dan VxMA

`PxMA` dan `VxMA` ditampilkan sebagai 7 kotak status:

- **PxMA**: `P3`, `P5`, `P10`, `P20`, `P50`, `P1`, `P2`
  - arti: EMA3, EMA5, EMA10, EMA20, SMA50, SMA100, SMA200
- **VxMA**: `V3`, `V5`, `V10`, `V20`, `V50`, `V1`, `V2`
  - arti: VMA3, VMA5, VMA10, VMA20, VMA50, VMA100, VMA200

### 2) Likuiditas praktis (1% transaksi)

- `1% Trx Hari Ini`
- `1% Trx 20 Hari`

Dipakai untuk menilai kecocokan ukuran transaksi terhadap likuiditas saham.

```text
1%Trx1D = (Volume_Hari_Ini x Harga_Hari_Ini) x 0.01
AvgValue20 = rata-rata(Volume x Harga) 20 hari
1%Trx20D = AvgValue20 x 0.01
```

### 3) Oscillator dan volatilitas

- **MFI**: Oversold / Lemah / Normal / Overbought
- **RSI**: Oversold / Lemah / Sweet / Kuat / Overbought
- **StochRSI**: Oversold / Netral / Overbought
- **ATR**: nilai ATR + ATR% + kategori + estimasi `SL 1.5x`
- **ADR**: ADR% + kategori Lesu/Normal/Aktif
- **MACD**: Bull / Cross / Bear-Netral

### 4) Sort yang tersedia

- Skor, Ticker, Harga, %Chg, 1%Trx1D, 1%Trx20D, **ATR**, RSI, MACD, ADR.

### 5) Ringkas logika filter

- Preset: filter utama.
- Indeks: single select (`all` atau satu indeks).
- Sektor: single select (`all` atau satu sektor).
- PxMA/VxMA: multi-select, logika **AND** antar item terpilih.
- RSI/StochRSI/ATR/ADR: range-based filter sesuai opsi.
- Search: ticker tunggal atau multi ticker (dipisah spasi).

---

## Formula Indikator

### 1) EMA

```text
k = 2 / (p + 1)
EMA_awal = rata-rata p data awal
EMA_baru = Harga_sekarang x k + EMA_sebelumnya x (1 - k)
```

### 2) SMA

```text
SMA = rata-rata p data terakhir
```

### 3) RSI (14)

```text
AvgGain = total kenaikan / 14
AvgLoss = total penurunan / 14
Jika AvgLoss = 0, RSI = 100
RS = AvgGain / AvgLoss
RSI = 100 - (100 / (1 + RS))
```

### 4) StochRSI

```text
StochRSI = ((RSI_terakhir - RSI_min14) / (RSI_max14 - RSI_min14)) x 100
Jika RSI_max14 = RSI_min14, nilai = 50
```

### 5) MFI (14)

```text
TP = (High + Low + Close) / 3
RawMoneyFlow = TP x Volume
PositiveFlow = RawMoneyFlow saat TP > TP_prev
NegativeFlow = RawMoneyFlow saat TP < TP_prev
MoneyRatio = sum(PositiveFlow14) / sum(NegativeFlow14)
MFI = 100 - 100/(1 + MoneyRatio)
Jika NegativeFlow = 0, MFI = 100
```

### 6) MACD (12,26,9)

```text
MACD_Line = EMA12 - EMA26
Signal = EMA9(MACD_Line)
Histogram = MACD_Line - Signal
macdBull = Histogram > 0
macdCross = tanda(Histogram) berubah vs periode sebelumnya
```

### 7) ATR (14)

```text
TR = max(High-Low, abs(High-Close_prev), abs(Low-Close_prev))
ATR14 = rata-rata 14 TR terakhir
ATR_pct = (ATR / Harga) x 100
```

### 8) ADR (14)

```text
ADR_nom = rata-rata(High-Low) 14 hari
ADR_pct = rata-rata((High-Low)/Low) 14 hari x 100
```

### 9) Estimasi SL ATR di UI

```text
SL_est = Harga - (1.5 x ATR)
```

### 10) Fraksi harga IDX (tick size)

- `<200`: tick 1
- `200 sampai <500`: tick 2
- `500 sampai <2000`: tick 5
- `2000 sampai <5000`: tick 10
- `>=5000`: tick 25

```text
Harga_Fraksi_Bawah = floor(Harga / tick) x tick
```

---

## Formula Skor Setup

Skor setup = komposit `0 sampai 10`.

```text
Skor = Poin_MA + Poin_RSI + Poin_MACD + Poin_Volume
```

Komponen:

- **MA**: +1 untuk tiap kondisi harga di atas EMA3/5/10/20 dan SMA50/100/200 (maks 7)
- **RSI**:
  - 50-70: +1.5
  - >70-80: +0.5
  - >=40-<50: +0.5
- **MACD Bull**: +1
- **Volume > VMA20**: +0.5

Label praktis:

- `>=8`: kuat
- `>=6 dan <8`: bagus
- `<6`: pantau/lemah

---

## Preset Strategi Aktif di UI (6 Preset)

Preset yang tampil di dropdown UI saat ini:

1. `EMA<=2 + StochOS + RSI + MFIOS`
2. `EMA<=2 + StochOS + MFIOS`
3. `EMA<=2 + RSI + MFIOS`
4. `EMA<=2 + StochOS + RSI`
5. `EMA<=2 + StochOS`
6. `EMA<=2 + RSI50-70`

Karakter umum rule baru:

- Basis tren: `EMA short bullish` (EMA3, EMA5, EMA10, EMA20 aktif)
- Jarak harga ke EMA short terdekat: `<= 2%`
- Mayoritas entry mode yang performanya lebih baik: **buy close - 2 tick**

Catatan implementasi UI:

- Note preset menjelaskan aturan entry ringkas per preset.
- Ticker di kartu bisa diklik untuk buka halaman simbol di Stockbit.

---

## Preset Arsip (Untuk Compare Internal)

Preset lama tidak tampil di dropdown utama, tapi tetap tersedia untuk compare/backtest internal, misalnya:

- `Trend Kuat`
- `Siap Breakout`
- `Momentum`
- `Akumulasi Vol`
- `Jenuh Jual`
- `Golden Cross`
- varian `EMA short near`, `pullback breakout`, dan varian MFI lama lainnya

Tujuan arsip:

- menjaga kebersihan UI (fokus ke preset terbaik aktif)
- tetap bisa rerun jika dibutuhkan pembanding

---

## Kerangka Backtest Long-Only

Konfigurasi inti yang dipakai pada run terbaru:

- Mode: **long-only**
- Universe: 956 ticker diminta, 938 berhasil diproses
- History: 5 tahun
- Modal acuan: IDR 200.000.000
- Risk per trade: 0.5%
- Minimum RR: 3R
- Biaya broker:
  - Buy 0.18%
  - Sell 0.28%
- Biaya bursa + slippage juga diperhitungkan di engine

Entry/exit:

- Entry bisa `next_day_open`, `same_day_close`, atau `same_day_close_minus_2_tick` (preset-specific).
- Exit intraday berbasis high-low harian.
- Prioritas same-bar: `sl-first`.

Update terbaru:

- Rerun top strategy sudah diuji juga dengan varian **SL = 1.5 x ATR** untuk preset terkait.

---

## Hasil Backtest Terbaru

Sumber:

- `data/strategy-comparison-latest.md`
- Generated: **2026-02-19T10:57:47.279Z** (setara **19 Feb 2026 17:57 WIB**)
- Universe processed: **938/956**

> Catatan penting: run terbaru bersifat **partial rerun** untuk preset tertentu lalu digabung dengan hasil sebelumnya (`mergedWithPreviousSummary = true`).

### Top performa terbaru (rank by Profit Factor)

| Rank | Strategy | Entry | Trades | Win Rate % | Expectancy % | Profit Factor | Max DD % |
|---:|---|---|---:|---:|---:|---:|---:|
| 1 | EMA <=2% + Stoch OS + RSI50-70 + MFI OS (Close-2Tick) | same_day_close_minus_2_tick | 58 | 60.34 | 5.8671 | 4.1158 | 29.89 |
| 2 | EMA <=2% + Stoch OS + MFI OS (Close-2Tick) | same_day_close_minus_2_tick | 378 | 48.41 | 3.6341 | 2.3835 | 51.72 |
| 3 | EMA <=2% + RSI50-70 + MFI OS (Close-2Tick) | same_day_close_minus_2_tick | 657 | 45.36 | 2.7880 | 2.1372 | 86.75 |
| 4 | EMA Short <=2% + Stoch RSI Oversold + RSI50-70 (Buy Close-2Tick) | same_day_close_minus_2_tick | 5175 | 46.03 | 3.0219 | 1.7536 | 99.99 |
| 5 | EMA Short <=2% + Stoch RSI Oversold (Buy Close-2Tick) | same_day_close_minus_2_tick | 9333 | 44.86 | 2.8137 | 1.7113 | 100.00 |
| 6 | EMA Short <=2% + RSI50-70 (Buy Close-2Tick) | same_day_close_minus_2_tick | 25567 | 43.70 | 2.4240 | 1.6399 | 100.00 |

Interpretasi cepat:

- Entry `close-2tick` konsisten mengungguli varian `buy close` pada set rule yang sama.
- Kombinasi EMA short + Stoch OS + RSI range + MFI OS saat ini paling kuat secara PF pada data run terbaru.
- Drawdown tetap tinggi pada banyak preset dengan jumlah trade besar, sehingga risk management tetap wajib ketat.

---

## Operasional Data dan Perintah Penting

### Update data

```bash
npm run fetch
```

### Workflow bulanan yang direkomendasikan

```bash
npm run backtest:refresh
```

(`backtest:refresh` = update data incremental dulu, lalu run backtest)

### Backtest manual

```bash
npm run backtest:presets
```

### Tuning preset (SL / hold / liquidity) lalu rerun

```bash
npm run tune:presets
```

### Output utama

- Summary: `data/backtest-presets-long-only.summary.json`
- Comparison table: `data/strategy-comparison-latest.md`
- Tuning report: `data/backtest-presets-tuning-report.json`
- Offline cache: `data/offline-cache/`
- Backtest cache: `data/backtest-cache/`

---

## Keterbatasan Data dan Metode

- Sumber data pasar menggunakan feed pihak ketiga (bukan feed resmi exchange untuk eksekusi real-time).
- Keterlambatan/ketidaklengkapan data tetap mungkin terjadi.
- Backtest berbasis candle OHLC; urutan intraday detail tidak tersedia.
- `sameBarExitPriority = sl-first` adalah asumsi konservatif model.
- Hasil backtest adalah alat evaluasi rule, bukan jaminan performa ke depan.

---

## Lampiran Referensi

### Referensi resmi IDX

- Papan pencatatan: <https://www.idx.id/id/produk/saham/papan-pencatatan/>
- Klasifikasi IDX-IC: <https://www.idx.id/id/berita/artikel/pengenalan-klasifikasi-industri-idx-ic-indonesia-stock-exchange-industrial-classification/>
- Produk indeks: <https://www.idx.id/id/produk/indeks/>
- Fraksi harga (Peraturan II-A): <https://www.idx.id/media/15715/sk-kep-00071-bei_112023-perubahan-peraturan-nomor-ii-a-tentang-perdagangan-efek-bersifat-ekuitas.pdf>

### Referensi konsep teknikal

- CAN SLIM ringkasan: <https://www.investopedia.com/terms/c/canslim.asp>
- Elder Impulse: <https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-types/elder-impulse-system>
- Golden Cross: <https://chartschool.stockcharts.com/table-of-contents/trading-strategies-and-models/trading-strategies/moving-average-trading-strategies/trading-using-the-golden-cross>
- RSI: <https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/RSI>
- StochRSI: <https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/stochrsi>

---

## Penutup

README ini adalah dokumen kerja yang hidup.

Setiap kali preset aktif berubah, indikator ditambah/diubah, atau run backtest baru selesai, bagian terkait di dokumen ini perlu diperbarui agar tetap selaras dengan implementasi aktual.
