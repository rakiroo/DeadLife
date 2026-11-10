export type StatusEffectType = 
  | 'bleeding' 
  | 'fracture' 
  | 'bacterial_infection' 
  | 'zombie_infection' 
  | 'hypothermia' 
  | 'dysentery' 
  | 'concussion' 
  | 'well_fed' 
  | 'dehydrated' 
  | 'starving';

export interface StatusEffect {
  id: StatusEffectType;
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  description: string;
  daysRemaining?: number;
}

export type TraitType = 'positive' | 'negative';

export interface Trait {
  id: string;
  name: string;
  type: TraitType;
  cost: number;
  description: string;
  iconName?: string;
}

export interface LootSpot {
  id: string;
  name: string;
  description: string;
  searched: boolean;
  loot: InventoryItem[];
}

export interface SpawnStory {
  id: string;
  title: string;
  intro: string;
  fullStory: string;
}

export interface StartingLocation {
  name: string;
  type: string;
  description: string;
  storyTitle?: string;
  storyText?: string;
  lootSpots: LootSpot[];
  hasLeftStartingSpot: boolean;
}

export interface Career {
  id: string;
  title: string;
  icon: string;
  description: string;
  bonusPoints?: number;
  startingLocation: {
    name: string;
    type: string;
    description: string;
    stories?: SpawnStory[];
    lootSpots: {
      id: string;
      name: string;
      description: string;
      loot: InventoryItem[];
    }[];
  };
  stats: {
    combat: number;
    medical: number;
    crafting: number;
    stealth: number;
    fitness: number;
  };
}

export interface SurvivorBackstory {
  id: string;
  theme: 'family' | 'pet' | 'rival' | 'love' | 'guilt';
  title: string;
  targetName: string;
  relation: string;
  targetGender?: 'male' | 'female';
  targetAge?: number;
  targetSkills?: { combat: number; medical: number; crafting: number; stealth: number; fitness: number };
  targetCauseOfDeath?: string;
  targetMemoirFlashback?: string;
  targetKeepsake?: string;
  hookText: string;
  searchGoal: string;
  targetLocationId: string;
  clueFound?: boolean;
  chapter?: number;
  completedChapters?: number[];
  lastChapterDay?: number;
  status: 'searching' | 'clue_found' | 'resolved';
  outcome?: 'reunited' | 'bitten_survived' | 'deceased' | 'mercy' | 'avenged';
  outcomeSummary?: string;
  journalThoughts: string[];
}

export interface FamilyHeirloom {
  id: string;
  name: string;
  type: 'weapon' | 'ring' | 'journal' | 'tool' | 'locket' | 'watch' | 'medallion';
  bonusSkill: 'combat' | 'medical' | 'crafting' | 'stealth' | 'fitness';
  bonusValue: number;
  description: string;
  passedFrom: string;
  originalMaker?: string;
  originStory: string;
  engravedMotto?: string;
  generation: number;
  durability: number;
  condition: 'Pristine' | 'Battle-Worn' | 'Weathered' | 'Antique';
  forgedDay: number;
  lineageHistory?: string[];
}

export interface SurvivorChild {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  stage: 'infant' | 'child' | 'teen' | 'adult';
  traits?: Trait[];
  skills?: { combat: number; medical: number; crafting: number; stealth: number; fitness: number };
  lastMentoredDay?: number;
  spouseName?: string;
  isDeceased?: boolean;
  deathCause?: string;
  isLegitimate?: boolean;
  origin?: 'legitimate' | 'illegitimate';
  originDetail?: 'marital' | 'affair' | 'out_of_wedlock' | 'adopted';
  motherName?: string;
  fatherName?: string;
  legitimizedBy?: string;
  legitimizedDay?: number;
  isPlayedLeader?: boolean;
}

