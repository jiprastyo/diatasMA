// fetch_data.js — dijalankan oleh GitHub Actions
// Mengambil data ISSI dari Yahoo Finance dan menyimpan ke data/issi_data.json

import fetch from 'node-fetch';
import { writeFileSync, mkdirSync } from 'fs';

const TICKERS = ["AADI","AALI","ABMM","ACES","ACST","ADCP","ADES","ADHI","ADMG","ADMR","ADRO","AGAR","AGII","AIMS","AISA","AKKU","AKPI","AKRA","AKSI","ALDO","ALKA","AMAN","AMFG","AMIN","ANDI","ANJT","ANTM","APII","APLI","APLN","ARCI","AREA","ARGO","ARII","ARNA","ARTA","ASGR","ASHA","ASII","ASLC","ASLI","ASPI","ASRI","ASSA","ATAP","ATIC","ATLA","AUTO","AVIA","AWAN","AXIO","AYAM","AYLS","BABY","BAIK","BANK","BAPI","BATA","BATR","BAUT","BAYU","BBRM","BBSS","BCIP","BDKR","BEEF","BELI","BELL","BESS","BEST","BIKE","BINO","BIPP","BIRD","BISI","BKDP","BKSL","BLES","BLOG","BLTA","BLTZ","BLUE","BMHS","BMSR","BMTR","BNBR","BOAT","BOBA","BOGA","BOLA","BOLT","BRAM","BRIS","BRMS","BRNA","BRPT","BRRC","BSBK","BSDE","BSML","BSSR","BTPS","BUAH","BUKK","BULL","BUMI","BUVA","BYAN","CAKK","CAMP","CANI","CARE","CASS","CBDK","CBPE","CBRE","CCSI","CEKA","CGAS","CHEK","CHEM","CINT","CITA","CITY","CLEO","CLPI","CMNP","CMPP","CMRY","CNKO","CNMA","COAL","CPIN","CPRO","CRAB","CRSN","CSAP","CSIS","CSMI","CSRA","CTBN","CTRA","CYBR","DAAZ","DADA","DATA","DAYA","DCII","DEFI","DEPO","DEWA","DEWI","DGIK","DGNS","DGWG","DILD","DIVA","DKFT","DKHH","DMAS","DMMX","DMND","DOOH","DOSS","DRMA","DSFI","DSNG","DSSA","DUTI","DVLA","DWGL","DYAN","EAST","ECII","EDGE","EKAD","ELIT","ELPI","ELSA","ELTY","EMDE","ENAK","ENRG","EPAC","EPMT","ERAA","ERAL","ESIP","ESSA","ESTA","EXCL","FAST","FASW","FILM","FIRE","FISH","FITT","FMII","FOLK","FOOD","FORE","FPNI","FUTR","FWCT","GDST","GDYR","GEMA","GEMS","GGRP","GHON","GIAA","GJTL","GLVA","GMTD","GOLD","GOLF","GOOD","GPRA","GPSO","GRIA","GRPH","GTBO","GTRA","GTSI","GULA","GUNA","GWSA","GZCO","HADE","HAIS","HALO","HATM","HDIT","HEAL","HERO","HEXA","HGII","HITS","HOKI","HOMI","HOPE","HRME","HRUM","HUMI","HYGN","IATA","IBST","ICBP","ICON","IDPR","IFII","IFSH","IGAR","IIKP","IKAI","IKAN","IKBI","IKPM","IMPC","INCI","INCO","INDF","INDR","INDS","INDX","INDY","INET","INKP","INPP","INTD","INTP","IOTF","IPCC","IPCM","IPOL","IPTV","IRRA","IRSX","ISAT","ISSP","ITMA","ITMG","JAST","JATI","JAWA","JAYA","JECC","JGLE","JIHD","JKON","JMAS","JPFA","JRPT","JSMR","JSPT","JTPE","KAQI","KARW","KBAG","KBLI","KBLM","KDSI","KDTN","KEEN","KEJU","KETR","KIAS","KICI","KIJA","KINO","KIOS","KJEN","KKES","KKGI","KLAS","KLBF","KMDS","KOBX","KOCI","KOIN","KOKA","KONI","KOPI","KOTA","KPIG","KREN","KRYA","KSIX","KUAS","LABA","LABS","LAJU","LAND","LCKM","LION","LIVE","LMPI","LMSH","LPCK","LPIN","LPKR","LPLI","LPPF","LRNA","LSIP","LTLS","LUCK","MAHA","MAIN","MAPA","MAPB","MAPI","MARK","MAXI","MBAP","MBMA","MBTO","MCAS","MCOL","MDIY","MDKA","MDKI","MDLA","MEDC","MEDS","MERI","MERK","META","MFMI","MGNA","MHKI","MICE","MIDI","MIKA","MINA","MINE","MIRA","MITI","MKAP","MKPI","MKTR","MLIA","MLPL","MLPT","MMIX","MMLP","MNCN","MORA","MPIX","MPMX","MPOW","MPPA","MPRO","MRAT","MSIN","MSJA","MSKY","MSTI","MTDL","MTEL","MTFN","MTLA","MTMH","MTPS","MTSM","MUTU","MYOH","MYOR","NAIK","NASA","NASI","NCKL","NELY","NEST","NETV","NFCX","NICE","NICL","NIKL","NPGF","NRCA","NTBK","NZIA","OASA","OBAT","OBMD","OILS","OKAS","OMED","OMRE","PADA","PALM","PAMG","PANI","PANR","PART","PBID","PBSA","PCAR","PDES","PDPP","PEHA","PEVE","PGAS","PGEO","PGLI","PGUN","PICO","PIPA","PJAA","PJHB","PKPK","PLIN","PMJS","PMUI","PNBS","PNGO","PNSE","POLI","POLU","PORT","POWR","PPRE","PPRI","PPRO","PRAY","PRDA","PRIM","PSAB","PSAT","PSDN","PSGO","PSKT","PSSI","PTBA","PTIS","PTMP","PTMR","PTPP","PTPS","PTPW","PTSN","PTSP","PURA","PURI","PWON","PZZA","RAAM","RAFI","RAJA","RALS","RANC","RATU","RBMS","RDTX","RGAS","RIGS","RISE","RMKE","RMKO","ROCK","RODA","RONY","ROTI","RSGK","RUIS","SAFE","SAGE","SAME","SAMF","SAPX","SATU","SBMA","SCCO","SCNP","SCPI","SEMA","SGER","SGRO","SHID","SHIP","SICO","SIDO","SILO","SIMP","SIPD","SKBM","SKLT","SKRN","SLIS","SMAR","SMBR","SMCB","SMDM","SMDR","SMGA","SMGR","SMIL","SMKL","SMLE","SMMT","SMRA","SMSM","SNLK","SOCI","SOHO","SOLA","SONA","SOSS","SOTS","SPMA","SPTO","SRTG","SSIA","SSTM","STAA","STTP","SULI","SUNI","SUPR","SURI","SWID","TALF","TAMA","TAMU","TAPG","TARA","TAXI","TBMS","TCID","TCPI","TEBE","TFAS","TFCO","TGKA","TGUK","TINS","TIRA","TIRT","TKIM","TLDN","TLKM","TMAS","TMPO","TNCA","TOBA","TOOL","TOSK","TOTL","TOTO","TPIA","TPMA","TRIS","TRJA","TRON","TRST","TRUE","TRUK","TSPC","TYRE","UANG","UCID","UFOE","ULTJ","UNIC","UNIQ","UNTR","UNVR","UVCR","VAST","VERN","VICI","VISI","VKTR","VOKS","WAPO","WEGE","WEHA","WINR","WINS","WIRG","WMUU","WOOD","WOWS","WTON","YELO","YPAS","YUPI","ZATA","ZONE","ZYRX"];

