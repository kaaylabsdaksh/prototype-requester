import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import logo from "@/assets/aok-logo.png";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "At least 8 characters").max(72);
const nameSchema = z.string().trim().min(1, "Required").max(100);

export default function AuthPage() {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    document.title = "Sign in · AOK Events";
  }, []);

  if (!authLoading && session) {
    return <Navigate to="/requester" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const emailParsed = emailSchema.safeParse(email);
      const pwParsed = passwordSchema.safeParse(password);
      if (!emailParsed.success) return toast.error(emailParsed.error.issues[0].message);
      if (!pwParsed.success) return toast.error(pwParsed.error.issues[0].message);

      if (mode === "signup") {
        const nameParsed = nameSchema.safeParse(fullName);
        if (!nameParsed.success) return toast.error("Please enter your name");

        const { error } = await supabase.auth.signUp({
          email: emailParsed.data,
          password: pwParsed.data,
          options: {
            emailRedirectTo: `${window.location.origin}/requester`,
            data: { full_name: nameParsed.data },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
        navigate("/requester", { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailParsed.data,
          password: pwParsed.data,
        });
        if (error) throw error;
        navigate("/requester", { replace: true });
      }
    } catch (err: any) {
      const msg = err?.message ?? "Something went wrong";
      if (msg.toLowerCase().includes("already registered")) {
        toast.error("This email is already registered. Try signing in instead.");
      } else if (msg.toLowerCase().includes("invalid login")) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/requester",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return; // browser is redirecting
    navigate("/requester", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-bg p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-border/60 bg-card/90 p-8 shadow-panel backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="AOK Events" className="mb-3 h-12 w-12 rounded-full shadow-elegant" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Welcome to AOK Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage bookings and enquiries.</p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 rounded-full">
            <TabsTrigger value="signin" className="rounded-full">Sign in</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full">Create account</TabsTrigger>
          </TabsList>

          <form onSubmit={handleEmailAuth} className="mt-5 space-y-4">
            <TabsContent value="signup" className="m-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Cooper" autoComplete="name" />
              </div>
            </TabsContent>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === "signin" ? "current-password" : "new-password"} required />
            </div>

            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </Tabs>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" disabled={busy} className="w-full rounded-full" onClick={handleGoogle}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.12V7.04H2.18a11 11 0 0 0 0 9.92l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          Continue with Google
        </Button>
      </div>
    </main>
  );
}
