"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug: Vérifier la configuration Supabase
  const checkSupabaseConfig = () => {
    console.log("=== CONFIGURATION SUPABASE ===");
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Key présente:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log("Supabase client:", supabase);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Debug
    checkSupabaseConfig();

    try {
      console.log("Tentative de connexion avec:", { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Réponse Supabase:", { data, error });

      if (error) {
        console.error("Erreur de connexion:", error);
        throw error;
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur TrainerTracker !",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erreur complète:", error);

      let errorMessage = error.message;

      // Messages d'erreur personnalisés
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect. Vérifiez vos identifiants.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "L'email n'est pas confirmé. Vérifiez votre boîte mail.";
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <img src="/logo/logo-noir.png" alt="TrainerTracker" />
          </div>

          <h1 className="text-center mb-2">Connexion</h1>
          <p className="text-center text-sub mb-8">
            Accédez à votre espace d'entraînement
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-500 hover:bg-accent-600 text-neutral-900"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="text-center text-sub mt-6">
            Pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              className="text-accent-500 hover:text-accent-600 font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
