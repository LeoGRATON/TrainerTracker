"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  Info,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Zone {
  number: number;
  name: string;
  percentage: [number, number];
  color: string;
}

const vmaZones: Zone[] = [
  { number: 1, name: "Récupération", percentage: [60, 70], color: "bg-blue-500" },
  { number: 2, name: "Endurance", percentage: [70, 80], color: "bg-green-500" },
  { number: 3, name: "Tempo", percentage: [80, 90], color: "bg-yellow-500" },
  { number: 4, name: "Seuil", percentage: [90, 95], color: "bg-orange-500" },
  { number: 5, name: "VO2max", percentage: [95, 100], color: "bg-red-500" },
];

const ftpZones: Zone[] = [
  { number: 1, name: "Récupération", percentage: [1, 55], color: "bg-blue-500" },
  { number: 2, name: "Endurance", percentage: [56, 75], color: "bg-green-500" },
  { number: 3, name: "Tempo", percentage: [76, 90], color: "bg-yellow-500" },
  { number: 4, name: "Seuil", percentage: [91, 105], color: "bg-orange-500" },
  { number: 5, name: "VO2max", percentage: [106, 120], color: "bg-red-500" },
];

const cssZones: Zone[] = [
  { number: 1, name: "Récupération", percentage: [60, 70], color: "bg-blue-500" },
  { number: 2, name: "Endurance", percentage: [71, 80], color: "bg-green-500" },
  { number: 3, name: "Tempo", percentage: [81, 90], color: "bg-yellow-500" },
  { number: 4, name: "Seuil", percentage: [91, 95], color: "bg-orange-500" },
  { number: 5, name: "Vitesse", percentage: [96, 100], color: "bg-red-500" },
];

