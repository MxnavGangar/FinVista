import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  type UserRole = "customer" | "admin";

  interface User {
    id: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  type UserRole = "customer" | "admin";

  interface JWT {
    id: string;
    role: UserRole;
  }
}
