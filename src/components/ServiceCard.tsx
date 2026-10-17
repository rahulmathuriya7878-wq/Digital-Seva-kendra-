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
  HelpCircle,
  Heart,
  Share2
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  language: Language;
  onSelectService: (service: ServiceItem) => void;
  onQuickAction?: (service: ServiceItem) => void;
  isSaved?: boolean;
  onToggleSave?: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  language,
  onSelectService,
  onQuickAction,
  isSaved = false,
  onToggleSave
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

  const handleShareService = (e: React.MouseEvent) => {
    e.stopPropagation();

    const title = isHi ? service.titleHi : service.titleEn;
    const dept = isHi ? service.departmentHi : service.departmentEn;
    const fee = isHi ? service.feeHi : service.feeEn;
    const timeline = isHi ? service.processingTimeHi : service.processingTimeEn;
    const desc = isHi ? service.shortDescHi : service.shortDescEn;
    const url = service.officialUrl.startsWith('http') ? service.officialUrl : window.location.href;

    const shareText = isHi
      ? `🏛 *${title}* (${dept})\n\n📝 *विवरण:* ${desc}\n💰 *ऑनलाइन फॉर्म भरने की फीस:* ${fee || 'निःशुल्क'}\n⏱ *समय सीमा:* ${timeline}\n\n🌐 *आधिकारिक पोर्टल लिंक:* ${url}\n\n✨ _डिजिटल एवं जन सेवा केंद्र पोर्टल से साझा किया गया_`
      : `🏛 *${title}* (${dept})\n\n📝 *Details:* ${desc}\n💰 *Online Form Filling Fee:* ${fee || 'Free'}\n⏱ *Timeline:* ${timeline}\n\n🌐 *Official Portal Link:* ${url}\n\n✨ _Shared via Digital & Jan Seva Kendra Portal_`;

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: shareText,
          url: url,
        })
        .catch((err) => {
          if (err && err.name !== 'AbortError') {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          }
        });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all p-4 sm:p-6 relative group">
      <div>
        {/* Top Header: Unboxed metadata line with typographic separators & Favorite Heart button */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span>{getCategoryLabel(service.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[150px]">
              {isHi ? service.departmentHi : service.departmentEn}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {(service.badgeHi || service.badgeEn) && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                {isHi ? service.badgeHi : service.badgeEn}
              </span>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(service);
                }}
                title={isHi ? (isSaved ? 'सहेजी गई सेवा से हटाएं' : 'सेवा सहेजें (Favorite)') : (isSaved ? 'Remove from Saved' : 'Save Service')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Card Title & Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-center shrink-0">
            {getIcon(service.iconName)}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
            {isHi ? service.titleHi : service.titleEn}
          </h3>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          {isHi ? service.shortDescHi : service.shortDescEn}
        </p>

        {/* Unboxed Metadata: Fee & Processing time */}
        <div className="space-y-2 py-3 border-t border-slate-100 text-xs text-slate-600">
          {(isHi ? service.feeHi : service.feeEn) ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{isHi ? 'सेवा शुल्क:' : 'Service Fee:'}</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {isHi ? service.feeHi : service.feeEn}
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">{isHi ? 'समय सीमा:' : 'Timeline:'}</span>
            <span className="text-slate-800 font-medium">
              {isHi ? service.processingTimeHi : service.processingTimeEn}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
        <button
          onClick={() => onSelectService(service)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap shadow-xs"
        >
          <span>{isHi ? 'प्रक्रिया व आवेदन गाइड' : 'Steps & Guidelines'}</span>
          <ChevronRight className="w-4 h-4 text-amber-400" />
        </button>

        {/* Native Web Share API Button (Direct, No Popup) */}
        <button
          type="button"
          onClick={handleShareService}
          title={isHi ? 'यह सेवा सीधे शेयर करें' : 'Share this service directly'}
          aria-label={isHi ? 'यह सेवा सीधे शेयर करें' : 'Share this service directly'}
          className="p-3 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl border border-slate-200 transition-colors shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-emerald-600" />
        </button>

        {service.officialUrl.startsWith('http') && (
          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={isHi ? 'सीधा सरकारी पोर्टल खोलें' : 'Open Official Govt Portal'}
            className="p-3 text-slate-700 hover:text-amber-800 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
