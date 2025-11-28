"use client";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Activity, Calendar, Target } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">
          Bonjour, {user?.user_metadata?.full_name || "Athlète"} !
        </h1>
        <p className="text-sub">
          Bienvenue sur votre tableau de bord d'entraînement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-sub">Zones configurées</p>
              <h3 className="text-neutral-900">0 / 3</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-sub">Séances planifiées</p>
              <h3 className="text-neutral-900">0</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-sub">Cette semaine</p>
              <h3 className="text-neutral-900">0 séances</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Commencer</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h4 className="mb-1">Configurez vos zones d'entraînement</h4>
              <p className="text-sm text-sub">
                Calculez vos zones VMA, FTP et CSS pour personnaliser vos
                entraînements
              </p>
            </div>
            <a
              href="/dashboard/zones"
              className="px-4 py-3 bg-accent-500 hover:bg-accent-600 text-neutral-900 rounded-lg transition-smooth"
            >
              Configurer
            </a>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h4 className="mb-1">Complétez votre profil</h4>
              <p className="text-sm text-sub">
                Ajoutez vos informations pour un suivi plus précis
              </p>
            </div>
            <a
              href="/dashboard/profile"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-smooth"
            >
              Mon profil
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
