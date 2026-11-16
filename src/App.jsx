import React, { useState } from 'react';
import { AuthRoleProvider, useAuthRole } from './context/AuthRoleContext';
import { P2PProvider, useP2P } from './context/P2PContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { GuidedTourBanner } from './components/common/GuidedTourBanner';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { VendorRegistrationModal } from './components/vendor/VendorRegistrationModal';

// Views
import { ProcurementDashboard } from './components/procurement/ProcurementDashboard';
import { VendorManagement } from './components/procurement/VendorManagement';
import { PurchaseIndentList } from './components/procurement/PurchaseIndentList';
import { RfpManagement } from './components/procurement/RfpManagement';
import { PurchaseOrderList } from './components/procurement/PurchaseOrderList';
import { DispatchTrackingView } from './components/stores/DispatchTrackingView';
import { GoodsReceiptList } from './components/stores/GoodsReceiptList';
import { InvoiceReviewList } from './components/finance/InvoiceReviewList';
import { PaymentProcessing } from './components/finance/PaymentProcessing';
import { FinanceDashboard } from './components/finance/FinanceDashboard';
import { StoresDashboard } from './components/stores/StoresDashboard';
import { VendorPortalDashboard } from './components/vendor/VendorPortalDashboard';
import { VendorRfpBids } from './components/vendor/VendorRfpBids';
import { AnalyticsView } from './components/analytics/AnalyticsView';

