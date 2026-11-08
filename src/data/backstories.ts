import { SurvivorBackstory, Survivor, Career } from '../types/game';

// ============================================================================
// 1. HIGH SCHOOL STUDENT / YOUTH BACKSTORIES (Ages 16-17 or Student Career)
// Strictly high school life, school spawn, parents, siblings, pets, best friends!
// ZERO spouses, ZERO kids, ZERO workplace betrayals!
// ============================================================================
export const STUDENT_BACKSTORIES: SurvivorBackstory[] = [
  {
    id: 'student_dad_truck',
    theme: 'family',
    title: "Dad's Promised Pickup",
    targetName: 'Thomas',
    relation: 'Father',
    hookText: 'Dad promised he would be waiting outside the school gates in his blue pickup truck at 3 PM to take me home. He never showed up, and the street outside the school was overrun with infected. I know dad would never leave me stranded—something stopped his truck along the avenue.',
    searchGoal: "Search abandoned vehicles along the avenue near Costway Supermarket for Dad's blue truck.",
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      "I kept looking down at my watch. Dad always texted if he was even five minutes late.",
      "I remembered dad teaching me how to check the oil in his truck last month. I have to find him.",
      "Every blue truck I see down the avenue makes my chest tighten, hoping it is dad.",
      "Dad promised he would protect our family. I know he is fighting to reach this school."
    ]
  },
  {
    id: 'student_mom_pharmacy',
    theme: 'family',
    title: "Mom's Clinic Shift",
    targetName: 'Sarah',
    relation: 'Mother',
    hookText: 'Mom was working her morning shift at Mercy Memorial Pharmacy when the school lockdown sirens went off. Her final text message read: "Stay locked in the science lab, sweetheart. The hospital street is blocked, but I will find a way to reach you." I have to make it to the pharmacy.',
    searchGoal: "Search Mercy Memorial Pharmacy for Mom's employee records and notes.",
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      "I re-read mom's final text message on my phone before the battery dimmed.",
      "Mom worked sixty hours a week so I could have school supplies. I am going to reach her.",
      "I checked every medicine shelf I found, wondering if mom was safely barricaded inside.",
      "Mom always told me to be brave when storms hit. This is the worst storm of all."
    ]
  },
  {
    id: 'student_little_brother',
    theme: 'family',
    title: 'Little Brother at Middle School',
    targetName: 'Toby',
    relation: 'Younger Brother',
    hookText: 'My 11-year-old brother Toby was in class at the middle school two blocks away. When the sirens blared, fleeing students said the middle school classes were evacuated toward St. Michael Church sanctuary. I have to find Toby before night falls.',
    searchGoal: 'Check the civilian evacuee list at St. Michael Church for Toby.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      "I keep Toby's favorite action figure tucked inside my backpack. I promised I would walk him home.",
      "Toby is terrified of thunder, let alone monsters. I need to get to that church.",
      "I can still hear Toby laughing when we played video games last night before the world ended.",
      "I swore to our parents I would watch over my little brother. I will not fail him."
    ]
  },
  {
    id: 'student_dog_at_home',
    theme: 'pet',
    title: 'Rescue Dog Locked at Home',
    targetName: 'Buster',
    relation: 'Golden Retriever Pup',
    hookText: 'When I left for school this morning, our golden retriever Buster was locked inside our living room down the street. With the power dead and the neighborhood empty, he has no water and no way out. I have to fight my way back to our house.',
    searchGoal: 'Look for paw prints and listen for barking near Costway Supermarket.',
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      "I keep Buster's tennis ball in my hoodie pocket. He always waited at the front window for me.",
      "Buster would bark at the mail carrier, but he has no idea what these monsters are.",
      "I thought I heard a dog's bark echo over the rooftops, but it faded into the wind.",
      "I can feel Buster's leash in my backpack. I am going to bring him to safety."
    ]
  },
  {
    id: 'student_best_friend',
    theme: 'family',
    title: "Best Friend's Walkie-Talkie",
    targetName: 'Lucas',
    relation: 'High School Best Friend',
    hookText: 'When the fourth-period lockdown bell shrilled, my best friend Lucas ran for the athletic equipment cage. He tossed me a spare walkie-talkie through the door: "Keep Channel 4 open, I will call out from the station!" I have to find out if Lucas made it.',
    searchGoal: 'Scan radio frequencies and search the 3rd Precinct Station for Lucas.',
    targetLocationId: 'police_precinct',
    status: 'searching',
    journalThoughts: [
      "I tapped the walkie-talkie button three times, waiting for Lucas's signature reply.",
      "Lucas and I grew up on the same street. We promised we would graduate together.",
      "If anyone has the speed to outrun infected in a high school hallway, it is Lucas.",
      "I held onto the radio. Channel 4 is the only thread connecting me to my best friend."
    ]
  }
];

