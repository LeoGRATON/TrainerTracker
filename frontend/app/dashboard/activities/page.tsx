"use client";

import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Mes Activités</h1>
        <p className="text-sub">
          Consultez l'historique de vos activités d'entraînement
        </p>
      </div>

      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="mb-2">Fonctionnalité en cours de développement</h3>
        <p className="text-sub">
          Le suivi des activités sera disponible dans les prochaines versions
        </p>
      </Card>
    </div>
  );
}
