-- Migration: Ajouter le type de métrique 'fcmax' (Fréquence Cardiaque Maximale)
-- pour permettre le calcul des zones de course à pied basées sur la FC max

-- Supprimer l'ancienne contrainte sur metric_type
ALTER TABLE metrics DROP CONSTRAINT IF EXISTS metrics_metric_type_check;

-- Recréer la contrainte avec 'fcmax' inclus
ALTER TABLE metrics
  ADD CONSTRAINT metrics_metric_type_check
  CHECK (metric_type IN ('vma', 'fcmax', 'ftp', 'css'));

-- Note: Cette migration permet de calculer les zones de course à pied
-- soit avec la VMA (km/h) soit avec la FC max (bpm)
