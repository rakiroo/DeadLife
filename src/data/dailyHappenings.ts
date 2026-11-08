import { GameState, WeatherType } from '../types/game';

// Stage 1: The Outbreak & Collapse (Days 0 - 7)
// Immediate chaos, burning streets, power cutting out, emergency broadcasts
const STAGE_COLLAPSE_HAPPENINGS = [
  'A car alarm was still blaring three blocks over before its battery finally died.',
  'I saw thick black smoke rising from the interstate where an abandoned fuel tanker burned.',
  'The water pressure in the pipes dropped to a brown, sputtering trickle this morning.',
  'The automated emergency broadcast on the radio turned into continuous low-frequency static.',
  'A stray dog sprinted down the middle of the street, terrified by distant explosions.',
  'Distant gunfire echoed from the downtown commercial plaza before cutting out suddenly.',
  'A police cruiser sped past the intersection on its rims, throwing bright orange sparks.',
  'The streetlights flickered twice at dusk and then went completely dark across the entire borough.',
  'I found a discarded, half-packed suitcase in the middle of the sidewalk, clothes scattered by the wind.',
  'Sirens wailed for thirty seconds from the hospital district before the generator gave out.',
  'A billboard down the block was half-burned, flapping loose vinyl in the afternoon wind.',
  'I watched a helicopter fly low over the rooftops, its searchlight sweeping empty parking lots.',
  'The smell of burning rubber and uncollected garbage drifted through the cracked windowpanes.',
  'An automated bank ATM across the street kept flashing an error code until the grid died.',
  'I watched two panicked people sprint past into an alley, carrying duffel bags over their shoulders.',
  'The roar of a military transport jet broke the clouds high overhead, heading northwest.',
  'I checked the front deadbolts; frantic handprints were smeared in soot across the outer paint.',
  'A fire hydrant down the road was knocked open, spewing muddy water into the gutter.',
  'I found an unread morning newspaper on the steps with the headline: MARTIAL LAW DECLARED.',
  'Distant screams echoed from the subway entrance, followed by the heavy slam of a steel gate.',
  'I found an abandoned grocery cart on the curb filled with bottled mineral water and batteries.',
  'The cell tower battery backup died at noon; my phone now displays "No Service" permanently.',
  'I peered through the blinds and saw a cluster of infected pounding on the glass of a bakery.',
  'Sparks showered down from a severed powerline swaying in the wind across the boulevard.'
];

// Stage 2: The Silent City (Days 8 - 30)
// Complete silence, utilities dead, nature creeping in, empty avenues, decay
const STAGE_SILENCE_HAPPENINGS = [
  'The tap water ran completely dry today. Not a single drop left in the municipal pipes.',
  'Dandelion weeds are already pushing up through the cracks in the abandoned asphalt.',
  'A foul, sweet stench of decay blew down the avenue with the morning breeze.',
  'The city is terrifyingly quiet. You can hear a single aluminum soda can tumbling across the pavement.',
  'A flock of black crows settled on the roof of a stalled bus, watching the empty crosswalks.',
  'I watched a lone zombie shuffle aimlessly down the center yellow line of the boulevard.',
  'The clock on the bank tower froze permanently at 9:42 AM. Time has lost all formal meaning.',
  'I found an intact box of strike-anywhere wooden matches tucked into an old work coat.',
  'A sudden gust of wind slammed an open second-story shutter, making my heart skip a beat.',
  'I spent an hour picking wild dandelions and boiling them to check for edible greens.',
  'The dust in the room is settling into thick gray blankets over every piece of furniture.',
  'I carved another notch into the doorframe to keep track of the days since the collapse.',
  'A stray calico cat slipped through a broken basement grate and vanished into the shadows.',
  'I sat on the floor cleaning grit and moisture out of my weapon with an oiled scrap of denim.',
  'An abandoned delivery van sat parked across the street, its hazard lights long since drained.',
  'I found a faded postcard of the city as it looked during a crowded summer festival.',
  'The silence was so heavy that the ringing in my ears sounded like distant whispers.',
  'I watched the sunset paint the ruined skyline in deep copper and violet.',
  'A flock of pigeons burst from a shattered storefront window, startled by a falling ceiling tile.',
  'I found a half-empty jar of honey sealed in a pantry. Still pure and sweet after weeks.',
  'I used an oiled whetstone to sharpen the edge of my blade until it sliced cleanly through paper.',
  'The creak of an old metal billboard above the highway was the only sound for hours.',
  'I checked the battery life on my flashlight; two bars remaining, enough for emergencies.',
  'I wrapped heavy electrical tape around the worn soles of my boots to keep them intact.',
  'A lone deer trotted cautiously across the concrete courtyard, sniffing at the overgrown planter boxes.'
];

