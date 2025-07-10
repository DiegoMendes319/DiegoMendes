export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  province: string;
  municipality: string;
  neighborhood: string;
  contract_type: string;
  services: string[];
  availability: string;
  profile_url?: string;
  created_at: Date;
  auth_user_id?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  age: number;
  province: string;
  municipality: string;
  neighborhood: string;
  contract_type: string;
  services: string[];
  availability: string;
  profile_url?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
  province?: string;
  municipality?: string;
  neighborhood?: string;
  contract_type?: string;
  services?: string[];
  availability?: string;
  profile_url?: string;
}
