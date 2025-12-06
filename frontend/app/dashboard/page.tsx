"use client";

import { Card } from "@/components/ui/card";
import { CheckIcon } from "@/components/ui/CheckIcon";
import { CircleProgress } from "@/components/ui/CircleProgress";
import IconSport from "@/components/ui/IconSport";
import { supabase } from "@/lib/supabase";
import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

interface Workout {
  id: string;
  title: string;
  discipline: "running" | "cycling" | "swimming";
  workout_type:
    | "interval"
    | "endurance"
    | "tempo"
    | "recovery"
    | "race"
    | "test";
  scheduled_date: string;
  duration_minutes: number | null;
  distance_km: number | null;
  description: string | null;
  objective: string | null;
  status: "planned" | "completed" | "cancelled" | "draft";
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const loadWorkouts = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      // Get workouts for current week
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", session.user.id)
        .not("scheduled_date", "is", null) // Only scheduled workouts
        .gte("scheduled_date", weekStart.toISOString())
        .lte("scheduled_date", weekEnd.toISOString())
        .order("scheduled_date", { ascending: true });

      if (!error && data) {
        setWorkouts(data);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const toggleStatus = async (workoutId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "planned" : "completed";
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === workoutId ? { ...workout, status: newStatus } : workout
      )
    );
    await supabase
      .from("workouts")
      .update({ status: newStatus })
      .eq("id", workoutId);
  };

  // Calculate completion stats
  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(
    (w) => w.status === "completed"
  ).length;
  const completionPercentage =
    totalWorkouts > 0
      ? Math.round((completedWorkouts / totalWorkouts) * 100)
      : 0;

  useEffect(() => {
    getUser();
    loadWorkouts();
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
          Bienvenue sur votre tableau de bord d'entraînement.
        </p>
      </div>

      <section className="flex gap-6 flex-col 2xl:flex-row">
        {/* Quick Actions */}
        <Card className="p-6 flex-1">
          <h2 className="mb-4 uppercase">Infos vedette</h2>
          <div>
            <div className="flex items-center justify-between bg-neutral-50 rounded-lg">
              <div className="flex flex-col items-start">
                <h3 className="mb-1">Complétez votre profil</h3>
                <p className="text-sm text-sub mb-4">
                  Ajoutez vos informations pour un suivi plus précis
                </p>
                <a
                  href="/dashboard/profile"
                  className="inline-block px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-smooth"
                >
                  Mon profil
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Onboarding */}
        <Card className="p-6 flex-1 bg-neutral-900">
          <div className="flex justify-between mb-4">
            <h2 className="uppercase text-neutral-50">Séances de la semaine</h2>
            <CircleProgress
              percentage={completionPercentage}
              size={70}
              text={`${completedWorkouts}/${totalWorkouts}`}
            />
          </div>
          <div className="space-y-3">
            {workouts.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <p>Aucune séance planifiée cette semaine</p>
              </div>
            ) : (
              workouts.map((workout) => (
                <Card
                  key={workout.id}
                  className="rounded-xl border-0 bg-transparent hover:bg-neutral-600 text-neutral-100 shadow-none p-3 flex gap-6 items-center"
                >
                  <IconSport
                    sport={`${workout.discipline}`}
                    size={24}
                    color="#ffffff"
                  />
                  <div className="flex-1">
                    <h3>{workout.title}</h3>
                    <p>{formatDate(workout.scheduled_date)}</p>
                  </div>
                  <CheckIcon
                    isActive={workout.status === "completed"}
                    onClick={() => toggleStatus(workout.id, workout.status)}
                  />
                </Card>
              ))
            )}
          </div>
        </Card>

        {/* Zones */}
        <Card className="p-6 flex-1">
          <h2 className="mb-4 uppercase">Mes zones</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-neutral-50 rounded-lg">
              <div className="flex flex-wrap">
                <h3 className="mb-1">Configurez vos zones d'entraînement</h3>
                <p className="text-sm text-sub mb-4">
                  Calculez vos zones VMA, FTP et CSS pour personnaliser vos
                  entraînements
                </p>
                <a
                  href="/dashboard/zones"
                  className="px-4 py-3 bg-accent-500 hover:bg-accent-600 text-neutral-900 rounded-lg transition-smooth"
                >
                  Configurer
                </a>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
