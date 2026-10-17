import { ServiceItem, ApplicationStatusResult } from '../types/service';

export const SERVICES_DATA: ServiceItem[] = [
  // 1. Sarkari Jobs & Results (Primary Position)
  {
    id: 'sarkari-results-jobs',
    titleHi: 'सरकारी नौकरी फॉर्म व रिजल्ट्स (Sarkari Result Hub)',
    titleEn: 'Sarkari Jobs, Admit Cards & Results Hub',
    category: 'jobs',
    shortDescHi: 'एसएससी, रेलवे, पुलिस, शिक्षक भर्ती व रक्षा विभाग के नवीनतम ऑनलाइन आवेदन, एडमिट कार्ड व आंसर की।',
    shortDescEn: 'Latest central & state government recruitments (SSC, UPSC, Railway, Police, Defence) admit cards and results.',
    departmentHi: 'कर्मचारी चयन आयोग व राज्य भर्ती बोर्ड (Recruitment Commissions)',
    departmentEn: 'SSC, UPSC, State Police & Service Selection Boards',
    officialUrl: 'https://sarkariresult12.vercel.app/',
    feeHi: 'सरकारी फीस + ₹100 सेवा शुल्क (Official Exam Fee + ₹100 Service Charge)',
    feeEn: 'Official Exam Fee + ₹100 Service Charge',
    processingTimeHi: 'विज्ञप्ति समय सारिणी अनुसार',
    processingTimeEn: 'As per exam calendar',
    requiredDocsHi: ['10वीं / 12वीं / स्नातक अंकतालिका', 'पासपोर्ट साइज नवीनतम फोटो (सफेद पृष्ठभूमि, 20KB-50KB)', 'साफ हस्ताक्षर (10KB-20KB)', 'जाति व ईडब्ल्यूएस प्रमाण पत्र (यदि लागू हो)'],
    requiredDocsEn: ['10th/12th/Degree Marksheet', 'Latest Passport Photo (White bg, 20KB-50KB)', 'Scanned Signature (10KB-20KB)', 'Category/EWS Certificate if applicable'],
    stepsHi: [
      'भर्ती बोर्ड की आधिकारिक वेबसाइट पर "One Time Registration (OTR)" करें।',
      'सक्रिय भर्ती विज्ञापन के सामने "Apply Now" पर क्लिक करें।',
      'शैक्षणिक योग्यता भरें और हमारे फोटो रीसाइज़र टूल से सही साइज में फोटो-साइन अपलोड करें।',
      'आवेदन शुल्क जमा करके कंफर्मेशन पेज संभाल कर रखें।'
    ],
    stepsEn: [
      'Complete One Time Registration (OTR) on the exam portal.',
      'Click Apply Now next to active vacancy.',
      'Fill qualifications and upload resized photo/signature using our built-in tool.',
      'Submit exam fee and save the printable confirmation page.'
    ],
    iconName: 'FileCheck2',
    badgeHi: 'रोजगार सूचना',
    badgeEn: 'Employment',
    searchKeywords: ['sarkari', 'sarkari naukri', 'naukari', 'nokri', 'job', 'sarkari result', 'result', 'admit card', 'ssc', 'railway', 'police', 'bharti', 'vacancy', 'police bharti', 'recruitment', 'सरकारी नौकरी', 'रिजल्ट', 'भर्ती', 'रोजगार', 'सवेरा', 'नौकरी']
  },
  // Requested Top Order: PF, Scholarship, Aadhaar, PAN
  {
    id: 'epf-pf-services',
    titleHi: 'PF / EPFO सेवाएं (UAN Balance & Advance Claim)',
    titleEn: 'PF / EPFO Services (UAN, Balance & Withdrawal)',
    category: 'pf-tax',
    shortDescHi: 'कर्मचारी भविष्य निधि संगठन (EPFO) पोर्टल द्वारा पीएफ बैलेंस चेक, यूएएन एक्टिवेशन, पीएफ एडवांस निकासी व ट्रांसफर।',
    shortDescEn: 'Provident Fund (EPFO) services including UAN activation, PF balance check, advance claim & transfer.',
    departmentHi: 'कर्मचारी भविष्य निधि संगठन (EPFO / Ministry of Labour)',
    departmentEn: 'Employees Provident Fund Organisation (EPFO)',
    officialUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
    feeHi: 'सेवा शुल्क ₹30 - ₹50',
    feeEn: 'Service Fee ₹30 - ₹50',
    processingTimeHi: '1 से 3 कार्य दिवस',
    processingTimeEn: '1 to 3 Working Days',
    requiredDocsHi: ['UAN नंबर व पासवर्ड', 'आधार कार्ड (मोबाइल नंबर लिंक्ड)', 'बैंक पासबुक / चेक (KYC हेतु)'],
    requiredDocsEn: ['UAN & Password', 'Aadhaar card (linked with mobile)', 'Bank Passbook / Cheque for KYC'],
    stepsHi: [
      'EPFO मेंबर पोर्टल पर UAN व पासवर्ड से लॉगिन करें।',
      'ऑनलाइन सर्विस में जाकर क्लेम (Form 31, 19, 10C) भरें।',
      'आधार ओटीपी सत्यापित करके एडवांस या फुल सेटलमेंट सबमिट करें।'
    ],
    stepsEn: [
      'Login to EPFO member portal with UAN and password.',
      'Go to Online Services and select Form for advance or withdrawal.',
      'Authenticate via Aadhaar OTP and submit claim.'
    ],
    iconName: 'ShieldCheck',
    badgeHi: 'पीएफ सेवा',
    badgeEn: 'PF Services',
    searchKeywords: ['pf', 'epf', 'epfo', 'uan', 'pf balance', 'pf withdrawal', 'pf claim', 'प्रोविडेंट फंड', 'पीएपफ', 'ईपीएफ', 'यूएएन', 'पीएफ बैलेंस']
  },
  {
    id: 'tds-tax-services',
    titleHi: 'TDS क्लेम, आयकर रिटर्न व फॉर्म 16 (TDS Claim)',
    titleEn: 'TDS Claim, Income Tax Return & Form 16',
    category: 'pf-tax',
    shortDescHi: 'टीडीएस क्लेम (TDS Claim), फॉर्म 16 डाउनलोड, आईटीआर (ITR) फाइलिंग व टैक्स रिफंड स्टेटस चेक।',
    shortDescEn: 'TDS claim & refund processing, Form 16 download, Income Tax Return (ITR) filing.',
    departmentHi: 'आयकर विभाग भारत सरकार (Income Tax Department)',
    departmentEn: 'Income Tax Department, Government of India',
    officialUrl: 'https://www.incometax.gov.in/',
    feeHi: 'सेवा शुल्क ₹100 - ₹300',
    feeEn: 'Service Fee ₹100 - ₹300',
    processingTimeHi: '2 से 4 कार्य दिवस',
    processingTimeEn: '2 to 4 Working Days',
    requiredDocsHi: ['पैन कार्ड (PAN Card)', 'फॉर्म 16 / सैलरी स्लिप', 'बैंक स्टेटमेंट व TDS विवरण (Form 26AS)'],
    requiredDocsEn: ['PAN Card', 'Form 16 / Salary slips', 'Bank Statement & Form 26AS TDS details'],
    stepsHi: [
      'आयकर ई-फाइलिंग पोर्टल पर लॉगिन करें।',
      'Form 26AS व Annual Information Statement (AIS) जांचें।',
      'आईटीआर (ITR-1 / ITR-4) भरकर सबमिट करें।'
    ],
    stepsEn: [
      'Login to Income Tax e-filing portal.',
      'Verify Form 26AS and AIS statement.',
      'Fill and submit ITR return.'
    ],
    iconName: 'Banknote',
    badgeHi: 'टैक्स सेवा',
    badgeEn: 'Tax Services',
    searchKeywords: ['tds', 'tax', 'income tax', 'itr', 'form 16', 'form 26as', 'pan tax', 'टीडीएस', 'टैक्स', 'आयकर', 'आईटीआर', 'फॉर्म 16']
  },
  {
    id: 'scholarship-portal',
    titleHi: 'छात्रवृत्ति आवेदन (Pre & Post Matric Scholarship)',
    titleEn: 'Scholarship Application (State & NSP)',
    category: 'welfare',
    shortDescHi: 'कक्षा 9वीं से लेकर उच्च शिक्षा (BA, BSc, BTech, ITI, Diploma) हेतु सरकारी छात्रवृत्ति व शुल्क प्रतिपूर्ति।',
    shortDescEn: 'Pre-matric and post-matric government scholarships and tuition fee reimbursement portal.',
    departmentHi: 'समाज कल्याण विभाग (Social Welfare / National Scholarship Portal)',
    departmentEn: 'National Scholarship Portal (NSP / State Portals)',
    officialUrl: 'https://scholarships.gov.in/',
    feeHi: '100₹',
    feeEn: '100₹',
    processingTimeHi: 'सत्र अनुसार (संस्थान सत्यापन के बाद)',
    processingTimeEn: 'Session-based upon institute verification',
    requiredDocsHi: ['पिछली कक्षा की मार्कशीट', 'आय प्रमाण पत्र (सक्षम अधिकारी द्वारा)', 'फीस रसीद व संस्था नामांकन संख्या'],
    requiredDocsEn: ['Previous qualifying marksheets', 'Valid Income certificate', 'Fee receipt & Institute Roll/Registration Number'],
    stepsHi: [
      'पोर्टल पर Fresh या Renewal रजिस्ट्रेशन करें।',
      'संस्थान का नाम, पाठ्यक्रम, वर्ष और फीस विवरण दर्ज करें।',
      'आय और अंकपत्र विवरण भरकर डिजिटल लॉकर से सत्यापित करें।',
      'आवेदन का फाइनल प्रिंट लेकर सभी कागजातों सहित अपने कॉलेज/स्कूल में जमा करें।'
    ],
    stepsEn: [
      'Register as Fresh or Renewal candidate on scholarship portal.',
      'Enter college name, course, current academic year, and tuition fee.',
      'Input income and marksheets via DigiLocker.',
      'Take final printout and submit hard copy with attachments to college.'
    ],
    iconName: 'GraduationCap',
    badgeHi: 'विद्यार्थी सेवा',
    badgeEn: 'Students',
    searchKeywords: ['scholarship', 'chatravritti', 'shiksha', 'nsp', 'student', 'wazifa', 'fee reimbursement', 'छात्रवृत्ति', 'वजीफा', 'स्कॉलरशिप', 'छात्र']
  },
  {
    id: 'aadhaar-download',
    titleHi: 'आधार कार्ड डाउनलोड व पीवीसी कार्ड',
    titleEn: 'Aadhaar Card Download & PVC Card Order',
    category: 'identity',
    shortDescHi: 'घर बैठे ई-आधार पीडीएफ डाउनलोड करें या स्पीड पोस्ट द्वारा पीवीसी प्लास्टिक कार्ड मंगवाएं।',
    shortDescEn: 'Download official e-Aadhaar PDF or order durable PVC plastic card via speed post.',
    departmentHi: 'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)',
    departmentEn: 'Unique Identification Authority of India (UIDAI)',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    feeHi: '',
    feeEn: '',
    processingTimeHi: 'डाउनलोड: तुरंत | पीवीसी: 5-7 कार्य दिवस',
    processingTimeEn: 'Download: Instant | PVC: 5-7 Working Days',
    requiredDocsHi: ['12 अंकों का आधार नंबर / 28 अंकों की Enrollment ID', 'आधार से लिंक मोबाइल नंबर (OTP हेतु)'],
    requiredDocsEn: ['12-digit Aadhaar Number / 28-digit Enrollment ID', 'Registered Mobile Number (for OTP)'],
    stepsHi: [
      'myAadhaar आधिकारिक पोर्टल पर जाएं।',
      'अपना आधार नंबर और स्क्रीन पर दिया गया कैप्चा भरें।',
      'मोबाइल पर आए OTP को दर्ज कर "Download Aadhaar" या "Order PVC" चुनें।',
      'पीवीसी कार्ड के लिए सुरक्षित ऑनलाइन भुगतान करें।'
    ],
    stepsEn: [
      'Visit the official myAadhaar portal.',
      'Enter your Aadhaar number and captcha.',
      'Enter OTP sent to registered mobile and select Download or Order PVC.',
      'For PVC card, complete the online payment via UPI/Card.'
    ],
    iconName: 'CreditCard',
    badgeHi: 'सर्वाधिक उपयोग',
    badgeEn: 'Most Popular',
    searchKeywords: ['aadhaar', 'aadhar', 'adhar', 'adhar card', 'aadhar card', 'e-aadhaar', 'uidai', 'pvc card', 'plastic card', 'download aadhar', 'आधार कार्ड', 'आधार', 'पीवीसी कार्ड', 'ई आधार', 'यूआईडीएआई']
  },
  {
    id: 'pan-card-apply',
    titleHi: 'नया पैन कार्ड आवेदन व आधार लिंक',
    titleEn: 'New PAN Card Application & Aadhaar Link',
    category: 'identity',
    shortDescHi: 'नया पैन कार्ड (Form 49A) ऑनलाइन बनाएं, फोटो/हस्ताक्षर सुधारें या पैन-आधार लिंकिंग जांचें।',
    shortDescEn: 'Apply for fresh PAN Card (Form 49A), correct details, or check PAN-Aadhaar linking status.',
    departmentHi: 'आयकर विभाग (Income Tax Department / NSDL / UTIITSL)',
    departmentEn: 'Income Tax Department (NSDL / UTIITSL)',
    officialUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    feeHi: 'भौतिक कार्ड: ₹107 | ई-पैन: ₹66',
    feeEn: 'Physical Card: ₹107 | e-PAN: ₹66',
    processingTimeHi: 'ई-पैन: 2-3 दिन | डाक द्वारा: 10-15 दिन',
    processingTimeEn: 'e-PAN: 2-3 Days | Postal Delivery: 10-15 Days',
    requiredDocsHi: ['आधार कार्ड (पहचान व पते का प्रमाण)', 'पासपोर्ट साइज रंगीन फोटो', 'सफेद कागज पर काली स्याही से हस्ताक्षर'],
    requiredDocsEn: ['Aadhaar Card (Proof of Identity & Address)', 'Recent Passport Size Color Photo', 'Signature in Black Ink on White Paper'],
    stepsHi: [
      'ऑनलाइन पैन पोर्टल पर Form 49A चयन करें।',
      'व्यक्तिगत विवरण, पिता का नाम और आय का स्रोत भरें।',
      'पहचान व पते के प्रमाण हेतु आधार चुनें।',
      '₹107 का ऑनलाइन शुल्क जमा करें और पावती (Acknowledgment Slip) डाउनलोड करें।'
    ],
    stepsEn: [
      'Select Form 49A on the official online PAN portal.',
      'Fill in applicant details, parents name, and income source.',
      'Select Aadhaar for identity, address, and DOB proof.',
      'Pay ₹107 fee online and download the acknowledgment receipt.'
    ],
    iconName: 'FileText',
    badgeHi: 'अनिवार्य',
    badgeEn: 'Essential',
    searchKeywords: ['pan', 'pan card', 'pancard', 'nsdl', 'uti', 'form 49a', 'e-pan', 'pan aadhar link', 'pan apply', 'पैन कार्ड', 'पैन', 'नया पैन कार्ड', 'आयकर कार्ड']
  },
  // Other Services
  {
    id: 'voter-id-card',
    titleHi: 'वोटर आईडी कार्ड (मतदाता पहचान पत्र)',
    titleEn: 'Voter ID Registration & e-EPIC Download',
    category: 'identity',
    shortDescHi: '18 वर्ष के नए वोटर का नाम जोड़ें (Form 6), वोटर लिस्ट में नाम खोजें तथा डिजिटल e-EPIC डाउनलोड करें।',
    shortDescEn: 'New voter registration (Form 6), check electoral roll status and download official digital e-EPIC.',
    departmentHi: 'भारत निर्वाचन आयोग (Election Commission of India)',
    departmentEn: 'Election Commission of India (ECI)',
    officialUrl: 'https://voters.eci.gov.in/',
    feeHi: '100₹',
    feeEn: '100₹',
    processingTimeHi: '7 से 15 कार्य दिवस',
    processingTimeEn: '7 to 15 Working Days',
    requiredDocsHi: ['पासपोर्ट साइज फोटो', 'आयु प्रमाण (आधार कार्ड/10वीं मार्कशीट)', 'निवास प्रमाण पत्र (बिजली बिल/पानी बिल/आधार)'],
    requiredDocsEn: ['Passport Size Photo', 'Age Proof (Aadhaar/10th Certificate)', 'Address Proof (Electricity Bill/Aadhaar)'],
    stepsHi: [
      'voters.eci.gov.in पर मोबाइल नंबर से खाता बनाएं।',
      'नए वोटर के लिए "Form 6 - Register New Elector" भरें।',
      'अपना विधानसभा क्षेत्र, पता और दस्तावेज अपलोड करें।',
      'रेफरेंस नंबर नोट करें जिससे BLO सत्यापन ट्रैक किया जा सके।'
    ],
    stepsEn: [
      'Register on voters.eci.gov.in using mobile number.',
      'Fill Form 6 for fresh voter registration.',
      'Select Assembly Constituency and upload photograph with ID proof.',
      'Note reference ID to track Booth Level Officer (BLO) verification.'
    ],
    iconName: 'UserCheck',
    badgeHi: 'निर्वाचन',
    badgeEn: 'Election',
    searchKeywords: ['voter', 'voter id', 'epic', 'chunav', 'matdata', 'matdan', 'form 6', 'election card', 'वोटर कार्ड', 'मतदाता पहचान पत्र', 'पहचान पत्र', 'वोटर लिस्ट']
  },

  {
    id: 'driving-licence-vahan',
    titleHi: 'ड्राइविंग लाइसेंस व वाहन सारथी सेवाएं',
    titleEn: 'Driving Licence & Parivahan Sarathi Services',
    category: 'identity',
    shortDescHi: 'घर बैठे लर्निंग लाइसेंस टेस्ट दें, पक्का डीएल स्लॉट बुक करें, वाहन आरसी व ई-चालान स्थिति देखें।',
    shortDescEn: 'Online Learner Licence test from home, Permanent DL appointment, Vehicle RC & e-Challan status.',
    departmentHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH - Parivahan)',
    departmentEn: 'Ministry of Road Transport and Highways (Parivahan)',
    officialUrl: 'https://parivahan.gov.in/',
    feeHi: 'लर्निंग: ₹350 | पक्का डीएल: ₹1,000 (लगभग)',
    feeEn: 'Learner: ₹350 | Permanent DL: ~₹1,000',
    processingTimeHi: 'लर्निंग: तुरंत (ऑनलाइन टेस्ट पास करने पर) | डीएल: 7 दिन',
    processingTimeEn: 'Learner: Instant on passing test | DL: 7 Days',
    requiredDocsHi: ['आधार कार्ड (फेस ऑथेंटिकेशन हेतु)', 'कक्षा 8वीं/10वीं मार्कशीट (उम्र प्रमाण)', 'मेडिकल प्रमाण पत्र (Form 1A यदि लागू हो)'],
    requiredDocsEn: ['Aadhaar Card (for contactless face auth)', 'Educational certificate (Age proof)', 'Medical Fitness Form 1A if required'],
    stepsHi: [
      'parivahan.gov.in पर Sarathi Services में राज्य चुनें।',
      '"Apply for Learner Licence" में आधार ऑथेंटिकेशन चुनें (RTO जाने की जरूरत नहीं)।',
      'सड़क सुरक्षा ट्यूटोरियल देखें और 15 प्रश्नों का ऑनलाइन टेस्ट पास करें।',
      'पास होते ही लर्निंग लाइसेंस पीडीएफ डाउनलोड करें।'
    ],
    stepsEn: [
      'Select State under Sarathi Services on parivahan.gov.in.',
      'Choose Apply for Learner Licence with Aadhaar authentication.',
      'Watch road safety video and pass the 15-question online LL test.',
      'Download your official Learner Licence PDF instantly.'
    ],
    iconName: 'Truck',
    searchKeywords: ['driving licence', 'driving license', 'dl', 'learning licence', 'learner', 'parivahan', 'sarathi', 'rto', 'vahan', 'gadi licence', 'ड्राइविंग लाइसेंस', 'डीएल', 'लर्निंग लाइसेंस', 'सारथी', 'परिवहन']
  },


  {
    id: 'pm-kisan-status',
    titleHi: 'पीएम किसान सम्मान निधि (किस्त व ई-केवाईसी)',
    titleEn: 'PM Kisan Samman Nidhi (Installment & e-KYC)',
    category: 'welfare',
    shortDescHi: '₹2,000 की 4-मासिक किस्त का स्टेटस चेक करें, फेस या आधार ओटीपी से ई-केवाईसी पूरी करें।',
    shortDescEn: 'Check ₹2,000 installment credit status, farmer registration, and complete mandatory biometric e-KYC.',
    departmentHi: 'कृषि एवं किसान कल्याण मंत्रालय (Ministry of Agriculture)',
    departmentEn: 'Ministry of Agriculture & Farmers Welfare',
    officialUrl: 'https://pmkisan.gov.in/',
    feeHi: '100₹',
    feeEn: '100₹',
    processingTimeHi: 'तुरंत स्थिति जांच',
    processingTimeEn: 'Instant Status Verification',
    requiredDocsHi: ['किसान रजिस्ट्रेशन नंबर या आधार से जुड़ा मोबाइल नंबर', 'बैंक खाता (डीबीटी सक्षम / NPCI लिंक्ड)', 'खतौनी भू-अभिलेख विवरण'],
    requiredDocsEn: ['Farmer Registration ID or Aadhaar linked Mobile', 'Bank Account (Aadhaar Seeding / NPCI mapped)', 'Land Record Details'],
    stepsHi: [
      'pmkisan.gov.in पोर्टल पर जाएं।',
      '"Know Your Status" विकल्प पर क्लिक करें।',
      'रजिस्ट्रेशन नंबर व कैप्चा दर्ज करें और OTP द्वारा लॉगिन करें।',
      'FTO Processed, DBT Status व नवीनतम किस्त का विवरण देखें।'
    ],
    stepsEn: [
      'Visit pmkisan.gov.in portal.',
      'Click on "Know Your Status" module.',
      'Enter Registration ID and Captcha to view status with OTP.',
      'Check FTO processed status, Land Seeding, and bank credit details.'
    ],
    iconName: 'Sprout',
    badgeHi: '₹6000 सालाना',
    badgeEn: 'Direct Benefit',
    searchKeywords: ['pm kisan', 'pmkisan', 'kisan samman nidhi', 'kisan', 'samman nidhi', 'kist', 'installment', 'ekyc', 'e-kyc', 'kheti', 'किसान', 'पीएम किसान', 'किसान सम्मान निधि', 'किस्त', 'ई-केवाईसी']
  },
  {
    id: 'e-shram-card',
    titleHi: 'ई-श्रम कार्ड (असंगठित कर्मकार पंजीकरण)',
    titleEn: 'e-Shram Card Registration & Benefits',
    category: 'welfare',
    shortDescHi: 'मजदूरों, कारीगरों, ड्राइवरों व कामगारों हेतु 12 अंकों का UAN कार्ड, ₹2 लाख का दुर्घटना बीमा।',
    shortDescEn: 'National unorganized workers portal 12-digit UAN card, PMSBY ₹2 Lakh accidental insurance.',
    departmentHi: 'श्रम एवं रोजगार मंत्रालय (Ministry of Labour & Employment)',
    departmentEn: 'Ministry of Labour & Employment',
    officialUrl: 'https://eshram.gov.in/',
    feeHi: '100₹',
    feeEn: '100₹',
    processingTimeHi: 'तुरंत यूएएन कार्ड डाउनलोड',
    processingTimeEn: 'Instant UAN Card Download',
    requiredDocsHi: ['आधार कार्ड', 'आधार से लिंक सक्रिय मोबाइल नंबर', 'बैंक खाता संख्या व आईएफएससी कोड', 'उम्र 16 से 59 वर्ष के बीच'],
    requiredDocsEn: ['Aadhaar Card', 'Mobile linked with Aadhaar', 'Bank Account details with IFSC', 'Age between 16 and 59 years'],
    stepsHi: [
      'eshram.gov.in पर "Register on e-Shram" लिंक खोलें।',
      'आधार नंबर दर्ज कर ओटीपी से बायोमेट्रिक विवरण सत्यापित करें।',
      'पेशा (Occupation), शैक्षणिक योग्यता व बैंक विवरण भरें।',
      'तुरंत 12 अंकों का ई-श्रम UAN कार्ड डाउनलोड और प्रिंट करें।'
    ],
    stepsEn: [
      'Click Register on e-Shram on eshram.gov.in.',
      'Enter Aadhaar number and verify via OTP.',
      'Fill current occupation, skill profile, and bank details.',
      'Download and print the official 12-digit UAN card immediately.'
    ],
    iconName: 'Briefcase',
    searchKeywords: ['eshram', 'e shram', 'shram card', 'uan card', 'majdoor', 'labour card', 'ई-श्रम कार्ड', 'ई श्रम', 'श्रम कार्ड', 'मजदूर कार्ड', 'श्रमिक']
  },

  {
    id: 'fastag-recharge',
    titleHi: 'फास्टैग रिचार्ज व बैलेंस स्थिति (FASTag Portal)',
    titleEn: 'FASTag Online Recharge & Balance Check',
    category: 'bills',
    shortDescHi: 'गाड़ी के नंबर या फास्टैग आईडी से किसी भी बैंक का फास्टैग तुरंत रिचार्ज करें, ब्लैकलिस्ट स्थिति हटाएं।',
    shortDescEn: 'Recharge NETC FASTag instantly for any issuer bank using vehicle registration number.',
    departmentHi: 'भारतीय राष्ट्रीय राजमार्ग प्राधिकरण (NHAI - NETC FASTag)',
    departmentEn: 'National Highways Authority of India (NHAI)',
    officialUrl: 'https://ihmcl.co.in/',
    feeHi: 'रिचार्ज राशि अनुसार (कोई सुविधा शुल्क नहीं)',
    feeEn: 'Recharge amount only (Zero gateway fee via UPI)',
    processingTimeHi: '2 मिनट में फास्टैग सक्रिय',
    processingTimeEn: 'Within 2 minutes',
    requiredDocsHi: ['वाहन पंजीकरण संख्या (Vehicle Registration Number - जैसे UP16AB1234)', 'फास्टैग जारीकर्ता बैंक का नाम'],
    requiredDocsEn: ['Vehicle Plate Number (e.g., UP16AB1234)', 'Issuer Bank Name (Paytm/SBI/ICICI/IDFC/etc.)'],
    stepsHi: [
      'वाहन का पूरा नंबर दर्ज करें।',
      'जारीकर्ता बैंक का चयन करें।',
      'रिचार्ज राशि भरें और यूपीआई द्वारा भुगतान करें।',
      'टोल प्लाजा पर स्वतः कटौती सक्रिय हो जाती है।'
    ],
    stepsEn: [
      'Enter complete vehicle registration number.',
      'Select your FASTag issuing bank.',
      'Enter amount and complete UPI payment.',
      'FASTag wallet updates instantly across national highway toll plazas.'
    ],
    iconName: 'Car',
    searchKeywords: ['fastag', 'fast tag', 'toll', 'recharge', 'nhai', 'toll plaza', 'फास्टैग', 'टोल रिचार्ज', 'फास्टैग रिचार्ज']
  },

  {
    id: 'other-services',
    titleHi: 'अन्य सेवाएं व ऑनलाइन सहायता (Other Services)',
    titleEn: 'Other Citizen Services & Online Form Assistance',
    category: 'welfare',
    shortDescHi: 'सूची में न मिलने वाली किसी भी अन्य सरकारी योजना, ऑनलाइन फॉर्म, शिकायत, छात्रवृत्ति या साइबर कैफे कार्य हेतु सहायता।',
    shortDescEn: 'Assistance for any other govt scheme, application form, grievance, scholarship or cyber cafe work.',
    departmentHi: 'डिजिटल एवं जन सेवा केंद्र सहायता डेस्क (Helpdesk)',
    departmentEn: 'Digital Seva Helpdesk & Citizen Support',
    officialUrl: 'https://www.india.gov.in/',
    feeHi: 'सरकारी नियमानुसार / कार्य अनुसार',
    feeEn: 'As per standard govt rules',
    processingTimeHi: 'उसी दिन / त्वरित',
    processingTimeEn: 'Same Day / Fast',
    requiredDocsHi: ['आधार कार्ड / पहचान प्रमाण', 'संबंधित कार्य के आवश्यक दस्तावेज (यदि उपलब्ध हों)'],
    requiredDocsEn: ['Aadhaar Card / Photo ID', 'Relevant application documents (if available)'],
    stepsHi: [
      'टोकन बुक करें और अपने कार्य का विवरण दर्ज करें।',
      'ऑपरेटर द्वारा ऑनलाइन फॉर्म व आधिकारिक पोर्टल पर प्रक्रिया की जाएगी।',
      'सफल सबमिशन उपरांत रसीद व संदर्भ संख्या प्राप्त करें।'
    ],
    stepsEn: [
      'Book token and specify your required service.',
      'Operator processes the online application on the official portal.',
      'Receive official submission receipt and tracking number.'
    ],
    iconName: 'HelpCircle',
    badgeHi: 'नागरिक सहायता',
    badgeEn: 'Support',
    searchKeywords: ['other', 'other services', 'aanya', 'anya', 'anya seva', 'custom service', 'online form', 'help', 'अन्य', 'अन्य सेवा', 'अन्य सेवाएं', 'सहायता', 'ऑनलाइन कार्य']
  },

];

