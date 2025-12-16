# HealthCare Pro - Hospital Management System
## User Manual

**Version:** 1.0.0
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

HealthCare Pro is a comprehensive, multi-tenant Hospital Management System designed to streamline healthcare operations. The system provides three dedicated portals for different user roles:

- **Admin Portal** - For hospital administrators to manage staff, departments, and monitor analytics
- **Doctor Portal** - For medical professionals to manage patients, appointments, and prescriptions
- **Patient Portal** - For patients to book appointments, view prescriptions, and access medical records

### Key Features

| Feature | Admin | Doctor | Patient |
|---------|:-----:|:------:|:-------:|
| Dashboard Analytics | ✓ | ✓ | ✓ |
| User Management | ✓ | - | - |
| Department Management | ✓ | - | - |
| Reports & Analytics | ✓ | - | - |
| Hospital Settings | ✓ | - | - |
| Schedule Management | - | ✓ | - |
| Patient Management | ✓ | ✓ | - |
| Appointment Management | ✓ | ✓ | ✓ |
| Prescription Management | - | ✓ | ✓ |
| Medical Records | - | ✓ | ✓ |
| Profile Management | - | - | ✓ |
| Book Appointments | - | - | ✓ |

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

**Quick Access:**
- Recent Appointments List
- Top Performing Doctors

### Managing Doctors

**Location:** Admin Portal → Doctors

#### View All Doctors
1. Navigate to **Doctors** from the sidebar
2. Use the search bar to find doctors by name or email
3. Filter by department using the dropdown

#### Add New Doctor
1. Click **Add Doctor** button
2. Fill in the required information:
   - Full Name
   - Email Address
   - Phone Number
   - Department
   - Specialization
   - Years of Experience
   - Qualification
   - Password
3. Click **Add Doctor** to save

#### Edit Doctor
1. Find the doctor in the list
2. Click the **Edit** (pencil) icon
3. Update the necessary fields
4. Click **Save Changes**

#### Delete Doctor
1. Find the doctor in the list
2. Click the **Delete** (trash) icon
3. Confirm deletion in the popup

### Managing Patients

**Location:** Admin Portal → Patients

#### View All Patients
1. Navigate to **Patients** from the sidebar
2. Search patients by name or email
3. Filter by blood group if needed

#### Add New Patient
1. Click **Add Patient** button
2. Fill in patient details:
   - Personal Information (Name, Email, Phone, DOB)
   - Gender and Blood Group
   - Address
   - Emergency Contact
   - Password
3. Click **Add Patient** to save

#### Export Patient Data
1. Click the **Export** button
2. Data will be downloaded as CSV

### Managing Appointments

**Location:** Admin Portal → Appointments

#### View Appointments
- **Stats Cards** show: Total Today, Pending, Confirmed, Completed
- Use filters to narrow down:
  - Search by patient or doctor name
  - Filter by status
  - Filter by department

#### Manage Appointment Status
1. Find the appointment in the table
2. For pending appointments:
   - Click **Confirm** to approve
   - Click **Decline** to cancel
3. Status will update immediately

### Managing Departments

**Location:** Admin Portal → Departments

#### Add New Department
1. Click **Add Department** button
2. Enter:
   - Department Name
   - Description
   - Select an Icon
3. Click **Create Department**

#### Edit Department
1. Click **Edit** on the department card
2. Update information
3. Save changes

### Reports & Analytics

**Location:** Admin Portal → Reports

#### Available Reports
- **Monthly Trends** - Appointments and new patients over time
- **Revenue Analysis** - Income trends and projections
- **Department Performance** - Appointments by department
- **Status Distribution** - Breakdown of appointment outcomes

#### Filtering Reports
1. Use the period selector: 7 days, 30 days, 90 days, 1 year
2. Charts update automatically

#### Export Reports
1. Click **Export Report** button
2. Report downloads as PDF

### Hospital Settings

**Location:** Admin Portal → Settings

#### General Information
1. Navigate to **Settings** → **General** tab
2. Update:
   - Hospital Logo (click to upload)
   - Hospital Name
   - Contact Email
   - Phone Number
   - Website URL
   - Address
3. Click **Save Changes**

#### Branding Configuration
1. Go to **Settings** → **Branding** tab
2. Choose a preset theme or customize:
   - Primary Color
   - Secondary Color
   - Accent Color
3. Preview changes in real-time
4. Click **Save Changes**

#### Feature Toggles
1. Go to **Settings** → **Features** tab
2. Enable/disable features:
   - Online Appointment Booking
   - Digital Prescriptions
   - Medical Records Access
   - SMS Notifications (Premium)
   - Email Notifications
