-- Migration: Supprimer la contrainte percentage_max <= 100 pour permettre les zones FTP > 100%
-- Pour les zones de vélo (FTP), il est normal d'avoir des pourcentages > 100%
-- Exemple: Zone 5 (VO2max) = 106-120% de la FTP

-- Supprimer l'ancienne contrainte sur percentage_min
ALTER TABLE zones DROP CONSTRAINT IF EXISTS zones_percentage_min_check;

-- Supprimer l'ancienne contrainte sur percentage_max
ALTER TABLE zones DROP CONSTRAINT IF EXISTS zones_percentage_max_check;

-- Recréer les contraintes sans la limitation à 100%
ALTER TABLE zones ADD CONSTRAINT zones_percentage_min_check
  CHECK (percentage_min >= 0);

ALTER TABLE zones ADD CONSTRAINT zones_percentage_max_check
  CHECK (percentage_max >= 0 AND percentage_max >= percentage_min);

-- Note: Cette migration permet aux zones de vélo d'avoir des pourcentages > 100%
-- ce qui est correct pour l'entraînement cycliste basé sur la FTP
