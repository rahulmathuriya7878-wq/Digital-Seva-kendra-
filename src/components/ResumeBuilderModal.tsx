import React from 'react';
import { Language } from '../types/service';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface ResumeBuilderModalProps {
  language: Language;
  onClose: () => void;
  onExportToGoogleDocs?: (title: string, content: string) => void;
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({ language, onClose }) => {
  const isHi = language === 'hi';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold">{isHi ? 'डिजिटल सीवी व बायोडाटा जनरेटर' : 'Digital Resume / Bio-data Generator'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{isHi ? 'यहाँ से आप अपना पेशेवर बायोडाटा तैयार कर सकते हैं।' : 'Create your professional resume and bio-data easily here.'}</span>
          </div>
          <p className="text-slate-600">
            {isHi ? 'यह सुविधा सरकारी नौकरी व आवेदन हेतु बायोडाटा बनाने में सहायता करती है।' : 'This tool helps generate bio-data and resumes for job applications.'}
          </p>
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
