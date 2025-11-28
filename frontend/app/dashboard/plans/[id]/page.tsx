"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Calendar, Clock, Play, CheckCircle2 } from "lucide-react";
import { format, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";

interface WeekWorkout {
  day: string;
  discipline: "running" | "cycling" | "swimming";
  workout_type: "interval" | "endurance" | "tempo" | "recovery" | "race" | "test";
  title: string;
  duration_minutes?: number;
  distance_km?: number;
  description?: string;
}

interface Week {
  week_number: number;
  focus: string;
  workouts: WeekWorkout[];
}

const planDetails: { [key: string]: { name: string; goal: string; level: string; duration_weeks: number; weeks: Week[] } } = {
  "1": {
    name: "Préparation Sprint Débutant",
    goal: "Sprint",
    level: "beginner",
    duration_weeks: 8,
    weeks: [
      {
        week_number: 1,
        focus: "Adaptation et technique de base",
        workouts: [
          { day: "Lundi", discipline: "running", workout_type: "endurance", title: "Course d'aisance", duration_minutes: 30 },
          { day: "Mercredi", discipline: "swimming", workout_type: "endurance", title: "Technique de nage", duration_minutes: 30, distance_km: 0.8 },
          { day: "Vendredi", discipline: "cycling", workout_type: "endurance", title: "Vélo récupération", duration_minutes: 45, distance_km: 20 },
          { day: "Samedi", discipline: "running", workout_type: "endurance", title: "Sortie longue", duration_minutes: 45 },
        ],
      },
      {
        week_number: 2,
        focus: "Augmentation progressive du volume",
        workouts: [
          { day: "Lundi", discipline: "running", workout_type: "interval", title: "Fractionné court", duration_minutes: 40, description: "10x200m Z4" },
          { day: "Mercredi", discipline: "swimming", workout_type: "interval", title: "Vitesse en natation", duration_minutes: 35, distance_km: 1 },
          { day: "Vendredi", discipline: "cycling", workout_type: "tempo", title: "Vélo tempo", duration_minutes: 60, distance_km: 25 },
          { day: "Samedi", discipline: "running", workout_type: "endurance", title: "Sortie longue", duration_minutes: 50 },
        ],
      },
    ],
  },
};

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [importing, setImporting] = useState(false);

  const plan = planDetails[params.id];

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h1 className="mb-4">Plan non trouvé</h1>
        <Link href="/dashboard/plans">
          <Button variant="outline">Retour aux plans</Button>
        </Link>
      </div>
    );
  }

  const handleImportPlan = async () => {
    setImporting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Non connecté");
      }

      const baseDate = new Date(startDate);
      const workoutsToCreate = [];

      // Générer toutes les séances du plan
      for (const week of plan.weeks) {
        const weekStartDate = addWeeks(baseDate, week.week_number - 1);

        for (const workout of week.workouts) {
          // Calculer le jour de la semaine
          let dayOffset = 0;
          switch (workout.day) {
            case "Lundi":
              dayOffset = 0;
              break;
            case "Mardi":
              dayOffset = 1;
              break;
            case "Mercredi":
              dayOffset = 2;
              break;
            case "Jeudi":
              dayOffset = 3;
              break;
            case "Vendredi":
              dayOffset = 4;
              break;
            case "Samedi":
              dayOffset = 5;
              break;
            case "Dimanche":
              dayOffset = 6;
              break;
          }

          const workoutDate = new Date(weekStartDate);
          workoutDate.setDate(workoutDate.getDate() + dayOffset);

          workoutsToCreate.push({
            user_id: session.user.id,
            title: workout.title,
            discipline: workout.discipline,
            workout_type: workout.workout_type,
            scheduled_date: workoutDate.toISOString(),
            duration_minutes: workout.duration_minutes || null,
            distance_km: workout.distance_km || null,
            description: workout.description || null,
            objective: `Semaine ${week.week_number} - ${week.focus}`,
            status: "planned",
          });
        }
      }

      // Insérer toutes les séances
      const { error } = await supabase
        .from("workouts")
        .insert(workoutsToCreate);

      if (error) throw error;

      toast({
        title: "Plan importé !",
        description: `${workoutsToCreate.length} séances ont été ajoutées à votre calendrier`,
      });

      setIsImportDialogOpen(false);
      router.push("/dashboard/calendar");
    } catch (error: any) {
      console.error("Erreur lors de l'import:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'importer le plan",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/plans">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour aux plans
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2">{plan.name}</h1>
            <div className="flex gap-2 mb-3">
              <Badge variant="outline">{plan.goal}</Badge>
              <Badge variant="secondary">{plan.level}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-sub">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{plan.duration_weeks} semaines</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{plan.weeks.reduce((acc, w) => acc + w.workouts.length, 0)} séances</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsImportDialogOpen(true)}
            className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
          >
            <Play className="w-4 h-4 mr-2" />
            Démarrer ce plan
          </Button>
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-6">
        {plan.weeks.map((week) => (
          <Card key={week.week_number} className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  Semaine {week.week_number}
                </h3>
                <Badge variant="outline">{week.workouts.length} séances</Badge>
              </div>
              <p className="text-sm text-sub font-medium">{week.focus}</p>
            </div>

            <div className="space-y-3">
              {week.workouts.map((workout, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="w-20 text-sm font-medium text-sub">
                    {workout.day}
                  </div>
                  <div
                    className={`w-1 h-12 rounded ${
                      workout.discipline === "running"
                        ? "bg-green-500"
                        : workout.discipline === "cycling"
                        ? "bg-blue-500"
                        : "bg-cyan-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          workout.discipline === "running"
                            ? "bg-green-500"
                            : workout.discipline === "cycling"
                            ? "bg-blue-500"
                            : "bg-cyan-500"
                        }
                      >
                        {workout.discipline === "running"
                          ? "Course"
                          : workout.discipline === "cycling"
                          ? "Vélo"
                          : "Natation"}
                      </Badge>
                      <h4 className="font-semibold">{workout.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-sub">
                      {workout.duration_minutes && (
                        <span>{workout.duration_minutes} min</span>
                      )}
                      {workout.distance_km && (
                        <span>{workout.distance_km} km</span>
                      )}
                      {workout.description && (
                        <span className="italic">{workout.description}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Démarrer le plan d'entraînement</DialogTitle>
            <DialogDescription>
              Choisissez la date de début de votre plan. Toutes les séances seront
              ajoutées à votre calendrier.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="start_date">
                Date de début <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm">
                <strong>Durée :</strong> {plan.duration_weeks} semaines
              </p>
              <p className="text-sm">
                <strong>Séances totales :</strong>{" "}
                {plan.weeks.reduce((acc, w) => acc + w.workouts.length, 0)}
              </p>
              <p className="text-sm">
                <strong>Date de fin :</strong>{" "}
                {format(
                  addWeeks(new Date(startDate), plan.duration_weeks),
                  "d MMMM yyyy",
                  { locale: fr }
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
              disabled={importing}
            >
              Annuler
            </Button>
            <Button
              onClick={handleImportPlan}
              disabled={importing}
              className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
            >
              <Play className="w-4 h-4 mr-2" />
              {importing ? "Import en cours..." : "Importer le plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
