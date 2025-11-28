"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setProfile({
        full_name: session.user.user_metadata?.full_name || "",
        email: session.user.email || "",
        age: "",
        weight: "",
        height: "",
      });

      // Récupérer les données du profil depuis la base de données
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile((prev) => ({
          ...prev,
          age: profileData.age?.toString() || "",
          weight: profileData.weight?.toString() || "",
          height: profileData.height?.toString() || "",
        }));
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Non connecté");

      // Mettre à jour les métadonnées de l'utilisateur
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
        },
      });

      if (authError) throw authError;

      // Mettre à jour le profil dans la base de données
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          full_name: profile.full_name,
          age: profile.age ? parseInt(profile.age) : null,
          weight: profile.weight ? parseFloat(profile.weight) : null,
          height: profile.height ? parseFloat(profile.height) : null,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="mb-2">Mon Profil</h1>
        <p className="text-sub">Gérez vos informations personnelles</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
          <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-neutral-900" />
          </div>
          <div>
            <h3 className="mb-1">{profile.full_name || "Utilisateur"}</h3>
            <p className="text-sm text-sub">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              placeholder="Jean Dupont"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="mt-2 bg-neutral-100"
            />
            <p className="text-xs text-sub mt-1">
              L'email ne peut pas être modifié
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
                placeholder="25"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={profile.weight}
                onChange={(e) =>
                  setProfile({ ...profile, weight: e.target.value })
                }
                placeholder="70"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) =>
                  setProfile({ ...profile, height: e.target.value })
                }
                placeholder="175"
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => getProfile()}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
