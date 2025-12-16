import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Admin Login
    Credentials({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string },
          include: {
            hospital: true,
          },
        });

        if (!admin || !admin.isActive) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          admin.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id.toString(),
          email: admin.email,
          name: admin.name,
          type: "admin",
          role: admin.role,
          hospitalId: admin.hospitalId,
          hospitalName: admin.hospital.name,
          hospitalSlug: admin.hospital.slug,
        };
      },
    }),

    // Doctor Login
    Credentials({
      id: "doctor-credentials",
      name: "Doctor Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const doctor = await prisma.doctor.findUnique({
          where: { email: credentials.email as string },
          include: {
            hospital: true,
            department: true,
          },
        });

        if (!doctor || !doctor.isActive) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          doctor.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: doctor.id.toString(),
          email: doctor.email,
          name: doctor.name,
          type: "doctor",
          specialization: doctor.specialization,
          hospitalId: doctor.hospitalId,
          hospitalName: doctor.hospital.name,
          departmentId: doctor.departmentId?.toString(),
          departmentName: doctor.department?.name,
        };
      },
    }),

    // Patient Login
    Credentials({
      id: "patient-credentials",
      name: "Patient Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const patient = await prisma.patient.findUnique({
          where: { email: credentials.email as string },
          include: {
            hospital: true,
          },
        });

        if (!patient || !patient.isActive) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          patient.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: patient.id.toString(),
          email: patient.email,
          name: patient.name,
          type: "patient",
          hospitalId: patient.hospitalId,
          hospitalName: patient.hospital.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.hospitalId = user.hospitalId;
        token.hospitalName = user.hospitalName;

        // Admin specific
        if (user.type === "admin") {
          token.role = user.role;
          token.hospitalSlug = user.hospitalSlug;
        }

        // Doctor specific
        if (user.type === "doctor") {
          token.specialization = user.specialization;
          token.departmentId = user.departmentId;
          token.departmentName = user.departmentName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.type = token.type as "admin" | "doctor" | "patient";
        session.user.hospitalId = token.hospitalId as string;
        session.user.hospitalName = token.hospitalName as string;

        // Admin specific
        if (token.type === "admin") {
          session.user.role = token.role as string;
          session.user.hospitalSlug = token.hospitalSlug as string;
        }

        // Doctor specific
        if (token.type === "doctor") {
          session.user.specialization = token.specialization as string;
          session.user.departmentId = token.departmentId as string;
          session.user.departmentName = token.departmentName as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
