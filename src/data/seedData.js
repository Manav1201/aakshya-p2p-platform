// Initial Enterprise Seed Data for Aakshya Group P2P Platform

export const INITIAL_VENDORS = [
  {
    id: 'VND-001',
    name: 'Apex Industrial Solutions Pvt Ltd',
    email: 'contact@apexindustrial.com',
    category: 'Heavy Machinery & Spares',
    status: 'Onboarded',
    companyDetails: {
      legalName: 'Apex Industrial Solutions Private Limited',
      gstin: '27AABCA1234F1Z5',
      pan: 'AABCA1234F',
      cin: 'U29299MH2014PTC254890',
      msmeNumber: 'UDYAM-MH-12-0098741',
      category: 'Heavy Machinery & Spares',
    },
    contactDetails: {
      contactPerson: 'Arun Kumar Singhania',
      email: 'arun@apexindustrial.com',
      mobile: '9820198201',
      address: 'Plot 42, MIDC Industrial Area, Bhosari, Pune, Maharashtra 411026',
    },
    bankDetails: {
      accountHolderName: 'Apex Industrial Solutions Pvt Ltd',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200034981290',
      ifscCode: 'HDFC0000240',
    },
    documents: [
      { name: 'GST_Certificate.pdf', type: 'GST Certificate', status: 'Verified', uploadedAt: '2026-09-10' },
      { name: 'PAN_Card.pdf', type: 'PAN Card', status: 'Verified', uploadedAt: '2026-09-10' },
      { name: 'Cancelled_Cheque.pdf', type: 'Cancelled Cheque', status: 'Verified', uploadedAt: '2026-09-10' },
      { name: 'MSME_Certificate.pdf', type: 'MSME Certificate', status: 'Verified', uploadedAt: '2026-09-10' },
      { name: 'Incorporation_Cert.pdf', type: 'Incorporation Certificate', status: 'Verified', uploadedAt: '2026-09-10' },
    ],
    onboardingHistory: [
      { action: 'Invitation Sent', by: 'Anita Sharma (Admin)', timestamp: '2026-09-08T10:00:00' },
      { action: 'Registration Submitted', by: 'Arun Kumar', timestamp: '2026-09-10T14:30:00' },
      { action: 'Approved & Onboarded', by: 'Anita Sharma (Admin)', timestamp: '2026-09-11T11:15:00' }
    ],
    dateCreated: '2026-09-08',
    lastUpdated: '2026-09-11',
    rating: 4.8,
    complianceScore: 98,
  },
  {
    id: 'VND-002',
    name: 'NexGen Tech Innovations LLP',
    email: 'partners@nexgentech.in',
    category: 'IT Hardware & Cloud Infrastructure',
    status: 'Onboarded',
    companyDetails: {
      legalName: 'NexGen Tech Innovations LLP',
      gstin: '29AAEFN4567M1ZV',
      pan: 'AAEFN4567M',
      cin: 'AAK-8921-KA-2018',
      msmeNumber: 'UDYAM-KR-03-0045129',
      category: 'IT Hardware & Cloud Infrastructure',
    },
    contactDetails: {
      contactPerson: 'Meera Iyer',
      email: 'meera.iyer@nexgentech.in',
      mobile: '9740112345',
      address: 'Tower B, Tech Park, Whitefield, Bengaluru, Karnataka 560066',
    },
    bankDetails: {
      accountHolderName: 'NexGen Tech Innovations LLP',
      bankName: 'ICICI Bank Ltd',
      accountNumber: '000205019842',
      ifscCode: 'ICIC0000002',
    },
    documents: [
      { name: 'GST_Reg.pdf', type: 'GST Certificate', status: 'Verified', uploadedAt: '2026-08-15' },
      { name: 'PAN_Copy.pdf', type: 'PAN Card', status: 'Verified', uploadedAt: '2026-08-15' },
      { name: 'Cheque_Leaf.pdf', type: 'Cancelled Cheque', status: 'Verified', uploadedAt: '2026-08-15' },
    ],
    onboardingHistory: [
      { action: 'Direct Creation', by: 'Anita Sharma (Admin)', timestamp: '2026-08-15T09:30:00' },
      { action: 'Approved & Onboarded', by: 'Anita Sharma (Admin)', timestamp: '2026-08-15T09:45:00' }
    ],
    dateCreated: '2026-08-15',
    lastUpdated: '2026-08-15',
    rating: 4.9,
    complianceScore: 100,
  },
  {
    id: 'VND-003',
    name: 'Sterling Logistics & Freight Solutions',
    email: 'info@sterlingfreight.com',
    category: 'Logistics & Transportation',
    status: 'Onboarded',
    companyDetails: {
      legalName: 'Sterling Logistics & Freight Solutions India Pvt Ltd',
      gstin: '07AAACS7890D1Z3',
      pan: 'AAACS7890D',
      cin: 'U60200DL2016PTC291823',
      msmeNumber: 'UDYAM-DL-05-0012903',
      category: 'Logistics & Transportation',
    },
    contactDetails: {
      contactPerson: 'Vikramaditya Rao',
      email: 'vikram@sterlingfreight.com',
      mobile: '9811029384',
      address: 'Warehouse Complex 12, Kapashera, New Delhi 110037',
    },
    bankDetails: {
      accountHolderName: 'Sterling Logistics Pvt Ltd',
      bankName: 'Axis Bank Ltd',
      accountNumber: '916020038192019',
      ifscCode: 'UTIB0000143',
    },
    documents: [
      { name: 'GST_Cert.pdf', type: 'GST Certificate', status: 'Verified', uploadedAt: '2026-07-20' },
      { name: 'PAN.pdf', type: 'PAN Card', status: 'Verified', uploadedAt: '2026-07-20' },
      { name: 'CancelledCheque.pdf', type: 'Cancelled Cheque', status: 'Verified', uploadedAt: '2026-07-20' }
    ],
    onboardingHistory: [
      { action: 'Approved & Onboarded', by: 'Anita Sharma (Admin)', timestamp: '2026-07-21T12:00:00' }
    ],
    dateCreated: '2026-07-20',
    lastUpdated: '2026-07-21',
    rating: 4.6,
    complianceScore: 95,
  },
  {
    id: 'VND-004',
    name: 'Bharat Electricals & Switchgear Corp',
    email: 'sales@bharatelectricals.com',
    category: 'Electrical & Automation',
    status: 'Submitted for Approval',
    companyDetails: {
      legalName: 'Bharat Electricals & Switchgear Corporation',
      gstin: '24AAFCB5432E1Z8',
      pan: 'AAFCB5432E',
      cin: 'U31909GJ2012PLC071290',
      msmeNumber: 'UDYAM-GJ-01-0081290',
      category: 'Electrical & Automation',
    },
    contactDetails: {
      contactPerson: 'Dinesh Patel',
      email: 'dinesh@bharatelectricals.com',
      mobile: '9825019842',
      address: 'GIDC Phase 2, Vatva, Ahmedabad, Gujarat 382445',
    },
    bankDetails: {
      accountHolderName: 'Bharat Electricals & Switchgear Corp',
      bankName: 'State Bank of India',
      accountNumber: '32091823901',
      ifscCode: 'SBIN0001234',
    },
    documents: [
      { name: 'GST_Reg_Certificate.pdf', type: 'GST Certificate', status: 'Pending Review', uploadedAt: '2026-11-12' },
      { name: 'PAN_Corporate.pdf', type: 'PAN Card', status: 'Pending Review', uploadedAt: '2026-11-12' },
      { name: 'Bank_Proof.pdf', type: 'Cancelled Cheque', status: 'Pending Review', uploadedAt: '2026-11-12' },
      { name: 'MSME_Udyam.pdf', type: 'MSME Certificate', status: 'Pending Review', uploadedAt: '2026-11-12' },
    ],
    onboardingHistory: [
      { action: 'Invitation Sent', by: 'Anita Sharma (Admin)', timestamp: '2026-11-10T11:00:00' },
      { action: 'Registration In Progress', by: 'Dinesh Patel', timestamp: '2026-11-11T16:00:00' },
      { action: 'Submitted for Approval', by: 'Dinesh Patel', timestamp: '2026-11-12T14:45:00' },
    ],
    dateCreated: '2026-11-10',
    lastUpdated: '2026-11-12',
    rating: 4.4,
    complianceScore: 92,
  },
  {
    id: 'VND-005',
    name: 'Precision Tools & Dies India',
    email: 'info@precisiontools.in',
    category: 'Heavy Machinery & Spares',
    status: 'Correction Requested',
    correctionNotes: 'Please upload the latest MSME Udyam Registration Certificate reflecting current financial year and verify the IFSC code for the bank account.',
    companyDetails: {
      legalName: 'Precision Tools & Dies India Pvt Ltd',
      gstin: '33AABCP9012K1ZQ',
      pan: 'AABCP9012K',
      cin: 'U28939TN2015PTC101290',
      msmeNumber: 'UDYAM-TN-02-0048190',
      category: 'Heavy Machinery & Spares',
    },
    contactDetails: {
      contactPerson: 'Karthik Subramanian',
      email: 'karthik@precisiontools.in',
      mobile: '9444018293',
      address: 'Ambattur Industrial Estate, Chennai, Tamil Nadu 600058',
    },
    bankDetails: {
      accountHolderName: 'Precision Tools & Dies India Pvt Ltd',
      bankName: 'Kotak Mahindra Bank',
      accountNumber: '8910293819',
      ifscCode: 'KKBK0000460',
    },
    documents: [
      { name: 'GST_Precision.pdf', type: 'GST Certificate', status: 'Verified', uploadedAt: '2026-11-05' },
      { name: 'PAN_Precision.pdf', type: 'PAN Card', status: 'Verified', uploadedAt: '2026-11-05' },
      { name: 'MSME_Old.pdf', type: 'MSME Certificate', status: 'Correction Needed', uploadedAt: '2026-11-05' },
    ],
    onboardingHistory: [
      { action: 'Invitation Sent', by: 'Anita Sharma (Admin)', timestamp: '2026-11-04T10:00:00' },
      { action: 'Submitted for Approval', by: 'Karthik Subramanian', timestamp: '2026-11-05T17:30:00' },
      { action: 'Correction Requested', by: 'Anita Sharma (Admin)', timestamp: '2026-11-07T14:10:00', notes: 'Please upload the latest MSME Udyam Certificate.' },
    ],
    dateCreated: '2026-11-04',
    lastUpdated: '2026-11-07',
    rating: 4.2,
    complianceScore: 84,
  },
  {
    id: 'VND-006',
    name: 'Zenith Raw Materials & Chemicals Ltd',
    email: 'procurement-desk@zenithchem.com',
    category: 'Raw Materials & Chemicals',
    status: 'Invitation Sent',
    invitationToken: 'INV-ZENITH-2026-8891',
    companyDetails: {
      legalName: '',
      gstin: '',
      pan: '',
      cin: '',
      msmeNumber: '',
      category: 'Raw Materials & Chemicals',
    },
    contactDetails: {
      contactPerson: 'Sanjay Deshmukh',
      email: 'procurement-desk@zenithchem.com',
      mobile: '',
      address: '',
    },
    bankDetails: {},
    documents: [],
    onboardingHistory: [
      { action: 'Invitation Sent', by: 'Anita Sharma (Admin)', timestamp: '2026-11-15T09:15:00' }
    ],
    dateCreated: '2026-11-15',
    lastUpdated: '2026-11-15',
    rating: 0,
    complianceScore: 0,
  }
];

