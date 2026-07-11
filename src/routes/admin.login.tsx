import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. If email confirmation is disabled you can log in now.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-gold-gradient">Admin {mode === "signup" ? "Signup" : "Login"}</h1>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
        <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
        <button disabled={loading} className="w-full gold-gradient rounded-full py-3 text-sm font-bold text-gold-foreground disabled:opacity-50">
          {loading ? "..." : mode === "signup" ? "Sign up" : "Log in"}
        </button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="w-full text-xs text-muted-foreground hover:text-gold">
          {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">Note: after signup, grant your user the admin role in Supabase.</p>
      </form>
    </div>
  );
}