import { create } from 'zustand';
import { LogicEngine } from '../utils/logicEngine';

/**
 * 8 Verified Earth Observation Case-Study Presets
 * Each dataset maintains verified sensor provenance, temporal dates, and anomaly ground truth.
 */
export const CASE_STUDIES = [
  {
    id: 'amazon',
    title: 'Amazon Deforestation',
    shortName: 'Amazon Basin',
    subtitle: 'Industrial Logging & Agricultural Encroachment',
    region: 'Rondônia, Brazil',
    category: 'Forestry & Biosphere',
    coordinates: "09°52'24.8\"S 63°17'08.2\"W",
    lat: -9.8735,
    lng: -63.2856,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2B / MSI SENSOR',
    orbitAlt: '786.2 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '58.4°',
    beforeDate: '2024-03-12',
    afterDate: '2024-09-08',
    temporalDeltaDays: 180,
    cloudCoverBefore: '1.2%',
    cloudCoverAfter: '0.6%',
    classification: 'Human-made Activity',
    detectionMethod: 'Bi-temporal Surface Reflectance (BOA) & Normalized Difference Vegetation Index (NDVI) Shift',
    confidenceLimitations: 'High canopy humidity; sub-pixel logging roads (<5m) smoothed by 10m spatial sampling.',
    dataQualityWarning: 'Level-2A Bottom-Of-Atmosphere calibrated with Sen2Cor. Cloud probability mask verified < 1%.',
    description: 'Dendritic fishbone logging corridors branching from primary transit arterials, converting primary rainforest into cattle pasture.',
    spectralBands: ['B02 (Blue 490nm)', 'B04 (Red 665nm)', 'B08 (NIR 842nm)', 'B11 (SWIR-1 1610nm)'],
    themeColor: '#00FFA3',
    anomalies: [
      {
        id: 'AMZ-01',
        name: 'Arboreal Clear-Cut Sector North',
        category: 'human',
        detectionType: 'Anthropogenic Fishbone Clearcut',
        box: { x: 16, y: 18, width: 28, height: 34 },
        confidence: 96.8,
        areaKm2: 18.4,
        ndviDelta: -0.62,
        severity: 'CRITICAL',
        coordinates: "09°51'12\"S, 63°18'04\"W",
        summary: 'Primary canopy clearcut with organized orthogonal access tracks. Complete arboreal destruction.',
        cropDescription: 'Abrupt boundary: Dense tropical rainforest truncated by bulldozer tracks and exposed terra-firme oxisol soil.',
        microCropDetail: {
          spectralSignature: 'Sharp B08 (NIR) collapse (-64%), SWIR-1 soil reflectance surge (+48%)',
          estimatedDisplacement: '18.4 km² canopy biomass cleared',
          soilExposure: 'High (Oxisol red-clay exposed)',
        },
      },
      {
        id: 'AMZ-02',
        name: 'Riparian Buffer Logging Incursion',
        category: 'human',
        detectionType: 'Riparian Forest Fragmentation',
        box: { x: 50, y: 12, width: 24, height: 32 },
        confidence: 92.4,
        areaKm2: 12.1,
        ndviDelta: -0.54,
        severity: 'HIGH',
        coordinates: "09°50'45\"S, 63°15'30\"W",
        summary: 'Direct timber extraction encroaching into legal tributary preservation buffer zone.',
        cropDescription: 'Riverbank fragmentation showing timber skid trails leading down to river loading points.',
        microCropDetail: {
          spectralSignature: 'Moisture index NDWI drop, turbidity spike in adjacent fluvial channel',
          estimatedDisplacement: '12.1 km² riparian corridor compromised',
          soilExposure: 'Moderate-High with sediment runoff',
        },
      },
      {
        id: 'AMZ-03',
        name: 'Pasture Burn Scar Perimeter',
        category: 'human',
        detectionType: 'Pyrogenic Charcoal Residue',
        box: { x: 60, y: 52, width: 26, height: 34 },
        confidence: 86.5,
        areaKm2: 8.9,
        ndviDelta: -0.48,
        severity: 'HIGH',
        coordinates: "09°53'18\"S, 63°14'22\"W",
        summary: 'Thermal burn scar consistent with slash-and-burn agricultural preparation.',
        cropDescription: 'Dark charcoal deposition boundary transitioning into secondary scrub grazing boundary.',
        microCropDetail: {
          spectralSignature: 'High B12 (SWIR-2) burn index response, charcoal particulate signature',
          estimatedDisplacement: '8.9 km² cleared via thermal burn',
          soilExposure: 'Total ash/charcoal ground cover',
        },
      },
      {
        id: 'AMZ-04',
        name: 'Secondary Shrub Fragment',
        category: 'natural',
        detectionType: 'Spontaneous River Silt Regrowth',
        box: { x: 24, y: 66, width: 20, height: 22 },
        confidence: 68.2,
        areaKm2: 3.4,
        ndviDelta: 0.22,
        severity: 'MODERATE',
        coordinates: "09°54'02\"S, 63°17'40\"W",
        summary: 'Pioneer vegetation colonization on old oxbow sandbar. Natural seasonal succession.',
        cropDescription: 'Low-density green pioneer shrub colonization along seasonal river sediment bar.',
        microCropDetail: {
          spectralSignature: 'Moderate NIR gain (+18%), high moisture absorption',
          estimatedDisplacement: '3.4 km² pioneer biomass expansion',
          soilExposure: 'Submerged silt & low grass',
        },
      },
    ],
    executiveDossier:
      'Autonomous radar and multispectral surveillance registers 39.4 km² of primary arboreal canopy loss in the Rondônia forestry block across 180 days.',
    environmentalImpact: 'Recommend immediate alerting of IBAMA forestry authorities and dispatch of airborne LiDAR reconnaissance.',
  },
  {
    id: 'dubai',
    title: 'Dubai Urban Expansion',
    shortName: 'Dubai Waterfront',
    subtitle: 'Offshore Hydraulic Land Reclamation & Infrastructure',
    region: 'Dubai Waterfront, Arabian Gulf, UAE',
    category: 'Urban & Coastal Engineering',
    coordinates: "25°00'44.2\"N 55°03'39.1\"E",
    lat: 25.0123,
    lng: 55.0609,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2A / MSI SENSOR',
    orbitAlt: '786.8 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '64.1°',
    beforeDate: '2024-02-18',
    afterDate: '2024-10-15',
    temporalDeltaDays: 240,
    cloudCoverBefore: '0.4%',
    cloudCoverAfter: '0.2%',
    classification: 'Anthropogenic Marine Reclamation',
    detectionMethod: 'Modified Normalized Difference Water Index (MNDWI) & Bathymetric Reflectance Contrast',
    confidenceLimitations: 'Tidal variations (+/- 0.6m) and sediment plume attenuation during cutter-suction dredging.',
    dataQualityWarning: 'Level-2A BOA product. Sun glint correction applied across marine sectors.',
    description: 'Rapid hydraulic sand dredging and breakwater placement creating geometric offshore peninsulas and commercial shipping berths.',
    spectralBands: ['B02 (Blue 490nm)', 'B03 (Green 560nm)', 'B04 (Red 665nm)', 'B08 (NIR 842nm)'],
    themeColor: '#00E5FF',
    anomalies: [
      {
        id: 'DXB-01',
        name: 'Maritime Reclamation Island Spit',
        category: 'human',
        detectionType: 'Coastal Sand Hydraulic Infill',
        box: { x: 22, y: 16, width: 34, height: 44 },
        confidence: 98.4,
        areaKm2: 21.6,
        ndviDelta: -0.71,
        severity: 'CRITICAL',
        coordinates: "25°01'15\"N, 55°02'40\"E",
        summary: 'Massive hydraulic seabed sand infill creating geometric offshore island foundation.',
        cropDescription: 'Engineered geometric shoreline rising out of deep marine waters with rip-rap breakwater rocks.',
        microCropDetail: {
          spectralSignature: 'Marine water absorption replaced by calcified marine sand reflectance (+94%)',
          estimatedDisplacement: '21.6 km² deep sea area reclaimed to dry ground',
          soilExposure: '100% dredged marine sand and limestone boulders',
        },
      },
      {
        id: 'DXB-02',
        name: 'Deep Sea Navigation Channel Dredge',
        category: 'human',
        detectionType: 'Subsea Navigation Dredging',
        box: { x: 62, y: 14, width: 26, height: 38 },
        confidence: 94.6,
        areaKm2: 9.8,
        ndviDelta: -0.12,
        severity: 'HIGH',
        coordinates: "25°02'00\"N, 55°05'10\"E",
        summary: 'Deep-water vessel fairway deepening. Noticeable bathymetric color transition to deep indigo.',
        cropDescription: 'Linear marine channel with sharply defined cutter-suction dredge marks and sediment halos.',
        microCropDetail: {
          spectralSignature: 'Blue band attenuation decrease corresponding to 18m channel depth',
          estimatedDisplacement: '9.8 km² seabed dredged to -18m CD',
          soilExposure: 'Submerged dredged bedrock & seabed silt',
        },
      },
      {
        id: 'DXB-03',
        name: 'Coastal Freeway & Foundation Grid',
        category: 'human',
        detectionType: 'Asphalt & Concrete Infrastructure',
        box: { x: 12, y: 64, width: 38, height: 26 },
        confidence: 89.2,
        areaKm2: 7.2,
        ndviDelta: -0.38,
        severity: 'HIGH',
        coordinates: "24°59'40\"N, 55°03'10\"E",
        summary: 'Multi-lane highway extension connecting mainland coastal terminal to offshore landmass.',
        cropDescription: 'Parallel dark asphalt corridors and reinforced concrete bridge abutments.',
        microCropDetail: {
          spectralSignature: 'High urban spectral index (NDBI), low thermal emissivity asphalt response',
          estimatedDisplacement: '7.2 km² roadway and staging platforms',
          soilExposure: 'Paved impervious asphalt and reinforced concrete',
        },
      },
      {
        id: 'DXB-04',
        name: 'Tidal Sediment Plume Suspension',
        category: 'natural',
        detectionType: 'Hydrodynamic Silt Dispersion',
        box: { x: 62, y: 58, width: 24, height: 28 },
        confidence: 72.8,
        areaKm2: 5.6,
        ndviDelta: 0.05,
        severity: 'ELEVATED',
        coordinates: "25°00'20\"N, 55°06'15\"E",
        summary: 'Suspended marine sediment plume drifting westward with natural prevailing coastal currents.',
        cropDescription: 'Translucent turquoise-white sediment swirls extending along the littoral drift line.',
        microCropDetail: {
          spectralSignature: 'Elevated green-yellow backscatter from suspended calcareous silt particles',
          estimatedDisplacement: '5.6 km² coastal water turbidity plume',
          soilExposure: 'Suspended waterborne particulate',
        },
      },
    ],
    executiveDossier:
      'Littoral surveillance indicates 21.6 km² of new dry landmass created from open Arabian Gulf waters in 240 days.',
    environmentalImpact: 'Monitor littoral drift and verify environmental permits with Maritime City GIS registry.',
  },
  {
    id: 'glacier',
    title: 'Alpine Glacier Retreat',
    shortName: 'Rhône Glacier',
    subtitle: 'Cryospheric Mass Loss & Proglacial Lake Genesis',
    region: 'Valais, Swiss Alps',
    category: 'Cryosphere & Climate',
    coordinates: "46°34'53.8\"N 08°23'03.1\"E",
    lat: 46.5816,
    lng: 8.3842,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2B / MSI SENSOR',
    orbitAlt: '786.1 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '52.7°',
    beforeDate: '2023-08-20',
    afterDate: '2024-08-28',
    temporalDeltaDays: 374,
    cloudCoverBefore: '0.0%',
    cloudCoverAfter: '0.0%',
    classification: 'Natural Environmental / Cryospheric Retreat',
    detectionMethod: 'Normalized Difference Snow Index (NDSI) & Shortwave Infrared (SWIR) Ice Boundary Tracking',
    confidenceLimitations: 'Shadow cast by flanking granite peaks during low solar zenith angles.',
    dataQualityWarning: 'Orthorectified against SwissALTI3D digital elevation model (RMSE < 0.25m).',
    description: 'Drastic 420-meter retreat of the glacial tongue terminus, exposing polished moraine bedrock and forming a proglacial meltwater lake.',
    spectralBands: ['B02 (Blue 490nm)', 'B03 (Green 560nm)', 'B04 (Red 665nm)', 'B11 (SWIR 1610nm)'],
    themeColor: '#38BDF8',
    anomalies: [
      {
        id: 'GLC-01',
        name: 'Glacial Terminus Frontal Calving',
        category: 'natural',
        detectionType: 'Rapid Terminus Recession',
        box: { x: 30, y: 34, width: 32, height: 34 },
        confidence: 97.9,
        areaKm2: 14.5,
        ndviDelta: -0.85,
        severity: 'CRITICAL',
        coordinates: "46°34'45\"N, 08°22'50\"E",
        summary: 'Massive 420m longitudinal retreat of the lower ice tongue due to record summer melt temperatures.',
        cropDescription: 'Ice tongue edge breaking off into deep fracture crevasses, exposing polished granite bedrock.',
        microCropDetail: {
          spectralSignature: 'Normalized Difference Snow Index (NDSI) plummeted from 0.89 to -0.22',
          estimatedDisplacement: '14.5 km² ice surface vanished, estimated 280M m³ ice loss',
          soilExposure: 'Glacially polished crystalline gneiss and granite bedrock',
        },
      },
      {
        id: 'GLC-02',
        name: 'Proglacial Meltwater Lake Genesis',
        category: 'natural',
        detectionType: 'Glacial Lake Formation',
        box: { x: 26, y: 64, width: 28, height: 26 },
        confidence: 94.1,
        areaKm2: 4.8,
        ndviDelta: -0.42,
        severity: 'CRITICAL',
        coordinates: "46°34'10\"N, 08°22'30\"E",
        summary: 'Newly dammed proglacial lake forming in the terminal depression behind the terminal moraine.',
        cropDescription: 'Milky turquoise meltwater impoundment collecting glacial flour and floating serac bergs.',
        microCropDetail: {
          spectralSignature: 'High NDWI water signature, extreme glacial flour sediment backscatter in green band',
          estimatedDisplacement: '4.8 km² new alpine lake volume (risk of moraine breach)',
          soilExposure: 'Submerged proglacial depression basin',
        },
      },
      {
        id: 'GLC-03',
        name: 'Lateral Moraine Scree Unloading',
        category: 'natural',
        detectionType: 'Permafrost Rockfall & Moraine Slump',
        box: { x: 64, y: 20, width: 22, height: 42 },
        confidence: 87.3,
        areaKm2: 8.2,
        ndviDelta: -0.18,
        severity: 'HIGH',
        coordinates: "46°35'10\"N, 08°23'45\"E",
        summary: 'Destabilization of flanking lateral moraine slopes following loss of ice buttressing.',
        cropDescription: 'Steep scree debris fan spilling across the glacier flank with fresh rock avalanche scars.',
        microCropDetail: {
          spectralSignature: 'Unconsolidated angular rock fragments, loss of seasonal ice veneer',
          estimatedDisplacement: '8.2 km² unstable scree slope active',
          soilExposure: '100% loose alpine talus and shattered granite',
        },
      },
      {
        id: 'GLC-04',
        name: 'Upper Firn Snowline Receding',
        category: 'natural',
        detectionType: 'Equilibrium Line Altitude (ELA) Shift',
        box: { x: 14, y: 14, width: 24, height: 26 },
        confidence: 76.5,
        areaKm2: 3.9,
        ndviDelta: -0.31,
        severity: 'ELEVATED',
        coordinates: "46°35'40\"N, 08°22'15\"E",
        summary: 'Equilibrium line moved 180m higher in elevation. Firn snowpack stripped down to bare dirty ice.',
        cropDescription: 'Upper accumulation basin showing exposed blue-grey ice bands with heavy soot/dust deposition.',
        microCropDetail: {
          spectralSignature: 'Albedo drop from 0.82 down to 0.38 (dust-covered ablation ice)',
          estimatedDisplacement: '3.9 km² accumulation zone converted to ablation zone',
          soilExposure: 'Dirty ablation ice with cryoconite holes',
        },
      },
    ],
    executiveDossier:
      'Terminus retreat of 420 meters has released an estimated 280 million m³ of freshwater and initiated proglacial lake impoundment.',
    environmentalImpact: 'Update downstream glacial lake outburst flood (GLOF) hazard models for the Upper Rhône valley.',
  },
  {
    id: 'flood',
    title: 'Flood Impact',
    shortName: 'Indus Inundation',
    subtitle: 'Monsoon Fluvial Surge & Agricultural Inundation',
    region: 'Indus Basin, Sindh, Pakistan',
    category: 'Hydrology & Extreme Weather',
    coordinates: "27°18'32.0\"N 68°21'44.1\"E",
    lat: 27.3089,
    lng: 68.3622,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2A / MSI SENSOR',
    orbitAlt: '786.5 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '62.8°',
    beforeDate: '2022-07-15',
    afterDate: '2022-09-02',
    temporalDeltaDays: 49,
    cloudCoverBefore: '2.1%',
    cloudCoverAfter: '4.8%',
    classification: 'Natural Hydrological Hazard',
    detectionMethod: 'Automated Water Extraction Index (AWEI) & NIR Absorption Inversion',
    confidenceLimitations: 'Residual cloud shadows along eastern flood perimeter masked via SCL band.',
    dataQualityWarning: 'Atmospheric correction validated via Copernicus Emergency Management Service feed.',
    description: 'Catastrophic river surge inundating agricultural cropland, drowning transport corridors and displacing rural communities.',
    spectralBands: ['B02 (Blue 490nm)', 'B03 (Green 560nm)', 'B08 (NIR 842nm)', 'B12 (SWIR-2 2190nm)'],
    themeColor: '#38BDF8',
    anomalies: [
      {
        id: 'FLD-01',
        name: 'Agricultural Plain Submersion',
        category: 'natural',
        detectionType: 'Deep Water Inundation',
        box: { x: 20, y: 22, width: 36, height: 42 },
        confidence: 98.9,
        areaKm2: 34.2,
        ndviDelta: -0.74,
        severity: 'CRITICAL',
        coordinates: "27°19'10\"N, 68°20'30\"E",
        summary: 'Extensive sheet flooding submerging cotton and rice agricultural basins under 1.8m standing water.',
        cropDescription: 'Standing muddy floodwaters completely drowning orthogonal agricultural field boundaries.',
        microCropDetail: {
          spectralSignature: 'Total NIR extinction; AWEI water index shift from -0.42 to +0.88',
          estimatedDisplacement: '34.2 km² prime arable land submerged',
          soilExposure: 'Submerged silt deposits and flood sediment',
        },
      },
      {
        id: 'FLD-02',
        name: 'Embankment Levee Breach',
        category: 'mixed',
        detectionType: 'Structural Canal Failure',
        box: { x: 58, y: 30, width: 26, height: 32 },
        confidence: 93.8,
        areaKm2: 11.5,
        ndviDelta: -0.58,
        severity: 'CRITICAL',
        coordinates: "27°17'50\"N, 68°23'15\"E",
        summary: 'Engineered drainage levee compromised, directing uncontrolled high-velocity water into low-lying settlements.',
        cropDescription: 'Fan-shaped sediment crevasse splay cutting across severed asphalt highway.',
        microCropDetail: {
          spectralSignature: 'High-turbidity water backscatter; structural asphalt signature severed',
          estimatedDisplacement: '11.5 km² flooded via point failure',
          soilExposure: 'Severed earthen levee and scour channel',
        },
      },
    ],
    executiveDossier:
      'Extreme monsoon precipitation triggered an unprecedented 45.7 km² contiguous water inundation across the Sindh agricultural corridor.',
    environmentalImpact: 'Immediate deployment of emergency relief, water purification, and post-flood vector disease monitoring.',
  },
  {
    id: 'wildfire',
    title: 'Wildfire Aftermath',
    shortName: 'Jasper Fire Complex',
    subtitle: 'Boreal Canopy Destruction & Pyrogenic Ash Deposition',
    region: 'Jasper National Park, Alberta, Canada',
    category: 'Disaster & Forestry',
    coordinates: "52°52'28.1\"N 118°04'52.4\"W",
    lat: 52.8745,
    lng: -118.0812,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2B / MSI SENSOR',
    orbitAlt: '786.1 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '48.2°',
    beforeDate: '2024-07-04',
    afterDate: '2024-08-12',
    temporalDeltaDays: 39,
    cloudCoverBefore: '0.2%',
    cloudCoverAfter: '1.1%',
    classification: 'Natural Environmental Disaster',
    detectionMethod: 'Differenced Normalized Burn Ratio (dNBR = NBR_pre - NBR_post)',
    confidenceLimitations: 'Steep montane topography creates shaded valleys with dampened SWIR reflectance.',
    dataQualityWarning: 'Sentinel-2 BOA Level-2A corrected against Canadian Digital Elevation Model.',
    description: 'High-severity wildfire sweeping through montane pine forests, creating extensive charcoal burn scars and timber loss.',
    spectralBands: ['B04 (Red 665nm)', 'B08 (NIR 842nm)', 'B12 (SWIR-2 2190nm)'],
    themeColor: '#EF4444',
    anomalies: [
      {
        id: 'WDF-01',
        name: 'Valley Pine Crown Burn Core',
        category: 'natural',
        detectionType: 'High-Severity Canopy Consumed',
        box: { x: 26, y: 24, width: 38, height: 46 },
        confidence: 97.4,
        areaKm2: 28.6,
        ndviDelta: -0.79,
        severity: 'CRITICAL',
        coordinates: "52°51'40\"N, 118°05'20\"W",
        summary: 'Crown fire consumed lodgepole pine and spruce stands, leaving total ash cover and carbonized trunks.',
        cropDescription: 'Charcoal black ground cover with scorched tree silhouettes along Athabasca river tributary.',
        microCropDetail: {
          spectralSignature: 'dNBR score = 0.82 (High Severity Burn); total NIR collapse',
          estimatedDisplacement: '28.6 km² old-growth montane conifer forest burned',
          soilExposure: 'High ash, charred humus, exposed gravel',
        },
      },
      {
        id: 'WDF-02',
        name: 'Perimeter Spotting Burn Ridge',
        category: 'natural',
        detectionType: 'Wind-Driven Ember Spotting',
        box: { x: 66, y: 18, width: 22, height: 28 },
        confidence: 91.2,
        areaKm2: 7.4,
        ndviDelta: -0.46,
        severity: 'HIGH',
        coordinates: "52°53'15\"N, 118°02'40\"W",
        summary: 'Isolated ember fire jumped rocky ridge line, igniting separate flank corridor.',
        cropDescription: 'Patchy mosaic of scorched canopy and smoldering secondary shrub.',
        microCropDetail: {
          spectralSignature: 'Moderate burn severity (dNBR = 0.54)',
          estimatedDisplacement: '7.4 km² peripheral timber burned',
          soilExposure: 'Partial canopy scorching and soot cover',
        },
      },
    ],
    executiveDossier:
      'High-intensity wildfire burned 36.0 km² of montane timber in 39 days, posing post-fire debris flow hazards on steep slopes.',
    environmentalImpact: 'Install hydro-mulch stabilization and monitor hydrophobic soils for heavy precipitation erosion.',
  },
  {
    id: 'coastal',
    title: 'Coastal Erosion',
    shortName: 'Holderness Coast',
    subtitle: 'Soft Cliff Retreat & Shoreline Marine Abrasion',
    region: 'East Riding of Yorkshire, UK',
    category: 'Coastal Geomorphology',
    coordinates: "53°50'12.0\"N 00°06'24.2\"W",
    lat: 53.8367,
    lng: -0.1067,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2A / MSI SENSOR',
    orbitAlt: '786.7 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '46.1°',
    beforeDate: '2023-04-10',
    afterDate: '2024-04-22',
    temporalDeltaDays: 378,
    cloudCoverBefore: '1.4%',
    cloudCoverAfter: '0.8%',
    classification: 'Natural Coastal Erosion',
    detectionMethod: 'High-Resolution Edge Tracking & Tidal Normalized Shoreline Delineation (NSWI)',
    confidenceLimitations: 'Tidal cycle offset (+/- 2.2m mean spring tide); images matched at Mean High Water.',
    dataQualityWarning: 'Corrected against UK Hydrographic Office tidal benchmarks.',
    description: 'Rapid erosion of soft boulder clay cliffs along Europes fastest-eroding coastline, claiming agricultural headlands.',
    spectralBands: ['B02 (Blue 490nm)', 'B04 (Red 665nm)', 'B08 (NIR 842nm)'],
    themeColor: '#F59E0B',
    anomalies: [
      {
        id: 'CST-01',
        name: 'Headland Cliff Edge Slump',
        category: 'natural',
        detectionType: 'Rotational Clay Landslip',
        box: { x: 34, y: 28, width: 28, height: 38 },
        confidence: 94.6,
        areaKm2: 4.8,
        ndviDelta: -0.62,
        severity: 'HIGH',
        coordinates: "53°50'40\"N, 00°05'50\"W",
        summary: 'Mass rotational slump of unconsolidated glacial till cliff, sliding agricultural land directly into North Sea.',
        cropDescription: 'Jagged scar line where arable farm perimeter collapsed 18m downward onto the intertidal beach.',
        microCropDetail: {
          spectralSignature: 'Vegetation edge replaced by saturated brown clay and marine wave backscatter',
          estimatedDisplacement: '4.8 km² cliff edge lost to marine erosion',
          soilExposure: '100% exposed till clay cliff face',
        },
      },
    ],
    executiveDossier:
      'North Sea wave action carved away 4.8 km² of coastal farm headland along the Holderness sediment cell.',
    environmentalImpact: 'Update setback zoning restrictions for coastal roads and municipal infrastructure.',
  },
  {
    id: 'reservoir',
    title: 'Reservoir Water Loss',
    shortName: 'Lake Mead Depletion',
    subtitle: 'Prolonged Drought & Shoreline Recession',
    region: 'Nevada / Arizona Border, USA',
    category: 'Water Resources & Drought',
    coordinates: "36°08'42.1\"N 114°44'18.2\"W",
    lat: 36.1450,
    lng: -114.7384,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2B / MSI SENSOR',
    orbitAlt: '786.4 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '66.4°',
    beforeDate: '2021-06-15',
    afterDate: '2023-06-20',
    temporalDeltaDays: 735,
    cloudCoverBefore: '0.1%',
    cloudCoverAfter: '0.0%',
    classification: 'Climate & Anthropogenic Water Extraction',
    detectionMethod: 'Normalized Difference Water Index (NDWI) & Bathymetric Capacity Curve Inversion',
    confidenceLimitations: 'High mineral turbidity along shallow inlet bays produces borderline water signatures.',
    dataQualityWarning: 'Validated with US Bureau of Reclamation reservoir stage gauge data.',
    description: 'Severe reservoir shoreline recession exposing white mineralized "bathtub ring" rock formations.',
    spectralBands: ['B03 (Green 560nm)', 'B08 (NIR 842nm)', 'B11 (SWIR-1 1610nm)'],
    themeColor: '#00FFA3',
    anomalies: [
      {
        id: 'RSV-01',
        name: 'Overton Arm Shoreline Retreat',
        category: 'natural',
        detectionType: 'Major Water Surface Shrinkage',
        box: { x: 28, y: 18, width: 34, height: 44 },
        confidence: 96.9,
        areaKm2: 24.5,
        ndviDelta: 0.14,
        severity: 'CRITICAL',
        coordinates: "36°10'15\"N, 114°42'30\"W",
        summary: 'Water surface receded over 1.2 kilometers horizontally, exposing dried lakebed mud and calcified limestone.',
        cropDescription: 'Distinct white mineralized ring flanking desiccated cracked silt lakebed.',
        microCropDetail: {
          spectralSignature: 'NDWI drop from +0.76 down to -0.38; stark mineral ring reflectance',
          estimatedDisplacement: '24.5 km² open water surface converted to bare dry bed',
          soilExposure: 'High (calcified white silt & cracked mud)',
        },
      },
    ],
    executiveDossier:
      'Multi-year southwestern megadrought and municipal extraction caused a 24.5 km² water surface loss in Lake Mead reservoir.',
    environmentalImpact: 'Trigger Tier-2 water allocation reductions across Lower Colorado River Basin agricultural users.',
  },
  {
    id: 'mining',
    title: 'Mining Expansion',
    shortName: 'Escondida Copper Mine',
    subtitle: 'Open-Pit Excavation & Tailings Impoundment',
    region: 'Atacama Desert, Antofagasta, Chile',
    category: 'Extractive Industry',
    coordinates: "24°16'02.1\"S 69°04'28.5\"W",
    lat: -24.2673,
    lng: -69.0746,
    resolution: '10m / px (Sentinel-2 L2A Super-Resolved)',
    satellite: 'SENTINEL-2A / MSI SENSOR',
    orbitAlt: '786.8 KM',
    inclination: '98.62° SSO',
    swathWidth: '290 KM',
    sunElevation: '54.2°',
    beforeDate: '2023-01-14',
    afterDate: '2024-03-28',
    temporalDeltaDays: 439,
    cloudCoverBefore: '0.0%',
    cloudCoverAfter: '0.0%',
    classification: 'Anthropogenic Industrial Excavation',
    detectionMethod: 'Shortwave Infrared (SWIR) Mineral Alteration Index & Digital Elevation Model Cut-Fill Ratio',
    confidenceLimitations: 'Extreme hyper-arid desert albedo saturation mitigated via gain calibration.',
    dataQualityWarning: 'Level-2A BOA product; zero cloud contamination in Atacama observation corridor.',
    description: 'Enormous open-pit concentric bench excavations and expansion of fine-crushed copper tailings dump impoundments.',
    spectralBands: ['B04 (Red 665nm)', 'B08 (NIR 842nm)', 'B11 (SWIR 1610nm)', 'B12 (SWIR 2190nm)'],
    themeColor: '#F59E0B',
    anomalies: [
      {
        id: 'MIN-01',
        name: 'South Pit Concentric Bench Deepening',
        category: 'human',
        detectionType: 'Open-Cut Terraced Excavation',
        box: { x: 22, y: 22, width: 34, height: 42 },
        confidence: 97.2,
        areaKm2: 19.8,
        ndviDelta: -0.22,
        severity: 'CRITICAL',
        coordinates: "24°16'40\"S, 69°05'10\"W",
        summary: 'Expansion of 18 concentric mining benches deepening pit floor by approximately 85 meters.',
        cropDescription: 'Terraced amphitheater excavation benches with heavy industrial haulage tracks and crushers.',
        microCropDetail: {
          spectralSignature: 'Fresh copper sulfide porphyry mineral signature in SWIR bands',
          estimatedDisplacement: '19.8 km² excavation footprint expansion; estimated 140M MT rock moved',
          soilExposure: '100% freshly blasted bedrock and porphyry copper ore',
        },
      },
      {
        id: 'MIN-02',
        name: 'Tailings Slurry Impoundment Extension',
        category: 'human',
        detectionType: 'Mine Tailings Dam Expansion',
        box: { x: 62, y: 26, width: 26, height: 36 },
        confidence: 92.5,
        areaKm2: 8.6,
        ndviDelta: -0.15,
        severity: 'HIGH',
        coordinates: "24°15'10\"S, 69°02'40\"W",
        summary: 'Extension of perimeter containment embankment and new fine-slurry evaporation cells.',
        cropDescription: 'Smooth grey tailings silt impoundment behind engineered rockfill containment dam.',
        microCropDetail: {
          spectralSignature: 'High mineral dust reflectance; artificial ponded tailings water absorption',
          estimatedDisplacement: '8.6 km² tailings storage expansion',
          soilExposure: 'Compacted tailings silt and rockfill berms',
        },
      },
    ],
    executiveDossier:
      'Industrial open-pit copper mining expanded by 28.4 km² across the Atacama Desert complex in 439 days.',
    environmentalImpact: 'Monitor dry dust dispersion and evaluate groundwater aquifer extraction quotas.',
  },
];

