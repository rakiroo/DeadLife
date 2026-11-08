import { SurvivorBackstory, Survivor, Career } from '../types/game';

// Procedural First Name Pools for Dynamic Generation
export const NAME_POOLS = {
  father: ['Arthur', 'Thomas', 'David', 'Robert', 'William', 'Richard', 'Henry', 'Edward', 'Charles', 'George', 'Frank', 'Walter'],
  mother: ['Sarah', 'Martha', 'Elena', 'Claire', 'Rebecca', 'Laura', 'Susan', 'Mary', 'Judith', 'Catherine', 'Diane', 'Grace'],
  brother: ['Toby', 'Lucas', 'Liam', 'Noah', 'Ethan', 'Sam', 'Julian', 'Oliver', 'Caleb', 'Eli', 'Leo', 'Owen', 'Mason'],
  sister: ['Chloe', 'Maya', 'Zoe', 'Hannah', 'Emily', 'Grace', 'Mia', 'Lily', 'Olivia', 'Sophia', 'Ava', 'Ruby', 'Ella'],
  son: ['Leo', 'Toby', 'Max', 'Finn', 'Eli', 'Oliver', 'Ben', 'Jack', 'Luke', 'Charlie', 'Sam', 'Noah'],
  daughter: ['Maya', 'Chloe', 'Lily', 'Ella', 'Zoe', 'Emma', 'Ava', 'Ruby', 'Isla', 'Mia', 'Grace', 'Sophia'],
  male_spouse: ['Marcus', 'David', 'Thomas', 'Julian', 'Robert', 'Liam', 'Lucas', 'Ethan', 'James', 'Daniel', 'Alex', 'Nathan'],
  female_spouse: ['Elena', 'Hannah', 'Rachel', 'Sarah', 'Claire', 'Grace', 'Maya', 'Emily', 'Anna', 'Jessica', 'Sophie', 'Laura'],
  dog: ['Rusty', 'Buster', 'Barnaby', 'Cooper', 'Duke', 'Bandit', 'Scout', 'Milo', 'Shadow', 'Max', 'Bailey', 'Rocky'],
  male_friend: ['Lucas', 'Sam', 'Liam', 'Noah', 'Julian', 'Ethan', 'Tyler', 'Marcus', 'Caleb', 'Jack', 'Connor', 'Dylan'],
  female_friend: ['Chloe', 'Zoe', 'Hannah', 'Maya', 'Emily', 'Grace', 'Lily', 'Sophie', 'Emma', 'Olivia', 'Chloe', 'Mia'],
  mentor: ['Marcus', 'Thomas', 'Arthur', 'Hank', 'Walter', 'Gordon', 'Robert', 'Frank', 'Victor', 'Donovan'],
  rival: ['Vincent', 'Rex', 'Damian', 'Victor', 'Kane', 'Maddox', 'Garrett', 'Vance', 'Briggs', 'Slade', 'Colt', 'Ryker']
};

interface BackstoryTemplate {
  id: string;
  theme: 'family' | 'pet' | 'rival' | 'love' | 'guilt';
  nameKey: keyof typeof NAME_POOLS;
  relation: string;
  title: string;
  hookText: string;
  searchGoal: string;
  targetLocationId: string;
  journalThoughts: string[];
}

