"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { BookOpen, Clock, Edit, List, Plus, Ruler, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkoutTemplate {
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
  duration_minutes: number | null;
  distance_km: number | null;
  description: string | null;
  objective: string | null;
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

export default function WorkoutsPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<WorkoutTemplate | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<
    "running" | "cycling" | "swimming"
  >("running");

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
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    discipline: "running" as "running" | "cycling" | "swimming",
    workout_type: "endurance" as
      | "interval"
      | "endurance"
      | "tempo"
      | "recovery"
      | "race"
      | "test",
    duration_minutes: "",
    distance_km: "",
    description: "",
    objective: "",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUserId(session.user.id);

        // Load only templates (scheduled_date IS NULL)
        const { data, error } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", session.user.id)
          .is("scheduled_date", null)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setTemplates(data || []);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des templates:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates de séances",
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

  const deleteTemplate = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) return;

    try {
      const { error } = await supabase.from("workouts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Template supprimé",
        description: "Le template de séance a été supprimé avec succès",
      });

      loadTemplates();
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le template",
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
      duration_minutes: blockFormData.duration_minutes
        ? parseInt(blockFormData.duration_minutes)
        : null,
      distance_km: blockFormData.distance_km
        ? parseFloat(blockFormData.distance_km)
        : null,
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
      duration_minutes: blockFormData.duration_minutes
        ? parseInt(blockFormData.duration_minutes)
        : null,
      distance_km: blockFormData.distance_km
        ? parseFloat(blockFormData.distance_km)
        : null,
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

  const resetForm = () => {
    setFormData({
      title: "",
      discipline: "running",
      workout_type: "endurance",
      duration_minutes: "",
      distance_km: "",
      description: "",
      objective: "",
    });
    setEditingTemplate(null);
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

  const openEditDialog = async (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      discipline: template.discipline,
      workout_type: template.workout_type,
      duration_minutes: template.duration_minutes?.toString() || "",
      distance_km: template.distance_km?.toString() || "",
      description: template.description || "",
      objective: template.objective || "",
    });
    setIsDialogOpen(true);

    // Load zones and blocks for this template
    if (userId) {
      await loadZones(template.discipline);
      await loadWorkoutBlocks(template.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre",
        variant: "destructive",
      });
      return;
    }

    try {
      const templateData = {
        user_id: userId,
        title: formData.title,
        discipline: formData.discipline,
        workout_type: formData.workout_type,
        scheduled_date: null, // NULL = template
        duration_minutes: formData.duration_minutes
          ? parseInt(formData.duration_minutes)
          : null,
        distance_km: formData.distance_km
          ? parseFloat(formData.distance_km)
          : null,
        description: formData.description || null,
        objective: formData.objective || null,
        status: "draft" as const,
      };

      let workoutId: string;

      if (editingTemplate) {
        // Update existing template
        const { error } = await supabase
          .from("workouts")
          .update(templateData)
          .eq("id", editingTemplate.id);

        if (error) throw error;

        workoutId = editingTemplate.id;

        // Delete existing blocks
        await supabase
          .from("workout_blocks")
          .delete()
          .eq("workout_id", workoutId);

        toast({
          title: "Template modifié",
          description: "Le template de séance a été modifié avec succès",
        });
      } else {
        // Create new template
        const { data, error } = await supabase
          .from("workouts")
          .insert(templateData)
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error("Impossible de créer le template");

        workoutId = data.id;

        toast({
          title: "Template créé",
          description: "Le template de séance a été créé avec succès",
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
            description:
              "Le template a été créé mais certains blocs n'ont pas pu être sauvegardés",
            variant: "destructive",
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
      loadTemplates();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le template",
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

  const filteredTemplates = templates.filter(
    (t) => t.discipline === selectedDiscipline
  );

  const disciplines = [
    { id: "running" as const, name: "Course à pied" },
    { id: "cycling" as const, name: "Vélo" },
    { id: "swimming" as const, name: "Natation" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Bibliothèque de séances</h1>
          <p className="text-sub">
            Créez des templates de séances réutilisables pour votre calendrier
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau template
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <h3 className="font-semibold mb-4 text-neutral-900">Sports</h3>
            <nav className="space-y-2">
              {disciplines.map((discipline) => {
                return (
                  <button
                    key={discipline.id}
                    onClick={() => setSelectedDiscipline(discipline.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                      selectedDiscipline === discipline.id
                        ? "bg-accent-500 text-neutral-900 font-medium"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#000000",
                        mask: `url(/icons/${discipline.id}.svg) no-repeat center / contain`,
                        WebkitMask: `url(/icons/${discipline.id}.svg) no-repeat center / contain`,
                      }}
                    />
                    <span>{discipline.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
              <h3 className="mb-2">Aucun template de séance</h3>
              <p className="text-sub mb-6">
                Créez des templates de séances réutilisables que vous pourrez
                ajouter à votre calendrier
              </p>
              <Button
                onClick={openCreateDialog}
                className="bg-accent-500 hover:bg-accent-600 text-neutral-900"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer un template
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openEditDialog(template)}
                >
                  <div className="flex items-center gap-6">
                    {/* Type de séance */}
                    <div className="flex-shrink-0">
                      <span className="px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-700">
                        {workoutTypeLabels[template.workout_type]}
                      </span>
                    </div>

                    {/* Titre */}
                    <div className="flex-1 min-w-0">
                      <h3 className="">{template.title}</h3>
                      {template.objective && (
                        <p className="text-sm text-sub line-clamp-1 mt-1">
                          {template.objective}
                        </p>
                      )}
                    </div>

                    {/* Durée et distance */}
                    <div className="flex items-center gap-6 text-sm text-sub flex-shrink-0">
                      {template.duration_minutes && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{template.duration_minutes} min</span>
                        </div>
                      )}
                      {template.distance_km && (
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4" />
                          <span>{template.distance_km} km</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(template);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Modifier le template" : "Nouveau template"}
            </DialogTitle>
            <DialogDescription>
              Créez un template de séance réutilisable pour votre calendrier
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
                  onValueChange={async (
                    value: "running" | "cycling" | "swimming"
                  ) => {
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
                    value:
                      | "interval"
                      | "endurance"
                      | "tempo"
                      | "recovery"
                      | "race"
                      | "test"
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
                    const zone = availableZones.find(
                      (z) => z.id === block.zone_id
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {block.repetitions > 1
                                ? `${block.repetitions}x `
                                : ""}
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
                            {block.distance_km && (
                              <span>{block.distance_km} km</span>
                            )}
                            {block.notes && (
                              <span className="italic">{block.notes}</span>
                            )}
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
                      onValueChange={(
                        value: "warmup" | "main" | "recovery" | "cooldown"
                      ) =>
                        setBlockFormData({
                          ...blockFormData,
                          block_type: value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warmup">Échauffement</SelectItem>
                        <SelectItem value="main">Bloc principal</SelectItem>
                        <SelectItem value="recovery">Récupération</SelectItem>
                        <SelectItem value="cooldown">
                          Retour au calme
                        </SelectItem>
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
                      setBlockFormData({
                        ...blockFormData,
                        notes: e.target.value,
                      })
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
                  {editingBlockIndex !== null
                    ? "Modifier le bloc"
                    : "Ajouter un bloc"}
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
                {editingTemplate ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