export const INITIAL_PURCHASE_INDENTS = [
  {
    id: 'PI-2026-001',
    indentNumber: 'PI-2026-001',
    department: 'Manufacturing Operations',
    projectName: 'Smart Assembly Line Expansion Phase 2',
    requestorName: 'Sunil Verma (Sr. Plant Engineer)',
    itemName: '5-Axis Precision CNC Milling Machine',
    description: 'High-speed 5-axis vertical machining center with Siemens 840D controller, 24-tool ATC, and coolant through spindle.',
    quantity: 2,
    unit: 'Units',
    estimatedCost: 4500000,
    requiredDate: '2026-12-15',
    priority: 'Urgent',
    status: 'Approved',
    approvalWorkflow: [
      { level: 'Requester', name: 'Sunil Verma', status: 'Submitted', date: '2026-10-01T10:00:00' },
      { level: 'HOD Approval', name: 'Rajesh Patel (VP Ops)', status: 'Approved', date: '2026-10-02T14:30:00', remarks: 'Critical for Q1 production target.' },
      { level: 'Finance Approval', name: 'Priya Nair (Finance Head)', status: 'Approved', date: '2026-10-03T16:15:00', remarks: 'Budget code CAPEX-MFG-2026 verified.' }
    ],
    isConvertedToRfp: true,
    linkedRfpId: 'RFP-2026-001',
    attachments: ['Technical_Spec_Sheet_CNC.pdf', 'Plant_Layout_Fitting.pdf'],
    createdAt: '2026-10-01',
  },
  {
    id: 'PI-2026-002',
    indentNumber: 'PI-2026-002',
    department: 'IT Infrastructure & Security',
    projectName: 'Hybrid Cloud Edge Computing Infrastructure',
    requestorName: 'Amit Saxena (DevOps Lead)',
    itemName: 'Enterprise 2U Rack Servers & 100G Switchgear',
    description: 'Dual Intel Xeon Platinum processors, 512GB ECC RAM, NVMe Enterprise Storage array with redundant power supplies.',
    quantity: 6,
    unit: 'Servers',
    estimatedCost: 2850000,
    requiredDate: '2026-12-20',
    priority: 'High',
    status: 'Approved',
    approvalWorkflow: [
      { level: 'Requester', name: 'Amit Saxena', status: 'Submitted', date: '2026-10-15T09:00:00' },
      { level: 'HOD Approval', name: 'Alok Kulkarni (CTO)', status: 'Approved', date: '2026-10-16T11:45:00', remarks: 'Approved for disaster recovery site upgrade.' },
      { level: 'Finance Approval', name: 'Priya Nair (Finance Head)', status: 'Approved', date: '2026-10-17T15:20:00', remarks: 'Approved within FY IT Capex limit.' }
    ],
    isConvertedToRfp: false,
    linkedRfpId: null,
    attachments: ['Server_BOM_Specification.pdf'],
    createdAt: '2026-10-15',
  },
  {
    id: 'PI-2026-003',
    indentNumber: 'PI-2026-003',
    department: 'Logistics & Warehousing',
    projectName: 'Warehouse Modernization & Material Handling',
    requestorName: 'Kavita Menon (Warehouse Manager)',
    itemName: 'Heavy Duty 3-Ton Electric Forklifts with Li-ion Battery',
    description: 'Electric counterbalanced forklifts, lift height 6m, regenerative braking, telematics enabled.',
    quantity: 2,
    unit: 'Units',
    estimatedCost: 1800000,
    requiredDate: '2026-12-30',
    priority: 'Medium',
    status: 'Pending Finance',
    approvalWorkflow: [
      { level: 'Requester', name: 'Kavita Menon', status: 'Submitted', date: '2026-11-08T11:00:00' },
      { level: 'HOD Approval', name: 'Rajesh Patel (VP Ops)', status: 'Approved', date: '2026-11-10T10:15:00', remarks: 'Replaces aging 7-year-old diesel forklifts.' },
      { level: 'Finance Approval', name: 'Priya Nair (Finance Head)', status: 'Pending', date: null, remarks: '' }
    ],
    isConvertedToRfp: false,
    linkedRfpId: null,
    attachments: ['Forklift_Technical_Requirements.pdf'],
    createdAt: '2026-11-08',
  },
  {
    id: 'PI-2026-004',
    indentNumber: 'PI-2026-004',
    department: 'Environmental Health & Safety',
    projectName: 'Annual Plant Safety Gear Refresh',
    requestorName: 'Ramesh Tawde (Safety Officer)',
    itemName: 'Industrial Safety Helmets, Harnesses & Composite Boots',
    description: 'IS:2925 certified helmets with headlamps, full-body safety harnesses, and anti-static steel toe footwear.',
    quantity: 350,
    unit: 'Sets',
    estimatedCost: 420000,
    requiredDate: '2026-12-05',
    priority: 'Medium',
    status: 'Pending HOD',
    approvalWorkflow: [
      { level: 'Requester', name: 'Ramesh Tawde', status: 'Submitted', date: '2026-11-14T14:00:00' },
      { level: 'HOD Approval', name: 'Rajesh Patel (VP Ops)', status: 'Pending', date: null, remarks: '' },
      { level: 'Finance Approval', name: 'Priya Nair (Finance Head)', status: 'Pending', date: null, remarks: '' }
    ],
    isConvertedToRfp: false,
    linkedRfpId: null,
    attachments: ['Safety_Standard_Spec_2026.pdf'],
    createdAt: '2026-11-14',
  }
];

