import React from 'react';
import {
  Users,
  FileSpreadsheet,
  FileText,
  ShoppingCart,
  Truck,
  PackageCheck,
  Receipt,
  CreditCard,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  Building2,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ProcurementDashboard = ({ onNavigateTab }) => {
  const {
    vendors,
    indents,
    rfps,
    pos,
    dispatches,
    grns,
    invoices,
    payments
  } = useP2P();

  const { currentRole } = useAuthRole();

  // Metrics
  const totalVendors = vendors.length;
  const pendingVendorApprovals = vendors.filter(v => v.status === 'Submitted for Approval').length;
  const activeVendors = vendors.filter(v => v.status === 'Onboarded').length;
  const pendingPiApprovals = indents.filter(i => i.status === 'Pending HOD' || i.status === 'Pending Finance').length;
  const openRfps = rfps.filter(r => r.status === 'Open for Bidding').length;
  const quotationsReceived = rfps.reduce((sum, r) => sum + (r.responses?.length || 0), 0);
  const activePos = pos.filter(p => p.status === 'Accepted' || p.status === 'Issued').length;
  const dispatchInProgress = dispatches.filter(d => d.status === 'In Transit' || d.status === 'Dispatched').length;
  const pendingGrns = grns.filter(g => g.status === 'GRN Approved' && !g.invoiceCreated).length;
  const pendingInvoices = invoices.filter(i => i.status === 'Submitted' || i.status === 'Under Review').length;
  const pendingPayments = payments.filter(p => p.status === 'Scheduled').length;

  const totalProcurementSpend = pos.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  // Category Spend breakdown
  const categorySpend = [
    { name: 'Heavy Machinery & Spares', amount: 5015000, pct: 58 },
    { name: 'IT Infrastructure & Hardware', amount: 1711000, pct: 20 },
    { name: 'Logistics & Supply Chain', amount: 1240000, pct: 14 },
    { name: 'Plant Safety & EHS', amount: 420000, pct: 5 },
    { name: 'Others', amount: 250000, pct: 3 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
                Aakshya Group Procurement Command
              </span>
              <span className="text-xs text-slate-400">• Operational Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Procure-to-Pay Lifecycle Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoring 8 stages of procurement operations: vendor onboarding, requisitions, competitive bidding, purchase commitments, delivery tracking, and automated 3-way match.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onNavigateTab('vendors')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition backdrop-blur-sm"
            >
              Vendor Master
            </button>
            <button
              onClick={() => onNavigateTab('indents')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white shadow-md shadow-brand-500/30 transition"
            >
              Raise Indent
            </button>
          </div>
        </div>
      </div>

      {/* 11 Metric Operational Status Matrix */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          Real-Time Operational Pipeline (11 Key Indicators)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Total Vendors */}
          <button
            onClick={() => onNavigateTab('vendors')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Total Vendors</span>
              <Users className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{totalVendors}</p>
            <span className="text-[10px] text-slate-400">Registered</span>
          </button>

          {/* Card 2: Pending Approvals */}
          <button
            onClick={() => onNavigateTab('vendors')}
            className="p-3.5 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 hover:border-purple-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-900">Pending Approvals</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-extrabold text-purple-700 mt-1">{pendingVendorApprovals}</p>
            <span className="text-[10px] text-purple-600">Vendor review</span>
          </button>

          {/* Card 3: Active Vendors */}
          <button
            onClick={() => onNavigateTab('vendors')}
            className="p-3.5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-900">Active Vendors</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">{activeVendors}</p>
            <span className="text-[10px] text-emerald-600">Onboarded</span>
          </button>

          {/* Card 4: Pending PI Approvals */}
          <button
            onClick={() => onNavigateTab('indents')}
            className="p-3.5 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 hover:border-amber-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-900">Pending PI Sign-offs</span>
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-extrabold text-amber-700 mt-1">{pendingPiApprovals}</p>
            <span className="text-[10px] text-amber-600">HOD / Finance</span>
          </button>

          {/* Card 5: Open RFPs */}
          <button
            onClick={() => onNavigateTab('rfp')}
            className="p-3.5 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 hover:border-blue-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-900">Open RFPs</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-extrabold text-blue-700 mt-1">{openRfps}</p>
            <span className="text-[10px] text-blue-600">Active tender</span>
          </button>

          {/* Card 6: Quotations Received */}
          <button
            onClick={() => onNavigateTab('rfp')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Quotes Received</span>
              <Award className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{quotationsReceived}</p>
            <span className="text-[10px] text-slate-400">Bids submitted</span>
          </button>
        </div>

        {/* Second Row of 5 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
          {/* Card 7: Active POs */}
          <button
            onClick={() => onNavigateTab('pos')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Active POs</span>
              <ShoppingCart className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{activePos}</p>
            <span className="text-[10px] text-slate-400">Commitments</span>
          </button>

          {/* Card 8: Dispatch in Progress */}
          <button
            onClick={() => onNavigateTab('dispatch')}
            className="p-3.5 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 hover:border-indigo-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-900">In Transit</span>
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xl font-extrabold text-indigo-700 mt-1">{dispatchInProgress}</p>
            <span className="text-[10px] text-indigo-600">Shipments moving</span>
          </button>

          {/* Card 9: Pending GRNs */}
          <button
            onClick={() => onNavigateTab('grn')}
            className="p-3.5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-900">Approved GRNs</span>
              <PackageCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">{pendingGrns}</p>
            <span className="text-[10px] text-emerald-600">Ready for invoice</span>
          </button>

          {/* Card 10: Pending Invoices */}
          <button
            onClick={() => onNavigateTab('invoices')}
            className="p-3.5 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 hover:border-purple-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-900">Pending Invoices</span>
              <Receipt className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-extrabold text-purple-700 mt-1">{pendingInvoices}</p>
            <span className="text-[10px] text-purple-600">3-Way review</span>
          </button>

          {/* Card 11: Pending Payments */}
          <button
            onClick={() => onNavigateTab('payments')}
            className="p-3.5 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 hover:border-blue-400 hover:shadow-md transition text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-900">Pending Payments</span>
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-extrabold text-blue-700 mt-1">{pendingPayments}</p>
            <span className="text-[10px] text-blue-600">Ready for UTR</span>
          </button>
        </div>
      </div>

      {/* Analytics Section: Spend Analytics & Vendor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Analytics Chart */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-600" />
                Procurement Spend Analytics by Category
              </h3>
              <p className="text-[11px] text-slate-500">Total Committed: {formatCurrency(totalProcurementSpend)}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              FY 2026-27
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {categorySpend.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <span className="font-mono text-slate-900 font-bold">{formatCurrency(cat.amount)} ({cat.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Performance Analytics */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                Vendor Performance & SLA Scorecards
              </h3>
              <p className="text-[11px] text-slate-500">Based on delivery lead time, quality passes & response rates</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {vendors.filter(v => v.status === 'Onboarded').map((v, i) => (
              <div key={v.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{v.name}</p>
                  <p className="text-[10px] text-slate-400">{v.category}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <span className="font-extrabold text-amber-600">★ {v.rating || 4.8} / 5.0</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Compliance</span>
                    <span className="font-extrabold text-emerald-700">{v.complianceScore || 95}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
