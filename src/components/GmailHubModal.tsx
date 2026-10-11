import React, { useState, useEffect } from 'react';
import { Language } from '../types/service';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  getAccessToken, 
  logout, 
  initAuth 
} from '../lib/firebaseAuth';
import { 
  listGmailMessages, 
  getGmailMessageDetail, 
  sendGmailMessage, 
  GmailMessageSummary, 
  GmailMessageDetail 
} from '../lib/gmailApi';
import { 
  Mail, 
  Send, 
  Inbox, 
  Search, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  FileText, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';

interface GmailHubModalProps {
  language: Language;
  onClose: () => void;
  prefilledRecipient?: string;
  prefilledSubject?: string;
  prefilledBody?: string;
}

export const GmailHubModal: React.FC<GmailHubModalProps> = ({
  language,
  onClose,
  prefilledRecipient = '',
  prefilledSubject = '',
  prefilledBody = ''
}) => {
  const isHi = language === 'hi';

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  // Inbox state
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // Compose state
  const [recipient, setRecipient] = useState<string>(prefilledRecipient);
  const [subject, setSubject] = useState<string>(prefilledSubject);
  const [bodyText, setBodyText] = useState<string>(prefilledBody);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Mandatory confirmation dialog for sending email
  const [showSendConfirmation, setShowSendConfirmation] = useState<boolean>(false);

  // Initialize Auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // When prefilled info changes and modal opens, switch to compose
  useEffect(() => {
    if (prefilledRecipient || prefilledSubject || prefilledBody) {
      setRecipient(prefilledRecipient);
      setSubject(prefilledSubject);
      setBodyText(prefilledBody);
      setActiveTab('compose');
    }
  }, [prefilledRecipient, prefilledSubject, prefilledBody]);

  // Load messages when token is available
  useEffect(() => {
    if (token && activeTab === 'inbox') {
      fetchMessages(token, searchQuery);
    }
  }, [token, activeTab]);

  const fetchMessages = async (authToken: string, query: string = '') => {
    setIsLoadingMessages(true);
    try {
      const list = await listGmailMessages(authToken, query);
      setMessages(list);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err?.message || 'Google sign-in could not be completed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setMessages([]);
    setSelectedMessage(null);
  };

  const handleOpenMessage = async (msgSummary: GmailMessageSummary) => {
    if (!token) return;
    setIsLoadingDetail(true);
    try {
      const detail = await getGmailMessageDetail(token, msgSummary.id);
      setSelectedMessage(detail);
    } catch (err) {
      console.error('Failed to load message detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !bodyText.trim()) return;
    // MANDATORY REQUIREMENT: Show confirmation dialog before sending email on behalf of user
    setShowSendConfirmation(true);
  };

  const handleConfirmSend = async () => {
    if (!token) return;
    setShowSendConfirmation(false);
    setIsSending(true);
    setSendSuccess(false);

    try {
      await sendGmailMessage(token, recipient, subject, bodyText);
      setSendSuccess(true);
      setTimeout(() => {
        setRecipient('');
        setSubject('');
        setBodyText('');
        setSendSuccess(false);
        setActiveTab('inbox');
        fetchMessages(token);
      }, 2000);
    } catch (err: any) {
      alert(`Email sending failed: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Quick department email helper
  const applyOfficialTemplate = (dept: 'uidai' | 'pan' | 'cyber' | 'bijli') => {
    if (dept === 'uidai') {
      setRecipient('helpdesk@uidai.gov.in');
      setSubject(isHi ? 'आधार कार्ड अपडेट संदर्भ - सहायता अनुरोध' : 'Aadhaar Card Update Inquiry');
      setBodyText(isHi 
        ? `सादर सेवा में,\n\nमैं अपने आधार कार्ड से संबंधित समस्या के संबंध में यह ईमेल भेज रहा हूँ।\n\nआवेदक का नाम: ${user?.displayName || ''}\nपंजीकृत ईमेल: ${user?.email || ''}\nएनरोलमेंट / संदर्भ संख्या: \n\nकृपया निवारण करें।`
        : `Respected UIDAI Helpdesk,\n\nI am reaching out regarding my Aadhaar application status.\n\nApplicant: ${user?.displayName || ''}\nRegistered Email: ${user?.email || ''}\nEnrollment / Reference ID: \n\nPlease assist.`
      );
    } else if (dept === 'pan') {
      setRecipient('pan@incometax.gov.in');
      setSubject(isHi ? 'नया पैन कार्ड आवेदन पावती स्थिति' : 'New PAN Card Application Tracking Inquiry');
      setBodyText(isHi
        ? `सेवा में श्रीमान,\n\nमैंने नए पैन कार्ड हेतु आवेदन किया है।\nपावती संख्या (Acknowledgment No): \nनाम: ${user?.displayName || ''}\n\nकृपया स्थिति बताएं।`
        : `To Income Tax PAN Services,\n\nRegarding status of PAN Form 49A application.\nAcknowledgment Number: \nApplicant Name: ${user?.displayName || ''}\n\nKindly update status.`
      );
    } else if (dept === 'cyber') {
      setRecipient('cybercrime-helpdesk@gov.in');
      setSubject(isHi ? 'अति महत्वपूर्ण - ऑनलाइन फ्रॉड रिपोर्ट शिकायत' : 'Urgent: Online Cyber Incident / UPI Dispute Report');
      setBodyText(isHi
        ? `सेवा में साइबर सेल,\n\nमेरे बैंक / यूपीआई खाते से अनधिकृत लेनदेन हुआ है।\nलेनदेन यूटीआर / Tx ID: \nतारीख व समय: \nहानि राशि: ₹\n\nकृपया शीघ्र संज्ञान लें। 1930 पर भी शिकायत दर्ज की गई है।`
        : `To Cyber Crime Helpdesk,\n\nReporting an unauthorized transaction on my account.\nTransaction Reference / Tx ID: \nDate & Time: \nAmount: ₹\n\nRequesting prompt intervention. Incident also notified to 1930.`
      );
    } else if (dept === 'bijli') {
      setRecipient('customercare@uppclonline.com');
      setSubject(isHi ? 'बिजली बिल भुगतान पावती व सुधार शिकायत' : 'Electricity Bill Payment Inquiry');
      setBodyText(isHi
        ? `सेवा में विद्युत वितरण निगम,\n\nउपभोक्ता खाता संख्या (CA No): \nउपभोक्ता नाम: ${user?.displayName || ''}\nभुगतान संदर्भ संख्या: \n\nबिल संबंधी समाधान हेतु प्रेषित।`
        : `To Customer Support,\n\nRegarding Consumer Account ID: \nConsumer Name: ${user?.displayName || ''}\nPayment Reference: \n\nRequesting bill reconciliation.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-700 via-rose-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/15 text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>{isHi ? 'जीमेल संचार केंद्र (Gmail Citizen Hub)' : 'Gmail Citizen Communications'}</span>
              </h3>
              <p className="text-xs text-rose-100">
                {isHi ? 'सरकारी पावती, रसीदें व ईमेल सीधे अपने खाते से भेजें व देखें' : 'View official e-governance notices & send verified citizen emails'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-rose-200 hover:text-white p-1 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Barrier / Header Bar */}
        {!user || !token ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Mail className="w-8 h-8" />
            </div>

            <div className="max-w-md">
              <h4 className="text-lg font-bold text-slate-900">
                {isHi ? 'अपने गूगल खाते से कनेक्ट करें' : 'Connect with your Google Account'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {isHi
                  ? 'अपनी अनुमति से अपने आधिकारिक जीमेल इनबॉक्स को देखें, बिजली बिल रसीद स्वयं को भेजें तथा सरकारी विभागों (UIDAI, आयकर, साइबर सेल) को सीधे ईमेल करें।'
                  : 'Access your official citizen email notices, send receipts to your inbox, or draft inquiries to government helpdesks with your permission.'}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            {/* Official Material Styled Sign In with Google Button as mandated by skill */}
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="mt-2 inline-flex items-center justify-center gap-3 px-5 py-2.5 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 hover:shadow-md transition-all text-slate-700 font-semibold text-xs sm:text-sm disabled:opacity-60 cursor-pointer"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              <span>{isHi ? 'Google के साथ साइन इन करें' : 'Sign in with Google'}</span>
            </button>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHi ? 'सुरक्षित प्रमाणीकरण · टोकन केवल मेमोरी में सुरक्षित रहता है' : 'OAuth token securely kept in memory only'}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* User Bar & Tab Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User avatar" className="w-7 h-7 rounded-full border border-slate-300" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 leading-tight">{user.displayName || user.email}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300">
                  <button
                    onClick={() => {
                      setActiveTab('inbox');
                      setSelectedMessage(null);
                    }}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'inbox' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>{isHi ? 'इनबॉक्स (Inbox)' : 'Inbox'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('compose')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'compose' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isHi ? 'ईमेल भेजें (Compose)' : 'Compose'}</span>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  title={isHi ? 'लॉगआउट करें' : 'Sign out'}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab: INBOX */}
            {activeTab === 'inbox' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                {selectedMessage ? (
                  // Detail View
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{isHi ? 'इनबॉक्स सूची पर वापस जाएं' : 'Back to Inbox'}</span>
                    </button>

                    <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                      <div className="pb-3 border-b border-slate-100">
                        <h4 className="text-base sm:text-lg font-bold text-slate-900">
                          {selectedMessage.subject}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{isHi ? 'प्रेषक (From):' : 'From:'} <strong className="text-slate-700">{selectedMessage.from}</strong></span>
                          <span>·</span>
                          <span>{selectedMessage.date}</span>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans max-h-96 overflow-y-auto">
                        {selectedMessage.body}
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="space-y-4 flex-1 flex flex-col">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && token && fetchMessages(token, searchQuery)}
                          placeholder={isHi ? 'ईमेल में खोजें (जैसे: electricity, aadhaar, pan...)' : 'Search emails (e.g. aadhaar, electricity, result)...'}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => token && fetchMessages(token, searchQuery)}
                          disabled={isLoadingMessages}
                          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          {isLoadingMessages ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                          <span>{isHi ? 'खोजें' : 'Filter'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            if (token) fetchMessages(token, '');
                          }}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                        >
                          {isHi ? 'रीसेट' : 'Reset'}
                        </button>
                      </div>
                    </div>

                    {/* Quick filter tag buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{isHi ? 'त्वरित फ़िल्टर:' : 'Quick Filters:'}</span>
                      {[
                        { label: isHi ? 'आधार (Aadhaar)' : 'Aadhaar', q: 'aadhaar OR uidai' },
                        { label: isHi ? 'बिजली बिल' : 'Electricity', q: 'electricity OR bill OR uppcl' },
                        { label: isHi ? 'पैन कार्ड' : 'PAN Card', q: 'pan card OR incometax' },
                        { label: isHi ? 'नौकरी / रिजल्ट' : 'Jobs/Exams', q: 'ssc OR admit card OR vacancy' }
                      ].map((f) => (
                        <button
                          key={f.label}
                          onClick={() => {
                            setSearchQuery(f.q);
                            if (token) fetchMessages(token, f.q);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-rose-50 hover:text-rose-800 text-slate-600 border border-slate-200 transition-colors"
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto space-y-2 mt-2">
                      {isLoadingMessages ? (
                        <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-rose-600" />
                          <span>{isHi ? 'जीमेल संदेश लोड हो रहे हैं...' : 'Loading Gmail messages...'}</span>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => handleOpenMessage(msg)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              msg.isUnread
                                ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/70 font-semibold text-slate-900'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-slate-900 truncate max-w-[240px]">{msg.from}</span>
                              <span className="text-[11px] text-slate-400 shrink-0">{msg.date}</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                              {msg.subject}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {msg.snippet}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <span>{isHi ? 'कोई संदेश नहीं मिला।' : 'No messages found for this query.'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: COMPOSE */}
            {activeTab === 'compose' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Official template buttons */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {isHi ? 'आधिकारिक विभाग को त्वरित ईमेल टेम्पलेट:' : 'Quick Official Department Templates:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => applyOfficialTemplate('uidai')}
                      className="p-2 rounded-lg border border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/40 text-left transition-colors"
                    >
                      <div className="font-bold text-slate-900">UIDAI आधार</div>
                      <div className="text-[11px] text-slate-500">helpdesk@uidai</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyOfficialTemplate('pan')}
                      className="p-2 rounded-lg border border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/40 text-left transition-colors"
                    >
                      <div className="font-bold text-slate-900">पैन कार्ड शाखा</div>
                      <div className="text-[11px] text-slate-500">pan@incometax</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyOfficialTemplate('cyber')}
                      className="p-2 rounded-lg border border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/40 text-left transition-colors"
                    >
                      <div className="font-bold text-slate-900">साइबर सेल फ्रॉड</div>
                      <div className="text-[11px] text-slate-500">cybercrime-help</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyOfficialTemplate('bijli')}
                      className="p-2 rounded-lg border border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/40 text-left transition-colors"
                    >
                      <div className="font-bold text-slate-900">विद्युत विभाग</div>
                      <div className="text-[11px] text-slate-500">customercare</div>
                    </button>
                  </div>
                </div>

                {sendSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'ईमेल सफलतापूर्वक भेज दिया गया है!' : 'Email successfully sent via Gmail!'}</span>
                  </div>
                )}

                <form onSubmit={handleInitiateSend} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {isHi ? 'प्राप्तकर्ता का ईमेल (To):' : 'Recipient Email (To):'}
                    </label>
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="e.g. officer@edistrict.gov.in"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {isHi ? 'विषय (Subject):' : 'Subject:'}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={isHi ? 'ईमेल का विषय' : 'Subject of email'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {isHi ? 'संदेश सामग्री (Message Body):' : 'Message Body:'}
                    </label>
                    <textarea
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      rows={6}
                      placeholder={isHi ? 'अपना संदेश यहाँ लिखें...' : 'Type your email message...'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs font-sans"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isHi ? 'आपके खाते से प्रेषित होगा' : 'Sent from your authorized Google Account'}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>{isHi ? 'ईमेल भेजें' : 'Send Email'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG (Workspace Integration Skill Requirement) */}
      {showSendConfirmation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-rose-100 text-rose-700 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isHi ? 'ईमेल भेजने की पुष्टि करें' : 'Confirm Sending Email'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {isHi
                    ? `क्या आप निश्चित रूप से अपने गूगल खाते (${user?.email}) से यह ईमेल भेजना चाहते हैं?`
                    : `Are you sure you want to send this email from your Google account (${user?.email})?`}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-200">
              <div>
                <span className="text-slate-500">{isHi ? 'प्राप्तकर्ता:' : 'To:'} </span>
                <span className="font-bold text-slate-800 font-mono">{recipient}</span>
              </div>
              <div>
                <span className="text-slate-500">{isHi ? 'विषय:' : 'Subject:'} </span>
                <span className="font-semibold text-slate-800">{subject}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSendConfirmation(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHi ? 'पुष्टि करें और भेजें' : 'Confirm & Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
