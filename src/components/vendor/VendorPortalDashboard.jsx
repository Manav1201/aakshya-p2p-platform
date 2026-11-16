import React from 'react';
import {
  Building2,
  FileText,
  ShoppingCart,
  Truck,
  PackageCheck,
  Receipt,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Send,
  Eye
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const VendorPortalDashboard = ({ onNavigateTab, onOpenRegistration }) => {
  const {
    vendors,
    rfps,
    pos,
    dispatches,
    grns,
    invoices,
    payments
  } = useP2P();

  const { activeVendorId } = useAuthRole();

  // Find active vendor record (e.g. Apex Industrial Solutions)
  const currentVendor = (vendors && vendors.find(v => v.id === activeVendorId)) || (vendors && vendors[0]) || {
    id: 'VND-001',
    name: 'Apex Industrial Solutions Pvt Ltd',
    category: 'Heavy Machinery & Spares',
    status: 'Onboarded',
    companyDetails: { gstin: '27AABCA1234F1Z5' },
    complianceScore: 98
  };

  // Specific vendor metrics
  const activeRfps = rfps.filter(r => r.status === 'Open for Bidding');
  const mySubmittedQuotes = rfps.flatMap(r => r.responses?.filter(resp => resp.vendorId === currentVendor.id) || []);
  const myPos = pos.filter(p => p.vendorId === currentVendor.id);
  const openPos = myPos.filter(p => p.status === 'Issued');
  const acceptedPos = myPos.filter(p => p.status === 'Accepted');
  const myDispatches = dispatches.filter(d => d.vendorId === currentVendor.id);
  const approvedGrns = grns.filter(g => g.vendorId === currentVendor.id && g.status === 'GRN Approved');
  const myInvoices = invoices.filter(i => i.vendorId === currentVendor.id);
  const myPayments = payments.filter(p => p.vendorId === currentVendor.id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Vendor Profile & Onboarding Status Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-brand-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Vendor Self-Service Portal
            </span>
            <StatusBadge status={currentVendor.status} size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentVendor.name}
          </h1>
          <p className="text-xs text-slate-300 flex items-center gap-2">
            <span>Category: {currentVendor.category}</span>
            <span>•</span>
            <span>GSTIN: {currentVendor.companyDetails?.gstin || '27AABCA1234F1Z5'}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Compliance Score: {currentVendor.complianceScore || 98}%</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentVendor.status === 'Correction Requested' && (
            <button
              onClick={() => onOpenRegistration(currentVendor.id)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md animate-pulse flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Update Requested Corrections</span>
            </button>
          )}

          <button
            onClick={() => onOpenRegistration(currentVendor.id)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition"
          >
            Manage Company Profile
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('vendor_rfp')}
          className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 text-left hover:border-blue-400 transition"
        >
          <p className="text-xs font-medium text-blue-900">Active RFPs / Tenders</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">{activeRfps.length}</p>
          <span className="text-[10px] text-blue-600">Open for quoting</span>
        </button>

        <button
          onClick={() => onNavigateTab('vendor_pos')}
          className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 text-left hover:border-purple-400 transition"
        >
          <p className="text-xs font-medium text-purple-900">Purchase Orders</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">{myPos.length}</p>
          <span className="text-[10px] text-purple-600">{openPos.length} require acceptance</span>
        </button>

        <button
          onClick={() => onNavigateTab('vendor_invoices')}
          className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 text-left hover:border-emerald-400 transition"
        >
          <p className="text-xs font-medium text-emerald-900">Approved GRNs</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{approvedGrns.length}</p>
          <span className="text-[10px] text-emerald-600">Ready for Invoicing</span>
        </button>

        <button
          onClick={() => onNavigateTab('vendor_payments')}
          className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 text-left hover:border-indigo-400 transition"
        >
          <p className="text-xs font-medium text-indigo-900">Payments Disbursed</p>
          <p className="text-xl font-extrabold text-indigo-700 mt-1">
            {formatCurrency(myPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0))}
          </p>
          <span className="text-[10px] text-indigo-600">Remittance history</span>
        </button>
      </div>

      {/* 2 Column Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Open Action Items (POs requiring acceptance, RFPs) */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-600" />
                Purchase Orders Requiring Acknowledgement
              </h3>
              <span className="text-xs font-bold text-brand-600">{openPos.length} Pending</span>
            </div>

            {openPos.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No pending POs waiting for acceptance.</p>
            ) : (
              <div className="space-y-2">
                {openPos.map(po => (
                  <div key={po.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{po.poNumber} - {po.items[0]?.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{formatCurrency(po.totalAmount)}</p>
                    </div>
                    <button
                      onClick={() => onNavigateTab('vendor_pos')}
                      className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-xs shadow-sm"
                    >
                      Accept PO
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved GRNs Ready for Invoicing */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                Approved GRNs (Invoice Submission Unlocked)
              </h3>
              <span className="text-xs font-bold text-emerald-700">{approvedGrns.length} Verified</span>
            </div>

            {approvedGrns.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No approved GRNs pending invoice.</p>
            ) : (
              <div className="space-y-2">
                {approvedGrns.map(grn => (
                  <div key={grn.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{grn.grnNumber} (PO: {grn.poNumber})</p>
                      <p className="text-[11px] text-slate-500">Accepted: {grn.quantityAccepted} Units • Passed QC</p>
                    </div>
                    <button
                      onClick={() => onNavigateTab('vendor_invoices')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Submit Invoice</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dispatch & Payment History */}
        <div className="space-y-4">
          {/* Dispatch Status */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                Active Dispatch & Consignment Tracking
              </h3>
              <button
                onClick={() => onNavigateTab('vendor_dispatch')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myDispatches.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No dispatches created yet.</p>
            ) : (
              <div className="space-y-2">
                {myDispatches.map(dsp => (
                  <div key={dsp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{dsp.dispatchNumber} (PO: {dsp.poNumber})</p>
                      <p className="text-[10px] text-slate-500">Carrier: {dsp.transporter} • AWB: {dsp.trackingNumber}</p>
                    </div>
                    <StatusBadge status={dsp.status} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Remittance & Receipt Acknowledgement */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Payment Remittances & Acknowledgements
              </h3>
              <button
                onClick={() => onNavigateTab('vendor_payments')}
                className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
              >
                <span>History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myPayments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No remittances recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {myPayments.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{p.paymentNumber} (Inv: {p.invoiceNumber})</p>
                      <p className="font-mono text-emerald-700 font-bold">{formatCurrency(p.amount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} size="xs" />
                      {p.status === 'Paid' && !p.vendorAcknowledged && (
                        <button
                          onClick={() => onNavigateTab('vendor_payments')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
