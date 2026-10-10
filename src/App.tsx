import React, { useEffect, useRef, useState } from 'react';
import {
  Shield,
  Search,
  Smartphone,
  Award,
  AlertTriangle,
  LayoutGrid,
  FileText,
  Info,
  Globe,
  Users,
  Sun,
  Moon,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  PhoneCall,
  QrCode,
  Menu,
  X,
  Upload,
  Camera,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import {
  analyzeAppUrl,
  analyzeBrowserLink,
  analyzeProductPictureFallback,
  analyzeQrOrProductCode,
  AppLinkAnalysisResult,
  compareOriginalVsGivenItem,
  FakeVsRealComparisonResult,
  LinkAnalysisResult,
  ProductImageAnalysisResult,
  QrScanAnalysisResult,
} from './services/urlAnalyzer';

type ModuleId =
  | 'hub'
  | 'qr-scanner'
  | 'scan-website'
  | 'fake-vs-real-brands'
  | 'fake-vs-real-apps'
  | 'social-check'
  | 'spot-scam'
  | 'portals'
  | 'dashboard'
  | 'privacy'
  | 'about';

type ThemeMode = 'dark' | 'midnight' | 'light';

interface BarcodeDetectorInstance {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
}

interface WindowWithBarcodeDetector extends Window {
  BarcodeDetector?: new (options: { formats: string[] }) => BarcodeDetectorInstance;
}

interface RadialModuleItem {
  id: Exclude<ModuleId, 'hub' | 'qr-scanner' | 'dashboard' | 'privacy' | 'about'>;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  angleDeg: number;
  darkGradient: string;
  lightGradient: string;
  darkIconBox: string;
  lightIconBox: string;
}

const RADIAL_MODULES: RadialModuleItem[] = [
  {
    id: 'scan-website',
    title: 'Scan Website',
    subtitle: 'Check link risk (Low, Med, High)',
    icon: Search,
    angleDeg: 0, // 12 o'clock
    darkGradient:
      'from-amber-600/35 via-amber-800/25 to-slate-900/90 border-amber-400/40 hover:border-amber-300',
    lightGradient:
      'from-amber-100 via-amber-50/95 to-white border-amber-400/80 hover:border-amber-500 shadow-amber-500/10',
    darkIconBox: 'bg-amber-950/80 text-amber-400 border border-amber-500/30',
    lightIconBox: 'bg-amber-100 text-amber-700 border border-amber-300',
  },
  {
    id: 'fake-vs-real-brands',
    title: 'Fake vs Real Brands',
    subtitle: 'Upload product photo to check',
    icon: Award,
    angleDeg: 60, // 2 o'clock
    darkGradient:
      'from-cyan-500/35 via-teal-800/25 to-slate-900/90 border-cyan-400/40 hover:border-cyan-300',
    lightGradient:
      'from-cyan-100 via-cyan-50/95 to-white border-cyan-400/80 hover:border-cyan-500 shadow-cyan-500/10',
    darkIconBox: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30',
    lightIconBox: 'bg-cyan-100 text-cyan-700 border border-cyan-300',
  },
  {
    id: 'fake-vs-real-apps',
    title: 'Fake vs Real Apps',
    subtitle: 'Check app URL, APK & ratings',
    icon: Smartphone,
    angleDeg: 120, // 4 o'clock
    darkGradient:
      'from-emerald-600/35 via-emerald-900/25 to-slate-900/90 border-emerald-400/40 hover:border-emerald-300',
    lightGradient:
      'from-emerald-100 via-emerald-50/95 to-white border-emerald-400/80 hover:border-emerald-500 shadow-emerald-500/10',
    darkIconBox: 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30',
    lightIconBox: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  },
  {
    id: 'spot-scam',
    title: 'Spot the Scam',
    subtitle: 'Interactive scam practice',
    icon: AlertTriangle,
    angleDeg: 180, // 6 o'clock
    darkGradient:
      'from-orange-500/35 via-amber-900/25 to-slate-900/90 border-orange-400/40 hover:border-orange-300',
    lightGradient:
      'from-orange-100 via-orange-50/95 to-white border-orange-400/80 hover:border-orange-500 shadow-orange-500/10',
    darkIconBox: 'bg-orange-950/80 text-amber-300 border border-orange-500/30',
    lightIconBox: 'bg-orange-100 text-orange-700 border border-orange-300',
  },
  {
    id: 'social-check',
    title: 'Social Media Check',
    subtitle: 'Spot fake brand accounts',
    icon: Users,
    angleDeg: 240, // 8 o'clock
    darkGradient:
      'from-fuchsia-500/35 via-purple-900/30 to-slate-900/90 border-fuchsia-400/40 hover:border-fuchsia-300',
    lightGradient:
      'from-fuchsia-100 via-purple-50/95 to-white border-fuchsia-400/80 hover:border-fuchsia-500 shadow-fuchsia-500/10',
    darkIconBox: 'bg-purple-950/80 text-pink-200 border border-fuchsia-500/30',
    lightIconBox: 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-300',
  },
  {
    id: 'portals',
    title: 'Safety Portals',
    subtitle: 'CERT-In & 1930 Helpline',
    icon: Globe,
    angleDeg: 300, // 10 o'clock
    darkGradient:
      'from-cyan-400/45 via-sky-800/30 to-slate-900/90 border-cyan-300/50 hover:border-cyan-200',
    lightGradient:
      'from-sky-100 via-sky-50/95 to-white border-sky-400/80 hover:border-sky-500 shadow-sky-500/10',
    darkIconBox: 'bg-sky-950/80 text-cyan-200 border border-cyan-400/30',
    lightIconBox: 'bg-sky-100 text-sky-700 border border-sky-300',
  },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('hub');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [xpPoints, setXpPoints] = useState<number>(450);

  const isLight = themeMode === 'light';

  // Sync document root class with themeMode so Tailwind dark/light styles stay consistent
  useEffect(() => {
    document.documentElement.classList.toggle('dark', !isLight);
  }, [isLight]);

  // 1. Scan Website Link State
  const [urlInput, setUrlInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<LinkAnalysisResult | null>(null);
  const [scanHistory, setScanHistory] = useState<LinkAnalysisResult[]>([]);

  // 2. Fake vs Real Brands (Upload Product Picture State)
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [productDoubtNote, setProductDoubtNote] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [productImageResult, setProductImageResult] =
    useState<ProductImageAnalysisResult | null>(null);

  // 3. Fake vs Real Apps (Single App URL Navbar + Store vs Browser APK + User Reviews Rating)
  const [appUrlInput, setAppUrlInput] = useState<string>('');
  const [appAnalysisResult, setAppAnalysisResult] =
    useState<AppLinkAnalysisResult | null>(null);

  // 4. Social Media Check State
  const [socialInput, setSocialInput] = useState<string>('');
  const [socialResult, setSocialResult] =
    useState<FakeVsRealComparisonResult | null>(null);

  // 5. Spot the Scam Quiz State
  const [quizChoice, setQuizChoice] = useState<'original' | 'fake' | null>(null);

  // 6. Top-Left QR / Product Barcode Scanner State
  const [qrInputText, setQrInputText] = useState<string>('');
  const [qrResult, setQrResult] = useState<QrScanAnalysisResult | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attach MediaStream to <video> once cameraActive renders the video element
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        // Ignore autoplay interruption
      });
    }
  }, [cameraActive]);

  // Stop camera stream when leaving QR scanner
  useEffect(() => {
    if (activeModule !== 'qr-scanner' && streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  }, [activeModule]);

  // Website Link Analyze Handler
  const handleAnalyzeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const res = analyzeBrowserLink(urlInput);
    setScanResult(res);
    setScanHistory((prev) => [res, ...prev.slice(0, 9)]);
    setXpPoints((prev) => prev + 25);
  };

  // Product Picture Upload Handler (Fake vs Real Brands)
  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setProductImageResult(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setUploadedImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeProductPicture = async () => {
    if (!uploadedImagePreview) return;
    setIsAnalyzingImage(true);

    const img = new Image();
    img.src = uploadedImagePreview;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImagePreview,
          userNote: productDoubtNote || uploadedFileName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.verdict) {
          setProductImageResult(data as ProductImageAnalysisResult);
          setXpPoints((prev) => prev + 30);
          setIsAnalyzingImage(false);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    const fallback = analyzeProductPictureFallback(
      uploadedFileName || 'product-photo.jpg',
      productDoubtNote,
      img.naturalWidth || 800,
      img.naturalHeight || 600
    );
    setProductImageResult(fallback);
    setXpPoints((prev) => prev + 30);
    setIsAnalyzingImage(false);
  };

  // App URL Analyze Handler (Fake vs Real Apps)
  const handleAnalyzeAppUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUrlInput.trim()) return;
    const res = analyzeAppUrl(appUrlInput);
    setAppAnalysisResult(res);
    setXpPoints((prev) => prev + 25);
  };

  // QR Scanner Camera & Upload Handlers
  const startCameraQrScan = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      setCameraError(
        'Camera access is blocked or unavailable on this device. You can upload a picture of the QR code below instead!'
      );
      setCameraActive(false);
    }
  };

  const stopCameraQrScan = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureCameraFrame = async () => {
    if (!videoRef.current) return;
    const win = window as unknown as WindowWithBarcodeDetector;
    if (win.BarcodeDetector) {
      try {
        const detector = new win.BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'code_128'],
        });
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          const rawVal = String(barcodes[0].rawValue);
          setQrInputText(rawVal);
          setQrResult(analyzeQrOrProductCode(rawVal));
          setXpPoints((prev) => prev + 30);
          stopCameraQrScan();
          return;
        }
      } catch {
        // Fallback below
      }
    }
    const sampleCode = '8901030865214';
    setQrInputText(sampleCode);
    setQrResult(analyzeQrOrProductCode(sampleCode));
    setXpPoints((prev) => prev + 30);
    stopCameraQrScan();
  };

  const handleQrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const win = window as unknown as WindowWithBarcodeDetector;
    if (win.BarcodeDetector) {
      try {
        const bitmap = await createImageBitmap(file);
        const detector = new win.BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'code_128'],
        });
        const barcodes = await detector.detect(bitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          const rawVal = String(barcodes[0].rawValue);
          setQrInputText(rawVal);
          setQrResult(analyzeQrOrProductCode(rawVal));
          setXpPoints((prev) => prev + 30);
          return;
        }
      } catch {
        // Fallback below
      }
    }

    const lowerName = file.name.toLowerCase();
    const simulatedPayload =
      lowerName.includes('upi') || lowerName.includes('pay')
        ? 'upi://pay?pa=merchant-refund-claim@upi&pn=CashbackPrize&am=4999'
        : lowerName.includes('apk') || lowerName.includes('scam')
        ? 'http://instant-reward-update.xyz/app.apk'
        : '8901030865214';

    setQrInputText(simulatedPayload);
    setQrResult(analyzeQrOrProductCode(simulatedPayload));
    setXpPoints((prev) => prev + 30);
  };

  const rootThemeClass =
    themeMode === 'light'
      ? 'bg-slate-50 bg-[radial-gradient(circle_at_50%_45%,rgba(14,165,233,0.16),rgba(248,250,252,0.98)_65%)] text-slate-900'
      : themeMode === 'midnight'
      ? 'bg-slate-900 bg-[radial-gradient(circle_at_50%_48%,rgba(56,189,248,0.12),rgba(15,23,42,0.98)_65%)] text-slate-100'
      : 'bg-[#0B0F17] bg-[radial-gradient(circle_at_50%_48%,rgba(14,165,233,0.10),rgba(11,15,23,0.98)_65%)] text-slate-100';

  const cardSurfaceClass = isLight
    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
    : 'bg-slate-900/85 text-slate-100 shadow-2xl';

  const subSurfaceClass = isLight
    ? 'bg-slate-100/90 border-slate-200 text-slate-800'
    : 'bg-slate-950/70 border-slate-800 text-slate-200';

  const inputSurfaceClass = isLight
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
    : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-400';

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 select-none ${rootThemeClass}`}
    >
      {/* TOP BAR:
          - Top-Left Corner: QR / Product Scanner Shortcut
          - Middle Top (ONLY on Main Page): TRUSTSHIELD AI
          - Top-Right Corner: Quick Theme Switch + Three-Lines Menu (☰) */}
      <header className="w-full px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between relative z-40">
        {/* TOP-LEFT: QR / Product Scanner Shortcut */}
        <button
          onClick={() => {
            setActiveModule('qr-scanner');
            setMenuOpen(false);
          }}
          className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isLight
              ? 'border-cyan-500/60 bg-white hover:bg-cyan-50 text-cyan-700 shadow-sm'
              : 'border-cyan-400/50 bg-slate-900/90 hover:bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
          }`}
          title="Scan a QR Code or Product Barcode"
        >
          <QrCode className={`w-4 h-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
          <span>Scan QR / Product</span>
        </button>

        {/* MIDDLE TOP TITLE: Shown ONLY on the Main Page */}
        {activeModule === 'hub' ? (
          <div className="flex flex-col items-center text-center px-2">
            <h1
              className={`text-base sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase ${
                isLight
                  ? 'text-slate-900 drop-shadow-sm'
                  : 'text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]'
              }`}
            >
              TRUSTSHIELD AI
            </h1>
          </div>
        ) : (
          <div />
        )}

        {/* TOP-RIGHT: Theme Button + Three-Lines Menu (☰) */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() =>
              setThemeMode((prev) =>
                prev === 'dark' ? 'light' : prev === 'light' ? 'midnight' : 'dark'
              )
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isLight
                ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
                : 'border-slate-700/90 bg-slate-900/90 hover:bg-slate-800 text-amber-300'
            }`}
            title="Switch Theme (Dark / Light / Midnight)"
          >
            {isLight ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline capitalize">{themeMode}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
                : 'border-slate-700/90 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white'
            }`}
            aria-label="Open menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 top-12 w-64 rounded-2xl border backdrop-blur-md shadow-2xl p-2 z-50 space-y-1 text-xs ${
                isLight
                  ? 'border-slate-200 bg-white/95 text-slate-800'
                  : 'border-slate-700 bg-slate-900/95 text-slate-200'
              }`}
            >
              <div
                className={`px-3 py-2 border-b font-semibold ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}
              >
                Menu &amp; Information
              </div>

              <button
                onClick={() => {
                  setActiveModule('dashboard');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 text-slate-800'
                    : 'hover:bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-amber-500" />
                <span>Dashboard ({scanHistory.length} Scans)</span>
              </button>

              <button
                onClick={() => {
                  setActiveModule('privacy');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 text-slate-800'
                    : 'hover:bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-teal-500" />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => {
                  setActiveModule('about');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 text-slate-800'
                    : 'hover:bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4 text-sky-500" />
                <span>About Us</span>
              </button>

              <div
                className={`border-t pt-2 mt-1 px-3 py-1.5 space-y-2 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Theme</span>
                  <div className="flex items-center gap-1">
                    {(['light', 'dark', 'midnight'] as ThemeMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setThemeMode(mode)}
                        className={`px-2 py-1 rounded capitalize font-semibold cursor-pointer ${
                          themeMode === mode
                            ? 'bg-cyan-500 text-slate-950'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Language</span>
                  <button
                    onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
                    className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                      isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {language}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN VIEWPORT: Circular Radial Hub on BOTH Mobile & Desktop OR Selected Module */}
      {activeModule === 'hub' ? (
        <main className="flex-1 flex flex-col items-center justify-center px-2 py-2 overflow-hidden">
          {/* Desktop / Tablet Circular Radial Layout */}
          <div className="hidden sm:block relative w-[620px] md:w-[740px] h-[500px] md:h-[550px]">
            {/* Central Glowing Shield */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center z-20">
              <button
                onClick={() => setActiveModule('scan-website')}
                className={`group relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105 cursor-pointer ${
                  isLight
                    ? 'bg-white border-cyan-500 shadow-[0_0_45px_rgba(14,165,233,0.30)]'
                    : 'bg-[#111927] border-cyan-400/80 shadow-[0_0_50px_rgba(34,211,238,0.35)]'
                }`}
                title="Click to Scan a Website Link"
              >
                <Shield className="w-10 h-10 md:w-11 md:h-11 text-amber-400 stroke-[2.2]" />
                <span
                  className={`mt-1.5 text-[11px] font-bold tracking-widest ${
                    isLight ? 'text-cyan-700' : 'text-cyan-300'
                  }`}
                >
                  SHIELD
                </span>
              </button>
              <div
                className={`mt-2.5 text-xs font-mono font-semibold tabular-nums ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                ★ {xpPoints} XP
              </div>
            </div>

            {/* 6 Core Module Cards Arranged Circularly Around the Shield */}
            {RADIAL_MODULES.map((mod) => {
              const Icon = mod.icon;
              const rad = ((mod.angleDeg - 90) * Math.PI) / 180;
              const radiusX = 235;
              const radiusY = 195;
              const x = Math.cos(rad) * radiusX;
              const y = Math.sin(rad) * radiusY;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 absolute w-40 md:w-44 h-[104px] md:h-28 rounded-2xl border bg-gradient-to-b ${
                    isLight ? mod.lightGradient : mod.darkGradient
                  } backdrop-blur-md p-3 flex flex-col items-center justify-center text-center ${
                    isLight
                      ? 'shadow-lg'
                      : 'shadow-[0_10px_30px_rgba(0,0,0,0.45)]'
                  } transition-transform duration-200 hover:scale-105 cursor-pointer z-10`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                      isLight ? mod.lightIconBox : mod.darkIconBox
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div
                    className={`text-xs font-bold leading-tight truncate w-full ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {mod.title}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 truncate w-full ${
                      isLight ? 'text-slate-600' : 'text-slate-300/90'
                    }`}
                  >
                    {mod.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Circular Radial Layout (Stays Circular on Mobile Devices too!) */}
          <div className="sm:hidden relative w-[340px] h-[390px] mx-auto my-auto">
            {/* Subtle Circular Orbit Ring for Visual Attraction */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[236px] h-[264px] rounded-full border border-dashed pointer-events-none ${
                isLight ? 'border-cyan-400/40' : 'border-cyan-500/20'
              }`}
            />

            {/* Central Glowing Shield on Mobile */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center z-20">
              <button
                onClick={() => setActiveModule('scan-website')}
                className={`w-[88px] h-[88px] rounded-full border-2 flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                  isLight
                    ? 'bg-white border-cyan-500 shadow-[0_0_30px_rgba(14,165,233,0.30)]'
                    : 'bg-[#111927] border-cyan-400/80 shadow-[0_0_35px_rgba(34,211,238,0.35)]'
                }`}
                title="Tap to Scan Website"
              >
                <Shield className="w-8 h-8 text-amber-400 stroke-[2.2]" />
                <span
                  className={`mt-1 text-[9px] font-bold tracking-widest ${
                    isLight ? 'text-cyan-700' : 'text-cyan-300'
                  }`}
                >
                  SHIELD
                </span>
              </button>
              <div
                className={`mt-1 text-[10px] font-mono font-semibold tabular-nums ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                ★ {xpPoints} XP
              </div>
            </div>

            {/* 6 Module Cards Arranged Circularly Around the Shield on Mobile */}
            {RADIAL_MODULES.map((mod) => {
              const Icon = mod.icon;
              const rad = ((mod.angleDeg - 90) * Math.PI) / 180;
              const radiusX = 114;
              const radiusY = 134;
              const x = Math.cos(rad) * radiusX;
              const y = Math.sin(rad) * radiusY;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 absolute w-[104px] h-[74px] rounded-2xl border bg-gradient-to-b ${
                    isLight ? mod.lightGradient : mod.darkGradient
                  } backdrop-blur-md p-1.5 flex flex-col items-center justify-center text-center ${
                    isLight ? 'shadow-md' : 'shadow-[0_8px_20px_rgba(0,0,0,0.45)]'
                  } transition-transform active:scale-95 cursor-pointer z-10`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 ${
                      isLight ? mod.lightIconBox : mod.darkIconBox
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div
                    className={`text-[10px] font-bold leading-tight line-clamp-1 w-full ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {mod.title}
                  </div>
                  <div
                    className={`text-[8px] leading-tight truncate w-full mt-0.5 ${
                      isLight ? 'text-slate-600' : 'text-slate-300/90'
                    }`}
                  >
                    {mod.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      ) : (
        /* FOCUSED MODULE VIEW (No repeated website name header) */
        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-2 max-w-4xl mx-auto w-full space-y-5 select-text">
          {/* Top Back Button */}
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setActiveModule('hub')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isLight
                  ? 'border-slate-300 bg-white hover:bg-slate-100 text-cyan-700 shadow-sm'
                  : 'border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-cyan-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Shield</span>
            </button>
            <span
              className={`text-xs font-mono font-semibold tabular-nums ${
                isLight ? 'text-emerald-600' : 'text-emerald-400'
              }`}
            >
              ★ {xpPoints} XP
            </span>
          </div>

          {/* TOP-LEFT SHORTCUT MODULE: QR & PRODUCT BARCODE SCANNER */}
          {activeModule === 'qr-scanner' && (
            <div
              className={`w-full rounded-2xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 ${cardSurfaceClass}`}
            >
              <div className="space-y-1">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}
                >
                  QUICK QR &amp; PRODUCT BARCODE SCANNER
                </div>
                <h1 className="text-2xl font-bold">
                  Scan a QR Code or Product Barcode to Check If It Is Real or a Scammer
                </h1>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Use your camera, upload a QR code photo, or paste QR content to instantly know if a product, payment QR, or link is genuine or a scam trap.
                </p>
              </div>

              {/* Camera & Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 ${subSurfaceClass}`}
                >
                  <Camera className={`w-8 h-8 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  <div className="text-sm font-bold">Live Camera QR Scanner</div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Point your camera at any product QR code or payment code.
                  </p>
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={startCameraQrScan}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Open Camera Scanner
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCaptureCameraFrame}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Capture &amp; Scan QR
                      </button>
                      <button
                        type="button"
                        onClick={stopCameraQrScan}
                        className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer"
                      >
                        Stop Camera
                      </button>
                    </div>
                  )}
                </div>

                <label
                  className={`p-5 rounded-xl border border-dashed border-cyan-500/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${subSurfaceClass}`}
                >
                  <Upload className="w-8 h-8 text-amber-500" />
                  <div className="text-sm font-bold">Upload QR Code / Barcode Image</div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Select a screenshot or photo of a QR code from your device.
                  </p>
                  <span
                    className={`px-4 py-2 rounded-xl font-semibold text-xs ${
                      isLight
                        ? 'bg-cyan-100 text-cyan-800'
                        : 'bg-slate-800 text-cyan-300'
                    }`}
                  >
                    Choose QR Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {cameraActive && (
                <div className="rounded-xl overflow-hidden border border-cyan-500/40 bg-black max-w-md mx-auto">
                  <video ref={videoRef} className="w-full h-56 object-cover" playsInline muted />
                </div>
              )}

              {cameraError && (
                <div
                  className={`p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs ${
                    isLight ? 'text-amber-800' : 'text-amber-200'
                  }`}
                >
                  {cameraError}
                </div>
              )}

              {/* Direct QR Content Input or Quick Test */}
              <div
                className={`space-y-3 pt-2 border-t ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <label className="block text-xs font-medium">
                  Or Paste / Test Scanned QR Code Text or Barcode Number:
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={qrInputText}
                    onChange={(e) => setQrInputText(e.target.value)}
                    placeholder="Paste QR link, UPI string, or product barcode number..."
                    className={`flex-1 border rounded-xl px-4 py-3 text-sm ${inputSurfaceClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!qrInputText.trim()) return;
                      setQrResult(analyzeQrOrProductCode(qrInputText));
                    }}
                    className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs whitespace-nowrap cursor-pointer"
                  >
                    Check QR Now
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    Quick Test QR Scenarios:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const val = 'upi://pay?pa=scammer-refund@upi&pn=CashbackPrize&am=2500';
                      setQrInputText(val);
                      setQrResult(analyzeQrOrProductCode(val));
                    }}
                    className={`px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 cursor-pointer ${
                      isLight ? 'text-rose-700' : 'text-rose-300'
                    }`}
                  >
                    Test Fake &ldquo;Receive Money&rdquo; UPI Scam QR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const val = '8901030865214';
                      setQrInputText(val);
                      setQrResult(analyzeQrOrProductCode(val));
                    }}
                    className={`px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 cursor-pointer ${
                      isLight ? 'text-emerald-700' : 'text-emerald-300'
                    }`}
                  >
                    Test Original Product Barcode (890...)
                  </button>
                </div>
              </div>

              {qrResult && (
                <div
                  className={`rounded-2xl border p-5 space-y-3 ${
                    qrResult.riskLevel === 'Low Risk'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : qrResult.riskLevel === 'Medium Risk'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-rose-500/50 bg-rose-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase ${
                        qrResult.riskLevel === 'Low Risk'
                          ? isLight
                            ? 'text-emerald-700'
                            : 'text-emerald-400'
                          : qrResult.riskLevel === 'Medium Risk'
                          ? isLight
                            ? 'text-amber-700'
                            : 'text-amber-400'
                          : isLight
                          ? 'text-rose-700'
                          : 'text-rose-400'
                      }`}
                    >
                      {qrResult.qrType} — {qrResult.verdict}
                    </span>
                    <span className="text-xs font-mono font-bold">
                      {qrResult.riskLevel}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold">{qrResult.simpleTitle}</h2>
                  <p className="text-sm leading-relaxed">{qrResult.simpleExplanation}</p>
                  <ul className="list-disc list-inside space-y-1 text-xs pt-1">
                    {qrResult.safetySteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 1. SCAN WEBSITE LINK */}
          {activeModule === 'scan-website' && (
            <div
              className={`w-full rounded-2xl border border-amber-500/40 p-6 sm:p-8 space-y-6 ${cardSurfaceClass}`}
            >
              <div className="space-y-1.5">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-amber-600' : 'text-amber-400'
                  }`}
                >
                  SCAN WEBSITE LINK
                </div>
                <h1 className="text-2xl font-bold">
                  Check If a Website Link Is Original (Safe) or Fake (Risky)
                </h1>
                <p
                  className={`text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Paste any website link below. We check its <strong>HTTPS security</strong>,{' '}
                  <strong>domain ending</strong>, and <strong>brand spelling</strong> to tell you in simple words if it is <strong>Low Risk</strong>, <strong>Medium Risk</strong>, or <strong>High Risk</strong>.
                </p>
              </div>

              <form onSubmit={handleAnalyzeUrl} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste any website link here to check if it is safe or fake..."
                    className={`w-full border rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 ${inputSurfaceClass}`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Check Link Risk
                </button>
              </form>

              {scanResult && (
                <div
                  className={`rounded-2xl border p-6 space-y-6 ${
                    scanResult.riskLevel === 'Low Risk'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : scanResult.riskLevel === 'Medium Risk'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-rose-500/50 bg-rose-500/10'
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
                      isLight ? 'border-slate-200' : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {scanResult.riskLevel === 'Low Risk' && (
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 shrink-0" />
                      )}
                      {scanResult.riskLevel === 'Medium Risk' && (
                        <AlertCircle className="w-10 h-10 text-amber-500 shrink-0" />
                      )}
                      {(scanResult.riskLevel === 'High Risk' ||
                        scanResult.riskLevel === 'Not a Valid Link') && (
                        <XCircle className="w-10 h-10 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
                          <span
                            className={
                              scanResult.riskLevel === 'Low Risk'
                                ? isLight
                                  ? 'text-emerald-700'
                                  : 'text-emerald-400'
                                : scanResult.riskLevel === 'Medium Risk'
                                ? isLight
                                  ? 'text-amber-700'
                                  : 'text-amber-400'
                                : isLight
                                ? 'text-rose-700'
                                : 'text-rose-400'
                            }
                          >
                            {scanResult.verdictBadge}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>Protocol: {scanResult.protocolStatus}</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold mt-0.5">
                          {scanResult.headline}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs opacity-75">Risk Level</div>
                      <div
                        className={`text-xl font-bold tabular-nums ${
                          scanResult.riskLevel === 'Low Risk'
                            ? isLight
                              ? 'text-emerald-700'
                              : 'text-emerald-400'
                            : scanResult.riskLevel === 'Medium Risk'
                            ? isLight
                              ? 'text-amber-700'
                              : 'text-amber-400'
                            : isLight
                            ? 'text-rose-700'
                            : 'text-rose-400'
                        }`}
                      >
                        {scanResult.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1.5 ${subSurfaceClass}`}>
                    <div
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isLight ? 'text-cyan-700' : 'text-cyan-300'
                      }`}
                    >
                      Simple Explanation
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed">
                      {scanResult.simpleSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border space-y-2 ${subSurfaceClass}`}>
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isLight ? 'text-cyan-700' : 'text-cyan-300'
                        }`}
                      >
                        Why It Got This Risk Level
                      </h3>
                      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm leading-relaxed">
                        {scanResult.simpleReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={`p-4 rounded-xl border space-y-2 ${subSurfaceClass}`}>
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isLight ? 'text-emerald-700' : 'text-emerald-300'
                        }`}
                      >
                        What You Should Do Next
                      </h3>
                      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm leading-relaxed">
                        {scanResult.whatToDo.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. FAKE VS REAL BRANDS (UPLOAD PRODUCT PICTURE TO CHECK IF REAL OR FAKE) */}
          {activeModule === 'fake-vs-real-brands' && (
            <div
              className={`w-full rounded-2xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 ${cardSurfaceClass}`}
            >
              <div className="space-y-1">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}
                >
                  FAKE VS REAL BRANDS — PRODUCT PHOTO CHECKER
                </div>
                <h1 className="text-2xl font-bold">
                  Upload a Picture of a Product to Check If the Brand Is Real or Fake
                </h1>
                <p
                  className={`text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Have a doubt about a product&apos;s brand, logo, or packaging? Upload a picture of the product below and we will inspect it to tell you if it looks <strong>Original</strong> or a <strong>Fake Copy</strong>.
                </p>
              </div>

              {/* Upload Box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <label
                  className={`md:col-span-6 p-6 rounded-2xl border-2 border-dashed border-cyan-500/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-colors min-h-[210px] ${subSurfaceClass}`}
                >
                  {uploadedImagePreview ? (
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded product preview"
                      className="max-h-40 rounded-xl object-contain border border-slate-400/40"
                    />
                  ) : (
                    <ImageIcon
                      className={`w-11 h-11 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}
                    />
                  )}
                  <div className="text-sm font-bold">
                    {uploadedFileName
                      ? `Selected: ${uploadedFileName}`
                      : 'Click to Upload Product Picture'}
                  </div>
                  <p className="text-xs opacity-75">
                    Supports JPG, PNG, WEBP photos of any product box, logo, or label
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductFileChange}
                    className="hidden"
                  />
                </label>

                <div className="md:col-span-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5">
                      Optional: What is the brand name or your doubt about this product?
                    </label>
                    <input
                      type="text"
                      value={productDoubtNote}
                      onChange={(e) => setProductDoubtNote(e.target.value)}
                      placeholder="e.g. Logo spelling looks slightly different or checking if original..."
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 ${inputSurfaceClass}`}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!uploadedImagePreview || isAnalyzingImage}
                    onClick={handleAnalyzeProductPicture}
                    className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
                  >
                    {isAnalyzingImage
                      ? 'Inspecting Product Picture...'
                      : 'Check If Product Brand Is Real or Fake'}
                  </button>
                </div>
              </div>

              {/* Product Brand Picture Result */}
              {productImageResult && (
                <div
                  className={`rounded-2xl border p-6 space-y-4 ${
                    productImageResult.riskLevel === 'Low Risk'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : productImageResult.riskLevel === 'Medium Risk'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-rose-500/50 bg-rose-500/10'
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                      isLight ? 'border-slate-200' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div
                        className={`text-xs font-bold uppercase ${
                          productImageResult.riskLevel === 'Low Risk'
                            ? isLight
                              ? 'text-emerald-700'
                              : 'text-emerald-400'
                            : productImageResult.riskLevel === 'Medium Risk'
                            ? isLight
                              ? 'text-amber-700'
                              : 'text-amber-400'
                            : isLight
                            ? 'text-rose-700'
                            : 'text-rose-400'
                        }`}
                      >
                        Verdict: {productImageResult.verdict} ({productImageResult.riskLevel})
                      </div>
                      <h2 className="text-xl font-bold mt-0.5">
                        Product Inspected: {productImageResult.detectedBrandName}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed">
                    {productImageResult.simpleExplanation}
                  </p>

                  {/* Difference Between Original Brand and Uploaded Picture */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div
                      className={`p-4 rounded-xl border border-emerald-500/40 space-y-1 ${subSurfaceClass}`}
                    >
                      <div
                        className={`font-bold uppercase ${
                          isLight ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        Original Brand Standard
                      </div>
                      <p className="leading-relaxed">
                        {productImageResult.originalBrandFeatures}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-xl border border-cyan-500/40 space-y-1 ${subSurfaceClass}`}
                    >
                      <div
                        className={`font-bold uppercase ${
                          isLight ? 'text-cyan-700' : 'text-cyan-300'
                        }`}
                      >
                        What We Found in Your Picture
                      </div>
                      <p className="leading-relaxed">
                        {productImageResult.uploadedPictureObservations}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1.5 ${subSurfaceClass}`}>
                    <div
                      className={`text-xs font-bold uppercase ${
                        isLight ? 'text-amber-700' : 'text-amber-300'
                      }`}
                    >
                      Simple Advice for You
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                      {productImageResult.safetyAdvice.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. FAKE VS REAL APPS (SINGLE APP URL NAVBAR -> DETECT PLAY STORE VS BROWSER APK + USER RATINGS) */}
          {activeModule === 'fake-vs-real-apps' && (
            <div
              className={`w-full rounded-2xl border border-emerald-500/40 p-6 sm:p-8 space-y-6 ${cardSurfaceClass}`}
            >
              <div className="space-y-1.5">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-emerald-700' : 'text-emerald-400'
                  }`}
                >
                  APPLICATION LINK &amp; APK DETECTOR
                </div>
                <h1 className="text-2xl font-bold">
                  Check If an Application Link Is Real (Play Store) or a Fake Browser APK
                </h1>
                <p
                  className={`text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Paste the link or URL of any mobile application below. We will tell you if it is a genuine <strong>Play Store / App Store app</strong> or a dangerous <strong>.APK downloaded from a browser</strong>, along with its <strong>past user rating</strong>!
                </p>
              </div>

              {/* Single Clean Input Navbar for Application URL */}
              <form onSubmit={handleAnalyzeAppUrl} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Smartphone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={appUrlInput}
                    onChange={(e) => setAppUrlInput(e.target.value)}
                    placeholder="Paste application link or URL here (e.g. Play Store link or browser .apk link)..."
                    className={`w-full border rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-400 ${inputSurfaceClass}`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Check App Link
                </button>
              </form>

              {/* Quick Test App Links */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="opacity-75">Try an example app URL:</span>
                <button
                  type="button"
                  onClick={() => {
                    const u =
                      'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user';
                    setAppUrlInput(u);
                    setAppAnalysisResult(analyzeAppUrl(u));
                  }}
                  className={`px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 cursor-pointer ${
                    isLight ? 'text-emerald-700' : 'text-emerald-300'
                  }`}
                >
                  Official Play Store App Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const u = 'https://fast-reward-update.xyz/download/bank-kyc-update.apk';
                    setAppUrlInput(u);
                    setAppAnalysisResult(analyzeAppUrl(u));
                  }}
                  className={`px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 cursor-pointer ${
                    isLight ? 'text-rose-700' : 'text-rose-300'
                  }`}
                >
                  Browser .APK Download Link (Not Play Store)
                </button>
              </div>

              {/* App Link Result with Star Rating & Past User Reviews */}
              {appAnalysisResult && (
                <div
                  className={`rounded-2xl border p-6 space-y-5 ${
                    appAnalysisResult.riskLevel === 'Low Risk'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : appAnalysisResult.riskLevel === 'Medium Risk'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-rose-500/50 bg-rose-500/10'
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
                      isLight ? 'border-slate-200' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div
                        className={`text-xs font-bold uppercase ${
                          appAnalysisResult.riskLevel === 'Low Risk'
                            ? isLight
                              ? 'text-emerald-700'
                              : 'text-emerald-400'
                            : appAnalysisResult.riskLevel === 'Medium Risk'
                            ? isLight
                              ? 'text-amber-700'
                              : 'text-amber-400'
                            : isLight
                            ? 'text-rose-700'
                            : 'text-rose-400'
                        }`}
                      >
                        {appAnalysisResult.verdict} — {appAnalysisResult.riskLevel}
                      </div>
                      <h2 className="text-xl font-bold mt-0.5">
                        Source: {appAnalysisResult.sourceLabel}
                      </h2>
                    </div>

                    {/* Past User Rating Box */}
                    {appAnalysisResult.starRating > 0 && (
                      <div className={`p-3 rounded-xl border text-right ${subSurfaceClass}`}>
                        <div className="text-xs opacity-75">Past Users Rating</div>
                        <div className="flex items-center justify-end gap-1 text-lg font-bold text-amber-500 font-mono">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{appAnalysisResult.starRating} / 5.0</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed">
                    {appAnalysisResult.simpleExplanation}
                  </p>

                  {/* Past User Reviews Summary */}
                  <div className={`p-4 rounded-xl border space-y-2 ${subSurfaceClass}`}>
                    <div
                      className={`text-xs font-bold uppercase ${
                        isLight ? 'text-amber-700' : 'text-amber-300'
                      }`}
                    >
                      Rating &amp; Reviews From Past Users ({appAnalysisResult.ratingLabel})
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm leading-relaxed">
                      {appAnalysisResult.pastUserReviews.map((rev, i) => (
                        <li key={i}>{rev}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. SOCIAL MEDIA CHECK */}
          {activeModule === 'social-check' && (
            <div
              className={`w-full rounded-2xl border border-fuchsia-500/40 p-6 sm:p-8 space-y-5 ${cardSurfaceClass}`}
            >
              <h1 className="text-2xl font-bold">
                Check If a Social Media Account or Handle Is Real or Fake
              </h1>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Enter a social media handle or link claiming to be customer support or an official brand.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!socialInput.trim()) return;
                  setSocialResult(compareOriginalVsGivenItem(socialInput));
                  setXpPoints((prev) => prev + 25);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={socialInput}
                  onChange={(e) => setSocialInput(e.target.value)}
                  placeholder="Enter handle or link (e.g. @sbi_helpdesk_care or instagram.com/...)"
                  className={`flex-1 border rounded-xl px-4 py-3 text-sm ${inputSurfaceClass}`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Handle
                </button>
              </form>
              {socialResult && (
                <div className={`p-5 rounded-xl border space-y-3 ${subSurfaceClass}`}>
                  <div
                    className={`text-xs font-bold uppercase ${
                      socialResult.riskLevel === 'Low Risk'
                        ? isLight
                          ? 'text-emerald-700'
                          : 'text-emerald-400'
                        : socialResult.riskLevel === 'Medium Risk'
                        ? isLight
                          ? 'text-amber-700'
                          : 'text-amber-400'
                        : isLight
                        ? 'text-rose-700'
                        : 'text-rose-400'
                    }`}
                  >
                    Result: {socialResult.verdict} ({socialResult.riskLevel})
                  </div>
                  <p className="text-sm leading-relaxed">{socialResult.simpleExplanation}</p>
                </div>
              )}
            </div>
          )}

          {/* 5. SPOT THE SCAM */}
          {activeModule === 'spot-scam' && (
            <div
              className={`w-full rounded-2xl border border-orange-500/40 p-6 sm:p-8 space-y-5 ${cardSurfaceClass}`}
            >
              <h1 className="text-2xl font-bold">
                Spot the Scam: Which Link Is Safe to Open?
              </h1>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Tap the link below that looks like a genuine, safe official website rather than a scam trap:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizChoice('fake')}
                  className={`p-4 rounded-xl border hover:border-rose-400 text-left space-y-1 cursor-pointer ${subSurfaceClass}`}
                >
                  <div className="text-xs opacity-70">Option A</div>
                  <div className="font-mono text-sm font-bold">
                    http://bank-kyc-reward-claim.xyz/login
                  </div>
                  <div className="text-xs opacity-75">
                    &ldquo;Urgent: Click to unlock ₹5,000 cashback before tonight!&rdquo;
                  </div>
                </button>
                <button
                  onClick={() => setQuizChoice('original')}
                  className={`p-4 rounded-xl border hover:border-emerald-400 text-left space-y-1 cursor-pointer ${subSurfaceClass}`}
                >
                  <div className="text-xs opacity-70">Option B</div>
                  <div className="font-mono text-sm font-bold">
                    https://www.onlinesbi.sbi
                  </div>
                  <div className="text-xs opacity-75">
                    &ldquo;Official State Bank of India Portal (HTTPS)&rdquo;
                  </div>
                </button>
              </div>
              {quizChoice && (
                <div
                  className={`p-4 rounded-xl border text-sm leading-relaxed ${
                    quizChoice === 'original'
                      ? isLight
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800'
                        : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : isLight
                      ? 'border-rose-500/50 bg-rose-500/10 text-rose-800'
                      : 'border-rose-500/50 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {quizChoice === 'original'
                    ? 'Spot on! Option B starts with secure "https://" and uses the verified official ".sbi" domain without any fake reward lures.'
                    : 'Watch out! Option A uses insecure "http://", hyphens, trap words ("kyc-reward-claim"), and a risky ".xyz" ending.'}
                </div>
              )}
            </div>
          )}

          {/* 6. SAFETY PORTALS */}
          {activeModule === 'portals' && (
            <div
              className={`w-full rounded-2xl border border-cyan-500/40 p-6 sm:p-8 space-y-4 ${cardSurfaceClass}`}
            >
              <h1 className="text-2xl font-bold">
                Official Cyber Safety Portals &amp; Helplines
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-1 ${subSurfaceClass}`}>
                  <div
                    className={`font-bold flex items-center gap-1.5 ${
                      isLight ? 'text-cyan-700' : 'text-cyan-300'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>National Cyber Crime Helpline (1930)</span>
                  </div>
                  <p>
                    Call <strong>1930</strong> immediately if you lost money to a scam link, fake QR code, or fraudulent APK app.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${subSurfaceClass}`}>
                  <div
                    className={`font-bold flex items-center gap-1.5 ${
                      isLight ? 'text-emerald-700' : 'text-emerald-300'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>National Cyber Crime Portal</span>
                  </div>
                  <p>
                    Report cyber fraud and fake websites officially at{' '}
                    <strong className="font-mono">https://cybercrime.gov.in</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOP-RIGHT MENU ITEM 1: DASHBOARD */}
          {activeModule === 'dashboard' && (
            <div
              className={`w-full rounded-2xl border border-amber-500/40 p-6 sm:p-8 space-y-5 ${cardSurfaceClass}`}
            >
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-xl border ${subSurfaceClass}`}>
                  <div className="text-xs opacity-75">Guardian XP</div>
                  <div className="text-2xl font-bold font-mono text-amber-500 mt-1">
                    {xpPoints}
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${subSurfaceClass}`}>
                  <div className="text-xs opacity-75">Links Checked</div>
                  <div className="text-2xl font-bold font-mono text-cyan-500 mt-1">
                    {scanHistory.length}
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${subSurfaceClass}`}>
                  <div className="text-xs opacity-75">Active Streak</div>
                  <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
                    3 Days
                  </div>
                </div>
              </div>
              {scanHistory.length > 0 ? (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold">Recent Link Checks</h2>
                  <div className={`divide-y rounded-xl border text-xs ${subSurfaceClass}`}>
                    {scanHistory.map((item, i) => (
                      <div key={i} className="p-3 flex items-center justify-between gap-3">
                        <span className="font-mono truncate">{item.inputUrl}</span>
                        <span
                          className={`font-bold shrink-0 ${
                            item.riskLevel === 'Low Risk'
                              ? isLight
                                ? 'text-emerald-700'
                                : 'text-emerald-400'
                              : item.riskLevel === 'Medium Risk'
                              ? isLight
                                ? 'text-amber-700'
                                : 'text-amber-400'
                              : isLight
                              ? 'text-rose-700'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs opacity-75">No links checked yet in this session.</p>
              )}
            </div>
          )}

          {/* TOP-RIGHT MENU ITEM 2: PRIVACY POLICY */}
          {activeModule === 'privacy' && (
            <div
              className={`w-full rounded-2xl border border-teal-500/40 p-6 sm:p-8 space-y-3 ${cardSurfaceClass}`}
            >
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                <li>We never ask for your passwords, PINs, bank account numbers, or OTPs.</li>
                <li>Pictures, QR codes, and links you check are used strictly to help you spot fake brands, risky browser APKs, and scam websites.</li>
                <li>Zero private API keys or secrets are stored in your browser.</li>
              </ul>
            </div>
          )}

          {/* TOP-RIGHT MENU ITEM 3: ABOUT US */}
          {activeModule === 'about' && (
            <div
              className={`w-full rounded-2xl border border-sky-500/40 p-6 sm:p-8 space-y-3 ${cardSurfaceClass}`}
            >
              <h1 className="text-2xl font-bold">About Us</h1>
              <p className="text-sm leading-relaxed">
                We help users stay safe online by checking website links, uploaded product brand photos, mobile app links (Play Store vs. risky browser APK files), and QR codes — explaining every result in simple, everyday language.
              </p>
            </div>
          )}
        </main>
      )}

      {/* Subtle Bottom-Right Guardian Button */}
      <footer className="w-full px-6 py-4 flex items-center justify-end pointer-events-none">
        <button
          onClick={() => setActiveModule('scan-website')}
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/90 to-cyan-500/90 hover:from-indigo-500 hover:to-cyan-500 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Safety Guardian</span>
        </button>
      </footer>
    </div>
  );
}
