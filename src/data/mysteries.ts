import { OutbreakMystery, MysteryClue, InventoryItem } from '../types/game';

interface MysteryTemplate {
  id: string;
  title: string;
  codeName: string;
  premise: string;
  conspiracySummary: string;
  rewardBunkerName: string;
  rewardItems: InventoryItem[];
  clueTemplates: {
    stage: 1 | 2 | 3 | 4;
    title: string;
    source: string;
    snippet: string;
  }[];
}

const ALL_MYSTERY_TEMPLATES: MysteryTemplate[] = [
  {
    id: 'project_chimera',
    title: 'Project Chimera: The Defense Lab Leak',
    codeName: 'Operation Blackwing',
    premise: 'Classified defense contractor memoranda suggest the outbreak was not a natural disease, but an escaped weaponized neural pathogen designed for bio-warfare.',
    conspiracySummary: 'DARPA subcontract 884-Delta engineered a chimera virus to incapacitate enemy battalions. On October 12th, a containment breach at the subterranean test wing infected medical technicians, who evacuated directly into the metropolitan transit lines.',
    rewardBunkerName: 'Black-Site Vault 09',
    rewardItems: [
      { id: 'bunker_shotgun_tactical', name: 'Military Tactical Shotgun', category: 'weapon', quantity: 1, description: 'Mil-spec semi-auto 12-gauge shotgun with holographic sight.' },
      { id: 'bunker_ammo_crate', name: 'Crate of 12-Gauge Buckshot (30)', category: 'resource', quantity: 30, description: 'Sealed military ammunition.' },
      { id: 'bunker_medkit_pro', name: 'Combat Trauma First Aid Rig', category: 'medical', quantity: 3, description: 'Military surgeon surgical dressings.' },
      { id: 'bunker_mre_case', name: 'Case of Military Field MREs (10)', category: 'food', quantity: 10, description: 'High-calorie emergency survival meals.' }
    ],
    clueTemplates: [
      {
        stage: 1,
        title: 'Shredded Memo: Containment Breach at Sub-Level 4',
        source: 'Security Guard Sally Port Locker',
        snippet: '"...At 03:40, pressure seals failed in Bio-Pod 3. The subjects displayed abnormal auditory aggression within 90 seconds. Lockdown protocols were overridden by executive order..."'
      },
      {
        stage: 2,
        title: 'Synthesized Viral Genome Diagram',
        source: 'Hospital Clinical Computer Terminal',
        snippet: '"...The genetic sequencing contains artificial nucleotide splices derived from rabies and cordyceps fungi. This is not evolution. This was manufactured in a centrifuge..."'
      },
      {
        stage: 3,
        title: 'Microcassette Recording: Dr. Vance\'s Confession',
        source: 'Abandoned Medical Sedan Glovebox',
        snippet: '"...If anyone finds this tape, forgive us. We told the generals the pathogen had no off-switch. They threatened to court-martial our team if we halted human trials..."'
      },
      {
        stage: 4,
        title: 'Classified Bunker Keycard & GPS Coordinates',
        source: 'Corps of Engineers Emergency Locker',
        snippet: '"...Master biometric override card for Black-Site Vault 09. Located beneath the old transit tunnel. Stocked with military weaponry, emergency rations, and civil defense armor..."'
      }
    ]
  },
  {
    id: 'black_mold_sabotage',
    title: 'The Black Mold: Agricultural Sabotage',
    codeName: 'Project Ergot-X',
    premise: 'Grain and flour supplies across the continental breadbasket were systematically contaminated with a genetically enhanced ergot mycotoxin that induces cannibalistic psychosis.',
    conspiracySummary: 'Industrial agriculture conglomerate AgriGlobal suppressed crop pathology reports showing a weaponized mycotoxin spreading through commercial grain silos. When the bread reached supermarket shelves, millions ingested the neuro-parasite within days.',
    rewardBunkerName: 'AgriGlobal Strategic Seed Vault',
    rewardItems: [
      { id: 'bunker_seeds_heirloom', name: 'Master Heirloom Seed Vault (x5)', category: 'resource', quantity: 5, description: 'Pure, uncontaminated crop genetics.' },
      { id: 'bunker_pure_water', name: 'Purified Water Casks (x10)', category: 'water', quantity: 10, description: 'Decontaminated mountain spring water.' },
      { id: 'bunker_antibiotics_case', name: 'Broad-Spectrum Antifungal Antibiotics (x8)', category: 'medical', quantity: 8, description: 'Pharmaceutical grade antimicrobials.' },
      { id: 'bunker_timber_dense', name: 'Structural Cured Timber (x8)', category: 'resource', quantity: 8, description: 'Reinforced construction wood.' }
    ],
    clueTemplates: [
      {
        stage: 1,
        title: 'Inspection Failure Notice: Grain Silo 12',
        source: 'Harbor Warehouse Filing Cabinet',
        snippet: '"...Black spore growth detected throughout 40,000 tons of processed flour. Tests indicate intense hallucinogenic alkaloids. Immediate quarantine recommended. [STAMPED: SHIPMENT APPROVED]..."'
      },
      {
        stage: 2,
        title: 'Altered Shipping Manifests',
        source: 'Rail Logistics Dispatch Office',
        snippet: '"...Deliveries routed directly to primary school district cafeterias and wholesale supermarket hubs. Destination manifests were altered by an encrypted corporate terminal..."'
      },
      {
        stage: 3,
        title: 'Toxicology Report: Patient Zero Blood Analysis',
        source: 'Pharmacy Basement Safe',
        snippet: '"...Spore mycelium discovered migrating through cranial nerves, hijacking motor control. The subject feels no pain and attacks living flesh driven by insatiable fungal hunger..."'
      },
      {
        stage: 4,
        title: 'AgriGlobal Vault Access Credentials',
        source: 'Corporate Executive Desk',
        snippet: '"...Executive access pass to the subterranean Strategic Seed Vault. Stocked with clean water, uncontaminated grains, and heavy timber reinforcements..."'
      }
    ]
  },
  {
    id: 'pharma_coverup',
    title: 'Clinical Trial 404: The Wonder Drug',
    codeName: 'Project Lazarus',
    premise: 'A revolutionary Alzheimer\'s cognitive regenerative drug tested in metropolitan clinics triggered irreversible cellular resurrection and predatory violence.',
    conspiracySummary: 'PharmaTech International rushed miracle drug "Neuro-Cure" through clinical trials to beat patent expiration. When deceased test patients exhibited autonomous brainstem reactivation, executives bribed health inspectors and incinerated records, but the vector escaped into hospital wards.',
    rewardBunkerName: 'PharmaTech Executive Triage Suite',
    rewardItems: [
      { id: 'bunker_trauma_kits', name: 'Advanced Surgical Triage Rigs (x5)', category: 'medical', quantity: 5, description: 'Complete sterile surgical suites.' },
      { id: 'bunker_stim_shots', name: 'Emergency Epinephrine Stims (x4)', category: 'medical', quantity: 4, description: 'Instant adrenaline recovery.' },
      { id: 'bunker_security_sidearm', name: 'PharmaTech Custom 9mm Sidearm', category: 'weapon', quantity: 1, description: 'Match-grade silenced defense pistol.' },
      { id: 'bunker_9mm_rounds', name: '9mm Match Ammunition (x25)', category: 'resource', quantity: 25, description: 'Precision defense cartridges.' }
    ],
    clueTemplates: [
      {
        stage: 1,
        title: 'Patient 404 Autopsy Anomaly',
        source: 'Hospital Morgue Filing Cabinet',
        snippet: '"...Subject was declared clinically dead at 14:20. At 16:05, telemetry showed spontaneous brainstem reactivation. The mortuary technician sustained fatal bite wounds..."'
      },
      {
        stage: 2,
        title: 'Corporate Hush-Money Wire Receipts',
        source: 'Precinct Evidence Locker',
        snippet: '"...Over $4,000,000 wired to state coroner officials to falsify cause of death as ordinary cardiac arrest. All test subjects ordered incinerated immediately..."'
      },
      {
        stage: 3,
        title: 'Lead Researcher\'s Encrypted USB Drive',
        source: 'University Laboratory Desk',
        snippet: '"...The compound doesn\'t cure dementia. It prevents brain death entirely, locking the consciousness into a permanent primitive predatory cycle. God help us..."'
      },
      {
        stage: 4,
        title: 'Executive Triage Suite Keycard & Passcode',
        source: 'Downtown Penthouse Safe',
        snippet: '"...Biometric access cipher to the executive medical suite. Contains surgical triage rigs, adrenaline stimulants, and security armaments..."'
      }
    ]
  },
  {
    id: 'permafrost_borehole',
    title: 'The Deep Core: The Ancient Pathogen',
    codeName: 'Project Icebreaker',
    premise: 'Deep exploration borehole drilling into 2-million-year-old Arctic permafrost unearthed an ancient dormant virus that modern human immune systems cannot fight.',
    conspiracySummary: 'A geological drilling operation breached an ancient prehistoric subterranean lake. The trapped permafrost core thawed in transit to the city\'s research university, releasing an ancient paleolithic pathogen into the atmosphere.',
    rewardBunkerName: 'Geological Core Fallout Vault',
    rewardItems: [
      { id: 'bunker_winter_parkas', name: 'Heavy Insulated Polar Parkas (x4)', category: 'tool', quantity: 4, description: 'Sub-zero freezing cold protection.' },
      { id: 'bunker_timber_rebar', name: 'Structural Hardwood Studs (x6)', category: 'resource', quantity: 6, description: 'Dense building lumber.' },
      { id: 'bunker_flare_gun', name: 'Heavy Emergency Flare Gun', category: 'weapon', quantity: 1, description: 'Fires high-intensity incendiary magnesium rounds.' },
      { id: 'bunker_flare_rounds', name: 'Magnesium Flare Cartridges (x6)', category: 'resource', quantity: 6, description: 'Incendiary bludgeon rounds.' }
    ],
    clueTemplates: [
      {
        stage: 1,
        title: 'Geological Core Sample Log: Lake Vostok',
        source: 'University Library Archive',
        snippet: '"...Depth: 3,800 meters. Core contains biological organic material preserved in prehistoric ice. Unidentifiable viral capsid structures observed under electron microscope..."'
      },
      {
        stage: 2,
        title: 'Temperature Alarm Incident Report',
        source: 'Industrial Chemical Cold Storage',
        snippet: '"...Cooling system failure at cargo bay 3. Ice core sample thawed completely during transit. Three dockworkers hospitalized with violent neurological fevers within hours..."'
      },
      {
        stage: 3,
        title: 'Radio Intercept: Quarantine Failure at Sector 7',
        source: 'Abandoned Police Cruiser Radio',
        snippet: '"...All units, quarantine has collapsed. The virus spreads through saliva and blood. Standard antibiotics are useless against a pathogen that predates human civilization..."'
      },
      {
        stage: 4,
        title: 'Geological Fallout Shelter Override Codes',
        source: 'Subway Maintenance Tunnel Safe',
        snippet: '"...Access override for the geological core bunker. Sealed blast doors stocked with extreme cold survival parkas, emergency flare guns, and structural hardwood..."'
      }
    ]
  }
];

export function generateProceduralMystery(): OutbreakMystery {
  const template = ALL_MYSTERY_TEMPLATES[Math.floor(Math.random() * ALL_MYSTERY_TEMPLATES.length)];

  const clues: MysteryClue[] = template.clueTemplates.map((ct, idx) => ({
    id: 'clue_' + template.id + '_' + (idx + 1),
    mysteryId: template.id,
    stage: ct.stage,
    title: ct.title,
    source: ct.source,
    snippet: ct.snippet
  }));

  return {
    id: template.id,
    title: template.title,
    codeName: template.codeName,
    premise: template.premise,
    conspiracySummary: template.conspiracySummary,
    rewardBunkerName: template.rewardBunkerName,
    rewardItems: template.rewardItems.map(i => ({ ...i })),
    allClues: clues,
    discoveredClueIds: [],
    isSolved: false
  };
}

