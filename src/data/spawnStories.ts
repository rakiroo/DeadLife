import { SpawnStory } from '../types/game';

export const SPAWN_STORIES: Record<string, SpawnStory[]> = {
  carpenter: [
    {
      id: 'carpenter_late_shift',
      title: 'The Midnight Shift',
      intro: 'Sirens wailed down the road while I finished a custom wood order. I pulled down the heavy shop shutter just before a bloody crowd rushed the street.',
      fullStory: 'You were working late alone in the shop, sanding down oak planks with your radio on low. Around midnight, the music cut out and an emergency broadcast warned people to stay inside and lock all doors. Seconds later, a pickup truck crashed through the streetlamp across the road.\n\nWhen you looked through the blinds, you saw people stumbling toward the driver, tearing at the windows with bare hands. You sprinted to the roll-up garage door, pulled the chain with all your strength, and dropped the heavy steel padlock. Now you are locked inside the workshop surrounded by sawdust, lumber racks, and hand tools. Outside the metal door, something heavy just bumped against the steel.'
    },
    {
      id: 'carpenter_broken_partner',
      title: 'The Panicked Apprentice',
      intro: 'My assistant panicked when screams started outside. He bolted out the back door and left me alone in the locked workshop.',
      fullStory: 'When news of the riots first reached the industrial park, your apprentice helped you board up the windows with 2x4s. But as night fell, the sounds outside turned into terrifying shrieks and car alarms. A woman pounded on the back door begging for help, followed by violent snarling.\n\nYour assistant lost his mind. He pulled the bolt, screamed, and ran straight out into the dark alley. I slammed the heavy door shut, locked the deadbolt, and pushed a heavy workbench in front of it. It is deathly quiet inside now. You are alone, and you need to see what supplies you can gather before someone or something tries to break in.'
    },
    {
      id: 'carpenter_dawn_siege',
      title: 'Smoke on the Horizon',
      intro: 'Black smoke rose over the city skyline at sunrise. I woke up on the workshop breakroom couch with sirens dying out in the distance.',
      fullStory: 'You slept on the shop couch after a 14-hour framing shift. I woke up to the smell of burning rubber and plastic. When you peeked out, three houses across the street were on fire, and nobody was coming to put them out. The streets were littered with abandoned cars and motionless bodies.\n\nThen one of the bodies stood up, twisted in an unnatural way, and began dragging its feet toward your shop gate. You checked your locks twice. The workshop is solid, built with heavy brick and steel beams, but your pockets are completely empty. You need food, clean water, and something heavy to swing.'
    }
  ],

  paramedic: [
    {
      id: 'paramedic_code_black',
      title: 'Code Black at the ER',
      intro: 'The hospital emergency entrance turned into a nightmare within minutes. I dove into the back of your ambulance and locked the doors.',
      fullStory: 'Dispatch called a Code Black for the whole county at 2 AM. When you drove your ambulance into the hospital bay, hospital staff were running outside covered in blood. Gurneys were tipped over on the pavement, and patients in paper gowns were chasing nurses into the parking lot.\n\nYour partner leaped out to help, but three infected people tackled him to the ground before you could yell a warning. You dove back into the ambulance, slammed the reinforced rear doors, and locked every handle. The glass is smeared with bloody handprints, but the ambulance body is heavy. You have sterile trauma kits and medicines in the drawers, but you cannot stay in this bay forever.'
    },
    {
      id: 'paramedic_highway_wreck',
      title: 'The Highway Ambush',
      intro: 'A multi-car pileup blocked the ambulance route back to base. I managed to steer the rig into the hospital sally port before the engine overheated.',
      fullStory: 'You were transporting what seemed like a routine fever patient when his heart rate spiked to 190 and his eyes turned blood red. He snapped through the velcro arm restraints and lunged with his teeth bare. Your partner slammed on the brakes, sending the patient crashing into the bulkhead partition.\n\nYou managed to shove him out the side doors into the street and speed away toward the hospital. But the hospital was already overrun. You killed the engine inside the covered ambulance bay, and now you are sitting in the cab breathing hard. The radio is hissing static. You need to check your medical packs and figure out where to go.'
    },
    {
      id: 'paramedic_quarantine_breach',
      title: 'The Broken Quarantine',
      intro: 'Soldiers barricaded the hospital gates at dawn, but the infected broke through. I hid inside your ambulance as the gunfire died down.',
      fullStory: 'National Guard trucks arrived at 5 AM setting up concrete barriers around the ER parking lot. For a few hours, it felt like someone was taking control. But then hundreds of infected poured out of the subway station down the block. The soldiers opened fire, but they were quickly surrounded and dragged down.\n\nYou stayed low inside the ambulance, covering the small windows with emergency blankets. Now the gunfire has stopped completely. The only sound outside is the quiet dripping of a broken fire hydrant and slow, dragging footsteps on shattered glass.'
    }
  ],

  surgeon: [
    {
      id: 'surgeon_mid_operation',
      title: 'The Operation That Went Wrong',
      intro: 'A patient on the operating table suddenly woke up with terrifying rage. I sealed the magnetic fire doors and trapped yourself on the third floor.',
      fullStory: 'You were performing emergency abdominal surgery when the patient flatlined. Before you could start chest compressions, the body sat upright, grabbed the surgical tech by the throat, and sank its teeth into her neck. Blood sprayed across the bright sterile lighting.\n\nYou hit the emergency lockdown button on the wall. The heavy magnetic steel doors slammed shut, sealing off the operating ward from the rest of the floor. Your hands are shaking, but your surgical scalpels, suture packs, and sterile gloves are right in front of you. Outside the frosted glass doors, shadows are pacing back and forth.'
    },
    {
      id: 'surgeon_empty_floor',
      title: 'The Abandoned Ward',
      intro: 'The surgical staff evacuated down the fire stairs while I secured the medicine vault. Now the stairwell doors are locked from the outside.',
      fullStory: 'When the hospital alarms blared an immediate evacuation order, panic took over. Doctors, nurses, and visitors sprinted down the emergency stairs. You ran back to the OR pharmacy locker to grab high-potency antibiotics and painkillers, knowing they would be priceless if society collapsed.\n\nBy the time you turned around, the stairwell fire door had locked automatically. You are alone on the third floor. The hallway backup lights hum with an eerie orange glow. Through the window, you can see fires burning across the downtown skyline. You need to gather supplies and find a way down safely.'
    },
    {
      id: 'surgeon_night_shift',
      title: 'Trapped Above the Ruins',
      intro: 'Gunfire echoed through the hospital lobby below until the building went dark. I am holed up in the third-floor doctors lounge.',
      fullStory: 'You had just finished a 16-hour trauma shift and collapsed onto the leather couch in the doctors lounge. At 3 AM, loud banging on the hospital front doors gave way to shattered glass and terrifying screams that echoed up the elevator shafts. Someone fired four handgun rounds before falling silent.\n\nYou crept out into the operating suite and pushed heavy medical carts against both main double doors. You have hospital water jugs, snacks from the breakroom, and trays of stainless steel instruments. You are alive, but the world outside this floor has completely ended.'
    }
  ],

  police: [
    {
      id: 'police_lockup_riot',
      title: 'The Holding Cell Riot',
      intro: 'A violent suspect bit an officer in the processing room, starting a bloody chain reaction. I barely managed to seal the steel lockup door behind you.',
      fullStory: 'It started as a routine disturbance call downtown. Two patrol officers brought in a disoriented man with bite marks on his neck. While they were fingerprinting him, he lunged forward, ripped out an officer\'s throat, and began tearing at everyone in the room. The bitten officer stood back up minutes later, his eyes glassy and hungry.\n\nYou drew your firearm, backed into the secure dispatch office, and locked the bulletproof steel door. The squad dispatch radio is squawking with frantic cries for backup from officers all across the county, but nobody is answering. You have your service weapon, your nightstick, and the station lockers around you.'
    },
    {
      id: 'police_abandoned_precinct',
      title: 'The Last Cruiser',
      intro: 'My sergeant ordered an evacuation to the county jail, but my cruiser got blocked in the sally port. I am barricaded inside the squad room.',
      fullStory: 'The order came down at 4 AM to abandon the precinct and regroup at the state armory. But as the convoy pulled out of the sally port, dozens of infected swarmed the gate, crashing against cruisers and pulling officers through open windows. You reversed hard, smashed back into the loading bay, and locked the steel gate behind you.\n\nAbandoned cruisers sit outside in the driveway with flashing red and blue lights reflecting off the bloody concrete. You are inside the squad room with access to the duty lockers, tactical vests, and the station reserve bins. It is time to gear up.'
    },
    {
      id: 'police_siren_silence',
      title: 'When Dispatch Went Quiet',
      intro: 'The 911 dispatch lines rang nonstop for five hours before every light on the board went dark. I locked the heavy front lobby doors.',
      fullStory: 'You were on desk duty monitoring the 911 consoles. Thousands of calls flooded the board: reports of people attacking their families, cars burning on highways, hospitals being overrun. By 6 AM, the dispatcher next to you broke down weeping, grabbed her coat, and walked out into the street.\n\nThen the power grid failed, and the dispatch center plunged into total silence. You went to the front lobby, lowered the metal storm shutters over the glass windows, and deadbolted the reinforced double doors. Outside, distant gunshots echo across the rooftops. You have your badge, your gun, and your training.'
    }
  ],

  firefighter: [
    {
      id: 'fire_station_alarm',
      title: 'The Call That Never Ended',
      intro: 'Engine Company 9 was dispatched to a massive chemical blaze, but the crew never came back. I was left guarding the station.',
      fullStory: 'At 1 AM, the big station siren wailed. Three engines rolled out the bay doors into the night to fight a five-alarm blaze near the train yards. Two hours later, a frantic radio transmission from the captain reported that the crowd surrounding the burning tanker was attacking the firefighters with their teeth.\n\nThen the radio died. No other trucks returned. You shut down the massive red bay doors, bolted the side gates, and locked the firehouse tight. The station is built like a fortress with heavy brick walls, full bunks, a kitchen, and racks of demolition axes and halligan bars. You are safe for now, but you need to prepare.'
    },
    {
      id: 'fire_smoke_refuge',
      title: 'The Burning City',
      intro: 'Thick black smoke covered the city as gas lines exploded downtown. I brought emergency water into the firehouse bunk room.',
      fullStory: 'From the station roof, I watched the city skyline turn orange as fires raged uncontrolled across three neighborhoods. Without water pressure in the city mains, there was nothing anyone could do. People ran down the streets outside, followed by hordes of relentless, fast-moving figures.\n\nYou retreated into Engine Company 9, chained the bay doors shut, and reinforced the rear entry with heavy oak timber. The air inside smells of diesel, clean canvas hoses, and motor oil. The firehouse kitchen is well-stocked for long shifts, but outside, the sound of glass breaking is getting closer.'
    },
    {
      id: 'fire_rescue_return',
      title: 'The Last Run',
      intro: 'I barely steered the rescue truck back into the bay after an ambush on Main Street. I slammed the shutter down behind you.',
      fullStory: 'Your squad was sent to rescue trapped residents from an apartment complex. When you arrived, the building was already filled with the infected. They swarmed the ladder truck, breaking through the cab windows. You shoved your way free with a heavy halligan bar, jumped into the secondary truck, and gunned the engine back to the firehouse.\n\nYou slammed the bay door down just as two bodies threw themselves against the metal exterior. Your hands are scraped and your uniform is covered in soot, but you made it inside. You have axes, heavy gloves, and first aid gear at hand.'
    }
  ],

  ranger: [
    {
      id: 'ranger_quiet_ridge',
      title: 'The View from the Ridge',
      intro: 'High in the pine mountains, I watched the valley highway gridlock and burn. I retreated into the ranger station cabin.',
      fullStory: 'Living in the lookout tower on Blackwood Ridge gave you a front-row seat to the end of the world. Through your spotting scope, you saw the interstate jam with miles of bumper-to-bumper headlights, followed by waves of panic as people fled their cars on foot. Smoke pillars rose over every town in the valley.\n\nYou packed up your optics, walked down the ridge trail to your log ranger station, and locked the thick pine door behind you. Up here in the woods, the air is clean and quiet, smelling of pine needles and woodsmoke. You have a locked gun cabinet, dried venison in the pantry, and mountain spring water in canteens.'
    },
    {
      id: 'ranger_lost_hikers',
      title: 'The Trail Camp Incident',
      intro: 'Two panicked hikers ran up the mountain trail covered in blood. I hurried them past and barricaded the cabin.',
      fullStory: 'Early this morning, screams broke the mountain silence. Two campers ran toward the ranger outpost, gasping for breath and shouting that people at the trailhead campground were tearing each other apart. Before you could treat their wounds, three infected emerged from the tree line with terrifying speed.\n\nYou fired a warning shot from your rifle, but they didn\'t even flinch. You hurried the campers toward the lower ravine while you locked down the main cabin, securing the timber shutters and barring the heavy oak door. The forest is quiet again, but you know you are no longer alone in these woods.'
    },
    {
      id: 'ranger_radio_static',
      title: 'The Last Forest Broadcast',
      intro: 'The park service radio issued a final warning to retreat to high ground before going silent. I locked your cabin door.',
      fullStory: 'You were sitting by the wood stove sipping black coffee when the emergency weather radio crackled with an urgent park service broadcast. The voice was trembling: state routes were impassable, city centers had fallen, and all park staff were ordered to shelter in place and defend themselves.\n\nThen the transmitter went dead. You stepped outside, chopped fresh firewood, brought it inside, and bolted the iron latch. The log walls are thick, and you have hunting knives, fire starters, and purification tablets. Survival is what you were trained for.'
    }
  ],

  mechanic: [
    {
      id: 'mechanic_shop_lockdown',
      title: 'Slamming the Roll-Up Door',
      intro: 'A burning car crashed through the garage fence. You dropped the heavy roll-up metal shutter and grabbed a pipe wrench.',
      fullStory: 'You were underneath a customer\'s pickup truck replacing a transmission when tires screeched outside. A sedan smashed straight through the chain-link fence, horn blaring continuously. When you slid out from under the lift, you saw the passenger clawing at the driver\'s neck through the windshield glass.\n\nYou sprinted to the garage entrance, grabbed the chain hoist, and pulled the corrugated steel door down to the floor, sliding the heavy iron bolt into place. The smell of 10W-30 motor oil and gasoline fills the garage air. You are surrounded by hydraulic lifts, tool chests, and heavy steel wrenches.'
    },
    {
      id: 'mechanic_power_failure',
      title: 'When the Lifts Stopped',
      intro: 'The shop power died with a loud pop, leaving two cars suspended in the air. I locked the customer office and secured the shop.',
      fullStory: 'The electric impact wrenches suddenly went silent as the industrial park transformer blew down the street. When you stepped out to check the fuse box, people were running along the frontage road, screaming for help as infected sprinted behind them like wild predators.\n\nYou backed into the garage, deadbolted the heavy steel door, and turned off all the backup lights so you wouldn\'t attract attention. The garage is dark, cool, and quiet. You have full fuel cans, thick duct tape, and enough heavy tools to defend yourself if anything tries to break through the office glass.'
    },
    {
      id: 'mechanic_customer_keys',
      title: 'The Abandoned Fleet',
      intro: 'Five car owners tossed their keys on the shop counter and fled toward the trains. You secured the auto bay and locked yourself inside.',
      fullStory: 'This morning, panic hit the neighborhood like a tidal wave. Customers parked their cars right in front of the bays, tossed their keys on the desk, and ran toward the train station hoping to catch the last outbound train. Within an hour, screams echoed from the station platform.\n\nYou pulled three vehicles inside the bay for cover, locked the side doors, and reinforced the service window with scrap metal and self-tapping screws. You have water bottles from the waiting room and endless tools in the roll cab.'
    }
  ],

  electrician: [
    {
      id: 'electrician_substation_blast',
      title: 'The Substation Explosion',
      intro: 'A bright blue flash lit up the sky as the city grid failed. I took cover inside your heavy utility service van.',
      fullStory: 'You were repairing an overhead transformer line when a blinding electrical surge blew the substation two blocks away. Sparks showered down onto the street, and all streetlights and house lamps went pitch black. Below your bucket lift, people started screaming as infected rushed out from the shadows.\n\nYou quickly lowered the bucket, dove into the rear cargo cabin of your heavy utility van, and slammed the reinforced rear doors shut. The van is packed with 1000V insulated pliers, rolls of thick copper wire, heavy batteries, and emergency spotlights. Through the rain-slicked windshield, you can see dark silhouettes wandering down the middle of the street.'
    },
    {
      id: 'electrician_alley_hideout',
      title: 'Dark Alley Shelter',
      intro: 'You parked your service van in a dead-end brick alley when the streets became blocked. I locked all cabin doors from within.',
      fullStory: 'Traffic completely froze on the main avenue as abandoned cars and overturned buses blocked every intersection. Seeing the crowd surge toward the police barricades, you steered your heavy service van down a narrow industrial brick alley and parked against a solid brick wall.\n\nYou locked all four doors, pulled down the window shades, and turned off the engine. The van is heavy and durable, built to handle rough terrain and severe weather. I have clean drinking water in the side compartments and enough tools to build a perimeter fence if you can find the materials.'
    },
    {
      id: 'electrician_night_storm',
      title: 'Lightning over the Power Lines',
      intro: 'A thunderstorm rolled in as the city emergency sirens finally died. You sat in the van workshop sorting your supplies.',
      fullStory: 'Lightning flickers across the sky, illuminating rows of abandoned commercial warehouses. The sirens that wailed all morning have finally run out of power. The only sound now is rain drum-rolling against the metal roof of your utility van.\n\nYou clicked on a low-lumen LED headlamp and inspected the van\'s storage drawers. You have heavy linesman pliers, electrical tape, fuses, and clean rations. You are sheltered from the storm, but you need to make a plan before daylight comes.'
    }
  ],

  chef: [
    {
      id: 'chef_dinner_rush',
      title: 'The Dinner Rush Chaos',
      intro: 'A customer in the dining room suddenly attacked the waitstaff. You barred the stainless steel kitchen doors.',
      fullStory: 'The restaurant was packed for dinner service when a customer at table 4 began seizing violently on the floor. When the floor manager knelt down to check on him, the man snapped his teeth into the manager\'s cheek. Within seconds, the dining room turned into pure chaos with tables flipping and glass shattering.\n\nYou yelled at your line cooks to evacuate, grabbed your heavy 10-inch chef\'s knife, and slammed the thick stainless steel kitchen doors shut, jamming a heavy steel mop handle through the handles. You are locked in the commercial kitchen with walk-in freezers, canned goods, and sharp knives. The dining room has gone terrifyingly quiet.'
    },
    {
      id: 'chef_pantry_refuge',
      title: 'The Steel Pantry',
      intro: 'I locked yourself inside the restaurant kitchen and back storage room as people fought in the street outside.',
      fullStory: 'When news of the outbreak broke, mobs of desperate people began smashing shop windows down the avenue. I locked the front glass gate, pulled down the security shutter, and retreated to the back kitchen. You heard people trying to kick open the back alley door, but the reinforced steel door held firm.\n\nNow the looters have moved on, leaving only the infected wandering outside. The restaurant kitchen is an incredible sanctuary for food and water: boxes of canned tomatoes, cooking oil, cured meats, and sealed bottled water. But you know that food alone won\'t save you if you can\'t defend the doors.'
    },
    {
      id: 'chef_walkin_lock',
      title: 'Cold Storage Safehouse',
      intro: 'You spent the night holed up in the restaurant prep area with cleavers and knives within reach. Sunrise revealed an empty city.',
      fullStory: 'I woke up on a pile of flour sacks in the dry storage pantry. Peeking through the small exhaust vent, I watched the sun rise over empty streets littered with burnt trash and abandoned luggage. A single infected person in business clothes was dragging one foot across the asphalt below.\n\nYou walked through your kitchen prep line, picking up your forged knives and steel tongs. You have plenty of calories and water here, but you cannot hide behind an oven forever. You need to gather what you can carry and plan your next move.'
    }
  ],

  locksmith: [
    {
      id: 'locksmith_locked_van',
      title: 'The Unbreakable Deadbolt',
      intro: 'You were finishing a house re-keying job when violence erupted down the sidewalk. You bolted into your mobile workshop van.',
      fullStory: 'You were sitting in the back of your mobile locksmith van cutting replacement keys for a suburban home when screaming echoed down the sidewalk. A woman ran past your rear window pursued by a man whose face was covered in torn flesh. You quickly pushed the van doors shut and flipped the heavy internal deadbolts.\n\nYour mobile workshop is a fortress on wheels: reinforced door plates, pick sets, cordless drills, and heavy steel pry bars. Someone tried turning the exterior door handles a few minutes ago, but the high-security deadbolts didn\'t even budge. You have tools that can open almost any door in the city, but you need to find food and water.'
    },
    {
      id: 'locksmith_night_callout',
      title: 'The Emergency Callout',
      intro: 'An emergency lockout call led you to a bloody apartment building. I sprinted back to your work van and locked the doors.',
      fullStory: 'You got dispatched to help someone locked out of their apartment. But when you arrived, the apartment door was already kicked off its hinges, and the hallway inside was smeared with fresh blood. Heavy thumping came down the staircase behind you.\n\nYou sprinted back to your work van, locked the cab doors, and drove into an empty parking lot behind a bank. The radio has been warning that martial law has failed. I am sitting among key-cutting machines, deadbolt assemblies, and tactical crowbars. You can bypass almost any lock, which makes scavenging far safer for you than anyone else.'
    },
    {
      id: 'locksmith_curfew_break',
      title: 'Behind the Steel Mesh',
      intro: 'I lowered the security grates on your mobile van and waited out the initial riots under the cover of night.',
      fullStory: 'As the riots spread, people started throwing bricks at parked vehicles. You drove your locksmith van into a covered parking garage, parked deep in the corner, and lowered the interior steel security mesh over the glass windows. Nobody can see inside, and nobody can smash their way in easily.\n\nNow morning light is filtering through the garage ramps. The screams have quieted down, replaced by the eerie shuffling of infected wanderers. You check your lockpicks and heavy prybars. It is time to move.'
    }
  ],

  veterinarian: [
    {
      id: 'vet_clinic_doors',
      title: 'Locked in the Animal Clinic',
      intro: 'Panicked pet owners brought in animals with severe bite wounds before the lobby was swarmed. I locked the surgery room.',
      fullStory: 'The morning clinic shift was peaceful until three separate pet owners rushed in carrying dogs covered in tearing wounds. The owners said wild-looking people attacked their pets at the park. Within minutes, one of the owners began coughing up dark blood, collapsed, and attacked his own dog.\n\nYou grabbed a vet assistant, pushed her out the back exit, and bolted the heavy surgical suite door. I am trapped inside the treatment area with stainless steel examination tables, cages, and surgical scalpels. The medicine cabinets are full of broad-spectrum antibiotics, antiseptics, and surgical sutures.'
    },
    {
      id: 'vet_kennel_night',
      title: 'The Silent Kennels',
      intro: 'I stayed late to monitor sick animals as sirens went off down the avenue. The clinic heavy glass doors held against the horde.',
      fullStory: 'The animals in the clinic kennels started barking and whining an hour before the sirens even started. Animals always sense disaster first. When you looked through the waiting room blinds, a wave of infected people sprinted down the sidewalk, smashing through the bakery across the street.\n\nYou locked the clinic front tempered-glass doors, lowered the metal blinds, and retreated to the prep room. The barking has stopped now; the dogs are shivering quietly in their kennels. You have medical disinfectant, trauma bandages, and clean water bowls. You need to gather what you can before you make a run for it.'
    },
    {
      id: 'vet_surgery_prep',
      title: 'The Clean Room Safehouse',
      intro: 'You spent the first night of the outbreak asleep on the surgical floor. Dawn revealed an empty, ruined suburb.',
      fullStory: 'I barricaded the front clinic reception with heavy file cabinets and spent the night in the clean operating room. When the morning sun came through the frosted glass, you checked the front cameras. The street was completely still, littered with abandoned cars, shoes, and bloodstains.\n\nYou wash your hands with antiseptic scrub and check the clinic inventory. You have scalpels, syringes, painkillers, and antibiotics. Your medical knowledge gives you an immense advantage against wounds and infections in this new world.'
    }
  ],

  trucker: [
    {
      id: 'trucker_rest_stop',
      title: 'The Highway Rest Stop Siege',
      intro: 'A swarm of infected attacked the travel plaza while you slept in your cab. I locked both sleeper doors tight.',
      fullStory: 'You were three days into a cross-country haul when I pulled my 18-wheeler into a highway travel plaza to sleep. At 2 AM, screams and shattering glass woke you up. Looking down from your high cab windows, you saw hordes of people swarming the gas pumps, pulling travelers out of their minivans.\n\nYou hit the interior air door locks and pulled the heavy velvet sleeper curtains shut. The truck sits high off the ground on heavy steel tires, making it nearly impossible for anyone to climb inside without a ladder. You have a long-haul tire thumper bat, road atlases, and emergency water jugs in the sleeper cab.'
    },
    {
      id: 'trucker_freeway_gridlock',
      title: 'The Interstate Standstill',
      intro: 'The interstate turned into a giant parking lot as thousands fled the cities. You stayed inside your diesel fortress.',
      fullStory: 'Every lane of Interstate 80 came to a dead stop when the bridge ahead was closed by military authorities. Hours later, panic erupted behind you as infected moved through the line of trapped cars like wolves in a sheep pen. Drivers abandoned their cars and fled into the cornfields.\n\nYou stayed right in your cab, deadbolted the heavy fiberglass doors, and kept your head down. The chaos has moved down the highway now. Your fuel tanks are nearly full, and your sleeper has dry rations and water. You just need to figure out where the road is still clear.'
    },
    {
      id: 'trucker_loading_dock',
      title: 'The Warehouse Dock',
      intro: 'my rig was backed against the loading dock when the workers fled into the night. You secured the cab.',
      fullStory: 'You were waiting for dock workers to finish unloading your trailer when an emergency alert lit up everyone\'s phones. The workers panicked, dropped their forklifts, and ran for their personal cars. Within twenty minutes, the entire distribution center was completely abandoned.\n\nYou pulled the truck forward, locked the trailer, and locked yourself inside the cab. High above the asphalt, you have an incredible view of the surrounding valley. You have heavy tools, a heavy impact bar, and clean water. Time to decide your next move.'
    }
  ],

  teacher: [
    {
      id: 'teacher_science_lab',
      title: 'Locked in the Chemistry Lab',
      intro: 'The high school PA system blared a panic code before the power died. I locked the reinforced science lab doors.',
      fullStory: 'I was grading lab reports after school when the principal\'s voice came over the loudspeaker screaming for everyone to lock down immediately. Gunfire echoed from the gymnasium across the courtyard, followed by the terrifying sound of hundreds of running footsteps in the tiled hallway.\n\nYou quickly pulled the window shades down, shoved the heavy teacher\'s desk against the solid wood door, and turned off the lights. The science classroom has gas lines, safety goggles, chemical reagents, and emergency eye-wash stations with clean running water. Outside in the hallway, lockers are rattling as things shuffle past in the dark.'
    },
    {
      id: 'teacher_courtyard_refuge',
      title: 'The Classroom Sanctuary',
      intro: 'You watched the courtyard evacuate through the classroom blinds until nobody was left. You secured the lab cabinets.',
      fullStory: 'Buses left the school parking lot in a desperate rush, carrying students away toward the emergency shelters downtown. But I stayed behind to make sure all classroom doors were locked. By the time you reached the front lobby, the doors were surrounded by infected pounding on the glass.\n\nYou retreated back to the third-floor science lab, bolted the door from inside, and caught your breath. The lab is equipped with fire blankets, chemical bottles, first aid kits, and heavy glass beakers. You know chemistry, physics, and basic crafting better than most survivors. That knowledge might just keep you alive.'
    },
    {
      id: 'teacher_morning_bell',
      title: 'The Silent Schoolyard',
      intro: 'The morning school bell never rang. I woke up inside the lab supply closet to the quiet sound of crows outside.',
      fullStory: 'You spent the night curled up inside the chemical storage closet wrapped in a wool emergency blanket. When morning light came through the high classroom windows, you looked out over the football field and parking lot. Abandoned backpacks and textbooks were scattered across the grass, and two figures were slowly stumbling along the running track.\n\nYou unlocked the supply cabinets and gathered clean bottled water, disinfectant ethanol, and laboratory tools. You are an educator, not a soldier, but you are smart and observant. You can survive this.'
    }
  ],

  fitness_coach: [
    {
      id: 'coach_iron_sanctuary',
      title: 'Trapped in the Weight Room',
      intro: 'Gym members panicked as infected broke through the glass lobby. I slammed the heavy gym security gate shut.',
      fullStory: 'I was spotting a client on the bench press when screaming erupted in the lobby. Three infected people crashed through the revolving glass doors, biting the front desk clerks. Clients dropped their dumbbells and ran toward the emergency exits in total terror.\n\nYou grabbed a 45-pound steel barbell, ushered the remaining people out the back alley, and pulled down the heavy roll-up steel security gate between the lobby and the weight room. Now you are locked inside the gym surrounded by racks of dumbbells, protein bars, and commercial water coolers. Your body is in peak physical condition, and your stamina is your greatest weapon.'
    },
    {
      id: 'coach_morning_workout',
      title: 'The 5 AM Outbreak',
      intro: 'I opened the gym doors before sunrise just as police cruisers sped past with sirens wailing. I locked the doors tight.',
      fullStory: 'Opening the gym at 5 AM was your daily routine for ten years. But this morning, four police cars blew past the front windows running red lights, followed by a fire engine. Then people on foot started running past, looking over their shoulders in utter horror.\n\nYou immediately locked the commercial deadbolts on the heavy glass doors and killed the music. Minutes later, bloody hands were smacking against the glass, but the heavy storefront glass held. You have energy snacks, bottled water, and dozens of heavy blunt weights. You are strong and fast, ready for whatever comes.'
    },
    {
      id: 'coach_locker_room',
      title: 'Locker Room Defense',
      intro: 'I barricaded the locker room hallway with heavy weight benches after hearing screaming in the parking lot.',
      fullStory: 'When the parking lot turned into a battleground, I took charge. You dragged heavy flat benches and steel squat racks into the hallway to create an impassable choke point. Outside, cars crashed into light poles, but your fortified corner held firm.\n\nNow the noise has subsided. You are breathing steadily, feeling the adrenaline pumping through your veins. You have sports towels, first aid tape, bottled electrolyte drinks, and steel dumbbell handles that make devastating weapons. It is time to see what you can loot.'
    }
  ],

  security_guard: [
    {
      id: 'guard_mall_lockdown',
      title: 'The Mall Security Office',
      intro: 'You watched the shopping mall fall on the CCTV monitors before locking the heavy security control room door.',
      fullStory: 'Sitting in front of sixteen surveillance monitors in the mall basement, I watched the nightmare unfold in real time. A crowd rushed through the food court entrance, pursued by dozens of infected who dragged shoppers down across the polished tile floors.\n\nYou hit the master mall fire shutters, trapping the infected inside the main concourse, and bolted the heavy reinforced security room door. You have your tactical flashlight, handcuffs, a solid nightstick, and access to CCTV feeds. The backup battery is humming quietly. You know every hallway, vent, and service door in this building.'
    },
    {
      id: 'guard_front_gate',
      title: 'The Gate Shift Ambush',
      intro: 'You were manning the security gatehouse when a horde pushed past the barrier. I locked down the gatehouse cabin.',
      fullStory: 'The gatehouse barrier arm was no match for the wave of desperate people and infected that poured down the commercial boulevard. Seeing the gate collapse, you locked the shatter-resistant gatehouse door and stayed low beneath the desk.\n\nThe infected passed right around the cabin, distracted by car horns down the street. The gatehouse has an emergency radio, duty flashlight, and first aid supplies. You have security training, room-clearing knowledge, and a cool head under pressure.'
    },
    {
      id: 'guard_night_patrol',
      title: 'The Final Patrol',
      intro: 'Your partner never answered his radio check. You returned to the security post and deadbolted the heavy steel door.',
      fullStory: 'I called my partner on Channel 1 three times for his midnight patrol check. All you heard in return was a muffled scream, the sound of a radio dropping to the floor, and wet biting sounds. You pulled out your baton and carefully backed into the central guard post.\n\nYou locked the heavy door and slid the iron security bolt into place. You have snacks from the break pantry, bottled water, and security equipment. You are trained to spot danger before it gets close, and that awareness will keep you alive.'
    }
  ],

  student: [
    {
      id: 'student_chem_lab',
      title: 'The Chemistry Lab Lockdown',
      intro: 'The fourth-period lockdown bell shrilled through the hallways as screaming erupted in the gym. I bolted into the chemistry prep room and jammed a heavy desk under the door.',
      fullStory: 'I was sitting in fourth-period chemistry when the red lockdown strobe lights began flashing over the whiteboard. Over the intercom, the principal screamed for everyone to lock their classroom doors before the broadcast cut off with a wet thud and shattering glass. Down in the courtyard, students were running in total terror as infected swarmed past the bicycle racks.\n\nI sprinted into the back chemical prep room, locked the reinforced metal door, and wedged a heavy teacher desk under the handle. I have my student backpack, my packed lunch, my aluminum baseball bat, and emergency eye-wash water bottles. Through the narrow frosted glass slit, I can hear lockers rattling as things shuffle past in the dark.'
    },
    {
      id: 'student_library_stacks',
      title: 'Trapped in the Library Stacks',
      intro: 'When the front lobby glass shattered, I scrambled up the library maintenance ladder into the storage loft and pulled the ladder up behind me.',
      fullStory: 'I was studying alone in the corner of the second-floor library when the sound of gunfire erupted from the avenue outside. Moments later, the heavy entrance doors caved in, and hundreds of frantic running footsteps echoed through the halls below.\n\nI did not hesitate: I climbed the iron spiral ladder into the archive loft above the history stacks, unhooked the ladder from the rungs, and laid flat on the floorboards. Looking down between the gaps, I watched infected wander past the checkout desks. I have my backpack with bottled spring water, granola bars, and my baseball bat. I am hidden high above them, but I need to survive the night.'
    },
    {
      id: 'student_fieldhouse_cage',
      title: 'The Fieldhouse Cage',
      intro: 'Practice ended in chaos as infected broke through the sports field gates. I sprinted into the athletic equipment cage and padlocked the steel grate.',
      fullStory: 'We were finishing baseball practice on the diamond when people from the neighborhood came sprinting across the outfield screaming that people were being attacked downtown. Within seconds, infected burst through the chain-link gates, tackling people onto the grass.\n\nI grabbed my heavy aluminum bat, sprinted for the fieldhouse equipment room, slammed the heavy steel security grate shut, and clicked the master padlock into place. Now I am locked inside the equipment cage surrounded by sports gear, water bottles, and first aid tape. Outside the mesh, infected are smacking their bloody palms against the steel, but the reinforced cage is holding firm. I have my bat, energy snacks, and clean water.'
    }
  ],

  office_drone: [
    {
      id: 'office_fire_alarm',
      title: 'The 7th Floor Lockdown',
      intro: 'The high-rise fire alarm blared as elevators dropped to the lobby. I barricaded myself inside my corner cubicle suite.',
      fullStory: 'I was staring at a spreadsheet sipping lukewarm coffee when the office fire alarms shrieked. Everyone rushed toward the elevator banks, but the elevators were stuck on the ground floor where horrific screams were echoing up the concrete shafts.\n\nI sprinted back to my corner department, slammed the heavy glass suite door, and shoved three heavy filing cabinets across the handles. I am on the 7th floor of an office tower. I have bottled cooler water, breakroom snacks, and scissors, but I have no combat training. I was an ordinary civilian, but my blank slate means I can adapt and learn fast.'
    },
    {
      id: 'office_overtime_escape',
      title: 'The Overtime Nightmare',
      intro: 'Working late on a deadline saved my life while the streets below collapsed into chaos. I secured the conference room.',
      fullStory: 'I stayed late at my desk to finish an urgent client presentation. At 8 PM, police sirens began howling across downtown like a chorus of dying animals. Looking out through the double-pane office windows, I saw crowds running down 5th Avenue, illuminated by burning cars and flashing red beacons.\n\nI locked the executive conference room door and turned off all overhead fluorescent lights. The city skyline is now completely black with pillars of smoke rising between skyscrapers. I have water jugs, snack bars, and stationery tools. I need to gather supplies and figure out how to survive.'
    },
    {
      id: 'office_breakroom_refuge',
      title: 'The Breakroom Sanctuary',
      intro: 'When screaming echoed from the stairwell, I ducked into the office kitchen pantry and locked the deadbolt.',
      fullStory: 'The emergency stairwell door burst open with a bang, and panicked coworkers ran across the carpeted floor shouting that people downstairs were eating each other. You didn\'t hesitate: you ducked straight into the supply breakroom and clicked the deadbolt into place.\n\nFootsteps and heavy thuds pounded against the suite doors outside, but my breakroom door went unnoticed. I have gallons of spring water from the water cooler, boxes of granola bars, coffee, and scissors. I never held a weapon in my life, but survival will force me to become someone entirely new.'
    }
  ]
};

export function getRandomSpawnStory(careerId: string): SpawnStory {
  const stories = SPAWN_STORIES[careerId];
  if (stories && stories.length > 0) {
    const idx = Math.floor(Math.random() * stories.length);
    return stories[idx];
  }
  return {
    id: 'default_spawn',
    title: 'The Outbreak Begins',
    intro: 'Sirens wail in the distance as society collapses. I have taken shelter at my starting place.',
    fullStory: 'The national emergency sirens abruptly died out. The streets outside are deathly quiet. I have empty pockets and zero supplies on me. I need to search my immediate surroundings before deciding my next move.'
  };
}
