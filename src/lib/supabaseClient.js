import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wnmcwvcdzwvsfhovelhg.supabase.co' // Replace with your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubWN3dmNkend2c2Zob3ZlbGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzI5NzAsImV4cCI6MjA2MDEwODk3MH0.dCI1ZxYMiZyrRK8Z4oOOFd-OLAp499-TSztVZkzRa88' // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseKey)
