import React, { useState } from 'react';
import { Language } from '../types/service';
import { EMERGENCY_HELPLINES } from '../data/servicesData';
import { PhoneCall, Copy, Check, ShieldAlert } from 'lucide-react';

interface HelplineDirectoryProps {
  language: Language;
}

export const HelplineDirectory: React.FC<HelplineDirectoryProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded">
              {isHi ? '24x7 राष्ट्रीय हेल्पलाइन' : '24x7 National Helplines'}
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">{isHi ? 'टोल-फ्री सरकारी सहायता' : 'Official Toll-Free Directory'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isHi ? 'साइबर सुरक्षा व आवश्यक नागरिक हेल्पलाइन' : 'Cyber Safety & Citizen Emergency Helplines'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isHi
              ? 'इंटरनेट या बैंक फ्रॉड होने पर तुरंत 1930 पर कॉल करें। आधार, किसान व उपभोक्ता संबंधी सभी प्रमुख हेल्पलाइन नंबर।'
              : 'Direct toll-free contact numbers for online banking fraud, Aadhaar, Kisan schemes and emergencies.'}
          </p>
        </div>
      </div>

      {/* Cyber Alert Spotlight Banner */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wide">
              {isHi ? 'अति महत्वपूर्ण इंटरनेट सुरक्षा चेतावनी' : 'Urgent Cyber Fraud Warning'}
            </div>
            <div className="text-sm font-semibold mt-0.5">
              {isHi
                ? 'यदि आपके साथ कोई भी ऑनलाइन लॉटरी, OTP या बैंक खाता धोखाधड़ी हुई है, तो तुरंत 1930 डायल करें।'
                : 'In case of any UPI or cyber financial fraud, report immediately to 1930 to freeze bank transactions.'}
            </div>
          </div>
        </div>

        <a
          href="tel:1930"
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{isHi ? '1930 पर कॉल करें' : 'Call 1930 Now'}</span>
        </a>
      </div>

      {/* Helplines Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMERGENCY_HELPLINES.map((item, idx) => {
          const isCopied = copiedNumber === item.number;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">
                  {isHi ? item.nameHi : item.nameEn}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {isHi ? item.descHi : item.descEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-900 font-mono tracking-wider">
                  {item.number}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.number)}
                    className="p-1.5 rounded-md hover:bg-slate-200/70 text-slate-600 transition-colors"
                    title={isHi ? 'नंबर कॉपी करें' : 'Copy Number'}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <a
                    href={`tel:${item.number}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isHi ? 'कॉल' : 'Call'}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
