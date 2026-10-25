/**
 * Satellite Imagery Registry for OrbitDiff AI.
 * Maps Earth observation scenarios to raster asset pairs from public/imagery/.
 */
export const SCENARIO_IMAGERY = {
  amazon: {
    before: '/imagery/amazon-deforestation-before.jpg',
    after: '/imagery/amazon-deforestation-after.jpg',
    label: 'Amazon Deforestation',
  },
  dubai: {
    before: '/imagery/dubai-urban-expansion-before.jpg',
    after: '/imagery/dubai-urban-expansion-after.jpg',
    label: 'Dubai Urban Expansion',
  },
  glacier: {
    before: '/imagery/alpine-glacier-retreat-before.jpg',
    after: '/imagery/alpine-glacier-retreat-after.jpg',
    label: 'Alpine Glacier Retreat',
  },
  flood: {
    before: '/imagery/flood-impact-before.jpg',
    after: '/imagery/flood-impact-after.jpg',
    label: 'Flood Inundation Impact',
  },
  wildfire: {
    before: '/imagery/wildfire-aftermath-before.jpg',
    after: '/imagery/wildfire-aftermath-after.jpg',
    label: 'Wildfire Burn Complex',
  },
  coastal: {
    before: '/imagery/coastal-erosion-before.jpg',
    after: '/imagery/coastal-erosion-after.jpg',
    label: 'Coastal Cliff Erosion',
  },
  reservoir: {
    before: '/imagery/reservoir-water-loss-before.jpg',
    after: '/imagery/reservoir-water-loss-after.jpg',
    label: 'Reservoir Water Depletion',
  },
  mining: {
    before: '/imagery/mining-expansion-before.jpg',
    after: '/imagery/mining-expansion-after.jpg',
    label: 'Open-Pit Mining Expansion',
  },
};

// Backwards-compatible alias for existing imports
export const REAL_IMAGERY = SCENARIO_IMAGERY;
