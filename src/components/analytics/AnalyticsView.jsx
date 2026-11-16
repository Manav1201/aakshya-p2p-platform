import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Award,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const AnalyticsView = () => {
  const { pos, vendors, invoices, payments } = useP2P();

  const totalCommitted = pos.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const deptSpend = [
    { name: 'Manufacturing Operations', amount: 5015000, pct: 62 },
    { name: 'IT Infrastructure & Security', amount: 1711000, pct: 21 },
    { name: 'Logistics & Warehousing', amount: 840000, pct: 10 },
    { name: 'Environmental Health & Safety', amount: 420000, pct: 5 },
    { name: 'Administration', amount: 180000, pct: 2 }
  ];

  const cycleTimeBenchmarks = [
    { stage: 'Vendor Onboarding & Approval', duration: '1.8 Days', target: '2.0 Days', status: 'Optimal' },
    { stage: 'Purchase Indent (PI) Multi-level Approval', duration: '2.4 Days', target: '3.0 Days', status: 'Optimal' },
    { stage: 'RFP Bidding & Evaluation Matrix', duration: '6.5 Days', target: '7.0 Days', status: 'Optimal' },
    { stage: 'PO Issuance to Vendor Acceptance', duration: '18 Hours', target: '24 Hours', status: 'Superior' },
    { stage: 'Shipment Dispatch to GRN Inspection', duration: '3.2 Days', target: '4.0 Days', status: 'Optimal' },
    { stage: '3-Way Match Verification to Payment Disburse', duration: '4.1 Days', target: '5.0 Days', status: 'Optimal' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Analytics Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-brand-600" />
          Procurement & Vendor Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Executive reporting across spend categories, departmental budgets, vendor compliance scorecards and P2P cycle velocity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Committed Spend</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalCommitted)}</p>
          <span className="text-[10px] text-slate-400">Total PO Value</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-900">Total Settled (Paid)</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{formatCurrency(totalPaid)}</p>
          <span className="text-[10px] text-emerald-600">Electronic UTR disbursed</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-900">Avg. P2P Cycle Time</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">17.8 Days</p>
          <span className="text-[10px] text-blue-600">Indent to payment</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-900">Avg Quality Pass Rate</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">96.4%</p>
          <span className="text-[10px] text-purple-600">Stores inspection QA</span>
        </div>
      </div>

      {/* Spend by Department & P2P Cycle Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Spend */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Spend Distribution by Business Unit
          </h3>

          <div className="space-y-3 pt-1">
            {deptSpend.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{d.name}</span>
                  <span className="font-mono text-slate-900 font-bold">{formatCurrency(d.amount)} ({d.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* P2P Cycle Time Benchmarks */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            End-to-End P2P Process Velocity Benchmarks
          </h3>

          <div className="space-y-2.5 pt-1">
            {cycleTimeBenchmarks.map((b, i) => (
              <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{b.stage}</p>
                  <p className="text-[10px] text-slate-400">Target SLA: {b.target}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono">{b.duration}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