export default function ZonesPage() {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");

  // VMA
  const [vma, setVma] = useState("");
  const [showVmaHelp, setShowVmaHelp] = useState(false);
  const [vmaCalculated, setVmaCalculated] = useState(false);

  // FTP/PC
  const [metricType, setMetricType] = useState<"ftp" | "pc">("ftp");
  const [ftp, setFtp] = useState("");
  const [showFtpHelp, setShowFtpHelp] = useState(false);
  const [ftpCalculated, setFtpCalculated] = useState(false);

  // CSS
  const [css, setCss] = useState("");
  const [showCssHelp, setShowCssHelp] = useState(false);
  const [cssCalculated, setCssCalculated] = useState(false);

  useEffect(() => {
    loadUserMetrics();
  }, []);

  const loadUserMetrics = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setUserId(session.user.id);

      // Charger les métriques existantes
      const { data } = await supabase
        .from("metrics")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        const vmaMetric = data.find((m) => m.metric_type === "vma");
        const ftpMetric = data.find((m) => m.metric_type === "ftp");
        const cssMetric = data.find((m) => m.metric_type === "css");

        if (vmaMetric) {
          setVma(vmaMetric.value.toString());
          setVmaCalculated(true);
        }
        if (ftpMetric) {
          setFtp(ftpMetric.value.toString());
          setFtpCalculated(true);
        }
        if (cssMetric) {
          setCss(cssMetric.value.toString());
          setCssCalculated(true);
        }
      }
    }
  };

  const saveMetric = async (
    type: "vma" | "ftp" | "pc" | "css",
    value: string,
    discipline: "running" | "cycling" | "swimming"
  ) => {
    if (!value || parseFloat(value) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur valide",
        variant: "destructive",
      });
      return;
    }

    try {
      // Déterminer l'unité selon le type de métrique
      const unit = type === "vma" ? "km/h" : (type === "ftp" || type === "pc") ? "watts" : "sec/100m";

      // Pour PC, on sauvegarde comme FTP car c'est la même unité (watts)
      const metricTypeForDB = type === "pc" ? "ftp" : type;

      // Sauvegarder la métrique
      const { error: metricError } = await supabase.from("metrics").insert({
        user_id: userId,
        metric_type: metricTypeForDB,
        value: parseFloat(value),
        discipline,
        unit,
        test_date: new Date().toISOString().split('T')[0], // Date du jour au format YYYY-MM-DD
      });

      if (metricError) throw metricError;

      // Calculer et sauvegarder les zones
      const zones = type === "vma" ? vmaZones : (type === "ftp" || type === "pc") ? ftpZones : cssZones;
      const baseValue = parseFloat(value);

      const zonesToSave = zones.map((zone) => ({
        user_id: userId,
        discipline,
        zone_number: zone.number,
        zone_name: zone.name,
        min_value: (baseValue * zone.percentage[0]) / 100,
        max_value: (baseValue * zone.percentage[1]) / 100,
        percentage_min: zone.percentage[0],
        percentage_max: zone.percentage[1],
        color: zone.color,
      }));

      console.log("Zones à sauvegarder:", zonesToSave);

      const { error: zonesError } = await supabase
        .from("zones")
        .delete()
        .eq("user_id", userId)
        .eq("discipline", discipline);

      if (zonesError) throw zonesError;

      const { error: insertError } = await supabase
        .from("zones")
        .insert(zonesToSave);

      if (insertError) throw insertError;

      toast({
        title: "Zones calculées !",
        description: `Vos zones de ${discipline === "running" ? "course" : discipline === "cycling" ? "vélo" : "natation"} ont été enregistrées.`,
      });

      if (type === "vma") setVmaCalculated(true);
      if (type === "ftp" || type === "pc") setFtpCalculated(true);
      if (type === "css") setCssCalculated(true);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const calculateZoneValues = (baseValue: string, zones: Zone[]) => {
    if (!baseValue || parseFloat(baseValue) <= 0) return null;
    const base = parseFloat(baseValue);
    return zones.map((zone) => ({
      ...zone,
      min: ((base * zone.percentage[0]) / 100).toFixed(1),
      max: ((base * zone.percentage[1]) / 100).toFixed(1),
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Zones d'Entraînement</h1>
        <p className="text-sub">
          Configurez vos zones pour les 3 disciplines
        </p>
      </div>

      <Tabs defaultValue="running" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="running">Course à pied</TabsTrigger>
          <TabsTrigger value="cycling">Vélo</TabsTrigger>
          <TabsTrigger value="swimming">Natation</TabsTrigger>
        </TabsList>

        {/* Course à pied - VMA */}
        <TabsContent value="running" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3>VMA - Vitesse Maximale Aérobie</h3>
                <p className="text-sm text-sub">
                  Vitesse que vous pouvez maintenir pendant environ 6 minutes
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="vma">Ma VMA (km/h)</Label>
                <Input
                  id="vma"
                  type="number"
                  step="0.1"
                  value={vma}
                  onChange={(e) => setVma(e.target.value)}
                  placeholder="14.5"
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => saveMetric("vma", vma, "running")}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Calculer mes zones
              </Button>

              {/* Help Section */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowVmaHelp(!showVmaHelp)}
                  className="flex items-center gap-2 text-sm text-sub hover:text-neutral-900 transition-smooth"
                >
                  <Info className="w-4 h-4" />
                  Comment obtenir ma VMA ?
                  {showVmaHelp ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showVmaHelp && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg space-y-3">
                    <h4 className="font-semibold">Tests recommandés :</h4>
                    <ul className="space-y-2 text-sm text-sub">
                      <li>
                        <strong>Test VAMEVAL :</strong> Course progressive avec
                        paliers de 1 min jusqu'à épuisement
                      </li>
                      <li>
                        <strong>Test demi-Cooper (6 min) :</strong> Distance
                        maximale en 6 minutes, VMA = distance / 100
                      </li>
                      <li>
                        <strong>Test de piste 1500m :</strong> VMA = (3600 /
                        temps en secondes) × 1.5
                      </li>
                    </ul>
                    <p className="text-sm italic">
                      💡 Conseil : Faites-vous accompagner ou utilisez une
                      application comme Décathlon Coach
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Zones VMA */}
          {vma && parseFloat(vma) > 0 && (
            <Card className="p-6">
              <h3 className="mb-4">Vos zones de course</h3>
              <div className="space-y-3">
                {calculateZoneValues(vma, vmaZones)?.map((zone) => (
                  <div
                    key={zone.number}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${zone.color} rounded-lg`}></div>
                      <div>
                        <p className="font-semibold">
                          Zone {zone.number} - {zone.name}
                        </p>
                        <p className="text-sm text-sub">
                          {zone.percentage[0]}% - {zone.percentage[1]}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {zone.min} - {zone.max} km/h
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Vélo - FTP/PC */}
        <TabsContent value="cycling" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3>FTP / Puissance Critique</h3>
                <p className="text-sm text-sub">
                  Puissance que vous pouvez maintenir pendant 1 heure
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setMetricType("ftp")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-smooth ${
                    metricType === "ftp"
                      ? "border-blue-500 bg-blue-50"
                      : "border-neutral-200"
                  }`}
                >
                  <p className="font-semibold">FTP</p>
                  <p className="text-xs text-sub">Functional Threshold Power</p>
                </button>
                <button
                  onClick={() => setMetricType("pc")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-smooth ${
                    metricType === "pc"
                      ? "border-blue-500 bg-blue-50"
                      : "border-neutral-200"
                  }`}
                >
                  <p className="font-semibold">PC</p>
                  <p className="text-xs text-sub">Puissance Critique</p>
                </button>
              </div>

              <div>
                <Label htmlFor="ftp">
                  Ma {metricType === "ftp" ? "FTP" : "Puissance Critique"} (watts)
                </Label>
                <Input
                  id="ftp"
                  type="number"
                  value={ftp}
                  onChange={(e) => setFtp(e.target.value)}
                  placeholder="250"
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => saveMetric(metricType, ftp, "cycling")}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Calculer mes zones
              </Button>

              {/* Help Section */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowFtpHelp(!showFtpHelp)}
                  className="flex items-center gap-2 text-sm text-sub hover:text-neutral-900 transition-smooth"
                >
                  <Info className="w-4 h-4" />
                  Comment obtenir ma {metricType === "ftp" ? "FTP" : "PC"} ?
                  {showFtpHelp ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showFtpHelp && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg space-y-3">
                    <h4 className="font-semibold">Tests recommandés :</h4>
                    {metricType === "ftp" ? (
                      <ul className="space-y-2 text-sm text-sub">
                        <li>
                          <strong>Test FTP 20 min :</strong> Puissance moyenne
                          sur 20 min × 0.95
                        </li>
                        <li>
                          <strong>Test rampe :</strong> Test progressif jusqu'à
                          épuisement (Zwift, TrainerRoad)
                        </li>
                        <li>
                          <strong>Test 8 min :</strong> Deux efforts de 8 min,
                          moyenne × 0.90
                        </li>
                      </ul>
                    ) : (
                      <ul className="space-y-2 text-sm text-sub">
                        <li>
                          <strong>Méthode 3-12 min :</strong> Test de 3 min et
                          12 min pour calculer la PC
                        </li>
                        <li>
                          <strong>Analyse des données :</strong> Utiliser vos
                          sorties longues (Golden Cheetah)
                        </li>
                      </ul>
                    )}
                    <p className="text-sm italic">
                      💡 Conseil : Utilisez un capteur de puissance et une
                      plateforme comme Zwift ou TrainerRoad
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Zones FTP */}
          {ftp && parseFloat(ftp) > 0 && (
            <Card className="p-6">
              <h3 className="mb-4">Vos zones de puissance</h3>
              <div className="space-y-3">
                {calculateZoneValues(ftp, ftpZones)?.map((zone) => (
                  <div
                    key={zone.number}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${zone.color} rounded-lg`}></div>
                      <div>
                        <p className="font-semibold">
                          Zone {zone.number} - {zone.name}
                        </p>
                        <p className="text-sm text-sub">
                          {zone.percentage[0]}% - {zone.percentage[1]}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {zone.min} - {zone.max} W
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Natation - CSS */}
        <TabsContent value="swimming" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3>CSS - Critical Swim Speed</h3>
                <p className="text-sm text-sub">
                  Vitesse critique en natation (secondes par 100m)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="css">Ma CSS (sec/100m)</Label>
                <Input
                  id="css"
                  type="number"
                  step="0.1"
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  placeholder="90"
                  className="mt-2"
                />
                <p className="text-xs text-sub mt-1">
                  Exemple : 1:30/100m = 90 secondes
                </p>
              </div>

              <Button
                onClick={() => saveMetric("css", css, "swimming")}
                className="w-full bg-cyan-500 hover:bg-cyan-600"
              >
                Calculer mes zones
              </Button>

              {/* Help Section */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowCssHelp(!showCssHelp)}
                  className="flex items-center gap-2 text-sm text-sub hover:text-neutral-900 transition-smooth"
                >
                  <Info className="w-4 h-4" />
                  Comment obtenir ma CSS ?
                  {showCssHelp ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showCssHelp && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg space-y-3">
                    <h4 className="font-semibold">Tests recommandés :</h4>
                    <ul className="space-y-2 text-sm text-sub">
                      <li>
                        <strong>Test T30 :</strong> Nager le plus loin possible
                        en 30 min, CSS = 1800 / distance
                      </li>
                      <li>
                        <strong>Test 400m + 200m :</strong> Faire un 400m puis
                        un 200m à fond avec 10 min de repos
                      </li>
                      <li>
                        <strong>Formule :</strong> CSS = (temps 400m - temps
                        200m) / 2
                      </li>
                    </ul>
                    <p className="text-sm italic">
                      💡 Conseil : Faites le test en piscine de 25m ou 50m
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Zones CSS */}
          {css && parseFloat(css) > 0 && (
            <Card className="p-6">
              <h3 className="mb-4">Vos zones de natation</h3>
              <div className="space-y-3">
                {calculateZoneValues(css, cssZones)?.map((zone) => (
                  <div
                    key={zone.number}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${zone.color} rounded-lg`}></div>
                      <div>
                        <p className="font-semibold">
                          Zone {zone.number} - {zone.name}
                        </p>
                        <p className="text-sm text-sub">
                          {zone.percentage[0]}% - {zone.percentage[1]}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {zone.min} - {zone.max} sec/100m
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
