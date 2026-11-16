import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  FileCheck,
  Send,
  RotateCcw,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const STATUS_CONFIGS = {
  // Vendor Onboarding
  'Invitation Sent': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Send },
  'Registration In Progress': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  'Submitted for Approval': { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Clock },
  'Correction Requested': { bg: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertCircle },
  'Approved': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Onboarded': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold', icon: ShieldCheck },
  'Rejected': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },

  // Purchase Indents
  'Draft': { bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
  'Pending HOD': { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Clock },
  'Pending Finance': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },

  // RFP
  'Open for Bidding': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  'Awarded': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Selected': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Not Selected': { bg: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle },
  'Disqualified': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },

  // Purchase Order
  'Issued': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Send },
  'Accepted': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Clarification Raised': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },

  // Dispatch
  'Ready for Dispatch': { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: Clock },
  'Dispatched': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck },
  'In Transit': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  'Delivered': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },

  // GRN
  'GRN Approved': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold', icon: FileCheck },
  'Return Initiated': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: RotateCcw },
  'Replacement Awaited': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  'Passed': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Failed': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },

  // Invoices
  'Submitted': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  'Under Review': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  'Approved for Payment': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold', icon: CheckCircle2 },

  // Payments
  'Scheduled': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Clock },
  'Processed': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: CreditCard },
  'Paid': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold', icon: CheckCircle2 },

  // 3-Way Match
  'Matched': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Discrepancy': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle }
};

export const StatusBadge = ({ status, size = 'sm', showIcon = true }) => {
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock
  };
  const IconComponent = config.icon;

  const sizeClasses = size === 'xs'
    ? 'text-xs px-2 py-0.5'
    : size === 'md'
    ? 'text-sm px-3 py-1 font-medium'
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} transition-all`}
    >
      {showIcon && <IconComponent className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{status}</span>
    </span>
  );
};
