import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileText,
  ShoppingCart,
  Truck,
  PackageCheck,
  Receipt,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Building2,
  FileClock,
  Sparkles
} from 'lucide-react';
import { useAuthRole } from '../../context/AuthRoleContext';
import { useP2P } from '../../context/P2PContext';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const { currentRole, isVendor } = useAuthRole();
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

  // Calculate badge counters for actionable items
  const pendingVendorApprovals = vendors.filter(v => v.status === 'Submitted for Approval').length;
  const pendingHodIndents = indents.filter(i => i.status === 'Pending HOD').length;
  const pendingFinanceIndents = indents.filter(i => i.status === 'Pending Finance').length;
  const openRfpsCount = rfps.filter(r => r.status === 'Open for Bidding').length;
  const issuedPosCount = pos.filter(p => p.status === 'Issued').length;
  const pendingInvoiceReviews = invoices.filter(i => i.status === 'Submitted' || i.status === 'Under Review').length;
  const pendingPayments = payments.filter(p => p.status === 'Scheduled').length;
  const approvedGrnsCount = grns.filter(g => g.status === 'GRN Approved' && !g.invoiceCreated).length;

  const getMenuItems = () => {
    if (isVendor) {
      return [
        { id: 'vendor_dashboard', label: 'Vendor Dashboard', icon: LayoutDashboard },
        { id: 'vendor_profile', label: 'Company & Compliance', icon: ShieldCheck },
        { id: 'vendor_rfp', label: 'RFPs & Quotations', icon: FileText, badge: openRfpsCount },
        { id: 'vendor_pos', label: 'Purchase Orders', icon: ShoppingCart, badge: issuedPosCount },
        { id: 'vendor_dispatch', label: 'Dispatch Shipments', icon: Truck },
        { id: 'vendor_invoices', label: 'Submit Invoices', icon: Receipt, badge: approvedGrnsCount },
        { id: 'vendor_payments', label: 'Payment Remittance', icon: CreditCard },
      ];
    }

    if (currentRole.id === 'hod') {
      return [
        { id: 'dashboard', label: 'HOD Overview', icon: LayoutDashboard },
        { id: 'indents', label: 'Purchase Indents', icon: FileSpreadsheet, badge: pendingHodIndents },
        { id: 'rfp', label: 'Department RFPs', icon: FileText },
        { id: 'analytics', label: 'Department Spend', icon: BarChart3 },
      ];
    }

    if (currentRole.id === 'finance') {
      return [
        { id: 'finance_dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
        { id: 'indents', label: 'Capex Indents', icon: FileSpreadsheet, badge: pendingFinanceIndents },
        { id: 'invoices', label: '3-Way Match Invoices', icon: Receipt, badge: pendingInvoiceReviews },
        { id: 'payments', label: 'Payment Processing', icon: CreditCard, badge: pendingPayments },
        { id: 'analytics', label: 'Spend & Aging Analytics', icon: BarChart3 },
      ];
    }

    if (currentRole.id === 'stores') {
      return [
        { id: 'stores_dashboard', label: 'Stores Overview', icon: LayoutDashboard },
        { id: 'dispatch', label: 'In-Transit Shipments', icon: Truck },
        { id: 'grn', label: 'GRN & Quality Check', icon: PackageCheck },
        { id: 'pos', label: 'Purchase Orders View', icon: ShoppingCart },
      ];
    }

    // Default Procurement Admin
    return [
      { id: 'dashboard', label: 'Procurement Dashboard', icon: LayoutDashboard },
      { id: 'vendors', label: '1. Vendor Master', icon: Users, badge: pendingVendorApprovals },
      { id: 'indents', label: '2. Purchase Indents', icon: FileSpreadsheet, badge: pendingHodIndents + pendingFinanceIndents },
      { id: 'rfp', label: '3. RFP / RFQ & Bids', icon: FileText, badge: openRfpsCount },
      { id: 'pos', label: '4. Purchase Orders', icon: ShoppingCart, badge: issuedPosCount },
      { id: 'dispatch', label: '5. Dispatch Tracking', icon: Truck },
      { id: 'grn', label: '6. GRN & Inspection', icon: PackageCheck },
      { id: 'invoices', label: '7. Invoices Review', icon: Receipt, badge: pendingInvoiceReviews },
      { id: 'payments', label: '8. Payment Schedules', icon: CreditCard, badge: pendingPayments },
      { id: 'analytics', label: 'Spend & Vendor Analytics', icon: BarChart3 },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Banner inside sidebar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${currentRole.badgeColor}`}></div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {currentRole.title}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 truncate">
          {currentRole.department}
        </p>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map(item => {
          const ItemIcon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ItemIcon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-brand-600" />
          <span>Aakshya Group P2P v2.0</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400">
          ISO 9001:2015 & GST Compliant Procure-to-Pay Core
        </p>
      </div>
    </aside>
  );
};
