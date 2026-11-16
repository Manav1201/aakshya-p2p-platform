# Aakshya Group - Vendor Collaboration & Procure-to-Pay (P2P) Platform

An enterprise-grade, digital Vendor Collaboration and Procure-to-Pay (P2P) platform built for **Aakshya Group**. The solution eliminates manual email chains and paper trails, connecting internal procurement, finance, operations, and warehouse teams with external suppliers through a centralized, high-transparency digital hub.

---

## 🌟 Key Features & Complete 8-Module Lifecycle

```
Vendor Onboarding & Master
       ↓
Purchase Indent (PI) & Hierarchical Approvals
       ↓
RFP / RFQ Management & Vendor Quotations
       ↓
Side-by-Side Quotation Evaluation & Award Matrix
       ↓
Purchase Order (PO) & Bidirectional Collaboration
       ↓
Shipment Dispatch & Real-Time AWB Tracking
       ↓
Goods Receipt Note (GRN) & Quality Inspection (Flow A & B)
       ↓
3-Way Match Invoicing (PO vs GRN vs Tax Invoice)
       ↓
Treasury Payment Execution (RTGS/NEFT/UTR) & Remittance
```

### 1. Module 1: Vendor Onboarding & Master Management
- **Dual Onboarding Paths**:
  - **Option 1 (Manual Admin Creation)**: Direct input of vendor legal entity, GSTIN, PAN, bank info, and compliance certificates.
  - **Option 2 (Digital Invitation)**: Generates a secure registration token (e.g. `INV-ZENITH-2026-8891`) and dispatches a simulated onboarding email with a direct link.
- **Vendor Status Machine**: `Invitation Sent` → `Registration In Progress` → `Submitted for Approval` → `Correction Requested` → `Approved` → `Onboarded`.
- **4-Step Self-Service Registration Wizard**: Company details, contact details, bank accounts, and compliance document uploads (GST, PAN, Cancelled Cheque, MSME, Incorporation).
- **Admin Review Actions**: Approve to Vendor Master, Request Correction with reviewer notes, or Reject.
- **Vendor Master**: Complete directory with audit history, verified documents vault, and compliance ratings.

### 2. Module 2: Purchase Indent (PI) & Multi-Level Approvals
- Requisition creation capturing department, project name, item specifications, quantity, estimated cost, and required delivery date.
- **Sequential Multi-Level Sign-Off Workflow**: Requester Submitted → Operations HOD Approval → Finance Manager Capex Approval → Approved PI.
- **"Convert to RFP"** action unlocks only once a PI is fully approved.

### 3. Module 3: RFP / RFQ Management & Bid Evaluation
- Tender creation pre-populated from approved PIs with multi-vendor invitations from the Vendor Master.
- Submission deadline countdown, scope of work, and commercial terms.
- Vendor quotation submissions with commercial pricing, lead time, and technical proposals.
- **Quotation Comparison Matrix**: Automatic price ranking (L1, L2), budget variance percentage calculation, and winner selection.

### 4. Module 4: Purchase Order (PO) Management
- Automated PO generation from the winning vendor quotation.
- 3-Way linkage to PI, RFP, and Vendor Master.
- Vendor Portal actions: **Accept PO**, **Reject PO**, and **Raise Clarification / Query** with threaded messaging.

### 5. Module 5: Dispatch & Consignment Tracking
- Vendor shipment updates capturing Dispatch Date, Transporter, Tracking Number (AWB), Vehicle Number, and Packages.
- Lifecycle tracking: `Ready for Dispatch` → `Dispatched` → `In Transit` → `Delivered`.
- Aakshya gate monitoring with milestone timeline and direct handover to Stores.

### 6. Module 6: Goods Receipt Note (GRN) & QA Inspection
- Stores physical receiving capturing Quantity Ordered, Received, Accepted, and Rejected.
- **Flow A – Accepted (Passed)**: Status `GRN Approved`, Finance and Vendor notified, unlocks 3-way match invoice generation.
- **Flow B – Rejected (Failed)**: Rejection reasons (*Quantity Mismatch*, *Damaged Material*, *Quality Issue*, *Wrong Item*), status `Return Initiated` / `Replacement Awaited`.

### 7. Module 7: 3-Way Match Invoice Management
- Strict 3-Way Match Rule: Invoices can **only** be generated against an **Approved GRN**.
- Automated validation of PO unit prices and GRN accepted quantities.
- GST tax calculation (CGST, SGST, IGST) and signed invoice PDF attachment.
- Finance review & authorization: `Submitted` → `Under Review` → `Approved for Payment`.

### 8. Module 8: Treasury & Payment Processing
- Review of approved invoices, payment terms, and due dates.
- Payment scheduling and electronic disbursement (RTGS, NEFT, IMPS) with bank UTR number logging.
- Status progression: `Scheduled` → `Processed` → `Paid`.
- Downloadable formal Remittance Advice voucher and one-click vendor receipt acknowledgement.

---

## 👥 Interactive Persona Switcher

Switch instantly between roles from the top navigation bar to experience different perspectives:
1. 👔 **Anita Sharma** — *Procurement Specialist* (Central Procurement Desk)
2. 🛡️ **Rajesh Patel** — *Operations HOD* (Manufacturing Operations)
3. 💰 **Priya Nair** — *Finance Manager* (Corporate Finance & Treasury)
4. 📦 **Vikram Singh** — *Stores & Quality Lead* (Central Warehouse & QA)
5. 🏢 **Arun Kumar Singhania** — *Vendor Representative* (Apex Industrial Solutions)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React Icons
- **State Management**: Reactive React Context with persistent LocalStorage state engine
- **Typography**: Inter & JetBrains Mono (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone <your-repository-url>

# Navigate into the project directory
cd aakshya-p2p-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
Proprietary & Confidential - Built for Aakshya Group.