// ============================================================================
// 2. POLICE OFFICER BACKSTORIES
// Tactical duty, patrol partner, precinct evacuation, family waiting at home
// ============================================================================
export const POLICE_BACKSTORIES: SurvivorBackstory[] = [
  {
    id: 'police_squad_partner',
    theme: 'guilt',
    title: 'The Fallen Squad Partner',
    targetName: 'Miller',
    relation: 'Patrol Partner',
    hookText: 'My partner Miller radioed a frantic code 10-33 from the 3rd Precinct armory while I was trapped two blocks away clearing a civilian roadblock. He refused to abandon the weapons vault. I need to reach the precinct.',
    searchGoal: 'Breach the 3rd Precinct Station armory to find Officer Miller.',
    targetLocationId: 'police_precinct',
    status: 'searching',
    journalThoughts: [
      "Miller and I rode the night shift together for six years. I am not leaving him behind.",
      "I checked my badge in the mirror. Miller always told me the shield means something.",
      "I loaded my sidearm carefully, remembering Miller's advice on keeping a steady trigger finger."
    ]
  },
  {
    id: 'police_evac_family',
    theme: 'family',
    title: 'The Evacuation Convoy',
    targetName: 'Elena & Noah',
    relation: 'Spouse & 8-Year-Old Son',
    hookText: 'When martial law was declared, dispatch routed an evacuation bus carrying my spouse Elena and our 8-year-old son Noah toward the St. Michael Church sanctuary. I was ordered to stay on duty. Now duty is over, and I am finding my family.',
    searchGoal: 'Search the civilian evacuee manifest at St. Michael Church.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      "I carry a picture of Elena and Noah in my duty wallet. They are my only objective now.",
      "I swore an oath to protect the public, but my first duty is bringing my family home.",
      "Every mile of clear road brings me closer to seeing Noah's smile again."
    ]
  }
];

// ============================================================================
// 3. MEDICAL & PARAMEDIC BACKSTORIES
// Hospital triage, ambulance partner, medical spouse, patient rescue
// ============================================================================
export const MEDICAL_BACKSTORIES: SurvivorBackstory[] = [
  {
    id: 'paramedic_crew_partner',
    theme: 'guilt',
    title: 'The Ambulance Bay Ambush',
    targetName: 'David',
    relation: 'Paramedic Partner',
    hookText: 'My ambulance partner David was backing Unit 12 into the hospital sally port when infected flooded the emergency bay. He shoved me into the supply airlock and slammed the latch. I have to find out if David survived.',
    searchGoal: 'Search the Mercy Memorial Pharmacy and hospital ambulance bay.',
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      "David gave up his own escape route so I could lock down the medical vault.",
      "I checked my trauma shears and bandages, knowing David would expect perfection.",
      "David had twin girls at home. I owe it to his family to find out what happened."
    ]
  },
  {
    id: 'doctor_spouse_barge',
    theme: 'love',
    title: 'The River Haven Promise',
    targetName: 'Rachel',
    relation: 'Spouse & Nurse',
    hookText: 'My spouse Rachel was on duty downtown when the bridges were severed. We agreed on an emergency plan years ago: if society collapsed, we would rendezvous at the St. Michael Church sanctuary. I am holding her to that promise.',
    searchGoal: 'Check the sanctuary altar at St. Michael Church for Rachel.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      "Rachel always had a cooler head in trauma cases than I did. She is alive out there.",
      "I looked at our matching silver bands. We promised each other through sickness and health.",
      "Medicine gives us an edge against infection, but finding Rachel gives me the will to live."
    ]
  }
];

