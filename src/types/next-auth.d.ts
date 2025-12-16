import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    type: "admin" | "doctor" | "patient";
    hospitalId: string;
    hospitalName: string;
    // Admin specific
    role?: string;
    hospitalSlug?: string;
    // Doctor specific
    specialization?: string;
    departmentId?: string;
    departmentName?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      type: "admin" | "doctor" | "patient";
      hospitalId: string;
      hospitalName: string;
      // Admin specific
      role?: string;
      hospitalSlug?: string;
      // Doctor specific
      specialization?: string;
      departmentId?: string;
      departmentName?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "admin" | "doctor" | "patient";
    hospitalId: string;
    hospitalName: string;
    // Admin specific
    role?: string;
    hospitalSlug?: string;
    // Doctor specific
    specialization?: string;
    departmentId?: string;
    departmentName?: string;
  }
}