export const INITIAL_RFPS = [
  {
    id: 'RFP-2026-001',
    rfpNumber: 'RFP-2026-001',
    title: 'Supply and Commissioning of 5-Axis Precision CNC Milling Machine',
    linkedPiId: 'PI-2026-001',
    linkedPiNumber: 'PI-2026-001',
    department: 'Manufacturing Operations',
    budgetEstimate: 4500000,
    submissionDueDate: '2026-10-25',
    termsAndConditions: '1. Delivery within 6 weeks of PO. 2. Standard 2-year warranty with 4 free quarterly PM services. 3. 10% retention until successful trial run. 4. Liquidated damages 0.5% per week of delay.',
    attachments: ['Tender_Specs_CNC_5Axis.pdf', 'Commercial_Terms_Aakshya.pdf'],
    invitedVendorIds: ['VND-001', 'VND-005'],
    status: 'Awarded',
    winningVendorId: 'VND-001',
    winningVendorName: 'Apex Industrial Solutions Pvt Ltd',
    responses: [
      {
        id: 'RESP-001-APX',
        vendorId: 'VND-001',
        vendorName: 'Apex Industrial Solutions Pvt Ltd',
        unitPrice: 2125000,
        totalPrice: 4250000,
        deliveryTimelineWeeks: 5,
        proposalDoc: 'Apex_Technical_Commercial_Proposal.pdf',
        commercialResponse: 'Payment: Net 30 days post GRN. 100% compliant with LD clause and 2-year comprehensive on-site warranty included.',
        technicalResponse: 'Complies with all Siemens 840D specifications; includes high-pressure CTS (coolant through spindle) and 30-tool ATC upgrade.',
        submittedAt: '2026-10-18T16:45:00',
        status: 'Selected',
        evaluationNotes: 'Lowest price (L1) and superior spindle warranty. Past performance score: 98%.',
      },
      {
        id: 'RESP-002-PRC',
        vendorId: 'VND-005',
        vendorName: 'Precision Tools & Dies India',
        unitPrice: 2240000,
        totalPrice: 4480000,
        deliveryTimelineWeeks: 7,
        proposalDoc: 'Precision_Bid_Proposal.pdf',
        commercialResponse: 'Payment: 30% advance, 70% against delivery. Standard 1-year warranty.',
        technicalResponse: 'Fanuc 31i-MB controller offered. 24-tool ATC.',
        submittedAt: '2026-10-22T11:20:00',
        status: 'Disqualified',
        evaluationNotes: 'L2 bid. Demanded 30% advance which violates Aakshya procurement policy.',
      }
    ],
    createdAt: '2026-10-05',
  },
  {
    id: 'RFP-2026-002',
    rfpNumber: 'RFP-2026-002',
    title: 'Enterprise Rack Servers and 100G Leaf-Spine Switchgear',
    linkedPiId: 'PI-2026-002',
    linkedPiNumber: 'PI-2026-002',
    department: 'IT Infrastructure & Security',
    budgetEstimate: 2850000,
    submissionDueDate: '2026-11-28',
    termsAndConditions: '1. OEM authorization certificate required. 2. 5-year 24x7 4-hour response mission critical support. 3. Delivery to Pune Data Center.',
    attachments: ['Server_Architecture_RFP.pdf'],
    invitedVendorIds: ['VND-002', 'VND-001'],
    status: 'Open for Bidding',
    winningVendorId: null,
    winningVendorName: null,
    responses: [
      {
        id: 'RESP-003-NEX',
        vendorId: 'VND-002',
        vendorName: 'NexGen Tech Innovations LLP',
        unitPrice: 446666,
        totalPrice: 2680000,
        deliveryTimelineWeeks: 3,
        proposalDoc: 'NexGen_HPE_Dell_Solution.pdf',
        commercialResponse: 'Net 45 days. 5-year ProSupport Plus with 4-hr on-site SLA.',
        technicalResponse: 'Dual Intel Xeon 8480+ Platinum, 512GB DDR5, 4x 3.84TB Enterprise NVMe.',
        submittedAt: '2026-11-14T10:30:00',
        status: 'Submitted',
        evaluationNotes: 'Under review by IT Infrastructure committee.',
      }
    ],
    createdAt: '2026-11-10',
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'PO-2026-001',
    poNumber: 'PO-2026-001',
    rfpId: 'RFP-2026-001',
    rfpNumber: 'RFP-2026-001',
    piId: 'PI-2026-001',
    piNumber: 'PI-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Apex Industrial Solutions Pvt Ltd',
    items: [
      {
        name: '5-Axis Precision CNC Milling Machine (Siemens 840D)',
        description: 'Complete with high-speed spindle, 30-tool ATC, tooling package and commissioning',
        quantity: 2,
        unit: 'Units',
        unitPrice: 2125000,
        totalPrice: 4250000,
      }
    ],
    subtotal: 4250000,
    taxRate: 18,
    taxAmount: 765000,
    totalAmount: 5015000,
    deliveryDate: '2026-11-25',
    paymentTerms: 'Net 30 days after GRN Acceptance',
    billingAddress: 'Aakshya Group Corporate Office, Senapati Bapat Road, Pune, MH 411016',
    shippingAddress: 'Aakshya Group Plant 3, Chakan Industrial Phase 2, Pune, MH 410501',
    status: 'Accepted',
    vendorResponseNote: 'PO acknowledged. Manufacturing line scheduled; delivery on track.',
    clarifications: [],
    issuedAt: '2026-10-26T10:00:00',
    acceptedAt: '2026-10-27T11:30:00',
  },
  {
    id: 'PO-2026-002',
    poNumber: 'PO-2026-002',
    rfpId: null,
    rfpNumber: 'Direct Catalog Purchase',
    piId: null,
    piNumber: 'PI-2026-005',
    vendorId: 'VND-002',
    vendorName: 'NexGen Tech Innovations LLP',
    items: [
      {
        name: 'Enterprise Firewall Appliance & Core Switches',
        description: 'Next-gen firewall with 3-year unified threat management bundle',
        quantity: 2,
        unit: 'Units',
        unitPrice: 725000,
        totalPrice: 1450000,
      }
    ],
    subtotal: 1450000,
    taxRate: 18,
    taxAmount: 261000,
    totalAmount: 1711000,
    deliveryDate: '2026-12-05',
    paymentTerms: 'Net 30 days',
    billingAddress: 'Aakshya Group Corporate Office, Pune, MH 411016',
    shippingAddress: 'Aakshya Tech Center, Hinjewadi Phase 1, Pune, MH 411057',
    status: 'Issued',
    vendorResponseNote: '',
    clarifications: [
      { sender: 'Vendor', message: 'Kindly confirm if the required power cables are 16A Indian standard or C19/C20 cords?', timestamp: '2026-11-15T15:20:00' }
    ],
    issuedAt: '2026-11-15T09:00:00',
    acceptedAt: null,
  }
];

