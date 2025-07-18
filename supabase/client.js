// supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
// This client is used for server-side operations that require elevated permissions.