// Stage 3: Overgrowth, Scarcity & Cold (Days 31 - 60)
// Feral dog packs, vultures, winter cold snaps, desperate scavengers, tracking prints
const STAGE_SCARCITY_HAPPENINGS = [
  'A pack of three feral dogs trotted down the middle of the boulevard, sniffing for scraps.',
  'Frost coated the inside of the walls overnight; winter is settling into the dead city.',
  'I found fresh boot prints in the mud outside, made within the last few hours by another scavenger.',
  'A flock of vultures circled over the collapsed supermarket roof across the river.',
  'Every grocery store within two miles has been stripped bare down to the metal shelf brackets.',
  'I checked my perimeter traps and found a tripwire line snapped by something heavy.',
  'A bitter northern wind whistled through the building seams, freezing water in my drinking cup.',
  'I spent the morning reinforcing drafty window cracks with scrap insulation and duct tape.',
  'I heard distant heavy thumping coming from the drainage pipes beneath the street.',
  'Green ivy is creeping up the brick facades, swallowing entire first-floor store signs.',
  'I spotted a small smoke plume rising five miles away near the industrial rail yards.',
  'A herd of twenty infected migrated slowly past the end of the block, shuffling toward the river.',
  'My knuckles were split and bleeding from the dry cold; I rubbed them with petroleum jelly.',
  'I found an intact wool blanket wrapped in plastic in the trunk of an abandoned sedan.',
  'A rusted pickup truck was flipped on its side near the intersection, its tires slashed by wire.',
  'I sat in the dark listening to ice crack against the sheet metal gutters outside.',
  'I found an empty rifle casing on the sidewalk, the brass still bright and uncorroded.',
  'I used scrap wood from broken pallets to build a small, smoke-shielded brazier fire.',
  'The smell of woodsmoke from a distant chimney reminded me that others are still fighting to survive.',
  'I checked the water collection barrels; a thick layer of ice had to be chipped through to reach water.',
  'A stray bullet hole was punched through the corrugated siding, whistling in the gale.'
];

// Stage 4: The Wasteland & Survivors (Days 61+)
// Hardened survivors, distant military flares, organized factions, long-term survival
const STAGE_WASTELAND_HAPPENINGS = [
  'Distant green military flares lit up the low cloud cover far to the north at midnight.',
  'A convoy of two reinforced trucks sped down the bypass road, headlights completely blacked out.',
  'I noticed markings carved into a fence post: a chalk circle and two slashes indicating safe passage.',
  'I climbed to the highest vantage point with binoculars and mapped three fortified survivor outposts.',
  'A homemade radio broadcast crackled for three minutes, sharing coordinates for a river barge trade meet.',
  'The infected in this district have turned withered and leathery, but their hearing is sharper than ever.',
  'I found an abandoned survivalist bunker entrance hidden beneath a collapsed garden shed.',
  'The city is reclaiming itself: saplings are taking root in the cracked asphalt of parking lots.',
  'I spent the quiet hours disassembling an old alternator to salvage copper wiring and bearings.',
  'I watched a group of four armed survivors move in tight formation across the distant pedestrian bridge.',
  'A military cargo crate lay cracked open on the riverbank, its contents long since picked clean.',
  'I replaced the worn grip tape on my primary melee weapon with fresh leather cordage.',
  'The air was crisp and completely devoid of human pollution; stars shone with blinding clarity.',
  'I checked the vegetable planters on the roof; green tomato shoots are beginning to poke through the soil.',
  'A lone hawk nested atop the rusted crane overlooking the downtown shipping basin.',
  'I sat by the stove recording my observations in my journal, proud to have survived this long.'
];

// Weather Happenings (Sensory Atmosphere)
const WEATHER_HAPPENINGS: Record<WeatherType, string[]> = {
  heavy_rain: [
    'Cold rain drummed heavily against the cracked windowpanes all morning.',
    'A steady downpour flooded the gutters outside, washing soot into the street.',
    'I watched sheets of gray rain pour over the ruined rooftops.',
    'The storm drenched the streets, driving roaming infected under building awnings.',
    'Water leaked through a seam in the ceiling, creating a rhythmic pinging against an empty can.'
  ],
  thunderstorm: [
    'A deafening roll of thunder shook the floorboards. Rain lashed the exterior walls.',
    'Lightning flickered across the ruined skyline, casting long, jittery shadows through the blinds.',
    'The storm rattled the loose roof metal violently throughout the dark hours.',
    'A sudden crack of lightning split an old oak tree two blocks away with a loud pop.'
  ],
  dense_fog: [
    'Dense morning mist blanketed the street, hiding everything beyond thirty paces.',
    'Wet shuffling footsteps echoed out in the fog, but I kept quiet and stayed low.',
    'Thick, damp fog rolled through the alleyways, muffling all distant sound.',
    'The pale fog was so thick that the streetlights vanished into white voids.'
  ],
  freezing_cold: [
    'Frost coated the inside of the glass. My breath plumed white in the freezing morning air.',
    'A bitter northern wind whistled through the building seams all afternoon.',
    'I pulled my coat tight to conserve body heat as the temperature plummeted.',
    'Ice crunched beneath my boots every time I shifted weight on the wooden floor.'
  ],
  heatwave: [
    'The sweltering midday sun baked the asphalt outside, making the air thick and stifling.',
    'A scorching breeze blew dry dust and ashes down the deserted avenue.',
    'The heat was suffocating; I stayed motionless in the shade to conserve precious water.'
  ],
  clear: [
    'The morning sun cut through the dusty air, bringing a rare moment of quiet warmth.',
    'A clear blue sky stretched over the silent, abandoned city grid.',
    'The afternoon was calm. Not a single engine has rumbled for weeks.',
    'Pale sunlight filtered through the cracked blinds, illuminating dust motes in the quiet room.'
  ]
};

