import React, { useState } from 'react';
import {
  Building2,
  Users,
  Bell,
  Mail,
  RotateCcw,
  ChevronDown,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuthRole } from '../../context/AuthRoleContext';
import { useP2P } from '../../context/P2PContext';

export const Navbar = ({ onOpenNotifications, onOpenVendorModal }) => {
  const { currentRole, switchRole, allRoles, isVendor } = useAuthRole();
  const { notifications, emails, resetToDefault } = useP2P();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  AAKSHYA GROUP
                </span>
                <span className="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Enterprise P2P
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Procure-to-Pay & Vendor Collaboration Portal
              </p>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Reset Demo Data button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data across the 8 modules to default state?')) {
                  resetToDefault();
                }
              }}
              title="Reset sample enterprise data"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            {/* Email Outbox / Center */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="View Simulated Emails & Action Links"
            >
              <Mail className="w-5 h-5" />
              {emails.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {emails.length}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:border-brand-400 bg-slate-50/70 hover:bg-white transition text-left shadow-sm"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${currentRole.badgeColor} shadow-sm`}>
                  {currentRole.avatar}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{currentRole.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {currentRole.title}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-800">Switch Persona for Testing</p>
                      <p className="text-[11px] text-slate-500">
                        Experience role-specific workflows and approvals
                      </p>
                    </div>

                    <div className="py-1">
                      {Object.keys(allRoles).map(key => {
                        const role = allRoles[key];
                        const isActive = currentRole.id === role.id;
                        return (
                          <button
                            key={role.id}
                            onClick={() => {
                              switchRole(key);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition ${
                              isActive
                                ? 'bg-brand-50/70 text-brand-900 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs ${role.badgeColor}`}>
                              {role.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {role.name}
                                </span>
                                {isActive && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                              </div>
                              <p className="text-[11px] text-brand-700 font-medium">{role.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                                {role.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
