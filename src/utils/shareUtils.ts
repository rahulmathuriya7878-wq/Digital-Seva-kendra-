import { Language } from '../types/service';

export const shareFullWebsiteDetails = (language: Language) => {
  const isHi = language === 'hi';
  const url = window.location.href || 'https://digital-seva-kendra-seven.vercel.app/';

  const textHi = `🏛 *डिजिटल एवं जन सेवा केंद्र पोर्टल* 🏛
भारत के नागरिकों हेतु सभी ऑनलाइन इंटरनेट सेवाएं, प्रमाण पत्र, सरकारी योजनाएं व फॉर्म भरने का आधिकारिक सुविधा मंच।

🔹 *उपलब्ध प्रमुख सेवाएं:*
• सरकारी नौकरी फॉर्म, एडमिट कार्ड व रिजल्ट्स
• पीएफ (EPFO) निकासी, पासबुक व पेंशन सेवाएं
• छात्रवृत्ति ऑनलाइन आवेदन (Scholarship Portal)
• आधार कार्ड डाउनलोड, स्टेटस व पीवीसी कार्ड
• नया पैन कार्ड (Form 49A) व करेक्शन

🌐 *सीधा पोर्टल लिंक:*
${url}

अपने सभी ऑनलाइन फॉर्म व नागरिक सेवाओं के लिए आज ही विजिट करें!`;

  const textEn = `🏛 *Digital & Jan Seva Kendra Portal* 🏛
Single-window online access for all Indian citizen digital services, certificates, and government applications.

🔹 *Key Available Services:*
• Sarkari Jobs, Admit Cards & Latest Results
• PF (EPFO) Advance Withdrawal, Passbook & Pension
• Scholarship Online Form & Status Tracking
• Aadhaar Card Download & PVC Card Order
• New PAN Card (Form 49A) Application

🌐 *Direct Portal Link:*
${url}

Visit today for all your online forms and citizen services!`;

  const shareText = isHi ? textHi : textEn;

  if (navigator.share) {
    navigator
      .share({
        title: isHi ? 'डिजिटल एवं जन सेवा केंद्र पोर्टल' : 'Digital & Jan Seva Kendra Portal',
        text: shareText,
        url: url,
      })
      .catch((err) => {
        if (err && err.name !== 'AbortError') {
          // Direct fallback to WhatsApp without any popup
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        }
      });
  } else {
    // Direct WhatsApp share on devices without Web Share API (no popup)
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  }
};
