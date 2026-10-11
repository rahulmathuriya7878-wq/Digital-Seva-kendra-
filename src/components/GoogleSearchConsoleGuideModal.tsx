import React, { useState } from 'react';
import { Language } from '../types/service';
import { 
  X, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Globe, 
  FileCode, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

interface GoogleSearchConsoleGuideModalProps {
  language: Language;
  onClose: () => void;
}

export const GoogleSearchConsoleGuideModal: React.FC<GoogleSearchConsoleGuideModalProps> = ({
  language,
  onClose
}) => {
  const isHi = language === 'hi';
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const siteUrl = 'https://ais-pre-qzeqizgjsdkg77yrryzzag-300878841095.asia-southeast1.run.app/';
  const sitemapUrl = 'https://ais-pre-qzeqizgjsdkg77yrryzzag-300878841095.asia-southeast1.run.app/sitemap.xml';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isHi ? 'Google Search Console में वेबसाइट कैसे जोड़ें?' : 'How to Add Website to Google Search Console'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'वेरीफिकेशन (Verification) और साइटमैप सबमिशन गाइड' : 'Complete Verification & Sitemap Submission Guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          
          {/* Alert Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <p className="font-semibold text-amber-950">
                {isHi 
                  ? 'Search Console में "Domain" नहीं बल्कि "URL Prefix" चुनें!' 
                  : 'Important: Choose "URL prefix" instead of "Domain" in Search Console!'}
              </p>
              <p>
                {isHi
                  ? 'अगर आप Domain विकल्प चुनेंगे तो DNS रिकॉर्ड मांगता है जो Cloud Run ऐप में सीधे संभव नहीं होता। "URL prefix" विकल्प से यह तुरंत 1 सेकंड में वेरिफाई हो जाता है।'
                  : 'Domain verification requires DNS records. "URL prefix" supports HTML tag or Google Analytics verification seamlessly.'}
              </p>
            </div>
          </div>

          {/* Quick Copy URL Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHi ? 'आपकी वेबसाइट का सही लिंक (URL)' : 'Your Live Website URL'}
            </span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-white px-3 py-2 rounded-lg border border-slate-200 flex-1 font-mono text-slate-800 break-all select-all">
                {siteUrl}
              </code>
              <button
                onClick={() => copyToClipboard(siteUrl, 'site-url')}
                className="px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedIndex === 'site-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'site-url' ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'कॉपी करें' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Step by Step Flow */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'सर्च कंसोल में जोड़ने के 4 आसान चरण:' : '4 Simple Steps to Connect:'}</span>
            </h3>

            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">1</span>
                  {isHi ? 'Search Console खोलें' : 'Open Google Search Console'}
                </span>
                <a
                  href="https://search.google.com/search-console/welcome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  <span>search.google.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-600">
                {isHi 
                  ? 'ऊपर दिए गए लिंक पर जाएं और अपनी Gmail ID / Google Account से लॉगिन करें।' 
                  : 'Go to Search Console and sign in with your Google account.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">2</span>
                {isHi ? '"URL prefix" चुनें और लिंक पेस्ट करें' : 'Select "URL prefix" and paste URL'}
              </span>
              <p className="text-xs text-slate-600">
                {isHi 
                  ? 'स्क्रीन पर दो बॉक्स दिखेंगे: Domain और URL prefix। दाईं ओर "URL prefix" वाले बॉक्स में आपकी वेबसाइट का पूरा लिंक पेस्ट करें:' 
                  : 'Between "Domain" and "URL prefix", select the URL prefix box on the right and paste:'}
              </p>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-blue-700 select-all">
                {siteUrl}
              </div>
              <p className="text-xs text-slate-500">
                {isHi ? 'फिर "Continue" पर क्लिक करें।' : 'Then click "Continue".'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">3</span>
                {isHi ? 'वेरीफिकेशन तरीका: "HTML tag" चुनें' : 'Verification Method: Select "HTML tag"'}
              </span>
              <p className="text-xs text-slate-600">
                {isHi 
                  ? 'वेरीफाई करने के विकल्पों में "HTML tag" पर क्लिक करें। Google आपको ऐसा एक कोड देगा:' 
                  : 'Under other verification methods, choose "HTML tag". Google will show a meta tag like:'}
              </p>
              <div className="p-2.5 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg">
                &lt;meta name="google-site-verification" content="XYZ123..." /&gt;
              </div>
              <p className="text-xs text-slate-600">
                {isHi
                  ? 'इस कोड में जो content का कोड है, उसे कॉपी करके हमें बता दीजिए, हम 1 सेकंड में आपकी वेबसाइट के कोड में जोड़ देंगे! इसके बाद Search Console में "Verify" बटन दबाते ही वेबसाइट वेरिफाई हो जाएगी।'
                  : 'Copy the verification code or share it in chat, and it will be embedded directly in your app. Then click Verify.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">4</span>
                {isHi ? 'Sitemap सबमिट करें (अति महत्वपूर्ण)' : 'Submit Sitemap (Crucial)'}
              </span>
              <p className="text-xs text-slate-600">
                {isHi
                  ? 'वेरीफाई होने के बाद बाएं मेनू में "Sitemaps" पर क्लिक करें। वहां "Add a new sitemap" में केवल लिखें:'
                  : 'In the left sidebar, click "Sitemaps". In the input box, type:'}
              </p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 font-mono">
                  sitemap.xml
                </code>
                <button
                  onClick={() => copyToClipboard('sitemap.xml', 'sitemap')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedIndex === 'sitemap' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 'sitemap' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'कॉपी' : 'Copy')}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'और Submit बटन दबाएं। इससे Google आपकी वेबसाइट को तुरंत स्कैन (Crawl) करना शुरू कर देता है।'
                  : 'Then press Submit. Google will automatically start crawling all pages.'}
              </p>
            </div>

          </div>

          {/* Readiness Checklist */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-900 block">
              {isHi ? 'आपकी वेबसाइट की वर्तमान तैयारी स्थिति:' : 'Website Current SEO Readiness:'}
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>robots.txt फाइल एक्टिव है (/robots.txt)</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>sitemap.xml फाइल तैयार है (/sitemap.xml)</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Googlebot Index & Follow परमिशन एक्टिव है</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Schema.org WebApplication रिच स्निपेट डेटा एक्टिव है</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://search.google.com/search-console/welcome"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{isHi ? 'Google Search Console खोलें' : 'Open Search Console'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors"
          >
            {isHi ? 'समझ गया (बंद करें)' : 'Got it (Close)'}
          </button>
        </div>

      </div>
    </div>
  );
};