// ─── MATH HELPERS ────────────────────────────────────────────
function calcEMA(arr, p) {
  if (!arr || arr.length < p) return null;
  const k = 2 / (p + 1);
  let v = arr.slice(0, p).reduce((a, b) => a + b, 0) / p;
  for (let i = p; i < arr.length; i++) v = arr[i] * k + v * (1 - k);
  return v;
}
function calcSMA(arr, p) {
  if (!arr || arr.length < p) return null;
  return arr.slice(-p).reduce((a, b) => a + b, 0) / p;
}
function calcRSI(arr) {
  if (!arr || arr.length < 15) return null;
  const s = arr.slice(-15); let g = 0, l = 0;
  for (let i = 1; i < s.length; i++) { const d = s[i] - s[i-1]; if (d > 0) g += d; else l -= d; }
  const ag = g/14, al = l/14;
  if (al === 0) return 100;
  return 100 - 100 / (1 + ag / al);
}
function calcStochRSI(arr, rp=14, sp=14) {
  if (!arr || arr.length < rp + sp + 5) return null;
  const ra = [];
  for (let i = rp+1; i <= arr.length; i++) {
    const s = arr.slice(0, i).slice(-15); let g = 0, l = 0;
    for (let j = 1; j < s.length; j++) { const d = s[j]-s[j-1]; if(d>0)g+=d; else l-=d; }
    const ag=g/14, al=l/14;
    ra.push(al===0 ? 100 : 100 - 100/(1 + ag/al));
  }
  if (ra.length < sp) return null;
  const rec = ra.slice(-sp), mn = Math.min(...rec), mx = Math.max(...rec);
  if (mx === mn) return 50;
  return ((ra[ra.length-1] - mn) / (mx - mn)) * 100;
}
function calcATR(rows, p=14) {
  if (!rows || rows.length < p+1) return null;
  const trs = [];
  for (let i = 1; i < rows.length; i++) {
    trs.push(Math.max(rows[i].h-rows[i].l, Math.abs(rows[i].h-rows[i-1].c), Math.abs(rows[i].l-rows[i-1].c)));
  }
  return trs.length >= p ? trs.slice(-p).reduce((a,b)=>a+b,0)/p : null;
}
function calcADR(rows, p=14) {
  if (!rows || rows.length < p) return null;
  const r = rows.slice(-p);
  const avgHL = r.reduce((a,b) => a + (b.h - b.l), 0) / p;
  const avgPct = r.reduce((a,b) => a + (b.h - b.l) / b.l, 0) / p * 100;
  return { nom: avgHL, pct: avgPct };
}

