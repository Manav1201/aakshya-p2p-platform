import React from 'react';
import {
  PackageCheck,
  Truck,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const StoresDashboard = ({ onNavigateTab, onCreateGrn }) => {
  const { dispatches, grns, pos } = useP2P();

  const inTransit = dispatches.filter(d => d.status === 'In Transit');
  const delivered = dispatches.filter(d => d.status === 'Delivered');
  const approvedGrns = grns.filter(g => g.status === 'GRN Approved');
  const rejectedGrns = grns.filter(g => g.status === 'Return Initiated');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Stores Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            Aakshya Central Stores & Quality Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Material Receiving & QA Inspection Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Managing physical inbound shipments, gate entry verification, QA/QC testing and Goods Receipt Note (GRN) generation.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('grn')}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/30 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New GRN Inspection</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-sm">
          <p className="text-xs font-medium text-indigo-900">Shipments In Transit</p>
          <p className="text-xl font-extrabold text-indigo-700 mt-1">{inTransit.length}</p>
          <span className="text-[10px] text-indigo-600">En route to plant</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-900">Delivered (At Gate)</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{delivered.length}</p>
          <span className="text-[10px] text-emerald-600">Pending GRN creation</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-900">Approved GRNs</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">{approvedGrns.length}</p>
          <span className="text-[10px] text-blue-600">Quality passed</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
          <p className="text-xs font-medium text-rose-900">Material Quarantined</p>
          <p className="text-xl font-extrabold text-rose-700 mt-1">{rejectedGrns.length}</p>
          <span className="text-[10px] text-rose-600">Return initiated</span>
        </div>
      </div>

      {/* Inbound Pipeline & Recent GRNs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbound Consignments */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              Inbound Consignments Pipeline
            </h3>
            <button
              onClick={() => onNavigateTab('dispatch')}
              className="text-xs text-brand-600 font-semibold"
            >
              View Dispatch
            </button>
          </div>

          <div className="space-y-2.5">
            {dispatches.map(dsp => (
              <div key={dsp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{dsp.dispatchNumber} (PO: {dsp.poNumber})</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">AWB: {dsp.trackingNumber} • {dsp.transporter}</p>
                  <p className="text-[10px] text-slate-400">ETA: {formatDate(dsp.expectedDeliveryDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={dsp.status} size="xs" />
                  {dsp.status === 'Delivered' && (
                    <button
                      onClick={() => onNavigateTab('grn')}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Inspect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Inspection Log */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              Recent GRN QA Inspection Outcomes
            </h3>
            <button
              onClick={() => onNavigateTab('grn')}
              className="text-xs text-brand-600 font-semibold"
            >
              All GRNs
            </button>
          </div>

          <div className="space-y-2.5">
            {grns.map(g => (
              <div key={g.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{g.grnNumber} (PO: {g.poNumber})</p>
                  <p className="text-[11px] text-slate-500">Accepted: {g.quantityAccepted} / {g.quantityReceived} Units</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{g.inspectionRemarks}</p>
                </div>
                <StatusBadge status={g.status} size="xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
