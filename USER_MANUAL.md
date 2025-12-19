# NHMS - National Health Management System
## User Manual

**Version:** 2.0.0
**Last Updated:** December 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [System Requirements](#system-requirements)
4. [Login & Authentication](#login--authentication)
5. [Admin Portal](#admin-portal)
6. [Doctor Portal](#doctor-portal)
7. [Patient Portal](#patient-portal)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

NHMS (National Health Management System) is a comprehensive, enterprise-grade hospital management platform designed to streamline healthcare operations. The system provides three dedicated portals for different user roles:

- **Admin Portal** - For hospital administrators to manage staff, departments, billing, emergency triage, and monitor analytics
- **Doctor Portal** - For medical professionals to manage patients, appointments, prescriptions, lab tests, and vital signs
- **Patient Portal** - For patients to book appointments, view prescriptions, lab results, and access medical records

### Key Features

| Feature | Admin | Doctor | Patient |
|---------|:-----:|:------:|:-------:|
| Dashboard Analytics | Yes | Yes | Yes |
| User Management | Yes | - | - |
| Department Management | Yes | - | - |
| Billing & Invoicing | Yes | - | View Own |
| Emergency Triage | Yes | - | - |
| Audit Logs | Yes | - | - |
| Reports & Analytics | Yes | - | - |
| Hospital Settings | Yes | - | - |
| Regional Settings (Currency) | Yes | - | - |
| Schedule Management | - | Yes | - |
| Patient Management | Yes | Yes | - |
| Appointment Management | Yes | Yes | Yes |
| Prescription Management | - | Yes | Yes |
| Lab Test Management | - | Yes | Yes |
| Vital Signs Tracking | - | Yes | Yes |
| Medical Records | - | Yes | Yes |
| Profile Management | - | - | Yes |
| Book Appointments | - | - | Yes |

---

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd National-Health-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/nhms"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open `http://localhost:3000` in your browser

### Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Patient | patient@hospital.com | patient123 |

---

## System Requirements

### Server Requirements
- Node.js 18.x or higher
- MySQL 8.0 or higher
- 2GB RAM minimum
- 10GB disk space

### Browser Support
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

---

## Login & Authentication

### How to Login

1. Navigate to `http://localhost:3000/login`
2. Select your user type (Admin, Doctor, or Patient)
3. Enter your email address
4. Enter your password
5. Click **Sign In**

### Password Requirements
- Minimum 8 characters
- Mix of letters and numbers recommended

### Session Management
- Sessions expire after 24 hours of inactivity
- You will be automatically redirected to login when session expires

---

## Admin Portal

Access: `http://localhost:3000/admin`

### Dashboard

The admin dashboard provides a comprehensive overview of hospital operations.

**Key Metrics Displayed:**
- Total Patients
- Total Doctors
- Today's Appointments
- Monthly Revenue

**Charts & Visualizations:**
- Weekly Appointment Trends (Bar Chart)
- Monthly Revenue Overview (Area Chart)
- Appointment Distribution by Department (Pie Chart)

### Managing Doctors

**Location:** Admin Portal -> Doctors

#### Add New Doctor
1. Click **Add Doctor** button
2. Fill in the required information:
   - Full Name
   - Email Address
   - Phone Number
   - Department
   - Specialization
   - Consultation Fee
3. Click **Save** to create the doctor account

#### Edit Doctor
1. Find the doctor in the list
2. Click the **Edit** (pencil) icon
3. Update the necessary fields
4. Click **Save Changes**

### Managing Patients

**Location:** Admin Portal -> Patients

#### View All Patients
1. Navigate to **Patients** from the sidebar
2. Search patients by name or email
3. Filter by blood group if needed

### Billing & Invoicing

**Location:** Admin Portal -> Billing

#### View All Invoices
1. Navigate to **Billing** from the sidebar
2. View invoices with status: Paid, Pending, Overdue
3. Use filters to find specific invoices

#### Create Invoice
1. Click **Create Invoice** button
2. Select patient
3. Add line items (services, tests, consultations)
4. Set payment terms and due date
5. Click **Generate Invoice**

#### Record Payment
1. Find the invoice
2. Click **Record Payment**
3. Enter payment amount and method
4. Confirm payment

**Multi-Currency Support:**
- The system supports 25+ currencies
- Currency is configured in Settings -> Regional
- All amounts display in the selected currency (e.g., 1,500.00 BDT)

### Emergency Triage

**Location:** Admin Portal -> Emergency

#### Triage Priority Levels
| Level | Color | Response Time | Description |
|-------|-------|---------------|-------------|
| Resuscitation | Red | Immediate | Life-threatening |
| Emergency | Orange | < 10 min | Serious condition |
| Urgent | Yellow | < 60 min | Requires attention |
| Standard | Green | < 120 min | Non-urgent |
| Non-Urgent | Blue | < 240 min | Minor issues |

#### Register Emergency Case
1. Click **New Emergency**
2. Enter patient information
3. Describe chief complaint and symptoms
4. Assign triage level based on severity
5. Click **Register**

#### Manage Emergency Queue
1. View cases sorted by priority
2. Click to update status
3. Assign to available doctor
4. Mark as completed when treated

### Reports & Analytics

**Location:** Admin Portal -> Reports

#### Available Reports
- **Financial Summary** - Revenue, payments, outstanding
- **Appointment Statistics** - Trends, completion rates
- **Patient Demographics** - Age, gender distribution
- **Department Performance** - Activity by department

#### Generate Report
1. Select report type
2. Choose date range (7 days, 30 days, 90 days, 1 year)
3. Click **Generate**
4. Export as PDF if needed

### Audit Logs

**Location:** Admin Portal -> Audit Logs

View all system activities for compliance and security monitoring:
- User logins
- Data modifications
- Settings changes
- Access attempts

Filter by user, action type, or date range.

### Hospital Settings

**Location:** Admin Portal -> Settings

#### General Tab
- Hospital Name
- Contact Email
- Phone Number
- Address
- Website

#### Branding Tab
- Upload hospital logo
- Primary Color
- Secondary Color
- Accent Color
- Preview changes in real-time

#### Regional Tab
**Currency Settings:**
- Select from 25+ currencies (USD, EUR, BDT, INR, etc.)
- Currency code displays after amount (e.g., 1,500.00 BDT)
- Preview how amounts will display

**Timezone Settings:**
- Select your timezone (e.g., Asia/Dhaka for Bangladesh)
- All times display in selected timezone

**Date Format:**
- MM/DD/YYYY
- DD/MM/YYYY
- YYYY-MM-DD

#### Features Tab
Enable/disable system features:
- Online Appointment Booking
- Digital Prescriptions
- Medical Records Access
- SMS Notifications
- Email Notifications

---

## Doctor Portal

Access: `http://localhost:3000/doctor`

### Dashboard

The doctor dashboard shows your daily schedule and patient overview.

**Key Metrics:**
- Today's Appointments
- Total Patients
- Pending Lab Tests
- Weekly appointments chart

### Managing Appointments

**Location:** Doctor Portal -> Appointments

#### View Appointments
1. Navigate to **Appointments**
2. Filter by: Today, This Week, This Month
3. View status: Scheduled, Completed, Cancelled

#### Complete Appointment
1. Find the appointment
2. Click **Start Consultation**
3. Add notes and diagnosis
4. Create prescription if needed
5. Order lab tests if required
6. Click **Complete**

### Prescriptions

**Location:** Doctor Portal -> Prescriptions

#### Create Prescription
1. Click **New Prescription**
2. Select patient
3. Add medications:
   - Drug name
   - Dosage
   - Frequency
   - Duration
4. **Drug Interaction Warning:** System automatically checks for dangerous drug interactions and displays warnings
5. Add instructions
6. Click **Save**

### Lab Test Management

**Location:** Doctor Portal -> Lab Tests

#### Order Lab Test
1. Click **Order Test**
2. Select patient
3. Choose test type:
   - Blood Tests (CBC, Lipid Panel, etc.)
   - Urine Analysis
   - Imaging (X-Ray, MRI, CT)
   - Other specialized tests
4. Add clinical notes
5. Set priority level
6. Click **Submit Order**

#### View Results
1. Find the test in the list
2. Click to view results
3. Add interpretation notes
4. Mark as reviewed

### Vital Signs

**Location:** Doctor Portal -> Vitals

#### Record Vital Signs
1. Click **Record Vitals**
2. Select patient
3. Enter measurements:
   - Blood Pressure (systolic/diastolic)
   - Heart Rate (bpm)
   - Temperature (F or C)
   - Respiratory Rate
   - Oxygen Saturation (SpO2)
   - Weight and Height
4. Add notes for abnormal values
5. Click **Save**

#### View Vital Trends
- Select a patient
- View historical data in charts
- Identify patterns and concerns

### Medical Records

**Location:** Doctor Portal -> Records

#### Create Record
1. Click **Add Record**
2. Select patient
3. Choose record type:
   - Diagnosis
   - Lab Report
   - Imaging
   - Procedure
   - Follow-up Note
4. Enter details
5. Attach files if needed
6. Click **Save**

### Schedule Management

**Location:** Doctor Portal -> Schedule

#### Set Weekly Availability
1. Navigate to **Schedule**
2. For each day:
   - Toggle available/unavailable
   - Set start time
   - Set end time
3. Set slot duration (15/30/45/60 min)
4. Click **Save Schedule**

---

## Patient Portal

Access: `http://localhost:3000/patient`

### Dashboard

The patient dashboard provides an overview of your healthcare status.

**Key Information:**
- Upcoming Appointments
- Active Prescriptions
- Recent Lab Tests
- Vital Signs Summary

### Booking Appointments

**Location:** Patient Portal -> Book Appointment

#### Step 1: Select Doctor
1. Browse available doctors
2. Filter by department
3. View doctor details:
   - Specialization
   - Experience
   - Consultation Fee
4. Click **Select**

#### Step 2: Choose Date & Time
1. Select date from calendar
2. Pick available time slot
3. Choose appointment type

#### Step 3: Confirm
1. Review details
2. Enter reason for visit
3. Click **Confirm Booking**

### Managing Appointments

**Location:** Patient Portal -> Appointments

- View upcoming and past appointments
- Cancel appointments if needed
- View appointment details

### Prescriptions

**Location:** Patient Portal -> Prescriptions

- View all prescriptions
- See medication details and instructions
- Print or download as PDF

### Lab Tests

**Location:** Patient Portal -> Lab Tests

- View ordered tests
- Check test status (Pending, In Progress, Completed)
- View results when available
- Download results as PDF

### Vital Signs

**Location:** Patient Portal -> Vitals

- View your vital signs history
- See trends in charts:
  - Blood Pressure over time
  - Heart Rate patterns
  - Weight changes

### Medical Records

**Location:** Patient Portal -> Records

- Access all your health records
- Filter by type
- Download records as PDF

### Profile Management

**Location:** Patient Portal -> Profile

#### Personal Information
- Name, Email, Phone
- Date of Birth, Gender
- Address

#### Medical Information
- Blood Type
- Allergies
- Current Medications
- Medical Conditions

#### Emergency Contact
- Contact Name
- Relationship
- Phone Number

#### Security
- Change Password

---

## Troubleshooting

### Common Issues

#### "Cannot connect to database"
1. Verify MySQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database exists

#### "Invalid credentials" on login
1. Verify email is correct
2. Check password (case-sensitive)
3. Run `npm run db:seed` to reset test accounts

#### Hydration warnings in console
These are caused by browser extensions (Bitdefender, Grammarly, etc.) and are harmless. The application works normally.

#### Currency not displaying correctly
1. Go to Admin -> Settings -> Regional
2. Select your currency
3. Save and refresh the page

### Getting Help

If you encounter issues:
1. Check the browser console (F12 -> Console)
2. Review application logs
3. Contact: support@nhms.com

---

## FAQ

### General Questions

**Q: Can multiple hospitals use this system?**
A: Yes, the system supports multi-tenancy. Each hospital has separate data.

**Q: Is my data secure?**
A: Yes, passwords are encrypted using bcrypt, and sessions use secure tokens.

**Q: What currencies are supported?**
A: 25+ currencies including USD, EUR, GBP, BDT, INR, and many more.

**Q: Can I use this on mobile?**
A: Yes, the interface is fully responsive.

### Admin Questions

**Q: How do I change the currency?**
A: Go to Settings -> Regional -> Select your currency

**Q: How do I view audit logs?**
A: Navigate to Admin -> Audit Logs

**Q: How do I manage emergency cases?**
A: Go to Admin -> Emergency to view and manage triage queue

### Doctor Questions

**Q: How do I check for drug interactions?**
A: The system automatically checks when creating prescriptions and shows warnings.

**Q: How do I order lab tests?**
A: Go to Lab Tests -> Order Test and fill in the details.

**Q: How do I record vital signs?**
A: Go to Vitals -> Record Vitals and enter the measurements.

### Patient Questions

**Q: How do I book an appointment?**
A: Go to Book Appointment and follow the 3-step process.

**Q: How do I view my lab results?**
A: Navigate to Lab Tests to see all your test results.

**Q: How do I track my vital signs?**
A: Go to Vitals to see your vital signs history and trends.

---

## Support

For technical support or feature requests:

- **Email:** support@nhms.com
- **Documentation:** See README.md
- **Issues:** Report bugs via GitHub Issues

---

*This manual covers NHMS - National Health Management System v2.0.0*