export const SAMPLE_STATUS_DATA: Record<string, ApplicationStatusResult> = {
  'APP-2026-8842': {
    applicationId: 'APP-2026-8842',
    serviceNameHi: 'छात्रवृत्ति आवेदन (Pre & Post Matric)',
    serviceNameEn: 'Scholarship Application (State & NSP)',
    applicantName: 'राजेश कुमार (Rajesh Kumar)',
    appliedDate: '02 मार्च 2026',
    currentStep: 3,
    totalSteps: 4,
    status: 'In Progress',
    statusTextHi: 'संस्थान एवं जिला समाज कल्याण स्तर पर सत्यापन',
    statusTextEn: 'Verification at Institute & District Level',
    remarksHi: 'संस्थान द्वारा आवेदन अग्रसारित किया जा चुका है। जिला स्तर पर सत्यापन प्रक्रियाधीन है।',
    remarksEn: 'Application forwarded by institution. District level verification in progress.',
    stages: [
      { titleHi: 'ऑनलाइन आवेदन व रजिस्ट्रेशन', titleEn: 'Online Registration & Form Submission', date: '02 मार्च 2026', completed: true },
      { titleHi: 'संस्थान द्वारा ऑनलाइन फॉरवर्ड', titleEn: 'Forwarded by Institution', date: '05 मार्च 2026', completed: true },
      { titleHi: 'जिला समाज कल्याण अधिकारी सत्यापन', titleEn: 'District Social Welfare Verification', date: '09 मार्च 2026', completed: true },
      { titleHi: 'छात्रवृत्ति राशि बैंक खाते में अंतरण', titleEn: 'Scholarship Disbursal to Bank Account', date: '15 मार्च 2026 (अपेक्षित)', completed: false }
    ]
  },
  'PAN-2026-3190': {
    applicationId: 'PAN-2026-3190',
    serviceNameHi: 'नया पैन कार्ड (Form 49A)',
    serviceNameEn: 'New PAN Card Application',
    applicantName: 'सुनीता शर्मा (Sunita Sharma)',
    appliedDate: '26 फरवरी 2026',
    currentStep: 4,
    totalSteps: 4,
    status: 'Approved',
    statusTextHi: 'स्वीकृत - ई-पैन जारी व कार्ड प्रेषित',
    statusTextEn: 'Approved - e-PAN Generated & Dispatched',
    remarksHi: 'पैन कार्ड नंबर आवंटित हो चुका है। भौतिक कार्ड भारतीय डाक (Speed Post ट्रैकिंग संख्या: ED839201948IN) से प्रेषित किया गया है।',
    remarksEn: 'Permanent Account Number allotted. Physical PVC card dispatched via India Post Speed Post (Article ID: ED839201948IN).',
    stages: [
      { titleHi: 'ई-केवाईसी व आवेदन प्राप्त', titleEn: 'Application & e-KYC Received', date: '26 फरवरी 2026', completed: true },
      { titleHi: 'आयकर डेटाबेस सत्यापन', titleEn: 'Income Tax Database Verified', date: '28 फरवरी 2026', completed: true },
      { titleHi: 'पैन नंबर आवंटन व ई-पैन प्रेषण', titleEn: 'PAN Allotted & e-PAN Issued', date: '02 मार्च 2026', completed: true },
      { titleHi: 'स्पीड पोस्ट द्वारा कार्ड प्रेषित', titleEn: 'Physical Card Dispatched', date: '05 मार्च 2026', completed: true }
    ]
  },
  'KIZ-2026-9041': {
    applicationId: 'KIZ-2026-9041',
    serviceNameHi: 'पीएम किसान सम्मान निधि ई-केवाईसी',
    serviceNameEn: 'PM Kisan Samman Nidhi e-KYC',
    applicantName: 'रामगोपाल वर्मा (Ram Gopal Verma)',
    appliedDate: '01 मार्च 2026',
    currentStep: 4,
    totalSteps: 4,
    status: 'Approved',
    statusTextHi: 'ई-केवाईसी सफल व बैंक खाता डीबीटी सक्षम',
    statusTextEn: 'e-KYC Active & Bank Account Aadhaar-Seeded',
    remarksHi: 'आधार बायोमेट्रिक व लैंड सीडिंग (भूलेख) दोनों मान्य हैं। आगामी 17वीं किस्त सीधे बैंक खाते में प्रेषित की जाएगी।',
    remarksEn: 'Biometric e-KYC and land seeding records verified. Next upcoming installment will credit directly via NPCI Aadhaar bridge.',
    stages: [
      { titleHi: 'आधार ओटीपी सत्यापन', titleEn: 'Aadhaar OTP Authenticated', date: '01 मार्च 2026', completed: true },
      { titleHi: 'भूलेख खतौनी सीडिंग जांच', titleEn: 'Land Seeding Status Validated', date: '02 मार्च 2026', completed: true },
      { titleHi: 'NPCI बैंक खाता डीबीटी लिंकिंग', titleEn: 'Bank Aadhaar Bridge Active', date: '03 मार्च 2026', completed: true },
      { titleHi: 'पात्रता सूची में सक्रिय (Approved)', titleEn: 'Active Beneficiary Sanctioned', date: '04 मार्च 2026', completed: true }
    ]
  }
};

