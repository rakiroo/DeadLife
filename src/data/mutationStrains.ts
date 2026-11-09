import { MutationStrain, StrainId } from '../types/game';

export const ALL_MUTATION_STRAINS: MutationStrain[] = [
  {
    id: 'acoustic_stalkers',
    name: 'Acoustic Stalkers',
    codeName: 'Strain Echo-7',
    tagline: 'Blind as death, guided by sound.',
    description: 'The virus atrophied optical nerves while hyper-developing auditory receptors. Infected are totally blind but can pinpoint footsteps and whispers from across city blocks.',
    icon: 'Radio',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    ruleSummary: 'Gunshots guarantee swarm ambushes. Stealth skill and bladed weapons receive +50% lethality and evasion bonus.',
    tacticalTip: 'Never fire an unsuppressed weapon. Use bricks for distraction and move strictly in the shadows.',
    stealthMultiplier: 1.5,
    gunshotHazardRisk: 0.90
  },
  {
    id: 'toxic_spore_bloom',
    name: 'Toxic Spore Bloom',
    codeName: 'Strain Myco-9',
    tagline: 'Fungal fruiting bodies releasing airborne miasma.',
    description: 'Cadavers sprout vibrant orange bracket fungi that burst into airborne spore clouds during rain and dusk. Breathing the miasma inflames alveoli with fungal sepsis.',
    icon: 'CloudFog',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    ruleSummary: 'Dusk and heavy rain trigger spore hazards outdoors. Scavenging requires medical respirators or antibiotics.',
    tacticalTip: 'Equip medical items and scavenge strictly in the midday sun when ultraviolet light suppresses spore clouds.',
    duskInfectionRisk: 0.35
  },
  {
    id: 'solar_frenzy',
    name: 'Solar Frenzy',
    codeName: 'Strain Helios-4',
    tagline: 'Photoreactive adrenaline surges in direct sunlight.',
    description: 'Ultraviolet radiation supercharges their cellular metabolism into relentless sprint speeds. Conversely, cold darkness renders them sluggish and dormant.',
    icon: 'Sun',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    ruleSummary: 'Daytime expeditions face lethal sprinting swarms. Night and freezing weather make infected slow and easy to eliminate.',
    tacticalTip: 'Rest inside during sunny afternoons; launch all dangerous supply runs under the cover of night or winter.',
    daySpeedMultiplier: 1.6
  },
  {
    id: 'neuro_hive',
    name: 'Neuro-Hive Network',
    codeName: 'Strain Synapse-X',
    tagline: 'Ultrasonic death shrieks alerting the surrounding horde.',
    description: 'When an infected is eliminated loudly, dying vocal cords emit high-frequency resonance waves that instantly awaken and summon every lurker within three city avenues.',
    icon: 'Zap',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    ruleSummary: 'Loud kills trigger chain horde ambushes. Silent takedowns with spears or knives bypass the hive alert.',
    tacticalTip: 'Use spears and bows for silent kills to prevent death screams from cascading into a full-scale street siege.'
  },
  {
    id: 'crimson_rabies',
    name: 'Crimson Rabies',
    codeName: 'Strain Rabies-Ultra',
    tagline: 'Hyper-aggressive sprinters with foaming jaws.',
    description: 'Violent neurological agitation causes relentless sprinting charges and vicious biting frenzies. Infection transfer risk on scratches is doubled.',
    icon: 'Flame',
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
    ruleSummary: 'Infection risk doubled. High fitness and heavy blunt weapons required to counter aggressive grapples.',
    tacticalTip: 'Stockpile antiseptic and antibiotics. Equip heavy body armor before clearing tight indoor corridors.'
  },
  {
    id: 'glacial_stasis',
    name: 'Glacial Stasis',
    codeName: 'Strain Cryo-Frost',
    tagline: 'Cryo-adapted predators thriving in winter freezes.',
    description: 'Extracted from ancient permafrost, this pathogen thrives in freezing cold. Infected generate natural biological antifreeze, sprinting through blizzards while slowing down in summer heat.',
    icon: 'Snowflake',
    color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
    ruleSummary: 'Winter blizzards double infected aggression and sight range. Summer heatwaves exhaust them into lethargy.',
    tacticalTip: 'Fortify your barricades with heavy timber before winter hits; take advantage of summer droughts to scavenge.'
  },
  {
    id: 'necrotic_carapace',
    name: 'Necrotic Carapace',
    codeName: 'Strain Osteo-Plate',
    tagline: 'Thickened calcified bone plating deflecting light blades.',
    description: 'The virus triggers severe osteogenic overgrowth, coating heads and torsos in thick calcified bone armor. Light knives and arrows shatter on impact.',
    icon: 'Shield',
    color: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
    ruleSummary: 'Knives and arrows deal minimal damage. Heavy spiked bats, sledgehammers, and 12-gauge shotguns required.',
    tacticalTip: 'Craft spiked bats or molotov firebombs. Blunt trauma and fire ignore external bone plating.'
  },
  {
    id: 'classic_walkers',
    name: 'Necrotic Shufflers',
    codeName: 'Strain Alpha-1',
    tagline: 'Classic decaying undead moving in inexorable hordes.',
    description: 'The original baseline strain. Shuffling, decaying, and slow, but terrifying in vast migratory numbers that drown perimeter walls through sheer weight.',
    icon: 'Users',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    ruleSummary: 'Individual infected are easy to eliminate, but barricade erosion during horde migrations is unrelenting.',
    tacticalTip: 'Maintain barricade integrity above 60% and assign dedicated builders to patch entry points daily.'
  }
];

export function getRandomMutationStrain(): MutationStrain {
  return ALL_MUTATION_STRAINS[Math.floor(Math.random() * ALL_MUTATION_STRAINS.length)];
}

