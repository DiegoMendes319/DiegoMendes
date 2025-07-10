export interface User {
  id: string;
  // Computed fields for compatibility
  name: string;
  age: number;
  // New database fields
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  date_of_birth: Date;
  province: string;
  municipality: string;
  neighborhood: string;
  address_complement?: string | null;
  contract_type: string;
  services: string[];
  availability: string;
  about_me?: string | null;
  profile_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  password?: string | null;
  created_at: Date;
  auth_user_id?: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  age: number;
  province: string;
  municipality: string;
  neighborhood: string;
  address_complement?: string;
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
  address_complement?: string;
  contract_type?: string;
  services?: string[];
  availability?: string;
  profile_url?: string;
}
