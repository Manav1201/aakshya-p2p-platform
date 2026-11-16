import React, { useState } from 'react';
import {
  ArrowRight,
  UserCheck,
  FileSpreadsheet,
  FileText,
  ShoppingCart,
  Truck,
  PackageCheck,
  Receipt,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useAuthRole } from '../../context/AuthRoleContext';

export const P2P_STAGES = [
  { id: 'vendors', label: '1. Vendor Onboarding', icon: UserCheck, role: 'PROCUREMENT', roleName: 'Procurement Admin', tab: 'vendors' },
  { id: 'indents', label: '2. Purchase Indent', icon: FileSpreadsheet, role: 'HOD', roleName: 'HOD & Finance', tab: 'indents' },
  { id: 'rfp', label: '3. RFP / RFQ', icon: FileText, role: 'PROCUREMENT', roleName: 'Procurement & Vendors', tab: 'rfp' },
  { id: 'pos', label: '4. Purchase Order', icon: ShoppingCart, role: 'VENDOR', roleName: 'Procurement & Vendor', tab: 'pos' },
  { id: 'dispatch', label: '5. Dispatch Tracking', icon: Truck, role: 'VENDOR', roleName: 'Vendor Updates', tab: 'dispatch' },
  { id: 'grn', label: '6. GRN & Quality', icon: PackageCheck, role: 'STORES', roleName: 'Stores Inspection', tab: 'grn' },
  { id: 'invoices', label: '7. Invoice (3-Way)', icon: Receipt, role: 'FINANCE', roleName: 'Vendor & Finance', tab: 'invoices' },
  { id: 'payments', label: '8. Payment Process', icon: CreditCard, role: 'FINANCE', roleName: 'Finance Treasury', tab: 'payments' },
];

export const GuidedTourBanner = ({ activeTab, onSelectTab }) => {
  const { currentRole, switchRole } = useAuthRole();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                End-to-End P2P Workflow Guide
              </span>
              <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
                Click any stage to navigate. Active role: <strong className="text-white">{currentRole.title}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-medium transition"
          >
            <span>{collapsed ? 'Show Stages' : 'Collapse'}</span>
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {P2P_STAGES.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isActive = activeTab === stage.tab;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    onSelectTab(stage.tab);
                  }}
                  className={`flex flex-col p-2 rounded-xl text-left border transition-all ${
                    isActive
                      ? 'bg-brand-600/30 border-brand-400 text-white shadow-sm ring-1 ring-brand-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <StageIcon className={`w-4 h-4 ${isActive ? 'text-brand-300' : 'text-slate-400'}`} />
                    <span className="text-[10px] text-indigo-300 font-mono">0{idx + 1}</span>
                  </div>
                  <span className="text-xs font-bold line-clamp-1">{stage.label.replace(/^\d+\.\s*/, '')}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{stage.roleName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