3. Save changes

#### Notification Settings
1. Go to **Settings** → **Notifications** tab
2. Configure:
   - Appointment reminder timing
   - Reply-to email address
3. Save changes

---

## Doctor Portal

Access: `http://localhost:3000/doctor`

### Dashboard

The doctor dashboard shows your daily schedule and patient overview.

**Key Metrics:**
- Today's Appointments
- Total Patients
- Pending Reports
- Average Consultation Time

**Quick Actions:**
- Write Prescription
- Schedule Appointment
- View Patient List
- Manage Schedule

### Managing Appointments

**Location:** Doctor Portal → Appointments

#### View Your Appointments
1. Navigate to **Appointments**
2. View stats: Today, Pending, Confirmed, Completed
3. Filter by:
   - Date (Today, Tomorrow, This Week, All)
   - Status

#### Handle Pending Appointments
1. Find pending appointments (yellow badge)
2. Click **Accept** to confirm
3. Click **Decline** to cancel

#### Start Consultation
1. Find a confirmed appointment
2. Click **Start Video Call** (if enabled)
3. Or click **View Details** to see patient information

### Managing Patients

**Location:** Doctor Portal → Patients

#### View Your Patients
1. Navigate to **Patients**
2. Search by name or condition
3. Click on a patient card for details

#### View Patient Details
1. Click on a patient card
2. Modal shows:
   - Personal information
   - Medical history
   - Contact details
   - Last visit and next appointment
3. Click **View Full Records** to access complete history

### Writing Prescriptions

**Location:** Doctor Portal → Prescriptions

#### Create New Prescription
1. Click **New Prescription** button
2. Select the patient
3. Enter diagnosis
4. Add medications:
   - Click **Add Medication**
   - Enter: Name, Dosage, Frequency, Duration
   - Repeat for multiple medications
5. Add special instructions (optional)
6. Set validity period
7. Click **Create Prescription**

#### View Existing Prescriptions
1. Use search to find prescriptions
2. Click **View** to see details
3. Click **Print** to print prescription
4. Click **Download** for PDF version

### Managing Medical Records

**Location:** Doctor Portal → Records

#### Add New Record
1. Click **Add Record** button
2. Select patient
3. Choose record type:
   - Diagnosis
   - Lab Report
   - Imaging
   - Vaccination
   - Surgery
4. Enter title and description
5. Set record date
6. Attach files (drag & drop supported)
7. Click **Create Record**

#### View Records
1. Use filters to find specific record types
2. Click **View** for details
3. Click **Download** for attachments

### Schedule Management

**Location:** Doctor Portal → Schedule

#### Set Weekly Availability
1. Navigate to **Schedule**
2. For each day of the week:
   - Toggle availability on/off
   - Set start time
   - Set end time
3. Set appointment slot duration (15-60 minutes)
4. Click **Save Schedule**

#### Manage Leave
1. View upcoming leaves in the sidebar
2. Click **Add Leave** to request time off
3. Enter leave dates and reason
4. Submit request

---

## Patient Portal

Access: `http://localhost:3000/patient`

### Dashboard

The patient dashboard provides an overview of your healthcare status.

**Key Information:**
- Upcoming Appointments
- Active Prescriptions
- Medical Records Count
- Total Visits This Year

**Health Metrics:**
- Blood Pressure
- Heart Rate
- Blood Sugar
- Status indicators for each metric

### Booking an Appointment

**Location:** Patient Portal → Book Appointment

#### Step 1: Select a Doctor
1. Navigate to **Book Appointment**
2. Browse available doctors
3. Filter by department if needed
4. View doctor details:
   - Specialization
   - Experience
   - Rating
   - Consultation Fee
5. Click **Select** on your chosen doctor

#### Step 2: Choose Date & Time
1. Select a date from the calendar
2. Choose an available time slot
3. Select appointment type:
   - **Consultation** - First visit or new concern
   - **Follow-up** - Continuing treatment
   - **Emergency** - Urgent care needed

#### Step 3: Confirm Booking
1. Review appointment details
2. Enter your symptoms/reason for visit
3. Review consultation fee
4. Click **Confirm Booking**
5. You'll receive a confirmation message

### Managing Appointments

**Location:** Patient Portal → Appointments

#### View Your Appointments
1. Navigate to **Appointments**
2. See upcoming and past appointments
3. Filter by: All, Upcoming, Completed, Cancelled

#### Cancel an Appointment
1. Find the appointment you want to cancel
2. Click **Cancel Appointment**
3. Confirm cancellation in the popup
4. Appointment status changes to "Cancelled"

