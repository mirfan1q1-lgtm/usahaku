export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  image_url: string;
  demo_url?: string;
  category: 'landing' | 'profile' | 'portfolio';
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  showcase_id?: string;
  message: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  showcases?: Showcase | null;
}

export interface User {
  id: string;
  email: string;
}

export interface Showcase {
  id: string;
  title: string;
  description: string;
  image_url: string;
  demo_url?: string;
  price: string;
  features: string[];
  category: 'basic' | 'premium' | 'enterprise';
  is_featured: boolean;
  created_at: string;
}

export interface ContactInformation {
  id: string;
  type: 'email' | 'phone' | 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'website' | 'address' | 'other';
  label: string;
  value: string;
  icon?: string;
  is_primary: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}