export const INITIAL_DISPATCHES = [
  {
    id: 'DSP-2026-001',
    dispatchNumber: 'DSP-2026-001',
    poId: 'PO-2026-001',
    poNumber: 'PO-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Apex Industrial Solutions Pvt Ltd',
    dispatchDate: '2026-11-08',
    transporter: 'BlueDart Apex Freight',
    trackingNumber: 'BD-IN-98432109',
    vehicleNumber: 'MH-14-GH-8821',
    packagesCount: 4,
    expectedDeliveryDate: '2026-11-12',
    status: 'Delivered',
    packingSlipDoc: 'Apex_Packing_Slip_984.pdf',
    shippingRemarks: 'Heavy machinery crated in export wooden pallets with shock sensors.',
    statusTimeline: [
      { status: 'Ready for Dispatch', timestamp: '2026-11-06T15:00:00' },
      { status: 'Dispatched', timestamp: '2026-11-08T09:30:00' },
      { status: 'In Transit', timestamp: '2026-11-09T14:00:00' },
      { status: 'Delivered', timestamp: '2026-11-12T11:45:00' },
    ]
  },
  {
    id: 'DSP-2026-002',
    dispatchNumber: 'DSP-2026-002',
    poId: 'PO-2026-002',
    poNumber: 'PO-2026-002',
    vendorId: 'VND-002',
    vendorName: 'NexGen Tech Innovations LLP',
    dispatchDate: '2026-11-15',
    transporter: 'VRL Logistics Tech Express',
    trackingNumber: 'VRL-EXP-44129',
    vehicleNumber: 'KA-03-AB-4921',
    packagesCount: 3,
    expectedDeliveryDate: '2026-11-18',
    status: 'In Transit',
    packingSlipDoc: 'NexGen_Challan_4412.pdf',
    shippingRemarks: 'Fragile electronic equipment. Keep upright.',
    statusTimeline: [
      { status: 'Ready for Dispatch', timestamp: '2026-11-14T17:00:00' },
      { status: 'Dispatched', timestamp: '2026-11-15T10:15:00' },
      { status: 'In Transit', timestamp: '2026-11-15T18:00:00' },
    ]
  }
];

