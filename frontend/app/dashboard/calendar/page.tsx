"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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

const workoutTypeLabels = {
  interval: "Fractionné",
  endurance: "Endurance",
  tempo: "Tempo",
  recovery: "Récupération",
  race: "Compétition",
  test: "Test",
};

export default function CalendarPage() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    discipline: "running" as "running" | "cycling" | "swimming",
    workout_type: "endurance" as "interval" | "endurance" | "tempo" | "recovery" | "race" | "test",
    scheduled_date: "",
    duration_minutes: "",
    distance_km: "",
    description: "",
    objective: "",
  });

  useEffect(() => {
    loadWorkouts();
  }, [currentDate]);

  const loadWorkouts = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      setUserId(session.user.id);

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
      toast({
        title: "Erreur",
        description: "Impossible de charger les séances",
        variant: "destructive",
      });
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

  const resetForm = () => {
    setFormData({
      title: "",
      discipline: "running",
      workout_type: "endurance",
      scheduled_date: "",
      duration_minutes: "",
      distance_km: "",
      description: "",
      objective: "",
    });
  };

  const openCreateDialog = (date: Date) => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      scheduled_date: format(date, "yyyy-MM-dd"),
    }));
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.scheduled_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const workoutData = {
        user_id: userId,
        title: formData.title,
        discipline: formData.discipline,
        workout_type: formData.workout_type,
        scheduled_date: formData.scheduled_date,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
        description: formData.description || null,
        objective: formData.objective || null,
        status: "planned" as const,
      };

      const { error } = await supabase
        .from("workouts")
        .insert(workoutData);

      if (error) throw error;

      toast({
        title: "Séance créée",
        description: "La séance a été créée avec succès",
      });

      setIsDialogOpen(false);
      resetForm();
      loadWorkouts();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la séance",
        variant: "destructive",
      });
    }
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
        <Button
          onClick={() => openCreateDialog(new Date())}
          className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
        >
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
                onClick={() => {
                  setSelectedDate(day);
                  openCreateDialog(day);
                }}
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
              <Button
                onClick={() => openCreateDialog(selectedDate)}
                className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
              >
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

      {/* Dialog de création de séance */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle séance</DialogTitle>
            <DialogDescription>
              Configurez les détails de votre séance d'entraînement
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Sortie longue, Fractionné 10x400m..."
                required
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discipline">
                  Discipline <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value: "running" | "cycling" | "swimming") => {
                    setFormData({ ...formData, discipline: value });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="running">Course à pied</SelectItem>
                    <SelectItem value="cycling">Vélo</SelectItem>
                    <SelectItem value="swimming">Natation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workout_type">
                  Type de séance <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.workout_type}
                  onValueChange={(
                    value: "interval" | "endurance" | "tempo" | "recovery" | "race" | "test"
                  ) => setFormData({ ...formData, workout_type: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interval">Fractionné</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="tempo">Tempo</SelectItem>
                    <SelectItem value="recovery">Récupération</SelectItem>
                    <SelectItem value="race">Compétition</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="scheduled_date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration_minutes">Durée (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_minutes: e.target.value,
                    })
                  }
                  placeholder="60"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="distance_km">Distance (km)</Label>
                <Input
                  id="distance_km"
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={(e) =>
                    setFormData({ ...formData, distance_km: e.target.value })
                  }
                  placeholder="10"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objective">Objectif</Label>
              <Input
                id="objective"
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                placeholder="Ex: Travailler l'endurance fondamentale"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Détails de la séance..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
              >
                Créer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
