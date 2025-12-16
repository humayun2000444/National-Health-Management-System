# DIIT Health Center - National Health Management System

A modern healthcare management system built with Next.js, React, and TypeScript. This application allows patients to book appointments, view their medical history, and enables administrators to manage the healthcare facility.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MySQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| Styling | Tailwind CSS |
| Validation | Zod |

## Features

### Public Features
- Home page with appointment booking form
- About page with facility information
- Doctors listing page
- Contact page

### Patient Features
- User registration and login
- Personal dashboard
- Book medical appointments
- View appointment history
- Profile management

### Admin Features
- Separate admin authentication
- Admin dashboard with statistics
- View all appointments
- Create, edit, and delete posts/announcements
- Role-based access control (RBAC)

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Installation

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

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/nhms"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
   ```

4. **Create the database**

   In MySQL, create the database:
   ```sql
   CREATE DATABASE nhms;
   ```

5. **Run database migrations**
   ```bash
   npm run db:push
   ```

6. **Seed the database** (optional - adds sample data)
   ```bash
   npm run db:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open the application**

   Visit [http://localhost:3000](http://localhost:3000)

## Test Credentials

After running the seed command, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@diithealth.com | admin123 |
| User | user@example.com | user123 |

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages (home, about, contact, doctors)
│   │   ├── page.tsx        # Home page
│   │   ├── about/
│   │   ├── contact/
│   │   ├── doctors/
│   │   ├── login/
│   │   └── register/
│   ├── (user)/             # Protected user routes
│   │   ├── dashboard/
│   │   └── appointments/
│   ├── (admin)/            # Protected admin routes
│   │   └── admin/
│   │       ├── page.tsx    # Admin dashboard
│   │       ├── login/
│   │       ├── appointments/
│   │       └── posts/
│   ├── api/                # API routes
│   │   ├── auth/
│   │   ├── appointments/
│   │   └── admin/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layouts/            # Navbar, Footer
│   ├── forms/              # Form components
│   └── providers/          # Context providers
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth configuration
│   └── utils.ts            # Utility functions
└── types/
    └── next-auth.d.ts      # Type definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## API Endpoints

### Public
- `POST /api/appointments` - Create appointment
- `POST /api/auth/register` - Register new user

### Protected (User)
- `GET /api/appointments` - Get user's appointments

### Protected (Admin)
- `GET /api/admin/posts` - Get admin's posts
- `POST /api/admin/posts` - Create post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

## Database Schema

### Models
- **User** - Patient accounts
- **Admin** - Administrator accounts
- **Appointment** - Medical appointments
- **Post** - News/announcements
- **Role** - User roles (admin, editor, author)
- **Permission** - Granular permissions

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker
```bash
# Build image
docker build -t nhms .

# Run container
docker run -p 3000:3000 nhms
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@diithealth.com or open an issue in the repository.
