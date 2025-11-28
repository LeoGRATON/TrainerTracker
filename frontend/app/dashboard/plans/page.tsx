"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";

interface TrainingPlan {
  id: string;
  name: string;
  goal: "Sprint" | "Olympic" | "Half" | "Ironman";
  level: "beginner" | "intermediate" | "advanced";
  duration_weeks: number;
  description: string;
  sessions_per_week: number;
  isPremium?: boolean;
}

const levelLabels = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

const goalLabels = {
  Sprint: "Sprint (750m/20km/5km)",
  Olympic: "Olympique (1.5km/40km/10km)",
  Half: "Half Ironman (1.9km/90km/21km)",
  Ironman: "Ironman (3.8km/180km/42km)",
};

const predefinedPlans: TrainingPlan[] = [
  {
    id: "1",
    name: "Préparation Sprint Débutant",
    goal: "Sprint",
    level: "beginner",
    duration_weeks: 8,
    description: "Plan idéal pour votre premier triathlon sprint. Progression douce et adaptée.",
    sessions_per_week: 4,
  },
  {
    id: "2",
    name: "Sprint Performance",
    goal: "Sprint",
    level: "intermediate",
    duration_weeks: 10,
    description: "Améliorez vos performances sur sprint avec des séances structurées.",
    sessions_per_week: 5,
  },
  {
    id: "3",
    name: "Olympique Découverte",
    goal: "Olympic",
    level: "beginner",
    duration_weeks: 12,
    description: "Passez au format olympique avec un plan progressif sur 12 semaines.",
    sessions_per_week: 5,
  },
  {
    id: "4",
    name: "Olympique Compétitif",
    goal: "Olympic",
    level: "intermediate",
    duration_weeks: 14,
    description: "Plan intensif pour performer sur distance olympique.",
    sessions_per_week: 6,
  },
  {
    id: "5",
    name: "Half Ironman Préparation",
    goal: "Half",
    level: "intermediate",
    duration_weeks: 16,
    description: "Préparez votre premier Half Ironman avec confiance.",
    sessions_per_week: 6,
    isPremium: true,
  },
  {
    id: "6",
    name: "Half Ironman Expert",
    goal: "Half",
    level: "advanced",
    duration_weeks: 18,
    description: "Programme avancé pour viser le podium sur Half Ironman.",
    sessions_per_week: 7,
    isPremium: true,
  },
  {
    id: "7",
    name: "Ironman Finisher",
    goal: "Ironman",
    level: "intermediate",
    duration_weeks: 20,
    description: "Terminez votre premier Ironman avec ce plan de 20 semaines.",
    sessions_per_week: 7,
    isPremium: true,
  },
  {
    id: "8",
    name: "Ironman Performance",
    goal: "Ironman",
    level: "advanced",
    duration_weeks: 24,
    description: "Plan expert pour performer sur Ironman avec volume élevé.",
    sessions_per_week: 8,
    isPremium: true,
  },
];

export default function PlansPage() {
  const [selectedGoal, setSelectedGoal] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const filteredPlans = predefinedPlans.filter((plan) => {
    if (selectedGoal !== "all" && plan.goal !== selectedGoal) return false;
    if (selectedLevel !== "all" && plan.level !== selectedLevel) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Plans d'entraînement</h1>
        <p className="text-sub">
          Choisissez un plan adapté à vos objectifs et votre niveau
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="w-64">
          <Select value={selectedGoal} onValueChange={setSelectedGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les distances" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les distances</SelectItem>
              <SelectItem value="Sprint">Sprint</SelectItem>
              <SelectItem value="Olympic">Olympique</SelectItem>
              <SelectItem value="Half">Half Ironman</SelectItem>
              <SelectItem value="Ironman">Ironman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-64">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les niveaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                {plan.isPremium && (
                  <Badge className="bg-accent-500 text-neutral-900">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{goalLabels[plan.goal]}</Badge>
                <Badge variant="secondary">
                  {levelLabels[plan.level]}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-sub mb-4">{plan.description}</p>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-sub">
                <Clock className="w-4 h-4" />
                <span>{plan.duration_weeks} semaines</span>
              </div>
              <div className="flex items-center gap-2 text-sub">
                <Calendar className="w-4 h-4" />
                <span>{plan.sessions_per_week} séances/semaine</span>
              </div>
              <div className="flex items-center gap-2 text-sub">
                <TrendingUp className="w-4 h-4" />
                <span>Progression structurée</span>
              </div>
            </div>

            <Link href={`/dashboard/plans/${plan.id}`}>
              <Button className="w-full bg-accent-500 hover:bg-accent-600 text-neutral-900">
                Voir les détails
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
          <h3 className="mb-2">Aucun plan trouvé</h3>
          <p className="text-sub mb-4">
            Essayez de modifier vos filtres pour voir plus de plans
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedGoal("all");
              setSelectedLevel("all");
            }}
          >
            Réinitialiser les filtres
          </Button>
        </Card>
      )}
    </div>
  );
}
