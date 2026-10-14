import React, { useState, useMemo, useEffect } from 'react';
import { Language, ServiceCategory, ServiceItem } from './types/service';
import { SERVICES_DATA } from './data/servicesData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceCard } from './components/ServiceCard';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { PhotoResizerTool } from './components/PhotoResizerTool';
import { BillPaymentModal } from './components/BillPaymentModal';
import { StatusTracker } from './components/StatusTracker';
import { HelplineDirectory } from './components/HelplineDirectory';
import { ResumeBuilderModal } from './components/ResumeBuilderModal';
import { GmailHubModal } from './components/GmailHubModal';
import { GoogleDocsHubModal } from './components/GoogleDocsHubModal';
import { GoogleSearchConsoleGuideModal } from './components/GoogleSearchConsoleGuideModal';
import { AdminTokensPortal } from './components/AdminTokensPortal';
import { Footer } from './components/Footer';
import { WebsiteShareModal } from './components/WebsiteShareModal';
import { 
  Zap, 
  FileText, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Ticket, 
  HelpCircle,
  AlertCircle,
  FileCheck2,
  Clock,
  ArrowRight,
  Mail,
  GraduationCap,
  Heart
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [activeSection, setActiveSection] = useState<string>('services');

  const [savedServiceIds, setSavedServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jan_seva_saved_services');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jan_seva_saved_services', JSON.stringify(savedServiceIds));
    } catch (err) {
      console.warn('Failed to save saved services:', err);
    }
  }, [savedServiceIds]);

  const handleToggleSaveService = (service: ServiceItem) => {
    setSavedServiceIds(prev =>
      prev.includes(service.id)
        ? prev.filter(id => id !== service.id)
        : [...prev, service.id]
    );
  };

  const savedServices = useMemo(() => {
    return SERVICES_DATA.filter(service => savedServiceIds.includes(service.id));
  }, [savedServiceIds]);

  // Modals state
  const [selectedDetailService, setSelectedDetailService] = useState<ServiceItem | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [initialTokenService, setInitialTokenService] = useState<ServiceItem | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState<boolean>(false);
  const [gmailPrefill, setGmailPrefill] = useState<{ recipient: string; subject: string; body: string }>({
    recipient: '',
    subject: '',
    body: ''
  });
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [docsTemplate, setDocsTemplate] = useState<{ title: string; content: string } | undefined>(undefined);
  const [isSearchConsoleModalOpen, setIsSearchConsoleModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const isHi = language === 'hi';

  const handleOpenDocsWithContent = (title: string, content: string) => {
    setDocsTemplate({ title, content });
    setIsDocsModalOpen(true);
  };

  const handleOpenGmailWithContent = (recipient: string, subject: string, body: string) => {
    setGmailPrefill({ recipient, subject, body });
    setIsGmailModalOpen(true);
  };

  // Filter services with intelligent multilingual and synonym-aware search
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      if (selectedCategory === 'all') return SERVICES_DATA;
      return SERVICES_DATA.filter((item) => item.category === selectedCategory);
    }

    // Split search into words for multi-term query support
    const queryTokens = q.split(/[\s,]+/).filter(Boolean);

    // Common synonyms/aliases in Hinglish, phonetic transliteration, and colloquial terms
    const synonymMap: Record<string, string[]> = {
      nokri: ['naukri', 'job', 'sarkari', 'bharti', 'नौकरी'],
      naukari: ['naukri', 'job', 'sarkari', 'bharti', 'नौकरी'],
      naukri: ['job', 'sarkari', 'bharti', 'नौकरी'],
      jop: ['job', 'naukri', 'नौकरी'],
      job: ['naukri', 'sarkari', 'नौकरी'],
      adhar: ['aadhaar', 'aadhar', 'आधार'],
      aadhar: ['aadhaar', 'adhar', 'आधार'],
      aadhaar: ['aadhar', 'adhar', 'आधार'],
      pan: ['pancard', 'पैन'],
      pancard: ['pan', 'पैन'],
      bijli: ['electricity', 'बिजली', 'uppcl', 'light'],
      light: ['bijli', 'electricity', 'बिजली'],
      khatoni: ['khatauni', 'khasra', 'bhulekh', 'खतौनी', 'भूलेख'],
      khasara: ['khasra', 'khatauni', 'bhulekh', 'खसरा'],
      bhoolekh: ['bhulekh', 'khasra', 'khatauni', 'भूलेख'],
      bhulekh: ['khasra', 'khatauni', 'भूलेख'],
      rashan: ['ration', 'nfsa', 'राशन'],
      ration: ['rashan', 'राशन'],
      jati: ['caste', 'जाति'],
      niwas: ['domicile', 'residence', 'निवास'],
      kisan: ['pm kisan', 'किसान'],
      shram: ['eshram', 'मजदूर', 'श्रम'],
      cv: ['resume', 'biodata', 'सीवी'],
      dl: ['driving', 'licence', 'license', 'सारथी', 'डीएल'],
      anya: ['other', 'अन्य', 'aanya', 'other-services'],
      aanya: ['other', 'अन्य', 'anya', 'other-services'],
      pf: ['epf', 'epfo', 'uan', 'पीएपफ', 'प्रोविडेंट फंड'],
      epf: ['pf', 'epfo', 'uan', 'पीएपफ'],
      uan: ['pf', 'epf', 'epfo', 'यूएएन'],
      tds: ['tax', 'income tax', 'itr', 'form 16', 'टैक्स', 'टीडीएस', 'आयकर'],
      tax: ['tds', 'income tax', 'itr', 'टैक्स', 'आयकर'],
      scolarship: ['scholarship', 'chatravritti', 'छात्रवृत्ति'],
      skolarship: ['scholarship', 'chatravritti', 'छात्रवृत्ति'],
      chatravritti: ['scholarship', 'छात्रवृत्ति'],
      voter: ['voter id', 'epic', 'वोटर'],
      result: ['sarkari', 'रिजल्ट'],
      bharti: ['sarkari', 'job', 'भर्ती']
    };

    // Expand search terms with recognized synonyms
    const expandedTerms = new Set<string>();
    expandedTerms.add(q);
    queryTokens.forEach(token => {
      expandedTerms.add(token);
      if (synonymMap[token]) {
        synonymMap[token].forEach(s => expandedTerms.add(s));
      }
    });

    const isMatch = (item: ServiceItem) => {
      const combinedCorpus = [
        item.titleHi,
        item.titleEn,
        item.shortDescHi,
        item.shortDescEn,
        item.departmentHi,
        item.departmentEn,
        item.category,
        item.badgeHi || '',
        item.badgeEn || '',
        ...(item.searchKeywords || [])
      ].join(' ').toLowerCase();

      // Direct match
      if (combinedCorpus.includes(q)) return true;

      // Token / synonym match
      for (const term of expandedTerms) {
        if (combinedCorpus.includes(term)) return true;
      }
      return false;
    };

    // If specific category is selected, check category matches first
    if (selectedCategory !== 'all') {
      const categoryMatches = SERVICES_DATA.filter(
        (item) => item.category === selectedCategory && isMatch(item)
      );
      if (categoryMatches.length > 0) {
        return categoryMatches;
      }
    }

    // Otherwise search across all services
    return SERVICES_DATA.filter(isMatch);
  }, [selectedCategory, searchQuery]);

  const handleSelectNav = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'bills') {
      setIsBillModalOpen(true);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestAssistanceFromDetail = (service: ServiceItem) => {
    setSelectedDetailService(null);
    setInitialTokenService(service);
    setIsTokenModalOpen(true);
  };

  const handleFocusSearch = () => {
    const el = document.getElementById('main-search-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        handleFocusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectServiceItem = (service: ServiceItem) => {
    if (service.id === 'electricity-bill') {
      setIsBillModalOpen(true);
    } else if (service.id === 'resume-biodata-maker') {
      setIsResumeModalOpen(true);
    } else {
      setSelectedDetailService(service);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenTokenModal={() => {
          setInitialTokenService(null);
          setIsTokenModalOpen(true);
        }}
        onOpenGmailModal={() => {
          setGmailPrefill({ recipient: '', subject: '', body: '' });
          setIsGmailModalOpen(true);
        }}
        onOpenDocsModal={() => {
          setDocsTemplate(undefined);
          setIsDocsModalOpen(true);
        }}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onSelectNav={handleSelectNav}
        activeSection={activeSection}
      />

      {/* Hero with Search and Category Filter */}
      <Hero
        language={language}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('services');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        totalServicesCount={SERVICES_DATA.length}
        filteredServices={filteredServices}
        onSelectService={handleSelectServiceItem}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Quick Utility Feature Banners */}
        <section className="max-w-4xl mx-auto">
          {/* Primary Feature: Sarkari Naukri & Results Hub */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-indigo-500/30">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {isHi ? 'प्राथमिक सेवा' : 'Primary Service'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {isHi ? 'सरकारी नौकरी व रिजल्ट्स' : 'Sarkari Naukri & Results'}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
                {isHi
                  ? 'एसएससी, रेलवे, पुलिस, शिक्षक भर्ती, एडमिट कार्ड व नवीनतम सरकारी रिजल्ट्स एक क्लिक में देखें।'
                  : 'Latest central & state govt recruitments, SSC, Railway, Police vacancies & admit cards.'}
              </p>
            </div>
            <button
              onClick={() => {
                const sarkariItem = SERVICES_DATA.find(s => s.id === 'sarkari-results-jobs');
                if (sarkariItem) {
                  setSelectedDetailService(sarkariItem);
                } else {
                  setSelectedCategory('jobs');
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <span>{isHi ? 'सरकारी नौकरियां देखें' : 'View Sarkari Jobs'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Section 1: All Online Services Directory */}
        <section id="services" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isHi ? 'आधिकारिक सेवा सूची' : 'Service Directory'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isHi ? 'ऑनलाइन नागरिक इंटरनेट सेवाएं' : 'Citizen Internet Services'}
              </h2>
            </div>
            
            <div className="text-xs text-slate-500 font-medium">
              <span>{isHi ? 'प्रदर्शित सेवाएं:' : 'Showing:'} </span>
              <strong className="text-slate-900 tabular-nums">{filteredServices.length}</strong> / {SERVICES_DATA.length}
            </div>
          </div>

          {/* My Saved Services (Favorites) Section */}
          {savedServices.length > 0 && searchQuery.trim() === '' && selectedCategory === 'all' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-50/80 via-amber-50/50 to-orange-50/60 border border-rose-200/80 shadow-sm space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {isHi ? 'मेरी सहेजी गई सेवाएं (My Saved Services)' : 'My Saved Services'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {isHi ? 'आपके पसंदीदा व बार-बार उपयोग होने वाले शॉर्टकट' : 'Your frequently used and bookmarked citizen services'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-200 text-rose-900 tabular-nums">
                  {savedServices.length} {isHi ? 'सहेजी गई' : 'Saved'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {savedServices.map((service) => (
                  <ServiceCard
                    key={`saved-${service.id}`}
                    service={service}
                    language={language}
                    onSelectService={handleSelectServiceItem}
                    isSaved={true}
                    onToggleSave={handleToggleSaveService}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Search Result Feedback Banner */}
          {searchQuery.trim().length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 text-amber-950 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{isHi ? 'सक्रिय खोज' : 'Active Search'}</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">
                  <span>{isHi ? 'खोजा गया शब्द:' : 'Query:'} </span>
                  <strong className="text-amber-950 bg-white/90 px-2 py-0.5 rounded border border-amber-300 font-bold">
                    "{searchQuery}"
                  </strong>
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                    {filteredServices.length} {isHi ? 'सेवाएं' : 'found'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 transition-colors shadow-2xs cursor-pointer"
              >
                {isHi ? 'खोज हटाएं (Clear Search)' : 'Clear Search'}
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  language={language}
                  onSelectService={handleSelectServiceItem}
                  isSaved={savedServiceIds.includes(service.id)}
                  onToggleSave={handleToggleSaveService}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {isHi ? 'कोई सेवा नहीं मिली' : 'No matching services found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isHi
                  ? 'कृपया अन्य कीवर्ड खोजें या सभी श्रेणियों का चयन करें।'
                  : 'Try searching with another keyword or reset the category filter.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {isHi ? 'सभी सेवाएं दिखाएं' : 'Show All Services'}
              </button>
            </div>
          )}
        </section>

        {/* Section 2: Photo Resizer Tool */}
        <section id="tools" className="scroll-mt-20">
          <PhotoResizerTool language={language} />
        </section>

        {/* Section 3: Application Status Tracker */}
        <section id="status" className="scroll-mt-20">
          <StatusTracker language={language} />
        </section>

        {/* Section 4: Emergency Helplines Directory */}
        <section id="helpline" className="scroll-mt-20">
          <HelplineDirectory language={language} />
        </section>

      </main>

      {/* Footer */}
      <Footer 
        language={language} 
        onSelectNav={handleSelectNav} 
        onOpenSearchConsoleModal={() => setIsSearchConsoleModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Modals */}
      {selectedDetailService && (
        <ServiceDetailModal
          service={selectedDetailService}
          language={language}
          onClose={() => setSelectedDetailService(null)}
          onRequestAssistance={handleRequestAssistanceFromDetail}
        />
      )}

      {isTokenModalOpen && (
        <ServiceRequestModal
          language={language}
          initialService={initialTokenService}
          onClose={() => {
            setIsTokenModalOpen(false);
            setInitialTokenService(null);
          }}
          onEmailToken={(subj, body) => {
            setIsTokenModalOpen(false);
            handleOpenGmailWithContent('', subj, body);
          }}
        />
      )}

      {isBillModalOpen && (
        <BillPaymentModal
          language={language}
          onClose={() => setIsBillModalOpen(false)}
          onEmailReceipt={(subj, body) => {
            setIsBillModalOpen(false);
            handleOpenGmailWithContent('', subj, body);
          }}
        />
      )}

      {isResumeModalOpen && (
        <ResumeBuilderModal
          language={language}
          onClose={() => setIsResumeModalOpen(false)}
          onExportToGoogleDocs={(title, content) => {
            setIsResumeModalOpen(false);
            handleOpenDocsWithContent(title, content);
          }}
        />
      )}

      {isGmailModalOpen && (
        <GmailHubModal
          language={language}
          prefilledRecipient={gmailPrefill.recipient}
          prefilledSubject={gmailPrefill.subject}
          prefilledBody={gmailPrefill.body}
          onClose={() => setIsGmailModalOpen(false)}
        />
      )}

      {isDocsModalOpen && (
        <GoogleDocsHubModal
          language={language}
          initialTemplate={docsTemplate}
          onClose={() => {
            setIsDocsModalOpen(false);
            setDocsTemplate(undefined);
          }}
        />
      )}

      {isSearchConsoleModalOpen && (
        <GoogleSearchConsoleGuideModal
          language={language}
          onClose={() => setIsSearchConsoleModalOpen(false)}
        />
      )}

      {isAdminModalOpen && (
        <AdminTokensPortal
          language={language}
          onClose={() => setIsAdminModalOpen(false)}
          onSendEmailToCitizen={(recipient, subject, body) => {
            setIsAdminModalOpen(false);
            handleOpenGmailWithContent(recipient, subject, body);
          }}
        />
      )}

      {isShareModalOpen && (
        <WebsiteShareModal
          language={language}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

    </div>
  );
}
