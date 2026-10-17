import React, { useState } from 'react';
import { Language } from '../types/service';
import { X, Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface WebsiteShareModalProps {
  language: Language;
  onClose: () => void;
}

export const WebsiteShareModal: React.FC<WebsiteShareModalProps> = ({ language, onClose }) => {
  const isHi = language === 'hi';
  const [copied, setCopied] = useState<boolean>(false);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold">{isHi ? 'पोर्टल शेयर करें' : 'Share Portal'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="text-slate-600">
            {isHi ? 'इस डिजिटल सेवा पोर्टल को अपने मित्रों और परिजनों के साथ सोशल मीडिया पर साझा करें:' : 'Share this digital service portal with friends and family:'}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono text-slate-700"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'कॉपी' : 'Copy')}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out Digital Seva Kendra portal: ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
