import React, { useState } from 'react';
import {
  X,
  Bell,
  Mail,
  CheckCheck,
  ExternalLink,
  Clock,
  Send,
  Building2,
  FileCheck2,
  CreditCard
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { formatDateTime } from '../../utils/formatters';

export const NotificationDrawer = ({ isOpen, onClose, onNavigateTab, onOpenVendorRegister }) => {
  const {
    notifications,
    emails,
    markNotificationRead,
    markAllNotificationsRead
  } = useP2P();

  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' | 'emails'
  const [selectedEmail, setSelectedEmail] = useState(null);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleActionClick = (email) => {
    if (email.actionType === 'open_registration') {
      if (onOpenVendorRegister) {
        onOpenVendorRegister(email.token);
      }
      onClose();
    } else if (email.actionType === 'open_po') {
      if (onNavigateTab) onNavigateTab('pos');
      onClose();
    } else if (email.actionType === 'open_rfp') {
      if (onNavigateTab) onNavigateTab('rfp');
      onClose();
    } else if (email.actionType === 'open_payments') {
      if (onNavigateTab) onNavigateTab('payments');
      onClose();
    } else if (email.actionType === 'create_invoice') {
      if (onNavigateTab) onNavigateTab('invoices');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">Communication & Alert Center</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-white px-4 pt-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition ${
                activeTab === 'notifications'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>In-App Alerts</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition ${
                activeTab === 'emails'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Simulated Emails</span>
              <span className="bg-slate-200 text-slate-700 text-xs px-1.5 py-0.2 rounded-full font-medium">
                {emails.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'notifications' ? (
              <>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs text-slate-500">
                    Showing latest enterprise notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.actionRoute && onNavigateTab) {
                          onNavigateTab(notif.actionRoute);
                          onClose();
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        notif.read
                          ? 'bg-slate-50/60 border-slate-200 opacity-80'
                          : 'bg-white border-brand-200 shadow-sm ring-1 ring-brand-100'
                      } hover:border-brand-400`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                          )}
                          <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatDateTime(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.actionRoute && (
                        <div className="mt-2 flex justify-end">
                          <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1 hover:underline">
                            View Details <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                <div className="text-xs text-slate-500 pb-2">
                  Real-time transactional email dispatches across P2P lifecycle:
                </div>

                {emails.map(email => (
                  <div
                    key={email.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand-400 transition shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {email.category}
                      </span>
                      <span>{formatDateTime(email.timestamp)}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1">{email.subject}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">To: <span className="font-mono text-slate-700">{email.to}</span></p>

                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto border border-slate-100">
                      {email.body}
                    </div>

                    {email.actionType && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleActionClick(email)}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm"
                        >
                          {email.actionType === 'open_registration' && 'Open Vendor Registration Portal'}
                          {email.actionType === 'open_po' && 'View & Accept PO'}
                          {email.actionType === 'open_rfp' && 'View RFP Details'}
                          {email.actionType === 'open_payments' && 'View Remittance Advice'}
                          {email.actionType === 'create_invoice' && 'Generate Invoice'}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
