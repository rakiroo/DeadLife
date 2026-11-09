import { GameState } from '../types/game';

export interface RibbonBadge {
  title: string;
  desc: string;
  icon: string;
  color?: string;
}

export function calculateSurvivorRibbons(state: GameState, deathCauseOverride?: string): {
  primary: RibbonBadge;
  achievements: RibbonBadge[];
} {
  const { player, shelter, stats, day, mystery } = state;
  const deathCause = (deathCauseOverride || player.deathCause || '').toLowerCase();

  const allBadges: RibbonBadge[] = [];

  // 1. Truth Seeker / Vault Breaker
  if (mystery?.isSolved) {
    allBadges.push({
      title: 'Truth Seeker',
      desc: 'Decrypted classified outbreak intelligence and breached the secret fallout vault.',
      icon: 'Key',
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    });
  }

  // 2. Year One Survivor
  if (day >= 365) {
    allBadges.push({
      title: 'Year One Pioneer',
      desc: 'Endured over a full 365-day year through all four deadly seasons.',
      icon: 'Calendar',
      color: 'text-amber-300 bg-amber-500/20 border-amber-500/40'
    });
  } else if (day >= 100) {
    allBadges.push({
      title: 'Century Survivor',
      desc: 'Lived over 100 grueling days in the post-apocalyptic wasteland.',
      icon: 'Award',
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    });
  }

  // 3. Dynasty Lineage
  if ((player.generation || 1) >= 2 || (player.children && player.children.length >= 2)) {
    allBadges.push({
      title: 'Dynasty Patriarch',
      desc: 'Sustained a multigenerational family bloodline through the apocalypse.',
      icon: 'Crown',
      color: 'text-purple-300 bg-purple-500/15 border-purple-500/30'
    });
  }

  // 4. Combat Prowess
  if (stats.zombiesEliminated >= 40) {
    allBadges.push({
      title: 'Reaper of the Dead',
      desc: 'A legendary warrior who neutralized over 40 infected abominations.',
      icon: 'Skull',
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/40'
    });
  } else if (stats.zombiesEliminated >= 15) {
    allBadges.push({
      title: 'Slayer of the Dead',
      desc: 'Eliminated scores of infected with deadly combat efficiency.',
      icon: 'Swords',
      color: 'text-rose-400 bg-rose-500/15 border-rose-500/30'
    });
  }

  // 5. Haven Fortress & Construction
  if (shelter.isEstablished && (shelter.rooms?.length || 0) >= 3 && shelter.barricadeIntegrity >= 60) {
    allBadges.push({
      title: 'Citadel Overseer',
      desc: 'Constructed an fortified sanctuary with multiple living quarters.',
      icon: 'Shield',
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
    });
  } else if (shelter.isEstablished) {
    allBadges.push({
      title: 'Sanctuary Founder',
      desc: 'Claimed and fortified a permanent sanctuary base for survivors.',
      icon: 'Home',
      color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    });
  }

  // 6. Humanitarian / Lives Saved
  if (stats.peopleSaved >= 4) {
    allBadges.push({
      title: 'Savior of the Lost',
      desc: 'Rescued and welcomed four or more fellow survivors into shelter.',
      icon: 'Users',
      color: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
    });
  }

  // 7. Silent Shadow Scavenger
  if (stats.scavengeRuns >= 10 && player.stealthSkill >= 6) {
    allBadges.push({
      title: 'Ghost of the Ruins',
      desc: 'Completed ten or more silent supply expeditions through infected avenues.',
      icon: 'Compass',
      color: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30'
    });
  }

  // 8. Master Healer
  if (player.medicalSkill >= 7) {
    allBadges.push({
      title: 'Plague Physician',
      desc: 'A dedicated medical specialist who treated wounds and halted septic infections.',
      icon: 'HeartPulse',
      color: 'text-rose-300 bg-rose-500/15 border-rose-500/30'
    });
  }

  // 9. Founder of Creed & Will
  if (player.will?.founderCreed) {
    allBadges.push({
      title: 'Will of the Founder',
      desc: 'Formalized a lasting dynasty testament and creed for future generations.',
      icon: 'Scroll',
      color: 'text-amber-300 bg-amber-500/15 border-amber-500/30'
    });
  }

  // 10. Master Weaponsmith
  if (player.equippedWeapon && player.craftingSkill >= 7) {
    allBadges.push({
      title: 'Master Weaponsmith',
      desc: 'Wielded lethal makeshift armaments forged by their own hands.',
      icon: 'Hammer',
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    });
  }

  // 11. Old Age / Peaceful Passing
  if (player.age >= 68 || deathCause.includes('old age')) {
    allBadges.push({
      title: 'The Patriarch Passed',
      desc: 'Defied the violence of the apocalypse to die peacefully in bed of old age.',
      icon: 'Sparkles',
      color: 'text-amber-300 bg-amber-500/15 border-amber-500/30'
    });
  }

  // 12. Dehydration / Starvation / Patient Zero
  if (day <= 2) {
    allBadges.push({
      title: 'Patient Zero',
      desc: 'Fell in the initial chaos before the sirens even faded.',
      icon: 'AlertTriangle',
      color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    });
  } else if (state.daysWithoutWater >= 3 || deathCause.includes('dehydration')) {
    allBadges.push({
      title: 'The Parched',
      desc: 'The scorching thirst claimed you before the monsters could.',
      icon: 'Droplets',
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30'
    });
  } else if (state.daysWithoutFood >= 3 || deathCause.includes('starvation')) {
    allBadges.push({
      title: 'Starved in Ashes',
      desc: 'Succumbed to famine when provisions ran dry in the ruins.',
      icon: 'Utensils',
      color: 'text-orange-400 bg-orange-500/15 border-orange-500/30'
    });
  }

  // Fallback badge if no special badges triggered
  if (allBadges.length === 0) {
    allBadges.push({
      title: 'Fallen Pioneer',
      desc: 'Fought bravely for every breath in the new dark age.',
      icon: 'Award',
      color: 'text-zinc-300 bg-white/5 border-white/10'
    });
  }

  // The primary ribbon is the first/highest priority achievement
  const primary = allBadges[0];
  const achievements = allBadges.slice(1);

  return { primary, achievements };
}

