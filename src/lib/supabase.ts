
import { createClient } from '@supabase/supabase-js';

// These are public keys that can be safely exposed in the client
const supabaseUrl = 'https://nyqeyxgimvwooegpaapp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cWV5eGdpbXZ3b29lZ3BhYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NjE2MzEsImV4cCI6MjA1NDIzNzYzMX0.MaFplMd-58LvxChNsaGuznSslIzJ1OulASEvRt5ZmqY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