export const EMERGENCY_HELPLINES = [
  { nameHi: 'साइबर वित्तीय धोखाधड़ी हेल्पलाइन', nameEn: 'National Cyber Crime & Fraud Helpline', number: '1930', descHi: 'ऑनलाइन बैंक फ्रॉड होने पर तुरंत 2 घंटे के भीतर कॉल करें', descEn: 'Report online banking & UPI frauds immediately within 2 hours' },
  { nameHi: 'आधार हेल्पलाइन (UIDAI)', nameEn: 'Aadhaar Toll-Free Support (UIDAI)', number: '1947', descHi: 'आधार अपडेट, नामांकन केंद्र व पीवीसी कार्ड संबंधी जानकारी', descEn: 'Aadhaar update status, enrollment center locator and PVC tracking' },
  { nameHi: 'पीएम किसान हेल्पलाइन', nameEn: 'PM Kisan Toll-Free Desk', number: '155261', descHi: 'किसान सम्मान निधि किस्त व रजिस्ट्रेशन सहायता', descEn: 'Farmer installment query, correction and DBT advisory' },
  { nameHi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन', nameEn: 'National Consumer Helpline', number: '1915', descHi: 'ऑनलाइन शॉपिंग, रिचार्ज या सेवा संबंधी शिकायत दर्ज कराएं', descEn: 'File consumer grievance for online shopping and recharge disputes' },
  { nameHi: 'महिला सुरक्षा हेल्पलाइन', nameEn: 'Women Safety Helpline', number: '1090', descHi: '24x7 सुरक्षा व सहायता केंद्र', descEn: '24x7 security, emergency and legal assistance' },
  { nameHi: 'राष्ट्रीय आपातकालीन सेवा', nameEn: 'National Emergency Response (Police/Fire/Ambulance)', number: '112', descHi: 'अखिल भारतीय आपातकालीन नंबर', descEn: 'Single unified emergency response support system' }
];
