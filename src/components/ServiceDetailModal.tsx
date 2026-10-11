import React, { useState } from 'react';
import { ServiceItem, Language } from '../types/service';
import { 
  X, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Ticket, 
  Clock, 
  Banknote, 
  FileDown, 
  Printer, 
  CheckCircle2, 
  ShieldAlert, 
  Landmark,
  Loader2
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem;
  language: Language;
  onClose: () => void;
  onRequestAssistance: (service: ServiceItem) => void;
  onExportToDocs?: (title: string, content: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  language,
  onClose,
  onRequestAssistance,
  onExportToDocs
}) => {
  const isHi = language === 'hi';
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const docs = isHi ? service.requiredDocsHi : service.requiredDocsEn;
  const steps = isHi ? service.stepsHi : service.stepsEn;

  // Generate full standalone printable HTML for PDF export
  const generateGuideHtml = () => {
    const dateStr = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const refId = `DSK-${service.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const docsHtml = docs.map((doc, idx) => {
      const isChecked = !!checkedDocs[idx];
      return `
        <div style="display: flex; align-items: flex-start; margin-bottom: 8px; font-size: 13px; line-height: 1.5;">
          <span style="display: inline-block; width: 16px; height: 16px; border: 1.5px solid ${isChecked ? '#059669' : '#94a3b8'}; background: ${isChecked ? '#ecfdf5' : '#ffffff'}; color: #059669; font-weight: bold; text-align: center; line-height: 14px; margin-right: 10px; border-radius: 3px; font-size: 12px; flex-shrink: 0;">
            ${isChecked ? '✓' : ''}
          </span>
          <span style="color: #1e293b; font-weight: ${isChecked ? '600' : '400'};">
            ${doc} ${isChecked ? '<span style="color: #059669; font-size: 11px;">(तैयार / Verified)</span>' : ''}
          </span>
        </div>
      `;
    }).join('');

    const stepsHtml = steps.map((step, idx) => `
      <div style="display: flex; align-items: flex-start; margin-bottom: 10px; font-size: 13px; line-height: 1.5;">
        <span style="display: inline-block; width: 22px; height: 22px; background: #0f172a; color: #ffffff; font-weight: 700; text-align: center; line-height: 22px; margin-right: 10px; border-radius: 50%; font-size: 11px; flex-shrink: 0;">
          ${idx + 1}
        </span>
        <span style="color: #334155;">${step}</span>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isHi ? service.titleHi : service.titleEn} - Official PDF Guide</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .header-banner {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .tricolor-stripe {
      height: 4px;
      background: linear-gradient(to right, #ea580c 33.3%, #ffffff 33.3%, #ffffff 66.6%, #16a34a 66.6%);
      margin-bottom: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 2px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 4px;
      margin-top: 16px;
      margin-bottom: 10px;
      border-left: 4px solid #d97706;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .info-item {
      font-size: 12px;
    }
    .info-label {
      color: #64748b;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .info-value {
      font-weight: 700;
      color: #0f172a;
    }
    .footer-stamp {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .helpline-box {
      margin-top: 16px;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 6px;
      padding: 10px;
      font-size: 12px;
      color: #92400e;
    }
  </style>
</head>
<body>
  <div class="tricolor-stripe"></div>

  <div class="header-banner">
    <div>
      <div style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">
        डिजिटल सेवा केंद्र · Digital Seva Portal
      </div>
      <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
        नागरिक ई-गवर्नेंस एवं ऑनलाइन इंटरनेट सेवा आधिकारिक मार्गदर्शिका
      </div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>संदर्भ कोड: <strong>${refId}</strong></div>
      <div>जारी दिनांक: ${dateStr}</div>
    </div>
  </div>

  <div style="margin-bottom: 12px;">
    <div style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">
      ${isHi ? service.departmentHi : service.departmentEn}
    </div>
    <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 2px;">
      ${isHi ? service.titleHi : service.titleEn}
    </div>
    <div style="font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.5;">
      ${isHi ? service.shortDescHi : service.shortDescEn}
    </div>
  </div>

  <div class="info-grid"${(isHi ? service.feeHi : service.feeEn) ? '' : ' style="grid-template-columns: 1fr;"'}>
    ${(isHi ? service.feeHi : service.feeEn) ? `
    <div class="info-item">
      <div class="info-label">${isHi ? 'सेवा शुल्क (Service Fee):' : 'Service Fee:'}</div>
      <div class="info-value">${isHi ? service.feeHi : service.feeEn}</div>
    </div>
    ` : ''}
    <div class="info-item">
      <div class="info-label">${isHi ? 'प्रक्रिया समय सीमा (Processing Timeline):' : 'Processing Timeline:'}</div>
      <div class="info-value">${isHi ? service.processingTimeHi : service.processingTimeEn}</div>
    </div>
    <div class="info-item" style="grid-column: span ${(isHi ? service.feeHi : service.feeEn) ? '2' : '1'};">
      <div class="info-label">${isHi ? 'आधिकारिक सरकारी पोर्टल (Official Portal):' : 'Official Portal URL:'}</div>
      <div class="info-value" style="font-family: monospace; font-size: 11px; color: #1e40af;">
        ${service.officialUrl}
      </div>
    </div>
  </div>

  <div class="section-title">
    ${isHi ? '1. आवश्यक दस्तावेजों की चेकलिस्ट (Mandatory Documents):' : '1. Mandatory Documents Checklist:'}
  </div>
  <div style="padding: 4px 6px;">
    ${docsHtml}
  </div>

  <div class="section-title">
    ${isHi ? '2. ऑनलाइन आवेदन की क्रमबद्ध प्रक्रिया (Step-by-Step Procedure):' : '2. Step-by-Step Application Procedure:'}
  </div>
  <div style="padding: 4px 6px;">
    ${stepsHtml}
  </div>

  <div class="helpline-box">
    <strong>महत्वपूर्ण नागरिक सुरक्षा परामर्श (Citizen Advisory):</strong><br>
    • किसी भी अनधिकृत दलाल या व्यक्ति को अपना OTP, पासवर्ड अथवा खाली हस्ताक्षर पत्र न दें।<br>
    • राष्ट्रीय साइबर वित्तीय अपराध हेल्पलाइन: <strong>1930</strong> (24x7) | आधार टोल-फ्री हेल्पलाइन: <strong>1947</strong>
  </div>

  <div class="footer-stamp">
    <div>
      डिजिटल सेवा केंद्र पोर्टल नागरिक मार्गदर्शन पर्ची · Digital India Initiative
    </div>
    <div style="font-weight: 700; color: #0f172a;">
      सत्यापित ई-दस्तावेज · Verified
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadPdfGuide = () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // Create hidden iframe to trigger seamless native print/PDF save dialog without popup blocking
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        setIsGeneratingPdf(false);
        return;
      }

      const htmlContent = generateGuideHtml();
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (err) {
          console.error('Print trigger error:', err);
          window.print();
        } finally {
          setIsGeneratingPdf(false);
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
            } catch (e) {}
          }, 1500);
        }
      }, 400);
    } catch (e) {
      console.error('PDF guide generation failed:', e);
      setIsGeneratingPdf(false);
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-amber-400 font-semibold mb-1">
              {isHi ? service.departmentHi : service.departmentEn}
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              {isHi ? service.titleHi : service.titleEn}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          
          {/* Quick Overview Strip */}
          <div className={`grid ${(isHi ? service.feeHi : service.feeEn) ? 'grid-cols-2' : 'grid-cols-1'} gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs`}>
            {(isHi ? service.feeHi : service.feeEn) ? (
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block">{isHi ? 'सेवा शुल्क:' : 'Service Fee:'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{isHi ? service.feeHi : service.feeEn}</span>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-slate-500 block">{isHi ? 'प्रक्रिया समय:' : 'Timeline:'}</span>
                <span className="font-bold text-slate-900">{isHi ? service.processingTimeHi : service.processingTimeEn}</span>
              </div>
            </div>
          </div>

          {/* PDF Guide Callout Banner inside modal */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {isHi
                  ? 'इस सेवा के आवश्यक कागजात व पूरी प्रक्रिया की पीडीएफ पर्ची डाउनलोड करें।'
                  : 'Download complete checklist and application procedure as a concise PDF guide.'}
              </span>
            </div>
            <button
              onClick={handleDownloadPdfGuide}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{isHi ? 'PDF गाइड' : 'PDF Guide'}</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isHi ? 'सेवा का विवरण' : 'Service Overview'}
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {isHi ? service.shortDescHi : service.shortDescEn}
            </p>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isHi ? 'आवश्यक दस्तावेज (दस्तावेज चेकलिस्ट):' : 'Mandatory Document Checklist:'}
              </h3>
              <span className="text-[11px] text-slate-500">
                {isHi ? 'तैयार कागजातों पर टिक करें' : 'Tick documents you have'}
              </span>
            </div>

            <div className="space-y-2">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">{doc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Guidance */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {isHi ? 'ऑनलाइन आवेदन की चरणबद्ध प्रक्रिया (Steps to Apply):' : 'Step-by-Step Application Procedure:'}
            </h3>
            <div className="space-y-2.5">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-normal">
                    {st}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Direct Government Portal Link */}
          {service.officialUrl.startsWith('http') ? (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{isHi ? 'सरकारी पोर्टल खोलें' : 'Govt Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          ) : (
            <div />
          )}

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Save Checklist/Guide to Google Docs */}
            {onExportToDocs && (
              <button
                onClick={() => {
                  const title = `${isHi ? service.titleHi : service.titleEn} - सेवा दस्तावेज व प्रक्रिया गाइड`;
                  const content = 
`${isHi ? service.titleHi : service.titleEn}
विभाग: ${isHi ? service.departmentHi : service.departmentEn}
डिजिटल नागरिक सेवा केंद्र मार्गदर्शिका

आवश्यक दस्तावेज (Required Documents Checklist):
${docs.map((d, i) => `${i + 1}. [ ] ${d}`).join('\n')}

आवेदन प्रक्रिया व चरण (Step-by-Step Procedure):
${steps.map((s, i) => `चरण ${i + 1}: ${s}`).join('\n')}

सरकारी पोर्टल लिंक: ${service.officialUrl}
अनुमानित समय: ${isHi ? service.processingTimeHi : service.processingTimeEn}
सेवा शुल्क विवरण: ${isHi ? service.feeHi : service.feeEn}

स्थान: डिजिटल नागरिक सेवा केंद्र
तारीख: ${new Date().toLocaleDateString('hi-IN')}`;

                  onExportToDocs(title, content);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title={isHi ? 'इस गाइड को Google Docs में सेव करें' : 'Save guide to Google Docs'}
              >
                <FileDown className="w-4 h-4 text-blue-600" />
                <span>{isHi ? 'Google Docs में सेव करें' : 'Save to Google Docs'}</span>
              </button>
            )}

            {/* Download PDF Guide Button (Requested Feature) */}
            <button
              onClick={handleDownloadPdfGuide}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : downloadSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <FileDown className="w-4 h-4 text-amber-400" />
              )}
              <span>{isHi ? 'PDF गाइड डाउनलोड करें' : 'Download PDF Guide'}</span>
            </button>

            {/* Assistance Token Booking Button */}
            <button
              onClick={() => onRequestAssistance(service)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">{isHi ? 'सहायता टोकन' : 'Book Token'}</span>
              <span className="sm:hidden">{isHi ? 'टोकन' : 'Token'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
