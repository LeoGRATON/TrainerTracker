"use client";

import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function WorkoutsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Mes Séances</h1>
        <p className="text-sub">
          Planifiez et suivez vos séances d'entraînement
        </p>
      </div>

      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="mb-2">Fonctionnalité en cours de développement</h3>
        <p className="text-sub">
          La gestion des séances sera disponible dans la Phase 3
        </p>
      </Card>
    </div>
  );
}