// ============================================================================
// 4. TRADES & LABOR BACKSTORIES (Carpenter, Mechanic, Firefighter, Builder)
// Workshop mentors, family waiting at home, tool caches
// ============================================================================
export const TRADES_BACKSTORIES: SurvivorBackstory[] = [
  {
    id: 'trades_shop_mentor',
    theme: 'guilt',
    title: 'The Sacrifice at Pioneer Lumber',
    targetName: 'Marcus',
    relation: 'Shop Boss & Mentor',
    hookText: 'My boss Marcus threw his shoulder into an infected horde so I could slam the heavy iron bolt on the safe room door. He was a stubborn old contractor who taught me everything I know. I need to check the lumber yard.',
    searchGoal: 'Search the workshop backlot at Pioneer Lumber & Hardware.',
    targetLocationId: 'hardware_store',
    status: 'searching',
    journalThoughts: [
      "Marcus taught me that a good craftsman never leaves a job unfinished.",
      "I swung my hammer into the doorframe, remembering Marcus's loud laugh on job sites.",
      "Marcus had thirty years of building experience. If anyone could hold out, it is him."
    ]
  },
  {
    id: 'trades_spouse_home',
    theme: 'love',
    title: 'The Family Brownstone',
    targetName: 'Hannah',
    relation: 'Spouse',
    hookText: 'I left for the morning job site with a thermos of coffee, promising Hannah I would be home for dinner. When sirens screamed, the bridges closed. I am gathering lumber, nails, and supplies to fortify a route back to her.',
    searchGoal: 'Gather supplies and check the church outpost for news of northern evacuees.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      "Hannah gave me this watch on our wedding day. Every second it ticks brings me closer.",
      "I built our front porch with my own hands. I will fight through whatever stands between us.",
      "The smell of sawdust reminds me of our kitchen table. I am coming home, Hannah."
    ]
  }
];

// ============================================================================
// 5. GENERAL ADULT BACKSTORIES (Ages 18-45)
// Spouses, young children, faithful dogs, elderly parents
// ============================================================================
export const ADULT_GENERAL_BACKSTORIES: SurvivorBackstory[] = [
  {
    id: 'adult_young_son',
    theme: 'family',
    title: 'The Daycare Evacuation',
    targetName: 'Leo',
    relation: '7-Year-Old Son',
    hookText: 'My 7-year-old son Leo was at his downtown daycare when the emergency sirens started. An alert stated children were escorted toward the St. Michael Church sanctuary. I have Leo\'s favorite toy dinosaur in my pocket.',
    searchGoal: 'Search the civilian registry at St. Michael Church for Leo.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      "I keep Leo's toy dinosaur in my chest pocket. It reminds me why I must survive.",
      "Leo is terrified of the dark. I have to reach him before the candles burn out.",
      "I will turn this city upside down with my bare hands to hold my boy again."
    ]
  },
  {
    id: 'adult_elderly_father',
    theme: 'family',
    title: "Father's Prescription",
    targetName: 'Arthur',
    relation: 'Elderly Father',
    hookText: 'My 68-year-old father Arthur stayed behind in his 4th Street apartment because his mobility was failing and his insulin was running low. I promised I would return with fresh medical supplies.',
    searchGoal: 'Search Mercy Memorial Pharmacy for Arthur\'s insulin.',
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      "Dad taught me that panic is the real killer. I kept my head down and stayed focused.",
      "I checked every medicine box, searching for the insulin brand dad relied on.",
      "Dad worked forty years to give me a future. I will survive for him."
    ]
  },
  {
    id: 'adult_faithful_hound',
    theme: 'pet',
    title: 'The Transit Depot Collar',
    targetName: 'Rusty',
    relation: 'Golden Shepherd Dog',
    hookText: 'My rescue dog Rusty bolted into the crowds when police flashbangs erupted outside the central depot on Day 0. I still keep his worn leather collar in my coat pocket, listening for his familiar bark.',
    searchGoal: 'Look for animal tracks and listen for barking near Costway Supermarket Depot.',
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      "I whistled our old two-tone whistle down the alley, desperately listening for a bark.",
      "Rusty got me through the hardest years of my life. I will not give up on him.",
      "The room feels twice as cold without Rusty sleeping across my feet."
    ]
  },
  {
    id: 'adult_mother_supermarket',
    theme: 'family',
    title: 'The Costway Register',
    targetName: 'Sarah',
    relation: 'Mother',
    hookText: 'My mother Sarah was working the morning register at the Costway depot when the steel riot shutters crashed down. She raised me alone; I will not leave her behind in the dark.',
    searchGoal: 'Search the employee breakroom and office at Costway Supermarket Depot.',
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      "Mom survived tough times before the outbreak. A city of infected will not defeat her.",
      "I kept mom's handwritten note in my wallet; her handwriting is neat and patient.",
      "I will clear every aisle of that supermarket if that is what it takes to find mom."
    ]
  }
];

