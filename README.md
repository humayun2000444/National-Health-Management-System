# National Health Management System (NHMS)

A comprehensive, enterprise-grade hospital management system built with Next.js 14, featuring separate dashboards for Administrators, Doctors, and Patients. This multi-tenant SaaS platform enables healthcare facilities to manage appointments, prescriptions, billing, lab tests, vital signs, emergency triage, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [User Manual](#user-manual)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Multi-Tenant Architecture
- Hospital-based tenant isolation
- Customizable branding per hospital (logo, colors)
- Multi-currency support (25+ currencies including USD, EUR, BDT, INR)
- Configurable timezone and date formats
- Subscription-based access levels

### Admin Dashboard
- **Dashboard Overview**: Real-time statistics, revenue charts, appointment trends
- **Doctor Management**: Add, edit, deactivate doctors with department assignment
- **Patient Management**: View and manage patient records
- **Department Management**: Create and organize hospital departments
- **Appointment Management**: View and manage all appointments
- **Billing & Invoicing**: Complete billing system with invoice generation, payment tracking
- **Emergency Triage**: Priority-based emergency queue management
- **Reports & Analytics**: Comprehensive dashboards with KPIs and insights
- **Audit Logs**: Complete activity tracking and security monitoring
- **Hospital Settings**: Configure branding, regional settings, and preferences

### Doctor Dashboard
- **Dashboard Overview**: Today's appointments, patient statistics, weekly charts
- **Appointment Management**: View scheduled appointments, update status
- **Patient Records**: Access complete patient medical history
- **Prescriptions**: Create prescriptions with drug interaction warnings
- **Lab Test Management**: Order tests, view results, track history
- **Vital Signs**: Record and monitor patient vitals with trend charts
- **Schedule Management**: Set availability and working hours
- **Medical Records**: Create diagnoses, lab reports, imaging records

### Patient Dashboard
- **Dashboard Overview**: Upcoming appointments, recent prescriptions, health summary
- **Book Appointments**: Search doctors, select time slots, book consultations
- **My Appointments**: View, filter, and cancel appointments
- **Prescriptions**: View prescriptions with print and PDF download
- **Lab Tests**: View ordered tests and results
- **Vital Signs**: Track health metrics over time with visual charts
- **Medical Records**: Access all medical records with filtering and PDF export
- **Profile Management**: Update personal info, medical info, emergency contacts

### Enterprise Features
- **Multi-Currency Support**: 25+ currencies with configurable formatting
- **Drug Interaction Warnings**: Automatic alerts for medication conflicts
- **Emergency Triage System**: 5-level priority system (Resuscitation to Non-Urgent)
- **Audit Logging**: Complete activity trail for compliance
- **Notification System**: Real-time alerts for appointments, results, emergencies
- **Role-Based Access Control**: Granular permissions per user type
- **Data Export**: PDF generation for prescriptions, records, invoices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MySQL 8.0+ |
| ORM | Prisma |
| Authentication | NextAuth.js v5 (Auth.js) |
| Styling | Tailwind CSS |
| UI Components | Custom component library |
| Icons | Lucide React |
| Charts | Recharts |
| PDF Generation | Browser Print API |
| Password Hashing | bcryptjs |
| Validation | Zod |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js 14 Application                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Admin     │  │   Doctor    │  │   Patient   │              │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│              ┌───────────┴───────────┐                          │
│              │      API Routes       │                          │
│              │  /api/admin/*         │                          │
│              │  /api/doctor/*        │                          │
│              │  /api/patient/*       │                          │
│              │  /api/hospital/*      │                          │
│              └───────────┬───────────┘                          │
│                          │                                       │
│    ┌─────────────────────┼─────────────────────┐                │
│    │                     │                     │                 │
│    ▼                     ▼                     ▼                 │
│ ┌──────────┐      ┌──────────┐         ┌──────────┐             │
│ │ Currency │      │  Audit   │         │ Notif.   │             │
│ │ Context  │      │  Logger  │         │ System   │             │
│ └──────────┘      └──────────┘         └──────────┘             │
│                          │                                       │
│              ┌───────────┴───────────┐                          │
│              │      Prisma ORM       │                          │
│              └───────────┬───────────┘                          │
└──────────────────────────┼───────────────────────────────────────┘
                           │
               ┌───────────┴───────────┐
               │    MySQL Database     │
               │  (Multi-tenant data)  │
               └───────────────────────┘
```

## Prerequisites

- Node.js 18.0 or higher
- MySQL 8.0 or higher
- npm or yarn package manager
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/National-Health-Management-System.git
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
   Update the `.env` file with your configuration (see [Environment Variables](#environment-variables))

4. **Create the database**
   ```sql
   CREATE DATABASE nhms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Run database migrations**
   ```bash
   npm run db:push
   ```

6. **Seed the database** (creates sample data)
   ```bash
   npm run db:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open the application**

   Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration (MySQL)
DATABASE_URL="mysql://username:password@127.0.0.1:3306/nhms"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"

# Application
NODE_ENV="development"
```

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes |
| `NODE_ENV` | Environment mode | No |

## Database Setup

### Database Schema

The system uses the following data models:

| Model | Description |
|-------|-------------|
| `Hospital` | Tenant/organization data with branding |
| `Admin` | Hospital administrators |
| `Doctor` | Medical professionals with schedules |
| `Patient` | Patient accounts and medical info |
| `Department` | Hospital departments/specialties |
| `Appointment` | Scheduled appointments |
| `Prescription` | Medical prescriptions |
| `MedicalRecord` | Patient medical records |
| `LabTest` | Laboratory test orders and results |
| `VitalSign` | Patient vital sign recordings |
| `Invoice` | Billing invoices |
| `EmergencyCase` | Emergency triage cases |
| `AuditLog` | System activity logs |
| `Notification` | User notifications |

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |

## Project Structure

```
National-Health-Management-System/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeder
├── public/
│   └── uploads/               # Uploaded files (avatars, logos)
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── admin/         # Admin pages
│   │   │   │   ├── appointments/
│   │   │   │   ├── billing/
│   │   │   │   ├── departments/
│   │   │   │   ├── doctors/
│   │   │   │   ├── emergency/
│   │   │   │   ├── patients/
│   │   │   │   ├── reports/
│   │   │   │   ├── audit-logs/
│   │   │   │   └── settings/
│   │   │   ├── doctor/        # Doctor pages
│   │   │   │   ├── appointments/
│   │   │   │   ├── lab-tests/
│   │   │   │   ├── patients/
│   │   │   │   ├── prescriptions/
│   │   │   │   ├── records/
│   │   │   │   ├── schedule/
│   │   │   │   └── vitals/
│   │   │   └── patient/       # Patient pages
│   │   │       ├── appointments/
│   │   │       ├── book/
│   │   │       ├── lab-tests/
│   │   │       ├── prescriptions/
│   │   │       ├── profile/
│   │   │       ├── records/
│   │   │       └── vitals/
│   │   ├── (marketing)/       # Public marketing pages
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   └── ui/                # Reusable UI components
│   ├── contexts/
│   │   └── CurrencyContext.tsx # Currency provider
│   └── lib/
│       ├── auth.ts            # NextAuth configuration
│       ├── prisma.ts          # Prisma client
│       ├── currency.ts        # Currency utilities
│       ├── audit.ts           # Audit logging
│       └── notifications.ts   # Notification system
└── README.md
```

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | Sign in user |
| POST | `/api/auth/signout` | Sign out user |
| GET | `/api/auth/session` | Get current session |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/PATCH | `/api/admin/appointments` | Manage appointments |
| GET/POST/PATCH/DELETE | `/api/admin/doctors` | Manage doctors |
| GET/PATCH/DELETE | `/api/admin/patients` | Manage patients |
| GET/POST/PATCH/DELETE | `/api/admin/departments` | Manage departments |
| GET | `/api/admin/reports` | Generate reports |
| GET/PUT | `/api/admin/settings` | Hospital settings |
| GET/POST/PATCH | `/api/admin/billing` | Billing management |
| GET/POST/PATCH | `/api/admin/emergency` | Emergency triage |
| GET | `/api/admin/audit-logs` | View audit logs |

### Doctor Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/stats` | Dashboard statistics |
| GET/PATCH | `/api/doctor/appointments` | Manage appointments |
| GET | `/api/doctor/patients` | View patients |
| GET/POST | `/api/doctor/prescriptions` | Manage prescriptions |
| GET/POST | `/api/doctor/records` | Medical records |
| GET/POST | `/api/doctor/lab-tests` | Lab test management |
| GET/POST | `/api/doctor/vitals` | Vital signs |
| GET/PUT | `/api/doctor/schedule` | Schedule management |

### Patient Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/dashboard` | Dashboard data |
| GET/PATCH | `/api/patient/appointments` | View/cancel appointments |
| POST | `/api/patient/book` | Book appointment |
| GET | `/api/patient/prescriptions` | View prescriptions |
| GET | `/api/patient/records` | Medical records |
| GET | `/api/patient/lab-tests` | Lab test results |
| GET | `/api/patient/vitals` | Vital signs history |
| GET/PUT/PATCH | `/api/patient/profile` | Profile management |

## User Roles

### Test Credentials

After running `npm run db:seed`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Patient | patient@hospital.com | patient123 |

### Role Permissions

| Feature | Admin | Doctor | Patient |
|---------|-------|--------|---------|
| View Dashboard | Yes | Yes | Yes |
| Manage Doctors | Yes | No | No |
| Manage Patients | Yes | View Only | No |
| Manage Departments | Yes | No | No |
| Billing & Invoicing | Yes | No | View Own |
| Emergency Triage | Yes | No | No |
| Audit Logs | Yes | No | No |
| Create Prescriptions | No | Yes | No |
| Order Lab Tests | No | Yes | No |
| Record Vital Signs | No | Yes | No |
| View Lab Results | No | Own Patients | Own |
| View Vital Signs | No | Own Patients | Own |
| Book Appointments | No | No | Yes |
| Hospital Settings | Yes | No | No |

## User Manual

See [USER_MANUAL.md](USER_MANUAL.md) for detailed usage instructions.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
# Build and run
docker build -t nhms .
docker run -p 3000:3000 --env-file .env nhms
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
- Open an issue on GitHub
- Email: support@nhms.com

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Recharts](https://recharts.org/) - Charting library

---

Made with dedication for healthcare management
