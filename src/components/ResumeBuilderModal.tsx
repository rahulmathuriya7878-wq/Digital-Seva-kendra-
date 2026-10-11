import React, { useState } from 'react';
import { Language } from '../types/service';
import { FileText, Printer, X, Download, User, Briefcase, GraduationCap, MapPin, Phone, Mail } from 'lucide-react';

interface ResumeBuilderModalProps {
  language: Language;
  onClose: () => void;
  onExportToGoogleDocs?: (title: string, content: string) => void;
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({ 
  language, 
  onClose,
  onExportToGoogleDocs 
}) => {
  const isHi = language === 'hi';

  const [fullName, setFullName] = useState('अभ्यर्थी का नाम (Candidate Name)');
  const [fatherName, setFatherName] = useState('पिता का नाम (Father Name)');
  const [dob, setDob] = useState('01/01/2000');
  const [phone, setPhone] = useState('98XXXXXXXX');
  const [email, setEmail] = useState('candidate@email.com');
  const [address, setAddress] = useState('ग्राम व पोस्ट: ________, जिला: ________, राज्य - पिन कोड');
  const [qualification, setQualification] = useState('10th / 12th / स्नातक (Graduate)');
  const [skills, setSkills] = useState('कंप्यूटर बेसिक (MS Office), टाइपिंग व इंटरनेट कार्य');
  const [experience, setExperience] = useState('फ्रेशर (Fresher) / संबंधित क्षेत्र में अनुभव');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold">
                {isHi ? 'त्वरित बायोडाटा व रिज्यूमे मेकर' : 'Quick Bio-Data & Resume Generator'}
              </h3>
              <p className="text-xs text-slate-300">
                {isHi ? 'प्राइवेट व संविदा नौकरियों हेतु तैयार प्रारूप' : 'Standard Format for Jobs & Interviews'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs sm:text-sm">
          
          {/* Form Left Side */}
          <div className="lg:col-span-5 space-y-3.5 no-print">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              {isHi ? 'व्यक्तिगत जानकारी भरें:' : 'Fill Details:'}
            </h4>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'पूरा नाम:' : 'Full Name:'}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'पिता का नाम:' : 'Father Name:'}</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 block mb-0.5">{isHi ? 'जन्म तिथि:' : 'DOB:'}</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-0.5">{isHi ? 'मोबाइल:' : 'Mobile:'}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'ईमेल:' : 'Email:'}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'स्थाई पता:' : 'Address:'}</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'शैक्षणिक योग्यता:' : 'Education:'}</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'कौशल (Skills):' : 'Key Skills:'}</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-0.5">{isHi ? 'कार्य अनुभव:' : 'Experience:'}</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Bio-Data Sheet Paper Preview */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm space-y-4 font-serif text-slate-900">
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest uppercase">
                BIO - DATA
              </h2>
              <div className="text-xs font-sans text-slate-500 mt-0.5 tracking-wider">CURRICULUM VITAE</div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Full Name</span>
                <span className="col-span-2 font-bold text-slate-900">{fullName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Father's Name</span>
                <span className="col-span-2 text-slate-800">{fatherName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Date of Birth</span>
                <span className="col-span-2 text-slate-800 font-mono">{dob}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Contact Number</span>
                <span className="col-span-2 text-slate-800 font-mono font-semibold">{phone}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Email ID</span>
                <span className="col-span-2 text-slate-800 font-mono">{email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Permanent Address</span>
                <span className="col-span-2 text-slate-800">{address}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Academic Qualification</span>
                <span className="col-span-2 text-slate-800 font-medium">{qualification}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Technical Skills</span>
                <span className="col-span-2 text-slate-800">{skills}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Work Experience</span>
                <span className="col-span-2 text-slate-800">{experience}</span>
              </div>
            </div>

            {/* Declaration */}
            <div className="pt-4 text-[11px] text-slate-500 font-sans italic">
              Declaration: I hereby declare that all the information mentioned above is true and correct to the best of my knowledge.
            </div>

            <div className="pt-6 flex justify-between font-sans text-xs">
              <div>
                <div>Date: _________</div>
                <div>Place: _________</div>
              </div>
              <div className="text-right">
                <div className="h-6"></div>
                <div className="font-bold">({fullName || 'अभ्यर्थी'})</div>
                <div className="text-slate-400 text-[10px]">Candidate Signature</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3 no-print">
          {onExportToGoogleDocs && (
            <button
              onClick={() => {
                const title = `बायोडाटा - ${fullName}`;
                const content = 
`बायोडाटा / RESUME
डिजिटल नागरिक सेवा केंद्र

व्यक्तिगत विवरण (Personal Details):
पूरा नाम: ${fullName}
पिता का नाम: ${fatherName}
जन्म तिथि: ${dob}
मोबाइल नंबर: ${phone}
ईमेल: ${email}
पता: ${address}

शैक्षणिक योग्यता (Educational Qualification):
${qualification}

कंप्यूटर व तकनीकी ज्ञान (Skills):
${skills}

कार्य अनुभव (Work Experience):
${experience}

घोषणा (Declaration):
मैं प्रमाणित करता/करती हूँ कि उपरोक्त सभी विवरण मेरे ज्ञान के अनुसार पूर्णतः सत्य एवं सही हैं।

दिनांक: ${new Date().toLocaleDateString('hi-IN')}
स्थान: _________
हस्ताक्षर: (${fullName || 'अभ्यर्थी'})`;

                onExportToGoogleDocs(title, content);
              }}
              className="px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{isHi ? 'Google Docs में खोलें' : 'Open in Google Docs'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isHi ? 'बायोडाटा प्रिंट / PDF सेव करें' : 'Print / Save Bio-Data PDF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
