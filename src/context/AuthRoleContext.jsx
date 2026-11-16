import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthRoleContext = createContext();

export const ROLES = {
  PROCUREMENT: {
    id: 'procurement',
    title: 'Procurement Specialist',
    name: 'Anita Sharma',
    department: 'Central Procurement Desk',
    avatar: 'AS',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Manages vendor onboarding, RFPs, quotation evaluations & POs'
  },
  HOD: {
    id: 'hod',
    title: 'Operations HOD',
    name: 'Rajesh Patel',
    department: 'Manufacturing Operations',
    avatar: 'RP',
    badgeColor: 'bg-purple-600 text-white',
    description: 'Reviews and approves departmental Purchase Indents (PIs)'
  },
  FINANCE: {
    id: 'finance',
    title: 'Finance Manager',
    name: 'Priya Nair',
    department: 'Corporate Finance & Accounts',
    avatar: 'PN',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Approves PIs, reviews 3-way match invoices & executes payments'
  },
  STORES: {
    id: 'stores',
    title: 'Stores & Quality Lead',
    name: 'Vikram Singh',
    department: 'Central Warehouse & Quality',
    avatar: 'VS',
    badgeColor: 'bg-amber-600 text-white',
    description: 'Receives shipments, conducts inspections & generates GRNs'
  },
  VENDOR: {
    id: 'vendor',
    title: 'Vendor Representative',
    name: 'Arun Kumar Singhania',
    department: 'Apex Industrial Solutions Pvt Ltd',
    avatar: 'AK',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'Self-service vendor portal: bids, POs, dispatch, invoices & payments'
  }
};

export const AuthRoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('aakshya_active_role');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name && parsed.title) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading role from storage:', e);
    }
    return ROLES.PROCUREMENT;
  });

  const [activeVendorId, setActiveVendorId] = useState('VND-001');

  useEffect(() => {
    if (currentRole) {
      try {
        localStorage.setItem('aakshya_active_role', JSON.stringify(currentRole));
      } catch (e) {}
    }
  }, [currentRole]);

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setCurrentRole(ROLES[roleKey]);
    }
  };

  const safeRole = currentRole || ROLES.PROCUREMENT;
  const isVendor = safeRole.id === 'vendor';
  const isAakshyaStaff = !isVendor;

  return (
    <AuthRoleContext.Provider
      value={{
        currentRole: safeRole,
        switchRole,
        isVendor,
        isAakshyaStaff,
        activeVendorId,
        setActiveVendorId,
        allRoles: ROLES
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
};

export const useAuthRole = () => useContext(AuthRoleContext);
