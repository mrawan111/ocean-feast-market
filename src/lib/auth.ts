import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) { setIsAdmin(false); setUserId(null); setLoading(false); return; }
      setUserId(user.id);
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!mounted) return;
      setIsAdmin(Boolean(data));
      setLoading(false);
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { check(); });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return { loading, isAdmin, userId };
}