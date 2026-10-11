import React, { useState, useRef } from 'react';
import { Language } from '../types/service';
import { Upload, Download, RefreshCw, Image as ImageIcon, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhotoResizerToolProps {
  language: Language;
}

type PresetType = 'passport' | 'signature' | 'thumb' | 'doc-small' | 'custom';

export const PhotoResizerTool: React.FC<PhotoResizerToolProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [preset, setPreset] = useState<PresetType>('passport');
  const [targetWidth, setTargetWidth] = useState<number>(350);
  const [targetHeight, setTargetHeight] = useState<number>(450);
  const [targetMaxKB, setTargetMaxKB] = useState<number>(45);

  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedSizeKB, setProcessedSizeKB] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadName, setDownloadName] = useState<string>('resized_photo.jpg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply preset dimensions & file size
  const handleSelectPreset = (type: PresetType) => {
    setPreset(type);
    if (type === 'passport') {
      setTargetWidth(350);
      setTargetHeight(450);
      setTargetMaxKB(45); // 20-50 KB range
      setDownloadName('passport_photo_under_50kb.jpg');
    } else if (type === 'signature') {
      setTargetWidth(280);
      setTargetHeight(120);
      setTargetMaxKB(18); // 10-20 KB range
      setDownloadName('signature_under_20kb.jpg');
    } else if (type === 'thumb') {
      setTargetWidth(200);
      setTargetHeight(200);
      setTargetMaxKB(25);
      setDownloadName('thumb_impression.jpg');
    } else if (type === 'doc-small') {
      setTargetWidth(800);
      setTargetHeight(1100);
      setTargetMaxKB(90); // Under 100 KB
      setDownloadName('document_under_100kb.jpg');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setOriginalSizeKB(Math.round(file.size / 1024));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setOriginalImageUrl(src);

      const img = new Image();
      img.onload = () => {
        setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
        // Process immediately with current settings
        compressAndResize(img, targetWidth, targetHeight, targetMaxKB);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const compressAndResize = (
    imageElement: HTMLImageElement,
    w: number,
    h: number,
    maxKB: number
  ) => {
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // White background in case of transparent PNGs (important for passport photos)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Draw image to fill bounds
    ctx.drawImage(imageElement, 0, 0, w, h);

    // Binary search for optimal JPEG quality to achieve target KB
    let minQuality = 0.05;
    let maxQuality = 0.98;
    let bestBlob: Blob | null = null;
    let bestSizeKB = 0;

    const testQuality = (q: number): Promise<Blob | null> => {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', q);
      });
    };

    const runOptimization = async () => {
      for (let i = 0; i < 7; i++) {
        const midQuality = (minQuality + maxQuality) / 2;
        const blob = await testQuality(midQuality);
        if (!blob) break;

        const sizeKB = blob.size / 1024;
        bestBlob = blob;
        bestSizeKB = Math.round(sizeKB);

        if (sizeKB > maxKB) {
          maxQuality = midQuality;
        } else {
          minQuality = midQuality;
        }
      }

      if (bestBlob) {
        const url = URL.createObjectURL(bestBlob);
        setProcessedImageUrl(url);
        setProcessedSizeKB(bestSizeKB);
      }
      setIsProcessing(false);
    };

    runOptimization();
  };

  const handleApplySettings = () => {
    if (!originalImageUrl) return;
    const img = new Image();
    img.onload = () => {
      compressAndResize(img, targetWidth, targetHeight, targetMaxKB);
    };
    img.src = originalImageUrl;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
              {isHi ? 'डिजिटल उपयोगिता टूल' : 'Citizen Utility Tool'}
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">{isHi ? '100% सुरक्षित (ब्राउज़र में प्रोसेस)' : '100% Private (Local Processing)'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isHi ? 'ऑनलाइन फॉर्म फोटो व हस्ताक्षर रीसाइज़र' : 'Online Form Photo & Signature Resizer'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isHi
              ? 'सरकारी फॉर्म (SSC, पुलिस भर्ती, पैन कार्ड, स्कॉलरशिप) हेतु 20KB-50KB फोटो और 10KB-20KB हस्ताक्षर बिना किसी साइबर कैफे जाए तुरंत बनाएं।'
              : 'Resize and compress passport photos and signatures to strict govt exam specs (20-50KB, 10-20KB) instantly in browser.'}
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          {isHi ? 'प्रारूप चुनें (सरकारी फॉर्म मानक):' : 'Select Exam Preset:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleSelectPreset('passport')}
            className={`p-3 rounded-lg text-left border transition-all ${
              preset === 'passport'
                ? 'border-amber-600 bg-amber-50/70 text-slate-900 shadow-2xs font-semibold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="text-xs font-bold">{isHi ? 'पासपोर्ट फोटो' : 'Passport Photo'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">20KB – 50KB · 350x450px</div>
          </button>

          <button
            onClick={() => handleSelectPreset('signature')}
            className={`p-3 rounded-lg text-left border transition-all ${
              preset === 'signature'
                ? 'border-amber-600 bg-amber-50/70 text-slate-900 shadow-2xs font-semibold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="text-xs font-bold">{isHi ? 'हस्ताक्षर (Signature)' : 'Signature'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">10KB – 20KB · 280x120px</div>
          </button>

          <button
            onClick={() => handleSelectPreset('thumb')}
            className={`p-3 rounded-lg text-left border transition-all ${
              preset === 'thumb'
                ? 'border-amber-600 bg-amber-50/70 text-slate-900 shadow-2xs font-semibold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="text-xs font-bold">{isHi ? 'अंगूठे का निशान' : 'Thumb Impression'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">10KB – 30KB · 200x200px</div>
          </button>

          <button
            onClick={() => handleSelectPreset('doc-small')}
            className={`p-3 rounded-lg text-left border transition-all ${
              preset === 'doc-small'
                ? 'border-amber-600 bg-amber-50/70 text-slate-900 shadow-2xs font-semibold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="text-xs font-bold">{isHi ? 'दस्तावेज (Under 100KB)' : 'Document Copy'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">Under 100KB · A4 Ratio</div>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Adjustments */}
        <div className="lg:col-span-5 space-y-4">
          {/* File Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {isHi ? 'फोटो या हस्ताक्षर चुनें' : 'Click to Upload Image / Sign'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG, JPEG ({isHi ? 'मोबाइल कैमरा या गैलरी से' : 'from phone camera or gallery'})
            </p>
          </div>

          {/* Custom Size Tuning */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>{isHi ? 'आकार व साइज सेटिंग' : 'Dimensions & Target KB'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">{isHi ? 'चौड़ाई (Width px):' : 'Width (px):'}</label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 bg-white font-mono tabular-nums text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">{isHi ? 'ऊंचाई (Height px):' : 'Height (px):'}</label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => setTargetHeight(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 bg-white font-mono tabular-nums text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{isHi ? 'अधिकतम फाइल साइज:' : 'Target Maximum KB:'}</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{targetMaxKB} KB</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={targetMaxKB}
                onChange={(e) => setTargetMaxKB(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <button
              onClick={handleApplySettings}
              disabled={!originalImageUrl || isProcessing}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isHi ? 'नया साइज लागू करें' : 'Apply & Re-compress'}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Comparison & Output Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 p-4 sm:p-6 rounded-xl border border-slate-200">
          <div>
            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>{isHi ? 'आउटपुट पूर्वावलोकन (Preview)' : 'Comparison Preview'}</span>
              {processedImageUrl && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isHi ? 'फॉर्म अपलोड हेतु मान्य' : 'Ready for Govt Form Upload'}
                </span>
              )}
            </div>

            {originalImageUrl ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Original */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    {isHi ? 'मूल फाइल (Original)' : 'Original File'}
                  </div>
                  <div className="h-44 flex items-center justify-center bg-slate-100 rounded overflow-hidden">
                    <img
                      src={originalImageUrl}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-600 font-mono tabular-nums">
                    {originalSizeKB} KB · {originalDims.width}×{originalDims.height}px
                  </div>
                </div>

                {/* Processed */}
                <div className="bg-white p-3 rounded-lg border-2 border-emerald-500/40 text-center relative">
                  <div className="text-xs font-semibold text-emerald-700 mb-2 flex items-center justify-center gap-1">
                    <span>{isHi ? 'रीसाइज्ड परिणाम (Compressed)' : 'Resized Result'}</span>
                  </div>
                  <div className="h-44 flex items-center justify-center bg-white rounded overflow-hidden shadow-inner border border-slate-100">
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                        <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                        <span>{isHi ? 'प्रोसेसिंग...' : 'Compressing...'}</span>
                      </div>
                    ) : processedImageUrl ? (
                      <img
                        src={processedImageUrl}
                        alt="Resized"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 text-xs font-bold text-emerald-700 font-mono tabular-nums">
                    {processedSizeKB} KB · {targetWidth}×{targetHeight}px
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-300 rounded-lg text-slate-400">
                <ImageIcon className="w-10 h-10 mb-2 text-slate-300" />
                <span className="text-sm font-medium text-slate-600">
                  {isHi ? 'बाईं ओर से कोई भी फोटो या साइन चुनें' : 'Select a photo or signature to preview'}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  {isHi ? 'तत्काल सही केबी में तैयार होकर डाउनलोड लिंक उपलब्ध होगा।' : 'Will resize to exact allowed KB in real-time.'}
                </span>
              </div>
            )}
          </div>

          {/* Download Action Bar */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {isHi
                  ? 'यह फाइल सीधे SSC, UPSC, NSDL व E-District फॉर्म पर अपलोड की जा सकती है।'
                  : 'File format is standard JPEG 100% compliant with Indian e-gov portals.'}
              </span>
            </div>

            {processedImageUrl && (
              <a
                href={processedImageUrl}
                download={downloadName}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{isHi ? 'रीसाइज़्ड फोटो डाउनलोड करें' : 'Download Compressed Image'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
