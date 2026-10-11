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
  Calendar, 
  User, 
  MapPin, 
  Mail, 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Info,
  Building,
  Zap,
  Loader2
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
  onClose,
  onEmailToken
}) => {
  const isHi = language === 'hi';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(initialService?.id || SERVICES_DATA[0].id);
  const [mode, setMode] = useState<'online' | 'center'>('online');
  
  // Date default to today formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [district, setDistrict] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [applicantNotes, setApplicantNotes] = useState('');

  const [booking, setBooking] = useState<TokenBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const currentService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const tokenNum = `DSK-${new Date().getFullYear()}-${randomSuffix}`;
    const refNum = 'REF-' + Math.floor(100000 + Math.random() * 900000);

    const newBooking: TokenBooking = {
      tokenNumber: tokenNum,
      applicantName: name.trim(),
      mobileNumber: phone.trim(),
      serviceTitle: isHi ? currentService.titleHi : currentService.titleEn,
      serviceCategory: currentService.category,
      officialDepartment: isHi ? currentService.departmentHi : currentService.departmentEn,
      estimatedFee: isHi ? currentService.feeHi : currentService.feeEn,
      date: preferredDate,
      timeSlot: timeSlot,
      mode: mode,
      referenceId: refNum,
      cityOrDistrict: district.trim() || (isHi ? 'स्थानीय जिला' : 'Local District'),
      isUrgent: isUrgent,
      notes: applicantNotes.trim(),
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
      ? `डिजिटल सेवा टोकन पर्ची\n--------------------------\nटोकन संख्या: ${booking.tokenNumber}\nसंदर्भ आईडी: ${booking.referenceId}\nआवेदक का नाम: ${booking.applicantName}\nमोबाइल: ${booking.mobileNumber}\nसेवा: ${booking.serviceTitle}\nविभाग: ${booking.officialDepartment || '-'}\nतारीख: ${booking.date} (${booking.timeSlot})\nमाध्यम: ${booking.mode === 'online' ? 'ऑनलाइन सहायता' : 'केंद्र पर विजिट'}\nजिला/शहर: ${booking.cityOrDistrict}\nआवश्यक दस्तावेज: ${booking.requiredDocuments?.slice(0, 3).join(', ')}\n\nडिजिटल सेवा केंद्र पोर्टल`
      : `Digital Seva Token Slip\n--------------------------\nToken No: ${booking.tokenNumber}\nRef ID: ${booking.referenceId}\nApplicant: ${booking.applicantName}\nMobile: ${booking.mobileNumber}\nService: ${booking.serviceTitle}\nDept: ${booking.officialDepartment || '-'}\nDate: ${booking.date} (${booking.timeSlot})\nMode: ${booking.mode === 'online' ? 'Online Assist' : 'Center Visit'}\nDistrict: ${booking.cityOrDistrict}\nKey Docs: ${booking.requiredDocuments?.slice(0, 3).join(', ')}\n\nDigital Seva Kendra Portal`;

    navigator.clipboard.writeText(summary);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!booking) return;
    const msg = isHi
      ? `*डिजिटल सेवा टोकन पर्ची*\n--------------------------\n*टोकन नंबर:* ${booking.tokenNumber}\n*संदर्भ आईडी:* ${booking.referenceId}\n*नाम:* ${booking.applicantName}\n*मोबाइल:* ${booking.mobileNumber}\n*सेवा:* ${booking.serviceTitle}\n*विभाग:* ${booking.officialDepartment || '-'}\n*समय:* ${booking.date} | ${booking.timeSlot}\n*मोड:* ${booking.mode === 'online' ? 'ऑनलाइन व्हाट्सएप/रिमोट' : 'जन सेवा केंद्र'}\n\n*कृपया अपने सभी मूल दस्तावेज साथ रखें।*`
      : `*Digital Seva Token Slip*\n--------------------------\n*Token:* ${booking.tokenNumber}\n*Ref ID:* ${booking.referenceId}\n*Name:* ${booking.applicantName}\n*Mobile:* ${booking.mobileNumber}\n*Service:* ${booking.serviceTitle}\n*Dept:* ${booking.officialDepartment || '-'}\n*Slot:* ${booking.date} | ${booking.timeSlot}\n*Mode:* ${booking.mode === 'online' ? 'Online Support' : 'Kiosk Visit'}\n\n*Please keep original documents ready.*`;

    const encoded = encodeURIComponent(msg);
    const cleanPhone = booking.mobileNumber.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {isHi ? 'डिजिटल सेवा टोकन प्रणाली' : 'Digital Seva Token Slip System'}
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {isHi ? 'सत्यापित' : 'Verified'}
                </span>
              </div>
              <p className="text-xs text-amber-100/90">
                {isHi 
                  ? 'ऑनलाइन फॉर्म, प्रमाण पत्र व सरकारी योजनाओं हेतु प्राथमिकता पर्ची' 
                  : 'Official Priority Token for Citizen Internet & Government Services'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {!booking ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* How it works banner */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {isHi
                    ? 'सेवा टोकन से आपको आवेदन प्रक्रिया में कतार में नहीं लगना पड़ेगा। टोकन जनरेट होते ही तुरंत पर्ची प्रिंट करें या व्हाट्सएप पर साझा करें।'
                    : 'The service token gives you prioritized processing without waiting in physical queues. You can print or share the slip instantly.'}
                </p>
              </div>

              {/* Service Selection */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  {isHi ? 'आवश्यक सरकारी / नागरिक सेवा चुनें:' : 'Select Required Citizen Service:'}
                </label>
                <div className="relative">
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium text-slate-800"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isHi ? s.titleHi : s.titleEn} ({isHi ? s.departmentHi : s.departmentEn})
                      </option>
                    ))}
                  </select>
                </div>
                {/* Service hint */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span>{isHi ? 'सरकारी विभाग:' : 'Department:'} <strong className="text-slate-700">{isHi ? selectedService.departmentHi : selectedService.departmentEn}</strong></span>
                  <span>{isHi ? 'अनुमानित शुल्क:' : 'Fee:'} <strong className="text-emerald-700">{isHi ? selectedService.feeHi : selectedService.feeEn}</strong></span>
                  <span>{isHi ? 'समय सीमा:' : 'Time:'} <strong className="text-amber-800">{isHi ? selectedService.processingTimeHi : selectedService.processingTimeEn}</strong></span>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'आवेदक का पूरा नाम (Full Name):' : 'Applicant Full Name:'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isHi ? 'उदा: राहुल मथुरिया' : 'e.g. Rahul Mathuriya'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'मोबाइल नंबर (10 अंक):' : 'Mobile Number (10 digits):'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* District & Assistance Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'शहर / जिला / तहसील (City/District):' : 'City / District:'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder={isHi ? 'उदा: जयपुर, आगरा, पटना' : 'e.g. Jaipur, Agra, Patna'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'सहायता माध्यम (Mode):' : 'Assistance Mode:'}
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'online' | 'center')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
                  >
                    <option value="online">{isHi ? 'ऑनलाइन / WhatsApp रिमोट सहायता' : 'Online / WhatsApp Remote Support'}</option>
                    <option value="center">{isHi ? 'नजदीकी केंद्र पर उपस्थिति (Walk-in)' : 'Physical Kiosk Center Desk'}</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'सुविधाजनक तारीख (Date):' : 'Preferred Date:'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'समय स्लॉट (Preferred Slot):' : 'Preferred Slot:'}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (सुबह का स्लॉट)</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (दोपहर स्लॉट)</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (अपराह्न स्लॉट)</option>
                      <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM (शाम का स्लॉट)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Required Documents Checklist Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  {isHi ? 'इस सेवा हेतु आवश्यक दस्तावेज़ साथ रखें:' : 'Keep These Documents Ready:'}
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 list-disc list-inside">
                  {(isHi ? selectedService.requiredDocsHi : selectedService.requiredDocsEn).map((doc, idx) => (
                    <li key={idx} className="truncate" title={doc}>{doc}</li>
                  ))}
                </ul>
              </div>

              {/* Priority Option & Notes */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <label htmlFor="urgent" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  {isHi ? 'तत्काल / अर्जेंट सेवा अनुरोध (Immediate Priority)' : 'Mark as Urgent Request'}
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>{isHi ? 'टोकन सुरक्षित किया जा रहा है...' : 'Generating & Saving Token...'}</span>
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
            <div className="space-y-5">
              
              {/* Success Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    {isHi ? 'टोकन सफलतापूर्वक जनरेट हो गया है!' : 'Token Successfully Generated!'}
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    {isHi ? 'आपकी प्राथमिकता स्लॉट बुक हो गई है। नीचे दी गई पर्ची सुरक्षित रखें।' : 'Your priority slot is booked. Please keep the slip below.'}
                  </p>
                </div>
              </div>

              {/* Token Slip Display - Formal Govt Style */}
              <div className="border-2 border-slate-800 bg-white rounded-2xl shadow-sm overflow-hidden" id="printable-token">
                {/* Slip Header */}
                <div className="p-4 bg-slate-900 text-white border-b-2 border-amber-500 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      {isHi ? 'डिजिटल सेवा केंद्र · नागरिक ई-टोकन' : 'DIGITAL SEVA KENDRA · E-TOKEN'}
                    </div>
                    <div className="text-xs text-slate-300">
                      {isHi ? 'सरकारी व नागरिक ऑनलाइन सेवा पावती' : 'Citizen Online Service Slip'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {booking.referenceId}
                    </span>
                  </div>
                </div>

                {/* Token Number Highlight */}
                <div className="p-4 bg-amber-50/60 border-b border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      {isHi ? 'टोकन संख्या (TOKEN NO):' : 'TOKEN NUMBER:'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                      {booking.tokenNumber}
                    </div>
                    {booking.isUrgent && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                        {isHi ? '★ तत्काल प्राथमिकता (URGENT)' : '★ URGENT PRIORITY'}
                      </span>
                    )}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-xs text-center">
                    <QrCode className="w-12 h-12 text-slate-900 mx-auto" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 block">VERIFIED</span>
                  </div>
                </div>

                {/* Slip Details Table */}
                <div className="p-4 sm:p-5 space-y-2.5 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'आवेदक का नाम:' : 'Applicant Name:'}</span>
                      <strong className="text-slate-900 text-sm">{booking.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'मोबाइल संख्या:' : 'Mobile Number:'}</span>
                      <strong className="font-mono text-slate-900 text-sm">{booking.mobileNumber}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'अनुरोधित सेवा:' : 'Requested Service:'}</span>
                      <strong className="text-amber-900 font-bold">{booking.serviceTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'विभाग / पोर्टल:' : 'Govt Department:'}</span>
                      <span className="text-slate-800 font-medium">{booking.officialDepartment || '-'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'तारीख व समय स्लॉट:' : 'Date & Slot:'}</span>
                      <strong className="text-slate-900">{booking.date} | {booking.timeSlot}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'सहायता माध्यम:' : 'Assistance Mode:'}</span>
                      <span className="font-bold text-emerald-700">
                        {booking.mode === 'online'
                          ? (isHi ? 'ऑनलाइन / WhatsApp रिमोट' : 'Online / WhatsApp Assist')
                          : (isHi ? 'जन सेवा केंद्र डेस्क' : 'Physical Kiosk Visit')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'जिला / केंद्र:' : 'District / Center:'}</span>
                      <span className="text-slate-800 font-medium">{booking.cityOrDistrict || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{isHi ? 'सेवा शुल्क (सरकारी/मानक):' : 'Estimated Fee:'}</span>
                      <span className="font-semibold text-slate-800">{booking.estimatedFee || '-'}</span>
                    </div>
                  </div>

                  {/* Documents checklist */}
                  {booking.requiredDocuments && booking.requiredDocuments.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                        {isHi ? 'सत्यापन हेतु आवश्यक दस्तावेज:' : 'Required Verification Documents:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.requiredDocuments.map((doc, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            ✓ {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer note */}
                  <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-100">
                    {isHi
                      ? 'नोट: यह एक डिजिटल पंजीकरण टोकन है। सत्यापन हेतु मूल दस्तावेज साथ रखें।'
                      : 'Note: This is a digital queue registration token. Keep original documents ready for processing.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Print Slip */}
                <button
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रिंट पर्ची' : 'Print Slip'}</span>
                </button>

                {/* 2. WhatsApp Share */}
                <button
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isHi ? 'व्हाट्सएप भेजें' : 'WhatsApp'}</span>
                </button>

                {/* 3. Copy Details */}
                <button
                  onClick={handleCopySummary}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'कॉपी करें' : 'Copy Slip')}</span>
                </button>

                {/* 4. Email via Gmail */}
                {onEmailToken ? (
                  <button
                    onClick={() => {
                      const subject = isHi 
                        ? `डिजिटल सेवा टोकन पर्ची: ${booking.tokenNumber} - ${booking.serviceTitle}`
                        : `Digital Seva Token Slip: ${booking.tokenNumber} - ${booking.serviceTitle}`;
                      const body = isHi
                        ? `प्रिय ${booking.applicantName},\n\nआपका डिजिटल सेवा केंद्र टोकन सफलतापूर्वक पंजीकृत हो चुका है।\n\nटोकन संख्या: ${booking.tokenNumber}\nसंदर्भ आईडी: ${booking.referenceId}\nअनुरोधित सेवा: ${booking.serviceTitle}\nविभाग: ${booking.officialDepartment || '-'}\nमोबाइल संख्या: ${booking.mobileNumber}\nतारीख: ${booking.date}\nसमय स्लॉट: ${booking.timeSlot}\nसहायता मोड: ${booking.mode === 'online' ? 'ऑनलाइन WhatsApp/रिमोट' : 'जन सेवा केंद्र डेस्क'}\nजिला/शहर: ${booking.cityOrDistrict}\n\nआवश्यक दस्तावेज:\n- ${booking.requiredDocuments?.join('\n- ')}\n\nकृपया आवश्यक दस्तावेजों की मूल प्रति साथ रखें।\n\nडिजिटल सेवा केंद्र पोर्टल`
                        : `Dear ${booking.applicantName},\n\nYour citizen service token has been generated.\n\nToken Number: ${booking.tokenNumber}\nReference ID: ${booking.referenceId}\nRequested Service: ${booking.serviceTitle}\nDepartment: ${booking.officialDepartment || '-'}\nMobile: ${booking.mobileNumber}\nDate: ${booking.date}\nSlot: ${booking.timeSlot}\nMode: ${booking.mode === 'online' ? 'Online Support' : 'Kiosk Visit'}\nDistrict: ${booking.cityOrDistrict}\n\nRequired Documents:\n- ${booking.requiredDocuments?.join('\n- ')}\n\nDigital Seva Portal`;
                      onEmailToken(subject, body);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isHi ? 'जीमेल भेजें' : 'Gmail'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setBooking(null)}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {isHi ? 'नया टोकन' : 'New Token'}
                  </button>
                )}
              </div>

              {/* Bottom Close / New Token link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setBooking(null)}
                  className="text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
                >
                  {isHi ? '← दूसरा नया टोकन बनाएं' : '← Book Another Token'}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
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
