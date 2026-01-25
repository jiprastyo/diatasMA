import streamlit as st
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import datetime

# --- 1. Konfigurasi Halaman & CSS (Tanpa Hamburger Menu) ---
st.set_page_config(page_title="IHSG MA Screener", layout="wide")

# CSS Khusus:
# - Menyembunyikan Hamburger Menu & Header bawaan Streamlit
# - Menyamaratakan Font (Mobile Friendly)
# - Menghapus padding berlebih
hide_menu_style = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Font Uniformity */
    html, body, [class*="css"]  {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
    }
    
    /* Mengatur tabel agar scrollable di mobile */
    .stDataFrame { width: 100%; }
    </style>
    """
st.markdown(hide_menu_style, unsafe_allow_html=True)

# --- 2. Data Saham & Syariah (Database Mini) ---
# Tips: Untuk data real, Anda bisa update list ini secara berkala
daftar_saham = [
    "BBCA.JK", "BBRI.JK", "BMRI.JK", "BBNI.JK",  # Big Caps Bank
    "TLKM.JK", "ASII.JK", "UNTR.JK", "ICBP.JK",  # Bluechip Lain
    "ADRO.JK", "PTBA.JK", "PGAS.JK", "ANTM.JK",  # Komoditas
    "BRIS.JK", "ACES.JK", "SIDO.JK", "GOTO.JK"   # Campuran
]

# List Saham Syariah (Contoh Manual - update sesuai DES terbaru)
saham_syariah = [
    "TLKM.JK", "ASII.JK", "UNTR.JK", "ICBP.JK", 
    "ADRO.JK", "PTBA.JK", "PGAS.JK", "ANTM.JK", 
    "BRIS.JK", "ACES.JK", "SIDO.JK", "GOTO.JK"
]

# --- 3. Fungsi Utama Screener ---
@st.cache_data(ttl=3600) # Cache data selama 1 jam agar cepat
def run_screener(tickers):
    results = []
    
    # Progress Bar
    progress_bar = st.progress(0)
    total = len(tickers)
    
    for i, ticker in enumerate(tickers):
        try:
            # Download data (1 tahun cukup untuk MA200)
            df = yf.download(ticker, period="2y", interval="1d", progress=False)
            
            # Validasi: Jika data kosong atau kurang dari 200 baris (untuk MA200), skip
            if df.empty or len(df) < 200:
                continue
            
            # --- Perhitungan Indikator ---
            close = df['Close']
            high = df['High']
            low = df['Low']
            
            # 1. Simple Moving Averages (MA)
            mas = [3, 5, 10, 20, 50, 100, 200]
            ma_values = {}
            for period in mas:
                # Menggunakan pandas_ta untuk akurasi
                ma_val = ta.sma(close, length=period).iloc[-1]
                ma_values[f'MA{period}'] = ma_val
            
            # 2. RSI (14)
            rsi = ta.rsi(close, length=14).iloc[-1]
            
            # 3. ATR (14) & ADR (Average Daily Range %)
            atr = ta.atr(high, low, close, length=14).iloc[-1]
            # ADR Rumus: Rata-rata dari ((High-Low)/Low) * 100
            daily_range_pct = ((high - low) / low) * 100
            adr_pct = daily_range_pct.rolling(window=14).mean().iloc[-1]
            
            # 4. Transaksi
            last_close = close.iloc[-1]
            last_vol = df['Volume'].iloc[-1]
            tx_value_milyar = (last_close * last_vol) / 1_000_000_000
            
            # 5. Status Syariah
            is_syariah = "✅ YES" if ticker in saham_syariah else "❌ NO"

            # --- Menyusun Data Row ---
            row = {
                "Ticker": ticker.replace(".JK", ""),
                "Price": last_close,
                "Syariah": is_syariah,
                "Value (M)": tx_value_milyar,
                "RSI": rsi,
                "ATR": atr,
                "ADR %": adr_pct,
            }
            
            # Logika Posisi Harga vs MA (True jika Harga > MA)
            # Kita simpan boolean dulu, nanti diformat warna
            for period in mas:
                row[f'>MA{period}'] = last_close > ma_values[f'MA{period}']
            
            results.append(row)
            
        except Exception as e:
            # Jika error pada satu saham, skip saja jangan stop aplikasi
            continue
        
        # Update progress
        progress_bar.progress((i + 1) / total)

    progress_bar.empty() # Hapus bar setelah selesai
    return pd.DataFrame(results)

# --- 4. Tampilan UI (Tanpa Sidebar) ---
st.title("📈 IHSG Technical Screener")
st.write("Strategi: Price Position Relative to MA (3, 5, 10, 20, 50, 100, 200)")

# Kontrol Filter diletakkan di atas (Expander) agar rapi di Mobile
with st.expander("🔍 Filter Pencarian", expanded=True):
    col1, col2 = st.columns(2)
    with col1:
        min_tx = st.number_input("Min. Transaksi Harian (Miliar Rp)", value=5, step=1)
    with col2:
        filter_syariah = st.checkbox("Hanya Saham Syariah")

if st.button("Jalankan Screener 🚀", use_container_width=True):
    df_result = run_screener(daftar_saham)
    
    if not df_result.empty:
        # Terapkan Filter User
        if filter_syariah:
            df_result = df_result[df_result['Syariah'] == "✅ YES"]
        
        df_result = df_result[df_result['Value (M)'] >= min_tx]
        
        # --- Formatting Tabel ---
        # Kita buat kolom MA menjadi indikator visual
        # Hijau = Harga di atas MA (Bullish), Merah = Harga di bawah MA (Bearish)
        
        def highlight_ma(val):
            color = '#d4edda' if val else '#f8d7da' # Hijau muda vs Merah muda
            text_color = '#155724' if val else '#721c24'
            return f'background-color: {color}; color: {text_color}'

        # Format angka
        format_dict = {
            "Price": "{:,.0f}",
            "Value (M)": "{:.1f} M",
            "RSI": "{:.1f}",
            "ATR": "{:.0f}",
            "ADR %": "{:.2f}%"
        }
        
        # Terapkan style
        styled_df = df_result.style.format(format_dict)\
            .map(highlight_ma, subset=[f'>MA{m}' for m in [3,5,10,20,50,100,200]])\
            .background_gradient(subset=['RSI'], cmap='RdYlGn', vmin=30, vmax=70)

        st.dataframe(styled_df, use_container_width=True, height=600)
        
        st.info(f"Ditemukan {len(df_result)} saham yang sesuai kriteria.")
    else:
        st.warning("Data tidak ditemukan atau koneksi error.")