#### Join Video Consultation
1. Find your confirmed appointment
2. Click **Join Video Call** when it's time
3. Ensure your camera and microphone are enabled

### Viewing Prescriptions

**Location:** Patient Portal → Prescriptions

#### View Active Prescriptions
1. Navigate to **Prescriptions**
2. Active prescriptions are shown by default
3. Use filter to view: All, Active, Expired

#### View Prescription Details
1. Click **View** on a prescription card
2. See full details:
   - Doctor information
   - Diagnosis
   - All medications with dosage instructions
   - Special instructions
   - Validity period

#### Download/Print Prescription
1. Open prescription details
2. Click **Print** for physical copy
3. Click **Download PDF** for digital copy

### Accessing Medical Records

**Location:** Patient Portal → Records

#### View Your Records
1. Navigate to **Records**
2. See record counts by type:
   - Diagnoses
   - Lab Reports
   - Imaging
   - Vaccinations
3. Filter by record type

#### View Record Details
1. Click **View Details** on a record
2. See full information:
   - Record type and date
   - Doctor who created it
   - Description
   - Attached files

#### Download Records
1. Click **Download** on any record
2. Files download to your device

### Profile Management

**Location:** Patient Portal → Profile

#### Update Personal Information
1. Navigate to **Profile**
2. Click **Personal Information** tab
3. Update your details:
   - Full Name
   - Email
   - Phone
   - Date of Birth
   - Gender
   - Blood Group
   - Address
4. Click **Save Changes**

#### Update Medical Information
1. Click **Medical Information** tab
2. Enter:
   - Known Allergies
   - Chronic Conditions
3. Click **Save Changes**

#### Update Emergency Contact
1. Click **Emergency Contact** tab
2. Enter:
   - Contact Name
   - Contact Phone Number
3. Click **Save Changes**

#### Change Password
1. Click **Security** tab
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click **Update Password**

---

## Troubleshooting

### Common Issues

#### "Cannot connect to database"
1. Verify MySQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database exists: `CREATE DATABASE nhms;`

#### "Invalid credentials" on login
1. Verify email is correct
2. Check password (case-sensitive)
3. Run `npm run db:seed` to reset test accounts

#### Page shows 404 error
1. Check you're using the correct URL
2. Valid routes:
   - `/login` - Login page
   - `/admin` - Admin portal
   - `/doctor` - Doctor portal
   - `/patient` - Patient portal

#### Hydration warnings in console
These are caused by browser extensions (Bitdefender, Grammarly, etc.) and are harmless. The application works normally.

#### "Too many redirects" error
1. Clear browser cookies for localhost
2. Press Ctrl+Shift+Delete
3. Select "Cookies" and clear
4. Try again

### Getting Help

If you encounter issues not covered here:
1. Check the console for error messages (F12 → Console)
2. Review the application logs
3. Contact system administrator

---

## FAQ

### General Questions

**Q: Can multiple hospitals use this system?**
A: Yes, the system supports multi-tenancy. Each hospital has separate data.

**Q: Is my data secure?**
A: Yes, passwords are encrypted using bcrypt, and sessions use secure JWT tokens.

**Q: Can I use this on mobile?**
A: Yes, the interface is responsive and works on tablets and mobile devices.

### Admin Questions

**Q: How do I add a new department?**
A: Go to Admin Portal → Departments → Add Department

**Q: Can I customize the hospital branding?**
A: Yes, go to Settings → Branding to change colors and logo.

**Q: How do I generate reports?**
A: Navigate to Reports, select the time period, and click Export.

### Doctor Questions

**Q: How do I set my availability?**
A: Go to Doctor Portal → Schedule and configure your weekly hours.

**Q: Can I see patient history?**
A: Yes, click on any patient to view their complete medical history.

**Q: How do I write a prescription?**
A: Go to Prescriptions → New Prescription and fill in the details.

### Patient Questions

**Q: How do I book an appointment?**
A: Go to Patient Portal → Book Appointment and follow the 3-step process.

**Q: Can I cancel an appointment?**
A: Yes, go to Appointments, find your booking, and click Cancel.

**Q: How do I view my prescriptions?**
A: Navigate to Prescriptions to see all active and past prescriptions.

**Q: Can I download my medical records?**
A: Yes, go to Records and click Download on any record.

---

## Support

For technical support or feature requests, please contact:

- **Email:** support@healthcarepro.com
- **Documentation:** [GitHub Repository](https://github.com/your-repo)
- **Issues:** Report bugs via GitHub Issues

---

*This manual covers HealthCare Pro Hospital Management System v1.0.0*
