"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface Workout {
  id: string;
  title: string;
  discipline: "running" | "cycling" | "swimming";
  workout_type: "interval" | "endurance" | "tempo" | "recovery" | "race" | "test";
  scheduled_date: string;
  duration_minutes: number | null;
  distance_km: number | null;
  status: "planned" | "completed" | "cancelled" | "draft";
}

const disciplineColors = {
  running: "bg-green-500",
  cycling: "bg-blue-500",
  swimming: "bg-cyan-500",
};

const disciplineLabels = {
  running: "Course",
  cycling: "Vélo",
  swimming: "Natation",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, [currentDate]);

  const loadWorkouts = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("scheduled_date", start.toISOString())
        .lte("scheduled_date", end.toISOString())
        .order("scheduled_date", { ascending: true });

      if (error) throw error;

      setWorkouts(data || []);
    } catch (error: any) {
      console.error("Erreur lors du chargement des séances:", error);
    } finally {
      setLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getWorkoutsForDay = (date: Date) => {
    return workouts.filter((workout) =>
      isSameDay(new Date(workout.scheduled_date), date)
    );
  };

  const days = getDaysInMonth();
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Add empty cells for days before the first day of the month
  const firstDayOfMonth = days[0].getDay();
  const emptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sub">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Calendrier</h1>
          <p className="text-sub">Visualisez et planifiez vos entraînements</p>
        </div>
        <Button className="bg-accent-500 hover:bg-accent-600 text-neutral-900">
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle séance
        </Button>
      </div>

      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Aujourd'hui
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-sub p-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells before first day */}
          {Array.from({ length: emptyDays }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[100px] p-2" />
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const dayWorkouts = getWorkoutsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] p-2 border rounded-lg transition-colors cursor-pointer hover:bg-neutral-50 ${
                  isTodayDate ? "bg-accent-50 border-accent-500" : "border-neutral-200"
                } ${!isCurrentMonth ? "opacity-50" : ""}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isTodayDate ? "text-accent-500" : "text-neutral-700"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayWorkouts.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayWorkouts.length}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {dayWorkouts.slice(0, 3).map((workout) => (
                    <div
                      key={workout.id}
                      className={`text-xs p-1 rounded ${
                        disciplineColors[workout.discipline]
                      } text-white truncate`}
                      title={workout.title}
                    >
                      {workout.title}
                    </div>
                  ))}
                  {dayWorkouts.length > 3 && (
                    <div className="text-xs text-sub">
                      +{dayWorkouts.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="mt-6 p-6">
          <h3 className="mb-4 font-semibold">
            Séances du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </h3>
          {getWorkoutsForDay(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sub mb-4">Aucune séance planifiée ce jour</p>
              <Button className="bg-accent-500 hover:bg-accent-600 text-neutral-900">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une séance
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {getWorkoutsForDay(selectedDate).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
                >
                  <div
                    className={`w-1 h-12 rounded ${
                      disciplineColors[workout.discipline]
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={disciplineColors[workout.discipline]}>
                        {disciplineLabels[workout.discipline]}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