export interface Survivor {
  name: string;
  gender?: 'male' | 'female';
  age: number;
  ageGroup: 'Youth' | 'Prime' | 'Middle-Aged' | 'Senior';
  profession: string;
  bio: string;
  health: number; // 0 - 100
  sanity: number; // 0 - 100
  hunger?: number; // 0 - 100
  thirst: number; // 0 - 100
  infectionRisk: number; // 0 - 100
  infectionDays?: number; // Days since contracted
  infectionSource?: string; // Wound origin or encounter description
  infectionLocation?: string; // e.g. left forearm, right shoulder, airborne
  isBitten?: boolean;
  biteTreated?: boolean; // Disinfected / dressed with sterile bandages
  combatSkill: number; // 1 - 10
  medicalSkill: number; // 1 - 10
  stealthSkill: number; // 1 - 10
  craftingSkill: number; // 1 - 10
  fitnessSkill: number; // 1 - 10
  traits: Trait[];
  statusEffects: StatusEffect[];
  isDead: boolean;
  deathCause?: string;
  backstory?: SurvivorBackstory;
  spouseId?: string;
  spouseName?: string;
  datingTargetId?: string;
  datingTargetName?: string;
  romanceStage?: 'single' | 'crush' | 'dating' | 'engaged' | 'married' | 'widowed';
  isSpouseMissing?: boolean;
  isPartnerMissing?: boolean;
  children?: SurvivorChild[];
  generation?: number;
  heirlooms?: FamilyHeirloom[];
  roomId?: string;
  isPregnant?: boolean;
  pregnancyMonths?: number;
  pregnantWith?: string;
  pregnantFatherId?: string;
  secretAffairs?: string[];
  will?: WillAndTestament;
  equippedWeapon?: InventoryItem;
  equippedWeaponId?: string;
  playedCharacters?: string[];
}

export type CampRole = 'guard' | 'scavenger' | 'medic' | 'craftsman' | 'idle' | 'sickbay';

export interface SurvivorRelationship {
  targetId: string;
  targetName: string;
  score: number; // 0 - 100
  status: 'Best Friend' | 'Friend' | 'Dating' | 'Spouse' | 'Rival' | 'Acquaintance';
}

export interface CampMember {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  age: number;
  relation: string;
  bio?: string;
  daysTogether?: number;
  profession: string;
  health: number;
  trust: number;
  combatSkill?: number;
  medicalSkill?: number;
  craftingSkill?: number;
  stealthSkill?: number;
  fitnessSkill?: number;
  role: CampRole;
  isBittenSuspect?: boolean;
  statusEffects: StatusEffect[];
  roomId?: string;
  quirk?: string;
  flaw?: string;
  morale?: number;
  opinionOfLeader?: number;
  spouseId?: string;
  spouseName?: string;
  partnerId?: string;
  partnerName?: string;
  datingStage?: 'single' | 'crush' | 'dating' | 'engaged' | 'married';
  isChild?: boolean;
  stage?: 'infant' | 'child' | 'teen' | 'adult';
  parentNames?: string[];
  relationships?: SurvivorRelationship[];
  isPregnant?: boolean;
  pregnancyMonths?: number;
  pregnantWith?: string;
  pregnantFatherId?: string;
  secretAffairs?: string[];
  isSleepingRough?: boolean;
}

export interface CampRoom {
  id: string;
  name: string;
  type: 'cots' | 'bunk' | 'cabin' | 'infirmary';
  capacity: number;
  comfort: number;
  assignedMemberIds: string[];
  level?: number;
}

export interface CampFacility {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  effectDescription: string;
}

