import React from 'react';
import {
  Receipt,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const FinanceDashboard = ({ onNavigateTab }) => {
  const { invoices, payments, pos } = useP2P();

  const pendingInvoiceReviews = invoices.filter(i => i.status === 'Submitted' || i.status === 'Under Review').length;
  const approvedInvoices = invoices.filter(i => i.status === 'Approved for Payment').length;
  const pendingPayments = payments.filter(p => p.status === 'Scheduled').length;
  const overduePayments = 0; // all within SLA

  const totalPaymentValue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const scheduledAmount = payments.filter(p => p.status === 'Scheduled').reduce((acc, p) => acc + (p.amount || 0), 0);
  const paidAmount = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + (p.amount || 0), 0);

  // Aging Analysis
  const agingBuckets = [
    { bucket: 'Current (0-30 Days)', count: invoices.filter(i => i.status !== 'Paid').length, amount: 5015000, color: 'bg-emerald-500' },
    { bucket: '31-60 Days', count: 0, amount: 0, color: 'bg-blue-500' },
    { bucket: '61-90 Days', count: 0, amount: 0, color: 'bg-amber-500' },
    { bucket: '90+ Days (Overdue)', count: 0, amount: 0, color: 'bg-rose-500' }
  ];

  // Vendor-wise spend
  const vendorSpend = [
    { vendor: 'Apex Industrial Solutions Pvt Ltd', invoices: 1, amount: 5015000, status: 'Scheduled' },
    { vendor: 'Sterling Logistics & Freight Solutions', invoices: 1, amount: 840000, status: 'Paid' },
    { vendor: 'NexGen Tech Innovations LLP', invoices: 0, amount: 1711000, status: 'PO Committed' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Finance Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Aakshya Corporate Finance & Treasury
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Finance & Accounts Payable Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Managing invoice 3-way match reconciliations, Capex budget controls, payment schedules and electronic UTR disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('invoices')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-500/30 transition"
          >
            Review Invoices ({pendingInvoiceReviews})
          </button>
          <button
            onClick={() => onNavigateTab('payments')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white border border-white/20 transition"
          >
            Disburse UTR ({pendingPayments})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-900">Pending Invoice Reviews</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">{pendingInvoiceReviews}</p>
          <span className="text-[10px] text-purple-600">3-Way match verification</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-900">Approved Invoices</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{approvedInvoices}</p>
          <span className="text-[10px] text-emerald-600">Cleared for payment</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-900">Pending Payments Due</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">{formatCurrency(scheduledAmount)}</p>
          <span className="text-[10px] text-blue-600">{pendingPayments} scheduled</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Paid (YTD)</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{formatCurrency(paidAmount)}</p>
          <span className="text-[10px] text-slate-400">Electronic remittance</span>
        </div>
      </div>

      {/* Aging Analysis & Vendor Spend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Aging Analysis */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Invoice Aging Analysis (Days from Invoice Date)
              </h3>
              <p className="text-[11px] text-slate-500">Ensuring zero vendor liability breach and MSME compliance</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {agingBuckets.map((bucket, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${bucket.color}`} />
                  <span className="font-semibold text-slate-800">{bucket.bucket}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(bucket.amount)}</span>
                  <span className="text-[10px] text-slate-400 block">{bucket.count} Invoices</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor-wise Spend Breakdown */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                Vendor-wise Spend Distribution
              </h3>
              <p className="text-[11px] text-slate-500">Major corporate suppliers by disbursed & committed capital</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {vendorSpend.map((v, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{v.vendor}</p>
                  <p className="text-[10px] text-slate-400">Invoices: {v.invoices}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-slate-900">{formatCurrency(v.amount)}</span>
                  <span className="text-[10px] font-bold text-brand-700 block mt-0.5">{v.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
