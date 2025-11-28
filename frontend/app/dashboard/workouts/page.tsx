"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Clock, Ruler, Trash2, Edit, List } from "lucide-react";

interface Workout {
  id: string;
  title: string;
  discipline: "running" | "cycling" | "swimming";
  workout_type: "interval" | "endurance" | "tempo" | "recovery" | "race" | "test";
  scheduled_date: string;
  duration_minutes: number | null;
  distance_km: number | null;
  description: string | null;
  objective: string | null;
  status: "planned" | "completed" | "cancelled" | "draft";
}

interface WorkoutBlock {
  id: string;
  workout_id: string;
  block_order: number;
  block_type: "warmup" | "main" | "recovery" | "cooldown";
  duration_minutes: number | null;
  distance_km: number | null;
  zone_id: string | null;
  repetitions: number;
  notes: string | null;
}

interface Zone {
  id: string;
  zone_number: number;
  zone_name: string;
  min_value: number;
  max_value: number;
  color: string;
}

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

const blockTypeLabels = {
  warmup: "Échauffement",
  main: "Bloc principal",
  recovery: "Récupération",
  cooldown: "Retour au calme",
};

const disciplineColors = {
  running: "bg-green-100 text-green-800",
  cycling: "bg-blue-100 text-blue-800",
  swimming: "bg-cyan-100 text-cyan-800",
};

