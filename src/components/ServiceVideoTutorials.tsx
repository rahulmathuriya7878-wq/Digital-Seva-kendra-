import React, { useState } from 'react';
import { Language } from '../types/service';
import { Play, Video, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

interface ServiceVideoTutorialsProps {
  serviceId: string;
  language: Language;
}

export const ServiceVideoTutorials: React.FC<ServiceVideoTutorialsProps> = ({ serviceId, language }) => {
  const isHi = language === 'hi';
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Default tutorial video mapping or general tutorial
  const tutorialInfo: Record<string, { titleHi: string; titleEn: string; duration: string; videoId: string }> = {
    'epf-pf-services': {
      titleHi: 'पीएफ (PF) यूएएन एक्टिवेशन व एडवांस क्लेम कैसे करें',
      titleEn: 'How to Activate UAN and Apply PF Advance Claim',
      duration: '3:45 min',
      videoId: 'dQw4w9WgXcQ' // placeholder video
    },
    'aadhaar-download': {
      titleHi: 'घर बैठे ई-आधार पीडीएफ डाउनलोड और पीवीसी ऑर्डर कैसे करें',
      titleEn: 'How to Download E-Aadhaar PDF & Order PVC Card',
      duration: '2:30 min',
      videoId: 'dQw4w9WgXcQ'
    },
    'pan-card-apply': {
      titleHi: 'नया पैन कार्ड (Form 49A) ऑनलाइन आवेदन प्रक्रिया',
      titleEn: 'New PAN Card Online Application Step-by-Step Guide',
      duration: '4:15 min',
      videoId: 'dQw4w9WgXcQ'
    },
    'scholarship-portal': {
      titleHi: 'छात्रवृत्ति फॉर्म ऑनलाइन भरने और स्टेटस चेक करने की पूरी विधि',
      titleEn: 'Complete Scholarship Form Filling & Status Tracking Guide',
      duration: '5:00 min',
      videoId: 'dQw4w9WgXcQ'
    }
  };

  const defaultTutorial = {
    titleHi: 'इस डिजिटल सेवा का उपयोग करने की वीडियो गाइड',
    titleEn: 'Video Guide on How to Use This Digital Service',
    duration: '3:15 min',
    videoId: 'dQw4w9WgXcQ'
  };

  const currentTutorial = tutorialInfo[serviceId] || defaultTutorial;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Video className="w-4 h-4 text-rose-600" />
          <span>{isHi ? 'वीडियो ट्यूटोरियल गाइड (Video Tutorial)' : 'Service Video Tutorial'}</span>
        </h3>
        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {currentTutorial.duration}
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 group shadow-md">
        {isPlaying ? (
          <div className="aspect-video w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center animate-pulse">
              <Play className="w-6 h-6 text-rose-400 fill-rose-400 ml-0.5" />
            </div>
            <p className="text-xs font-medium text-slate-300">
              {isHi 
                ? 'लाइव वीडियो ट्यूटोरियल स्ट्रीमिंग चल रही है...' 
                : 'Live video tutorial streaming in progress...'}
            </p>
            <button
              onClick={() => setIsPlaying(false)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
            >
              {isHi ? 'रोकें (Stop)' : 'Close Video'}
            </button>
          </div>
        ) : (
          <div className="relative aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
            {/* Simulated Video Thumbnail Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
            
            <div className="relative z-10 space-y-3">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer mx-auto"
                title={isHi ? 'वीडियो चलाएं' : 'Play Tutorial'}
              >
                <Play className="w-6 h-6 fill-white ml-1" />
              </button>
              
              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug px-2 max-w-md">
                {isHi ? currentTutorial.titleHi : currentTutorial.titleEn}
              </h4>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isHi ? 'आधिकारिक गाइड' : 'Official Guide'}
                </span>
                <span>•</span>
                <span>{currentTutorial.duration}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
