import { createClient } from '@supabase/supabase-js'

// Create a simple client with environment variables that will be injected by the server
let supabaseClient: any = null;

// Function to initialize the client when needed
async function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const response = await fetch('/api/config/supabase');
    const config = await response.json();
    
    if (config.url && config.key) {
      console.log('Supabase credentials loaded successfully');
      supabaseClient = createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
      return supabaseClient;
    } else {
      throw new Error('Missing Supabase credentials');
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
}

// Export a proxy that initializes the client when first accessed
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') {
      // Handle Promise-like behavior
      return undefined;
    }
    
    return function(...args: any[]) {
      return getSupabaseClient().then(client => {
        const method = client[prop];
        if (typeof method === 'function') {
          return method.apply(client, args);
        }
        return method;
      });
    };
  }
});

export type { User } from '@supabase/supabase-js'