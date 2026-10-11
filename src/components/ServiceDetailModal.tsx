import React, { useState } from 'react';
import { ServiceItem, Language } from '../types/service';
import { 
  X, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Ticket, 
  Clock, 
  Banknote
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem;
  language: Language;
  onClose: () => void;
  onRequestAssistance: (service: ServiceItem) => void;
  onExportToDocs?: (title: string, content: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  language,
  onClose,
  onRequestAssistance
}) => {
  const isHi = language === 'hi';
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const docs = isHi ? service.requiredDocsHi : service.requiredDocsEn;
  const steps = isHi ? service.stepsHi : service.stepsEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-slate-900 text-white">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-400">
              {isHi ? service.departmentHi : service.departmentEn}
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              {isHi ? service.titleHi : service.titleEn}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Facts Strip */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            {(isHi ? service.feeHi : service.feeEn) ? (
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block">{isHi ? 'सरकारी शुल्क:' : 'Official Fee:'}</span>
                  <span className="font-bold text-slate-900">{isHi ? service.feeHi : service.feeEn}</span>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-slate-500 block">{isHi ? 'प्रक्रिया समय:' : 'Timeline:'}</span>
                <span className="font-bold text-slate-900">{isHi ? service.processingTimeHi : service.processingTimeEn}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isHi ? 'सेवा का विवरण' : 'Service Overview'}
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {isHi ? service.shortDescHi : service.shortDescEn}
            </p>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isHi ? 'आवश्यक दस्तावेज (दस्तावेज चेकलिस्ट):' : 'Mandatory Document Checklist:'}
              </h3>
              <span className="text-[11px] text-slate-500">
                {isHi ? 'तैयार कागजातों पर टिक करें' : 'Tick documents you have'}
              </span>
            </div>

            <div className="space-y-2">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">{doc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Guidance */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {isHi ? 'ऑनलाइन आवेदन की चरणबद्ध प्रक्रिया (STEPS TO APPLY):' : 'Step-by-Step Application Procedure:'}
            </h3>
            <div className="space-y-2.5">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-normal">
                    {st}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Direct Government Portal Link */}
          {service.officialUrl.startsWith('http') ? (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isHi ? 'सरकारी पोर्टल खोलें' : 'Govt Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          ) : (
            <div />
          )}

          {/* Primary Action: Book Service Assistance Token */}
          <button
            onClick={() => onRequestAssistance(service)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-amber-200" />
            <span>{isHi ? 'सेवा टोकन बुक करें' : 'Book Service Token'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