// ─── FETCH ONE TICKER ────────────────────────────────────────
async function fetchOne(ticker) {
  const sym = ticker + '.JK';
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=1y`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=1y`,
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(12000)
      });
      if (!res.ok) continue;
      const j = await res.json();
      const r = j?.chart?.result?.[0];
      if (!r) continue;

      const meta = r.meta || {};
      const raw = r.indicators?.quote?.[0] || {};
      const ts = r.timestamp || [];

      // Build aligned valid rows
      const rows = [];
      for (let i = 0; i < ts.length; i++) {
        const c = raw.close?.[i], h = raw.high?.[i], l = raw.low?.[i], v = raw.volume?.[i];
        if (c!=null&&h!=null&&l!=null&&v!=null&&!isNaN(c)&&!isNaN(h)&&!isNaN(l)&&c>0&&h>0&&l>0)
          rows.push({ c, h, l, v });
      }
      if (rows.length < 20) continue;

      const closes = rows.map(x => x.c);
      const vols   = rows.map(x => x.v);
      const last   = closes.at(-1);
      const prev   = closes.at(-2) ?? last;
      const pct    = ((last - prev) / prev) * 100;

      const e3=calcEMA(closes,3), e5=calcEMA(closes,5), e10=calcEMA(closes,10), e20=calcEMA(closes,20);
      const s50=calcSMA(closes,50), s100=calcSMA(closes,100), s200=calcSMA(closes,200);
      const rsiV=calcRSI(closes), srsiV=calcStochRSI(closes);
      const atr=calcATR(rows,14);
      const adrRes=calcADR(rows,14);

      const lastVol  = vols.at(-1) ?? 0;
      const lastValue = lastVol * last;
      const vma3  = calcSMA(vols, 3);
      const vma5  = calcSMA(vols, 5);
      const vma20 = calcSMA(vols, 20);
      const vma50 = calcSMA(vols, 50);
      const avg20Value  = (vma20 ?? lastVol) * last;
      const pct1avg20   = avg20Value * 0.01;
      const pct1today   = lastValue * 0.01;

      const ms = {
        ema3:  e3  !== null && last > e3,
        ema5:  e5  !== null && last > e5,
        ema10: e10 !== null && last > e10,
        ema20: e20 !== null && last > e20,
        sma50: s50 !== null && last > s50,
        sma100:s100!==null && last > s100,
        sma200:s200!==null && last > s200,
        vma3:  vma3  !== null && lastVol > vma3,
        vma5:  vma5  !== null && lastVol > vma5,
        vma20: vma20 !== null && lastVol > vma20,
        vma50: vma50 !== null && lastVol > vma50,
      };
      const above4 = ms.ema3 && ms.ema5 && ms.ema10 && ms.ema20;
      let bull=0, bear=0;
      ['ema3','ema5','ema10','ema20','sma50','sma100','sma200'].forEach(k=>{
        if(ms[k]===true)bull++; else bear++;
      });
      if(rsiV!==null){if(rsiV>50)bull++;else bear++;}
      if(srsiV!==null){if(srsiV>50)bull++;else bear++;}

      const company = (meta.longName||meta.shortName||'').replace(/\s*\([^)]*\)\s*/g,'').trim() || ticker;

      return {
        ticker, company, price: last, pct,
        e3, e5, e10, e20, s50, s100, s200,
        maStatus: ms, above4,
        rsi: rsiV, stochRsi: srsiV, atr,
        adrPct: adrRes?.pct ?? null, adrNom: adrRes?.nom ?? null,
        lastVol, vma3, vma5, vma20, vma50,
        lastValue, avg20Value, pct1avg20, pct1today,
        bull, bear
      };
    } catch (e) {
      // try next url
    }
  }
  return null;
}

