import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = 'https://eoyursmksglzvuomblnm.supabase.co'
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveXVyc21rc2dsenZ1b21ibG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMDY2NTMsImV4cCI6MjA5Njg4MjY1M30.UcPn-3FpBYfSvLw-rtULQkRnT6cRGh5le3-tYRxZa_E'

export const supabase = createClient(supabaseUrl, supabaseAnon)
