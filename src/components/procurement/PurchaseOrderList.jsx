import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  FileCheck2,
  MessageSquare,
  Truck,
  Send,
  ArrowRight
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const PurchaseOrderList = ({ onNavigateDispatch }) => {
  const {
    pos,
    acceptPurchaseOrder,
    rejectPurchaseOrder,
    raisePoClarification,
    answerPoClarification
  } = useP2P();

  const { isVendor, currentRole } = useAuthRole();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPoForDetail, setSelectedPoForDetail] = useState(null);
  const [clarificationText, setClarificationText] = useState('');
  const [clarificationModalPo, setClarificationModalPo] = useState(null);

  const filteredPos = pos.filter(po => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.items[0]?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || po.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSendClarification = (e) => {
    e.preventDefault();
    if (!clarificationModalPo || !clarificationText.trim()) return;

    if (isVendor) {
      raisePoClarification(clarificationModalPo.id, clarificationText.trim());
    } else {
      answerPoClarification(clarificationModalPo.id, clarificationText.trim());
    }

    setClarificationText('');
    setClarificationModalPo(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-brand-600" />
            Purchase Order (PO) Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contractual binding orders linked 3-ways to PI, RFP & Vendor Master with real-time bidirectional acknowledgement
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total POs Issued</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{pos.length}</p>
          <span className="text-[10px] text-slate-400">All commitments</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Awaiting Acceptance</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">
            {pos.filter(p => p.status === 'Issued').length}
          </p>
          <span className="text-[10px] text-blue-600">Pending vendor sign</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Accepted & Active</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {pos.filter(p => p.status === 'Accepted').length}
          </p>
          <span className="text-[10px] text-emerald-600">Ready for dispatch</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-800">Total PO Value</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">
            {formatCurrency(pos.reduce((acc, p) => acc + (p.totalAmount || 0), 0))}
          </p>
          <span className="text-[10px] text-purple-600">Committed procurement</span>
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
            placeholder="Search PO number, item or vendor..."
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
            <option value="Issued">Issued</option>
            <option value="Accepted">Accepted</option>
            <option value="Clarification Raised">Clarification Raised</option>
          </select>
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">PO Number & Item</th>
                <th className="px-4 py-3.5">Vendor Name</th>
                <th className="px-4 py-3.5">Total Value (Incl Tax)</th>
                <th className="px-4 py-3.5">Delivery Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No Purchase Orders found</p>
                  </td>
                </tr>
              ) : (
                filteredPos.map(po => (
                  <tr key={po.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                            {po.poNumber}
                          </span>
                          <span className="font-bold text-slate-900">{po.items[0]?.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>PI: {po.piNumber || 'Direct'}</span>
                          <span>•</span>
                          <span>RFP: {po.rfpNumber || 'Catalog'}</span>
                          <span>•</span>
                          <span>Issued: {formatDate(po.issuedAt)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{po.vendorName}</div>
                      <div className="text-[10px] text-slate-400">{po.vendorId}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatCurrency(po.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Base: {formatCurrency(po.subtotal)} + {po.taxRate}% GST
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      <div className="font-semibold">{formatDate(po.deliveryDate)}</div>
                      <div className="text-[10px] text-slate-400">{po.paymentTerms}</div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={po.status} />
                      {po.clarifications?.length > 0 && (
                        <div className="text-[10px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {po.clarifications.length} message(s)
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPoForDetail(po)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PO</span>
                        </button>

                        {/* Vendor persona actions */}
                        {isVendor && po.status === 'Issued' && (
                          <>
                            <button
                              onClick={() => acceptPurchaseOrder(po.id, 'Formal PO acceptance received from vendor.')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                            >
                              Accept PO
                            </button>

                            <button
                              onClick={() => setClarificationModalPo(po)}
                              className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold"
                            >
                              Raise Query
                            </button>
                          </>
                        )}

                        {/* Dispatch link if Accepted */}
                        {po.status === 'Accepted' && (
                          <button
                            onClick={() => onNavigateDispatch && onNavigateDispatch(po.id)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch</span>
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

      {/* MODAL 1: Full Purchase Order Document View */}
      {selectedPoForDetail && (
        <Modal
          isOpen={!!selectedPoForDetail}
          onClose={() => setSelectedPoForDetail(null)}
          title={`Purchase Order: ${selectedPoForDetail.poNumber}`}
          subtitle={`Issued to: ${selectedPoForDetail.vendorName} • Delivery Date: ${formatDate(selectedPoForDetail.deliveryDate)}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 pt-1">
            {/* Header / Meta box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Aakshya Group Purchase Order</span>
                <span className="font-mono text-base font-extrabold text-slate-900">{selectedPoForDetail.poNumber}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Issued on: {formatDateTime(selectedPoForDetail.issuedAt)}
                </div>
              </div>
              <StatusBadge status={selectedPoForDetail.status} size="md" />
            </div>

            {/* Vendor & Shipping Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Vendor Details</span>
                <p className="font-bold text-slate-900">{selectedPoForDetail.vendorName}</p>
                <p className="text-slate-500">ID: {selectedPoForDetail.vendorId}</p>
                <p className="text-slate-600 mt-2 text-[11px]">Payment Terms: <strong className="text-slate-800">{selectedPoForDetail.paymentTerms}</strong></p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Shipping & Delivery Destination</span>
                <p className="text-slate-800 leading-relaxed text-[11px]">{selectedPoForDetail.shippingAddress}</p>
                <p className="text-slate-500 text-[10px] pt-1">Expected Delivery: <strong className="text-slate-800">{formatDate(selectedPoForDetail.deliveryDate)}</strong></p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Item & Description</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Unit Rate</th>
                    <th className="px-4 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedPoForDetail.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-800">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-xs">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-slate-600">Subtotal:</td>
                    <td className="px-4 py-2 text-right font-mono">{formatCurrency(selectedPoForDetail.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-slate-600">GST ({selectedPoForDetail.taxRate}%):</td>
                    <td className="px-4 py-2 text-right font-mono text-slate-700">{formatCurrency(selectedPoForDetail.taxAmount)}</td>
                  </tr>
                  <tr className="border-t border-slate-300 text-sm font-extrabold text-slate-900 bg-brand-50/50">
                    <td colSpan={3} className="px-4 py-2.5 text-right text-brand-900">Total Purchase Order Value:</td>
                    <td className="px-4 py-2.5 text-right font-mono text-brand-900">{formatCurrency(selectedPoForDetail.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Clarification Thread if any */}
            {selectedPoForDetail.clarifications?.length > 0 && (
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  Clarifications & Messages
                </h4>
                <div className="space-y-2">
                  {selectedPoForDetail.clarifications.map((c, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-xl border border-amber-200 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-bold text-slate-800">{c.sender}</span>
                        <span>{formatDateTime(c.timestamp)}</span>
                      </div>
                      <p className="text-slate-700">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              {isVendor && selectedPoForDetail.status === 'Issued' && (
                <>
                  <button
                    onClick={() => {
                      acceptPurchaseOrder(selectedPoForDetail.id);
                      setSelectedPoForDetail(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Purchase Order</span>
                  </button>

                  <button
                    onClick={() => {
                      setClarificationModalPo(selectedPoForDetail);
                      setSelectedPoForDetail(null);
                    }}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Raise Query / Clarification</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Clarification Dialog */}
      {clarificationModalPo && (
        <Modal
          isOpen={!!clarificationModalPo}
          onClose={() => setClarificationModalPo(null)}
          title={`Raise Clarification on PO: ${clarificationModalPo.poNumber}`}
          subtitle="Send direct communication between Vendor and Aakshya Procurement"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSendClarification} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Query or Technical Clarification <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={clarificationText}
                onChange={e => setClarificationText(e.target.value)}
                placeholder="e.g. Kindly confirm power supply connector rating or gate entry delivery window..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setClarificationModalPo(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Clarification</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
