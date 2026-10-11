import React from 'react';
import { Language } from '../types/service';
import { Landmark, Globe, Ticket, Mail, FileText, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenTokenModal: () => void;
  onOpenGmailModal: () => void;
  onOpenDocsModal: () => void;
  onOpenAdminModal: () => void;
  onSelectNav: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenTokenModal,
  onOpenGmailModal,
  onOpenDocsModal,
  onOpenAdminModal,
  onSelectNav,
  activeSection
}) => {
  const isHi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Primary Action Group) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => onSelectNav('services')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 via-slate-800 to-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
                {isHi ? 'डिजिटल सेवा केंद्र' : 'Digital Seva Kendra'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                {isHi ? 'ऑनलाइन नागरिक इंटरनेट सेवाएं' : 'National Citizen Internet Services'}
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button 
              onClick={() => onSelectNav('services')} 
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'services' ? 'text-amber-700 font-semibold' : ''}`}
            >
              {isHi ? 'सभी सेवाएं' : 'All Services'}
            </button>
            <button 
              onClick={() => onSelectNav('tools')} 
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'tools' ? 'text-amber-700 font-semibold' : ''}`}
            >
              {isHi ? 'फोटो व फॉर्म टूल' : 'Photo & Form Tools'}
            </button>
            <button 
              onClick={() => onSelectNav('bills')} 
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'bills' ? 'text-amber-700 font-semibold' : ''}`}
            >
              {isHi ? 'बिजली व बिल भुगतान' : 'Utility & Bills'}
            </button>
            <button 
              onClick={() => onSelectNav('status')} 
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'status' ? 'text-amber-700 font-semibold' : ''}`}
            >
              {isHi ? 'आवेदन स्थिति जांचें' : 'Track Application'}
            </button>
            <button 
              onClick={() => onSelectNav('helpline')} 
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'helpline' ? 'text-amber-700 font-semibold' : ''}`}
            >
              {isHi ? 'आपातकालीन हेल्पलाइन' : 'Helplines'}
            </button>
          </nav>

          {/* Zone 3: Primary Action & Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Google Docs Hub Button */}
            <button
              onClick={onOpenDocsModal}
              title={isHi ? 'गूगल डॉक्स दस्तावेज़ केंद्र' : 'Open Google Docs Hub'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 text-blue-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{isHi ? 'गूगल डॉक्स' : 'Google Docs'}</span>
            </button>

            {/* Gmail Hub Button */}
            <button
              onClick={onOpenGmailModal}
              title={isHi ? 'जीमेल इनबॉक्स व संदेश केंद्र' : 'Open Gmail Hub'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-rose-200 bg-rose-50/80 hover:bg-rose-100/90 text-rose-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">{isHi ? 'जीमेल' : 'Gmail'}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdminModal}
              title={isHi ? 'प्राप्त टोकन व आवेदन पोर्टल (Admin)' : 'Admin Token Registry'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-amber-300 bg-amber-50/90 hover:bg-amber-100 text-amber-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">{isHi ? 'टोकन रिकॉर्ड' : 'Token Records'}</span>
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={() => onLanguageChange(isHi ? 'en' : 'hi')}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHi ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenTokenModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'सेवा टोकन बुक करें' : 'Book Service Token'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