// 1. HIGH SCHOOL STUDENT / YOUTH TEMPLATES (Ages 16-17)
const STUDENT_TEMPLATES: BackstoryTemplate[] = [
  {
    id: 'student_dad_truck',
    theme: 'family',
    nameKey: 'father',
    relation: 'Father',
    title: "Dad's Promised Pickup",
    hookText: 'Dad promised he would be waiting outside the school gates in his blue pickup truck at 3 PM to take me home. He never showed up, and the street outside the school was overrun with infected. I know Dad would never leave me stranded—something stopped his truck along the avenue.',
    searchGoal: "Search abandoned vehicles along the avenue near Costway Supermarket for Dad's blue truck.",
    targetLocationId: 'supermarket',
    journalThoughts: [
      "I kept looking down at my watch. Dad always texted if he was even five minutes late.",
      "I remembered Dad teaching me how to check the oil in his truck. I have to find him.",
      "Every blue pickup truck I see down the avenue makes my chest tighten, hoping it is Dad.",
      "Dad promised he would protect our family. I know he is fighting to reach me."
    ]
  },
  {
    id: 'student_mom_pharmacy',
    theme: 'family',
    nameKey: 'mother',
    relation: 'Mother',
    title: "Mom's Clinic Shift",
    hookText: 'Mom was working her morning shift at Mercy Memorial Pharmacy when the school lockdown sirens went off. Her final text message read: "Stay locked in the science lab, sweetheart. The hospital street is blocked, but I will find a way to reach you." I have to make it to the pharmacy.',
    searchGoal: "Search Mercy Memorial Pharmacy for Mom's employee records and notes.",
    targetLocationId: 'pharmacy',
    journalThoughts: [
      "I re-read Mom's final text message on my phone before the battery dimmed.",
      "Mom worked sixty hours a week so I could have school supplies. I am going to reach her.",
      "I checked every medicine shelf I found, wondering if Mom was safely barricaded inside.",
      "Mom always told me to be brave when storms hit. This is the worst storm of all."
    ]
  },
  {
    id: 'student_little_brother',
    theme: 'family',
    nameKey: 'brother',
    relation: 'Younger Brother',
    title: 'Little Brother {NAME} at Middle School',
    hookText: 'My 11-year-old brother {NAME} was in class at the middle school two blocks away. When the sirens blared, fleeing students said the middle school classes were evacuated toward St. Michael Church sanctuary. I have to find {NAME} before night falls.',
    searchGoal: "Check the civilian evacuee list at St. Michael Church for {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "I keep {NAME}'s favorite action figure tucked inside my backpack. I promised I would walk him home.",
      "{NAME} is terrified of thunder, let alone monsters. I need to get to that church.",
      "I can still hear {NAME} laughing when we played games last night before the world ended.",
      "I swore to our parents I would watch over {NAME}. I will not fail him."
    ]
  },
  {
    id: 'student_dog_at_home',
    theme: 'pet',
    nameKey: 'dog',
    relation: 'Golden Retriever Pup',
    title: 'Rescue Dog {NAME} Locked at Home',
    hookText: 'When I left for school this morning, our golden retriever {NAME} was locked inside our living room down the street. With the power dead and the neighborhood empty, he has no water and no way out. I have to fight my way back to our house.',
    searchGoal: "Look for paw prints and listen for barking near Costway Supermarket for {NAME}.",
    targetLocationId: 'supermarket',
    journalThoughts: [
      "I keep {NAME}'s tennis ball in my hoodie pocket. He always waited at the front window for me.",
      "{NAME} would bark at the mail carrier, but he has no idea what these monsters are.",
      "I thought I heard {NAME}'s bark echo over the rooftops, but it faded into the wind.",
      "I can feel {NAME}'s leash in my backpack. I am going to bring him to safety."
    ]
  },
  {
    id: 'student_best_friend',
    theme: 'family',
    nameKey: 'male_friend',
    relation: 'High School Best Friend',
    title: "Best Friend {NAME}'s Walkie-Talkie",
    hookText: 'When the fourth-period lockdown bell shrilled, my best friend {NAME} ran for the athletic equipment cage. He tossed me a spare walkie-talkie through the door: "Keep Channel 4 open, I will call out from the station!" I have to find out if {NAME} made it.',
    searchGoal: "Scan radio frequencies and search the 3rd Precinct Station for {NAME}.",
    targetLocationId: 'police_precinct',
    journalThoughts: [
      "I tapped the walkie-talkie button three times, waiting for {NAME}'s signature reply.",
      "{NAME} and I grew up on the same street. We promised we would graduate together.",
      "If anyone has the speed to outrun infected in a high school hallway, it is {NAME}.",
      "I held onto the radio. Channel 4 is the only thread connecting me to {NAME}."
    ]
  },
  {
    id: 'student_sister',
    theme: 'family',
    nameKey: 'sister',
    relation: 'Sister',
    title: "Sister {NAME}'s Backpack",
    hookText: 'My sister {NAME} was walking to her art class downtown when the emergency sirens started. She texted that she ducked inside the church sanctuary with several classmates. I have to make sure {NAME} is safe.',
    searchGoal: "Search St. Michael Church sanctuary for {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "I checked my backpack to make sure {NAME}'s sketchpad was safe.",
      "{NAME} was always creative, drawing quiet landscapes. I hope she is safe.",
      "I promised mom I would look out for {NAME}. I will reach that sanctuary."
    ]
  }
];

