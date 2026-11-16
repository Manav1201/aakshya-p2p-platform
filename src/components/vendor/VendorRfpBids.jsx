import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Send,
  Upload,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Award,
  AlertCircle
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const VendorRfpBids = () => {
  const { rfps, vendors, submitRfpQuotation } = useP2P();
  const { activeVendorId } = useAuthRole();

  const currentVendor = (vendors && vendors.find(v => v.id === activeVendorId)) || (vendors && vendors[0]) || {
    id: 'VND-001',
    name: 'Apex Industrial Solutions Pvt Ltd'
  };

  const [selectedRfpToBid, setSelectedRfpToBid] = useState(null);
  const [bidForm, setBidForm] = useState({
    unitPrice: '',
    totalPrice: '',
    deliveryTimelineWeeks: 4,
    proposalDoc: 'Commercial_Technical_Proposal.pdf',
    commercialResponse: 'Payment: Net 30 days post GRN acceptance. 2-year on-site comprehensive warranty included.',
    technicalResponse: '100% compliant with specifications and Siemens/Fanuc controller requirements.'
  });

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!selectedRfpToBid || !bidForm.totalPrice) return;

    submitRfpQuotation(selectedRfpToBid.id, {
      vendorId: currentVendor.id,
      vendorName: currentVendor.name,
      unitPrice: bidForm.unitPrice || bidForm.totalPrice,
      totalPrice: bidForm.totalPrice,
      deliveryTimelineWeeks: bidForm.deliveryTimelineWeeks,
      proposalDoc: bidForm.proposalDoc,
      commercialResponse: bidForm.commercialResponse,
      technicalResponse: bidForm.technicalResponse
    });

    setSelectedRfpToBid(null);
    setBidForm({
      unitPrice: '',
      totalPrice: '',
      deliveryTimelineWeeks: 4,
      proposalDoc: 'Commercial_Technical_Proposal.pdf',
      commercialResponse: 'Payment: Net 30 days post GRN acceptance. 2-year on-site comprehensive warranty included.',
      technicalResponse: '100% compliant with specifications and Siemens/Fanuc controller requirements.'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-indigo-600" />
          RFPs, Tenders & Quotation Submissions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review published tenders from Aakshya Group, upload technical proposals & submit competitive commercial bids
        </p>
      </div>

      {/* RFP List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rfps.map(rfp => {
          const myResponse = rfp.responses?.find(r => r.vendorId === currentVendor.id);
          const isInvited = rfp.invitedVendorIds?.includes(currentVendor.id);

          return (
            <div
              key={rfp.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                    {rfp.rfpNumber}
                  </span>
                  <StatusBadge status={rfp.status} />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {rfp.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {rfp.termsAndConditions}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Deadline: <strong className="text-slate-900">{formatDate(rfp.submissionDueDate)}</strong></span>
                  <span>Est Budget: <strong className="text-slate-900">{formatCurrency(rfp.budgetEstimate)}</strong></span>
                </div>
              </div>

              {/* Status or Submission Action */}
              <div className="pt-3 border-t border-slate-100">
                {myResponse ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Quotation Submitted</span>
                      <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(myResponse.totalPrice)}</span>
                      <span className="text-[10px] text-slate-500 block">Lead time: {myResponse.deliveryTimelineWeeks} weeks</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs">
                      {myResponse.status || 'Submitted'}
                    </span>
                  </div>
                ) : rfp.status === 'Open for Bidding' ? (
                  <button
                    onClick={() => {
                      setSelectedRfpToBid(rfp);
                      setBidForm(prev => ({
                        ...prev,
                        totalPrice: rfp.budgetEstimate ? Math.round(rfp.budgetEstimate * 0.95) : '',
                        unitPrice: rfp.budgetEstimate ? Math.round(rfp.budgetEstimate * 0.95) : ''
                      }));
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal & Price Quote</span>
                  </button>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-500 text-center font-medium">
                    Bidding Closed ({rfp.status})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BID SUBMISSION MODAL */}
      {selectedRfpToBid && (
        <Modal
          isOpen={!!selectedRfpToBid}
          onClose={() => setSelectedRfpToBid(null)}
          title={`Submit Quotation: ${selectedRfpToBid.rfpNumber}`}
          subtitle={`${selectedRfpToBid.title} • Submission Deadline: ${formatDate(selectedRfpToBid.submissionDueDate)}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmitBid} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Commercial Price (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={bidForm.totalPrice}
                  onChange={e => setBidForm({ ...bidForm, totalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Lead Time (Weeks) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={bidForm.deliveryTimelineWeeks}
                  onChange={e => setBidForm({ ...bidForm, deliveryTimelineWeeks: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Response & Specification Compliance
              </label>
              <textarea
                rows={3}
                value={bidForm.technicalResponse}
                onChange={e => setBidForm({ ...bidForm, technicalResponse: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Commercial Terms Acceptance
              </label>
              <input
                type="text"
                value={bidForm.commercialResponse}
                onChange={e => setBidForm({ ...bidForm, commercialResponse: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-800">Proposal Document Attached:</span>
              <p className="font-mono text-indigo-700">{bidForm.proposalDoc}</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedRfpToBid(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Quotation</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
