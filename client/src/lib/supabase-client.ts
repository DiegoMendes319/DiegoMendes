import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from API endpoint (since env vars are server-side)
async function getSupabaseConfig() {
  try {
    const response = await fetch('/api/config/supabase');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to fetch Supabase config:', error);
    return { url: null, key: null };
  }
}

// Initialize with placeholder values - will be updated when config is fetched
let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseAnonKey = 'placeholder-key';

// Try to get real credentials
getSupabaseConfig().then(config => {
  if (config.url && config.key) {
    supabaseUrl = config.url;
    supabaseAnonKey = config.key;
    console.log('Supabase credentials loaded successfully');
  } else {
    console.warn('Using placeholder Supabase credentials');
  }
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export type { User } from '@supabase/supabase-js'