// 2. POLICE OFFICER TEMPLATES
const POLICE_TEMPLATES: BackstoryTemplate[] = [
  {
    id: 'police_squad_partner',
    theme: 'guilt',
    nameKey: 'male_friend',
    relation: 'Patrol Partner',
    title: 'The Fallen Partner {NAME}',
    hookText: 'My partner {NAME} radioed a frantic code 10-33 from the 3rd Precinct armory while I was trapped two blocks away clearing a civilian roadblock. He refused to abandon the weapons vault. I need to reach the precinct.',
    searchGoal: "Breach the 3rd Precinct Station armory to find Officer {NAME}.",
    targetLocationId: 'police_precinct',
    journalThoughts: [
      "{NAME} and I rode the night shift together for years. I am not leaving him behind.",
      "I checked my badge in the mirror. {NAME} always told me the shield means something.",
      "I loaded my sidearm carefully, remembering {NAME}'s advice on keeping a steady trigger finger."
    ]
  },
  {
    id: 'police_evac_family',
    theme: 'family',
    nameKey: 'female_spouse',
    relation: 'Spouse',
    title: "The Evacuation Convoy: {NAME}",
    hookText: 'When martial law was declared, dispatch routed an evacuation convoy carrying my spouse {NAME} toward St. Michael Church sanctuary. I was ordered to stay on post. Now duty has fallen apart, and I am finding {NAME}.',
    searchGoal: "Search the civilian evacuee manifest at St. Michael Church for {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "I carry a picture of {NAME} in my duty wallet. She is my only mission now.",
      "I swore an oath to protect the city, but my first duty is bringing {NAME} home.",
      "Every mile of cleared road brings me closer to seeing {NAME} again."
    ]
  }
];

// 3. MEDICAL & PARAMEDIC TEMPLATES
const MEDICAL_TEMPLATES: BackstoryTemplate[] = [
  {
    id: 'paramedic_crew_partner',
    theme: 'guilt',
    nameKey: 'male_friend',
    relation: 'Paramedic Partner',
    title: 'The Ambulance Bay Ambush: {NAME}',
    hookText: 'My ambulance partner {NAME} was backing Unit 12 into the hospital sally port when infected swarmed the emergency bay. He shoved me into the supply airlock and slammed the latch. I have to find out if {NAME} survived.',
    searchGoal: "Search Mercy Memorial Pharmacy and the ambulance bay for {NAME}.",
    targetLocationId: 'pharmacy',
    journalThoughts: [
      "{NAME} gave up his own escape route so I could lock down the medical vault.",
      "I checked my trauma shears and bandages, knowing {NAME} would expect perfection.",
      "{NAME} had family at home. I owe it to them to find out what happened."
    ]
  },
  {
    id: 'doctor_spouse_barge',
    theme: 'love',
    nameKey: 'female_spouse',
    relation: 'Spouse & Nurse',
    title: "The River Haven Promise: {NAME}",
    hookText: 'My spouse {NAME} was on duty downtown when the bridges were severed. We agreed on an emergency plan years ago: if society collapsed, we would rendezvous at St. Michael Church sanctuary. I am holding her to that promise.',
    searchGoal: "Check the sanctuary altar at St. Michael Church for {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "{NAME} always had a cooler head in trauma cases than I did. She is alive out there.",
      "I looked at our matching silver bands. We promised through sickness and health.",
      "Medicine gives us an edge, but finding {NAME} gives me the will to live."
    ]
  }
];

