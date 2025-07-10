import { createClient } from '@supabase/supabase-js'

// Create a singleton for the Supabase client
let supabaseClient: any = null;
let initializationPromise: Promise<any> | null = null;

// Function to initialize the client when needed
async function initializeSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
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
  })();

  return initializationPromise;
}

// Create the main supabase object
const createSupabaseProxy = () => {
  return {
    auth: {
      getSession: async () => {
        const client = await initializeSupabaseClient();
        return client.auth.getSession();
      },
      onAuthStateChange: async (callback: any) => {
        const client = await initializeSupabaseClient();
        return client.auth.onAuthStateChange(callback);
      },
      signUp: async (credentials: any) => {
        const client = await initializeSupabaseClient();
        return client.auth.signUp(credentials);
      },
      signInWithPassword: async (credentials: any) => {
        const client = await initializeSupabaseClient();
        return client.auth.signInWithPassword(credentials);
      },
      signInWithOAuth: async (options: any) => {
        const client = await initializeSupabaseClient();
        return client.auth.signInWithOAuth(options);
      },
      signOut: async () => {
        const client = await initializeSupabaseClient();
        return client.auth.signOut();
      }
    },
    from: (table: string) => {
      return {
        select: async (query?: string) => {
          const client = await initializeSupabaseClient();
          return client.from(table).select(query);
        },
        insert: async (data: any) => {
          const client = await initializeSupabaseClient();
          return client.from(table).insert(data);
        },
        update: async (data: any) => {
          const client = await initializeSupabaseClient();
          return client.from(table).update(data);
        },
        delete: async () => {
          const client = await initializeSupabaseClient();
          return client.from(table).delete();
        },
        eq: function(column: string, value: any) {
          return {
            select: async (query?: string) => {
              const client = await initializeSupabaseClient();
              return client.from(table).select(query).eq(column, value);
            },
            update: async (data: any) => {
              const client = await initializeSupabaseClient();
              return client.from(table).update(data).eq(column, value);
            },
            delete: async () => {
              const client = await initializeSupabaseClient();
              return client.from(table).delete().eq(column, value);
            }
          };
        }
      };
    }
  };
};

export const supabase = createSupabaseProxy();

export type { User } from '@supabase/supabase-js'