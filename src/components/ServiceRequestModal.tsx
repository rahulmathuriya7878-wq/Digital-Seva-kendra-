import React, { useState } from 'react';
import { Language, ServiceItem, TokenBooking } from '../types/service';
import { SERVICES_DATA } from '../data/servicesData';
import { saveTokenBooking } from '../lib/tokenService';
import { 
  X, 
  Ticket, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  Phone, 
  User, 
  Copy, 
  Check, 
  ShieldCheck, 
  MapPin,
  Loader2,
  MessageCircle
} from 'lucide-react';

interface ServiceRequestModalProps {
  language: Language;
  initialService?: ServiceItem | null;
  onClose: () => void;
  onEmailToken?: (subject: string, body: string) => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  language,
  initialService,
  onClose
}) => {
  const isHi = language === 'hi';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(initialService?.id || SERVICES_DATA[0].id);

  const [booking, setBooking] = useState<TokenBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  const handlePhoneChange = (val: string) => {
    // Digits only
    const cleanDigits = val.replace(/\D/g, '').slice(0, 10);
    setPhone(cleanDigits);
    if (cleanDigits.length > 0 && cleanDigits.length < 10) {
      setPhoneError(isHi ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter valid 10-digit mobile number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError(isHi ? '10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Valid 10-digit mobile number is required');
      return;
    }

    setIsSubmitting(true);
    const currentService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const tokenNum = `DSK-${new Date().getFullYear()}-${randomSuffix}`;
    const refNum = 'REF-' + Math.floor(100000 + Math.random() * 900000);

    const todayFormatted = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newBooking: TokenBooking = {
      tokenNumber: tokenNum,
      applicantName: name.trim(),
      mobileNumber: cleanPhone,
      serviceTitle: isHi ? currentService.titleHi : currentService.titleEn,
      serviceCategory: currentService.category,
      officialDepartment: isHi ? currentService.departmentHi : currentService.departmentEn,
      estimatedFee: isHi ? currentService.feeHi : currentService.feeEn,
      date: todayFormatted,
      timeSlot: 'तत्काल सेवा (Priority)',
      mode: 'online',
      referenceId: refNum,
      cityOrDistrict: district.trim() || (isHi ? 'स्थानीय जिला' : 'Local District'),
      isUrgent: false,
      notes: '',
      requiredDocuments: isHi ? currentService.requiredDocsHi : currentService.requiredDocsEn,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const docId = await saveTokenBooking(newBooking);
      newBooking.id = docId;
    } catch (err) {
      console.warn('Saved with offline fallback:', err);
    } finally {
      setIsSubmitting(false);
      setBooking(newBooking);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!booking) return;
    const summary = isHi
      ? `डिजिटल सेवा टोकन पर्ची\n--------------------------\nटोकन संख्या: ${booking.tokenNumber}\nसंदर्भ आईडी: ${booking.referenceId}\nआवेदक का नाम: ${booking.applicantName}\nमोबाइल नंबर: ${booking.mobileNumber}\nजिला/शहर: ${booking.cityOrDistrict}\nसेवा: ${booking.serviceTitle}\nविभाग: ${booking.officialDepartment || '-'}\nतारीख: ${booking.date}\n\nडिजिटल सेवा केंद्र पोर्टल`
      : `Digital Seva Token Slip\n--------------------------\nToken No: ${booking.tokenNumber}\nRef ID: ${booking.referenceId}\nApplicant: ${booking.applicantName}\nMobile No: ${booking.mobileNumber}\nDistrict: ${booking.cityOrDistrict}\nService: ${booking.serviceTitle}\nDept: ${booking.officialDepartment || '-'}\nDate: ${booking.date}\n\nDigital Seva Kendra Portal`;

    navigator.clipboard.writeText(summary);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {isHi ? 'डिजिटल सेवा टोकन जनरेटर' : 'Digital Seva Token Slip'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {isHi ? 'सत्यापित' : 'Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isHi 
                  ? 'नागरिक सेवा व ऑनलाइन फॉर्म प्राथमिकता टोकन पर्ची' 
                  : 'Instant Priority Token for Citizen & Internet Services'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {!booking ? (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* 1. Service Selection */}
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
                  {isHi ? 'आवश्यक सेवा चुनें:' : 'Select Citizen Service:'}
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-800 text-xs sm:text-sm cursor-pointer shadow-2xs"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isHi ? s.titleHi : s.titleEn} ({isHi ? s.departmentHi : s.departmentEn})
                    </option>
                  ))}
                </select>

                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>{isHi ? 'सरकारी शुल्क:' : 'Fee:'} <strong className="text-emerald-700">{isHi ? selectedService.feeHi : selectedService.feeEn}</strong></span>
                  <span>{isHi ? 'समय सीमा:' : 'Time:'} <strong className="text-slate-700">{isHi ? selectedService.processingTimeHi : selectedService.processingTimeEn}</strong></span>
                </div>
              </div>

              {/* 2. Applicant Full Name */}
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
                  {isHi ? 'आवेदक का पूरा नाम (Full Name):' : 'Applicant Full Name:'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHi ? 'आवेदक का नाम दर्ज करें...' : 'Enter full name...'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm font-medium text-slate-900"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* 3. WhatsApp Mobile Number Slot */}
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'व्हाट्सएप (WhatsApp) मोबाइल नंबर:' : 'WhatsApp Mobile Number:'}</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-medium flex items-center gap-1">
                    <span>+91</span>
                    <span className="text-slate-300">|</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    className="w-full pl-16 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-900"
                    required
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    ⚠️ {phoneError}
                  </p>
                )}
              </div>

              {/* 4. District Slot (जिला / शहर) */}
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{isHi ? 'जिला / शहर (District / City):' : 'District / City:'}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={isHi ? 'उदा: जयपुर, आगरा, पटना, लखनऊ...' : 'e.g. Jaipur, Agra, Patna, Lucknow...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Required Documents Hint */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">
                  {isHi ? 'आवश्यक दस्तावेज (सत्यापन हेतु):' : 'Required Documents (Keep Ready):'}
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {(isHi ? selectedService.requiredDocsHi : selectedService.requiredDocsEn).slice(0, 3).join(', ')}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || phone.length !== 10 || !name.trim()}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>{isHi ? 'टोकन तैयार हो रहा है...' : 'Generating Token...'}</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4 text-amber-400" />
                      <span>{isHi ? 'डिजिटल सेवा टोकन पर्ची जारी करें' : 'Generate Digital Service Token Slip'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-4">
              
              {/* Success Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    {isHi ? 'टोकन सफलतापूर्वक जनरेट हो गया!' : 'Token Successfully Generated!'}
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    {isHi ? 'आपकी प्राथमिकता टोकन पर्ची तैयार है। इसे सुरक्षित रखें।' : 'Your priority token slip is generated successfully.'}
                  </p>
                </div>
              </div>

              {/* Clean Official Token Card */}
              <div className="border-2 border-slate-900 bg-white rounded-2xl shadow-sm overflow-hidden" id="printable-token">
                
                {/* Header */}
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b-2 border-amber-500">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {isHi ? 'डिजिटल सेवा केंद्र • ई-टोकन पावती' : 'DIGITAL SEVA KENDRA • TOKEN SLIP'}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {booking.serviceTitle}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/10 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                    {booking.referenceId}
                  </span>
                </div>

                {/* Token Box */}
                <div className="p-4 bg-amber-50/60 border-b border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-amber-900 block">
                      {isHi ? 'टोकन संख्या (TOKEN NO):' : 'TOKEN NUMBER:'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                      {booking.tokenNumber}
                    </div>
                  </div>
                  <div className="p-1.5 bg-white rounded-xl border border-amber-200 shadow-2xs text-center">
                    <QrCode className="w-10 h-10 text-slate-900 mx-auto" />
                    <span className="text-[8px] font-mono text-slate-500 font-bold block">VERIFIED</span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="p-4 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'आवेदक का नाम:' : 'Applicant Name:'}</span>
                    <strong className="text-slate-900 text-sm">{booking.applicantName}</strong>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'WhatsApp नंबर:' : 'WhatsApp No:'}</span>
                    <strong className="font-mono text-emerald-800 text-sm flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      +91 {booking.mobileNumber}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'जिला / शहर:' : 'District / City:'}</span>
                    <strong className="text-slate-800 font-semibold">{booking.cityOrDistrict || '-'}</strong>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'सरकारी विभाग:' : 'Department:'}</span>
                    <span className="text-slate-800 font-medium">{booking.officialDepartment || '-'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">{isHi ? 'तारीख:' : 'Date:'}</span>
                    <span className="font-bold text-slate-900">{booking.date}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Print & Copy */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handlePrint}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isHi ? 'पर्ची प्रिंट करें' : 'Print Slip'}</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? (isHi ? 'कॉपी हो गया!' : 'Copied!') : (isHi ? 'टोकन कॉपी करें' : 'Copy Slip')}</span>
                </button>
              </div>

              {/* Bottom navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => setBooking(null)}
                  className="text-amber-800 font-semibold hover:underline cursor-pointer"
                >
                  {isHi ? '← दूसरा नया टोकन बनाएं' : '← Generate Another Token'}
                </button>
                <button
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  {isHi ? 'समाप्त करें (Close)' : 'Done (Close)'}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
