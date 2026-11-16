import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  Filter,
  FileCheck2,
  Download,
  Calendar,
  CreditCard,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const InvoiceReviewList = ({ preselectedGrn, onClearPreselectedGrn, onNavigatePayments }) => {
  const {
    invoices,
    grns,
    pos,
    createInvoice,
    reviewInvoiceFinance
  } = useP2P();

  const { isVendor, currentRole } = useAuthRole();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(!!preselectedGrn);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState('Approve');
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Approved GRNs eligible for invoicing (where invoiceCreated is false, or preselected)
  const eligibleGrns = grns.filter(g => g.status === 'GRN Approved' && (!g.invoiceCreated || g.id === preselectedGrn?.id));

  // Form State for Invoice Creation
  const initialGrn = preselectedGrn || eligibleGrns[0];
  const matchingPo = pos.find(p => p.id === initialGrn?.poId);

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    grnId: initialGrn?.id || '',
    poId: matchingPo?.id || '',
    baseAmount: matchingPo ? matchingPo.subtotal : 100000,
    quantity: initialGrn ? initialGrn.quantityAccepted : 1,
    isInterState: false,
    attachmentDoc: 'Commercial_Tax_Invoice.pdf'
  });

  const handleGrnSelect = (grnId) => {
    const grn = grns.find(g => g.id === grnId);
    const po = pos.find(p => p.id === grn?.poId);
    setInvoiceForm(prev => ({
      ...prev,
      grnId,
      poId: po?.id || '',
      baseAmount: po ? po.subtotal : prev.baseAmount,
      quantity: grn ? grn.quantityAccepted : 1
    }));
  };

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!invoiceForm.grnId || !invoiceForm.invoiceNumber) return;

    createInvoice(invoiceForm);
    setCreateInvoiceModalOpen(false);
    if (onClearPreselectedGrn) onClearPreselectedGrn();
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedInvoiceDetail) return;

    reviewInvoiceFinance(selectedInvoiceDetail.id, reviewAction, reviewRemarks || '3-Way Match Verified');
    setReviewModalOpen(false);
    setSelectedInvoiceDetail(null);
    setReviewRemarks('');
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || inv.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-brand-600" />
            3-Way Match Invoice Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated PO vs GRN vs Tax Invoice 3-way matching, GST reconciliation & payment authorization
          </p>
        </div>

        {/* Create Invoice button (Enabled when Approved GRN exists) */}
        <button
          onClick={() => setCreateInvoiceModalOpen(true)}
          disabled={eligibleGrns.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Tax Invoice ({eligibleGrns.length} GRN ready)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Invoices</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{invoices.length}</p>
          <span className="text-[10px] text-slate-400">All claims</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-800">Pending Review</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">
            {invoices.filter(i => i.status === 'Submitted' || i.status === 'Under Review').length}
          </p>
          <span className="text-[10px] text-purple-600">3-Way match verification</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Approved for Payment</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {invoices.filter(i => i.status === 'Approved for Payment').length}
          </p>
          <span className="text-[10px] text-emerald-600">Disbursement scheduled</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Paid Invoices</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">
            {invoices.filter(i => i.status === 'Paid').length}
          </p>
          <span className="text-[10px] text-blue-600">Remittance issued</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search invoice number, PO, GRN or vendor..."
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
            <option value="Submitted">Submitted</option>
            <option value="Approved for Payment">Approved for Payment</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Invoice Number & Date</th>
                <th className="px-4 py-3.5">Linked PO & GRN</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Total Amount (Incl Tax)</th>
                <th className="px-4 py-3.5">3-Way Match</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No Invoices found</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                          {inv.invoiceNumber}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Date: {formatDate(inv.invoiceDate)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Due: {formatDate(inv.paymentDueDate)}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-mono text-slate-800 font-semibold">{inv.poNumber}</div>
                      <div className="font-mono text-[11px] text-brand-600 mt-0.5">{inv.grnNumber}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{inv.vendorName}</div>
                      <div className="text-[10px] text-slate-400">{inv.vendorId}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatCurrency(inv.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Base: {formatCurrency(inv.baseAmount)} + Tax: {formatCurrency(inv.taxAmount)}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.threeWayMatchStatus === 'Matched'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {inv.threeWayMatchStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={inv.status} />
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceDetail(inv)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
                        >
                          View Match
                        </button>

                        {/* Finance Review Button */}
                        {currentRole.id === 'finance' && inv.status === 'Submitted' && (
                          <button
                            onClick={() => {
                              setSelectedInvoiceDetail(inv);
                              setReviewModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                          >
                            Review & Approve
                          </button>
                        )}

                        {/* Link to Payment if Approved */}
                        {inv.status === 'Approved for Payment' && onNavigatePayments && (
                          <button
                            onClick={() => onNavigatePayments(inv.linkedPaymentId)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Payment Schedule</span>
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

      {/* MODAL 1: Generate Invoice Form against Approved GRN */}
      <Modal
        isOpen={createInvoiceModalOpen}
        onClose={() => {
          setCreateInvoiceModalOpen(false);
          if (onClearPreselectedGrn) onClearPreselectedGrn();
        }}
        title="Generate Tax Invoice against Approved GRN"
        subtitle="3-Way Match Rule: An invoice can only be created against verified, quality-passed Goods Receipts"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Approved Goods Receipt Note (GRN) <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={invoiceForm.grnId}
              onChange={e => handleGrnSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              {eligibleGrns.map(g => (
                <option key={g.id} value={g.id}>
                  {g.grnNumber} - PO: {g.poNumber} ({g.vendorName}) - Qty: {g.quantityAccepted}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor Tax Invoice Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={invoiceForm.invoiceNumber}
                onChange={e => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                placeholder="e.g. APX-INV-9902"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={invoiceForm.invoiceDate}
                onChange={e => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Amount (INR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={invoiceForm.baseAmount}
                onChange={e => setInvoiceForm({ ...invoiceForm, baseAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billed Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={invoiceForm.quantity}
                onChange={e => setInvoiceForm({ ...invoiceForm, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>GST Breakdown (18%):</span>
              <span className="font-mono">{formatCurrency(invoiceForm.baseAmount * 0.18)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-sm border-t pt-1.5">
              <span>Total Invoice Payable:</span>
              <span className="font-mono text-brand-700">{formatCurrency(invoiceForm.baseAmount * 1.18)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => {
                setCreateInvoiceModalOpen(false);
                if (onClearPreselectedGrn) onClearPreselectedGrn();
              }}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Submit Invoice for Review</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: 3-Way Match Details & Finance Review */}
      {selectedInvoiceDetail && (
        <Modal
          isOpen={!!selectedInvoiceDetail}
          onClose={() => setSelectedInvoiceDetail(null)}
          title={`3-Way Match Reconciliation: ${selectedInvoiceDetail.invoiceNumber}`}
          subtitle={`PO: ${selectedInvoiceDetail.poNumber} ⇄ GRN: ${selectedInvoiceDetail.grnNumber} ⇄ Invoice: ${selectedInvoiceDetail.invoiceNumber}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 pt-1">
            {/* 3-Way Match Visual Box */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              {/* Box 1: PO */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-800 block">1. Purchase Order (PO)</span>
                <p className="font-mono font-bold text-slate-900">{selectedInvoiceDetail.poNumber}</p>
                <p className="text-[11px] text-slate-600">PO Value: <strong className="text-slate-900">{formatCurrency(selectedInvoiceDetail.matchDetails?.poAmount || selectedInvoiceDetail.totalAmount)}</strong></p>
                <span className="inline-block text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-semibold mt-1">
                  Contract Agreed
                </span>
              </div>

              {/* Box 2: GRN */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">2. Goods Receipt (GRN)</span>
                <p className="font-mono font-bold text-slate-900">{selectedInvoiceDetail.grnNumber}</p>
                <p className="text-[11px] text-slate-600">Accepted Qty: <strong className="text-emerald-800">{selectedInvoiceDetail.matchDetails?.grnAcceptedQty} Units</strong></p>
                <span className="inline-block text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold mt-1">
                  Quality Verified
                </span>
              </div>

              {/* Box 3: Invoice */}
              <div className="p-3.5 bg-purple-50/50 border border-purple-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-800 block">3. Vendor Tax Invoice</span>
                <p className="font-mono font-bold text-slate-900">{selectedInvoiceDetail.invoiceNumber}</p>
                <p className="text-[11px] text-slate-600">Claim Amount: <strong className="text-purple-900">{formatCurrency(selectedInvoiceDetail.totalAmount)}</strong></p>
                <span className="inline-block text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-semibold mt-1">
                  Tax Breakdown 18%
                </span>
              </div>
            </div>

            {/* Reconciliation Match Result */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              selectedInvoiceDetail.threeWayMatchStatus === 'Matched'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    3-Way Matching Result: {selectedInvoiceDetail.threeWayMatchStatus}
                  </h4>
                  <p className="text-[11px] mt-0.5">
                    Price Variance: ₹0.00 • Quantity Discrepancy: 0 Units. 100% compliant with approved GRN.
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedInvoiceDetail.status} size="md" />
            </div>

            {/* Review Form if Finance persona & pending */}
            {currentRole.id === 'finance' && selectedInvoiceDetail.status === 'Submitted' && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Finance Approval Sign-off
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reviewer Action</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="financeAction"
                        value="Approve"
                        checked={reviewAction === 'Approve'}
                        onChange={() => setReviewAction('Approve')}
                      />
                      <span className="font-bold text-emerald-700">Approve for Payment (Schedule Disbursement)</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="financeAction"
                        value="Reject"
                        checked={reviewAction === 'Reject'}
                        onChange={() => setReviewAction('Reject')}
                      />
                      <span className="font-bold text-rose-700">Reject Invoice</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Remarks</label>
                  <input
                    type="text"
                    value={reviewRemarks}
                    onChange={e => setReviewRemarks(e.target.value)}
                    placeholder="3-Way Match Verified. Approved for disbursement."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize & Schedule Payment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
