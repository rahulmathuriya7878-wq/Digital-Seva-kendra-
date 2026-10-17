import React from 'react';
import { Language } from '../types/service';
import { BookOpen, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface ServiceWordTutorialsProps {
  serviceId: string;
  language: Language;
}

export const ServiceWordTutorials: React.FC<ServiceWordTutorialsProps> = ({ serviceId, language }) => {
  const isHi = language === 'hi';

  const tipsMap: Record<string, { titleHi: string; titleEn: string; tipHi: string; tipEn: string; warningHi: string; warningEn: string }> = {
    'epf-pf-services': {
      titleHi: 'पीएफ (PF) क्लेम हेतु विशेषज्ञ टिप',
      titleEn: 'Expert Tip for PF Claim',
      tipHi: 'सुनिश्चित करें कि आपका बैंक खाता यूएएन (UAN) से सीडेड और आधार से लिंक हो अन्यथा क्लेम रिजेक्ट हो सकता है।',
      tipEn: 'Ensure your bank account is seeded with UAN and linked with Aadhaar to avoid claim rejection.',
      warningHi: 'नाम और जन्मतिथि आधार कार्ड व PF रिकॉर्ड में बिल्कुल समान होनी चाहिए।',
      warningEn: 'Name and date of birth must match exactly between Aadhaar and PF records.'
    },
    'aadhaar-download': {
      titleHi: 'ई-आधार डाउनलोड हेतु महत्वपूर्ण टिप',
      titleEn: 'Important Tip for E-Aadhaar Download',
      tipHi: 'डाउनलोड की गई पीडीएफ फाइल का पासवर्ड आपके नाम के शुरुआती 4 अक्षर (कैपिटल लेटर में) और जन्म का वर्ष (जैसे RAHU1995) होता है।',
      tipEn: 'The password for the downloaded PDF is the first 4 letters of your name in capitals + birth year (e.g. RAHU1995).',
      warningHi: 'पंजीकृत मोबाइल नंबर पर ओटीपी (OTP) आना अनिवार्य है।',
      warningEn: 'Registered mobile number must be active to receive OTP verification.'
    },
    'pan-card-apply': {
      titleHi: 'नया पैन कार्ड आवेदन टिप',
      titleEn: 'New PAN Application Tip',
      tipHi: 'आधार ई-केवाईसी (Aadhaar e-KYC) के माध्यम से पैन कार्ड केवल 10 मिनट में डिजिटल रूप से बन जाता है और हस्ताक्षर सत्यापित हो जाते हैं।',
      tipEn: 'PAN card is generated digitally within 10 minutes via Aadhaar e-KYC with instant signature verification.',
      warningHi: 'फोटो और हस्ताक्षर स्पष्ट अपलोड करें।',
      warningEn: 'Upload clear passport photo and signature.'
    }
  };

  const defaultTip = {
    titleHi: 'त्वरित मार्गदर्शन एवं टिप (Quick Guide & Tip)',
    titleEn: 'Quick Guidance & Expert Tip',
    tipHi: 'फॉर्म भरते समय सभी दस्तावेज अपने पास रखें और डिजिटल लॉकर या वैध दस्तावेजों का ही उपयोग करें।',
    tipEn: 'Keep all required documents ready while filling the form and use valid digital records.',
    warningHi: 'आवेदन करने से पूर्व अपने सभी विवरणों की भली-भांति जांच कर लें।',
    warningEn: 'Verify all your details carefully before submitting the application.'
  };

  const currentTip = tipsMap[serviceId] || defaultTip;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
          <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed font-medium">
            {isHi ? currentTip.tipHi : currentTip.tipEn}
          </p>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed font-medium">
            {isHi ? currentTip.warningHi : currentTip.warningEn}
          </p>
        </div>
      </div>
    </div>
  );
};
