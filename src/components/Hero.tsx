import React, { useState, useRef, useEffect } from 'react';
import { Language, ServiceCategory, ServiceItem } from '../types/service';
import { Search, ShieldCheck, Clock, FileCheck, Layers, X, Sparkles, ChevronRight, Zap, ArrowRight, ExternalLink } from 'lucide-react';

interface HeroProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  totalServicesCount: number;
  filteredServices?: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalServicesCount,
  filteredServices = [],
  onSelectService
}) => {
  const isHi = language === 'hi';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { id: ServiceCategory; labelHi: string; labelEn: string }[] = [
    { id: 'all', labelHi: 'सभी सेवाएं', labelEn: 'All Services' },
    { id: 'jobs', labelHi: 'सरकारी नौकरी व रिजल्ट', labelEn: 'Sarkari Jobs & Results' },
    { id: 'identity', labelHi: 'आधार व पहचान कार्ड', labelEn: 'Aadhaar & Identity' },
    { id: 'certificates', labelHi: 'जाति, निवास व खतौनी', labelEn: 'Certificates & Land' },
    { id: 'pf-tax', labelHi: 'PF व TDS / टैक्स सेवाएं', labelEn: 'PF & TDS / Tax Services' },
    { id: 'welfare', labelHi: 'पीएम किसान व सरकारी योजनाएं', labelEn: 'Welfare Schemes' },
    { id: 'bills', labelHi: 'बिजली बिल व यूटिलिटी', labelEn: 'Utility & Bills' }
  ];

  const handleSelectDropdownItem = (service: ServiceItem) => {
    setIsDropdownOpen(false);
    if (onSelectService) {
      onSelectService(service);
    } else {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Preview matches to show in live dropdown (top 5)
  const previewMatches = searchQuery.trim() ? filteredServices.slice(0, 5) : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-slate-50 border-b border-slate-200 pt-6 pb-10 sm:pt-10 sm:pb-14">
      {/* Subtle geometric civic backdrop pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* National civic banner headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? 'डिजिटल एवं जन सेवा केंद्र पोर्टल' : 'Digital & Jan Seva Kendra Portal'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
            {isHi 
              ? 'समस्त ऑनलाइन इंटरनेट सेवाएं एवं नागरिक सहायता केंद्र'
              : 'All Citizen Internet Services & E-Governance Portal'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {isHi
              ? 'सरकारी नौकरी, आधार कार्ड, नया पैन कार्ड, जाति व निवास प्रमाण पत्र, पीएम किसान, राशन कार्ड, बिजली बिल भुगतान एवं फॉर्म भरने के सभी आधिकारिक साधन एक ही मंच पर।'
              : 'Direct access to Sarkari Naukri, Aadhaar, PAN card, caste and domicile certificates, PM Kisan, land records, electricity bill pay, and government application services.'}
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="mt-7 max-w-2xl mx-auto relative" ref={searchContainerRef}>
          <form 
            onSubmit={handleFormSubmit}
            className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-amber-500/50 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-500/20 transition-all p-1.5"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder={isHi ? 'सेवा खोजें: (जैसे आधार, पैन कार्ड, सरकारी नौकरी, खतौनी, राशन कार्ड)...' : 'Search service: (e.g. Aadhaar, PAN card, Sarkari Naukri, Khasra)...'}
              className="w-full py-3 pl-3 pr-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setIsDropdownOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors mr-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'खोजें' : 'Search'}</span>
            </button>
          </form>

          {/* Real-time Interactive Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>
                  {previewMatches.length > 0 
                    ? (isHi ? '⚡ त्वरित परिणाम (क्लिक करके सीधे खोलें):' : '⚡ Instant Results (Click to open directly):')
                    : (isHi ? 'खोज परिणाम' : 'Search Results')}
                </span>
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {filteredServices.length} {isHi ? 'कुल परिणाम' : 'total'}
                </span>
              </div>

              {previewMatches.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {previewMatches.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleSelectDropdownItem(service)}
                      className="w-full text-left p-3.5 hover:bg-amber-50/70 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-amber-800 truncate">
                            {isHi ? service.titleHi : service.titleEn}
                          </span>
                          {service.badgeHi && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                              {isHi ? service.badgeHi : service.badgeEn}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {isHi ? service.shortDescHi : service.shortDescEn}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                          <span className="text-slate-600 font-medium">
                            {isHi ? service.departmentHi : service.departmentEn}
                          </span>
                          <span className="text-emerald-700 font-semibold">
                            {isHi ? service.feeHi : service.feeEn}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/70 group-hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors">
                        <span>{isHi ? 'देखें' : 'View'}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">
                    {isHi 
                      ? 'इस नाम से कोई सेवा नहीं मिली। अन्य शब्द लिखकर देखें (उदा. आधार, पैन, खतौनी, राशन)...' 
                      : 'No services found for this query. Try Aadhaar, PAN, Khasra, Ration, etc.'}
                  </p>
                </div>
              )}

              {/* Dropdown footer with scroll button */}
              <div className="p-3 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {isHi ? 'नीचे पूरी सेवा सूची देखें:' : 'View in full services list:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-bold text-slate-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isHi ? `सभी ${filteredServices.length} परिणाम देखें` : `View all ${filteredServices.length} results`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Search Chips */}
          <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              {isHi ? 'त्वरित खोज:' : 'Quick Search:'}
            </span>
            {['सरकारी नौकरी', 'आधार कार्ड', 'पैन कार्ड', 'खसरा खतौनी', 'बिजली बिल', 'पीएम किसान', 'जाति प्रमाण पत्र', 'राशन कार्ड', 'ड्राइविंग लाइसेंस', 'अन्य सेवाएं'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onSearchChange(item);
                  setIsDropdownOpen(false);
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-700 hover:text-amber-900 hover:bg-amber-100 hover:border-amber-300 px-2.5 py-1 rounded-lg border border-slate-200 bg-white transition-all shadow-2xs font-medium cursor-pointer"
              >
                {item}
              </button>
            ))}
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