export const INITIAL_GRNS = [
  {
    id: 'GRN-2026-001',
    grnNumber: 'GRN-2026-001',
    poId: 'PO-2026-001',
    poNumber: 'PO-2026-001',
    dispatchId: 'DSP-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Apex Industrial Solutions Pvt Ltd',
    quantityOrdered: 2,
    quantityReceived: 2,
    quantityAccepted: 2,
    quantityRejected: 0,
    qualityCheckResult: 'Passed',
    inspectionRemarks: 'Physical inspection completed. No transit damage. All geometric alignment checks and spindle test run passed satisfactorily.',
    inspectorName: 'Vikram Singh (Quality & Stores Lead)',
    status: 'GRN Approved',
    rejectionReason: null,
    invoiceCreated: true,
    linkedInvoiceId: 'INV-2026-001',
    createdAt: '2026-11-12T15:30:00',
  },
  {
    id: 'GRN-2026-002',
    grnNumber: 'GRN-2026-002',
    poId: 'PO-2026-001',
    poNumber: 'PO-2026-001',
    dispatchId: 'DSP-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Apex Industrial Solutions Pvt Ltd',
    quantityOrdered: 10,
    quantityReceived: 10,
    quantityAccepted: 0,
    quantityRejected: 10,
    qualityCheckResult: 'Failed',
    inspectionRemarks: 'Batch of auxiliary cutting tool holders had incorrect taper shank (BT40 instead of required BT50 specified in PO). Material quarantined.',
    inspectorName: 'Vikram Singh (Quality & Stores Lead)',
    status: 'Return Initiated',
    rejectionReason: 'Wrong Item',
    invoiceCreated: false,
    linkedInvoiceId: null,
    createdAt: '2026-11-04T12:00:00',
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    invoiceNumber: 'APX-2026-INV-9902',
    invoiceDate: '2026-11-13',
    poId: 'PO-2026-001',
    poNumber: 'PO-2026-001',
    grnId: 'GRN-2026-001',
    grnNumber: 'GRN-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Apex Industrial Solutions Pvt Ltd',
    baseAmount: 4250000,
    cgstAmount: 382500,
    sgstAmount: 382500,
    igstAmount: 0,
    taxAmount: 765000,
    totalAmount: 5015000,
    paymentDueDate: '2026-12-13',
    attachmentDoc: 'Apex_Tax_Invoice_9902.pdf',
    threeWayMatchStatus: 'Matched',
    matchDetails: {
      poAmount: 5015000,
      grnAcceptedQty: 2,
      invoiceQty: 2,
      priceVariance: 0,
      quantityVariance: 0,
    },
    status: 'Approved for Payment',
    financeReviewRemarks: '3-way matching verified against PO-2026-001 and approved GRN-2026-001. No price or quantity discrepancies.',
    reviewedBy: 'Priya Nair (Finance Head)',
    paymentCreated: true,
    linkedPaymentId: 'PAY-2026-001',
    createdAt: '2026-11-13T10:15:00',
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-2026-001',
    paymentNumber: 'PAY-2026-001',
    invoiceId: 'INV-2026-001',
    invoiceNumber: 'APX-2026-INV-9902',
    poNumber: 'PO-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Apex Industrial Solutions Pvt Ltd',
    amount: 5015000,
    paymentTerms: 'Net 30 days after GRN Acceptance',
    dueDate: '2026-12-13',
    scheduledDate: '2026-11-20',
    processedDate: null,
    paymentMode: 'RTGS',
    sourceAccount: 'Aakshya Group Corporate - HDFC Bank (A/c ...8812)',
    beneficiaryAccount: 'Apex Industrial - HDFC Bank (A/c ...1290, IFSC HDFC0000240)',
    utrNumber: '',
    status: 'Scheduled',
    vendorAcknowledged: false,
    acknowledgedAt: null,
    notes: 'Scheduled for upcoming Thursday corporate payment batch.',
  },
  {
    id: 'PAY-2025-089',
    paymentNumber: 'PAY-2025-089',
    invoiceId: 'INV-HIST-089',
    invoiceNumber: 'STR-INV-4412',
    poNumber: 'PO-2025-072',
    vendorId: 'VND-003',
    vendorName: 'Sterling Logistics & Freight Solutions',
    amount: 840000,
    paymentTerms: 'Net 30 days',
    dueDate: '2026-10-15',
    scheduledDate: '2026-10-15',
    processedDate: '2026-10-15',
    paymentMode: 'NEFT',
    sourceAccount: 'Aakshya Group Corporate - HDFC Bank',
    beneficiaryAccount: 'Sterling Logistics - Axis Bank (A/c ...2019)',
    utrNumber: 'HDFCR520261015891230',
    status: 'Paid',
    vendorAcknowledged: true,
    acknowledgedAt: '2026-10-16T14:00:00',
    notes: 'Completed successfully.',
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    title: 'New Vendor Registration Submitted',
    message: 'Bharat Electricals & Switchgear Corp has submitted their onboarding form for review.',
    type: 'vendor_approval',
    roleTarget: 'procurement',
    timestamp: '2026-11-12T14:45:00',
    read: false,
    actionRoute: 'vendors',
  },
  {
    id: 'NOTIF-002',
    title: 'GRN Approved - Invoice Enabled',
    message: 'GRN-2026-001 approved by Stores. Apex Industrial is now eligible to submit Invoice.',
    type: 'grn_approved',
    roleTarget: 'all',
    timestamp: '2026-11-12T15:35:00',
    read: false,
    actionRoute: 'invoices',
  },
  {
    id: 'NOTIF-003',
    title: 'Invoice Approved for Payment',
    message: 'Invoice APX-2026-INV-9902 (₹50,15,000) approved by Priya Nair. Ready for payment scheduling.',
    type: 'invoice_approved',
    roleTarget: 'finance',
    timestamp: '2026-11-13T10:15:00',
    read: false,
    actionRoute: 'payments',
  },
  {
    id: 'NOTIF-004',
    title: 'New RFP Quote Received',
    message: 'NexGen Tech Innovations submitted quotation for RFP-2026-002 (₹26,80,000).',
    type: 'rfp_bid',
    roleTarget: 'procurement',
    timestamp: '2026-11-14T10:30:00',
    read: true,
    actionRoute: 'rfp',
  }
];

