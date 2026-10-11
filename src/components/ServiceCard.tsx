import React from 'react';
import { ServiceItem, Language } from '../types/service';
import { 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Truck, 
  Award, 
  BadgePercent, 
  Home, 
  Map, 
  Sprout, 
  Briefcase, 
  Building, 
  GraduationCap, 
  Zap, 
  Flame, 
  Car, 
  FileCheck2,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  language: Language;
  onSelectService: (service: ServiceItem) => void;
  onQuickAction?: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  language,
  onSelectService,
  onQuickAction
}) => {
  const isHi = language === 'hi';

  // Map icon component
  const getIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-amber-700' };
    switch (iconName) {
      case 'CreditCard': return <CreditCard {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'UserCheck': return <UserCheck {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'Award': return <Award {...props} />;
      case 'BadgePercent': return <BadgePercent {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Map': return <Map {...props} />;
      case 'Sprout': return <Sprout {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Building': return <Building {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Car': return <Car {...props} />;
      case 'FileCheck2': return <FileCheck2 {...props} />;
      default: return <FileText {...props} />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'identity': return isHi ? 'पहचान सेवाएं' : 'Identity';
      case 'certificates': return isHi ? 'राजस्व प्रमाण पत्र' : 'Certificates';
      case 'welfare': return isHi ? 'कल्याणकारी योजनाएं' : 'Welfare';
      case 'bills': return isHi ? 'यूटिलिटी बिल' : 'Utility Bills';
      case 'jobs': return isHi ? 'नौकरी व रिजल्ट' : 'Jobs & Exam';
      default: return isHi ? 'ऑनलाइन सेवा' : 'Online Service';
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all p-5">
      <div>
        {/* Top Header: Unboxed metadata line with typographic separators */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span>{getCategoryLabel(service.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[170px]">
              {isHi ? service.departmentHi : service.departmentEn}
            </span>
          </div>

          {(service.badgeHi || service.badgeEn) && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
              {isHi ? service.badgeHi : service.badgeEn}
            </span>
          )}
        </div>

        {/* Card Title & Icon */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50/80 border border-amber-200/50 flex items-center justify-center shrink-0">
            {getIcon(service.iconName)}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
            {isHi ? service.titleHi : service.titleEn}
          </h3>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {isHi ? service.shortDescHi : service.shortDescEn}
        </p>

        {/* Unboxed Metadata: Fee & Processing time */}
        <div className="space-y-1.5 py-3 border-t border-slate-100 text-xs text-slate-600">
          {(isHi ? service.feeHi : service.feeEn) ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">{isHi ? 'सेवा शुल्क:' : 'Service Fee:'}</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {isHi ? service.feeHi : service.feeEn}
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">{isHi ? 'समय सीमा:' : 'Timeline:'}</span>
            <span className="text-slate-700">
              {isHi ? service.processingTimeHi : service.processingTimeEn}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onSelectService(service)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <span>{isHi ? 'प्रक्रिया व आवेदन गाइड' : 'Steps & Guidelines'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {service.officialUrl.startsWith('http') && (
          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={isHi ? 'सीधा सरकारी पोर्टल खोलें' : 'Open Official Govt Portal'}
            className="p-2 text-slate-600 hover:text-amber-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