function MainApp() {
  const { currentRole, isVendor } = useAuthRole();
  const { createPurchaseOrderFromRfp } = useP2P();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState(isVendor ? 'vendor_dashboard' : 'dashboard');

  // Modals & Drawers
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [vendorRegisterModalOpen, setVendorRegisterModalOpen] = useState(false);
  const [registerToken, setRegisterToken] = useState(null);
  const [registerVendorId, setRegisterVendorId] = useState(null);

  // Workflow Handover States between modules
  const [preselectedPiForRfp, setPreselectedPiForRfp] = useState(null);
  const [preselectedDispatchForGrn, setPreselectedDispatchForGrn] = useState(null);
  const [preselectedGrnForInvoice, setPreselectedGrnForInvoice] = useState(null);
  const [highlightPaymentId, setHighlightPaymentId] = useState(null);

  // Switch tab automatically when role changes if appropriate
  React.useEffect(() => {
    if (isVendor && !activeTab.startsWith('vendor_')) {
      setActiveTab('vendor_dashboard');
    } else if (!isVendor && activeTab.startsWith('vendor_')) {
      if (currentRole?.id === 'finance') setActiveTab('finance_dashboard');
      else if (currentRole?.id === 'stores') setActiveTab('stores_dashboard');
      else setActiveTab('dashboard');
    }
  }, [currentRole?.id, isVendor]);

  // Workflow link actions
  const handleConvertToRfp = (pi) => {
    setPreselectedPiForRfp(pi);
    setActiveTab('rfp');
  };

  const handleGeneratePo = (rfpId) => {
    const newPo = createPurchaseOrderFromRfp(rfpId);
    if (newPo) {
      setActiveTab('pos');
    }
  };

  const handleCreateGrnFromDispatch = (dispatch) => {
    setPreselectedDispatchForGrn(dispatch);
    setActiveTab('grn');
  };

  const handleGenerateInvoiceFromGrn = (grn) => {
    setPreselectedGrnForInvoice(grn);
    if (isVendor) {
      setActiveTab('vendor_invoices');
    } else {
      setActiveTab('invoices');
    }
  };

  const handleNavigatePayments = (paymentId) => {
    setHighlightPaymentId(paymentId);
    setActiveTab('payments');
  };

  const handleOpenRegistrationModal = (tokenOrId) => {
    if (tokenOrId?.startsWith('INV-')) {
      setRegisterToken(tokenOrId);
      setRegisterVendorId(null);
    } else {
      setRegisterVendorId(tokenOrId);
      setRegisterToken(null);
    }
    setVendorRegisterModalOpen(true);
  };

  // Render main screen component based on active tab
  const renderContent = () => {
    switch (activeTab) {
      // Procurement & General views
      case 'dashboard':
        return <ProcurementDashboard onNavigateTab={setActiveTab} />;
      case 'vendors':
        return <VendorManagement onOpenVendorRegister={handleOpenRegistrationModal} />;
      case 'indents':
        return <PurchaseIndentList onConvertToRfp={handleConvertToRfp} />;
      case 'rfp':
        return (
          <RfpManagement
            preselectedPi={preselectedPiForRfp}
            onClearPreselectedPi={() => setPreselectedPiForRfp(null)}
            onGeneratePo={handleGeneratePo}
          />
        );
      case 'pos':
        return <PurchaseOrderList onNavigateDispatch={() => setActiveTab('dispatch')} />;
      case 'dispatch':
        return <DispatchTrackingView onCreateGrnFromDispatch={handleCreateGrnFromDispatch} />;
      case 'grn':
        return (
          <GoodsReceiptList
            preselectedDispatch={preselectedDispatchForGrn}
            onClearPreselectedDispatch={() => setPreselectedDispatchForGrn(null)}
            onGenerateInvoice={handleGenerateInvoiceFromGrn}
          />
        );
      case 'invoices':
        return (
          <InvoiceReviewList
            preselectedGrn={preselectedGrnForInvoice}
            onClearPreselectedGrn={() => setPreselectedGrnForInvoice(null)}
            onNavigatePayments={handleNavigatePayments}
          />
        );
      case 'payments':
        return <PaymentProcessing highlightPaymentId={highlightPaymentId} />;
      case 'finance_dashboard':
        return <FinanceDashboard onNavigateTab={setActiveTab} />;
      case 'stores_dashboard':
        return <StoresDashboard onNavigateTab={setActiveTab} onCreateGrn={() => setActiveTab('grn')} />;
      case 'analytics':
        return <AnalyticsView />;

      // Vendor Portal views
      case 'vendor_dashboard':
        return (
          <VendorPortalDashboard
            onNavigateTab={setActiveTab}
            onOpenRegistration={handleOpenRegistrationModal}
          />
        );
      case 'vendor_profile':
        return (
          <div className="p-6 max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Vendor Profile & Compliance Vault</h1>
            <p className="text-xs text-slate-500">View and update corporate registrations, GSTIN, PAN, bank account and certificates.</p>
            <button
              onClick={() => handleOpenRegistrationModal(currentRole.id === 'vendor' ? 'VND-001' : null)}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Open Full Registration Form & Documents
            </button>
          </div>
        );
      case 'vendor_rfp':
        return <VendorRfpBids />;
      case 'vendor_pos':
        return <PurchaseOrderList onNavigateDispatch={() => setActiveTab('vendor_dispatch')} />;
      case 'vendor_dispatch':
        return <DispatchTrackingView />;
      case 'vendor_invoices':
        return (
          <InvoiceReviewList
            preselectedGrn={preselectedGrnForInvoice}
            onClearPreselectedGrn={() => setPreselectedGrnForInvoice(null)}
            onNavigatePayments={handleNavigatePayments}
          />
        );
      case 'vendor_payments':
        return <PaymentProcessing highlightPaymentId={highlightPaymentId} />;

      default:
        return <ProcurementDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        onOpenVendorModal={() => handleOpenRegistrationModal(null)}
      />

      {/* Guided 8-Step Lifecycle Banner */}
      <GuidedTourBanner
        activeTab={activeTab}
        onSelectTab={(tabKey) => {
          if (isVendor) {
            // Map common tab keys to vendor view equivalent
            const vendorMap = {
              rfp: 'vendor_rfp',
              pos: 'vendor_pos',
              dispatch: 'vendor_dispatch',
              invoices: 'vendor_invoices',
              payments: 'vendor_payments',
              vendors: 'vendor_profile',
              indents: 'vendor_rfp'
            };
            setActiveTab(vendorMap[tabKey] || tabKey);
          } else {
            setActiveTab(tabKey);
          }
        }}
      />

      {/* Main Layout: Sidebar + Dynamic View Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Slide-over Notification & Email Center */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigateTab={setActiveTab}
        onOpenVendorRegister={handleOpenRegistrationModal}
      />

      {/* Self-Service Vendor Registration & Document Upload Modal */}
      <VendorRegistrationModal
        isOpen={vendorRegisterModalOpen}
        onClose={() => {
          setVendorRegisterModalOpen(false);
          setRegisterToken(null);
          setRegisterVendorId(null);
        }}
        initialToken={registerToken}
        vendorId={registerVendorId}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthRoleProvider>
      <P2PProvider>
        <MainApp />
      </P2PProvider>
    </AuthRoleProvider>
  );
}
