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
  listGoogleDocs, 
  getGoogleDoc, 
  createGoogleDoc, 
  appendTextToGoogleDoc, 
  trashGoogleDoc, 
  GoogleDocSummary, 
  GoogleDocContent 
} from '../lib/googleDocsApi';
import { 
  FileText, 
  Plus, 
  Search, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  ExternalLink, 
  Trash2, 
  ArrowLeft,
  FileCheck2,
  Send,
  Loader2,
  FolderOpen,
  Share2,
  Sparkles
} from 'lucide-react';

interface GoogleDocsHubModalProps {
  language: Language;
  onClose: () => void;
  initialTemplate?: {
    title: string;
    content: string;
  };
}

export const GoogleDocsHubModal: React.FC<GoogleDocsHubModalProps> = ({
  language,
  onClose,
  initialTemplate
}) => {
  const isHi = language === 'hi';

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'my-docs' | 'new-doc' | 'view-doc'
  const [activeTab, setActiveTab] = useState<'my-docs' | 'new-doc' | 'view-doc'>('my-docs');

  // Documents listing state
  const [docsList, setDocsList] = useState<GoogleDocSummary[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [listError, setListError] = useState<string | null>(null);

  // Selected Doc Detail state
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<GoogleDocContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [appendTextInput, setAppendTextInput] = useState<string>('');
  const [isAppending, setIsAppending] = useState<boolean>(false);
  const [appendSuccess, setAppendSuccess] = useState<boolean>(false);

  // New Doc Form state
  const [newTitle, setNewTitle] = useState<string>(initialTemplate?.title || '');
  const [newContent, setNewContent] = useState<string>(initialTemplate?.content || '');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);

  // Destructive Action Confirmation Dialog state
  const [docToTrash, setDocToTrash] = useState<GoogleDocSummary | null>(null);
  const [isTrashing, setIsTrashing] = useState<boolean>(false);

  // Check auth on mount
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

    // Also check synchronously
    getAccessToken().then((t) => {
      if (t) {
        setToken(t);
      }
      setIsLoadingAuth(false);
    });

    if (initialTemplate) {
      setActiveTab('new-doc');
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initialTemplate]);

  // Load docs when token is available or tab is 'my-docs'
  useEffect(() => {
    if (token && activeTab === 'my-docs') {
      fetchDocs();
    }
  }, [token, activeTab]);

  const fetchDocs = async (query = searchQuery) => {
    if (!token) return;
    setIsLoadingDocs(true);
    setListError(null);
    try {
      const docs = await listGoogleDocs(token, query);
      setDocsList(docs);
    } catch (err: any) {
      console.error('Error fetching docs:', err);
      setListError(err.message || 'गूगल डॉक्स सूची लोड करने में त्रुटि हुई।');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        fetchDocs();
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setAuthError(err.message || 'Google साइन-इन विफल रहा। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setDocsList([]);
    setDocContent(null);
    setActiveTab('my-docs');
  };

  const handleOpenDocDetail = async (docId: string) => {
    if (!token) return;
    setSelectedDocId(docId);
    setActiveTab('view-doc');
    setIsLoadingContent(true);
    setAppendSuccess(false);
    try {
      const content = await getGoogleDoc(token, docId);
      setDocContent(content);
    } catch (err: any) {
      console.error('Error fetching doc content:', err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      handleSignIn();
      return;
    }
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setCreateSuccess(null);
    try {
      const result = await createGoogleDoc(token, newTitle, newContent);
      setCreateSuccess(
        isHi 
          ? `दस्तावेज़ "${result.title}" सफलतापूर्वक गूगल डॉक्स में बनाया गया!` 
          : `Document "${result.title}" created successfully in Google Docs!`
      );
      setCreatedDocUrl(`https://docs.google.com/document/d/${result.documentId}/edit`);
      // Reset inputs
      setNewTitle('');
      setNewContent('');
      // Refresh listing
      fetchDocs();
    } catch (err: any) {
      console.error('Create Doc failed:', err);
      alert(err.message || 'गूगल डॉक्स बनाने में समस्या आई।');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAppendText = async () => {
    if (!token || !selectedDocId || !appendTextInput.trim()) return;
    // Explicit confirmation for mutating document
    const ok = window.confirm(
      isHi 
        ? 'क्या आप इस दस्तावेज़ में नया विवरण जोड़ना (Append) चाहते हैं?' 
        : 'Are you sure you want to append this text to the Google Doc?'
    );
    if (!ok) return;

    setIsAppending(true);
    try {
      await appendTextToGoogleDoc(token, selectedDocId, appendTextInput);
      setAppendSuccess(true);
      setAppendTextInput('');
      // Refresh content
      const updated = await getGoogleDoc(token, selectedDocId);
      setDocContent(updated);
    } catch (err: any) {
      console.error('Append failed:', err);
      alert(err.message || 'दस्तावेज़ में विवरण जोड़ने में त्रुटि हुई।');
    } finally {
      setIsAppending(false);
    }
  };

  // Trashing destructive operation handler with explicit confirmation
  const handleConfirmTrash = async () => {
    if (!token || !docToTrash) return;
    setIsTrashing(true);
    try {
      await trashGoogleDoc(token, docToTrash.id);
      setDocsList((prev) => prev.filter((d) => d.id !== docToTrash.id));
      if (selectedDocId === docToTrash.id) {
        setSelectedDocId(null);
        setDocContent(null);
        setActiveTab('my-docs');
      }
      setDocToTrash(null);
    } catch (err: any) {
      console.error('Trash doc failed:', err);
      alert(err.message || 'दस्तावेज़ हटाने में समस्या आई।');
    } finally {
      setIsTrashing(false);
    }
  };

  // Preset ready-to-use Digital Seva citizen templates
  const applyPresetTemplate = (templateType: 'affidavit' | 'application' | 'noc' | 'resume') => {
    if (templateType === 'affidavit') {
      setNewTitle(isHi ? 'शपथ पत्र प्रारूप (सामान्य घोषणा)' : 'General Affidavit Declaration');
      setNewContent(
`शपथ पत्र (Affidavit)
समक्ष: सक्षम प्राधिकारी / डिजिटल सेवा केंद्र

मैं, ____________________ पुत्र/पुत्री श्री ____________________, निवासी ____________________, जिला ____________________, राज्य ____________________, निम्नलिखित सत्यनिष्ठा पूर्वक घोषणा करता/करती हूँ:

1. यह कि मैं उपरोक्त पते का स्थायी निवासी हूँ।
2. यह कि मेरे द्वारा प्रस्तुत सभी प्रमाण पत्र एवं जानकारी पूर्णतः सत्य एवं प्रामाणिक हैं।
3. यह कि इसमें कोई भी तथ्य छुपाया नहीं गया है।

स्थान: ____________________
दिनांक: ${new Date().toLocaleDateString('hi-IN')}

शपथकर्ता के हस्ताक्षर: ____________________`
      );
    } else if (templateType === 'application') {
      setNewTitle(isHi ? 'प्रार्थना पत्र - प्रमाण पत्र / सेवा सुधार हेतु' : 'Citizen Application Letter');
      setNewContent(
`सेवा में,
श्रीमान जन सेवा केंद्र / सक्षम अधिकारी महोदय,
विषय: सरकारी प्रमाण पत्र / सेवा में सुधार व नवीनीकरण हेतु प्रार्थना पत्र।

महोदय,
सविनय निवेदन है कि प्रार्थी ____________________, निवासी ____________________ है। 
प्रार्थी के ____________________ (दस्तावेज़/सेवा का नाम) में ____________________ का संशोधन / नवीनीकरण किया जाना आवश्यक है।

संलग्न दस्तावेज:
1. आधार कार्ड छायाप्रति
2. पूर्व आवेदन संख्या / रसीद
3. निवास प्रमाण पत्र

अतः श्रीमान से निवेदन है कि उक्त प्रार्थना पत्र पर विचार कर उचित कार्यवाही करने की कृपा करें।

दिनांक: ${new Date().toLocaleDateString('hi-IN')}
भवदीय,
नाम: ____________________
मोबाइल: ____________________`
      );
    } else if (templateType === 'noc') {
      setNewTitle(isHi ? 'अनापत्ति प्रमाण पत्र (NOC Format)' : 'No Objection Certificate (NOC)');
      setNewContent(
`अनापत्ति प्रमाण पत्र (No Objection Certificate - NOC)

प्रमाणित किया जाता है कि मैं ____________________, पुत्र/पत्नी श्री ____________________, पता: ____________________ 
को श्री/सुश्री ____________________ द्वारा ____________________ कार्य / सेवा हेतु आवेदन करने पर किसी भी प्रकार की आपत्ति नहीं है।

यह प्रमाण पत्र प्रार्थी के अनुरोध पर उनके आधिकारिक कार्य हेतु जारी किया जा रहा है।

स्थान: ____________________
दिनांक: ${new Date().toLocaleDateString('hi-IN')}

हस्ताक्षर / सहमति कर्ता: ____________________`
      );
    } else if (templateType === 'resume') {
      setNewTitle(isHi ? 'बायोडाटा - नौकरी व साक्षात्कार प्रारूप' : 'Biodata & Job Application');
      setNewContent(
`बायोडाटा / RESUME
डिजिटल नागरिक सेवा केंद्र

पूरा नाम: ____________________
पिता का नाम: ____________________
जन्म तिथि: ____________________
मोबाइल नंबर: ____________________
ईमेल पता: ____________________
स्थायी पता: ____________________

शैक्षणिक योग्यता (Educational Qualification):
1. 10th (High School) - बोर्ड: __________, वर्ष: ______, प्रतिशत: _____%
2. 12th (Intermediate) - बोर्ड: __________, वर्ष: ______, प्रतिशत: _____%
3. स्नातक (Graduation) - विश्वविद्यालय: __________, वर्ष: ______, प्रतिशत: _____%

कंप्यूटर कौशल (Technical Skills):
• Computer Basic (MS Office, Word, Excel, Internet)
• Hindi & English Typing
• Data Entry

कार्य अनुभव:
__________________________________________________

दिनांक: ${new Date().toLocaleDateString('hi-IN')}
हस्ताक्षर: ____________________`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {isHi ? 'गूगल डॉक्स दस्तावेज़ केंद्र' : 'Google Docs Document Hub'}
                </h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30 font-medium">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-blue-100/90">
                {isHi 
                  ? 'शपथ पत्र, प्रार्थना पत्र, बायोडाटा व सरकारी सेवा दस्तावेज सीधे Google Docs में बनाएं व देखें' 
                  : 'Create, view & manage official affidavits, applications & resumes directly in Google Docs'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Auth Banner & Tabs Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('my-docs')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'my-docs'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isHi ? 'मेरे दस्तावेज़ (My Docs)' : 'My Documents'}
            </button>
            <button
              onClick={() => setActiveTab('new-doc')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                activeTab === 'new-doc'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHi ? 'नया दस्तावेज़ बनाएं' : 'Create New Doc'}</span>
            </button>
            {selectedDocId && (
              <button
                onClick={() => setActiveTab('view-doc')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'view-doc'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'दस्तावेज़ विवरण' : 'Doc Viewer'}
              </button>
            )}
          </div>

          {/* User Account / Sign In */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-medium text-slate-700 max-w-[140px] truncate" title={user.email || ''}>
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  title={isHi ? 'साइन आउट करें' : 'Sign Out'}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? (isHi ? 'कनेक्ट हो रहा है...' : 'Connecting...') : (isHi ? 'Google से साइन-इन करें' : 'Sign in with Google')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* Auth warning if not signed in */}
          {!user && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">
                  {isHi ? 'गूगल डॉक्स से कनेक्ट करें' : 'Connect to Google Docs'}
                </p>
                <p className="mt-0.5 text-amber-700">
                  {isHi 
                    ? 'अपने व्यक्तिगत Google Drive से सीधे दस्तावेज़ बनाने, प्रारूप तैयार करने और सुरक्षित रूप से सहेजने के लिए कृपया ऊपर दिए गए "Google से साइन-इन करें" बटन पर क्लिक करें।' 
                    : 'Please sign in with Google to create, format, and save citizen documents directly into your Google Docs & Drive.'}
                </p>
              </div>
              <button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs shadow-xs transition-colors shrink-0"
              >
                {isLoggingIn ? '...' : (isHi ? 'साइन इन करें' : 'Sign In')}
              </button>
            </div>
          )}

          {/* TAB 1: MY DOCS LIST */}
          {activeTab === 'my-docs' && (
            <div className="space-y-4">
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchDocs(searchQuery)}
                    placeholder={isHi ? 'Google Docs में खोजें (उदा: शपथ पत्र, बायोडाटा, आवेदन)...' : 'Search in Google Docs (e.g. Affidavit, Resume)...'}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchDocs(searchQuery)}
                    disabled={isLoadingDocs || !token}
                    className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDocs ? 'animate-spin' : ''}`} />
                    <span>{isHi ? 'रीफ्रेश' : 'Refresh'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('new-doc')}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isHi ? 'नया बनाएँ' : 'New Doc'}</span>
                  </button>
                </div>
              </div>

              {/* Status or error message */}
              {listError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {listError}
                </div>
              )}

              {/* Docs Grid / List */}
              {isLoadingDocs ? (
                <div className="py-16 text-center text-slate-500">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-2" />
                  <p className="text-xs">{isHi ? 'Google Docs लोड हो रहे हैं...' : 'Loading Google Docs...'}</p>
                </div>
              ) : docsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => handleOpenDocDetail(doc.id)}
                            className="font-semibold text-slate-900 text-xs sm:text-sm truncate cursor-pointer hover:text-blue-600"
                            title={doc.name}
                          >
                            {doc.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {doc.modifiedTime ? new Date(doc.modifiedTime).toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : ''}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleOpenDocDetail(doc.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>{isHi ? 'खोलें व पढ़ें' : 'View Content'}</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                          {doc.webViewLink && (
                            <a
                              href={doc.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-slate-800 p-1 rounded"
                              title={isHi ? 'गूगल डॉक्स में खोलें' : 'Open in Google Docs'}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => setDocToTrash(doc)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                            title={isHi ? 'हटाएं (Move to Trash)' : 'Move to Trash'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-14 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    {isHi ? 'कोई Google Doc नहीं मिला' : 'No Google Docs Found'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {isHi 
                      ? 'नागरिक सेवा हेतु शपथ पत्र या आवेदन पत्र बनाने के लिए ऊपर "नया दस्तावेज़ बनाएं" पर क्लिक करें।' 
                      : 'Click "Create New Doc" to generate citizen applications or affidavits directly into your Google Docs.'}
                  </p>
                  <button
                    onClick={() => setActiveTab('new-doc')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    {isHi ? '+ नया दस्तावेज़ बनाएं' : '+ Create Document'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE NEW DOC */}
          {activeTab === 'new-doc' && (
            <div className="space-y-5">
              {/* Ready Presets Bar */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <div className="flex items-center gap-2 mb-2 text-blue-900 font-semibold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{isHi ? 'लोकप्रिय जन सेवा केंद्र प्रारूप (Ready Templates):' : 'Popular Citizen Templates:'}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('affidavit')}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-100/70 border border-blue-200 rounded-md font-medium text-blue-800 transition-colors shadow-2xs"
                  >
                    {isHi ? '📜 शपथ पत्र (Affidavit)' : '📜 Affidavit Format'}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('application')}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-100/70 border border-blue-200 rounded-md font-medium text-blue-800 transition-colors shadow-2xs"
                  >
                    {isHi ? '📝 सेवा प्रार्थना पत्र (Application)' : '📝 Citizen Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('noc')}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-100/70 border border-blue-200 rounded-md font-medium text-blue-800 transition-colors shadow-2xs"
                  >
                    {isHi ? '📄 अनापत्ति पत्र (NOC)' : '📄 NOC Certificate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('resume')}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-100/70 border border-blue-200 rounded-md font-medium text-blue-800 transition-colors shadow-2xs"
                  >
                    {isHi ? '🎓 बायोडाटा व रिज्यूमे (Resume)' : '🎓 Job Biodata'}
                  </button>
                </div>
              </div>

              {/* Success Notification with View Link */}
              {createSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{createSuccess}</span>
                  </div>
                  {createdDocUrl && (
                    <a
                      href={createdDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium text-xs flex items-center gap-1 shrink-0"
                    >
                      <span>{isHi ? 'गूगल डॉक्स में देखें' : 'Open in Google Docs'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleCreateDoc} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'दस्तावेज़ का शीर्षक (Document Title):' : 'Document Title:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={isHi ? 'उदा: जाति प्रमाण पत्र हेतु शपथ पत्र' : 'e.g. Caste Certificate Application'}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'दस्तावेज़ की सामग्री (Document Content):' : 'Document Content:'}
                  </label>
                  <textarea
                    rows={10}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={isHi ? 'यहाँ अपना शपथ पत्र, प्रार्थना पत्र या बायोडाटा विवरण टाइप करें...' : 'Type or paste the contents of the document here...'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-docs')}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newTitle.trim()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isHi ? 'बनाया जा रहा है...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="w-4 h-4" />
                        <span>{isHi ? 'Google Docs में सुरक्षित करें' : 'Save to Google Docs'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: VIEW & APPEND DOC */}
          {activeTab === 'view-doc' && selectedDocId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('my-docs')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isHi ? 'सभी दस्तावेज़ों पर लौटें' : 'Back to Documents'}</span>
                </button>

                <a
                  href={`https://docs.google.com/document/d/${selectedDocId}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium flex items-center gap-1"
                >
                  <span>{isHi ? 'Google Docs में खोलें' : 'Edit in Google Docs'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {isLoadingContent ? (
                <div className="py-16 text-center text-slate-500">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-2" />
                  <p className="text-xs">{isHi ? 'सामग्री लोड हो रही है...' : 'Loading document text...'}</p>
                </div>
              ) : docContent ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      {docContent.title}
                    </h3>
                    <div className="p-4 bg-white rounded-lg border border-slate-200 max-h-[300px] overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed shadow-2xs">
                      {docContent.bodyText || (isHi ? '(दस्तावेज़ में अभी कोई टेक्स्ट नहीं है)' : '(Empty document)')}
                    </div>
                  </div>

                  {/* Append Text Form */}
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">
                    <label className="block text-xs font-semibold text-slate-800">
                      {isHi ? 'दस्तावेज़ में अतिरिक्त विवरण जोड़ें (Append Text):' : 'Append Additional Details to this Document:'}
                    </label>
                    <textarea
                      rows={3}
                      value={appendTextInput}
                      onChange={(e) => setAppendTextInput(e.target.value)}
                      placeholder={isHi ? 'उदा: नोट: आवेदक द्वारा सत्यापन प्रमाण पत्र प्रस्तुत किया गया।' : 'e.g. Note: Verification certificate verified by operator.'}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    ></textarea>

                    {appendSuccess && (
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isHi ? 'विवरण सफलतापूर्वक जोड़ा गया!' : 'Text appended successfully!'}</span>
                      </p>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleAppendText}
                        disabled={isAppending || !appendTextInput.trim()}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        {isAppending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{isHi ? 'जोड़ा जा रहा है...' : 'Appending...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{isHi ? 'दस्तावेज़ में जोड़ें' : 'Append to Doc'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isHi 
                ? 'गूगल डॉक्स API द्वारा संचालित - आपकी अनुमति से आपके सुरक्षित Google Drive खाते में सीधे सुरक्षित' 
                : 'Powered by Google Docs API - Safely synced directly to your personal Google Drive with your consent'}
            </span>
          </div>
          <button onClick={onClose} className="hover:text-slate-800 font-medium">
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>

      {/* Confirmation Dialog for Destructive Trash Operation (MANDATORY per workspace skill) */}
      {docToTrash && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isHi ? 'क्या आप इस दस्तावेज़ को हटाना चाहते हैं?' : 'Move document to trash?'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {isHi 
                    ? `दस्तावेज़ "${docToTrash.name}" को आपके Google Drive रीसायकल बिन में भेजा जाएगा।` 
                    : `Document "${docToTrash.name}" will be moved to your Google Drive trash.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDocToTrash(null)}
                disabled={isTrashing}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmTrash}
                disabled={isTrashing}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {isTrashing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isHi ? 'हटाया जा रहा है...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <span>{isHi ? 'हटाने की पुष्टि करें' : 'Confirm Delete'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
