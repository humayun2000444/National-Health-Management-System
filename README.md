# National Health Management System (NHMS)

A modern, multi-tenant hospital management system built with Next.js 14, featuring separate dashboards for Administrators, Doctors, and Patients. This SaaS platform enables healthcare facilities to manage appointments, prescriptions, medical records, and more.

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
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Multi-Tenant Architecture
- Hospital-based tenant isolation
- Customizable branding per hospital (logo, colors)
- Subscription-based access levels

### Admin Dashboard
- **Dashboard Overview**: Real-time statistics, revenue charts, recent activities
- **Doctor Management**: Add, edit, deactivate doctors with department assignment
- **Patient Management**: View and manage patient records
- **Department Management**: Create and organize hospital departments
- **Appointment Management**: View and manage all appointments
- **Reports & Analytics**: Generate PDF reports, view trends
- **Hospital Settings**: Configure hospital details, upload logo, set branding colors

### Doctor Dashboard
- **Dashboard Overview**: Today's appointments, patient statistics
- **Appointment Management**: View scheduled appointments, update status
- **Patient Records**: Access patient medical history
- **Prescriptions**: Create and manage prescriptions
- **Schedule Management**: Set availability and working hours
- **Medical Records**: Create diagnosis, lab reports, imaging records

### Patient Dashboard
- **Dashboard Overview**: Upcoming appointments, recent prescriptions, health summary
- **Book Appointments**: Search doctors, select time slots, book consultations
- **My Appointments**: View, filter, and cancel appointments
- **Prescriptions**: View prescriptions with print and PDF download
- **Medical Records**: Access all medical records with filtering and PDF export
- **Profile Management**: Update personal info, medical info, emergency contacts
- **Avatar Upload**: Upload and manage profile photos
- **Password Change**: Secure password update

### Authentication
- Role-based authentication (Admin, Doctor, Patient)
- Secure session management with NextAuth.js v5
- Protected routes with middleware

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
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 Application                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Admin     │  │   Doctor    │  │   Patient   │         │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│              ┌───────────┴───────────┐                     │
│              │    API Routes         │                     │
│              │  /api/admin/*         │                     │
│              │  /api/patient/*       │                     │
│              │  /api/hospital/*      │                     │
│              └───────────┬───────────┘                     │
│                          │                                  │
│              ┌───────────┴───────────┐                     │
│              │    Prisma ORM         │                     │
│              └───────────┬───────────┘                     │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
               ┌───────────┴───────────┐
               │      MySQL Database    │
               │  (Multi-tenant data)   │
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

### Entity Relationship

```
Hospital (1) ─────┬───── (*) Admin
                  ├───── (*) Doctor ────── (*) Appointment
                  ├───── (*) Patient ───── (*) Appointment
                  ├───── (*) Department
                  └───── (*) Appointment

Doctor (1) ─────┬───── (*) Prescription
                ├───── (*) MedicalRecord
                └───── (*) Appointment

Patient (1) ────┬───── (*) Prescription
                ├───── (*) MedicalRecord
                └───── (*) Appointment
```

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
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── admin/         # Admin pages
│   │   │   │   ├── page.tsx              # Dashboard
│   │   │   │   ├── appointments/
│   │   │   │   ├── departments/
│   │   │   │   ├── doctors/
│   │   │   │   ├── patients/
│   │   │   │   ├── reports/
│   │   │   │   └── settings/
│   │   │   ├── doctor/        # Doctor pages
│   │   │   │   ├── page.tsx
│   │   │   │   ├── appointments/
│   │   │   │   ├── patients/
│   │   │   │   ├── prescriptions/
│   │   │   │   ├── records/
│   │   │   │   └── schedule/
│   │   │   ├── patient/       # Patient pages
│   │   │   │   ├── page.tsx              # Dashboard
│   │   │   │   ├── appointments/
│   │   │   │   ├── book/
│   │   │   │   ├── prescriptions/
│   │   │   │   ├── profile/
│   │   │   │   └── records/
│   │   │   └── layout.tsx
│   │   ├── (marketing)/       # Public marketing pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── layout.tsx
│   │   ├── api/               # API routes
│   │   │   ├── admin/
│   │   │   │   ├── appointments/
│   │   │   │   ├── departments/
│   │   │   │   ├── doctors/
│   │   │   │   ├── patients/
│   │   │   │   ├── reports/
│   │   │   │   ├── settings/
│   │   │   │   └── stats/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   ├── hospital/
│   │   │   │   └── info/
│   │   │   └── patient/
│   │   │       ├── appointments/
│   │   │       ├── book/
│   │   │       ├── dashboard/
│   │   │       ├── prescriptions/
│   │   │       ├── profile/
│   │   │       └── records/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── marketing/         # Marketing page components
│   │   └── ui/                # Reusable UI components
│   │       ├── Avatar.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       └── Table.tsx
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client instance
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── next-auth.d.ts     # Type definitions
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
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
| GET | `/api/admin/appointments` | List all appointments |
| PATCH | `/api/admin/appointments` | Update appointment status |
| GET | `/api/admin/doctors` | List all doctors |
| POST | `/api/admin/doctors` | Create doctor |
| PATCH | `/api/admin/doctors` | Update doctor |
| DELETE | `/api/admin/doctors` | Delete doctor |
| GET | `/api/admin/patients` | List all patients |
| PATCH | `/api/admin/patients` | Update patient |
| DELETE | `/api/admin/patients` | Delete patient |
| GET | `/api/admin/departments` | List departments |
| POST | `/api/admin/departments` | Create department |
| PATCH | `/api/admin/departments` | Update department |
| DELETE | `/api/admin/departments` | Delete department |
| GET | `/api/admin/reports` | Generate reports |
| GET | `/api/admin/settings` | Get hospital settings |
| PUT | `/api/admin/settings` | Update settings |
| POST | `/api/admin/settings/upload-logo` | Upload hospital logo |

### Patient Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/dashboard` | Dashboard data |
| GET | `/api/patient/appointments` | List appointments |
| PATCH | `/api/patient/appointments` | Cancel appointment |
| POST | `/api/patient/book` | Book appointment |
| GET | `/api/patient/prescriptions` | List prescriptions |
| GET | `/api/patient/records` | List medical records |
| GET | `/api/patient/profile` | Get profile |
| PUT | `/api/patient/profile` | Update profile |
| PATCH | `/api/patient/profile` | Change password |
| POST | `/api/patient/profile/avatar` | Upload avatar |
| DELETE | `/api/patient/profile/avatar` | Remove avatar |

### Hospital Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospital/info` | Get hospital information |

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
| View Appointments | All | Own | Own |
| Create Appointments | No | No | Yes |
| Cancel Appointments | Yes | Yes | Own |
| Create Prescriptions | No | Yes | No |
| View Prescriptions | No | Own | Own |
| Create Medical Records | No | Yes | No |
| View Medical Records | No | Own Patients | Own |
| Hospital Settings | Yes | No | No |
| Generate Reports | Yes | No | No |

## Screenshots

### Landing Page
The marketing landing page showcasing hospital services.

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Patient Dashboard
![Patient Dashboard](docs/screenshots/patient-dashboard.png)

### Book Appointment
![Book Appointment](docs/screenshots/book-appointment.png)

*(Add your own screenshots in the `docs/screenshots/` directory)*

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

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

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comments for complex logic
- Ensure all TypeScript types are properly defined

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

---

Made with dedication for healthcare management
