import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  FileCheck2,
  Send,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const PaymentProcessing = ({ highlightPaymentId }) => {
  const {
    payments,
    processPayment,
    acknowledgePaymentReceipt
  } = useP2P();

  const { isVendor, currentRole } = useAuthRole();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [processPaymentModal, setProcessPaymentModal] = useState(null);
  const [selectedRemittance, setSelectedRemittance] = useState(null);

  // Form State for Payment Execution
  const [processForm, setProcessForm] = useState({
    paymentMode: 'RTGS',
    sourceAccount: 'Aakshya Group Corporate - HDFC Bank (A/c ...8812)',
    utrNumber: '',
    notes: 'Electronic remittance disbursed via corporate banking portal.'
  });

  const handleExecutePaymentSubmit = (e) => {
    e.preventDefault();
    if (!processPaymentModal) return;

    processPayment(processPaymentModal.id, processForm);
    setProcessPaymentModal(null);
    setProcessForm({
      paymentMode: 'RTGS',
      sourceAccount: 'Aakshya Group Corporate - HDFC Bank (A/c ...8812)',
      utrNumber: '',
      notes: 'Electronic remittance disbursed via corporate banking portal.'
    });
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.utrNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalDisbursed = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + (p.amount || 0), 0);
  const scheduledAmount = payments.filter(p => p.status === 'Scheduled').reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-brand-600" />
            Treasury & Payment Processing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Corporate disbursement scheduling, RTGS/NEFT execution with UTR generation & vendor payment acknowledgement
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Disbursements</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{payments.length}</p>
          <span className="text-[10px] text-slate-400">Payment records</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-sm">
          <p className="text-xs font-medium text-indigo-800">Scheduled Queue</p>
          <p className="text-xl font-extrabold text-indigo-700 mt-1">
            {formatCurrency(scheduledAmount)}
          </p>
          <span className="text-[10px] text-indigo-600">
            {payments.filter(p => p.status === 'Scheduled').length} payments due
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Total Paid (YTD)</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {formatCurrency(totalDisbursed)}
          </p>
          <span className="text-[10px] text-emerald-600">Successfully remitted</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-800">Vendor Acknowledged</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">
            {payments.filter(p => p.vendorAcknowledged).length}
          </p>
          <span className="text-[10px] text-purple-600">Remittance confirmed</span>
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
            placeholder="Search payment ref, invoice, vendor or UTR..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Processed">Processed</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Payment Ref & Invoice</th>
                <th className="px-4 py-3.5">Vendor Name</th>
                <th className="px-4 py-3.5">Amount Disbursed</th>
                <th className="px-4 py-3.5">Payment Mode & UTR</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No payment records found</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/70 transition ${
                      highlightPaymentId === p.id ? 'bg-brand-50/50' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                          {p.paymentNumber}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">Inv: {p.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400">Due: {formatDate(p.dueDate)}</div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{p.vendorName}</div>
                      <div className="text-[10px] text-slate-400">{p.paymentTerms}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatCurrency(p.amount)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Scheduled: {formatDate(p.scheduledDate)}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{p.paymentMode}</span>
                      </div>
                      {p.utrNumber ? (
                        <div className="font-mono text-[11px] text-emerald-700 font-bold mt-0.5">
                          UTR: {p.utrNumber}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Pending Execution</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={p.status} />
                      {p.vendorAcknowledged && (
                        <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Acknowledged
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Remittance Advice view */}
                        <button
                          onClick={() => setSelectedRemittance(p)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Remittance</span>
                        </button>

                        {/* Execute Payment button if Finance persona & Scheduled */}
                        {currentRole.id === 'finance' && p.status === 'Scheduled' && (
                          <button
                            onClick={() => {
                              setProcessPaymentModal(p);
                              setProcessForm(prev => ({
                                ...prev,
                                utrNumber: `HDFCR${Date.now().toString().slice(-10)}`
                              }));
                            }}
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition transform active:scale-95"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Process & Disburse</span>
                          </button>
                        )}

                        {/* Vendor Acknowledge Receipt button if Paid & not yet acknowledged */}
                        {isVendor && p.status === 'Paid' && !p.vendorAcknowledged && (
                          <button
                            onClick={() => acknowledgePaymentReceipt(p.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Acknowledge Receipt</span>
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

      {/* MODAL 1: Execute Payment & Enter UTR Number */}
      {processPaymentModal && (
        <Modal
          isOpen={!!processPaymentModal}
          onClose={() => setProcessPaymentModal(null)}
          title={`Execute Payment: ${processPaymentModal.paymentNumber}`}
          subtitle={`Disbursement of ${formatCurrency(processPaymentModal.amount)} to ${processPaymentModal.vendorName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleExecutePaymentSubmit} className="space-y-4 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Payable Amount:</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(processPaymentModal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Ref:</span>
                <span className="font-mono text-slate-800">{processPaymentModal.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-semibold text-slate-800">{processPaymentModal.vendorName}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Transfer Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={processForm.paymentMode}
                onChange={e => setProcessForm({ ...processForm, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
              >
                <option value="RTGS">RTGS (Real Time Gross Settlement)</option>
                <option value="NEFT">NEFT (National Electronic Fund Transfer)</option>
                <option value="IMPS">IMPS (Immediate Payment Service)</option>
                <option value="Corporate Wire">Corporate Wire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Debit Account <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={processForm.sourceAccount}
                onChange={e => setProcessForm({ ...processForm, sourceAccount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank UTR / Transaction Reference Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={processForm.utrNumber}
                onChange={e => setProcessForm({ ...processForm, utrNumber: e.target.value.toUpperCase() })}
                placeholder="HDFCR520261120998124"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
              />
              <p className="text-[10px] text-slate-400 mt-1">Auto-generated corporate reference or enter bank confirmation code.</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setProcessPaymentModal(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Disburse Payment</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: Payment Remittance Advice Voucher */}
      {selectedRemittance && (
        <Modal
          isOpen={!!selectedRemittance}
          onClose={() => setSelectedRemittance(null)}
          title="Payment Remittance Advice"
          subtitle={`Voucher: ${selectedRemittance.paymentNumber} • Aakshya Group Treasury`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 pt-1">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Disbursement Status</span>
                <StatusBadge status={selectedRemittance.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount Remitted</span>
                <span className="font-extrabold text-lg text-slate-900">{formatCurrency(selectedRemittance.amount)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Debit Source</span>
                <p className="font-semibold text-slate-800">{selectedRemittance.sourceAccount}</p>
                <p className="text-slate-500">Mode: {selectedRemittance.paymentMode}</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Beneficiary Vendor</span>
                <p className="font-bold text-slate-900">{selectedRemittance.vendorName}</p>
                <p className="font-mono text-emerald-700 font-bold">UTR: {selectedRemittance.utrNumber || 'Pending'}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedRemittance.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Terms:</span>
                <span className="text-slate-800">{selectedRemittance.paymentTerms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processed Timestamp:</span>
                <span className="text-slate-800">{formatDateTime(selectedRemittance.processedDate || selectedRemittance.scheduledDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor Acknowledged:</span>
                <span className="font-semibold text-slate-800">
                  {selectedRemittance.vendorAcknowledged ? `Yes (${formatDateTime(selectedRemittance.acknowledgedAt)})` : 'Pending acknowledgement'}
                </span>
              </div>
            </div>

            {isVendor && selectedRemittance.status === 'Paid' && !selectedRemittance.vendorAcknowledged && (
              <div className="flex justify-end pt-2 border-t">
                <button
                  onClick={() => {
                    acknowledgePaymentReceipt(selectedRemittance.id);
                    setSelectedRemittance(prev => ({ ...prev, vendorAcknowledged: true }));
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acknowledge Payment Receipt</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
