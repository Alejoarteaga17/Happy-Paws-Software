# Statement Of Work


Contents:

- [Introduction](#introduction)
- [Statement of work template](#statement-of-work-template)
  - [Title](#title)
  - [Abstract](#abstract)
  - [Value](#value)
  - [Scope](#scope)
  - [Payment](#payment)
- [Purpose](#purpose)
  - [Objectives](#objectives)
  - [Performance](#performance)
- [Who does what](#who-does-what)
  - [People](#people)
  - [Roles](#roles)
  - [Responsibilities](#responsibilities)
- [Context](#context)
  - [Present](#present)
  - [Future](#future)
- [Planning](#planning)
  - [Requirements](#requirements)
- [Other terms and conditions](#other-terms-and-conditions)
  - [Client's obligations](#clients-obligations)
- [Schedule](#schedule)
  - [Expected start date and completion date](#expected-start-date-and-completion-date)
  - [Sign-off](#sign-off)

# Statement Of Work (SOW)

---

## 1. Introduction

### Title
**Statement of Work for Happy Paws Care Central Internal Web Application**

### Abstract
This Statement of Work (SOW) outlines the objectives, scope, deliverables, roles, and timelines for the design, development, and implementation of **Happy Paws Care Central**, an internal web application for **Happy Paws Veterinary Clinic**. The project aims to eliminate paper-reliant workflows, centralize owner and pet profiles, streamline appointment logging, and automate vaccination tracking. The vendor, **AACCode**, will be responsible for the full software development lifecycle, including system architecture, core MVP development, role-based workflows, unit/system testing, operational documentation, and final handover. The project will run for 13 weeks (from August 6, 2026, to November 5, 2026) with key milestones linked to iterative delivery. The agreed budget and payment terms ensure clear accountability and functional quality before final deployment.

### Value
The estimated value of the work outlined in this SOW is based on a fixed project budget designed for the custom development of the **Happy Paws Care Central** MVP. This covers requirements analysis, software architecture, UI/UX design, core module development (Pet/Owner Management, Appointment Logs, and Vaccination Tracking), Role-Based Access Control (RBAC) implementation, QA testing, operational documentation, and post-deployment handover. Payments will be distributed across key project milestones to align expenses with verified project progress. Any scope additions or post-MVP feature expansions beyond this agreement will be subject to a separate Change Request and billed accordingly.

### Scope
The scope of this project encompasses the end-to-end development and deployment of a lightweight, internal web application for Happy Paws Veterinary Clinic. The work includes centralizing pet and owner profiles for rapid search, establishing a structured appointment and clinical notes log, building a care and vaccination status tracking dashboard, and implementing role-based views for Receptionists, Veterinarians, and Clinic Managers. The project requires collaboration between AACCode’s development team and key clinic stakeholders (Pepito Perez and internal staff). Excluded from this phase are e-commerce, payment processing, client-facing portals, active SMS/email notifications, and complex compliance auditing suites. Work will be delivered iteratively following Agile and DataOps practices over a 13-week period.

### Payment
The total project fee will be paid in installments tied directly to four major project milestones. An initial deposit of 20% is due upon contract sign-off to initiate requirements gathering and architectural setup. Subsequent payments are structured as follows: 30% upon completion and approval of Core MVP Modules (Pet/Owner & Visit Logging), 30% upon delivery of Vaccination Tracking, RBAC, and QA System Test Cases, and the final 20% upon successful system handover, operational documentation approval, and sign-off. Invoices will be issued upon milestone acceptance and are payable via electronic bank transfer within 15 business days.

---

## 2. Purpose

### Objectives
The primary objective of this project is to design, build, and deploy a secure, responsive, lightweight internal web application that replaces Happy Paws Veterinary Clinic’s manual paper files with a centralized digital system.

#### Objectives & Key Results (OKRs)

*   **Objective 1: Digitize Core Clinic Operations & Patient Records**
    *   *KR 1.1:* 100% of new patient check-ins and appointments recorded digitally during system validation.
    *   *KR 1.2:* Reduce average pet file lookup time from minutes to under 5 seconds via centralized search (by owner name, phone, or pet tag).
*   **Objective 2: Enhance Care Continuity & Preventative Tracking**
    *   *KR 2.1:* Implement a real-time vaccination dashboard highlighting 100% of overdue and upcoming care follow-ups.
    *   *KR 2.2:* Eliminate paper note variance by introducing standardized clinical note templates for veterinarians.
*   **Objective 3: Deliver High Quality & Functional Reliability**
    *   *KR 3.1:* Complete 100% execution of predefined test cases across all core workflows prior to final handover.
    *   *KR 3.2:* Achieve zero critical security or data-handling vulnerabilities during internal acceptance testing.

---

## 3. Performance

### Key Performance Indicators (KPIs)

Project performance will be monitored through regular progress meetings, deliverable reviews, and technical evaluation against the following metrics:

#### Business & Operational Metrics
*   **Record Lookup Efficiency:** Search results for patient/owner queries returned in $< 2$ seconds on the internal network.
*   **Staff Adoption Rate:** At least 85% of target staff (receptionists and veterinarians) successfully complete simulated daily workflows without escalation during testing.
*   **Data Integrity Rate:** 100% adherence to defined data structures during form entry and patient profiling.

#### Technical & System Performance Metrics
*   **System Availability / Uptime:** Target of 99.5% uptime during operating clinic hours.
*   **Page Load Time:** Dashboard and patient profile pages load in $< 3$ seconds under standard operational load.
*   **Test Case Pass Rate:** Minimum of 95% pass rate across all documented test scenarios prior to final sign-off.

---

## 4. Who Does What

### People

#### Client Side — Happy Paws Veterinary Clinic
*   **Pepito Perez** — Primary Contact / Client Stakeholder
    *   *Location:* EAFIT University
    *   *Phone:* +57...
    *   *Email:* ...@eafit.edu.co

#### Vendor Side — AACCode (Software Solutions SAS)
*   **Camila Vélez** — Software Engineer / Team Member
    *   *Location:* EAFIT University
*   **Alejandra Suarez** — Software Engineer / Team Member
    *   *Location:* EAFIT University
*   **Alejandro Arteaga** — Primary Lead / Software Engineer
    *   *Location:* EAFIT University
    *   *Phone:* +57...
    *   *Email:* aarteagah@eafit.edu.co

---

### Roles

*   **Client Project Lead (Pepito Perez):** Represents clinic interests, provides domain requirements, approves deliverables, and coordinates internal feedback.
*   **Software Development Lead (Alejandro Arteaga):** Manages overall technical execution, client communication, architecture, and project delivery.
*   **Software Developers / QA Engineers (Camila Vélez, Alejandra Suarez):** Responsible for frontend/backend feature implementation, database modeling, UI integration, test case creation, and technical documentation.
*   **Clinic End-Users (Receptionists, Veterinarians, Clinic Managers):** Participate in workflow validation, provide feedback during operational test reviews, and execute acceptance testing.

---

### Responsibilities (RACIO Matrix)

> **Legend:**  
> **R** = Responsible (Does the work) | **A** = Accountable (Approves work) | **C** = Consulted (Provides input) | **I** = Informed (Kept updated) | **O** = Omitted (Not involved)

| Area of Responsibility / Task | Client Lead (Pepito Perez) | Dev Lead (A. Arteaga) | Dev Team (C. Vélez, A. Suarez) | Clinic Staff |
| :--- | :---: | :---: | :---: | :---: |
| **Requirements Clarification** | A | R | C | C |
| **System Architecture & DB Design** | I | A | R | O |
| **Pet & Owner Management Module** | I | A | R | I |
| **Appointment & Notes Logging** | I | A | R | C |
| **Vaccination Tracking Module** | I | A | R | C |
| **Role-Based Access Control (RBAC)**| I | A | R | O |
| **Test Cases & Operational Docs** | C | A | R | I |
| **User Acceptance Testing (UAT)** | A | C | C | R |
| **Final Deployment & Handover** | A | R | R | I |

---

## 5. Context

### Present
Happy Paws Veterinary Clinic currently relies on manual paper files to maintain pet medical histories, record appointment outcomes, and track preventative care schedules. This legacy workflow introduces operational bottlenecks: receptionists lose time physically locating folders, veterinarians record clinical notes in fragmented formats, and missed vaccination follow-ups lead to lost recurring care opportunities. 

The **Happy Paws Care Central** project introduces a modern, lightweight digital solution to eliminate paper dependence, centralize records, and streamline workflows without overburdening staff with unnecessary system complexity.

### Future
While the initial MVP focuses strictly on core internal clinic workflows, the application is designed with a scalable architecture to support future expansions, including:
*   Automated SMS and email notification triggers for client appointment reminders.
*   A client-facing pet owner portal for remote record viewing and appointment requests.
*   Data import utilities for historical paper archive digitizing.
*   Multi-branch support should the clinic expand to additional physical locations.

---

## 6. Planning

### Requirements

AACCode will complete the following tasks and deliver the associated milestones:

| Deliverable / Task | Description & Criteria for Completion | Method of Acceptance |
| :--- | :--- | :--- |
| **D1: Requirements & System Design** | Detailed functional architecture, database schemas, and wireframes for RBAC interfaces. | Written approval from Client Lead. |
| **D2: Pet & Owner Management** | Module for creating, updating, and searching client and pet profiles via name, phone, or tag. | Feature demonstration & test execution. |
| **D3: Appointment & Notes Log** | Formatted logging module for visit reasons, veterinarian notes, and medical records. | Feature demonstration & test execution. |
| **D4: Vaccination Tracker Dashboard** | Dashboard highlighting upcoming and overdue vaccinations/follow-ups with status tags. | Feature demonstration & test execution. |
| **D5: RBAC & Security Integration** | Implementation of distinct permissions and views for Receptionist, Vet, and Manager roles. | Security verification & test execution. |
| **D6: Test Cases & Operational Manual** | Documented QA test suite, data privacy operational protocols, and end-user guide. | Document review and sign-off. |
| **D7: Final Handover & Deployment** | Deployment to agreed staging/hosting environment and verified core user flows. | Final Sign-off Document signature. |

---

## 7. Other Terms and Conditions

### Client's Obligations
To ensure project delivery within the scheduled timeline, Happy Paws Veterinary Clinic agrees to:
*   Maintain the availability of **Pepito Perez** (or an authorized representative) for weekly check-ins and timely feedback.
*   Provide sample (anonymized) paper records and sample data structures within 5 business days of project kickoff.
*   Provide feedback or sign-off on delivered deliverables within five (5) working days of receipt.
*   Facilitate access to target end-users (receptionists, veterinarians) for operational testing and feedback sessions.
*   Ensure the clinic's local infrastructure meets basic Wi-Fi connectivity standards for browser-based access.

---

## 8. Schedule

### Expected Start Date and Completion Date
*   **Estimated Start Date:** August 6, 2026
*   **Estimated Finish Date:** November 5, 2026
*   **Total Duration:** 13 Weeks (Iterative Agile Cycle)


### Sign-off

NOTE: Before signing the Statement of Work, if you have any questions or
concerns, please call the Work Authority indicated above to negotiate any
issues.

If you agree to the requirements of this Statement of Work, please sign and date
the document which will be accepted as your proposal by Client, and return to my
attention.

Please return an original signature copy by mail.


Printed Name:

__________________________________________


Signature:

__________________________________________


Date:

__________________________________________
