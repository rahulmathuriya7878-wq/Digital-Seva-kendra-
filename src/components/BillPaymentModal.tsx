import React, { useState } from 'react';
import { Language } from '../types/service';
import { Zap, CheckCircle2, QrCode, Printer, X, ShieldAlert, ArrowRight, RefreshCw, FileText, Mail } from 'lucide-react';

interface BillPaymentModalProps {
  language: Language;
  onClose: () => void;
  onEmailReceipt?: (subject: string, body: string) => void;
}

interface DiscomOption {
  state: string;
  stateHi: string;
  name: string;
  code: string;
}

const DISCOMS: DiscomOption[] = [
  { state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', name: 'UPPCL (Urban / नगरीय विद्युत)', code: 'UPPCL-URBAN' },
  { state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', name: 'UPPCL (Rural / ग्रामीण विद्युत)', code: 'UPPCL-RURAL' },
  { state: 'Bihar', stateHi: 'बिहार', name: 'SBPDCL (South Bihar Power)', code: 'SBPDCL' },
  { state: 'Bihar', stateHi: 'बिहार', name: 'NBPDCL (North Bihar Power)', code: 'NBPDCL' },
  { state: 'Rajasthan', stateHi: 'राजस्थान', name: 'JVVNL (Jaipur Vidyut Vitran)', code: 'JVVNL' },
  { state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', name: 'MPPKVVCL (Madhya Kshetra)', code: 'MPPKVVCL' },
  { state: 'Delhi', stateHi: 'दिल्ली', name: 'BSES Rajdhani / Yamuna Power', code: 'BSES' },
  { state: 'Haryana', stateHi: 'हरियाणा', name: 'DHBVN (Dakshin Haryana Bijli)', code: 'DHBVN' },
  { state: 'Maharashtra', stateHi: 'महाराष्ट्र', name: 'MSEDCL (Mahavitaran)', code: 'MSEDCL' }
];

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({ language, onClose, onEmailReceipt }) => {
  const isHi = language === 'hi';

  const [selectedDiscom, setSelectedDiscom] = useState<string>(DISCOMS[0].code);
  const [consumerNumber, setConsumerNumber] = useState<string>('1098472910');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [billFetched, setBillFetched] = useState<boolean>(false);

  // Bill details state
  const [consumerName, setConsumerName] = useState<string>('राम स्वरूप यादव (Ram Swaroop Yadav)');
  const [billAmount, setBillAmount] = useState<number>(1480);
  const [billDueDate, setBillDueDate] = useState<string>('24 मार्च 2026');
  const [unitsConsumed, setUnitsConsumed] = useState<number>(184);

  // Payment states
  const [step, setStep] = useState<'input' | 'paying' | 'receipt'>('input');
  const [txId, setTxId] = useState<string>('');
  const [paidTimestamp, setPaidTimestamp] = useState<string>('');

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim()) return;

    setIsFetching(true);
    setTimeout(() => {
      // Simulate realistic bill calculation based on input
      const randomSum = 850 + (parseInt(consumerNumber.slice(-3)) || 420) % 1500;
      setBillAmount(randomSum);
      setUnitsConsumed(Math.round(randomSum / 7.5));
      setBillFetched(true);
      setIsFetching(false);
    }, 600);
  };

  const handleStartPayment = () => {
    setStep('paying');
    // Simulate payment completion after QR scan in 2.5 seconds
    setTimeout(() => {
      const generatedTx = 'UPI-BBPS-' + Math.floor(1000000000 + Math.random() * 9000000000);
      setTxId(generatedTx);
      setPaidTimestamp(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
      setStep('receipt');
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isHi ? 'ऑनलाइन बिजली बिल भुगतान व रसीद' : 'Electricity Bill Inquiry & BBPS Pay'}
              </h3>
              <p className="text-xs text-slate-300">
                {isHi ? 'भारत बिलपे (BBPS) डिजिटल सेवा' : 'Bharat Bill Payment System (BBPS) Gateway'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'input' && (
            <div className="space-y-5">
              <form onSubmit={handleFetchBill} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {isHi ? 'विद्युत वितरण निगम (Discom) चुनें:' : 'Select Electricity Provider:'}
                  </label>
                  <select
                    value={selectedDiscom}
                    onChange={(e) => setSelectedDiscom(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    {DISCOMS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.stateHi} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {isHi ? 'उपभोक्ता संख्या / खाता संख्या (CA / Account No):' : 'Consumer Account Number (10-12 digits):'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="उदा: 1098472910"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isFetching}
                      className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {isFetching && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isHi ? 'बिल जांचें' : 'Fetch Bill'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isHi ? 'पुराने बिजली बिल की पर्ची पर 10 अंकों का खाता संख्या अंकित होता है।' : 'Found on top of any physical electricity bill slip.'}
                  </p>
                </div>
              </form>

              {/* Bill Details Result Box */}
              {billFetched && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                    <span className="font-bold text-slate-800">{isHi ? 'उपभोक्ता विवरण' : 'Consumer Details'}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isHi ? 'सत्यापित खाता' : 'Verified'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">{isHi ? 'उपभोक्ता नाम:' : 'Name:'}</span>
                      <span className="font-semibold text-slate-800">{consumerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isHi ? 'बिल माह:' : 'Bill Month:'}</span>
                      <span className="font-semibold text-slate-800">मार्च 2026 (March 2026)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isHi ? 'खपत यूनिट:' : 'Units:'}</span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">{unitsConsumed} kWh</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isHi ? 'अंतिम देय तिथि:' : 'Due Date:'}</span>
                      <span className="font-semibold text-slate-800">{billDueDate}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500">{isHi ? 'कुल देय राशि:' : 'Total Amount Due:'}</span>
                      <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                        ₹{billAmount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={handleStartPayment}
                      className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>{isHi ? 'यूपीआई से तुरंत भरें' : 'Pay via UPI/QR'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'paying' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                <QrCode className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {isHi ? 'सुरक्षित भुगतान प्रक्रिया जारी है...' : 'Processing Secure BBPS Payment...'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isHi ? 'कृपया प्रतीक्षा करें, बैंक सर्वर से पुष्टि हो रही है।' : 'Awaiting confirmation from clearing bank switch.'}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-mono text-slate-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>NPCI / BBPS Gateway · ₹{billAmount}</span>
              </div>
            </div>
          )}

          {step === 'receipt' && (
            <div className="space-y-4">
              {/* Receipt Visual Paper */}
              <div id="printable-receipt" className="p-5 border-2 border-emerald-500/30 rounded-xl bg-emerald-50/20 space-y-3">
                <div className="text-center pb-3 border-b border-emerald-200/60">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {isHi ? 'बिजली बिल भुगतान पावती (E-Receipt)' : 'Official Electricity Payment Receipt'}
                  </h4>
                  <div className="text-xs text-emerald-800 font-medium">
                    {isHi ? 'भुगतान सफल · खाता अद्यतित' : 'Payment Successful · Account Updated'}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'लेनदेन संदर्भ आईडी (Tx ID):' : 'Transaction ID:'}</span>
                    <span className="font-mono font-bold text-slate-900">{txId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'उपभोक्ता खाता संख्या:' : 'Consumer Account No:'}</span>
                    <span className="font-mono font-semibold text-slate-900">{consumerNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'उपभोक्ता नाम:' : 'Consumer Name:'}</span>
                    <span className="font-semibold text-slate-900">{consumerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'भुगतान समय:' : 'Timestamp:'}</span>
                    <span className="text-slate-700">{paidTimestamp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">{isHi ? 'भुगतान माध्यम:' : 'Payment Mode:'}</span>
                    <span className="text-slate-700">UPI / BBPS Direct Clearing</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 text-sm font-bold">
                    <span className="text-slate-800">{isHi ? 'कुल प्राप्त राशि:' : 'Amount Paid:'}</span>
                    <span className="font-mono text-emerald-700">₹{billAmount.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={handlePrint}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isHi ? 'प्रिंट / सेव रसीद' : 'Print Receipt'}</span>
                </button>

                {onEmailReceipt && (
                  <button
                    onClick={() => {
                      const subject = isHi 
                        ? `बिजली बिल भुगतान रसीद - खाता संख्या: ${consumerNumber} (Tx: ${txId})`
                        : `Electricity Bill Payment E-Receipt - Account: ${consumerNumber} (Tx: ${txId})`;
                      const body = isHi
                        ? `प्रिय उपभोक्ता,\n\nआपके बिजली बिल का सफल भुगतान हो चुका है।\n\nउपभोक्ता खाता: ${consumerNumber}\nउपभोक्ता नाम: ${consumerName}\nलेनदेन आईडी: ${txId}\nभुगतान तिथि: ${paidTimestamp}\nभुगतान राशि: ₹${billAmount}.00\nभुगतान माध्यम: BBPS / UPI\n\nडिजिटल सेवा केंद्र पोर्टल द्वारा प्रेषित।`
                        : `Dear Consumer,\n\nYour electricity bill has been paid successfully.\n\nAccount Number: ${consumerNumber}\nConsumer Name: ${consumerName}\nTransaction ID: ${txId}\nTimestamp: ${paidTimestamp}\nAmount Paid: ₹${billAmount}.00\nPayment Mode: BBPS / UPI\n\nSent via Digital Seva Portal.`;
                      onEmailReceipt(subject, body);
                    }}
                    className="w-full sm:w-auto py-2.5 px-3 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-rose-600" />
                    <span>{isHi ? 'जीमेल पर भेजें' : 'Email via Gmail'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setStep('input');
                    setBillFetched(false);
                  }}
                  className="w-full sm:w-auto py-2.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {isHi ? 'अन्य बिल' : 'Another Bill'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
