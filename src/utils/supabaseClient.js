
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://drllledoxzmbnbldprat.supabase.co'
const supabaseKey = 'sb_publishable_QGahjLw7GPTaj-xiH2SIHg_3JaRzAFa'

export const supabase = createClient(supabaseUrl, supabaseKey)