// 4. TRADES & LABOR TEMPLATES (Carpenter, Mechanic, Firefighter)
const TRADES_TEMPLATES: BackstoryTemplate[] = [
  {
    id: 'trades_shop_mentor',
    theme: 'guilt',
    nameKey: 'mentor',
    relation: 'Shop Boss & Mentor',
    title: 'The Sacrifice of {NAME}',
    hookText: 'My boss {NAME} threw his shoulder into an infected horde so I could slam the heavy iron bolt on the safe room door. He was a stubborn old contractor who taught me everything I know. I need to check the lumber yard.',
    searchGoal: "Search the workshop backlot at Pioneer Lumber & Hardware for {NAME}.",
    targetLocationId: 'hardware_store',
    journalThoughts: [
      "{NAME} taught me that a good craftsman never leaves a job unfinished.",
      "I swung my hammer into the doorframe, remembering {NAME}'s loud laugh on job sites.",
      "{NAME} had thirty years of building experience. If anyone could hold out, it is him."
    ]
  },
  {
    id: 'trades_spouse_home',
    theme: 'love',
    nameKey: 'female_spouse',
    relation: 'Spouse',
    title: 'The Promise to {NAME}',
    hookText: 'I left for the morning job site promising {NAME} I would be home for dinner. When sirens screamed, the bridges closed. I am gathering lumber, nails, and supplies to fortify a route back to her.',
    searchGoal: "Gather supplies and check the church outpost for news of {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "{NAME} gave me this watch on our wedding day. Every second it ticks brings me closer.",
      "I built our front porch with my own hands. I will fight through whatever stands between us.",
      "The smell of sawdust reminds me of our kitchen table. I am coming home to {NAME}."
    ]
  }
];

// 5. GENERAL ADULT TEMPLATES (Ages 18-45)
const ADULT_GENERAL_TEMPLATES: BackstoryTemplate[] = [
  {
    id: 'adult_young_son',
    theme: 'family',
    nameKey: 'son',
    relation: 'Young Son',
    title: "Searching for Young {NAME}",
    hookText: 'My young son {NAME} was at his downtown daycare when the emergency sirens started. An alert stated children were escorted toward the St. Michael Church sanctuary. I have {NAME}\'s favorite toy dinosaur in my pocket.',
    searchGoal: "Search the civilian registry at St. Michael Church for {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "I keep {NAME}'s toy dinosaur in my chest pocket. It reminds me why I must survive.",
      "{NAME} is terrified of the dark. I have to reach him before the candles burn out.",
      "I will turn this city upside down with my bare hands to hold {NAME} again."
    ]
  },
  {
    id: 'adult_elderly_father',
    theme: 'family',
    nameKey: 'father',
    relation: 'Elderly Father',
    title: "Father's Prescription",
    hookText: 'My father stayed behind in his 4th Street apartment because his mobility was failing and his insulin was running low. I promised I would return with fresh medical supplies.',
    searchGoal: "Search Mercy Memorial Pharmacy for Dad's insulin.",
    targetLocationId: 'pharmacy',
    journalThoughts: [
      "Dad taught me that panic is the real killer. I kept my head down and stayed focused.",
      "I checked every medicine box, searching for the insulin brand Dad relied on.",
      "Dad worked forty years to give me a future. I will survive for him."
    ]
  },
  {
    id: 'adult_faithful_hound',
    theme: 'pet',
    nameKey: 'dog',
    relation: 'Golden Shepherd Dog',
    title: "The Transit Collar: {NAME}",
    hookText: 'My rescue dog {NAME} bolted into the crowds when police flashbangs erupted outside the central depot on Day 0. I still keep his worn leather collar in my coat pocket, listening for his familiar bark.',
    searchGoal: "Look for animal tracks and listen for barking near Costway Supermarket Depot for {NAME}.",
    targetLocationId: 'supermarket',
    journalThoughts: [
      "I whistled our old two-tone whistle down the alley, desperately listening for {NAME}.",
      "{NAME} got me through the hardest years of my life. I will not give up on him.",
      "The room feels twice as cold without {NAME} sleeping across my feet."
    ]
  },
  {
    id: 'adult_mother_supermarket',
    theme: 'family',
    nameKey: 'mother',
    relation: 'Mother',
    title: "Mother at Costway",
    hookText: 'My mother was working the morning register at the Costway depot when the steel riot shutters crashed down. She raised me alone; I will not leave her behind in the dark.',
    searchGoal: "Search the employee breakroom and office at Costway Supermarket Depot for Mom.",
    targetLocationId: 'supermarket',
    journalThoughts: [
      "Mom survived tough times before the outbreak. A city of infected will not defeat her.",
      "I kept Mom's handwritten note in my wallet; her handwriting is neat and patient.",
      "I will clear every aisle of that supermarket if that is what it takes to find Mom."
    ]
  },
  {
    id: 'adult_traitor_rival',
    theme: 'rival',
    nameKey: 'rival',
    relation: 'Former Partner & Traitor',
    title: "A Debt of Betrayal: {NAME}",
    hookText: 'When the sirens blared on Day 0, my business colleague {NAME} padlocked me inside our tool basement and drove off with our entire emergency cache of food and gear. I kicked the door down hours later, swearing I would track him down.',
    searchGoal: "Track {NAME}'s stolen supply truck near Pioneer Lumber & Hardware.",
    targetLocationId: 'hardware_store',
    journalThoughts: [
      "I checked the heavy hammer in my grip, remembering {NAME}'s sneer as he padlocked the cellar.",
      "{NAME} thought I would die in that basement. He underestimated my will to live.",
      "I saw tire tracks matching {NAME}'s heavy truck in the gravel down the avenue."
    ]
  }
];

