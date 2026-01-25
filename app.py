import streamlit as st
import yfinance as yf
import pandas as pd
import pandas_ta as ta

# --- 1. Konfigurasi Tampilan Mobile ---
st.set_page_config(page_title="Pro MA Screener", layout="wide")

mobile_css = """
    <style>
    #MainMenu, footer, header {visibility: hidden;}
    .block-container {
        padding-top: 0.5rem !important;
        padding-bottom: 2rem !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }
    html, body, [class*="css"], .stDataFrame {
        font-family: 'Roboto', sans-serif;
        font-size: 14px !important;
    }
    /* Mempercantik Expander Filter */
    .streamlit-expanderHeader {
        background-color: #f0f2f6;
        border-radius: 5px;
    }
    </style>
"""
st.markdown(mobile_css, unsafe_allow_html=True)

# --- 2. Data Saham & Syariah (Database Mini) ---
# Tips: Tambahkan emiten favorit Anda ke sini
daftar_saham = [
    "BBCA.JK", "BBRI.JK", "BMRI.JK", "BBNI.JK", "TLKM.JK", "ASII.JK", 
    "UNTR.JK", "ICBP.JK", "ADRO.JK", "PTBA.JK", "PGAS.JK", "ANTM.JK", 
    "BRIS.JK", "ACES.JK", "SIDO.JK", "GOTO.JK", "MDKA.JK", "INKP.JK",
    "CPIN.JK", "KLBF.JK", "SMGR.JK", "INCO.JK", "TINS.JK", "MEDC.JK",
    "AMRT.JK", "JPFA.JK", "EXCL.JK", "ISAT.JK", "LSIP.JK", "AALI.JK"
]

# Database Syariah Manual (Contoh)
saham_syariah = [
    "TLKM.JK", "ASII.JK", "UNTR.JK", "ICBP.JK", "ADRO.JK", "PTBA.JK", 
    "PGAS.JK", "ANTM.JK", "BRIS.JK", "ACES.JK", "SIDO.JK", "GOTO.JK",
    "MDKA.JK", "INKP.JK", "CPIN.JK", "KLBF.JK", "SMGR.JK", "INCO.JK",
    "TINS.JK", "MEDC.JK", "AMRT.JK", "JPFA.JK", "EXCL.JK", "ISAT.JK",
    "LSIP.JK", "AALI.JK"
]

# --- 3. UI: FILTER SECTION (Expander) ---
st.write("### 🔍 IHSG Custom MA Screener")

with st.expander("⚙️ ATUR FILTER DI SINI", expanded=True):
    # Filter A: Kondisi MA
    st.caption("Tentukan Posisi Harga Relatif terhadap MA:")
    col_ma1, col_ma2 = st.columns(2)
    
    with col_ma1:
        # User memilih MA yang harus di-break (Harga > MA)
        bullish_ma = st.multiselect(
            "Harga DI ATAS (Support):",
            options=["MA3", "MA5", "MA10", "MA20", "MA50", "MA100", "MA200"],
            default=["MA5", "MA20"], # Default: Trend Pendek Naik
            help="Saham yang harganya LEBIH TINGGI dari garis MA ini."
        )
        
    with col_ma2:
        # User memilih MA yang masih menjadi atap (Harga < MA)
        bearish_ma = st.multiselect(
            "Harga DI BAWAH (Resist):",
            options=["MA3", "MA5", "MA10", "MA20", "MA50", "MA100", "MA200"],
            default=[], # Default kosong (tidak wajib)
            help="Saham yang harganya LEBIH RENDAH dari garis MA ini."
        )

    st.markdown("---")
    
    # Filter B: Transaksi & Syariah
    col_f1, col_f2 = st.columns(2)
    with col_f1:
        min_tx = st.number_input("Min. Transaksi (Miliar)", value=5, step=1)
    with col_f2:
        # Pilihan Syariah: All, Only Syariah, Non-Syariah
        status_syariah = st.radio("Kategori Saham:", ["Semua", "Syariah Only", "Non-Syariah"])

    run_btn = st.button("Jalankan Screener 🚀", use_container_width=True)

