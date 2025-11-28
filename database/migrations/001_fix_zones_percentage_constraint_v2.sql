-- Migration: Supprimer toutes les contraintes CHECK sur percentage pour permettre zones FTP > 100%
-- Cette version trouve et supprime les contraintes automatiquement

-- D'abord, voir toutes les contraintes sur la table zones
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'zones'::regclass AND contype = 'c';

-- Supprimer TOUTES les contraintes CHECK de la table zones
-- (nous les recréerons après)
DO $$
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'zones'::regclass AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE zones DROP CONSTRAINT ' || quote_ident(constraint_name);
    END LOOP;
END $$;

-- Recréer les contraintes avec les bons critères
ALTER TABLE zones
  ADD CONSTRAINT zones_discipline_check
  CHECK (discipline IN ('running', 'cycling', 'swimming'));

ALTER TABLE zones
  ADD CONSTRAINT zones_zone_number_check
  CHECK (zone_number BETWEEN 1 AND 5);

ALTER TABLE zones
  ADD CONSTRAINT zones_min_value_check
  CHECK (min_value > 0);

ALTER TABLE zones
  ADD CONSTRAINT zones_max_value_check
  CHECK (max_value > min_value);

ALTER TABLE zones
  ADD CONSTRAINT zones_percentage_min_check
  CHECK (percentage_min >= 0);

-- IMPORTANT: Pas de limite <= 100 pour permettre les zones FTP > 100%
ALTER TABLE zones
  ADD CONSTRAINT zones_percentage_max_check
  CHECK (percentage_max >= 0 AND percentage_max >= percentage_min);

-- Vérification: afficher toutes les contraintes
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'zones'::regclass AND contype = 'c';
