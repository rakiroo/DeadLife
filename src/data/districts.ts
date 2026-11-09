import { CityDistrict, DistrictType, LandmarkLocation } from '../types/game';

interface DistrictTemplate {
  type: DistrictType;
  namePool: string[];
  description: string;
  environmentalFeature: string;
  landmarkTemplates: {
    idSuffix: string;
    title: string;
    distance: string;
    danger: LandmarkLocation['danger'];
    dangerColor: string;
    lootDescription: string;
    category: LandmarkLocation['category'];
    iconName: string;
  }[];
}

const DISTRICT_TEMPLATES: DistrictTemplate[] = [
  {
    type: 'harbor',
    namePool: ['Blackwater Harbor', 'Port Solitude', 'Seagull Wharf', 'Pelican Bay District', 'Anchorhead Waterfront'],
    description: 'A fog-drenched coastal seaport with rusted cargo cranes, fish canneries, and creaking wooden piers.',
    environmentalFeature: 'Dense salt fog reduces visibility; flooded boardwalks and marine supplies abound.',
    landmarkTemplates: [
      {
        idSuffix: 'maritime_clinic',
        title: 'Maritime Coastguard Clinic',
        distance: '0.9 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Field Dressings, Burn Gel, Epinephrine',
        category: 'medical',
        iconName: 'Cross'
      },
      {
        idSuffix: 'pier_cannery',
        title: 'Pier 42 Fish Cannery',
        distance: '1.2 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Preserved Seafood, Mineral Water, Salt Rations',
        category: 'food',
        iconName: 'ShoppingBag'
      },
      {
        idSuffix: 'harbor_patrol',
        title: 'Port Authority Harbor Patrol',
        distance: '2.0 miles away',
        danger: 'Extreme Danger',
        dangerColor: 'text-rose-500 font-bold',
        lootDescription: 'Signal Flares, Shotgun Shells, Duty Vests',
        category: 'weapons',
        iconName: 'ShieldAlert'
      },
      {
        idSuffix: 'boatworks',
        title: 'Seaside Timber & Boatworks',
        distance: '1.5 miles away',
        danger: 'Low Risk',
        dangerColor: 'text-emerald-400',
        lootDescription: 'Treated Marine Cedar, Waterproof Cordage, Nails',
        category: 'materials',
        iconName: 'Hammer'
      },
      {
        idSuffix: 'cargo_freighter',
        title: 'Derelict Cargo Freighter',
        distance: '2.8 miles away',
        danger: 'Extreme Danger',
        dangerColor: 'text-rose-500 font-bold',
        lootDescription: 'Import Electronics, Diesel Cans, Military Crates',
        category: 'research',
        iconName: 'Compass'
      }
    ]
  },
  {
    type: 'downtown',
    namePool: ['Crown Plaza Metro', 'The Financial Spire District', 'Grand Avenue Core', 'Midtown Transit District'],
    description: 'Towering office high-rises, shattered glass skywalks, and echoing urban concrete canyons.',
    environmentalFeature: 'Vertical high-rise choke points and subway tunnels; high-tech gear and pharmaceuticals.',
    landmarkTemplates: [
      {
        idSuffix: 'metro_general',
        title: 'Metro General Hospital Triage',
        distance: '0.8 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'IV Bags, Antibiotic Capsules, Trauma Gauze',
        category: 'medical',
        iconName: 'Cross'
      },
      {
        idSuffix: 'plaza_gourmet',
        title: 'Costway Grand Plaza Depot',
        distance: '1.3 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Gourmet Canned Goods, Bottled Water, Coffee',
        category: 'food',
        iconName: 'ShoppingBag'
      },
      {
        idSuffix: 'central_precinct',
        title: '1st Precinct Tactical Sally Port',
        distance: '2.2 miles away',
        danger: 'Extreme Danger',
        dangerColor: 'text-rose-500 font-bold',
        lootDescription: 'Tactical Shotguns, Kevlar Vests, 9mm Ammo',
        category: 'weapons',
        iconName: 'ShieldAlert'
      },
      {
        idSuffix: 'hardware_exchange',
        title: 'City Hardware Exchange',
        distance: '1.6 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Framing Studs, Concrete Nails, Tool Sets',
        category: 'materials',
        iconName: 'Hammer'
      },
      {
        idSuffix: 'penthouse_suite',
        title: 'Executive High-Rise Penthouse',
        distance: '3.1 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Solar Batteries, Emergency Radio, Whiskey',
        category: 'research',
        iconName: 'Compass'
      }
    ]
  },
  {
    type: 'rural_valley',
    namePool: ['Harvest Valley', 'Pine Ridge Farmlands', 'Greenriver Valley', 'Sunnycreek Basin', 'Cedar Hollow'],
    description: 'Rolling farmland, grain silos, roadside barns, and peaceful unpaved gravel roads.',
    environmentalFeature: 'Abundant fresh soil, wild game, and rainwater; sparse medical and defense supplies.',
    landmarkTemplates: [
      {
        idSuffix: 'veterinary_clinic',
        title: 'Valley Veterinary Clinic',
        distance: '1.1 miles away',
        danger: 'Low Risk',
        dangerColor: 'text-emerald-400',
        lootDescription: 'Veterinary Antibiotics, Suture Kits, Disinfectant',
        category: 'medical',
        iconName: 'Cross'
      },
      {
        idSuffix: 'grain_silo',
        title: 'Harvest Valley Grain Co-Op',
        distance: '1.4 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Dried Corn, Oats, Pure Spring Water',
        category: 'food',
        iconName: 'ShoppingBag'
      },
      {
        idSuffix: 'sheriff_substation',
        title: 'County Sheriff Rural Post',
        distance: '1.9 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Hunting Rifles, Buckshot Boxes, Road Flares',
        category: 'weapons',
        iconName: 'ShieldAlert'
      },
      {
        idSuffix: 'pioneer_mill',
        title: 'Pioneer Sawmill & Lumber Yard',
        distance: '0.7 miles away',
        danger: 'Low Risk',
        dangerColor: 'text-emerald-400',
        lootDescription: 'Cured Timber Planks, Heavy Nails, Fencing Wire',
        category: 'materials',
        iconName: 'Hammer'
      },
      {
        idSuffix: 'orchard_farmstead',
        title: 'Sunnycreek Orchard Farmstead',
        distance: '2.4 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Dried Apple Crates, Heirloom Seeds, Well Buckets',
        category: 'research',
        iconName: 'Compass'
      }
    ]
  },
  {
    type: 'industrial',
    namePool: ['Ironforge Rail Yards', 'Vulcan Industrial Sector', 'Black River Chemical Plant', 'Rustbelt Foundry District'],
    description: 'Heavy machinery, rusted locomotives, diesel tanks, and concrete smelter smokestacks.',
    environmentalFeature: 'Toxic chemical hazards and structural scrap metal; high fuel, batteries, and weapons.',
    landmarkTemplates: [
      {
        idSuffix: 'factory_clinic',
        title: 'Foundry Occupational Clinic',
        distance: '1.0 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Burn Dressings, Eye Wash, Medical Splints',
        category: 'medical',
        iconName: 'Cross'
      },
      {
        idSuffix: 'rail_commissary',
        title: 'Railroad Logistics Commissary',
        distance: '1.5 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Sealed MRE Rations, Water Barrels, Salted Meat',
        category: 'food',
        iconName: 'ShoppingBag'
      },
      {
        idSuffix: 'freight_armory',
        title: 'Armored Freight Cargo Car',
        distance: '2.5 miles away',
        danger: 'Extreme Danger',
        dangerColor: 'text-rose-500 font-bold',
        lootDescription: 'Assault Shotguns, Steel Pipe Bludgeons, Heavy Ammo',
        category: 'weapons',
        iconName: 'ShieldAlert'
      },
      {
        idSuffix: 'steel_works',
        title: 'Vulcan Steel Scrap Works',
        distance: '0.9 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Structural Rebar, Fasteners, Tool Wrenches',
        category: 'materials',
        iconName: 'Hammer'
      },
      {
        idSuffix: 'chemical_tanker',
        title: 'Punctured Fuel & Chemical Tanker',
        distance: '2.7 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Refined Diesel Fuel, Industrial Tape, Lithium Cells',
        category: 'research',
        iconName: 'Compass'
      }
    ]
  },
  {
    type: 'university',
    namePool: ['Arbor University Campus', 'Oakwood Medical Research Park', 'St. Claire Academic Quarter', 'Summit College Hill'],
    description: 'Ivy-covered brick lecture halls, glass laboratories, and multi-tier campus libraries.',
    environmentalFeature: 'Elevated skywalks and clean research archives; advanced electronics and seeds.',
    landmarkTemplates: [
      {
        idSuffix: 'campus_lab',
        title: 'Biosafety Level 3 Research Lab',
        distance: '1.2 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Pure Antibiotics, Chemical Antiseptic, Medical Scopes',
        category: 'medical',
        iconName: 'Cross'
      },
      {
        idSuffix: 'dining_hall',
        title: 'Campus Central Dining Union',
        distance: '0.8 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Wholesale Dry Pasta, Olive Oil, Canned Fruit',
        category: 'food',
        iconName: 'ShoppingBag'
      },
      {
        idSuffix: 'campus_security',
        title: 'University Security Headquarters',
        distance: '1.6 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Tactical Batons, 9mm Magazines, Riot Armor',
        category: 'weapons',
        iconName: 'ShieldAlert'
      },
      {
        idSuffix: 'facilities_barn',
        title: 'Campus Maintenance Workshop',
        distance: '1.0 miles away',
        danger: 'Low Risk',
        dangerColor: 'text-emerald-400',
        lootDescription: 'Framing Timber, Electric Wire, Hardware Nails',
        category: 'materials',
        iconName: 'Hammer'
      },
      {
        idSuffix: 'botany_conservatory',
        title: 'Arboretum Botanical Greenhouse',
        distance: '2.1 miles away',
        danger: 'Low Risk',
        dangerColor: 'text-emerald-400',
        lootDescription: 'Heirloom Crop Seeds, Pure Cistern Water, Nitrogen Fertilizer',
        category: 'research',
        iconName: 'Compass'
      }
    ]
  },
  {
    type: 'quarantine_zone',
    namePool: ['Zone 4 Redoubt', 'The Northern Containment Wall', 'Sector 9 Quarantine Ring', 'Checkpoint Outpost Omega'],
    description: 'Concrete blast barricades, military perimeter towers, razor wire coils, and searchlight nests.',
    environmentalFeature: 'Extreme fortified chokepoints; high-grade military weaponry, ammo, and armor.',
    landmarkTemplates: [
      {
        idSuffix: 'field_triage',
        title: 'Forward Field Triage Tent',
        distance: '1.1 miles away',
        danger: 'High Danger',
        dangerColor: 'text-rose-400',
        lootDescription: 'Surgical Kits, Blood Clotting Gauze, Morphine',
        category: 'medical',
        iconName: 'Cross'
      },
      {
        idSuffix: 'aid_depot',
        title: 'Humanitarian Emergency Depot',
        distance: '1.4 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Military MRE Packs, Water Purification Tablets, Vitamin Rations',
        category: 'food',
        iconName: 'ShoppingBag'
      },
      {
        idSuffix: 'checkpoint_sally',
        title: 'Checkpoint Bravo Sally Port',
        distance: '2.3 miles away',
        danger: 'Extreme Danger',
        dangerColor: 'text-rose-500 font-bold',
        lootDescription: 'Tactical Shotguns, Kevlar Torso Armor, Buckshot Crates',
        category: 'weapons',
        iconName: 'ShieldAlert'
      },
      {
        idSuffix: 'engineering_yard',
        title: 'Corps of Engineers Depot',
        distance: '1.7 miles away',
        danger: 'Moderate Risk',
        dangerColor: 'text-amber-400',
        lootDescription: 'Reinforced Steel Studs, Sandbags, Construction Nails',
        category: 'materials',
        iconName: 'Hammer'
      },
      {
        idSuffix: 'evac_chopper',
        title: 'Downed Evac Helicopter',
        distance: '2.9 miles away',
        danger: 'Extreme Danger',
        dangerColor: 'text-rose-500 font-bold',
        lootDescription: 'Emergency Flight Radio, Flare Gun, Class A Field Medkit',
        category: 'research',
        iconName: 'Compass'
      }
    ]
  }
];

export function generateProceduralDistrict(forcedType?: DistrictType): CityDistrict {
  const template = forcedType 
    ? DISTRICT_TEMPLATES.find(t => t.type === forcedType) || DISTRICT_TEMPLATES[0]
    : DISTRICT_TEMPLATES[Math.floor(Math.random() * DISTRICT_TEMPLATES.length)];

  const name = template.namePool[Math.floor(Math.random() * template.namePool.length)];
  const districtId = 'district_' + template.type + '_' + Date.now();

  const landmarks: LandmarkLocation[] = template.landmarkTemplates.map((lt, idx) => ({
    id: districtId + '_' + lt.idSuffix + '_' + idx,
    title: lt.title,
    distance: lt.distance,
    danger: lt.danger,
    dangerColor: lt.dangerColor,
    lootDescription: lt.lootDescription,
    category: lt.category,
    iconName: lt.iconName,
    hasInvestigatedClue: false
  }));

  return {
    id: districtId,
    name,
    type: template.type,
    description: template.description,
    environmentalFeature: template.environmentalFeature,
    landmarks
  };
}