export interface BaseShelter {
  isEstablished: boolean; // False until player claims or builds an actual shelter
  name: string;
  type: string;
  defenseRating: number;
  stealthRating: number;
  warmthRating: number;
  waterCollectorLevel: number;
  storedRainwater: number;
  maxRainwater: number;
  barricadeIntegrity: number;
  generatorOperational: boolean;
  fuelGallons: number;
  maxSurvivors?: number;
  morale?: number; // 0 - 100
  rationPolicy?: 'full' | 'standard' | 'half';
  securityProtocol?: 'open' | 'quarantine' | 'lockdown';
  rooms?: CampRoom[];
  facilities?: CampFacility[];
  greenhouseLevel?: number;
  infirmaryLevel?: number;
  hasSchoolhouse?: boolean;
  hasNursery?: boolean;
  hasMemorialGarden?: boolean;
  childrenBornCount?: number;
  marriagesCount?: number;
  hasChickenCoop?: boolean;
  chickenCoopLevel?: number;
  hasSanctuaryWell?: boolean;
  heirlooms?: FamilyHeirloom[];
  farmingDecree?: 'standard' | 'intensive' | 'water_saving';
  scavengeQuotaDecree?: 'conservative' | 'balanced' | 'aggressive';
  birthDecree?: 'encouraged' | 'normal' | 'austerity';
  heatingDaysRemaining?: number;
  storedFirewood?: number;
}

export type ItemCategory = 'food' | 'water' | 'medical' | 'weapon' | 'tool' | 'resource';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  description: string;
  effectDescription?: string;
  durability?: number;
  origin?: 'day_0' | 'partner_gift' | 'builder_forged' | 'crafted' | 'scavenged';
  giftedBy?: string;
  forgedBy?: string;
}

export interface LogEntry {
  id: string;
  day: number;
  dayLabel?: string; // Optional custom range label, e.g. "2 – 8"
  text: string;
  type: 'general' | 'combat' | 'medical' | 'camp' | 'loot' | 'hazard' | 'death' | 'milestone';
  timestamp: string;
}

export interface EventChoice {
  id: string;
  text: string;
  requiresItem?: string;
  requiredSkill?: { skill: 'combat' | 'medical' | 'stealth' | 'crafting' | 'fitness'; minLevel: number };
  consequenceSummary?: string;
  execute: (state: GameState) => { state: GameState; log: string; outcomeTitle: string; outcomeText: string; isFatal?: boolean };
}

