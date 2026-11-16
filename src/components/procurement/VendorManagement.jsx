import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Send,
  Building2,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useP2P } from '../../context/P2PContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const VendorManagement = ({ onOpenVendorRegister }) => {
  const {
    vendors,
    addVendorManually,
    sendVendorInvitation,
    approveVendor,
    requestVendorCorrection,
    rejectVendor
  } = useP2P();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals state
  const [addVendorTypeModalOpen, setAddVendorTypeModalOpen] = useState(false);
  const [manualAddModalOpen, setManualAddModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [selectedVendorForReview, setSelectedVendorForReview] = useState(null);
  const [viewDetailVendor, setViewDetailVendor] = useState(null);

  // Form states
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', category: 'Heavy Machinery & Spares' });
  const [manualForm, setManualForm] = useState({
    legalName: '',
    email: '',
    mobile: '',
    category: 'Heavy Machinery & Spares',
    gstin: '',
    pan: '',
    cin: '',
    msmeNumber: '',
    contactPerson: '',
    address: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [correctionNotes, setCorrectionNotes] = useState('');

  // Filtered vendors
  const filteredVendors = vendors.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Status counts
  const totalVendors = vendors.length;
  const onboardedCount = vendors.filter(v => v.status === 'Onboarded').length;
  const pendingApprovalCount = vendors.filter(v => v.status === 'Submitted for Approval').length;
  const correctionCount = vendors.filter(v => v.status === 'Correction Requested').length;
  const invitationCount = vendors.filter(v => v.status === 'Invitation Sent').length;

  // Handlers
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;
    sendVendorInvitation(inviteForm);
    setInviteForm({ name: '', email: '', category: 'Heavy Machinery & Spares' });
    setInviteModalOpen(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.legalName || !manualForm.email) return;

    addVendorManually({
      companyDetails: {
        legalName: manualForm.legalName,
        gstin: manualForm.gstin,
        pan: manualForm.pan,
        cin: manualForm.cin,
        msmeNumber: manualForm.msmeNumber,
        category: manualForm.category
      },
      contactDetails: {
        contactPerson: manualForm.contactPerson || manualForm.legalName,
        email: manualForm.email,
        mobile: manualForm.mobile,
        address: manualForm.address
      },
      bankDetails: {
        bankName: manualForm.bankName,
        accountNumber: manualForm.accountNumber,
        ifscCode: manualForm.ifscCode,
        accountHolderName: manualForm.accountHolderName || manualForm.legalName
      },
      documents: [
        { name: 'GST_Certificate.pdf', type: 'GST Certificate', status: 'Verified', uploadedAt: new Date().toISOString().split('T')[0] },
        { name: 'PAN_Card.pdf', type: 'PAN Card', status: 'Verified', uploadedAt: new Date().toISOString().split('T')[0] }
      ]
    });

    setManualAddModalOpen(false);
  };

  const handleApprove = (vendorId) => {
    approveVendor(vendorId);
    if (viewDetailVendor?.id === vendorId) {
      setViewDetailVendor(prev => ({ ...prev, status: 'Onboarded' }));
    }
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    if (!selectedVendorForReview || !correctionNotes) return;
    requestVendorCorrection(selectedVendorForReview.id, correctionNotes);
    setCorrectionNotes('');
    setCorrectionModalOpen(false);
    setSelectedVendorForReview(null);
    if (viewDetailVendor?.id === selectedVendorForReview.id) {
      setViewDetailVendor(prev => ({ ...prev, status: 'Correction Requested', correctionNotes }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Title and Add Vendor Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-600" />
            Vendor Onboarding & Master Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized supplier lifecycle from initial invitation to approved Vendor Master directory
          </p>
        </div>

        <button
          onClick={() => setAddVendorTypeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition transform active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Vendors</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{totalVendors}</p>
          <span className="text-[10px] text-slate-400">In database</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Onboarded (Active)</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{onboardedCount}</p>
          <span className="text-[10px] text-emerald-600">Eligible for RFPs & POs</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <p className="text-xs font-medium text-purple-800">Pending Approval</p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">{pendingApprovalCount}</p>
          <span className="text-[10px] text-purple-600">Awaiting Admin Review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-orange-200 bg-orange-50/20 shadow-sm">
          <p className="text-xs font-medium text-orange-800">Correction Requested</p>
          <p className="text-xl font-extrabold text-orange-700 mt-1">{correctionCount}</p>
          <span className="text-[10px] text-orange-600">Awaiting vendor updates</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <p className="text-xs font-medium text-blue-800">Invitations Sent</p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">{invitationCount}</p>
          <span className="text-[10px] text-blue-600">Link dispatched</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search vendor name, GSTIN, PAN or category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Onboarded">Onboarded</option>
            <option value="Submitted for Approval">Submitted for Approval</option>
            <option value="Correction Requested">Correction Requested</option>
            <option value="Invitation Sent">Invitation Sent</option>
            <option value="Registration In Progress">Registration In Progress</option>
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Heavy Machinery & Spares">Heavy Machinery & Spares</option>
            <option value="IT Hardware & Cloud Infrastructure">IT Hardware & Cloud</option>
            <option value="Logistics & Transportation">Logistics & Transportation</option>
            <option value="Raw Materials & Chemicals">Raw Materials</option>
            <option value="Electrical & Automation">Electrical & Automation</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Vendor Information</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Compliance (GST / PAN)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Onboarding Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No vendors found matching your filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {vendor.name ? vendor.name.slice(0, 2).toUpperCase() : 'VN'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{vendor.name}</span>
                            {vendor.status === 'Onboarded' && (
                              <span title="Verified Active Vendor">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>ID: {vendor.id}</span>
                            <span>•</span>
                            <span className="font-mono">{vendor.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-700 font-medium">
                      {vendor.category}
                    </td>

                    <td className="px-4 py-4">
                      {vendor.companyDetails?.gstin ? (
                        <div className="space-y-0.5">
                          <p className="font-mono text-[11px] text-slate-800">
                            GST: <span className="font-semibold">{vendor.companyDetails.gstin}</span>
                          </p>
                          <p className="font-mono text-[10px] text-slate-500">
                            PAN: {vendor.companyDetails.pan || '—'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not submitted yet</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={vendor.status} />
                    </td>

                    <td className="px-4 py-4 text-slate-500 text-[11px]">
                      <div>Created: {formatDate(vendor.dateCreated)}</div>
                      <div className="text-[10px] text-slate-400">Updated: {formatDate(vendor.lastUpdated)}</div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Master / Details Button */}
                        <button
                          onClick={() => setViewDetailVendor(vendor)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1 transition"
                          title="View Vendor Master Record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Master</span>
                        </button>

                        {/* Review actions if Submitted for Approval */}
                        {vendor.status === 'Submitted for Approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                              title="Approve & Onboard Vendor"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedVendorForReview(vendor);
                                setCorrectionModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center gap-1 transition"
                              title="Request Correction from Vendor"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Correction</span>
                            </button>
                          </>
                        )}

                        {/* If Invitation Sent, option to open registration for testing */}
                        {vendor.status === 'Invitation Sent' && (
                          <button
                            onClick={() => {
                              if (onOpenVendorRegister) onOpenVendorRegister(vendor.invitationToken);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-semibold text-xs flex items-center gap-1 transition"
                            title="Open Vendor Registration Form"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Register Link</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Choose Add Vendor Option (Option 1 vs Option 2) */}
      <Modal
        isOpen={addVendorTypeModalOpen}
        onClose={() => setAddVendorTypeModalOpen(false)}
        title="Add Vendor to Aakshya Platform"
        subtitle="Choose onboarding method: create manual master record or dispatch digital registration link"
        maxWidth="max-w-md"
      >
        <div className="space-y-3 pt-2">
          {/* Option 1: Add Vendor Manually */}
          <button
            onClick={() => {
              setAddVendorTypeModalOpen(false);
              setManualAddModalOpen(true);
            }}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition flex items-start gap-3.5 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                1. Add Vendor Manually
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Admin directly inputs all company details, GSTIN, PAN, bank info, and uploads documents to create an immediate Onboarded record.
              </p>
            </div>
          </button>

          {/* Option 2: Send Vendor Invitation */}
          <button
            onClick={() => {
              setAddVendorTypeModalOpen(false);
              setInviteModalOpen(true);
            }}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition flex items-start gap-3.5 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                2. Send Vendor Invitation
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Admin inputs Vendor Name, Email, and Category. The system generates an onboarding link with token and dispatches an invitation email.
              </p>
            </div>
          </button>
        </div>
      </Modal>

      {/* MODAL 2: Send Vendor Invitation (Option 2) */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Send Vendor Onboarding Invitation"
        subtitle="System will dispatch an email with self-registration link to the vendor"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={inviteForm.name}
              onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
              placeholder="e.g. Zenith Raw Materials & Chemicals Ltd"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor Official Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={inviteForm.email}
              onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="e.g. procurement@zenithchem.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={inviteForm.category}
              onChange={e => setInviteForm({ ...inviteForm, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white focus:outline-none"
            >
              <option value="Heavy Machinery & Spares">Heavy Machinery & Spares</option>
              <option value="IT Hardware & Cloud Infrastructure">IT Hardware & Cloud Infrastructure</option>
              <option value="Logistics & Transportation">Logistics & Transportation</option>
              <option value="Raw Materials & Chemicals">Raw Materials & Chemicals</option>
              <option value="Electrical & Automation">Electrical & Automation</option>
              <option value="Packaging & Consumables">Packaging & Consumables</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl text-blue-900 text-xs">
            <p className="font-semibold">Simulated Transactional Email Notice:</p>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Upon clicking "Send Invitation", an email with a secure registration token will be simulated and logged in the Communication Center.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invitation Email</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Manual Add Vendor Form (Option 1) */}
      <Modal
        isOpen={manualAddModalOpen}
        onClose={() => setManualAddModalOpen(false)}
        title="Add Vendor Record Manually (Admin)"
        subtitle="Direct creation of an approved vendor record in Vendor Master"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={manualForm.legalName}
                onChange={e => setManualForm({ ...manualForm, legalName: e.target.value })}
                placeholder="Apex Industrial Solutions Pvt Ltd"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor Category
              </label>
              <select
                value={manualForm.category}
                onChange={e => setManualForm({ ...manualForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="Heavy Machinery & Spares">Heavy Machinery & Spares</option>
                <option value="IT Hardware & Cloud Infrastructure">IT Hardware & Cloud</option>
                <option value="Logistics & Transportation">Logistics & Transportation</option>
                <option value="Raw Materials & Chemicals">Raw Materials & Chemicals</option>
                <option value="Electrical & Automation">Electrical & Automation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN (15 Alphanumeric)
              </label>
              <input
                type="text"
                maxLength={15}
                value={manualForm.gstin}
                onChange={e => setManualForm({ ...manualForm, gstin: e.target.value.toUpperCase() })}
                placeholder="27AABCA1234F1Z5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PAN
              </label>
              <input
                type="text"
                maxLength={10}
                value={manualForm.pan}
                onChange={e => setManualForm({ ...manualForm, pan: e.target.value.toUpperCase() })}
                placeholder="AABCA1234F"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={manualForm.contactPerson}
                onChange={e => setManualForm({ ...manualForm, contactPerson: e.target.value })}
                placeholder="Arun Singhania"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={manualForm.email}
                onChange={e => setManualForm({ ...manualForm, email: e.target.value })}
                placeholder="contact@company.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile
              </label>
              <input
                type="tel"
                value={manualForm.mobile}
                onChange={e => setManualForm({ ...manualForm, mobile: e.target.value })}
                placeholder="9820198201"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={manualForm.bankName}
                onChange={e => setManualForm({ ...manualForm, bankName: e.target.value })}
                placeholder="HDFC Bank"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={manualForm.accountNumber}
                onChange={e => setManualForm({ ...manualForm, accountNumber: e.target.value })}
                placeholder="50200034981290"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                maxLength={11}
                value={manualForm.ifscCode}
                onChange={e => setManualForm({ ...manualForm, ifscCode: e.target.value.toUpperCase() })}
                placeholder="HDFC0000240"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setManualAddModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Create Onboarded Vendor</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: Request Correction Notes Modal */}
      <Modal
        isOpen={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        title="Request Clarification / Correction from Vendor"
        subtitle={`Flag items requiring re-submission by ${selectedVendorForReview?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correction Notes & Instructions <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={correctionNotes}
              onChange={e => setCorrectionNotes(e.target.value)}
              placeholder="e.g. Please upload the latest MSME Udyam Registration Certificate and verify the registered office address..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setCorrectionModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Correction Notice</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: Vendor Master Record & Document Vault Drawer */}
      {viewDetailVendor && (
        <Modal
          isOpen={!!viewDetailVendor}
          onClose={() => setViewDetailVendor(null)}
          title={`Vendor Master Record: ${viewDetailVendor.name}`}
          subtitle={`Master ID: ${viewDetailVendor.id} • Registered Date: ${formatDate(viewDetailVendor.dateCreated)}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 pt-2">
            {/* Top Bar with Status and Action Buttons */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <StatusBadge status={viewDetailVendor.status} size="md" />
                <span className="text-xs text-slate-500">
                  Compliance Score: <strong className="text-slate-800">{viewDetailVendor.complianceScore || 90}%</strong>
                </span>
              </div>

              {viewDetailVendor.status === 'Submitted for Approval' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleApprove(viewDetailVendor.id);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Onboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVendorForReview(viewDetailVendor);
                      setCorrectionModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Request Correction</span>
                  </button>
                </div>
              )}
            </div>

            {/* Information Grid: Company, Contact, Bank */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Company Info */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-brand-700 border-b pb-2">
                  <Building2 className="w-4 h-4" />
                  Legal Entity Details
                </h4>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Legal Name</span>
                    <span className="font-semibold text-slate-800">{viewDetailVendor.companyDetails?.legalName || viewDetailVendor.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GSTIN</span>
                    <span className="font-mono font-semibold text-slate-800">{viewDetailVendor.companyDetails?.gstin || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PAN</span>
                    <span className="font-mono font-semibold text-slate-800">{viewDetailVendor.companyDetails?.pan || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CIN</span>
                    <span className="font-mono text-slate-800">{viewDetailVendor.companyDetails?.cin || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">MSME Number</span>
                    <span className="font-mono text-slate-800">{viewDetailVendor.companyDetails?.msmeNumber || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-brand-700 border-b pb-2">
                  <Mail className="w-4 h-4" />
                  Contact & Location
                </h4>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contact Person</span>
                    <span className="font-semibold text-slate-800">{viewDetailVendor.contactDetails?.contactPerson || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email</span>
                    <span className="font-mono text-slate-800">{viewDetailVendor.contactDetails?.email || viewDetailVendor.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mobile</span>
                    <span className="font-mono text-slate-800">{viewDetailVendor.contactDetails?.mobile || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registered Address</span>
                    <span className="text-slate-800 text-[11px] leading-relaxed line-clamp-3">
                      {viewDetailVendor.contactDetails?.address || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-brand-700 border-b pb-2">
                  <CreditCard className="w-4 h-4" />
                  Banking & Remittance
                </h4>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Account Holder</span>
                    <span className="font-semibold text-slate-800">{viewDetailVendor.bankDetails?.accountHolderName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bank Name</span>
                    <span className="text-slate-800">{viewDetailVendor.bankDetails?.bankName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Account Number</span>
                    <span className="font-mono font-semibold text-slate-800">{viewDetailVendor.bankDetails?.accountNumber || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">IFSC Code</span>
                    <span className="font-mono font-semibold text-slate-800">{viewDetailVendor.bankDetails?.ifscCode || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Documents Vault */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b pb-2">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  Compliance Document Vault
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  {viewDetailVendor.documents?.length || 0} files attached
                </span>
              </h4>

              {(!viewDetailVendor.documents || viewDetailVendor.documents.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No documents uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {viewDetailVendor.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs hover:border-brand-400 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate text-[11px]">{doc.type}</p>
                          <p className="font-mono text-[10px] text-slate-400 truncate">{doc.name}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded ml-2">
                        {doc.status || 'Verified'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Onboarding History & Audit Trail Timeline */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Onboarding History & Audit Trail
              </h4>

              <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
                {viewDetailVendor.onboardingHistory?.map((hist, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{hist.action}</span>
                      <span className="text-[10px] text-slate-400">{formatDateTime(hist.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">By: {hist.by}</p>
                    {hist.notes && (
                      <p className="text-[11px] text-orange-800 bg-orange-50 p-2 rounded-lg mt-1 border border-orange-100">
                        Notes: "{hist.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
