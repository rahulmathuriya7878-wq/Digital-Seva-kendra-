import React, { useState } from 'react';
import { Language } from '../types/service';
import { X, Share2, MessageCircle, Copy, Check, Send, QrCode } from 'lucide-react';

interface WebsiteShareModalProps {
  language: Language;
  onClose: () => void;
}

export const WebsiteShareModal: React.FC<WebsiteShareModalProps> = ({ language, onClose }) => {
  const isHi = language === 'hi';
  const [copied, setCopied] = useState(false);

  const portalUrl = 'https://digital-seva-kendra-seven.vercel.app/';

  const shareText = isHi
    ? `🏛 *डिजिटल एवं जन सेवा केंद्र पोर्टल* 🏛\n\nभारत के नागरिकों हेतु सभी ऑनलाइन इंटरनेट सेवाएं, प्रमाण पत्र, सरकारी योजनाएं व फॉर्म भरने का एक ही मंच।\n\n🔹 *प्रमुख सेवाएं:* \n- सरकारी नौकरी फॉर्म व रिजल्ट्स\n- PF (EPFO) व पेंशन सेवाएं\n- छात्रवृत्ति आवेदन (Scholarship)\n- आधार कार्ड डाउनलोड व पीवीसी\n- नया पैन कार्ड आवेदन\n- भूलेख / अपना खाता / जमाबंदी (UP & Rajasthan)\n- जाति, निवास व आय प्रमाण पत्र\n- श्रम कार्ड, वोटर आईडी व राशन कार्ड\n\n🌐 *पोर्टल लिंक:* ${portalUrl}\n\nअपने सभी नागरिक कार्यों और ऑनलाइन फॉर्म्स के लिए आज ही विजिट करें!`
    : `🏛 *Digital & Jan Seva Kendra Portal* 🏛\n\nSingle window digital portal for all Indian citizen online services, certificates, and government applications.\n\n🔹 *Key Services:* \n- Sarkari Jobs & Results\n- PF (EPFO) & Pension Services\n- Scholarship Applications\n- Aadhaar Services & PVC\n- New PAN Card Application\n- Bhulekh / Apna Khata / Jamabandi\n- Caste, Domicile & Income Certificates\n- Labour Card, Voter ID & Ration Card\n\n🌐 *Portal Link:* ${portalUrl}\n\nVisit today for all your digital and online citizen needs!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(portalUrl)}&text=${encodeURIComponent(isHi ? 'डिजिटल एवं जन सेवा केंद्र पोर्टल' : 'Digital & Jan Seva Kendra Portal')}`, '_blank');
  };

  const handleNativeShare = () => {
    if ('share' in navigator) {
      navigator.share({
        title: isHi ? 'डिजिटल एवं जन सेवा केंद्र पोर्टल' : 'Digital & Jan Seva Kendra Portal',
        text: shareText,
        url: portalUrl
      }).catch(() => {});
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-300/30 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isHi ? 'वेबसाइट शेयर करें' : 'Share Website'}
              </h3>
              <p className="text-xs text-slate-300">
                {isHi ? 'सोशल मीडिया व दोस्तों के साथ साझा करें' : 'Share portal with friends & family'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleTelegramShare}
              className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>
          </div>

          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'अन्य शेयर विकल्प (More Options)' : 'More Share Options'}</span>
            </button>
          )}

          {/* Copy Link Section */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">
              {isHi ? 'पोर्टल लिंक कॉपी करें:' : 'Copy Portal Link:'}
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="text"
                readOnly
                value={portalUrl}
                className="w-full bg-transparent px-2 text-xs font-mono text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'कॉपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* QR Code Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 via-white to-blue-50 border border-amber-200/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600 text-white shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {isHi ? 'मोबाइल पर स्कैन करें' : 'Scan on Mobile'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {isHi ? 'कैमरा या QR स्कैनर से स्कैन करके सीधे मोबाइल पर खोलें।' : 'Scan with mobile camera to open instantly.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {isHi ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