export interface EventDilemma {
  id: string;
  title: string;
  category: 'encounter' | 'camp_drama' | 'crisis' | 'discovery' | 'medical' | 'hazard';
  description: string;
  dangerLevel: 'low' | 'medium' | 'high' | 'critical';
  choices: EventChoice[];
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface WillAndTestament {
  designatedHeirId?: string;
  designatedHeirName?: string;
  bequeathedHeirloomId?: string;
  bequeathedHeirloomName?: string;
  inheritedRoomId?: string;
  founderCreed?: 'endure' | 'protect' | 'build' | 'adapt';
  creedTitle?: string;
  creedPerkDescription?: string;
  personalMessage?: string;
  lastUpdatedDay?: number;
}

export type WeatherType = 'clear' | 'heavy_rain' | 'thunderstorm' | 'dense_fog' | 'freezing_cold' | 'heatwave';

export interface CemeteryRecord {
  id: string;
  name: string;
  age: number;
  profession: string;
  daysSurvived: number;
  deathCause: string;
  date: string;
  ribbon: string;
  stats: {
    zombiesEliminated: number;
    scavengeRuns: number;
    peopleSaved: number;
  };
  biography?: string;
  spouseName?: string;
  childrenCount?: number;
  generation?: number;
  baseName?: string;
  districtName?: string;
  districtType?: string;
  mutationStrainName?: string;
  mutationStrainCode?: string;
  mysteryTitle?: string;
  mysterySolved?: boolean;
  equippedWeaponName?: string;
  founderCreedTitle?: string;
  ribbonDesc?: string;
  secondaryRibbons?: { title: string; desc: string; icon: string }[];
  completedAmbitionTitles?: string[];
}

export interface BabyNamingPrompt {
  motherName: string;
  fatherName: string;
  gender: 'male' | 'female';
  suggestedFirstName: string;
  suggestedLastName: string;
  isPlayerChild: boolean;
  parentMemberId?: string;
  isLegitimate?: boolean;
  origin?: 'legitimate' | 'illegitimate';
  originDetail?: 'marital' | 'affair' | 'out_of_wedlock' | 'adopted';
}

export type DistrictType = 'harbor' | 'downtown' | 'rural_valley' | 'industrial' | 'university' | 'quarantine_zone';

export interface LandmarkLocation {
  id: string;
  title: string;
  distance: string;
  danger: 'Low Risk' | 'Moderate Risk' | 'High Danger' | 'Extreme Danger';
  dangerColor: string;
  lootDescription: string;
  category: 'medical' | 'food' | 'weapons' | 'materials' | 'research';
  iconName: string;
  hasInvestigatedClue?: boolean;
}

export interface CityDistrict {
  id: string;
  name: string;
  type: DistrictType;
  description: string;
  environmentalFeature: string;
  landmarks: LandmarkLocation[];
}

export type StrainId = 
  | 'acoustic_stalkers' 
  | 'toxic_spore_bloom' 
  | 'solar_frenzy' 
  | 'neuro_hive' 
  | 'crimson_rabies' 
  | 'glacial_stasis' 
  | 'necrotic_carapace'
  | 'classic_walkers';

export interface MutationStrain {
  id: StrainId;
  name: string;
  codeName: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  ruleSummary: string;
  tacticalTip: string;
  stealthMultiplier?: number;
  gunshotHazardRisk?: number;
  duskInfectionRisk?: number;
  daySpeedMultiplier?: number;
}

export interface MysteryClue {
  id: string;
  mysteryId: string;
  stage: 1 | 2 | 3 | 4;
  title: string;
  source: string;
  snippet: string;
  discoveredDay?: number;
  locationName?: string;
}

export interface OutbreakMystery {
  id: string;
  title: string;
  codeName: string;
  premise: string;
  conspiracySummary: string;
  rewardBunkerName: string;
  rewardItems: InventoryItem[];
  allClues: MysteryClue[];
  discoveredClueIds: string[];
  isSolved: boolean;
}

export interface CodexUnlockItem {
  id: string;
  type: 'career' | 'trait' | 'modifier';
  name: string;
  description: string;
  cost: number;
  icon: string;
}

export interface CodexSaveData {
  legacyMarks: number;
  totalRunsPlayed: number;
  totalDaysSurvived: number;
  totalZombiesKilled: number;
  unlockedIds: string[];
  completedMysteryIds: string[];
}

export interface GameState {
  day: number; // Starts at 0
  timeOfDay: 'Morning' | 'Noon' | 'Dusk' | 'Night';
  season?: Season;
  weather: WeatherType;
  temperatureCelsius: number;
  player: Survivor;
  startingLocation: StartingLocation;
  campMembers: CampMember[];
  isCampEstablished?: boolean;
  shelter: BaseShelter;
  inventory: InventoryItem[];
  logs: LogEntry[];
  activeDilemma: EventDilemma | null;
  dilemmaResult: { title: string; text: string; isFatal?: boolean } | null;
  daysWithoutFood: number;
  daysWithoutWater: number;
  stats: {
    zombiesEliminated: number;
    daysSurvived: number;
    scavengeRuns: number;
    peopleSaved: number;
    marriagesHeld?: number;
    childrenRaised?: number;
  };
  ribbons: string[];
  legacySuccessionPrompt?: {
    cause: string;
    deceasedName: string;
    deceasedAge: number;
    candidates: { id: string; name: string; relation: string; profession: string; age: number; isOffspring: boolean; skills: { combat: number; medical: number; crafting: number; stealth: number; fitness: number } }[];
  } | null;
  pendingBabyNaming?: BabyNamingPrompt | null;
  district?: CityDistrict;
  mutationStrain?: MutationStrain;
  mystery?: OutbreakMystery;
  completedAmbitionIds?: string[];
}