export const INITIAL_SIMULATED_EMAILS = [
  {
    id: 'EML-001',
    to: 'procurement-desk@zenithchem.com',
    from: 'onboarding@aakshyagroup.com',
    subject: 'Action Required: Vendor Onboarding Invitation - Aakshya Group',
    preview: 'Dear Partner, Aakshya Group invites you to register as an approved vendor on our P2P platform...',
    body: `Dear Partner at Zenith Raw Materials & Chemicals Ltd,

Aakshya Group is pleased to invite your organization to register as an approved vendor on our digital Vendor Collaboration and Procure-to-Pay (P2P) Platform.

Please complete your company profile, bank information, and compliance document uploads at the link below:

Registration Link: https://p2p.aakshyagroup.com/vendor-register?token=INV-ZENITH-2026-8891

Your prompt completion will allow us to issue RFPs and Purchase Orders directly.

Best regards,
Aakshya Group Procurement Team`,
    timestamp: '2026-11-15T09:15:00',
    category: 'Onboarding Invitation',
    token: 'INV-ZENITH-2026-8891',
    actionType: 'open_registration',
  },
  {
    id: 'EML-002',
    to: 'contact@apexindustrial.com',
    from: 'procurement@aakshyagroup.com',
    subject: 'Purchase Order Issued: PO-2026-001 - Aakshya Group',
    preview: 'Purchase Order PO-2026-001 has been issued for 5-Axis Precision CNC Milling Machine (Value: ₹50,15,000)...',
    body: `Dear Apex Industrial Solutions Pvt Ltd,

We are pleased to inform you that Purchase Order PO-2026-001 has been formally issued against your quotation for RFP-2026-001.

PO Number: PO-2026-001
Total Value: ₹50,15,000 (Incl. 18% GST)
Delivery Due Date: 25-Nov-2026

Please log in to your Vendor Portal to accept this Purchase Order and coordinate dispatch.

Regards,
Procurement Desk, Aakshya Group`,
    timestamp: '2026-10-26T10:00:00',
    category: 'Purchase Order',
    actionType: 'open_po',
    targetId: 'PO-2026-001',
  },
  {
    id: 'EML-003',
    to: 'contact@apexindustrial.com',
    from: 'finance@aakshyagroup.com',
    subject: 'Remittance Advice & Payment Scheduled: PAY-2026-001',
    preview: 'Payment of ₹50,15,000 has been scheduled for Invoice APX-2026-INV-9902 via RTGS...',
    body: `Dear Apex Industrial Solutions,

This is to advise that payment has been scheduled for your invoice APX-2026-INV-9902.

Payment Ref: PAY-2026-001
Amount: ₹50,15,000
Beneficiary A/c: HDFC Bank (...1290)
Mode: RTGS

You can track execution status and download your formal Remittance Advice in the Vendor Portal.

Regards,
Treasury & Accounts, Aakshya Group`,
    timestamp: '2026-11-13T11:00:00',
    category: 'Payment Remittance',
    actionType: 'open_payments',
    targetId: 'PAY-2026-001',
  }
];
