import React, { useState } from 'react';
import { Language, ServiceItem, TokenBooking } from '../types/service';
import { SERVICES_DATA } from '../data/servicesData';
import { X, Ticket, CheckCircle2, Printer, QrCode, Phone, Calendar, User, MapPin, Mail } from 'lucide-react';

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
  const [preferredDate, setPreferredDate] = useState('2026-03-12');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [district, setDistrict] = useState('Central District');

  const [booking, setBooking] = useState<TokenBooking | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const currentService = SERVICES_DATA.find((s) => s.id === selectedServiceId);
    const tokenNum = 'DSK-' + Math.floor(1000 + Math.random() * 9000);
    const refNum = 'REF-2026-' + Math.floor(100000 + Math.random() * 900000);

    setBooking({
      tokenNumber: tokenNum,
      applicantName: name,
      mobileNumber: phone,
      serviceTitle: isHi ? currentService?.titleHi || 'ऑनलाइन सेवा' : currentService?.titleEn || 'Online Service',
      date: preferredDate,
      timeSlot: timeSlot,
      mode: mode,
      referenceId: refNum
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="text-base font-bold">
                {isHi ? 'डिजिटल सेवा टोकन व सहायता पंजीकरण' : 'Book Digital Service Assistance Token'}
              </h3>
              <p className="text-xs text-amber-100">
                {isHi ? 'ऑनलाइन फॉर्म भरने हेतु प्राथमिकता टोकन' : 'Priority Slot for Citizen Internet Service'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!booking ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isHi ? 'आवेदक का पूरा नाम (Full Name):' : 'Applicant Full Name:'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHi ? 'उदा: राहुल मथुरिया' : 'e.g. Rahul Mathuriya'}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isHi ? 'मोबाइल नंबर (Mobile Number for SMS & WhatsApp):' : 'Mobile Number (10 digits):'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isHi ? 'आवश्यक सेवा चुनें (Select Service):' : 'Required Service:'}
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isHi ? s.titleHi : s.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'सहायता माध्यम (Mode):' : 'Assistance Mode:'}
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'online' | 'center')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
                  >
                    <option value="online">{isHi ? 'ऑनलाइन रिमोट सहायता' : 'Online Digital Support'}</option>
                    <option value="center">{isHi ? 'नजदीकी केंद्र पर उपस्थिति' : 'Physical Kiosk Visit'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isHi ? 'समय स्लॉट (Time Slot):' : 'Preferred Slot:'}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
                  >
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isHi ? 'डिजिटल टोकन जारी करें' : 'Generate Digital Token Slip'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Token Slip Display */}
              <div className="border-2 border-dashed border-amber-500/50 bg-amber-50/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      {isHi ? 'नागरिक सेवा ई-टोकन' : 'Citizen Service E-Token'}
                    </span>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      {booking.tokenNumber}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-amber-200 text-slate-800">
                    <QrCode className="w-10 h-10 text-slate-800" />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHi ? 'आवेदक का नाम:' : 'Applicant Name:'}</span>
                    <span className="font-bold text-slate-800">{booking.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHi ? 'मोबाइल संख्या:' : 'Mobile:'}</span>
                    <span className="font-mono text-slate-800">{booking.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHi ? 'अनुरोधित सेवा:' : 'Requested Service:'}</span>
                    <span className="font-semibold text-amber-900">{booking.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHi ? 'स्लॉट समय:' : 'Scheduled Slot:'}</span>
                    <span className="text-slate-800 font-medium">{booking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHi ? 'सहायता माध्यम:' : 'Mode:'}</span>
                    <span className="text-emerald-700 font-bold">
                      {booking.mode === 'online' 
                        ? (isHi ? 'ऑनलाइन / WhatsApp सहायता' : 'Online / WhatsApp Assist')
                        : (isHi ? 'जन सेवा केंद्र स्लॉट' : 'Jan Seva Kendra Desk')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/60 text-[11px] text-slate-500 text-center">
                  {isHi ? 'कृपया आवश्यक दस्तावेजों की मूल प्रति साथ रखें।' : 'Please keep original documents ready for processing.'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isHi ? 'टोकन पर्ची प्रिंट करें' : 'Print Token Slip'}</span>
                </button>

                {onEmailToken && (
                  <button
                    onClick={() => {
                      const subject = isHi 
                        ? `डिजिटल सेवा टोकन पर्ची: ${booking.tokenNumber} - ${booking.serviceTitle}`
                        : `Digital Seva Token Slip: ${booking.tokenNumber} - ${booking.serviceTitle}`;
                      const body = isHi
                        ? `प्रिय ${booking.applicantName},\n\nआपका डिजिटल सेवा केंद्र टोकन सफलतापूर्वक पंजीकृत हो चुका है।\n\nटोकन संख्या: ${booking.tokenNumber}\nअनुरोधित सेवा: ${booking.serviceTitle}\nमोबाइल संख्या: ${booking.mobileNumber}\nतारीख: ${booking.date}\nसमय स्लॉट: ${booking.timeSlot}\nसहायता मोड: ${booking.mode === 'online' ? 'ऑनलाइन सहायता' : 'केंद्र स्लॉट'}\nसंदर्भ आईडी: ${booking.referenceId}\n\nकृपया आवश्यक दस्तावेजों की मूल प्रति साथ रखें।\n\nडिजिटल सेवा केंद्र पोर्टल`
                        : `Dear ${booking.applicantName},\n\nYour citizen service token has been generated.\n\nToken Number: ${booking.tokenNumber}\nRequested Service: ${booking.serviceTitle}\nMobile: ${booking.mobileNumber}\nDate: ${booking.date}\nSlot: ${booking.timeSlot}\nMode: ${booking.mode === 'online' ? 'Online Assist' : 'Kiosk Visit'}\nReference ID: ${booking.referenceId}\n\nPlease keep your original documents ready.\n\nDigital Seva Portal`;
                      onEmailToken(subject, body);
                    }}
                    className="py-2.5 px-3 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-rose-600" />
                    <span>{isHi ? 'जीमेल पर भेजें' : 'Email via Gmail'}</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {isHi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