// ============================================================================
// 6. SENIOR & MATURE ADULT BACKSTORIES (Age 46+)
// Grown adult children, longtime spouses, grandchildren
// ============================================================================
export const SENIOR_BACKSTORIES: SurvivorBackstory[] = [
  {
    id: 'senior_grown_daughter',
    theme: 'family',
    title: "Grown Daughter's Apartment",
    targetName: 'Maya',
    relation: 'Adult Daughter',
    hookText: 'My adult daughter Maya was working downtown as an architect when the bridges were severed. Her last voicemail said she was sheltering near the hospital district with three colleagues.',
    searchGoal: 'Search the Mercy Memorial Pharmacy district for Maya.',
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      "I taught Maya how to ride a bike on these very streets decades ago.",
      "My joints ache in the cold, but finding Maya gives me the strength of a younger person.",
      "A parent never stops worrying about their child, no matter how old they are."
    ]
  },
  {
    id: 'senior_longtime_spouse',
    theme: 'love',
    title: 'Forty Years Together',
    targetName: 'Martha',
    relation: 'Longtime Spouse',
    hookText: 'Martha and I celebrated forty years of marriage just two months before the world ended. When the neighborhood evacuated, we got separated at the church checkpoint. I am going to find her.',
    searchGoal: 'Search the St. Michael Church sanctuary for Martha.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      "Martha and I weathered recessions, illnesses, and grief. We will weather this.",
      "I held Martha's knitted scarf to my face, taking comfort in the familiar scent.",
      "The world has collapsed, but my love for Martha remains completely intact."
    ]
  }
];

// ============================================================================
// CONTEXTUAL BACKSTORY SELECTOR
// Evaluates Age and Career to pick a 100% logically coherent backstory!
// ============================================================================
export function getContextualBackstory(survivor: Survivor, career: Career): SurvivorBackstory {
  // 1. High School Student / Youth under 18: STRICTLY Student backstories!
  if (survivor.age < 18 || career.id === 'student') {
    const idx = Math.floor(Math.random() * STUDENT_BACKSTORIES.length);
    return { ...STUDENT_BACKSTORIES[idx] };
  }

  // 2. Police Officers
  if (career.id === 'police') {
    const idx = Math.floor(Math.random() * POLICE_BACKSTORIES.length);
    return { ...POLICE_BACKSTORIES[idx] };
  }

  // 3. Medical Staff (Paramedic, Surgeon, Doctor)
  if (career.id === 'paramedic' || career.id === 'surgeon') {
    const idx = Math.floor(Math.random() * MEDICAL_BACKSTORIES.length);
    return { ...MEDICAL_BACKSTORIES[idx] };
  }

  // 4. Construction / Trades (Carpenter, Mechanic, Firefighter)
  if (career.id === 'carpenter' || career.id === 'mechanic' || career.id === 'firefighter') {
    const idx = Math.floor(Math.random() * TRADES_BACKSTORIES.length);
    return { ...TRADES_BACKSTORIES[idx] };
  }

  // 5. Older Adults / Seniors (Age 46+)
  if (survivor.age >= 46) {
    const idx = Math.floor(Math.random() * SENIOR_BACKSTORIES.length);
    return { ...SENIOR_BACKSTORIES[idx] };
  }

  // 6. General Adults (Age 18 - 45)
  const idx = Math.floor(Math.random() * ADULT_GENERAL_BACKSTORIES.length);
  return { ...ADULT_GENERAL_BACKSTORIES[idx] };
}
