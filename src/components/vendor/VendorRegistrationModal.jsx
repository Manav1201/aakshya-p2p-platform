import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileText,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Eye,
  Trash2,
  Info
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useP2P } from '../../context/P2PContext';
import { validateGSTIN, validatePAN, validateIFSC, validateMobile, validateEmail } from '../../utils/validation';

export const VendorRegistrationModal = ({ isOpen, onClose, initialToken, vendorId }) => {
  const { vendors, saveVendorDraft, submitVendorRegistration } = useP2P();

  // Find vendor if existing token or id passed
  const existingVendor = vendors.find(v => v.invitationToken === initialToken || v.id === vendorId);

  const [step, setStep] = useState(1); // 1: Company, 2: Contact, 3: Bank, 4: Documents

  // Form State
  const [companyDetails, setCompanyDetails] = useState({
    legalName: '',
    gstin: '',
    pan: '',
    cin: '',
    msmeNumber: '',
    category: 'Heavy Machinery & Spares',
  });

  const [contactDetails, setContactDetails] = useState({
    contactPerson: '',
    email: '',
    mobile: '',
    address: '',
  });

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Prepopulate if editing or existing
  useEffect(() => {
    if (existingVendor) {
      setCompanyDetails({
        legalName: existingVendor.companyDetails?.legalName || existingVendor.name || '',
        gstin: existingVendor.companyDetails?.gstin || '',
        pan: existingVendor.companyDetails?.pan || '',
        cin: existingVendor.companyDetails?.cin || '',
        msmeNumber: existingVendor.companyDetails?.msmeNumber || '',
        category: existingVendor.category || 'Heavy Machinery & Spares',
      });

      setContactDetails({
        contactPerson: existingVendor.contactDetails?.contactPerson || '',
        email: existingVendor.contactDetails?.email || existingVendor.email || '',
        mobile: existingVendor.contactDetails?.mobile || '',
        address: existingVendor.contactDetails?.address || '',
      });

      setBankDetails({
        accountHolderName: existingVendor.bankDetails?.accountHolderName || '',
        bankName: existingVendor.bankDetails?.bankName || '',
        accountNumber: existingVendor.bankDetails?.accountNumber || '',
        ifscCode: existingVendor.bankDetails?.ifscCode || '',
      });

      setDocuments(existingVendor.documents || []);
    }
  }, [existingVendor, isOpen]);

  const handleSimulatedFileUpload = (docType) => {
    const filename = `${docType.replace(/\s+/g, '_')}_${companyDetails.legalName ? companyDetails.legalName.replace(/\s+/g, '').slice(0, 8) : 'Doc'}.pdf`;
    const newDoc = {
      name: filename,
      type: docType,
      status: 'Uploaded',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev.filter(d => d.type !== docType), newDoc]);
  };

  const removeDocument = (docType) => {
    setDocuments(prev => prev.filter(d => d.type !== docType));
  };

  const handleSaveDraft = () => {
    const idToUse = existingVendor?.id || initialToken;
    saveVendorDraft(idToUse, { companyDetails, contactDetails, bankDetails, documents });
    setSuccessMessage('Draft saved successfully! You can resume registration at any time.');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    const newErrors = {};
    if (!companyDetails.legalName) newErrors.legalName = 'Legal company name is required';
    const gstinErr = validateGSTIN(companyDetails.gstin);
    if (gstinErr) newErrors.gstin = gstinErr;
    const panErr = validatePAN(companyDetails.pan);
    if (panErr) newErrors.pan = panErr;

    const emailErr = validateEmail(contactDetails.email);
    if (emailErr) newErrors.email = emailErr;
    const mobileErr = validateMobile(contactDetails.mobile);
    if (mobileErr) newErrors.mobile = mobileErr;

    const ifscErr = validateIFSC(bankDetails.ifscCode);
    if (ifscErr) newErrors.ifscCode = ifscErr;
    if (!bankDetails.accountNumber) newErrors.accountNumber = 'Bank account number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // jump to first step with error
      if (newErrors.legalName || newErrors.gstin || newErrors.pan) setStep(1);
      else if (newErrors.email || newErrors.mobile) setStep(2);
      else if (newErrors.ifscCode || newErrors.accountNumber) setStep(3);
      return;
    }

    const idToUse = existingVendor?.id || initialToken;
    submitVendorRegistration(idToUse, { companyDetails, contactDetails, bankDetails, documents });
    setSuccessMessage('Registration submitted for approval! Aakshya Admin has been notified.');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1800);
  };

  const requiredDocTypes = [
    'GST Certificate',
    'PAN Card',
    'Cancelled Cheque',
    'MSME Certificate',
    'Incorporation Certificate',
    'Other Documents'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vendor Self-Service Onboarding Portal"
      subtitle={existingVendor?.invitationToken ? `Registration Token: ${existingVendor.invitationToken}` : 'Complete your company details, banking information & compliance documents'}
      maxWidth="max-w-3xl"
    >
      {/* Correction Banner if vendor has correction requested */}
      {existingVendor?.status === 'Correction Requested' && existingVendor.correctionNotes && (
        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3 text-orange-900">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-800">
              Correction Requested by Aakshya Admin
            </h4>
            <p className="text-xs mt-1 leading-relaxed text-orange-900">
              "{existingVendor.correctionNotes}"
            </p>
            <p className="text-[11px] text-orange-700 mt-1 font-medium">
              Please modify the requested details below and click Submit to resubmit for approval.
            </p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 font-semibold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Wizard Progress Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-6 border-b border-slate-100 pb-4">
        {[
          { num: 1, label: 'Company Info', icon: Building2 },
          { num: 2, label: 'Contact Info', icon: FileText },
          { num: 3, label: 'Bank Details', icon: CreditCard },
          { num: 4, label: 'Document Upload', icon: Upload },
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = step === tab.num;
          const isDone = step > tab.num;

          return (
            <button
              key={tab.num}
              onClick={() => setStep(tab.num)}
              type="button"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition ${
                isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold shadow-sm'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 font-medium'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                isActive ? 'bg-brand-600 text-white font-bold' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : tab.num}
              </div>
              <span className="text-xs truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Company Information */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              Company Legal Information
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Legal Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={companyDetails.legalName}
                onChange={e => setCompanyDetails({ ...companyDetails, legalName: e.target.value })}
                placeholder="e.g. Apex Industrial Solutions Pvt Ltd"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              {errors.legalName && <p className="text-rose-500 text-[11px] mt-1">{errors.legalName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GSTIN (15 Digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={companyDetails.gstin}
                  onChange={e => setCompanyDetails({ ...companyDetails, gstin: e.target.value.toUpperCase() })}
                  placeholder="27AABCA1234F1Z5"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.gstin && <p className="text-rose-500 text-[11px] mt-1">{errors.gstin}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Permanent Account Number (PAN) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={companyDetails.pan}
                  onChange={e => setCompanyDetails({ ...companyDetails, pan: e.target.value.toUpperCase() })}
                  placeholder="AABCA1234F"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.pan && <p className="text-rose-500 text-[11px] mt-1">{errors.pan}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Identification Number (CIN)
                </label>
                <input
                  type="text"
                  value={companyDetails.cin}
                  onChange={e => setCompanyDetails({ ...companyDetails, cin: e.target.value.toUpperCase() })}
                  placeholder="U29299MH2014PTC254890"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  MSME Registration (Udyam Number)
                </label>
                <input
                  type="text"
                  value={companyDetails.msmeNumber}
                  onChange={e => setCompanyDetails({ ...companyDetails, msmeNumber: e.target.value.toUpperCase() })}
                  placeholder="UDYAM-MH-12-0098741"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={companyDetails.category}
                onChange={e => setCompanyDetails({ ...companyDetails, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="Heavy Machinery & Spares">Heavy Machinery & Spares</option>
                <option value="IT Hardware & Cloud Infrastructure">IT Hardware & Cloud Infrastructure</option>
                <option value="Logistics & Transportation">Logistics & Transportation</option>
                <option value="Raw Materials & Chemicals">Raw Materials & Chemicals</option>
                <option value="Electrical & Automation">Electrical & Automation</option>
                <option value="Packaging & Consumables">Packaging & Consumables</option>
                <option value="Facility Management & Services">Facility Management & Services</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              Primary Contact & Registered Address
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorized Contact Person <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactDetails.contactPerson}
                onChange={e => setContactDetails({ ...contactDetails, contactPerson: e.target.value })}
                placeholder="e.g. Arun Kumar Singhania"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactDetails.email}
                  onChange={e => setContactDetails({ ...contactDetails, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={contactDetails.mobile}
                  onChange={e => setContactDetails({ ...contactDetails, mobile: e.target.value })}
                  placeholder="9820198201"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.mobile && <p className="text-rose-500 text-[11px] mt-1">{errors.mobile}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Office & Factory Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={contactDetails.address}
                onChange={e => setContactDetails({ ...contactDetails, address: e.target.value })}
                placeholder="Plot / Street, Industrial Area, City, State, PIN Code"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Bank Information */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              Banking & Electronic Remittance Details
            </h4>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Payments will be directly disbursed via RTGS/NEFT to this verified account.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Holder Name (as in Bank) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.accountHolderName}
                onChange={e => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                placeholder="e.g. Apex Industrial Solutions Pvt Ltd"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="e.g. HDFC Bank Ltd"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Account Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  placeholder="50200034981290"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.accountNumber && <p className="text-rose-500 text-[11px] mt-1">{errors.accountNumber}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                IFSC Code (11 Characters) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={11}
                value={bankDetails.ifscCode}
                onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                placeholder="HDFC0000240"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              {errors.ifscCode && <p className="text-rose-500 text-[11px] mt-1">{errors.ifscCode}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Document Upload */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-600" />
              Compliance Document Uploads
            </h4>

            <p className="text-xs text-slate-500">
              Upload clear PDF copies of regulatory certifications. Click any upload button to simulate file attachment:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requiredDocTypes.map(docType => {
                const uploaded = documents.find(d => d.type === docType);

                return (
                  <div
                    key={docType}
                    className={`p-3.5 rounded-xl border transition ${
                      uploaded
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">{docType}</span>
                      {uploaded ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Attached
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Required</span>
                      )}
                    </div>

                    {uploaded ? (
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-200 text-xs">
                        <span className="font-mono text-[11px] text-slate-700 truncate">{uploaded.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(docType)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulatedFileUpload(docType)}
                        className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/50 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-700 flex items-center justify-center gap-2 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Simulate Upload PDF</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 transition"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Approval</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
