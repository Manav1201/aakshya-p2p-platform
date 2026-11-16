import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Users,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  ArrowRight,
  ShoppingCart,
  Download,
  Search,
  Filter,
  Check,
  Send,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const RfpManagement = ({ preselectedPi, onClearPreselectedPi, onGeneratePo }) => {
  const {
    rfps,
    indents,
    vendors,
    createRfpFromIndent,
    awardWinningRfpBid
  } = useP2P();

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [createRfpModalOpen, setCreateRfpModalOpen] = useState(!!preselectedPi);
  const [selectedRfpForEvaluation, setSelectedRfpForEvaluation] = useState(null);
  const [awardNotes, setAwardNotes] = useState('');

  // Form State for RFP Creation
  const [rfpForm, setRfpForm] = useState({
    linkedPiId: preselectedPi?.id || '',
    title: preselectedPi ? `Procurement of ${preselectedPi.itemName}` : '',
    submissionDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    termsAndConditions: '1. Delivery within stipulated weeks from PO.\n2. 2-year warranty with on-site support.\n3. Net 30 days payment post GRN Acceptance.\n4. Liquidated damages 0.5% per week of delay.',
    invitedVendorIds: []
  });

  // Approved PIs that can be linked
  const approvedIndents = indents.filter(pi => pi.status === 'Approved');

  // Onboarded Vendors available for selection
  const onboardedVendors = vendors.filter(v => v.status === 'Onboarded');

  const handlePiChange = (piId) => {
    const pi = indents.find(i => i.id === piId);
    setRfpForm(prev => ({
      ...prev,
      linkedPiId: piId,
      title: pi ? `Procurement of ${pi.itemName}` : prev.title
    }));
  };

  const toggleVendorSelection = (vId) => {
    setRfpForm(prev => {
      const alreadySelected = prev.invitedVendorIds.includes(vId);
      return {
        ...prev,
        invitedVendorIds: alreadySelected
          ? prev.invitedVendorIds.filter(id => id !== vId)
          : [...prev.invitedVendorIds, vId]
      };
    });
  };

  const handleCreateRfpSubmit = (e) => {
    e.preventDefault();
    if (!rfpForm.linkedPiId || rfpForm.invitedVendorIds.length === 0) return;

    createRfpFromIndent(rfpForm.linkedPiId, rfpForm);
    setCreateRfpModalOpen(false);
    if (onClearPreselectedPi) onClearPreselectedPi();
  };

  const handleAwardBid = (rfpId, vendorId) => {
    awardWinningRfpBid(rfpId, vendorId, awardNotes || 'Lowest compliant price (L1) & verified technical specifications.');
    setAwardNotes('');
    if (selectedRfpForEvaluation?.id === rfpId) {
      setSelectedRfpForEvaluation(null);
    }
  };

  // Filtered RFPs
  const filteredRfps = rfps.filter(rfp => {
    const matchesSearch =
      rfp.rfpNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.linkedPiNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || rfp.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-brand-600" />
            RFP / RFQ Management & Quotation Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create competitive tenders against approved PIs, invite multi-vendor bidding & evaluate quotation matrices
          </p>
        </div>

        <button
          onClick={() => setCreateRfpModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New RFP</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total RFPs</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{rfps.length}</p>
          <span className="text-[10px] text-slate-400">All tenders</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Open for Bidding</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">
            {rfps.filter(r => r.status === 'Open for Bidding').length}
          </p>
          <span className="text-[10px] text-blue-600">Active vendor submission</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-800">Quotations Received</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">
            {rfps.reduce((acc, r) => acc + (r.responses?.length || 0), 0)}
          </p>
          <span className="text-[10px] text-purple-600">Vendor bids across RFPs</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Awarded RFPs</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {rfps.filter(r => r.status === 'Awarded').length}
          </p>
          <span className="text-[10px] text-emerald-600">Winner selected & PO ready</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search RFP number, title or linked PI..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open for Bidding">Open for Bidding</option>
            <option value="Awarded">Awarded</option>
          </select>
        </div>
      </div>

      {/* RFPs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">RFP Number & Title</th>
                <th className="px-4 py-3.5">Linked PI & Budget</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5">Invited / Responses</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRfps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No RFPs found</p>
                  </td>
                </tr>
              ) : (
                filteredRfps.map(rfp => (
                  <tr key={rfp.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                            {rfp.rfpNumber}
                          </span>
                          <span className="font-bold text-slate-900">{rfp.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {rfp.department}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-mono text-slate-700 font-semibold">{rfp.linkedPiNumber}</div>
                      <div className="text-[11px] text-slate-500">
                        Budget: <strong className="text-slate-800">{formatCurrency(rfp.budgetEstimate)}</strong>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{formatDate(rfp.submissionDueDate)}</div>
                      <div className="text-[10px] text-slate-400">Created: {formatDate(rfp.createdAt)}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[11px] border border-blue-200">
                          {rfp.responses?.length || 0} Quotes
                        </span>
                        <span className="text-[10px] text-slate-400">
                          of {rfp.invitedVendorIds?.length || 0} invited
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={rfp.status} />
                      {rfp.winningVendorName && (
                        <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                          <Award className="w-3 h-3" /> {rfp.winningVendorName}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Evaluate Quotes Button */}
                        <button
                          onClick={() => setSelectedRfpForEvaluation(rfp)}
                          className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Compare Bids ({rfp.responses?.length || 0})</span>
                        </button>

                        {/* Convert to PO Button if awarded */}
                        {rfp.status === 'Awarded' && (
                          <button
                            onClick={() => onGeneratePo(rfp.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition transform active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Generate PO</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create RFP Form */}
      <Modal
        isOpen={createRfpModalOpen}
        onClose={() => {
          setCreateRfpModalOpen(false);
          if (onClearPreselectedPi) onClearPreselectedPi();
        }}
        title="Create RFP / RFQ Tender"
        subtitle="Publish requirements to selected Vendor Master suppliers with bidding deadline"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateRfpSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Approved Purchase Indent (PI) <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={rfpForm.linkedPiId}
              onChange={e => handlePiChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="">Select an Approved Purchase Indent</option>
              {approvedIndents.map(pi => (
                <option key={pi.id} value={pi.id}>
                  {pi.indentNumber} - {pi.itemName} ({formatCurrency(pi.estimatedCost)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              RFP Tender Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={rfpForm.title}
              onChange={e => setRfpForm({ ...rfpForm, title: e.target.value })}
              placeholder="e.g. Supply and Commissioning of 5-Axis Precision CNC Milling Machine"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={rfpForm.submissionDueDate}
              onChange={e => setRfpForm({ ...rfpForm, submissionDueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Vendors from Vendor Master (Multiple) <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Only onboarded, compliance-verified suppliers can be invited to submit bids:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
              {onboardedVendors.map(vendor => {
                const isSelected = rfpForm.invitedVendorIds.includes(vendor.id);
                return (
                  <div
                    key={vendor.id}
                    onClick={() => toggleVendorSelection(vendor.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/80 text-brand-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs truncate">{vendor.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{vendor.category}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-brand-600 text-white' : 'border border-slate-300 bg-slate-50'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
            {rfpForm.invitedVendorIds.length === 0 && (
              <p className="text-[11px] text-rose-500 mt-1">Please select at least one vendor.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Terms & Conditions
            </label>
            <textarea
              rows={3}
              value={rfpForm.termsAndConditions}
              onChange={e => setRfpForm({ ...rfpForm, termsAndConditions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => {
                setCreateRfpModalOpen(false);
                if (onClearPreselectedPi) onClearPreselectedPi();
              }}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rfpForm.invitedVendorIds.length === 0}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish RFP & Notify Vendors</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Side-by-Side Quotation Comparison Matrix & Award */}
      {selectedRfpForEvaluation && (
        <Modal
          isOpen={!!selectedRfpForEvaluation}
          onClose={() => setSelectedRfpForEvaluation(null)}
          title={`Bid Evaluation Matrix: ${selectedRfpForEvaluation.rfpNumber}`}
          subtitle={`${selectedRfpForEvaluation.title} • Budget Estimate: ${formatCurrency(selectedRfpForEvaluation.budgetEstimate)}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-5 pt-1">
            {/* Summary Bar */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-600">
                <span>Deadline: <strong className="text-slate-900">{formatDate(selectedRfpForEvaluation.submissionDueDate)}</strong></span>
                <span className="mx-2">•</span>
                <span>Submissions: <strong className="text-slate-900">{selectedRfpForEvaluation.responses?.length || 0} received</strong></span>
              </div>
              <StatusBadge status={selectedRfpForEvaluation.status} size="md" />
            </div>

            {/* Quotation Matrix Table */}
            {(!selectedRfpForEvaluation.responses || selectedRfpForEvaluation.responses.length === 0) ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No vendor quotations submitted yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Switch to Vendor persona (Apex Industrial Solutions) to submit a live quotation!
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Vendor / Bidder</th>
                      <th className="px-4 py-3">Quoted Price</th>
                      <th className="px-4 py-3">Variance vs Budget</th>
                      <th className="px-4 py-3">Delivery Lead Time</th>
                      <th className="px-4 py-3">Technical Response</th>
                      <th className="px-4 py-3 text-right">Evaluation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {/* Sort responses by price ascending (L1, L2, etc.) */}
                    {[...selectedRfpForEvaluation.responses]
                      .sort((a, b) => a.totalPrice - b.totalPrice)
                      .map((resp, idx) => {
                        const isL1 = idx === 0;
                        const budget = selectedRfpForEvaluation.budgetEstimate || 1;
                        const variance = ((resp.totalPrice - budget) / budget) * 100;
                        const isSelectedWinner = selectedRfpForEvaluation.winningVendorId === resp.vendorId;

                        return (
                          <tr
                            key={resp.id}
                            className={`transition ${
                              isSelectedWinner
                                ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                                : isL1
                                ? 'bg-blue-50/30'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${
                                  isL1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  L{idx + 1}
                                </span>
                                <div>
                                  <p className="font-bold text-slate-900">{resp.vendorName}</p>
                                  <p className="text-[10px] text-slate-400">Submitted: {formatDateTime(resp.submittedAt)}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div className="text-sm font-extrabold text-slate-900">
                                {formatCurrency(resp.totalPrice)}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Unit: {formatCurrency(resp.unitPrice)}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                variance <= 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {variance <= 0 ? `${Math.abs(variance).toFixed(1)}% Savings` : `+${variance.toFixed(1)}% Over`}
                              </span>
                            </td>

                            <td className="px-4 py-4 font-semibold text-slate-700">
                              {resp.deliveryTimelineWeeks} Weeks
                            </td>

                            <td className="px-4 py-4">
                              <p className="text-[11px] text-slate-700 line-clamp-2 max-w-xs leading-relaxed">
                                {resp.technicalResponse}
                              </p>
                              <p className="text-[10px] text-brand-600 font-mono mt-0.5">
                                Doc: {resp.proposalDoc}
                              </p>
                            </td>

                            <td className="px-4 py-4 text-right">
                              {isSelectedWinner ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">
                                  <Award className="w-3.5 h-3.5" /> Awarded Winner
                                </span>
                              ) : selectedRfpForEvaluation.status === 'Awarded' ? (
                                <span className="text-slate-400 text-xs font-medium">Not Selected</span>
                              ) : (
                                <button
                                  onClick={() => handleAwardBid(selectedRfpForEvaluation.id, resp.vendorId)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1 transition"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Select Winner</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Post-Award PO Trigger */}
            {selectedRfpForEvaluation.status === 'Awarded' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Winning Bid Selected: {selectedRfpForEvaluation.winningVendorName}
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Ready to convert this awarded RFP and linked PI directly into an official Purchase Order.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const rfpId = selectedRfpForEvaluation.id;
                    setSelectedRfpForEvaluation(null);
                    onGeneratePo(rfpId);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Generate Purchase Order (PO)</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