# --- 4. Logic Screener ---
@st.cache_data(ttl=300)
def analyze_market(tickers):
    data_results = []
    
    # Progress Bar UI
    p_bar = st.progress(0)
    status_text = st.empty()
    
    for i, ticker in enumerate(tickers):
        try:
            # Download Data (Cukup 1.5 tahun untuk MA200 aman)
            df = yf.download(ticker, period="18mo", interval="1d", progress=False)
            
            if df.empty or len(df) < 200: continue
            
            # --- Hitung Indikator ---
            close = df['Close']
            last_price = close.iloc[-1]
            
            # Dictionary untuk menyimpan nilai MA
            ma_vals = {}
            periods = [3, 5, 10, 20, 50, 100, 200]
            
            for p in periods:
                ma_vals[f"MA{p}"] = ta.sma(close, length=p).iloc[-1]
            
            # Indikator Tambahan
            rsi = ta.rsi(close, length=14).iloc[-1]
            
            high = df['High']
            low = df['Low']
            atr = ta.atr(high, low, close, length=14).iloc[-1]
            adr_pct = (((high - low) / low) * 100).rolling(14).mean().iloc[-1]
            
            vol = df['Volume'].iloc[-1]
            val_m = (last_price * vol) / 1_000_000_000
            
            # Cek Status Syariah
            is_sya = ticker in saham_syariah
            
            # Simpan data mentah
            row = {
                "Ticker": ticker.replace(".JK", ""),
                "Price": last_price,
                "Val_M": val_m,
                "Is_Syariah": is_sya,
                "RSI": rsi,
                "ADR%": adr_pct,
                "ATR": atr
            }
            # Masukkan nilai MA ke row juga untuk debug/display jika perlu
            row.update(ma_vals)
            
            data_results.append(row)
            
        except Exception:
            continue
            
        # Update progress bar pelan-pelan
        if i % 5 == 0:
            p_bar.progress((i + 1) / len(tickers))
            status_text.text(f"Scanning {ticker}...")
            
    p_bar.empty()
    status_text.empty()
    return pd.DataFrame(data_results)

# --- 5. Eksekusi & Filtering ---
if run_btn:
    df = analyze_market(daftar_saham)
    
    if not df.empty:
        # --- TAHAP 1: FILTER SYARIAH ---
        if status_syariah == "Syariah Only":
            df = df[df['Is_Syariah'] == True]
        elif status_syariah == "Non-Syariah":
            df = df[df['Is_Syariah'] == False]
            
        # --- TAHAP 2: FILTER TRANSAKSI ---
        df = df[df['Val_M'] >= min_tx]
        
        # --- TAHAP 3: FILTER RELATIVE MA (Core Logic) ---
        # Logika: Loop semua MA yang dipilih user, cek kondisinya
        
        # Cek Bullish (Harga > MA)
        for ma_col in bullish_ma:
            df = df[df['Price'] > df[ma_col]]
            
        # Cek Bearish (Harga < MA)
        for ma_col in bearish_ma:
            df = df[df['Price'] < df[ma_col]]
            
        # --- TAHAP 4: DISPLAY HASIL ---
        if not df.empty:
            st.success(f"Ditemukan {len(df)} saham sesuai kriteria!")
            
            # Format Kolom untuk Tampilan Mobile
            display_cols = ["Ticker", "Price", "RSI", "ADR%", "Val_M"]
            
            # Styling Tabel
            st.dataframe(
                df[display_cols].style.format({
                    "Price": "{:,.0f}",
                    "RSI": "{:.0f}",
                    "ADR%": "{:.1f}%",
                    "Val_M": "{:.1f} M"
                }).background_gradient(subset=['RSI'], cmap='Blues'),
                use_container_width=True,
                hide_index=True
            )
            
            # Tampilkan Detail MA (Opsional, di bawah tabel)
            with st.expander("📊 Lihat Detail Angka MA"):
                st.dataframe(df[["Ticker"] + bullish_ma + bearish_ma].style.format("{:,.0f}"), hide_index=True)
                
        else:
            st.warning("Tidak ada saham yang cocok dengan kombinasi filter ini.")
    else:
        st.error("Gagal mengambil data. Cek koneksi internet.")
else:
    st.info("Tekan tombol **Jalankan Screener** di atas untuk mulai.")
