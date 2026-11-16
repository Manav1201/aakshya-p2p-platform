import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_VENDORS,
  INITIAL_PURCHASE_INDENTS,
  INITIAL_RFPS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_DISPATCHES,
  INITIAL_GRNS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SIMULATED_EMAILS
} from '../data/seedData';
import { generateId } from '../utils/formatters';

const P2PContext = createContext();

const STORAGE_KEYS = {
  VENDORS: 'aakshya_p2p_vendors',
  INDENTS: 'aakshya_p2p_indents',
  RFPS: 'aakshya_p2p_rfps',
  POS: 'aakshya_p2p_pos',
  DISPATCHES: 'aakshya_p2p_dispatches',
  GRNS: 'aakshya_p2p_grns',
  INVOICES: 'aakshya_p2p_invoices',
  PAYMENTS: 'aakshya_p2p_payments',
  NOTIFS: 'aakshya_p2p_notifications',
  EMAILS: 'aakshya_p2p_emails'
};

const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return fallback;
    const parsed = JSON.parse(item);
    if (!parsed) return fallback;
    if (Array.isArray(fallback) && (!Array.isArray(parsed) || parsed.length === 0)) {
      return fallback;
    }
    return parsed;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
};

export const P2PProvider = ({ children }) => {
  const [vendors, setVendors] = useState(() => getStoredData(STORAGE_KEYS.VENDORS, INITIAL_VENDORS));
  const [indents, setIndents] = useState(() => getStoredData(STORAGE_KEYS.INDENTS, INITIAL_PURCHASE_INDENTS));
  const [rfps, setRfps] = useState(() => getStoredData(STORAGE_KEYS.RFPS, INITIAL_RFPS));
  const [pos, setPos] = useState(() => getStoredData(STORAGE_KEYS.POS, INITIAL_PURCHASE_ORDERS));
  const [dispatches, setDispatches] = useState(() => getStoredData(STORAGE_KEYS.DISPATCHES, INITIAL_DISPATCHES));
  const [grns, setGrns] = useState(() => getStoredData(STORAGE_KEYS.GRNS, INITIAL_GRNS));
  const [invoices, setInvoices] = useState(() => getStoredData(STORAGE_KEYS.INVOICES, INITIAL_INVOICES));
  const [payments, setPayments] = useState(() => getStoredData(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
  const [notifications, setNotifications] = useState(() => getStoredData(STORAGE_KEYS.NOTIFS, INITIAL_NOTIFICATIONS));
  const [emails, setEmails] = useState(() => getStoredData(STORAGE_KEYS.EMAILS, INITIAL_SIMULATED_EMAILS));

  // Sync state changes to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors)); }, [vendors]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INDENTS, JSON.stringify(indents)); }, [indents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RFPS, JSON.stringify(rfps)); }, [rfps]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(pos)); }, [pos]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DISPATCHES, JSON.stringify(dispatches)); }, [dispatches]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GRNS, JSON.stringify(grns)); }, [grns]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails)); }, [emails]);

  // Notification helper
  const addNotification = ({ title, message, type = 'info', roleTarget = 'all', actionRoute = '' }) => {
    const newNotif = {
      id: generateId('NOTIF'),
      title,
      message,
      type,
      roleTarget,
      timestamp: new Date().toISOString(),
      read: false,
      actionRoute
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Simulated Email helper
  const sendSimulatedEmail = ({ to, subject, preview, body, category = 'General', actionType = '', token = null, targetId = null }) => {
    const newEmail = {
      id: generateId('EML'),
      to,
      from: 'system@aakshyagroup.com',
      subject,
      preview: preview || body.slice(0, 100) + '...',
      body,
      timestamp: new Date().toISOString(),
      category,
      actionType,
      token,
      targetId
    };
    setEmails(prev => [newEmail, ...prev]);
  };

  // ---------------- MODULE 1: VENDOR ONBOARDING ----------------
  const addVendorManually = (vendorData) => {
    const newId = generateId('VND');
    const newVendor = {
      id: newId,
      name: vendorData.companyDetails?.legalName || vendorData.name,
      email: vendorData.contactDetails?.email || vendorData.email,
      category: vendorData.companyDetails?.category || vendorData.category || 'General',
      status: 'Onboarded',
      companyDetails: vendorData.companyDetails || {},
      contactDetails: vendorData.contactDetails || {},
      bankDetails: vendorData.bankDetails || {},
      documents: vendorData.documents || [],
      onboardingHistory: [
        { action: 'Created Manually by Admin', by: 'Anita Sharma (Admin)', timestamp: new Date().toISOString() },
        { action: 'Approved & Onboarded', by: 'Anita Sharma (Admin)', timestamp: new Date().toISOString() }
      ],
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      rating: 5.0,
      complianceScore: 100,
    };
    setVendors(prev => [newVendor, ...prev]);
    addNotification({
      title: 'Vendor Created Manually',
      message: `Vendor ${newVendor.name} added to Vendor Master directly.`,
      type: 'vendor',
      roleTarget: 'procurement',
      actionRoute: 'vendors'
    });
    return newVendor;
  };

  const sendVendorInvitation = ({ name, email, category }) => {
    const newId = generateId('VND');
    const token = `INV-${name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVendor = {
      id: newId,
      name,
      email,
      category,
      status: 'Invitation Sent',
      invitationToken: token,
      companyDetails: { legalName: name, category },
      contactDetails: { email },
      bankDetails: {},
      documents: [],
      onboardingHistory: [
        { action: 'Invitation Sent', by: 'Anita Sharma (Admin)', timestamp: new Date().toISOString() }
      ],
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      rating: 0,
      complianceScore: 0,
    };
    setVendors(prev => [newVendor, ...prev]);

    // Send Simulated Email
    sendSimulatedEmail({
      to: email,
      subject: `Vendor Onboarding Invitation - Aakshya Group`,
      preview: `You have been invited to onboard as an authorized ${category} vendor for Aakshya Group...`,
      body: `Dear ${name},\n\nAakshya Group invites your organization to register on our centralized Procure-to-Pay platform.\n\nPlease click the link below to access your vendor onboarding portal:\nRegistration Link: https://p2p.aakshyagroup.com/vendor-register?token=${token}\n\nVendor Category: ${category}\nToken: ${token}\n\nBest regards,\nAakshya Group Procurement Desk`,
      category: 'Onboarding Invitation',
      actionType: 'open_registration',
      token,
      targetId: newId
    });

    addNotification({
      title: 'Vendor Invitation Dispatched',
      message: `Invitation email sent to ${email} (${name}).`,
      type: 'vendor',
      roleTarget: 'procurement',
      actionRoute: 'vendors'
    });
    return newVendor;
  };

  const saveVendorDraft = (vendorId, formData) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId || v.invitationToken === vendorId) {
        return {
          ...v,
          status: 'Registration In Progress',
          companyDetails: { ...v.companyDetails, ...formData.companyDetails },
          contactDetails: { ...v.contactDetails, ...formData.contactDetails },
          bankDetails: { ...v.bankDetails, ...formData.bankDetails },
          documents: formData.documents || v.documents,
          lastUpdated: new Date().toISOString().split('T')[0],
          onboardingHistory: [
            ...v.onboardingHistory,
            { action: 'Registration In Progress (Draft Saved)', by: formData.contactDetails?.contactPerson || 'Vendor', timestamp: new Date().toISOString() }
          ]
        };
      }
      return v;
    }));
  };

  const submitVendorRegistration = (vendorId, formData) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId || v.invitationToken === vendorId) {
        return {
          ...v,
          name: formData.companyDetails?.legalName || v.name,
          email: formData.contactDetails?.email || v.email,
          category: formData.companyDetails?.category || v.category,
          status: 'Submitted for Approval',
          companyDetails: formData.companyDetails,
          contactDetails: formData.contactDetails,
          bankDetails: formData.bankDetails,
          documents: formData.documents,
          correctionNotes: null,
          lastUpdated: new Date().toISOString().split('T')[0],
          complianceScore: 90,
          onboardingHistory: [
            ...v.onboardingHistory,
            { action: 'Submitted for Approval', by: formData.contactDetails?.contactPerson || 'Vendor', timestamp: new Date().toISOString() }
          ]
        };
      }
      return v;
    }));

    addNotification({
      title: 'Vendor Onboarding Submitted',
      message: `${formData.companyDetails?.legalName || 'A vendor'} submitted registration for review.`,
      type: 'vendor_approval',
      roleTarget: 'procurement',
      actionRoute: 'vendors'
    });
  };

  const approveVendor = (vendorId) => {
    let vendorName = '';
    let vendorEmail = '';
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        vendorName = v.name;
        vendorEmail = v.email;
        return {
          ...v,
          status: 'Onboarded',
          complianceScore: 98,
          lastUpdated: new Date().toISOString().split('T')[0],
          onboardingHistory: [
            ...v.onboardingHistory,
            { action: 'Approved & Onboarded', by: 'Anita Sharma (Admin)', timestamp: new Date().toISOString() }
          ]
        };
      }
      return v;
    }));

    // Send Simulated Email
    sendSimulatedEmail({
      to: vendorEmail,
      subject: `Congratulations! Onboarding Approved - Aakshya Group`,
      preview: `Your vendor account has been verified and approved. You are now active in the Aakshya Vendor Master...`,
      body: `Dear ${vendorName},\n\nWe are pleased to inform you that your vendor onboarding profile has been thoroughly reviewed and approved by Aakshya Group.\n\nYour organization is now an approved active vendor in our Vendor Master. You are now eligible to receive RFPs, submit quotations, and receive Purchase Orders.\n\nWelcome aboard!\nProcurement Operations, Aakshya Group`,
      category: 'Onboarding Approved',
      actionType: 'open_vendor_portal',
      targetId: vendorId
    });

    addNotification({
      title: 'Vendor Approved',
      message: `${vendorName} has been approved and moved to Vendor Master.`,
      type: 'success',
      roleTarget: 'all',
      actionRoute: 'vendors'
    });
  };

  const requestVendorCorrection = (vendorId, notes) => {
    let vendorEmail = '';
    let vendorName = '';
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        vendorEmail = v.email;
        vendorName = v.name;
        return {
          ...v,
          status: 'Correction Requested',
          correctionNotes: notes,
          lastUpdated: new Date().toISOString().split('T')[0],
          onboardingHistory: [
            ...v.onboardingHistory,
            { action: 'Correction Requested', by: 'Anita Sharma (Admin)', timestamp: new Date().toISOString(), notes }
          ]
        };
      }
      return v;
    }));

    sendSimulatedEmail({
      to: vendorEmail,
      subject: `Action Required: Clarification/Correction Needed for Onboarding - Aakshya Group`,
      preview: `Please update your onboarding submission as requested: ${notes}...`,
      body: `Dear ${vendorName},\n\nOur compliance team has reviewed your onboarding submission and identified items requiring correction:\n\nReviewer Remarks:\n"${notes}"\n\nPlease log in to your Vendor Portal to make the updates and resubmit.\n\nRegards,\nAakshya Compliance Desk`,
      category: 'Correction Requested',
      actionType: 'open_registration',
      targetId: vendorId
    });

    addNotification({
      title: 'Correction Requested from Vendor',
      message: `Correction notes dispatched to ${vendorName}.`,
      type: 'warning',
      roleTarget: 'procurement',
      actionRoute: 'vendors'
    });
  };

  const rejectVendor = (vendorId, reason) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return {
          ...v,
          status: 'Rejected',
          rejectionReason: reason,
          lastUpdated: new Date().toISOString().split('T')[0],
          onboardingHistory: [
            ...v.onboardingHistory,
            { action: 'Rejected', by: 'Anita Sharma (Admin)', timestamp: new Date().toISOString(), notes: reason }
          ]
        };
      }
      return v;
    }));
  };

  // ---------------- MODULE 2: PURCHASE INDENT (PI) ----------------
  const createPurchaseIndent = (indentData) => {
    const id = generateId('PI');
    const newIndent = {
      id,
      indentNumber: id,
      department: indentData.department,
      projectName: indentData.projectName,
      requestorName: indentData.requestorName,
      itemName: indentData.itemName,
      description: indentData.description,
      quantity: Number(indentData.quantity),
      unit: indentData.unit || 'Units',
      estimatedCost: Number(indentData.estimatedCost),
      requiredDate: indentData.requiredDate,
      priority: indentData.priority || 'Medium',
      status: 'Pending HOD',
      approvalWorkflow: [
        { level: 'Requester', name: indentData.requestorName, status: 'Submitted', date: new Date().toISOString() },
        { level: 'HOD Approval', name: 'Rajesh Patel (VP Ops)', status: 'Pending', date: null, remarks: '' },
        { level: 'Finance Approval', name: 'Priya Nair (Finance Head)', status: 'Pending', date: null, remarks: '' }
      ],
      isConvertedToRfp: false,
      linkedRfpId: null,
      attachments: indentData.attachments || ['Spec_Sheet_Document.pdf'],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setIndents(prev => [newIndent, ...prev]);

    addNotification({
      title: 'New Purchase Indent Raised',
      message: `${newIndent.indentNumber} for "${newIndent.itemName}" raised by ${newIndent.requestorName}. Pending HOD approval.`,
      type: 'pi_submitted',
      roleTarget: 'hod',
      actionRoute: 'indents'
    });
    return newIndent;
  };

  const approveIndentHOD = (indentId, remarks = 'Approved by Operations HOD') => {
    setIndents(prev => prev.map(pi => {
      if (pi.id === indentId) {
        const updatedWorkflow = pi.approvalWorkflow.map(step => {
          if (step.level === 'HOD Approval') {
            return { ...step, status: 'Approved', date: new Date().toISOString(), remarks };
          }
          return step;
        });
        return {
          ...pi,
          status: 'Pending Finance',
          approvalWorkflow: updatedWorkflow
        };
      }
      return pi;
    }));

    addNotification({
      title: 'PI HOD Approved',
      message: `Purchase Indent ${indentId} approved by HOD. Now awaiting Finance Manager approval.`,
      type: 'pi_approval',
      roleTarget: 'finance',
      actionRoute: 'indents'
    });
  };

  const approveIndentFinance = (indentId, remarks = 'Budget code validated and Capex approved') => {
    setIndents(prev => prev.map(pi => {
      if (pi.id === indentId) {
        const updatedWorkflow = pi.approvalWorkflow.map(step => {
          if (step.level === 'Finance Approval') {
            return { ...step, status: 'Approved', date: new Date().toISOString(), remarks };
          }
          return step;
        });
        return {
          ...pi,
          status: 'Approved',
          approvalWorkflow: updatedWorkflow
        };
      }
      return pi;
    }));

    addNotification({
      title: 'PI Fully Approved - Ready for RFP',
      message: `Purchase Indent ${indentId} approved by Finance. Procurement can now convert it to RFP.`,
      type: 'success',
      roleTarget: 'procurement',
      actionRoute: 'indents'
    });
  };

  const rejectIndent = (indentId, level, reason) => {
    setIndents(prev => prev.map(pi => {
      if (pi.id === indentId) {
        const updatedWorkflow = pi.approvalWorkflow.map(step => {
          if (step.level.includes(level)) {
            return { ...step, status: 'Rejected', date: new Date().toISOString(), remarks: reason };
          }
          return step;
        });
        return {
          ...pi,
          status: 'Rejected',
          rejectionReason: reason,
          approvalWorkflow: updatedWorkflow
        };
      }
      return pi;
    }));
  };

  // ---------------- MODULE 3: RFP / RFQ MANAGEMENT ----------------
  const createRfpFromIndent = (indentId, rfpData) => {
    const rfpId = generateId('RFP');
    const linkedPi = indents.find(i => i.id === indentId);

    const newRfp = {
      id: rfpId,
      rfpNumber: rfpId,
      title: rfpData.title || `Procurement of ${linkedPi?.itemName || 'Materials'}`,
      linkedPiId: indentId,
      linkedPiNumber: linkedPi?.indentNumber || indentId,
      department: linkedPi?.department || 'Operations',
      budgetEstimate: linkedPi?.estimatedCost || 0,
      submissionDueDate: rfpData.submissionDueDate,
      termsAndConditions: rfpData.termsAndConditions || 'Payment: Net 30 days post GRN acceptance. Standard 2-year warranty.',
      attachments: rfpData.attachments || ['Technical_Specifications_Tender.pdf'],
      invitedVendorIds: rfpData.invitedVendorIds || [],
      status: 'Open for Bidding',
      winningVendorId: null,
      winningVendorName: null,
      responses: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRfps(prev => [newRfp, ...prev]);

    // Update PI state
    setIndents(prev => prev.map(pi => {
      if (pi.id === indentId) {
        return { ...pi, isConvertedToRfp: true, linkedRfpId: rfpId };
      }
      return pi;
    }));

    // Notify invited vendors
    newRfp.invitedVendorIds.forEach(vId => {
      const vendor = vendors.find(v => v.id === vId);
      if (vendor) {
        sendSimulatedEmail({
          to: vendor.email,
          subject: `New RFP Invitation: ${newRfp.rfpNumber} - Aakshya Group`,
          preview: `You have been selected to submit a quotation for RFP ${newRfp.rfpNumber} (${newRfp.title}). Due Date: ${newRfp.submissionDueDate}...`,
          body: `Dear ${vendor.name},\n\nYou are invited to participate in the competitive bidding process for:\n\nRFP: ${newRfp.rfpNumber}\nTitle: ${newRfp.title}\nSubmission Deadline: ${newRfp.submissionDueDate}\n\nPlease submit your technical specifications, proposal document, and commercial quotation via your Vendor Portal.\n\nBest regards,\nAakshya Group Procurement Desk`,
          category: 'RFP Invitation',
          actionType: 'open_rfp',
          targetId: rfpId
        });
      }
    });

    addNotification({
      title: 'RFP Created & Dispatched',
      message: `${newRfp.rfpNumber} published. ${newRfp.invitedVendorIds.length} vendors invited to bid.`,
      type: 'rfp',
      roleTarget: 'all',
      actionRoute: 'rfp'
    });

    return newRfp;
  };

  const submitRfpQuotation = (rfpId, quoteData) => {
    const responseId = generateId('RESP');
    const vendor = vendors.find(v => v.id === quoteData.vendorId);

    const newResponse = {
      id: responseId,
      vendorId: quoteData.vendorId,
      vendorName: vendor ? vendor.name : quoteData.vendorName,
      unitPrice: Number(quoteData.unitPrice),
      totalPrice: Number(quoteData.totalPrice),
      deliveryTimelineWeeks: Number(quoteData.deliveryTimelineWeeks || 4),
      proposalDoc: quoteData.proposalDoc || 'Commercial_Technical_Proposal.pdf',
      commercialResponse: quoteData.commercialResponse || 'Standard terms accepted. Net 30 days.',
      technicalResponse: quoteData.technicalResponse || '100% compliant with specifications.',
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      evaluationNotes: ''
    };

    setRfps(prev => prev.map(rfp => {
      if (rfp.id === rfpId) {
        // filter out old response from same vendor if any
        const filtered = rfp.responses.filter(r => r.vendorId !== quoteData.vendorId);
        return {
          ...rfp,
          responses: [...filtered, newResponse]
        };
      }
      return rfp;
    }));

    addNotification({
      title: 'New RFP Quotation Submitted',
      message: `${newResponse.vendorName} submitted quotation of ₹${newResponse.totalPrice.toLocaleString()} for ${rfpId}.`,
      type: 'rfp_bid',
      roleTarget: 'procurement',
      actionRoute: 'rfp'
    });

    return newResponse;
  };

  const awardWinningRfpBid = (rfpId, winningVendorId, remarks = 'Selected as L1 compliant bidder') => {
    let winningVendorName = '';
    let rfpTitle = '';
    let winningPrice = 0;

    setRfps(prev => prev.map(rfp => {
      if (rfp.id === rfpId) {
        rfpTitle = rfp.title;
        const updatedResponses = rfp.responses.map(r => {
          if (r.vendorId === winningVendorId) {
            winningVendorName = r.vendorName;
            winningPrice = r.totalPrice;
            return { ...r, status: 'Selected', evaluationNotes: remarks };
          }
          return { ...r, status: 'Not Selected', evaluationNotes: 'Did not match winning criteria' };
        });
        return {
          ...rfp,
          status: 'Awarded',
          winningVendorId,
          winningVendorName,
          responses: updatedResponses
        };
      }
      return rfp;
    }));

    const vendor = vendors.find(v => v.id === winningVendorId);
    if (vendor) {
      sendSimulatedEmail({
        to: vendor.email,
        subject: `RFP Award Notification: ${rfpId} - Aakshya Group`,
        preview: `Congratulations! Your bid for ${rfpTitle} has been evaluated and selected. A Purchase Order will follow shortly...`,
        body: `Dear ${vendor.name},\n\nWe are pleased to inform you that your quotation of ₹${winningPrice.toLocaleString()} for RFP ${rfpId} (${rfpTitle}) has been accepted and awarded by our Procurement Committee.\n\nOur team is currently preparing the formal Purchase Order.\n\nBest regards,\nAakshya Group Procurement Team`,
        category: 'RFP Awarded',
        actionType: 'open_rfp',
        targetId: rfpId
      });
    }

    addNotification({
      title: 'Winning Vendor Selected',
      message: `${winningVendorName} awarded ${rfpId}. Ready for PO creation.`,
      type: 'success',
      roleTarget: 'procurement',
      actionRoute: 'rfp'
    });
  };

  // ---------------- MODULE 4: PURCHASE ORDER (PO) ----------------
  const createPurchaseOrderFromRfp = (rfpId) => {
    const rfp = rfps.find(r => r.id === rfpId);
    if (!rfp || !rfp.winningVendorId) return null;

    const winningBid = rfp.responses.find(r => r.vendorId === rfp.winningVendorId);
    const linkedPi = indents.find(i => i.id === rfp.linkedPiId);
    const vendor = vendors.find(v => v.id === rfp.winningVendorId);

    const poId = generateId('PO');
    const subtotal = winningBid?.totalPrice || 100000;
    const taxRate = 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    // Delivery date 4 weeks out
    const deliveryDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newPo = {
      id: poId,
      poNumber: poId,
      rfpId: rfp.id,
      rfpNumber: rfp.rfpNumber,
      piId: linkedPi?.id || null,
      piNumber: linkedPi?.indentNumber || null,
      vendorId: vendor.id,
      vendorName: vendor.name,
      items: [
        {
          name: linkedPi?.itemName || rfp.title,
          description: linkedPi?.description || 'As per technical specifications in RFP',
          quantity: linkedPi?.quantity || 1,
          unit: linkedPi?.unit || 'Units',
          unitPrice: winningBid?.unitPrice || subtotal,
          totalPrice: subtotal,
        }
      ],
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      deliveryDate,
      paymentTerms: 'Net 30 days after GRN Acceptance',
      billingAddress: 'Aakshya Group Corporate Office, Senapati Bapat Road, Pune, MH 411016',
      shippingAddress: 'Aakshya Group Central Plant, Chakan Phase 2, Pune, MH 410501',
      status: 'Issued',
      vendorResponseNote: '',
      clarifications: [],
      issuedAt: new Date().toISOString(),
      acceptedAt: null,
    };

    setPos(prev => [newPo, ...prev]);

    // Send email to vendor
    sendSimulatedEmail({
      to: vendor.email,
      subject: `New Purchase Order Issued: ${newPo.poNumber} - Aakshya Group`,
      preview: `Purchase Order ${newPo.poNumber} has been issued for ${newPo.items[0].name} (Total: ₹${newPo.totalAmount.toLocaleString()})...`,
      body: `Dear ${vendor.name},\n\nPlease find Purchase Order ${newPo.poNumber} issued against RFP ${rfp.rfpNumber}.\n\nPO Value: ₹${newPo.totalAmount.toLocaleString()} (Including ${newPo.taxRate}% GST)\nDelivery Deadline: ${newPo.deliveryDate}\nPayment Terms: ${newPo.paymentTerms}\n\nPlease review and confirm acceptance in your Vendor Portal.\n\nRegards,\nProcurement Team, Aakshya Group`,
      category: 'Purchase Order',
      actionType: 'open_po',
      targetId: newPo.id
    });

    addNotification({
      title: 'Purchase Order Issued',
      message: `${newPo.poNumber} issued to ${vendor.name}. Awaiting vendor acknowledgement.`,
      type: 'po',
      roleTarget: 'all',
      actionRoute: 'pos'
    });

    return newPo;
  };

  const acceptPurchaseOrder = (poId, note = 'PO Accepted by vendor') => {
    let poNumber = '';
    let vendorName = '';
    setPos(prev => prev.map(po => {
      if (po.id === poId) {
        poNumber = po.poNumber;
        vendorName = po.vendorName;
        return {
          ...po,
          status: 'Accepted',
          vendorResponseNote: note,
          acceptedAt: new Date().toISOString()
        };
      }
      return po;
    }));

    addNotification({
      title: 'Purchase Order Accepted',
      message: `${vendorName} has accepted ${poNumber}. Dispatch preparation initiated.`,
      type: 'success',
      roleTarget: 'procurement',
      actionRoute: 'pos'
    });
  };

  const rejectPurchaseOrder = (poId, reason) => {
    setPos(prev => prev.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          status: 'Rejected',
          vendorResponseNote: reason
        };
      }
      return po;
    }));

    addNotification({
      title: 'Purchase Order Rejected by Vendor',
      message: `Vendor rejected PO ${poId}. Reason: ${reason}`,
      type: 'error',
      roleTarget: 'procurement',
      actionRoute: 'pos'
    });
  };

  const raisePoClarification = (poId, message) => {
    setPos(prev => prev.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          status: 'Clarification Raised',
          clarifications: [
            ...(po.clarifications || []),
            { sender: 'Vendor', message, timestamp: new Date().toISOString() }
          ]
        };
      }
      return po;
    }));

    addNotification({
      title: 'Clarification Raised on PO',
      message: `Vendor raised clarification on ${poId}: "${message}"`,
      type: 'warning',
      roleTarget: 'procurement',
      actionRoute: 'pos'
    });
  };

  const answerPoClarification = (poId, message) => {
    setPos(prev => prev.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          clarifications: [
            ...(po.clarifications || []),
            { sender: 'Aakshya Procurement', message, timestamp: new Date().toISOString() }
          ]
        };
      }
      return po;
    }));
  };

  // ---------------- MODULE 5: DISPATCH & SHIPMENT TRACKING ----------------
  const createDispatch = (dispatchData) => {
    const dspId = generateId('DSP');
    const po = pos.find(p => p.id === dispatchData.poId);

    const newDispatch = {
      id: dspId,
      dispatchNumber: dspId,
      poId: dispatchData.poId,
      poNumber: po ? po.poNumber : dispatchData.poId,
      vendorId: po ? po.vendorId : 'VND-001',
      vendorName: po ? po.vendorName : 'Apex Industrial Solutions',
      dispatchDate: dispatchData.dispatchDate || new Date().toISOString().split('T')[0],
      transporter: dispatchData.transporter,
      trackingNumber: dispatchData.trackingNumber,
      vehicleNumber: dispatchData.vehicleNumber,
      packagesCount: Number(dispatchData.packagesCount || 1),
      expectedDeliveryDate: dispatchData.expectedDeliveryDate,
      status: dispatchData.status || 'Dispatched',
      packingSlipDoc: dispatchData.packingSlipDoc || 'Packing_Slip_Challan.pdf',
      shippingRemarks: dispatchData.shippingRemarks || 'Standard dispatch with bubble and pallet packing.',
      statusTimeline: [
        { status: 'Ready for Dispatch', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { status: 'Dispatched', timestamp: new Date().toISOString() }
      ]
    };

    setDispatches(prev => [newDispatch, ...prev]);

    addNotification({
      title: 'Shipment Dispatched by Vendor',
      message: `${newDispatch.vendorName} dispatched PO ${newDispatch.poNumber} via ${newDispatch.transporter} (AWB: ${newDispatch.trackingNumber}). ETA: ${newDispatch.expectedDeliveryDate}`,
      type: 'dispatch',
      roleTarget: 'stores',
      actionRoute: 'dispatch'
    });

    return newDispatch;
  };

  const updateDispatchStatus = (dispatchId, newStatus) => {
    setDispatches(prev => prev.map(dsp => {
      if (dsp.id === dispatchId) {
        return {
          ...dsp,
          status: newStatus,
          statusTimeline: [
            ...dsp.statusTimeline,
            { status: newStatus, timestamp: new Date().toISOString() }
          ]
        };
      }
      return dsp;
    }));

    addNotification({
      title: `Shipment Status: ${newStatus}`,
      message: `Dispatch ${dispatchId} status updated to ${newStatus}.`,
      type: 'info',
      roleTarget: 'stores',
      actionRoute: 'dispatch'
    });
  };

  // ---------------- MODULE 6: GRN & QUALITY INSPECTION ----------------
  const createGrn = (grnData) => {
    const grnId = generateId('GRN');
    const po = pos.find(p => p.id === grnData.poId);

    const isAccepted = grnData.qualityCheckResult === 'Passed' && Number(grnData.quantityAccepted) > 0;
    const status = isAccepted ? 'GRN Approved' : 'Return Initiated';

    const newGrn = {
      id: grnId,
      grnNumber: grnId,
      poId: grnData.poId,
      poNumber: po ? po.poNumber : grnData.poId,
      dispatchId: grnData.dispatchId || null,
      vendorId: po ? po.vendorId : 'VND-001',
      vendorName: po ? po.vendorName : 'Vendor',
      quantityOrdered: Number(grnData.quantityOrdered || (po ? po.items[0]?.quantity : 1)),
      quantityReceived: Number(grnData.quantityReceived),
      quantityAccepted: Number(grnData.quantityAccepted),
      quantityRejected: Number(grnData.quantityRejected || 0),
      qualityCheckResult: grnData.qualityCheckResult, // 'Passed' or 'Failed'
      inspectionRemarks: grnData.inspectionRemarks || 'Inspection complete.',
      inspectorName: grnData.inspectorName || 'Vikram Singh (Quality & Stores Lead)',
      status,
      rejectionReason: isAccepted ? null : grnData.rejectionReason || 'Quality Failure',
      invoiceCreated: false,
      linkedInvoiceId: null,
      createdAt: new Date().toISOString()
    };

    setGrns(prev => [newGrn, ...prev]);

    if (isAccepted) {
      // Flow 1: Accepted
      // Notify Finance and Vendor that Invoice can be generated!
      const vendor = vendors.find(v => v.id === newGrn.vendorId);
      if (vendor) {
        sendSimulatedEmail({
          to: vendor.email,
          subject: `GRN Approved: ${newGrn.grnNumber} for PO ${newGrn.poNumber} - Aakshya Group`,
          preview: `Goods Receipt Note ${newGrn.grnNumber} has been verified and Approved. You are now eligible to submit your commercial invoice...`,
          body: `Dear ${vendor.name},\n\nWe are pleased to inform you that material received under PO ${newGrn.poNumber} has cleared inspection.\n\nGRN Number: ${newGrn.grnNumber}\nQuantity Accepted: ${newGrn.quantityAccepted}\nQuality Result: PASSED\n\nYou can now generate and submit your tax invoice against this GRN via your Vendor Portal.\n\nStores & Quality Team, Aakshya Group`,
          category: 'GRN Approved',
          actionType: 'create_invoice',
          targetId: newGrn.id
        });
      }

      addNotification({
        title: 'GRN Approved - Invoice Enabled',
        message: `${newGrn.grnNumber} approved by Stores. Vendor ${newGrn.vendorName} is now eligible to submit an invoice.`,
        type: 'success',
        roleTarget: 'all',
        actionRoute: 'grn'
      });
    } else {
      // Flow 2: Rejected
      addNotification({
        title: 'GRN Rejected - Material Quarantine',
        message: `${newGrn.grnNumber} rejected due to: ${newGrn.rejectionReason}. Return initiated.`,
        type: 'error',
        roleTarget: 'all',
        actionRoute: 'grn'
      });
    }

    return newGrn;
  };

  // ---------------- MODULE 7: INVOICE MANAGEMENT ----------------
  const createInvoice = (invoiceData) => {
    const invId = generateId('INV');
    const po = pos.find(p => p.id === invoiceData.poId);
    const grn = grns.find(g => g.id === invoiceData.grnId);

    const baseAmount = Number(invoiceData.baseAmount || 0);
    const taxRate = 18;
    const cgstAmount = invoiceData.isInterState ? 0 : (baseAmount * 0.09);
    const sgstAmount = invoiceData.isInterState ? 0 : (baseAmount * 0.09);
    const igstAmount = invoiceData.isInterState ? (baseAmount * 0.18) : 0;
    const taxAmount = cgstAmount + sgstAmount + igstAmount;
    const totalAmount = baseAmount + taxAmount;

    // 3-way match validation
    const poPrice = po ? po.subtotal : baseAmount;
    const priceVariance = Math.abs(baseAmount - poPrice);
    const qtyVariance = Math.abs(Number(invoiceData.quantity || 1) - (grn ? grn.quantityAccepted : 1));
    const threeWayMatchStatus = (priceVariance === 0 && qtyVariance === 0) ? 'Matched' : 'Discrepancy';

    const newInvoice = {
      id: invId,
      invoiceNumber: invoiceData.invoiceNumber,
      invoiceDate: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      poId: invoiceData.poId,
      poNumber: po ? po.poNumber : invoiceData.poId,
      grnId: invoiceData.grnId,
      grnNumber: grn ? grn.grnNumber : invoiceData.grnId,
      vendorId: invoiceData.vendorId || (po ? po.vendorId : 'VND-001'),
      vendorName: invoiceData.vendorName || (po ? po.vendorName : 'Apex Industrial'),
      baseAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      taxAmount,
      totalAmount,
      paymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attachmentDoc: invoiceData.attachmentDoc || 'Tax_Invoice_Signed.pdf',
      threeWayMatchStatus,
      matchDetails: {
        poAmount: po ? po.totalAmount : totalAmount,
        grnAcceptedQty: grn ? grn.quantityAccepted : 1,
        invoiceQty: Number(invoiceData.quantity || 1),
        priceVariance,
        quantityVariance: qtyVariance
      },
      status: 'Submitted',
      financeReviewRemarks: '',
      reviewedBy: null,
      paymentCreated: false,
      linkedPaymentId: null,
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Mark GRN as invoice created
    if (grn) {
      setGrns(prev => prev.map(g => g.id === grn.id ? { ...g, invoiceCreated: true, linkedInvoiceId: invId } : g));
    }

    addNotification({
      title: 'New Invoice Submitted by Vendor',
      message: `Invoice ${newInvoice.invoiceNumber} (₹${newInvoice.totalAmount.toLocaleString()}) submitted by ${newInvoice.vendorName} against ${newInvoice.grnNumber}. Pending 3-way match review by Finance.`,
      type: 'invoice',
      roleTarget: 'finance',
      actionRoute: 'invoices'
    });

    return newInvoice;
  };

  const reviewInvoiceFinance = (invoiceId, action, remarks = '') => {
    let targetInv = null;
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        targetInv = inv;
        let newStatus = inv.status;
        if (action === 'Approve') newStatus = 'Approved for Payment';
        else if (action === 'Reject') newStatus = 'Rejected';
        else if (action === 'Correction') newStatus = 'Under Review';

        return {
          ...inv,
          status: newStatus,
          financeReviewRemarks: remarks,
          reviewedBy: 'Priya Nair (Finance Head)'
        };
      }
      return inv;
    }));

    if (action === 'Approve' && targetInv) {
      // Auto-create a scheduled payment record
      const payId = generateId('PAY');
      const newPayment = {
        id: payId,
        paymentNumber: payId,
        invoiceId: targetInv.id,
        invoiceNumber: targetInv.invoiceNumber,
        poNumber: targetInv.poNumber,
        vendorId: targetInv.vendorId,
        vendorName: targetInv.vendorName,
        amount: targetInv.totalAmount,
        paymentTerms: 'Net 30 days after GRN Acceptance',
        dueDate: targetInv.paymentDueDate,
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        processedDate: null,
        paymentMode: 'RTGS',
        sourceAccount: 'Aakshya Group Corporate - HDFC Bank (A/c ...8812)',
        beneficiaryAccount: 'Vendor Registered Account',
        utrNumber: '',
        status: 'Scheduled',
        vendorAcknowledged: false,
        acknowledgedAt: null,
        notes: remarks || '3-Way Match Verified. Approved for disbursement.'
      };

      setPayments(prev => [newPayment, ...prev]);
      setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, paymentCreated: true, linkedPaymentId: payId } : i));

      addNotification({
        title: 'Invoice Approved for Payment',
        message: `Invoice ${targetInv.invoiceNumber} approved. Payment ${payId} scheduled.`,
        type: 'success',
        roleTarget: 'finance',
        actionRoute: 'payments'
      });
    } else if (action === 'Reject') {
      addNotification({
        title: 'Invoice Rejected by Finance',
        message: `Invoice ${invoiceId} rejected. Reason: ${remarks}`,
        type: 'error',
        roleTarget: 'finance',
        actionRoute: 'invoices'
      });
    }
  };

  // ---------------- MODULE 8: PAYMENT PROCESSING ----------------
  const processPayment = (paymentId, { paymentMode, sourceAccount, utrNumber, notes }) => {
    let paidPayment = null;
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        paidPayment = {
          ...p,
          status: 'Paid',
          paymentMode: paymentMode || p.paymentMode,
          sourceAccount: sourceAccount || p.sourceAccount,
          utrNumber: utrNumber || `HDFCR${Date.now().toString().slice(-10)}`,
          notes: notes || p.notes,
          processedDate: new Date().toISOString()
        };
        return paidPayment;
      }
      return p;
    }));

    // Update corresponding invoice status to Paid
    if (paidPayment) {
      setInvoices(prev => prev.map(i => i.id === paidPayment.invoiceId ? { ...i, status: 'Paid' } : i));

      // Dispatched simulated Remittance Advice email
      const vendor = vendors.find(v => v.id === paidPayment.vendorId);
      if (vendor) {
        sendSimulatedEmail({
          to: vendor.email,
          subject: `Remittance Advice: Payment Processed - ${paidPayment.paymentNumber}`,
          preview: `Payment of ₹${paidPayment.amount.toLocaleString()} has been disbursed via ${paidPayment.paymentMode}. UTR / Ref: ${paidPayment.utrNumber}...`,
          body: `Dear ${vendor.name},\n\nWe have processed electronic payment for Invoice ${paidPayment.invoiceNumber}.\n\nPayment Ref: ${paidPayment.paymentNumber}\nUTR / Reference No: ${paidPayment.utrNumber}\nAmount Disbursed: ₹${paidPayment.amount.toLocaleString()}\nPayment Mode: ${paidPayment.paymentMode}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nPlease verify in your bank account and acknowledge receipt on the Vendor Portal.\n\nCorporate Treasury & Accounts, Aakshya Group`,
          category: 'Payment Remittance',
          actionType: 'open_payments',
          targetId: paymentId
        });
      }

      addNotification({
        title: 'Payment Disbursed Successfully',
        message: `₹${paidPayment.amount.toLocaleString()} paid to ${paidPayment.vendorName} (UTR: ${paidPayment.utrNumber}).`,
        type: 'success',
        roleTarget: 'all',
        actionRoute: 'payments'
      });
    }
  };

  const acknowledgePaymentReceipt = (paymentId) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          vendorAcknowledged: true,
          acknowledgedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    addNotification({
      title: 'Payment Acknowledged by Vendor',
      message: `Vendor acknowledged receipt of payment ${paymentId}.`,
      type: 'info',
      roleTarget: 'finance',
      actionRoute: 'payments'
    });
  };

  // Reset to default seed data
  const resetToDefault = () => {
    setVendors(INITIAL_VENDORS);
    setIndents(INITIAL_PURCHASE_INDENTS);
    setRfps(INITIAL_RFPS);
    setPos(INITIAL_PURCHASE_ORDERS);
    setDispatches(INITIAL_DISPATCHES);
    setGrns(INITIAL_GRNS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEmails(INITIAL_SIMULATED_EMAILS);
    localStorage.clear();
    addNotification({
      title: 'Demo Environment Reset',
      message: 'All 8 modules have been restored to clean enterprise seed data.',
      type: 'info',
      roleTarget: 'all'
    });
  };

  return (
    <P2PContext.Provider
      value={{
        // Data
        vendors,
        indents,
        rfps,
        pos,
        dispatches,
        grns,
        invoices,
        payments,
        notifications,
        emails,

        // Notifications & Emails
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        sendSimulatedEmail,

        // Module 1: Vendor Onboarding
        addVendorManually,
        sendVendorInvitation,
        saveVendorDraft,
        submitVendorRegistration,
        approveVendor,
        requestVendorCorrection,
        rejectVendor,

        // Module 2: Purchase Indents
        createPurchaseIndent,
        approveIndentHOD,
        approveIndentFinance,
        rejectIndent,

        // Module 3: RFPs
        createRfpFromIndent,
        submitRfpQuotation,
        awardWinningRfpBid,

        // Module 4: Purchase Orders
        createPurchaseOrderFromRfp,
        acceptPurchaseOrder,
        rejectPurchaseOrder,
        raisePoClarification,
        answerPoClarification,

        // Module 5: Dispatches
        createDispatch,
        updateDispatchStatus,

        // Module 6: GRNs
        createGrn,

        // Module 7: Invoices
        createInvoice,
        reviewInvoiceFinance,

        // Module 8: Payments
        processPayment,
        acknowledgePaymentReceipt,

        // Reset
        resetToDefault
      }}
    >
      {children}
    </P2PContext.Provider>
  );
};

export const useP2P = () => useContext(P2PContext);