export default function WorkoutsPage() {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Blocks management
  const [workoutBlocks, setWorkoutBlocks] = useState<WorkoutBlock[]>([]);
  const [availableZones, setAvailableZones] = useState<Zone[]>([]);
  const [blockFormData, setBlockFormData] = useState({
    block_type: "main" as "warmup" | "main" | "recovery" | "cooldown",
    duration_minutes: "",
    distance_km: "",
    zone_id: "",
    repetitions: "1",
    notes: "",
  });
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);

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
  }, []);

  const loadWorkouts = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUserId(session.user.id);

        const { data, error } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("scheduled_date", { ascending: true });

        if (error) throw error;

        setWorkouts(data || []);
      }
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

  const loadZones = async (discipline: string) => {
    try {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("user_id", userId)
        .eq("discipline", discipline)
        .order("zone_number", { ascending: true });

      if (error) throw error;

      setAvailableZones(data || []);
    } catch (error: any) {
      console.error("Erreur lors du chargement des zones:", error);
    }
  };

  const loadWorkoutBlocks = async (workoutId: string) => {
    try {
      const { data, error } = await supabase
        .from("workout_blocks")
        .select("*")
        .eq("workout_id", workoutId)
        .order("block_order", { ascending: true });

      if (error) throw error;

      setWorkoutBlocks(data || []);
    } catch (error: any) {
      console.error("Erreur lors du chargement des blocs:", error);
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) return;

    try {
      const { error } = await supabase.from("workouts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Séance supprimée",
        description: "La séance a été supprimée avec succès",
      });

      loadWorkouts();
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la séance",
        variant: "destructive",
      });
    }
  };

  const addBlock = () => {
    const newBlock: WorkoutBlock = {
      id: `temp-${Date.now()}`,
      workout_id: "",
      block_order: workoutBlocks.length + 1,
      block_type: blockFormData.block_type,
      duration_minutes: blockFormData.duration_minutes ? parseInt(blockFormData.duration_minutes) : null,
      distance_km: blockFormData.distance_km ? parseFloat(blockFormData.distance_km) : null,
      zone_id: blockFormData.zone_id || null,
      repetitions: parseInt(blockFormData.repetitions) || 1,
      notes: blockFormData.notes || null,
    };

    setWorkoutBlocks([...workoutBlocks, newBlock]);
    resetBlockForm();
  };

  const updateBlock = () => {
    if (editingBlockIndex === null) return;

    const updatedBlocks = [...workoutBlocks];
    updatedBlocks[editingBlockIndex] = {
      ...updatedBlocks[editingBlockIndex],
      block_type: blockFormData.block_type,
      duration_minutes: blockFormData.duration_minutes ? parseInt(blockFormData.duration_minutes) : null,
      distance_km: blockFormData.distance_km ? parseFloat(blockFormData.distance_km) : null,
      zone_id: blockFormData.zone_id || null,
      repetitions: parseInt(blockFormData.repetitions) || 1,
      notes: blockFormData.notes || null,
    };

    setWorkoutBlocks(updatedBlocks);
    setEditingBlockIndex(null);
    resetBlockForm();
  };

  const removeBlock = (index: number) => {
    const updatedBlocks = workoutBlocks.filter((_, i) => i !== index);
    // Update block_order
    updatedBlocks.forEach((block, i) => {
      block.block_order = i + 1;
    });
    setWorkoutBlocks(updatedBlocks);
  };

  const editBlock = (index: number) => {
    const block = workoutBlocks[index];
    setBlockFormData({
      block_type: block.block_type,
      duration_minutes: block.duration_minutes?.toString() || "",
      distance_km: block.distance_km?.toString() || "",
      zone_id: block.zone_id || "",
      repetitions: block.repetitions.toString(),
      notes: block.notes || "",
    });
    setEditingBlockIndex(index);
  };

  const resetBlockForm = () => {
    setBlockFormData({
      block_type: "main",
      duration_minutes: "",
      distance_km: "",
      zone_id: "",
      repetitions: "1",
      notes: "",
    });
    setEditingBlockIndex(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    setEditingWorkout(null);
    setWorkoutBlocks([]);
    setAvailableZones([]);
    resetBlockForm();
  };

  const openCreateDialog = async () => {
    resetForm();
    setIsDialogOpen(true);
    // Load zones for default discipline (running)
    if (userId) {
      await loadZones("running");
    }
  };

  const openEditDialog = async (workout: Workout) => {
    setEditingWorkout(workout);
    setFormData({
      title: workout.title,
      discipline: workout.discipline,
      workout_type: workout.workout_type,
      scheduled_date: workout.scheduled_date.split('T')[0],
      duration_minutes: workout.duration_minutes?.toString() || "",
      distance_km: workout.distance_km?.toString() || "",
      description: workout.description || "",
      objective: workout.objective || "",
    });
    setIsDialogOpen(true);

    // Load zones and blocks for this workout
    if (userId) {
      await loadZones(workout.discipline);
      await loadWorkoutBlocks(workout.id);
    }
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

      let workoutId: string;

      if (editingWorkout) {
        // Update existing workout
        const { error } = await supabase
          .from("workouts")
          .update(workoutData)
          .eq("id", editingWorkout.id);

        if (error) throw error;

        workoutId = editingWorkout.id;

        // Delete existing blocks
        await supabase.from("workout_blocks").delete().eq("workout_id", workoutId);

        toast({
          title: "Séance modifiée",
          description: "La séance a été modifiée avec succès",
        });
      } else {
        // Create new workout
        const { data, error } = await supabase
          .from("workouts")
          .insert(workoutData)
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error("Impossible de créer la séance");

        workoutId = data.id;

        toast({
          title: "Séance créée",
          description: "La séance a été créée avec succès",
        });
      }

      // Save workout blocks if any
      if (workoutBlocks.length > 0) {
        const blocksToSave = workoutBlocks.map((block, index) => ({
          workout_id: workoutId,
          block_order: index + 1,
          block_type: block.block_type,
          duration_minutes: block.duration_minutes,
          distance_km: block.distance_km,
          zone_id: block.zone_id,
          repetitions: block.repetitions,
          notes: block.notes,
        }));

        const { error: blocksError } = await supabase
          .from("workout_blocks")
          .insert(blocksToSave);

        if (blocksError) {
          console.error("Erreur lors de la sauvegarde des blocs:", blocksError);
          toast({
            title: "Attention",
            description: "La séance a été créée mais certains blocs n'ont pas pu être sauvegardés",
            variant: "destructive",
          });
        }
      }

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
          <h1 className="mb-2">Séances d'entraînement</h1>
          <p className="text-sub">Planifiez et suivez vos entraînements</p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle séance
        </Button>
      </div>

      {workouts.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
          <h3 className="mb-2">Aucune séance planifiée</h3>
          <p className="text-sub mb-6">
            Commencez par créer votre première séance d'entraînement
          </p>
          <Button
            onClick={openCreateDialog}
            className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
          >
            <Plus className="w-5 h-5 mr-2" />
            Créer une séance
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <Card key={workout.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        disciplineColors[workout.discipline]
                      }`}
                    >
                      {disciplineLabels[workout.discipline]}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-700">
                      {workoutTypeLabels[workout.workout_type]}
                    </span>
                  </div>

                  <h3 className="mb-2">{workout.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-sub mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(workout.scheduled_date)}
                    </div>
                    {workout.duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workout.duration_minutes} min
                      </div>
                    )}
                    {workout.distance_km && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        {workout.distance_km} km
                      </div>
                    )}
                  </div>

                  {workout.objective && (
                    <p className="text-sm text-sub">
                      <strong>Objectif :</strong> {workout.objective}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(workout)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWorkout(workout.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWorkout ? "Modifier la séance" : "Nouvelle séance"}
            </DialogTitle>
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
                  onValueChange={async (value: "running" | "cycling" | "swimming") => {
                    setFormData({ ...formData, discipline: value });
                    // Reload zones when discipline changes
                    if (userId) {
                      await loadZones(value);
                    }
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

            {/* Workout Blocks Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5" />
                <h3 className="font-semibold">Blocs d'entraînement</h3>
              </div>

              {/* Existing blocks list */}
              {workoutBlocks.length > 0 && (
                <div className="space-y-2 mb-4">
                  {workoutBlocks.map((block, index) => {
                    const zone = availableZones.find((z) => z.id === block.zone_id);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {block.repetitions > 1 ? `${block.repetitions}x ` : ""}
                              {blockTypeLabels[block.block_type]}
                            </span>
                            {zone && (
                              <span
                                className={`px-2 py-0.5 rounded text-xs text-white ${zone.color}`}
                              >
                                Zone {zone.zone_number}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-sub flex gap-3">
                            {block.duration_minutes && (
                              <span>{block.duration_minutes} min</span>
                            )}
                            {block.distance_km && <span>{block.distance_km} km</span>}
                            {block.notes && <span className="italic">{block.notes}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => editBlock(index)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeBlock(index)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add/Edit block form */}
              <div className="bg-neutral-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="block_type">Type de bloc</Label>
                    <Select
                      value={blockFormData.block_type}
                      onValueChange={(value: "warmup" | "main" | "recovery" | "cooldown") =>
                        setBlockFormData({ ...blockFormData, block_type: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warmup">Échauffement</SelectItem>
                        <SelectItem value="main">Bloc principal</SelectItem>
                        <SelectItem value="recovery">Récupération</SelectItem>
                        <SelectItem value="cooldown">Retour au calme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="zone_select">Zone (optionnel)</Label>
                    <Select
                      value={blockFormData.zone_id || undefined}
                      onValueChange={(value) =>
                        setBlockFormData({ ...blockFormData, zone_id: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une zone (optionnel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableZones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            Zone {zone.zone_number} - {zone.zone_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="block_duration">Durée (min)</Label>
                    <Input
                      id="block_duration"
                      type="number"
                      value={blockFormData.duration_minutes}
                      onChange={(e) =>
                        setBlockFormData({
                          ...blockFormData,
                          duration_minutes: e.target.value,
                        })
                      }
                      placeholder="30"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="block_distance">Distance (km)</Label>
                    <Input
                      id="block_distance"
                      type="number"
                      step="0.1"
                      value={blockFormData.distance_km}
                      onChange={(e) =>
                        setBlockFormData({
                          ...blockFormData,
                          distance_km: e.target.value,
                        })
                      }
                      placeholder="5"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="block_repetitions">Répétitions</Label>
                    <Input
                      id="block_repetitions"
                      type="number"
                      value={blockFormData.repetitions}
                      onChange={(e) =>
                        setBlockFormData({
                          ...blockFormData,
                          repetitions: e.target.value,
                        })
                      }
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="block_notes">Notes</Label>
                  <Input
                    id="block_notes"
                    value={blockFormData.notes}
                    onChange={(e) =>
                      setBlockFormData({ ...blockFormData, notes: e.target.value })
                    }
                    placeholder="Récupération active entre les répétitions..."
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={editingBlockIndex !== null ? updateBlock : addBlock}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {editingBlockIndex !== null ? "Modifier le bloc" : "Ajouter un bloc"}
                </Button>
              </div>
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
                {editingWorkout ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
