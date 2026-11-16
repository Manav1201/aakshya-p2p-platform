import React, { useState } from 'react';
import {
  PackageCheck,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Receipt,
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const GoodsReceiptList = ({ preselectedDispatch, onClearPreselectedDispatch, onGenerateInvoice }) => {
  const {
    grns,
    pos,
    dispatches,
    createGrn
  } = useP2P();

  const { isAakshyaStaff } = useAuthRole();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [newGrnModalOpen, setNewGrnModalOpen] = useState(!!preselectedDispatch);
  const [selectedGrnDetail, setSelectedGrnDetail] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    poId: preselectedDispatch ? preselectedDispatch.poId : (pos[0]?.id || ''),
    dispatchId: preselectedDispatch?.id || '',
    quantityOrdered: 2,
    quantityReceived: 2,
    quantityAccepted: 2,
    quantityRejected: 0,
    qualityCheckResult: 'Passed',
    inspectionRemarks: 'Physical inspection completed. All alignment checks and spindle test run passed satisfactorily.',
    rejectionReason: 'Wrong Item',
    inspectorName: 'Vikram Singh (Quality & Stores Lead)'
  });

  const handlePoChange = (poId) => {
    const po = pos.find(p => p.id === poId);
    const qty = po?.items[0]?.quantity || 1;
    setFormData(prev => ({
      ...prev,
      poId,
      quantityOrdered: qty,
      quantityReceived: qty,
      quantityAccepted: qty,
      quantityRejected: 0
    }));
  };

  const handleCreateGrnSubmit = (e) => {
    e.preventDefault();
    if (!formData.poId) return;

    createGrn(formData);
    setNewGrnModalOpen(false);
    if (onClearPreselectedDispatch) onClearPreselectedDispatch();
  };

  const filteredGrns = grns.filter(grn => {
    const matchesSearch =
      grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || grn.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PackageCheck className="w-7 h-7 text-brand-600" />
            Goods Receipt Note (GRN) & Quality Inspection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical material receipt, QA/QC verification, quantity reconciliation & invoice unlocking gate
          </p>
        </div>

        {isAakshyaStaff && (
          <button
            onClick={() => setNewGrnModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create GRN & Inspect</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total GRNs Created</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{grns.length}</p>
          <span className="text-[10px] text-slate-400">Inspections recorded</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">GRN Approved</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {grns.filter(g => g.status === 'GRN Approved').length}
          </p>
          <span className="text-[10px] text-emerald-600">Eligible for Invoicing</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
          <p className="text-xs font-medium text-rose-800">Rejected / Quarantine</p>
          <p className="text-xl font-extrabold text-rose-700 mt-1">
            {grns.filter(g => g.status === 'Return Initiated').length}
          </p>
          <span className="text-[10px] text-rose-600">Return & replacement awaited</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Invoices Linked</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">
            {grns.filter(g => g.invoiceCreated).length}
          </p>
          <span className="text-[10px] text-blue-600">3-Way matched</span>
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
            placeholder="Search GRN number, PO or vendor..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All GRN Outcomes</option>
            <option value="GRN Approved">GRN Approved (Passed)</option>
            <option value="Return Initiated">Return Initiated (Rejected)</option>
          </select>
        </div>
      </div>

      {/* GRN Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">GRN & PO Number</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Quantities (Ord / Recv / Acc)</th>
                <th className="px-4 py-3.5">Quality Inspection</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <PackageCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No Goods Receipt Notes found</p>
                  </td>
                </tr>
              ) : (
                filteredGrns.map(grn => (
                  <tr key={grn.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                          {grn.grnNumber}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">PO: {grn.poNumber}</div>
                        <div className="text-[10px] text-slate-400">Date: {formatDate(grn.createdAt)}</div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{grn.vendorName}</div>
                      <div className="text-[10px] text-slate-400">Inspector: {grn.inspectorName}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Ord: <strong>{grn.quantityOrdered}</strong></span>
                        <span>•</span>
                        <span className="text-blue-700">Recv: <strong>{grn.quantityReceived}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Acc: {grn.quantityAccepted}</span>
                      </div>
                      {grn.quantityRejected > 0 && (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                          Rejected: {grn.quantityRejected}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={grn.qualityCheckResult} size="xs" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-xs">
                        {grn.inspectionRemarks}
                      </p>
                      {grn.rejectionReason && (
                        <span className="inline-block text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-0.5">
                          Reason: {grn.rejectionReason}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={grn.status} />
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedGrnDetail(grn)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
                        >
                          Inspection Sheet
                        </button>

                        {/* If GRN Approved & no invoice created, unlock Invoice Creation */}
                        {grn.status === 'GRN Approved' && !grn.invoiceCreated && onGenerateInvoice && (
                          <button
                            onClick={() => onGenerateInvoice(grn)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition transform active:scale-95"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Submit Invoice</span>
                          </button>
                        )}

                        {grn.invoiceCreated && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            Invoice Created
                          </span>
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

      {/* MODAL 1: Create GRN & Quality Inspection */}
      <Modal
        isOpen={newGrnModalOpen}
        onClose={() => {
          setNewGrnModalOpen(false);
          if (onClearPreselectedDispatch) onClearPreselectedDispatch();
        }}
        title="Create Goods Receipt Note (GRN) & QA Inspection"
        subtitle="Verify delivered quantity, quality check outcome, and unlock invoice eligibility"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateGrnSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Purchase Order <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.poId}
              onChange={e => handlePoChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              {pos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.poNumber} - {p.vendorName} ({p.items[0]?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Qty Ordered
              </label>
              <input
                type="number"
                readOnly
                value={formData.quantityOrdered}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Qty Received
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.quantityReceived}
                onChange={e => setFormData({ ...formData, quantityReceived: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-emerald-700 mb-1">
                Qty Accepted
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.quantityAccepted}
                onChange={e => setFormData({ ...formData, quantityAccepted: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg border border-emerald-300 text-xs font-bold bg-emerald-50/50"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-rose-700 mb-1">
                Qty Rejected
              </label>
              <input
                type="number"
                min={0}
                value={formData.quantityRejected}
                onChange={e => setFormData({ ...formData, quantityRejected: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg border border-rose-300 text-xs font-bold bg-rose-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quality Check Result <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer p-2 rounded-xl border border-emerald-300 bg-emerald-50/40 flex-1">
                  <input
                    type="radio"
                    name="qcResult"
                    value="Passed"
                    checked={formData.qualityCheckResult === 'Passed'}
                    onChange={() => setFormData({ ...formData, qualityCheckResult: 'Passed' })}
                  />
                  <span className="font-bold text-emerald-800">Flow A - Accepted (Passed)</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer p-2 rounded-xl border border-rose-300 bg-rose-50/40 flex-1">
                  <input
                    type="radio"
                    name="qcResult"
                    value="Failed"
                    checked={formData.qualityCheckResult === 'Failed'}
                    onChange={() => setFormData({ ...formData, qualityCheckResult: 'Failed' })}
                  />
                  <span className="font-bold text-rose-800">Flow B - Rejected (Failed)</span>
                </label>
              </div>
            </div>

            {formData.qualityCheckResult === 'Failed' && (
              <div>
                <label className="block text-xs font-semibold text-rose-700 mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.rejectionReason}
                  onChange={e => setFormData({ ...formData, rejectionReason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs bg-rose-50/30 text-rose-900 font-semibold"
                >
                  <option value="Quantity Mismatch">Quantity Mismatch</option>
                  <option value="Damaged Material">Damaged Material</option>
                  <option value="Quality Issue">Quality Issue</option>
                  <option value="Wrong Item">Wrong Item</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quality Inspection Remarks & Alignment Checks
            </label>
            <textarea
              rows={3}
              value={formData.inspectionRemarks}
              onChange={e => setFormData({ ...formData, inspectionRemarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          {/* Outcome Info Box */}
          <div className={`p-3.5 rounded-xl text-xs border ${
            formData.qualityCheckResult === 'Passed'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <p className="font-bold">
              {formData.qualityCheckResult === 'Passed'
                ? '✓ Flow 1 Outcome (Accepted):'
                : '⚠ Flow 2 Outcome (Rejected):'}
            </p>
            <p className="text-[11px] mt-0.5">
              {formData.qualityCheckResult === 'Passed'
                ? 'GRN will be Approved. Finance team will be notified, and Vendor will immediately become eligible to generate a 3-way matched Tax Invoice.'
                : `Material return initiated. Vendor notified with rejection reason: "${formData.rejectionReason}". Replacement / Credit Note awaited.`}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => {
                setNewGrnModalOpen(false);
                if (onClearPreselectedDispatch) onClearPreselectedDispatch();
              }}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 ${
                formData.qualityCheckResult === 'Passed'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Submit GRN & Inspection</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Inspection Sheet Details */}
      {selectedGrnDetail && (
        <Modal
          isOpen={!!selectedGrnDetail}
          onClose={() => setSelectedGrnDetail(null)}
          title={`Goods Receipt Note: ${selectedGrnDetail.grnNumber}`}
          subtitle={`Inspected by: ${selectedGrnDetail.inspectorName} on ${formatDate(selectedGrnDetail.createdAt)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 pt-1">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-mono text-base font-extrabold text-slate-900">{selectedGrnDetail.grnNumber}</span>
                <p className="text-xs text-slate-600 mt-0.5">PO: <strong>{selectedGrnDetail.poNumber}</strong> • {selectedGrnDetail.vendorName}</p>
              </div>
              <StatusBadge status={selectedGrnDetail.status} size="md" />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">Ordered Qty</span>
                <span className="text-lg font-bold text-slate-800">{selectedGrnDetail.quantityOrdered}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">Received Qty</span>
                <span className="text-lg font-bold text-blue-700">{selectedGrnDetail.quantityReceived}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">Accepted Qty</span>
                <span className="text-lg font-bold text-emerald-700">{selectedGrnDetail.quantityAccepted}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Inspection Remarks</span>
              <p className="text-slate-800 leading-relaxed">{selectedGrnDetail.inspectionRemarks}</p>
              {selectedGrnDetail.rejectionReason && (
                <div className="text-rose-700 font-bold pt-1">
                  Rejection Reason: {selectedGrnDetail.rejectionReason}
                </div>
              )}
            </div>

            {selectedGrnDetail.status === 'GRN Approved' && !selectedGrnDetail.invoiceCreated && onGenerateInvoice && (
              <div className="flex justify-end pt-2 border-t">
                <button
                  onClick={() => {
                    const grn = selectedGrnDetail;
                    setSelectedGrnDetail(null);
                    onGenerateInvoice(grn);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Generate Invoice against this GRN</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
