import React from 'react';
import { Language } from '../types/service';
import { Landmark, ExternalLink, ShieldCheck, Share2 } from 'lucide-react';
import { shareFullWebsiteDetails } from '../utils/shareUtils';

interface FooterProps {
  language: Language;
  onSelectNav: (sectionId: string) => void;
  onOpenSearchConsoleModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectNav, onOpenSearchConsoleModal }) => {
  const isHi = language === 'hi';

  const officialLinks = [
    { name: 'National Portal of India', url: 'https://www.india.gov.in/' },
    { name: 'DigiLocker (डिजिटल लॉकर)', url: 'https://www.digilocker.gov.in/' },
    { name: 'UMANG Citizen Services', url: 'https://web.umang.gov.in/' },
    { name: 'UIDAI myAadhaar', url: 'https://myaadhaar.uidai.gov.in/' },
    { name: 'Parivahan Sarathi', url: 'https://parivahan.gov.in/' },
    { name: 'PM Kisan Samman Nidhi', url: 'https://pmkisan.gov.in/' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-xs sm:text-sm">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {isHi ? 'डिजिटल एवं जन सेवा केंद्र पोर्टल' : 'Digital & Jan Seva Kendra Portal'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isHi
                ? 'भारत के नागरिकों हेतु सभी ऑनलाइन इंटरनेट सेवाएं, प्रमाण पत्र, सरकारी योजनाएं व फॉर्म भरने का आधिकारिक सुविधा मंच।'
                : 'Unified single-window digital access point for Indian citizen services, certificates, and utility billings.'}
            </p>
             <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => shareFullWebsiteDetails(language)}
                className="group inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:text-blue-200 font-bold text-xs transition-colors cursor-pointer"
                title={isHi ? 'वेबसाइट पूरी जानकारी सहित शेयर करें' : 'Share website with full details'}
              >
                <Share2 className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                <span>{isHi ? '💬 वेबसाइट पूरी जानकारी सहित शेयर करें' : '💬 Share Website with Details'}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              {isHi ? 'मुख्य सेवाएं' : 'Key Services'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectNav('services')} className="hover:text-white transition-colors">
                  {isHi ? 'आधार कार्ड व पहचान सेवाएं' : 'Aadhaar & Identity'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('services')} className="hover:text-white transition-colors">
                  {isHi ? 'छात्रवृत्ति आवेदन' : 'Scholarship Applications'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('bills')} className="hover:text-white transition-colors">
                  {isHi ? 'फास्टैग व भुगतान सेवाएं' : 'FASTag & Bill Services'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('tools')} className="hover:text-white transition-colors">
                  {isHi ? 'फोटो व हस्ताक्षर रीसाइज़र' : 'Photo Resizer Tool'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('status')} className="hover:text-white transition-colors">
                  {isHi ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application Status'}
                </button>
              </li>
            </ul>
          </div>

          {/* Official Government Portals */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              {isHi ? 'सरकारी आधिकारिक पोर्टल' : 'Official National Portals'}
            </div>
            <ul className="space-y-2 text-xs">
              {officialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Citizen Advisory */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              {isHi ? 'नागरिक सुरक्षा परामर्श' : 'Citizen Advisory'}
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHi ? 'सुरक्षित इंटरनेट नियम' : 'Safe Cyber Practice'}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isHi
                  ? 'अपना आधार OTP, बैंक पासवर्ड या UPI पिन किसी भी व्यक्ति से साझा न करें। सभी सेवाएं आधिकारिक .gov.in वेबसाइटों से ही करें।'
                  : 'Never share OTP, passwords or UPI PIN. Only access verified government websites ending with .gov.in or .nic.in.'}
              </p>
            </div>
            
            {/* Google Search Console Quick Button */}
            {onOpenSearchConsoleModal && (
              <button
                onClick={onOpenSearchConsoleModal}
                className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-[11px] text-blue-300 hover:text-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🔍</span>
                <span className="font-medium">
                  {isHi ? 'Google Search Console सेटिंग्स व गाइड' : 'Google Search Console Setup Guide'}
                </span>
              </button>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Digital Seva Portal · {isHi ? 'समस्त अधिकार सुरक्षित' : 'All Rights Reserved'}
          </div>
          <div className="flex items-center gap-4">
            <span>{isHi ? 'डिजिटल भारत' : 'Digital India'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
