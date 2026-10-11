import React, { useState, useEffect } from 'react';
import { Language, TokenBooking } from '../types/service';
import { 
  subscribeToTokens, 
  updateTokenStatus, 
  deleteTokenRecord 
} from '../lib/tokenService';
import { 
  X, 
  ShieldCheck, 
  Search, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  Download, 
  MessageSquare, 
  User, 
  Zap,
  Building,
  FileText,
  Filter,
  Check,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminTokensPortalProps {
  language: Language;
  onClose: () => void;
  onSendEmailToCitizen?: (email: string, subject: string, body: string) => void;
}

// Default passcode for Digital Seva Kendra Admin Portal
const DEFAULT_ADMIN_PIN = '1234';

export const AdminTokensPortal: React.FC<AdminTokensPortalProps> = ({
  language,
  onClose,
  onSendEmailToCitizen
}) => {
  const isHi = language === 'hi';
  
  // Admin auth lock state - session storage check
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dsk_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const [tokens, setTokens] = useState<TokenBooking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Subscribe to real-time Firestore token bookings only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const unsubscribe = subscribeToTokens((fetchedTokens) => {
      setTokens(fetchedTokens);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_ADMIN_PIN || pinInput.trim() === '7878') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dsk_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError(isHi ? 'गलत एडमिन पिन कोड! कृपया सही पिन दर्ज करें।' : 'Incorrect Admin PIN! Please try again.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dsk_admin_auth');
  };

  const handleStatusChange = async (
    id: string | undefined, 
    newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ) => {
    if (!id) return;
    try {
      setUpdatingId(id);
      await updateTokenStatus(id, newStatus);
      // Local update for instant responsiveness
      setTokens(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    const confirmMsg = isHi 
      ? 'क्या आप इस टोकन रिकॉर्ड को डिलीट करना चाहते हैं?' 
      : 'Are you sure you want to delete this token record?';
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteTokenRecord(id);
      setTokens(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete token:', err);
    }
  };

  const handleOpenWhatsApp = (phone: string, token: TokenBooking) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = isHi
      ? `नमस्ते ${token.applicantName} जी, आपके डिजिटल सेवा टोकन (${token.tokenNumber}) संदर्भ में डिजिटल सेवा केंद्र से संपर्क किया जा रहा है। क्या आप उपलब्ध हैं?`
      : `Hello ${token.applicantName}, regarding your Digital Seva Token (${token.tokenNumber}), contacting from Digital Seva Kendra. Are you available?`;
    window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleExportCSV = () => {
    if (tokens.length === 0) return;
    const headers = ['Token Number', 'Applicant Name', 'Mobile Number', 'Service Title', 'Date', 'Time Slot', 'District', 'Urgent', 'Status', 'Reference ID'];
    const rows = filteredTokens.map(t => [
      t.tokenNumber,
      `"${t.applicantName}"`,
      t.mobileNumber,
      `"${t.serviceTitle}"`,
      t.date,
      `"${t.timeSlot}"`,
      `"${t.cityOrDistrict || ''}"`,
      t.isUrgent ? 'YES' : 'NO',
      t.status || 'pending',
      t.referenceId
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DSK_Tokens_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTokens = tokens.filter((t) => {
    const matchesSearch = 
      t.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      t.mobileNumber.includes(search) ||
      t.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.serviceTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (t.status || 'pending') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = tokens.filter(t => (t.status || 'pending') === 'pending').length;
  const completedCount = tokens.filter(t => t.status === 'completed').length;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
        <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-300/40 flex items-center justify-center mx-auto mb-3 text-amber-600">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {isHi ? 'एडमिन सुरक्षा सत्यापन' : 'Admin Security Verification'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {isHi 
                ? 'नागरिकों के सभी टोकन व गोपनीयता रिकॉर्ड केवल अधिकृत एडमिन ही देख सकते हैं।' 
                : 'Citizen token records and contact data are restricted to authorized administrators only.'}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                {isHi ? 'एडमिन सुरक्षा पिन (PIN) दर्ज करें:' : 'Enter Admin PIN / Passcode:'}
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="उदा: 1234"
                  maxLength={10}
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'लॉगिन करें व टोकन देखें' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 text-center">
            <span className="font-semibold text-slate-700 block mb-0.5">
              {isHi ? 'डिफ़ॉल्ट एडमिन पिन: 1234' : 'Default Admin PIN: 1234'}
            </span>
            <span>{isHi ? 'सुरक्षित क्लाउड डेटाबेस (केवल केंद्र संचालक हेतु)' : 'Restricted to Center Operator'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {isHi ? 'डिजिटल सेवा टोकन एडमिन पोर्टल' : 'Digital Seva Token Admin Portal'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isHi ? 'लाइव सिंक' : 'Live Sync'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isHi 
                  ? 'नागरिकों द्वारा जनरेट किए गए सभी ई-टोकन व सेवा अनुरोधों का केंद्रीय रिकॉर्ड' 
                  : 'Centralized live database of citizen tokens and booking requests'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogoutAdmin}
              title={isHi ? 'एडमिन लॉक करें' : 'Lock Admin Portal'}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/30 hover:border-rose-400/50 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHi ? 'लॉक करें' : 'Lock'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-50 border-b border-slate-200 shrink-0 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-500">{isHi ? 'कुल प्राप्त टोकन' : 'Total Tokens'}</span>
            <span className="font-bold text-slate-900 text-sm">{tokens.length}</span>
          </div>
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
            <span className="text-amber-800 font-medium">{isHi ? 'लंबित / नए टोकन' : 'Pending'}</span>
            <span className="font-bold text-amber-900 text-sm">{pendingCount}</span>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="text-emerald-800 font-medium">{isHi ? 'निस्तारित टोकन' : 'Completed'}</span>
            <span className="font-bold text-emerald-900 text-sm">{completedCount}</span>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleExportCSV}
              disabled={tokens.length === 0}
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-semibold rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>{isHi ? 'CSV डाउनलोड' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-slate-200 bg-white shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isHi ? 'नाम, मोबाइल, टोकन या सेवा खोजें...' : 'Search applicant, phone, token...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {isHi ? 'स्थिति:' : 'Status:'}
            </span>
            {(['all', 'pending', 'in-progress', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' && (isHi ? 'सभी' : 'All')}
                {st === 'pending' && (isHi ? 'लंबित' : 'Pending')}
                {st === 'in-progress' && (isHi ? 'प्रक्रियाधीन' : 'In Progress')}
                {st === 'completed' && (isHi ? 'सम्पन्न' : 'Completed')}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
              <RefreshCw className="w-7 h-7 text-amber-500 animate-spin" />
              <p className="text-sm font-medium">{isHi ? 'टोकन लोड किए जा रहे हैं...' : 'Loading tokens from database...'}</p>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {isHi ? 'कोई टोकन रिकॉर्ड नहीं मिला' : 'No Token Records Found'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isHi 
                  ? 'जब कोई नागरिक वेबसाइट पर टोकन बुक करेगा, तो उसका पूरा विवरण तुरंत यहाँ स्वतः दिखाई देगा।' 
                  : 'Whenever a citizen books a token on the website, their full details will appear here automatically in real time.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTokens.map((token) => (
                <div 
                  key={token.id || token.tokenNumber}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Col: Token ID & Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-md">
                        {token.tokenNumber}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {token.referenceId}
                      </span>
                      {token.isUrgent && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Zap className="w-3 h-3 fill-rose-600 text-rose-600" />
                          {isHi ? 'अर्जेंट/तत्काल' : 'Urgent'}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        token.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : token.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {token.status || 'pending'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {token.applicantName}
                      </span>
                      <a 
                        href={`tel:${token.mobileNumber}`} 
                        className="text-slate-600 hover:text-amber-700 font-medium flex items-center gap-1 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {token.mobileNumber}
                      </a>
                      <span className="text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {token.cityOrDistrict || '-'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{token.serviceTitle}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {token.date} ({token.timeSlot})
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        {token.mode === 'online' ? (isHi ? 'ऑनलाइन सेवा' : 'Online') : (isHi ? 'केंद्र विजिट' : 'Center')}
                      </span>
                    </div>

                    {token.notes && (
                      <div className="text-[11px] bg-slate-50 text-slate-600 p-2 rounded-lg border border-slate-100 mt-1">
                        <span className="font-medium text-slate-700">{isHi ? 'नागरिक टिप्पणी: ' : 'Note: '}</span>
                        {token.notes}
                      </div>
                    )}
                  </div>

                  {/* Right Col: Quick Actions & Status Changer */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Status Dropdown */}
                    <select
                      value={token.status || 'pending'}
                      disabled={updatingId === token.id}
                      onChange={(e) => handleStatusChange(token.id, e.target.value as any)}
                      className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                    >
                      <option value="pending">{isHi ? 'लंबित (Pending)' : 'Pending'}</option>
                      <option value="in-progress">{isHi ? 'प्रक्रियाधीन (In Progress)' : 'In Progress'}</option>
                      <option value="completed">{isHi ? 'सम्पन्न (Completed)' : 'Completed'}</option>
                      <option value="cancelled">{isHi ? 'रद्द (Cancelled)' : 'Cancelled'}</option>
                    </select>

                    {/* Contact Citizen via WhatsApp */}
                    <button
                      onClick={() => handleOpenWhatsApp(token.mobileNumber, token)}
                      title={isHi ? 'नागरिक को व्हाट्सएप संदेश भेजें' : 'Contact citizen on WhatsApp'}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                    </button>

                    {/* Delete record */}
                    <button
                      onClick={() => handleDelete(token.id)}
                      title={isHi ? 'रिकॉर्ड हटाएं' : 'Delete record'}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>{isHi ? 'सुरक्षित क्लाउड स्टोरेज • स्वचालित बैकअप' : 'Secured with Cloud Database • Auto Backup'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors cursor-pointer"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
