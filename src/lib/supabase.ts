import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Define a type for your database. You should generate this from your Supabase project.
// using `npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> --schema public > src/types/supabase.ts`
// For now, assuming Tables type is defined in this file or imported

export type Database = {
  public: {
    Tables: Tables; // Assumes Tables type is defined/imported
    Views: {
      // add your views here
    };
    Functions: {
      // add your stored procedures here
    };
    Enums: {
      // add your enums here
    };
  };
};

// Browser client (singleton)
let browserClient: SupabaseClient<Database> | undefined;

export const createSupabaseBrowserClient = () => {
  if (browserClient) {
    return browserClient;
  }

  // Use import.meta.env for accessing environment variables in Vite
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    // Depending on your app setup, you might want to handle this error differently
    // e.g., show an error page or a loading state indefinitely
    throw new Error('Missing Supabase environment variables');
  }

  browserClient = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );

  return browserClient;
};

// Keep the Tables type definition here as it seems to be used elsewhere
export type Tables = {
  services: {
    id: string;
    title: string;
    description: string;
    category_id: string;
    location: string;
    price: number;
    provider_id: string;
    created_at: string;
    status: 'active' | 'inactive';
    images: string[];
  };
  users: {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    location: string;
    created_at: string;
    avatar_url: string;
    rating: number;
  };
  categories: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  messages: {
    id: string;
    service_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    read: boolean;
  };
  reviews: {
    id: string;
    service_id: string;
    reviewer_id: string;
    rating: number;
    comment: string;
    created_at: string;
  };
}; 