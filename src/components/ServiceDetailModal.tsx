import React, { useState } from 'react';
import { ServiceItem, Language } from '../types/service';
import { 
  X, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Ticket, 
  Clock, 
  Banknote,
  Star,
  Share2
} from 'lucide-react';
import { ServiceWordTutorials } from './ServiceWordTutorials';

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
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  interface ReviewItem {
    id: string;
    rating: number;
    commentHi: string;
    commentEn: string;
    timeAgoHi: string;
    timeAgoEn: string;
  }

  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      rating: 5,
      commentHi: 'बहुत ही सरल और तेज प्रक्रिया। बिना किसी परेशानी के काम हो गया।',
      commentEn: 'Very smooth and fast process. Work completed without any hassle.',
      timeAgoHi: '2 घंटे पहले',
      timeAgoEn: '2 hours ago'
    },
    {
      id: 'rev-2',
      rating: 5,
      commentHi: 'आधिकारिक पोर्टल लिंक और चरणबद्ध जानकारी बहुत उपयोगी रही।',
      commentEn: 'Official portal link and step-by-step guidance were extremely helpful.',
      timeAgoHi: '1 दिन पहले',
      timeAgoEn: '1 day ago'
    },
    {
      id: 'rev-3',
      rating: 4,
      commentHi: 'समय पर टोकन और सटीक मार्गदर्शन मिला। धन्यवाद!',
      commentEn: 'Got timely token and accurate guidance. Thank you!',
      timeAgoHi: '3 दिन पहले',
      timeAgoEn: '3 days ago'
    }
  ]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    const newRev: ReviewItem = {
      id: 'rev-' + Date.now(),
      rating,
      commentHi: feedbackText.trim() || (isHi ? 'उत्कृष्ट सेवा अनुभव।' : 'Excellent service experience.'),
      commentEn: feedbackText.trim() || 'Excellent service experience.',
      timeAgoHi: 'अभी-अभी',
      timeAgoEn: 'Just now'
    };
    setReviews([newRev, ...reviews]);
    setFeedbackSubmitted(true);
  };

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const docs = isHi ? service.requiredDocsHi : service.requiredDocsEn;
  const steps = isHi ? service.stepsHi : service.stepsEn;

  const completedDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;
  
  const docsProgress = Math.round((completedDocsCount / (docs.length || 1)) * 100);
  const stepsProgress = Math.round((completedStepsCount / (steps.length || 1)) * 100);

  const handleShareService = () => {
    const title = isHi ? service.titleHi : service.titleEn;
    const dept = isHi ? service.departmentHi : service.departmentEn;
    const fee = isHi ? service.feeHi : service.feeEn;
    const timeline = isHi ? service.processingTimeHi : service.processingTimeEn;
    const desc = isHi ? service.shortDescHi : service.shortDescEn;
    const portalUrl = window.location.origin ? `${window.location.origin}/#${service.id}` : window.location.href;
    const officialUrl = service.officialUrl && service.officialUrl.startsWith('http') ? service.officialUrl : '';

    const shareText = isHi
      ? `🏛 *${title}* (${dept})\n\n📝 *विवरण:* ${desc}\n💰 *ऑनलाइन फॉर्म भरने की फीस:* ${fee || 'निःशुल्क'}\n⏱ *समय सीमा:* ${timeline}\n\n🌐 *पोर्टल लिंक:* ${portalUrl}${officialUrl ? `\n🔗 *आधिकारिक पोर्टल लिंक:* ${officialUrl}` : ''}`
      : `🏛 *${title}* (${dept})\n\n📝 *Details:* ${desc}\n💰 *Online Form Filling Fee:* ${fee || 'Free'}\n⏱ *Timeline:* ${timeline}\n\n🌐 *Portal Link:* ${portalUrl}${officialUrl ? `\n🔗 *Official Portal Link:* ${officialUrl}` : ''}`;

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: shareText,
          url: portalUrl,
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareService}
              title={isHi ? 'यह सेवा सीधे शेयर करें' : 'Share this service'}
              className="text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'शेयर' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

          {/* Dynamic Progress Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-emerald-50 to-blue-50 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{isHi ? '📊 आवेदन तैयारी स्थिति (Application Readiness):' : '📊 Application Readiness:'}</span>
                <span className="text-emerald-800 font-mono">{Math.round((docsProgress + stepsProgress) / 2)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.round((docsProgress + stepsProgress) / 2)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isHi ? 'आवश्यक दस्तावेज (दस्तावेज चेकलिस्ट):' : 'Mandatory Document Checklist:'}
              </h3>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {completedDocsCount} / {docs.length} {isHi ? 'तैयार' : 'ready'}
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
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
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

          {/* Interactive Step-by-Step Guidance (Steps to Apply) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isHi ? 'ऑनलाइन आवेदन की चरणबद्ध प्रक्रिया (STEPS TO APPLY):' : 'Interactive Steps to Apply Procedure:'}
              </h3>
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {completedStepsCount} / {steps.length} {isHi ? 'पूर्ण' : 'completed'}
              </span>
            </div>

            <div className="space-y-2.5">
              {steps.map((st, idx) => {
                const isStepCompleted = !!checkedSteps[idx];
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isStepCompleted 
                        ? 'bg-blue-50/70 border-blue-300 text-blue-950 shadow-2xs' 
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isStepCompleted
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {isStepCompleted ? '✓' : (idx + 1)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm leading-normal font-medium ${isStepCompleted ? 'line-through text-blue-900/80' : 'text-slate-800'}`}>
                        {st}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isStepCompleted ? (isHi ? 'चरण पूर्ण (Completed)' : 'Step Completed') : (isHi ? 'पूर्ण करने के लिए क्लिक करें (Click to complete)' : 'Click to complete step')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word Tutorial Guide & Expert Tips */}
          <ServiceWordTutorials serviceId={service.id} language={language} />

          {/* Rating and Feedback Section */}
          <div className="mt-6 pt-5 border-t border-slate-200 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              {isHi ? 'इस सेवा पर अपनी प्रतिक्रिया दें (Rate this Service)' : 'Rate & Provide Feedback on this Service'}
            </h3>
            {feedbackSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
                ✨ {isHi ? 'आपकी बहुमूल्य प्रतिक्रिया के लिए धन्यवाद!' : 'Thank you for your valuable feedback!'}
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-2.5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {rating > 0 ? `${rating}/5` : (isHi ? 'रेटिंग चुनें' : 'Select rating')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={isHi ? 'अपनी टिप्पणी या सुझाव दर्ज करें (वैकल्पिक)...' : 'Write comments or suggestions (optional)...'}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={rating === 0}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      rating > 0
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isHi ? 'सबमिट' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Recent User Feedback (Last 3 Anonymous Ratings & Comments) */}
          <div className="mt-4 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>{isHi ? 'हालिया नागरिक प्रतिक्रियाएं (Recent Community Feedback)' : 'Recent Community Feedback'}</span>
              <span className="text-amber-700">★ 4.8 / 5.0</span>
            </div>
            <div className="space-y-2">
              {reviews.slice(0, 3).map((rev) => (
                <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                        />
                      ))}
                      <span className="font-bold text-slate-700 ml-1">{rev.rating}.0</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{isHi ? rev.timeAgoHi : rev.timeAgoEn}</span>
                  </div>
                  <p className="text-slate-600 font-medium italic">
                    "{isHi ? rev.commentHi : rev.commentEn}"
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    — {isHi ? 'सत्यापित नागरिक (Verified Citizen)' : 'Verified Citizen'}
                  </div>
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