// ─── BATCH FETCH ─────────────────────────────────────────────
async function fetchAll() {
  const BATCH = 8;
  const results = [];
  let ok = 0, fail = 0;

  console.log(`Memulai fetch ${TICKERS.length} saham ISSI...`);
  
  for (let i = 0; i < TICKERS.length; i += BATCH) {
    const chunk = TICKERS.slice(i, i + BATCH);
    const res = await Promise.allSettled(chunk.map(t => fetchOne(t)));
    res.forEach((r, idx) => {
      if (r.status === 'fulfilled' && r.value) {
        results.push(r.value);
        ok++;
      } else {
        fail++;
        console.warn(`  GAGAL: ${chunk[idx]}`);
      }
    });
    process.stdout.write(`\r  ${i+BATCH}/${TICKERS.length} diproses — ok: ${ok}, gagal: ${fail}`);
    // Delay kecil untuk hindari rate-limit
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\nSelesai: ${ok} berhasil, ${fail} gagal`);
  return results;
}

// ─── MAIN ────────────────────────────────────────────────────
(async () => {
  const data = await fetchAll();
  
  mkdirSync('data', { recursive: true });
  
  const output = {
    fetchedAt: new Date().toISOString(),
    fetchedAtWIB: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    count: data.length,
    data
  };
  
  writeFileSync('data/issi_data.json', JSON.stringify(output, null, 2));
  console.log(`Data disimpan ke data/issi_data.json (${(JSON.stringify(output).length/1024).toFixed(0)} KB)`);
})();
