import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://auth.connectacademy.com.br'
// Use JWT format key — the sb_publishable_ format breaks Edge Function calls and session tokens
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeWZ6cGppdmVzcmJjeGlsbXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTE1ODUsImV4cCI6MjA4NjIyNzU4NX0.4q3uB1PrFPbaH4lunmQ6wZU0jNABg2D0i45JRHXo_K0'

// navigator.locks times out after 10s when multiple concurrent requests compete
// for the same lock, causing AbortError on all Supabase operations.
// Using a no-op lock bypasses this issue while keeping auth functional.
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        lock: (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
    }
})
