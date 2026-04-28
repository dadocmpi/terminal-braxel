import { FormEvent, useState } from "react";
import { Shield, TerminalSquare } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Access = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next") ?? "/";
  const configMissing = searchParams.get("reason") === "config";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          password,
          next: nextPath,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message ?? "Nao foi possivel liberar o acesso.");
        return;
      }

      window.location.replace(payload.redirectTo ?? "/");
    } catch {
      setError("Falha ao validar a senha. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="terminal-border bg-black/80 p-8 shadow-[0_0_80px_rgba(234,179,8,0.08)]">
            <div className="terminal-header mb-8 flex items-center justify-between">
              <span>Protected terminal access</span>
              <span>Braxel Markets</span>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 border border-primary/30 bg-primary/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-primary">
                <TerminalSquare className="h-4 w-4" />
                Terminal Braxel
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-black uppercase tracking-[0.18em] text-foreground sm:text-5xl">
                  Access stays closed until the right password opens it.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                  This Vercel deployment is protected before the terminal loads. Use the shared access password to continue.
                </p>
              </div>

              <div className="grid gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground sm:grid-cols-3">
                <div className="terminal-border bg-secondary/60 p-4">
                  Private deployment
                </div>
                <div className="terminal-border bg-secondary/60 p-4">
                  HttpOnly cookie session
                </div>
                <div className="terminal-border bg-secondary/60 p-4">
                  Middleware enforced
                </div>
              </div>
            </div>
          </section>

          <Card className="terminal-border bg-card/95">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-[0.18em]">
                Enter password
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                The password is stored as a Vercel environment variable, so we can rotate it without changing the interface.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="access-password" className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Access password
                  </Label>
                  <Input
                    id="access-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="h-12 border-white/10 bg-black/60 font-mono"
                    disabled={isSubmitting}
                  />
                </div>

                {configMissing ? (
                  <div className="terminal-border bg-destructive/10 p-3 text-sm text-destructive-foreground">
                    A variavel APP_ACCESS_PASSWORD ainda nao foi configurada na Vercel.
                  </div>
                ) : null}

                {error ? (
                  <div className="terminal-border bg-destructive/10 p-3 text-sm text-destructive-foreground">
                    {error}
                  </div>
                ) : null}

                <Button type="submit" className="h-12 w-full font-black uppercase tracking-[0.22em]" disabled={isSubmitting || configMissing}>
                  {isSubmitting ? "Checking" : "Unlock terminal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Access;
