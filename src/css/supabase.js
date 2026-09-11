import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kcmnormsnepyuszekgyu.supabase.co";
const supabaseAnonKey = "sb_publishable_OfpveAfcVvi1RoG69ZxAKw_dNLDeZNM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
