import React, { useState } from 'react';
import { Language, ServiceCategory } from '../types/service';
import { Search, ShieldCheck, Clock, FileCheck, Layers, X, Sparkles, Share2, Check, Copy } from 'lucide-react';

interface HeroProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  totalServicesCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalServicesCount
}) => {
  const isHi = language === 'hi';

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleCopyPortalInfo = () => {
    const textToCopy = `डिजिटल सेवा केंद्र (Digital Seva Kendra) - सरकारी नौकरी, आधार, पैन कार्ड, खसरा-खतौनी, बिजली बिल व ऑनलाइन नागरिक सेवाएं: ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const categories: { id: ServiceCategory; labelHi: string; labelEn: string }[] = [
    { id: 'all', labelHi: 'सभी सेवाएं', labelEn: 'All Services' },
    { id: 'jobs', labelHi: 'सरकारी नौकरी व रिजल्ट', labelEn: 'Sarkari Jobs & Results' },
    { id: 'identity', labelHi: 'आधार व पहचान कार्ड', labelEn: 'Aadhaar & Identity' },
    { id: 'certificates', labelHi: 'आय, जाति, निवास व खतौनी', labelEn: 'Certificates & Land' },
    { id: 'welfare', labelHi: 'पीएम किसान व सरकारी योजनाएं', labelEn: 'Welfare Schemes' },
    { id: 'bills', labelHi: 'बिजली बिल व यूटिलिटी', labelEn: 'Utility & Bills' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-slate-50 border-b border-slate-200 pt-6 pb-10 sm:pt-10 sm:pb-14">
      {/* Subtle geometric civic backdrop pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Easy Portal Search Name Highlight Box */}
        <div className="max-w-2xl mx-auto mb-6 p-3 sm:p-3.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-amber-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ring-4 ring-amber-50">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-[11px] font-semibold text-slate-500">
                {isHi ? 'वेबसाइट का आसान नाम (Google या वेब पर सर्च करें):' : 'Easy Web Search Name (Search on Web / Google):'}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-amber-800 tracking-tight">डिजिटल सेवा केंद्र</span>
                <span className="text-slate-300 font-normal">|</span>
                <span className="text-indigo-900 tracking-tight">Digital Seva Kendra</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCopyPortalInfo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-colors cursor-pointer shrink-0 active:scale-95"
            title="पोर्टल का नाम और लिंक कॉपी करें"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{isHi ? 'नाम व लिंक कॉपी हो गया!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-700" />
                <span>{isHi ? 'नाम व लिंक कॉपी करें' : 'Copy Name & Link'}</span>
              </>
            )}
          </button>
        </div>

        {/* National civic banner headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? 'डिजिटल इंडिया व जन सेवा केंद्र नागरिक पोर्टल' : 'Digital India & Citizen Services Unified Portal'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
            {isHi 
              ? 'समस्त ऑनलाइन इंटरनेट सेवाएं एवं नागरिक सहायता केंद्र'
              : 'All Citizen Internet Services & E-Governance Portal'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {isHi
              ? 'सरकारी नौकरी, आधार कार्ड, नया पैन कार्ड, आय-जाति-निवास प्रमाण पत्र, पीएम किसान, राशन कार्ड, बिजली बिल भुगतान एवं फॉर्म भरने के सभी आधिकारिक साधन एक ही मंच पर।'
              : 'Direct access to Sarkari Naukri, Aadhaar, PAN card, caste/income certificates, PM Kisan, land records, electricity bill pay, and government application services.'}
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="mt-7 max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-sm rounded-xl bg-white border border-slate-300 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isHi ? 'सरल नाम से खोजें (जैसे: sarkari naukri, aadhaar, pan card, bijli bill, khasra, kisan)...' : 'Search easily (e.g. sarkari naukri, aadhaar, pan card, bijli bill, khasra, kisan)...'}
              className="w-full py-3.5 pl-3 pr-10 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-500">
            <span className="font-medium text-slate-700">{isHi ? 'आसान खोज:' : 'Popular:'}</span>
            {['सरकारी नौकरी', 'आधार कार्ड', 'पैन कार्ड', 'खसरा खतौनी', 'बिजली बिल', 'पीएम किसान', 'जाति प्रमाण पत्र', 'राशन कार्ड', 'बायोडाटा'].map((item) => (
              <button
                key={item}
                onClick={() => onSearchChange(item)}
                className="text-slate-700 hover:text-amber-800 hover:bg-amber-100/70 px-2 py-0.5 rounded-md border border-slate-200/80 bg-white/80 transition-colors shadow-2xs font-medium"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Search helper tip */}
          <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
            <span>💡 {isHi ? 'सुविधा: आप nokri, aadhar, bijli, khasra, pan जैसे आसान और बोलचाल के शब्दों से भी खोज सकते हैं।' : 'Tip: You can search using simple words like nokri, aadhar, bijli, khasra, pan.'}</span>
          </div>
        </div>

        {/* Interactive Category Segmented Controls */}
        <div className="mt-8 overflow-x-auto scrollbar-none pb-2">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 min-w-max p-1 bg-slate-200/60 rounded-xl border border-slate-300/70">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  {isHi ? cat.labelHi : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Proof & Civic Trust Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-200/80">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-slate-200/60">
            <div className="p-2 rounded-md bg-amber-50 text-amber-700 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {totalServicesCount}+ {isHi ? 'ऑनलाइन सेवाएं' : 'Services'}
              </div>
              <div className="text-xs text-slate-500">
                {isHi ? 'सभी प्रमुख सरकारी पोर्टल' : 'All official portals'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-slate-200/60">
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-700 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {isHi ? '100% प्रामाणिक लिंक' : '100% Verified'}
              </div>
              <div className="text-xs text-slate-500">
                {isHi ? 'सुरक्षित .gov.in व .nic.in' : 'Direct .gov & .nic domains'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-slate-200/60">
            <div className="p-2 rounded-md bg-blue-50 text-blue-700 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {isHi ? '24x7 डिजिटल सहायता' : '24x7 Self-Service'}
              </div>
              <div className="text-xs text-slate-500">
                {isHi ? 'स्टेप-बाई-स्टेप फॉर्म गाइड' : 'Step-by-step guidance'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-slate-200/60">
            <div className="p-2 rounded-md bg-purple-50 text-purple-700 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {isHi ? 'फोटो व फॉर्म टूल्स' : 'Free Utilities'}
              </div>
              <div className="text-xs text-slate-500">
                {isHi ? '20KB-50KB फोटो रीसाइज़र' : 'Online doc compressor'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
