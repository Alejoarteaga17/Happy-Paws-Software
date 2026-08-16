
### Prepared For
* **Company:** Happy Paws Veterinary Clinic
* **Contact Name:** Pepito Perez
* **Address:** EAFIT University
* **Phone:** +57...
* **Email:** ...@eafit.edu.co

---

### Prepared By
* **Company:** AACCode
* **Authors / Team:**
  * Camila Vélez
  * Alejandra Suarez
  * Alejandro Arteaga
* **Contact Name:** Software Solutions SAS
* **Address:** EAFIT University
* **Phone:** +57 ...
* **Email:** aarteagah@eafit.edu.co

---

### Project Information
* **Project Name:** Happy Paws Software
* **Submitted To:** ...
* **Submitted By:** AACCode
* **Estimated Start Date:** August 6, 2026
* **Estimated Finish Date:** November 5, 2026

---

## 3.1 Project Overview
- Happy Paws Veterinary Clinic relies on paper-based workflows that slow down daily operations and hurt client confidence. Receptionists and veterinarians lose critical time locating physical pet files during appointments, and inconsistent note-taking leads to scattered medical histories. Additionally, manual vaccination tracking causes missed follow-ups, reducing recurring patient care. The clinic needs a centralized internal system to streamline patient records and automate care tracking without introducing unnecessary operational overhead.

## 3.2 Purpose & Goals
### Purpose 
- The primary purpose of this project is to design, develop, and deliver a fully functional internal web application for Happy Paws Veterinary Clinic. The software aims to replace paper-reliant processes with a digitized system for managing pet profiles, appointment logs, and vaccination tracking, while providing a clear test environment to validate core workflows prior to deployment.

### Goals
- Digitize Core Records: Centralize owner and pet profiles to allow instant lookup and eliminate physical paper folder reliance.
- Improve Care Continuity: Implement vaccination due-date tracking and clear appointment summaries to prevent missed follow-ups.  
- Ensure Functional Quality & Testing: Establish structured test cases and operational scenarios to thoroughly test system reliability and user flows for receptionists, veterinarians, and clinic managers.  
- Deliver Lightweight Internal Tooling: Build an easy-to-use, non-complex interface tailored strictly for internal staff without unnecessary operational overhead.

## 3.3 Scope of Work
The scope of work for **Happy Paws Care Central** focuses on delivering a functional Minimum Viable Product (MVP) tailored to internal clinic operations:

* Pet & Owner Profile Management: Centralized system to create, update, and search client records and pet profiles linked by owner details.
* Appointment Logging & Clinical Notes: Record daily visits, reason for appointments, and veterinarian clinical notes in a structured format.
* Vaccination & Care Tracking: Dedicated tracking module to log vaccination history and highlight upcoming or overdue care actions.
* Role-Based Access Control: Distinct views and permissions for Receptionists, Veterinarians, and Clinic Managers.
* Operational Documentation & Test Cases: Complete operational guide, documented sensitive data handling policies, and test cases for core workflow validation.

## 3.4 Out of Scope
To ensure clear project boundaries and a focused MVP delivery, the following features and capabilities are explicitly excluded from this phase of the project:

* E-Commerce & Billing: Online store functionality, product sales, inventory management, or payment gateway integrations.
* Telemedicine & Client Services: Patient portals, remote consultations, virtual visits, or client-facing messaging tools.
* Complex Notification Systems: Automated SMS, automated email triggers, or external messaging integrations (beyond basic, documented UI placeholders).
* Full Regulatory Compliance Tooling: Advanced compliance frameworks, HIPAA/GDPR audit tools, or complex regulatory software suites.

