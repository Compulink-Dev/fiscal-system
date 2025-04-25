// types/user.ts
export type User = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    company: {
      _id: string;
      name: string;
    } | null;
    createdAt: string;
  };