// Location-specific routines
function getLocationHappenings(state: GameState): string[] {
  const pool: string[] = [];
  if (!state.startingLocation.hasLeftStartingSpot) {
    const loc = state.startingLocation.name;
    pool.push(
      'I checked the barricaded entrance of ' + loc + '. The deadbolts held firm through the night.',
      'I swept away broken glass and reinforced the window frames inside ' + loc + '.',
      'I peered through the blinds of ' + loc + ' and watched a stray dog pick through a tipped trash bin.',
      'The emergency backup light at ' + loc + ' clicked softly as its battery finally gave out.',
      'I found an old employee mug in ' + loc + ' and used it to drink boiled water.',
      'I checked every corner and storage closet of ' + loc + ' to ensure no infected had breached.'
    );
  } else if (state.shelter.isEstablished) {
    const base = state.shelter.name;
    pool.push(
      'I inspected the perimeter defenses around ' + base + ' and re-nailed a loose plank.',
      'I climbed up to the rooftop of ' + base + ' to scan the surrounding avenues with binoculars.',
      'I inspected our rainwater collection barrels behind ' + base + ' to make sure the mesh filter was clean.',
      'I spent an hour checking the door deadbolts and window bracing at ' + base + '.',
      'Distant smoke rose from a warehouse three miles away, but ' + base + ' remained quiet.'
    );
  } else {
    pool.push(
      'I searched the glove compartment of a rusted-out station wagon parked along the curb.',
      'I ducked into the shadows of an alleyway while a cluster of infected drifted past.',
      'I checked the padlocks on a row of commercial roll-up shutters down the boulevard.',
      'An abandoned billboard creaked loudly overhead as the wind picked up.',
      'I navigated around a chain-reaction car pileup blocking the central intersection.'
    );
  }
  return pool;
}

// Companion routines
function getCompanionHappenings(state: GameState): string[] {
  if (state.campMembers.length === 0) return [];
  const comp = state.campMembers[Math.floor(Math.random() * state.campMembers.length)];
  return [
    'I took turns standing guard with ' + comp.name + ' during the quiet hours before dawn.',
    comp.name + ' and I shared a hot meal and talked about the jobs we had before the outbreak.',
    comp.name + ' helped reinforce the window barricades, checking every fastener.',
    'I heard ' + comp.name + ' softly humming an old tune while tending to camp supplies.'
  ];
}

// Master generator that picks non-repeating lines tailored to World Stage and Weather
export function generateDailyHappenings(state: GameState, currentDay: number, weather: WeatherType): string[] {
  const result: string[] = [];

  // Pick stage pool based on days survived
  let stagePool = STAGE_COLLAPSE_HAPPENINGS;
  if (currentDay > 60) stagePool = STAGE_WASTELAND_HAPPENINGS;
  else if (currentDay > 30) stagePool = STAGE_SCARCITY_HAPPENINGS;
  else if (currentDay > 7) stagePool = STAGE_SILENCE_HAPPENINGS;

  // Filter out lines already logged recently in state.logs to prevent repetition
  const recentTexts = state.logs.slice(-25).map(l => l.text);
  const freshStagePool = stagePool.filter(t => !recentTexts.includes(t));
  const chosenStagePool = freshStagePool.length > 0 ? freshStagePool : stagePool;

  result.push(chosenStagePool[Math.floor(Math.random() * chosenStagePool.length)]);

  // Second line: pick from weather or location/companion routines
  const weatherPool = WEATHER_HAPPENINGS[weather] || WEATHER_HAPPENINGS.clear;
  const locationPool = getLocationHappenings(state);
  const companionPool = getCompanionHappenings(state);

  const secondaryPool = [...weatherPool, ...locationPool, ...companionPool];
  const freshSecondary = secondaryPool.filter(t => !recentTexts.includes(t) && !result.includes(t));
  const chosenSecondary = freshSecondary.length > 0 ? freshSecondary : secondaryPool;

  result.push(chosenSecondary[Math.floor(Math.random() * chosenSecondary.length)]);

  return result;
}
