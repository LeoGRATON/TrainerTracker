"use client";

import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function ZonesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Zones d'Entraînement</h1>
        <p className="text-sub">
          Configurez vos zones VMA, FTP et CSS pour personnaliser vos
          entraînements
        </p>
      </div>

      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="mb-2">Fonctionnalité en cours de développement</h3>
        <p className="text-sub">
          La configuration des zones sera disponible dans la Phase 2
        </p>
      </Card>
    </div>
  );
}
