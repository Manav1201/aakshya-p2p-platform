import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Search,
  Check,
  Send
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const PurchaseIndentList = ({ onConvertToRfp }) => {
  const {
    indents,
    createPurchaseIndent,
    approveIndentHOD,
    approveIndentFinance,
    rejectIndent
  } = useP2P();

  const { currentRole } = useAuthRole();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Modals
  const [newIndentModalOpen, setNewIndentModalOpen] = useState(false);
  const [viewDetailIndent, setViewDetailIndent] = useState(null);
  const [approvalModal, setApprovalModal] = useState({ isOpen: false, indent: null, level: '' });
  const [approvalRemarks, setApprovalRemarks] = useState('');

  // New Indent Form State
  const [formData, setFormData] = useState({
    department: 'Manufacturing Operations',
    projectName: '',
    requestorName: currentRole.name,
    itemName: '',
    description: '',
    quantity: 1,
    unit: 'Units',
    estimatedCost: '',
    requiredDate: '',
    priority: 'High',
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.estimatedCost || !formData.requiredDate) return;

    createPurchaseIndent(formData);
    setFormData({
      department: 'Manufacturing Operations',
      projectName: '',
      requestorName: currentRole.name,
      itemName: '',
      description: '',
      quantity: 1,
      unit: 'Units',
      estimatedCost: '',
      requiredDate: '',
      priority: 'High',
    });
    setNewIndentModalOpen(false);
  };

  const handleApprovalSubmit = (action) => {
    const { indent, level } = approvalModal;
    if (!indent) return;

    if (action === 'approve') {
      if (level === 'HOD') {
        approveIndentHOD(indent.id, approvalRemarks || 'Approved by Operations HOD');
      } else if (level === 'FINANCE') {
        approveIndentFinance(indent.id, approvalRemarks || 'Budget code verified. Capex Approved');
      }
    } else {
      rejectIndent(indent.id, level, approvalRemarks || 'Rejected during review');
    }

    setApprovalModal({ isOpen: false, indent: null, level: '' });
    setApprovalRemarks('');
    if (viewDetailIndent?.id === indent.id) {
      setViewDetailIndent(null);
    }
  };

  // Filtered indents
  const filteredIndents = indents.filter(pi => {
    const matchesSearch =
      pi.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pi.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pi.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pi.requestorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || pi.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || pi.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // KPI counters
  const totalIndents = indents.length;
  const pendingHodCount = indents.filter(i => i.status === 'Pending HOD').length;
  const pendingFinanceCount = indents.filter(i => i.status === 'Pending Finance').length;
  const approvedCount = indents.filter(i => i.status === 'Approved').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-brand-600" />
            Purchase Indent (PI) & Multi-Level Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Departmental material requisitions, multi-tiered hierarchy sign-offs & instant conversion to RFP
          </p>
        </div>

        <button
          onClick={() => setNewIndentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Purchase Indent</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Indents</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{totalIndents}</p>
          <span className="text-[10px] text-slate-400">Requisitions raised</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-800">Pending HOD Sign-off</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">{pendingHodCount}</p>
          <span className="text-[10px] text-purple-600">Operations / Dept Review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Pending Finance Review</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">{pendingFinanceCount}</p>
          <span className="text-[10px] text-blue-600">Budget allocation check</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Approved PIs</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{approvedCount}</p>
          <span className="text-[10px] text-emerald-600">Ready to Convert to RFP</span>
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
            placeholder="Search PI number, item, department or requestor..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending HOD">Pending HOD</option>
            <option value="Pending Finance">Pending Finance</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Indents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">PI Number & Item</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Quantity & Est. Cost</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Status & Workflow</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIndents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No Purchase Indents found</p>
                  </td>
                </tr>
              ) : (
                filteredIndents.map(pi => (
                  <tr key={pi.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                            {pi.indentNumber}
                          </span>
                          <span className="font-bold text-slate-900">{pi.itemName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {pi.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Raised by: {pi.requestorName} • Req by: {formatDate(pi.requiredDate)}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-700 font-medium">
                      <div>{pi.department}</div>
                      <div className="text-[10px] text-slate-400">{pi.projectName}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">
                        {formatCurrency(pi.estimatedCost)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {pi.quantity} {pi.unit}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pi.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : pi.priority === 'High'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {pi.priority}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <StatusBadge status={pi.status} />

                        {/* Approval Stage Indicator */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span className={pi.approvalWorkflow[0]?.status === 'Submitted' ? 'text-emerald-600 font-semibold' : ''}>
                            Req
                          </span>
                          <span>→</span>
                          <span className={pi.approvalWorkflow[1]?.status === 'Approved' ? 'text-emerald-600 font-semibold' : pi.status === 'Pending HOD' ? 'text-purple-600 font-bold animate-pulse' : ''}>
                            HOD
                          </span>
                          <span>→</span>
                          <span className={pi.approvalWorkflow[2]?.status === 'Approved' ? 'text-emerald-600 font-semibold' : pi.status === 'Pending Finance' ? 'text-blue-600 font-bold animate-pulse' : ''}>
                            Fin
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* HOD Action button if current role is HOD and status is Pending HOD */}
                        {currentRole.id === 'hod' && pi.status === 'Pending HOD' && (
                          <button
                            onClick={() => setApprovalModal({ isOpen: true, indent: pi, level: 'HOD' })}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                          >
                            HOD Review
                          </button>
                        )}

                        {/* Finance Action button if current role is Finance and status is Pending Finance */}
                        {currentRole.id === 'finance' && pi.status === 'Pending Finance' && (
                          <button
                            onClick={() => setApprovalModal({ isOpen: true, indent: pi, level: 'FINANCE' })}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                          >
                            Finance Review
                          </button>
                        )}

                        {/* Convert to RFP Button when Approved */}
                        {pi.status === 'Approved' && !pi.isConvertedToRfp && (
                          <button
                            onClick={() => onConvertToRfp(pi)}
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition transform active:scale-95"
                          >
                            <span>Convert to RFP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {pi.isConvertedToRfp && (
                          <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                            Converted ({pi.linkedRfpId})
                          </span>
                        )}

                        {/* Details Modal Trigger */}
                        <button
                          onClick={() => setViewDetailIndent(pi)}
                          className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create New Purchase Indent */}
      <Modal
        isOpen={newIndentModalOpen}
        onClose={() => setNewIndentModalOpen(false)}
        title="Raise Purchase Indent (PI)"
        subtitle="Submit a formal departmental material/service requirement for multi-level approval"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="Manufacturing Operations">Manufacturing Operations</option>
                <option value="IT Infrastructure & Security">IT Infrastructure & Security</option>
                <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                <option value="Environmental Health & Safety">Environmental Health & Safety</option>
                <option value="Facilities & Administration">Facilities & Administration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project / Cost Center Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="e.g. Smart Line 2 Expansion"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item / Service Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="e.g. 5-Axis Precision CNC Milling Machine"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requestor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.requestorName}
                onChange={e => setFormData({ ...formData, requestorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Specifications & Justification
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide technical requirements, make/model preferences, controller specs, etc."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-2/3 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <select
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-1/3 px-2 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Units">Units</option>
                  <option value="Sets">Sets</option>
                  <option value="Kg">Kg</option>
                  <option value="Meters">Meters</option>
                  <option value="Lots">Lots</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Cost (INR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.estimatedCost}
                onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })}
                placeholder="4500000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required By Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.requiredDate}
                onChange={e => setFormData({ ...formData, requiredDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
            </label>
            <div className="flex gap-4">
              {['Urgent', 'High', 'Medium', 'Low'].map(p => (
                <label key={p} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={formData.priority === p}
                    onChange={() => setFormData({ ...formData, priority: p })}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Sequential Approval Workflow:</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              1. Requester Submit → 2. Operations HOD Approval → 3. Finance Manager Capex Approval → 4. Convert to RFP.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setNewIndentModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Purchase Indent</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: HOD / Finance Approval Dialog */}
      <Modal
        isOpen={approvalModal.isOpen}
        onClose={() => setApprovalModal({ isOpen: false, indent: null, level: '' })}
        title={`${approvalModal.level === 'HOD' ? 'Operations HOD' : 'Finance Manager'} Approval Review`}
        subtitle={`Purchase Indent: ${approvalModal.indent?.indentNumber} • ${approvalModal.indent?.itemName}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Cost:</span>
              <span className="font-bold text-slate-900">{formatCurrency(approvalModal.indent?.estimatedCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800">{approvalModal.indent?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Requestor:</span>
              <span className="text-slate-800">{approvalModal.indent?.requestorName}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reviewer Remarks / Budget Code
            </label>
            <textarea
              rows={3}
              value={approvalRemarks}
              onChange={e => setApprovalRemarks(e.target.value)}
              placeholder="e.g. Approved. Validated under CAPEX FY26 production budget."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => handleApprovalSubmit('reject')}
              className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <button
              type="button"
              onClick={() => handleApprovalSubmit('approve')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Requisition</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Detailed Purchase Indent View */}
      {viewDetailIndent && (
        <Modal
          isOpen={!!viewDetailIndent}
          onClose={() => setViewDetailIndent(null)}
          title={`Purchase Indent: ${viewDetailIndent.indentNumber}`}
          subtitle={`Created on: ${formatDate(viewDetailIndent.createdAt)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <StatusBadge status={viewDetailIndent.status} size="md" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Estimated Budget</span>
                <span className="text-base font-extrabold text-slate-900">{formatCurrency(viewDetailIndent.estimatedCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Item & Description</span>
                <p className="font-bold text-slate-800 mt-0.5">{viewDetailIndent.itemName}</p>
                <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{viewDetailIndent.description}</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Department & Project</span>
                  <p className="font-semibold text-slate-800">{viewDetailIndent.department}</p>
                  <p className="text-[11px] text-slate-500">{viewDetailIndent.projectName}</p>
                </div>
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 block">Required By</span>
                  <p className="font-semibold text-slate-800">{formatDate(viewDetailIndent.requiredDate)}</p>
                </div>
              </div>
            </div>

            {/* Approval Workflow Stepper */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Approval Sign-off Audit
              </h4>
              <div className="space-y-3">
                {viewDetailIndent.approvalWorkflow?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.status === 'Approved' ? 'bg-emerald-600 text-white' : step.status === 'Submitted' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.status === 'Approved' ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{step.level} ({step.name})</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          step.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      {step.date && <p className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(step.date)}</p>}
                      {step.remarks && <p className="text-[11px] text-slate-600 bg-white p-1.5 rounded mt-1 border">"{step.remarks}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {viewDetailIndent.status === 'Approved' && !viewDetailIndent.isConvertedToRfp && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setViewDetailIndent(null);
                    onConvertToRfp(viewDetailIndent);
                  }}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>Convert this Approved PI to RFP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
