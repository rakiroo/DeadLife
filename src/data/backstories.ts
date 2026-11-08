import { SurvivorBackstory } from '../types/game';

export const SURVIVOR_BACKSTORIES: SurvivorBackstory[] = [
  // 1. Sister Chloe
  {
    id: 'sister_chloe',
    theme: 'family',
    title: 'The Sister\'s Backpack',
    targetName: 'Chloe',
    relation: 'Younger Sister',
    hookText: 'Before cell towers died on Day 0, my 16-year-old sister Chloe left a panicked voicemail: "I escaped school with my blue backpack. Heading toward the church shelter." I promised our mother I would protect her.',
    searchGoal: 'Look for traces of Chloe near St. Michael Church or Mercy Pharmacy.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      'I checked my chest pocket to make sure Chloe\'s school photo was still dry. I will not stop searching.',
      'I thought I heard Chloe\'s laugh down the corridor, but it was only wind whistling through a shattered vent.',
      'I carved Chloe\'s initials beside mine into the wooden doorframe.',
      'I promised mom I would bring Chloe home safely. That promise keeps my boots moving.'
    ]
  },

  // 2. Father Arthur
  {
    id: 'father_arthur',
    theme: 'family',
    title: 'The Father\'s Insulin Prescription',
    targetName: 'Arthur',
    relation: 'Elderly Father',
    hookText: 'My 68-year-old father Arthur refused to evacuate his brownstone apartment on 4th Street because his mobility was failing and his insulin was running low. I promised I would return with fresh medical supplies.',
    searchGoal: 'Search Mercy Memorial Pharmacy for Arthur\'s medical records and insulin.',
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      'I remembered dad\'s slow, steady voice telling me that panic is the real killer. I kept calm.',
      'I checked every medicine box I found, hoping to locate the exact brand of insulin dad needed.',
      'Dad worked forty years in the rail yards without complaining once. I will survive for him.',
      'I looked at dad\'s old brass pocket watch; its ticking is the only familiar sound left in this world.'
    ]
  },

  // 3. Rescue Dog Rusty
  {
    id: 'dog_rusty',
    theme: 'pet',
    title: 'The Golden Shepherd Collar',
    targetName: 'Rusty',
    relation: 'Rescue Dog',
    hookText: 'My golden shepherd dog Rusty bolted into the crowds when police flashbangs erupted outside the central transit depot on Day 0. I still keep his worn leather collar in my coat pocket, listening for his familiar bark.',
    searchGoal: 'Listen for barking or animal tracks near Costway Supermarket Depot.',
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      'I whistled our old two-tone whistle down the empty alleyway, desperately listening for a response.',
      'I ran my fingers over Rusty\'s metal rabies tag. He got me through the hardest years before the outbreak.',
      'I thought I saw a golden tail flash behind a dumpster, but it was only blowing garbage.',
      'Rusty used to sleep across my feet on winter nights. The room feels twice as cold without him.'
    ]
  },

  // 4. Spouse Elena
  {
    id: 'partner_elena',
    theme: 'love',
    title: 'The Highway Rendezvous',
    targetName: 'Elena',
    relation: 'Spouse',
    hookText: 'Elena and I were separated when traffic gridlocked on the interstate. She squeezed my hand and swore on her wedding ring: "Meet me at the 3rd Precinct station if things fall apart." I am holding her to that promise.',
    searchGoal: 'Search the 3rd Precinct Station for Elena\'s message on the evac board.',
    targetLocationId: 'police_precinct',
    status: 'searching',
    journalThoughts: [
      'I touched the silver band on my finger. Elena is out there somewhere, doing whatever it takes to survive.',
      'I remembered Elena\'s smile on our last anniversary dinner before the sirens began.',
      'Every time I see a green canvas jacket in the distance, my heart stops for a second hoping it is Elena.',
      'Elena always had better aim than me. If anyone can hold off the infected, it is her.'
    ]
  },

  // 5. Twin Brother David
  {
    id: 'brother_david',
    theme: 'family',
    title: 'The Ambulance Paramedic',
    targetName: 'David',
    relation: 'Twin Brother',
    hookText: 'My twin brother David was on ambulance duty when the first wave hit the ER bay. His radio unit broadcast an emergency code 10-33 before cutting out completely. I know he would never abandon his crew.',
    searchGoal: 'Investigate the ambulance bay at Mercy Memorial Pharmacy.',
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      'David and I shared everything growing up. I can feel in my gut that he is still breathing.',
      'I checked the paramedic triage logs on a clipboard, looking for David\'s badge number.',
      'David was always the braver twin, the one who rushed into burning buildings while I hesitated.',
      'I kept two surgical scalpels tucked in my boot, knowing David would lecture me on sterilization.'
    ]
  },

  // 6. Traitor Vincent
  {
    id: 'rival_vincent',
    theme: 'rival',
    title: 'A Debt of Betrayal',
    targetName: 'Vincent',
    relation: 'Former Partner & Traitor',
    hookText: 'When the sirens blared on Day 0, my business partner Vincent padlocked me inside our tool basement and drove off with our entire emergency cache of food and cash. I kicked the door down hours later, swearing I would track him down.',
    searchGoal: 'Track Vincent\'s stolen supply truck near Pioneer Lumber & Hardware.',
    targetLocationId: 'hardware_store',
    status: 'searching',
    journalThoughts: [
      'I checked the heavy hammer in my grip, remembering Vincent\'s sneer as he padlocked the cellar.',
      'Vincent thought I would die in that basement. He underestimated my will to live.',
      'I saw tire tracks matching Vincent\'s heavy dual-cab truck in the gravel down the avenue.',
      'The world ended, but debts do not expire. I will look Vincent in the eye before this is over.'
    ]
  },

  // 7. Daughter Maya
  {
    id: 'daughter_maya',
    theme: 'family',
    title: 'The College Dorm Message',
    targetName: 'Maya',
    relation: 'College Daughter',
    hookText: 'My 19-year-old daughter Maya was staying in the university science dorms downtown. Her last text message read: "Doors are barred. We have water, but infected are pounding outside." I have to reach her.',
    searchGoal: 'Look for student evacuation records near St. Michael Church.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      'Maya has her mother\'s stubbornness. She will hold that dorm room until her last breath.',
      'I found a college lanyard in the street with student keys; my breath caught until I saw the name tag.',
      'I taught Maya how to shoot a target rifle when she was twelve. I hope she remembers her stance.',
      'Every quiet sunset makes me wonder if Maya is looking up at the same purple sky.'
    ]
  },

  // 8. Young Son Leo
  {
    id: 'son_leo',
    theme: 'family',
    title: 'The Museum Field Trip',
    targetName: 'Leo',
    relation: '10-Year-Old Son',
    hookText: 'My 10-year-old son Leo was on a museum field trip when the emergency alert buzzed on every phone. A museum docent said children were escorted toward the downtown church sanctuary.',
    searchGoal: 'Check the civilian registry at St. Michael Church for Leo.',
    targetLocationId: 'survivor_outpost',
    status: 'searching',
    journalThoughts: [
      'I keep Leo\'s favorite toy dinosaur in my jacket pocket. It reminds me why I am fighting to breathe.',
      'I remembered Leo asking if monsters were real three days before the world fell apart.',
      'Leo is terrified of the dark. I have to find him before the candles burn out.',
      'I will turn this city upside down with my bare hands until I hold my boy again.'
    ]
  },

  // 9. Mother Sarah
  {
    id: 'mother_sarah',
    theme: 'family',
    title: 'The Cashier at Costway',
    targetName: 'Sarah',
    relation: 'Mother',
    hookText: 'My mother Sarah was working the morning register at the Costway depot when the steel riot shutters crashed down. She raised me alone through lean times; I will not leave her behind in the dark.',
    searchGoal: 'Check the employee breakroom and office safe at Costway Supermarket Depot.',
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      'Mom survived cancer twice. A city full of rotting corpses is not going to stop her.',
      'I remembered mom\'s Sunday dinners. The memory makes cold canned beans taste like gravel.',
      'I kept mom\'s recipe card tucked inside my wallet; her handwriting is neat and patient.',
      'I will clear every aisle of that supermarket if that is what it takes to find mom.'
    ]
  },

  // 10. Mentor Marcus
  {
    id: 'mentor_marcus',
    theme: 'guilt',
    title: 'The Sacrifice at Pioneer Lumber',
    targetName: 'Marcus',
    relation: 'Shop Boss & Mentor',
    hookText: 'My boss Marcus shoved me into the safe room and took the brunt of an infected tackle so I could drop the heavy iron bolt. I owe him my life and need to know if he survived the night.',
    searchGoal: 'Check the workshop backlot at Pioneer Lumber & Hardware.',
    targetLocationId: 'hardware_store',
    status: 'searching',
    journalThoughts: [
      'Marcus taught me how to frame a roof and swing a hammer without blunting the head.',
      'I can still hear the heavy thud of Marcus\'s shoulder slamming the door shut to protect me.',
      'Marcus was a stubborn old contractor. If anyone could survive that courtyard, it is him.',
      'I keep my tools clean and organized, just the way Marcus demanded on job sites.'
    ]
  },

  // 11. Terrier Pup Barnaby
  {
    id: 'pup_barnaby',
    theme: 'pet',
    title: 'The Slipped Leash',
    targetName: 'Barnaby',
    relation: 'Scruffy Terrier Pup',
    hookText: 'I adopted Barnaby from the shelter only two days before society collapsed. When the air raid sirens screamed, he slipped his collar in terror. I still carry a yellow tennis ball in my pocket.',
    searchGoal: 'Search the parking lot and pet aisle at Costway Supermarket.',
    targetLocationId: 'supermarket',
    status: 'searching',
    journalThoughts: [
      'I squeezed the rubber tennis ball in my pocket, listening for tiny scurrying paws.',
      'Barnaby had huge floppy ears and trusted me immediately at the shelter. I cannot abandon him.',
      'I thought I heard a frantic scratching at a low cellar grate, but found only wind.',
      'If a scruffy little terrier can survive the apocalypse, so can I.'
    ]
  },

  // 12. Childhood Friend Lucas
  {
    id: 'friend_lucas',
    theme: 'family',
    title: 'The Police Armory Signal',
    targetName: 'Lucas',
    relation: 'Childhood Best Friend',
    hookText: 'Lucas and I set up two-way radio channels every summer since we were twelve. On Day 0, he called out on Channel 4: "I am taking cover in the precinct armory!" before his frequency cut off.',
    searchGoal: 'Breach the armory lockup at the 3rd Precinct Station.',
    targetLocationId: 'police_precinct',
    status: 'searching',
    journalThoughts: [
      'Lucas always talked his way out of trouble in high school. I hope his tongue works on the living.',
      'I clicked my radio transmitter to Channel 4 three times, waiting for his signature double click.',
      'Lucas and I swore we would survive whatever the world threw at us. We are not done yet.',
      'I found an old comic book Lucas lent me last summer. It feels like a relic from another world.'
    ]
  },

  // 13. Sister Grace
  {
    id: 'sister_grace',
    theme: 'family',
    title: 'The Maternity Annex',
    targetName: 'Grace',
    relation: 'Pregnant Older Sister',
    hookText: 'Grace was admitted to Mercy Memorial Hospital on Day 0 for maternity monitoring. When the building went dark, nurses said patients were moved to the basement surgical annex.',
    searchGoal: 'Search the basement surgical annex at Mercy Memorial Pharmacy.',
    targetLocationId: 'pharmacy',
    status: 'searching',
    journalThoughts: [
      'Grace was due in three weeks. The thought of bringing a child into this world terrifies me.',
      'I checked baby blankets on hospital shelves, wondering if Grace ever held her newborn.',
      'Grace practically raised me when our parents were working night shifts. I will protect her.',
      'I found an ultrasound printout in an abandoned medical folder and thought of Grace.'
    ]
  },

  // 14. Raider Rex
  {
    id: 'gang_leader_rex',
    theme: 'rival',
    title: 'The Marked Jacket',
    targetName: 'Rex',
    relation: 'Raider Marauder',
    hookText: 'A ruthless looter named Rex shot my neighbor through our apartment door and stole our emergency generator on Day 0. I memorized his face, his spiked leather jacket, and the scar across his brow.',
    searchGoal: 'Look for Rex\'s raider crew markings near the 3rd Precinct Station.',
    targetLocationId: 'police_precinct',
    status: 'searching',
    journalThoughts: [
      'Rex thought society crumbling meant laws of consequence died with it. He was wrong.',
      'I saw a spray-painted skull emblem matching Rex\'s jacket on an overpass pillar.',
      'I loaded three heavy shells into my weapon, keeping Rex\'s scarred face in mind.',
      'The city is lawless, but justice still has a place in the ruins.'
    ]
  },

  // 15. Uncle Thomas
  {
    id: 'mechanic_thomas',
    theme: 'family',
    title: 'The Master Mechanic\'s Vault',
    targetName: 'Thomas',
    relation: 'Uncle & Master Mechanic',
    hookText: 'My uncle Thomas was fixing utility vehicles at the hardware depot when the outbreak surged. He always had a hidden floorboard survival cache beneath his hydraulic lift.',
    searchGoal: 'Search the heavy workbench and tool storage at Pioneer Lumber & Hardware.',
    targetLocationId: 'hardware_store',
    status: 'searching',
    journalThoughts: [
      'Uncle Thomas could rebuild an entire diesel engine with a wrench and a pair of pliers.',
      'I remembered Thomas laughing as he handed me my first toolset on my fourteenth birthday.',
      'Thomas knew how to fortify structures better than anyone. If his cache is intact, it could save me.',
      'I checked hydraulic lift levers in garages, looking for Thomas\'s signature welded marks.'
    ]
  }
];

export function getRandomBackstory(): SurvivorBackstory {
  const idx = Math.floor(Math.random() * SURVIVOR_BACKSTORIES.length);
  return { ...SURVIVOR_BACKSTORIES[idx] };
}
