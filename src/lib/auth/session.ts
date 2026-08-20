import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const verifySession = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  return userId ? { supabase, userId } : null;
});
