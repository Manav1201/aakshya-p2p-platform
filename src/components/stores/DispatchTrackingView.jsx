import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  FileCheck2,
  PackageCheck,
  ArrowRight
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const DispatchTrackingView = ({ onCreateGrnFromDispatch }) => {
  const {
    dispatches,
    pos,
    createDispatch,
    updateDispatchStatus
  } = useP2P();

  const { isVendor } = useAuthRole();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [newDispatchModalOpen, setNewDispatchModalOpen] = useState(false);
  const [selectedDispatchDetail, setSelectedDispatchDetail] = useState(null);

  // Accepted POs eligible for dispatch
  const acceptedPos = pos.filter(p => p.status === 'Accepted');

  // Form State
  const [formData, setFormData] = useState({
    poId: acceptedPos[0]?.id || '',
    dispatchDate: new Date().toISOString().split('T')[0],
    transporter: 'BlueDart Express Logistics',
    trackingNumber: '',
    vehicleNumber: '',
    packagesCount: 1,
    expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    shippingRemarks: 'Heavy machinery crated with anti-vibration damping.'
  });

  const handleCreateDispatchSubmit = (e) => {
    e.preventDefault();
    if (!formData.poId || !formData.trackingNumber || !formData.transporter) return;

    createDispatch(formData);
    setNewDispatchModalOpen(false);
  };

  const filteredDispatches = dispatches.filter(dsp => {
    const matchesSearch =
      dsp.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsp.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsp.transporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsp.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsp.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || dsp.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-brand-600" />
            Dispatch & Shipment Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time logistics monitoring, carrier waybill tracking, vehicle info & seamless handover to Stores
          </p>
        </div>

        {isVendor && (
          <button
            onClick={() => setNewDispatchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Dispatch Challan</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Shipments</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{dispatches.length}</p>
          <span className="text-[10px] text-slate-400">All consignments</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-sm">
          <p className="text-xs font-medium text-indigo-800">In Transit</p>
          <p className="text-xl font-extrabold text-indigo-700 mt-1">
            {dispatches.filter(d => d.status === 'In Transit').length}
          </p>
          <span className="text-[10px] text-indigo-600">On the road</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Delivered to Plant</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {dispatches.filter(d => d.status === 'Delivered').length}
          </p>
          <span className="text-[10px] text-emerald-600">Ready for GRN inspection</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Ready for Dispatch</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">
            {dispatches.filter(d => d.status === 'Ready for Dispatch' || d.status === 'Dispatched').length}
          </p>
          <span className="text-[10px] text-blue-600">Packaging completed</span>
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
            placeholder="Search tracking no, transporter, vehicle or PO..."
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
            <option value="Ready for Dispatch">Ready for Dispatch</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Dispatch & PO Number</th>
                <th className="px-4 py-3.5">Carrier & Tracking No</th>
                <th className="px-4 py-3.5">Vehicle & Packages</th>
                <th className="px-4 py-3.5">Dispatch Date</th>
                <th className="px-4 py-3.5">Expected Delivery (ETA)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDispatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Truck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No dispatches found</p>
                  </td>
                </tr>
              ) : (
                filteredDispatches.map(dsp => (
                  <tr key={dsp.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                          {dsp.dispatchNumber}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">PO: {dsp.poNumber}</div>
                        <div className="text-[10px] text-slate-400">{dsp.vendorName}</div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">{dsp.transporter}</div>
                      <div className="font-mono text-[11px] text-brand-600 mt-0.5 font-bold">
                        AWB: {dsp.trackingNumber}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-mono font-semibold text-slate-700">{dsp.vehicleNumber || '—'}</div>
                      <div className="text-[11px] text-slate-500">{dsp.packagesCount} Package(s)</div>
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {formatDate(dsp.dispatchDate)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">{formatDate(dsp.expectedDeliveryDate)}</div>
                      <div className="text-[10px] text-slate-400">Plant Gate Entry</div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={dsp.status} />
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDispatchDetail(dsp)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
                        >
                          Tracker
                        </button>

                        {/* Progress status simulator */}
                        {dsp.status !== 'Delivered' && (
                          <button
                            onClick={() => {
                              const nextStatus = dsp.status === 'Dispatched' ? 'In Transit' : 'Delivered';
                              updateDispatchStatus(dsp.id, nextStatus);
                            }}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                            title="Simulate advance shipment"
                          >
                            Mark {dsp.status === 'Dispatched' ? 'In Transit' : 'Delivered'}
                          </button>
                        )}

                        {/* If Delivered, Stores can create GRN directly */}
                        {dsp.status === 'Delivered' && onCreateGrnFromDispatch && (
                          <button
                            onClick={() => onCreateGrnFromDispatch(dsp)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Create GRN</span>
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

      {/* MODAL 1: Create Dispatch Challan Form */}
      <Modal
        isOpen={newDispatchModalOpen}
        onClose={() => setNewDispatchModalOpen(false)}
        title="Create Dispatch Challan & Shipment Notice"
        subtitle="Provide transporter logistics, AWB tracking and vehicle details against Accepted PO"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateDispatchSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Accepted Purchase Order <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.poId}
              onChange={e => setFormData({ ...formData, poId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              {acceptedPos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.poNumber} - {p.items[0]?.name} (Delivery: {formatDate(p.deliveryDate)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dispatch Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dispatchDate}
                onChange={e => setFormData({ ...formData, dispatchDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Delivery Date (ETA) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.expectedDeliveryDate}
                onChange={e => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transporter / Logistics Partner <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.transporter}
                onChange={e => setFormData({ ...formData, transporter: e.target.value })}
                placeholder="e.g. BlueDart Express Logistics"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tracking Number (AWB / Waybill) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.trackingNumber}
                onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })}
                placeholder="e.g. BD-IN-98432109"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. MH-14-GH-8821"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Packages
              </label>
              <input
                type="number"
                min={1}
                value={formData.packagesCount}
                onChange={e => setFormData({ ...formData, packagesCount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Packing Remarks & Handling Instructions
            </label>
            <textarea
              rows={2}
              value={formData.shippingRemarks}
              onChange={e => setFormData({ ...formData, shippingRemarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setNewDispatchModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Confirm Dispatch</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Shipment Timeline Tracker View */}
      {selectedDispatchDetail && (
        <Modal
          isOpen={!!selectedDispatchDetail}
          onClose={() => setSelectedDispatchDetail(null)}
          title={`Shipment Tracker: ${selectedDispatchDetail.dispatchNumber}`}
          subtitle={`PO: ${selectedDispatchDetail.poNumber} • Carrier: ${selectedDispatchDetail.transporter}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 pt-1">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Air Waybill (AWB)</span>
                <span className="font-mono text-base font-extrabold text-brand-700">{selectedDispatchDetail.trackingNumber}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Vehicle: <strong className="font-mono text-slate-800">{selectedDispatchDetail.vehicleNumber || 'Standard Carrier Fleet'}</strong>
                </p>
              </div>
              <StatusBadge status={selectedDispatchDetail.status} size="md" />
            </div>

            {/* Visual Milestones */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Shipment Milestones
              </h4>
              <div className="space-y-4 pl-2 border-l-2 border-brand-200 ml-2">
                {selectedDispatchDetail.statusTimeline?.map((t, i) => (
                  <div key={i} className="relative pl-4">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{t.status}</span>
                      <span className="text-[10px] text-slate-400">{formatDateTime(t.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <p className="font-semibold">Plant Gate Receipt:</p>
              <p className="text-[11px] text-blue-700">
                Delivery destination: Aakshya Group Central Plant, Chakan Phase 2, Pune.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
