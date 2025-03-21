
import { createClient } from '@supabase/supabase-js';

// These are public keys that can be safely exposed in the client
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