## 3.5 Obstacles & Risks
* Inconsistent Paper Record Migration: Legacy paper records may contain missing, contradictory, or unreadable historical data, leading to incomplete digital pet profiles upon initial setup.
* Staff Adoption & Workflow Friction: Clinic staff accustomed to traditional paper folders may experience a learning curve when adopting new digital logging workflows during busy appointment hours.
* Limited Wi-Fi & Connectivity Instability: Intermittent local network connectivity within the clinic could disrupt real-time access to patient files and appointment logs during active care.
* Scope Creep Regarding Client Notifications: Stakeholders may request active SMS or email reminders, which risks expanding the project beyond the intended simple placeholder architecture.
* Data Privacy & Sensitive Record Handling: Improper handling or exposure of owner contact details and patient medical notes requires careful operational protocol documentation without adding complex compliance tools.

## 3.6 Timeline/Milestones

### Overview

The development of **Happy Paws Care Central** follows a structured **13-week iterative Agile cycle** divided into four major phases. This approach ensures early validation of critical workflows—such as Owner/Pet lookup and Visit logging—while reserving dedicated time for QA testing, operational documentation, and user acceptance testing (UAT) prior to final deployment.

---

### Project Phases & Sprint Breakdown

#### Phase 1: Requirements Analysis & System Setup (Weeks 1–2 | Aug 06 – Aug 20)
*   **Focus:** Environment setup, technical architecture, and requirement alignment.
*   **Key Activities:**
    *   Initialize GitHub repository, folder structure, and development environments.
    *   Define database schema (ERD) for `Owners`, `Pets`, `Appointments`, `Vaccinations`, and `Users`.
    *   Establish Sensitive Data Handling Guidelines (`/docs/sensitive-data-policy.md`).

#### Phase 2: Core MVP Feature Development (Weeks 3–9 | Aug 21 – Oct 08)
*   **Focus:** Iterative development of core application modules.
*   **Key Activities:**
    *   **(Weeks 3–4):** Pet & Owner Management module (Create, edit, search owners/pets).
    *   **(Weeks 5–6):** Appointment Logging & Clinical Notes interface.
    *   **(Weeks 7–8):** Automated Vaccination Status Tracking Dashboard & Static Reminders UI.
    *   **(Week 9):** Role-Based Access Control (RBAC) implementation (Receptionist, Vet, Manager).

#### Phase 3: Testing, QA & Staging Deployment (Weeks 10–11 | Oct 09 – Oct 23)
*   **Focus:** Quality validation and user acceptance setup.
*   **Key Activities:**
    *   Deploy MVP application to a staging cloud environment populated with sample data.
    *   Execute End-to-End (E2E) test cases covering all primary workflows (lookup, visit logs, care tracking).
    *   Conduct bug triage and fix critical issues (targeting $\ge 95\%$ test pass rate).

#### Phase 4: Final Handover & Operational Sign-off (Weeks 12–13 | Oct 24 – Nov 05)
*   **Focus:** Training, operational documentation, and project completion.
*   **Key Activities:**
    *   Conduct User Acceptance Testing (UAT) review with Pepito Perez and clinic staff.
    *   Deliver end-user operational guides and system test reports.
    *   Obtain official client sign-off and execute final handover.

---

### Key Project Milestones

| Milestone ID | Target Date | Milestone Name | Description & Key Deliverable |
| :---: | :---: | :--- | :--- |
| **M1** | **Aug 20, 2026** | **Setup & Architecture** | Repository initialized, ERD finalized, and `.env` template configured. |
| **M2** | **Sep 03, 2026** | **Pet & Owner Module** | Owner registration and dynamic search lookup ($< 2$s) fully functional. |
| **M3** | **Sep 17, 2026** | **Clinical Visit Logging** | Standardized appointment notes interface completed and linked to pet profiles. |
| **M4** | **Oct 01, 2026** | **Care Tracker & RBAC** | Vaccination dashboard with status badges and RBAC permissions integrated. |
| **M5** | **Oct 23, 2026** | **Staging & QA Completion** | App deployed to staging URL with $>95\%$ E2E test case pass rate. |
| **M6** | **Nov 05, 2026** | **Final Project Handover** | Operational documentation delivered, UAT approved, and contract signed off. |


