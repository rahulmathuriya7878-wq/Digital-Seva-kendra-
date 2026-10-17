import React, { useState } from 'react';
import { Language } from '../types/service';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQSectionProps {
  language: Language;
}

interface FAQItem {
  qHi: string;
  aHi: string;
  qEn: string;
  aEn: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      qHi: 'डिजिटल एवं जन सेवा केंद्र पोर्टल पर कौन-सी सेवाएं उपलब्ध हैं?',
      aHi: 'इस पोर्टल पर सरकारी नौकरी व रिजल्ट्स, PF (EPFO) सेवाएं, छात्रवृत्ति आवेदन, आधार कार्ड जानकारी, नया पैन कार्ड आवेदन, मतदाता पहचान पत्र, श्रमिक कार्ड और पीएम किसान सम्मान निधि जैसी समस्त नागरिक ऑनलाइन सेवाएं उपलब्ध हैं।',
      qEn: 'What services are available on the Digital & Jan Seva Kendra Portal?',
      aEn: 'The portal provides unified access to Sarkari Jobs & Results, PF (EPFO) services, scholarship applications, Aadhaar info, PAN card applications, Voter ID, e-Shram card, and PM Kisan Samman Nidhi.'
    },
    {
      qHi: 'सेवा टोकन (Service Token) कैसे बुक करें?',
      aHi: 'होमपेज पर या किसी भी सेवा कार्ड पर दिए गए "सेवा टोकन बुक करें" या "Apply" बटन पर क्लिक करें। अपना नाम, मोबाइल नंबर और जिला दर्ज करके तुरंत प्राथमिकता टोकन जनरेट करें।',
      qEn: 'How do I book a Service Token?',
      aEn: 'Click on the "Book Service Token" or "Apply" button on any service card. Enter your name, mobile number, and district to instantly generate a priority token slip.'
    },
    {
      qHi: 'अपने आवेदन या टोकन की स्थिति कैसे जांचें?',
      aHi: 'पोर्टल के शीर्ष मेनू या अनुभाग में "आवेदन स्थिति जांचें" (Track Application) पर क्लिक करें और अपना टोकन नंबर या संदर्भ आईडी दर्ज करके वास्तविक समय की स्थिति (Status) देखें।',
      qEn: 'How can I check the status of my application or token?',
      aEn: 'Click on "Track Application" in the navigation or section, and enter your token number or reference ID to view real-time status.'
    },
    {
      qHi: 'क्या इस पोर्टल के माध्यम से सीधे सरकारी वेबसाइटों पर जा सकते हैं?',
      aHi: 'हाँ, प्रत्येक सेवा विवरण में आधिकारिक सरकारी पोर्टल (जैसे edistrict, nsdl, umang) का सीधा लिंक दिया गया है जिस पर क्लिक करके आप सीधे आधिकारिक वेबसाइट पर जा सकते हैं।',
      qEn: 'Can I access official government websites directly through this portal?',
      aEn: 'Yes, every service detail includes a direct link to the official government portal (such as e-District, NSDL, Umang, etc.) for direct access.'
    },
    {
      qHi: 'आपातकालीन स्थिति में सहायता या हेल्पलाइन नंबर क्या है?',
      aHi: 'किसी भी तकनीकी सहायता या जानकारी के लिए आप आधिकारिक WhatsApp हेल्पलाइन नंबर (87641 07756) पर संपर्क कर सकते हैं या आपातकालीन हेल्पलाइन अनुभाग देख सकते हैं।',
      qEn: 'What is the helpline number for emergency assistance?',
      aEn: 'For any technical support or query, you can contact our official WhatsApp helpline number (87641 07756) or refer to the Emergency Helplines Directory.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            {isHi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isHi ? 'सामान्य जिज्ञासाएं व सहायता' : 'Help & Common Queries'}
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>{isHi ? faq.qHi : faq.qEn}</span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-amber-700" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {isHi ? faq.aHi : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
