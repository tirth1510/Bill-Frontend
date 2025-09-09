// types/auth.d.ts
export interface MasterKey {
  status: boolean;
  access: boolean;
  pin: string | null;
}

export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  isVerified: boolean;
  role: string;
  masterkey: MasterKey;
}