// 6. SENIOR & MATURE ADULT TEMPLATES (Age 46+)
const SENIOR_TEMPLATES: BackstoryTemplate[] = [
  {
    id: 'senior_grown_daughter',
    theme: 'family',
    nameKey: 'daughter',
    relation: 'Adult Daughter',
    title: "Grown Daughter {NAME}",
    hookText: 'My adult daughter {NAME} was working downtown as an architect when the bridges were severed. Her last voicemail said she was sheltering near the hospital district with three colleagues.',
    searchGoal: "Search the Mercy Memorial Pharmacy district for {NAME}.",
    targetLocationId: 'pharmacy',
    journalThoughts: [
      "I taught {NAME} how to ride a bike on these very streets decades ago.",
      "My joints ache in the cold, but finding {NAME} gives me the strength of a younger person.",
      "A parent never stops worrying about their child, no matter how old they are."
    ]
  },
  {
    id: 'senior_longtime_spouse',
    theme: 'love',
    nameKey: 'female_spouse',
    relation: 'Longtime Spouse',
    title: "Forty Years With {NAME}",
    hookText: 'My spouse {NAME} and I celebrated forty years of marriage just two months before the world ended. When the neighborhood evacuated, we got separated at the church checkpoint. I am going to find her.',
    searchGoal: "Search the St. Michael Church sanctuary for {NAME}.",
    targetLocationId: 'survivor_outpost',
    journalThoughts: [
      "{NAME} and I weathered recessions, illnesses, and grief. We will weather this.",
      "I held {NAME}'s knitted scarf to my face, taking comfort in the familiar scent.",
      "The world has collapsed, but my love for {NAME} remains completely intact."
    ]
  }
];

// Master Context-Aware Procedural Backstory Generator
export function getContextualBackstory(survivor: Survivor, career: Career): SurvivorBackstory {
  let templateList: BackstoryTemplate[] = ADULT_GENERAL_TEMPLATES;

  // 1. High School Student (Under 18)
  if (survivor.age < 18 || career.id === 'student') {
    templateList = STUDENT_TEMPLATES;
  } else if (career.id === 'police') {
    templateList = POLICE_TEMPLATES;
  } else if (career.id === 'paramedic' || career.id === 'surgeon') {
    templateList = MEDICAL_TEMPLATES;
  } else if (career.id === 'carpenter' || career.id === 'mechanic' || career.id === 'firefighter') {
    templateList = TRADES_TEMPLATES;
  } else if (survivor.age >= 46) {
    templateList = SENIOR_TEMPLATES;
  }

  // Pick random template from the appropriate list
  const template = templateList[Math.floor(Math.random() * templateList.length)];

  // Generate random first name from name pool (ensure it does not match the player's own first name!)
  const pool = NAME_POOLS[template.nameKey] || NAME_POOLS.brother;
  const playerFirstName = survivor.name.trim().split(/\s+/)[0];
  const availableNames = pool.filter(n => n.toLowerCase() !== playerFirstName.toLowerCase());
  const firstName = availableNames[Math.floor(Math.random() * availableNames.length)] || pool[0];

  // Dynamically inject the procedurally generated first name into all texts!
  const title = template.title.replace(/{NAME}/g, firstName);
  const hookText = template.hookText.replace(/{NAME}/g, firstName);
  const searchGoal = template.searchGoal.replace(/{NAME}/g, firstName);
  const journalThoughts = template.journalThoughts.map(t => t.replace(/{NAME}/g, firstName));

  return {
    id: template.id + '_' + Date.now(),
    theme: template.theme,
    title,
    targetName: firstName,
    relation: template.relation,
    hookText,
    searchGoal,
    targetLocationId: template.targetLocationId,
    chapter: 1,
    status: 'searching',
    journalThoughts
  };
}