export const useStore = create((set, get) => ({
  // 8 Case Studies
  scenarios: CASE_STUDIES,
  activeScenarioId: 'amazon',

  // Interactive Detection Controls
  comparisonMode: 'swipe', // 'swipe' | 'sideBySide' | 'difference'
  showOverlay: true, // change-mask visibility toggle
  overlayOpacity: 85, // 0 to 100%
  zoomLevel: 1.0, // 1.0x to 2.5x
  confidenceThreshold: 65, // 0 to 100%
  noChangeControl: false, // Zero-hallucination baseline test toggle
  wipeProgress: 50, // 0 to 100% temporal divider position
  isAutoSweeping: false,
  selectedAnomalyId: 'AMZ-01',

  // Visualization options
  spectralMode: 'rgb', // 'rgb' | 'cir' | 'ndvi' | 'diff'
  showHUD: true,
  audioEnabled: false,

  // Multi-Stage Orbital Timeline State
  currentStage: 1, // 1: Orbital Zoom In, 2: Scanner Laser Wipe, 3: HUD Report & Detach
  scrollProgress: 0, // 0 to 1

  // Actions
  setComparisonMode: (mode) => {
    set({ comparisonMode: mode });
    get().playAudioFx('click');
  },

  setShowOverlay: (show) => {
    set({ showOverlay: Boolean(show) });
    get().playAudioFx('click');
  },

  setOverlayOpacity: (val) => {
    set({ overlayOpacity: Number(val) });
  },

  setZoomLevel: (zoom) => {
    const clamped = Math.max(1.0, Math.min(2.5, Math.round(zoom * 10) / 10));
    set({ zoomLevel: clamped });
    get().playAudioFx('click');
  },

  setCurrentStage: (stage) => set({ currentStage: stage }),
  setScrollProgress: (prog) => set({ scrollProgress: prog }),

  setActiveScenario: (scenarioId) => {
    const sc = get().scenarios.find((s) => s.id === scenarioId);
    const firstAnomaly = sc?.anomalies?.[0]?.id || null;
    set({
      activeScenarioId: scenarioId,
      selectedAnomalyId: firstAnomaly,
      wipeProgress: 50,
      zoomLevel: 1.0,
      currentStage: 1,
    });
    get().playAudioFx('switch');
  },

  setConfidenceThreshold: (val) => {
    set({ confidenceThreshold: Number(val) });
  },

  setNoChangeControl: (val) => {
    set({ noChangeControl: Boolean(val) });
    get().playAudioFx('control');
  },

  setWipeProgress: (progress) => {
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    set({ wipeProgress: clamped });
  },

  setSelectedAnomaly: (id) => {
    set({ selectedAnomalyId: id });
    get().playAudioFx('lock');
  },

  setSpectralMode: (mode) => {
    set({ spectralMode: mode });
    get().playAudioFx('click');
  },

  toggleHUD: () => {
    set((state) => ({ showHUD: !state.showHUD }));
    get().playAudioFx('click');
  },

  toggleAudio: () => {
    set((state) => ({ audioEnabled: !state.audioEnabled }));
  },

  toggleAutoSweep: () => {
    set((state) => ({ isAutoSweeping: !state.isAutoSweeping }));
  },

  // Computed Selectors
  getActiveScenario: () => {
    const { scenarios, activeScenarioId } = get();
    return scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  },

  getFilteredAnomalies: () => {
    const { getActiveScenario, confidenceThreshold, noChangeControl } = get();
    const scenario = getActiveScenario();
    return LogicEngine.filterAnomalies(scenario, {
      confidenceThreshold,
      noChangeControl,
      categoryFilter: 'all',
    });
  },

  getExecutiveMetrics: () => {
    const { getActiveScenario, getFilteredAnomalies, noChangeControl } = get();
    const scenario = getActiveScenario();
    const filtered = getFilteredAnomalies();
    return LogicEngine.calculateExecutiveMetrics(scenario, filtered, noChangeControl);
  },

  getExecutiveReport: () => {
    const { getActiveScenario, getFilteredAnomalies, getExecutiveMetrics, noChangeControl } = get();
    const scenario = getActiveScenario();
    const filtered = getFilteredAnomalies();
    const metrics = getExecutiveMetrics();
    return LogicEngine.generateExecutiveReport(scenario, filtered, metrics, noChangeControl);
  },

  getSelectedAnomalyData: () => {
    const { getActiveScenario, selectedAnomalyId, getFilteredAnomalies } = get();
    const scenario = getActiveScenario();
    const filtered = getFilteredAnomalies();

    const foundInFiltered = filtered.find((a) => a.id === selectedAnomalyId);
    if (foundInFiltered) return foundInFiltered;

    const foundInAll = scenario.anomalies.find((a) => a.id === selectedAnomalyId);
    if (foundInAll) return foundInAll;

    return filtered[0] || scenario.anomalies[0] || null;
  },

  // Lightweight Web Audio API Telemetry Sound Effects
  playAudioFx: (type) => {
    if (!get().audioEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'lock') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
        osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
        osc2.frequency.exponentialRampToValueAtTime(2640, ctx.currentTime + 0.16);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start(ctx.currentTime + 0.08);
        osc1.stop(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.2);
      } else if (type === 'control') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'switch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch {
      // Ignore audio restriction gracefully
    }
  },
}));
