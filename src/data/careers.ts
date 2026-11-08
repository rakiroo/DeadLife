import { Career } from '../types/game';

export const CAREERS: Career[] = [
  {
    id: 'carpenter',
    title: 'Carpenter / Contractor',
    icon: '🪚',
    description: 'Master of structural woodwork and tools. Starts with high Crafting & Fitness.',
    startingLocation: {
      name: 'Oakwood Woodworking Shop',
      type: 'Industrial Workshop',
      description: 'The smell of sawdust and varnish fills the air. Outside the garage doors, distant sirens scream.',
      lootSpots: [
        {
          id: 'carpenter_bench',
          name: 'Heavy Workbench & Tool Wall',
          description: 'Racks of hand tools and framing equipment.',
          loot: [
            { id: 'claw_hammer', name: '22oz Steel Claw Hammer', category: 'weapon', quantity: 1, description: 'Forged blunt demolition hammer.', durability: 100 },
            { id: 'nails_box', name: 'Box of 3-Inch Framing Nails', category: 'resource', quantity: 30, description: 'Galvanized nails for boarding windows.' }
          ]
        },
        {
          id: 'lumber_racks',
          name: 'Lumber Storage Racks',
          description: 'Piles of cured 2x4 and plywood sheets.',
          loot: [
            { id: 'wood_planks', name: 'Reclaimed 2x4 Timber Planks', category: 'resource', quantity: 4, description: 'Heavy structural timber for barricading.' }
          ]
        },
        {
          id: 'breakroom_fridge',
          name: 'Breakroom Mini-Fridge & Microwave',
          description: 'Employee lunch containers and drinks.',
          loot: [
            { id: 'bottled_water', name: 'Bottled Spring Water', category: 'water', quantity: 2, description: 'Sealed cold drinking water.' },
            { id: 'lunch_sandwich', name: 'Wrapped Ham Sandwich', category: 'food', quantity: 1, description: 'Freshly prepared lunch sandwich.' }
          ]
        }
      ]
    },
    stats: {
      crafting: 8,
      combat: 5,
      fitness: 6,
      stealth: 3,
      medical: 2
    }
  },
  {
    id: 'paramedic',
    title: 'Paramedic / EMT',
    icon: '🩺',
    description: 'Emergency responder trained in rapid wound triage and life support.',
    startingLocation: {
      name: 'Ambulance Unit 12 (Hospital ER Bay)',
      type: 'Emergency Vehicle',
      description: 'Parked in the emergency ambulance bay. The hospital automatic glass doors are smeared with bloody handprints.',
      lootSpots: [
        {
          id: 'paramedic_trauma_bag',
          name: 'Orange Trauma Jump Bag',
          description: 'Packed with emergency field bandages and tourniquets.',
          loot: [
            { id: 'sterile_gauze', name: 'Compressed Sterile Gauze Rolls', category: 'medical', quantity: 3, description: 'Pressure dressing to stop arterial bleeding.' },
            { id: 'trauma_shears', name: 'Titanium Trauma Shears', category: 'tool', quantity: 1, description: 'Cuts through thick canvas, denim, and seatbelts.' }
          ]
        },
        {
          id: 'medication_box',
          name: 'Locking Medication Drawer',
          description: 'Prescription antibiotics and antiseptic solutions.',
          loot: [
            { id: 'antibiotics', name: 'Amoxicillin Antibiotic Capsules', category: 'medical', quantity: 6, description: 'Prevents and treats bacterial wound sepsis.' },
            { id: 'saline_flush', name: 'Sterile Saline Flush Bottle', category: 'water', quantity: 1, description: 'Pure sterile water.' }
          ]
        },
        {
          id: 'cab_console',
          name: 'Driver Cab & Glove Compartment',
          description: 'Emergency radio, road atlas, and driver belongings.',
          loot: [
            { id: 'flashlight', name: 'High-Lumen Angle Flashlight', category: 'tool', quantity: 1, description: 'Durable waterproof flashlight.' },
            { id: 'energy_bar', name: 'Protein Energy Bar', category: 'food', quantity: 2, description: 'High-calorie dense survival fuel.' }
          ]
        }
      ]
    },
    stats: {
      medical: 8,
      stealth: 4,
      fitness: 6,
      crafting: 3,
      combat: 3
    }
  },
  {
    id: 'surgeon',
    title: 'Trauma Surgeon / Doctor',
    icon: '🥼',
    description: 'Elite clinical surgeon. Master of complex sutures, amputations, and pharmacology.',
    startingLocation: {
      name: 'Mercy General - 3rd Floor OR Suite',
      type: 'Hospital Operating Ward',
      description: 'The surgical lighting hums on backup power. The hallway emergency alarm flashes silently.',
      lootSpots: [
        {
          id: 'surgical_prep_tray',
          name: 'Sterile Surgical Instrument Tray',
          description: 'Stainless steel scalpels, forceps, and needle holders.',
          loot: [
            { id: 'scalpel_kit', name: 'Surgical Scalpels & Forceps', category: 'weapon', quantity: 1, description: 'Razor-sharp precision medical steel.', durability: 100 },
            { id: 'suture_pack', name: 'Ethicon Monofilament Sutures', category: 'medical', quantity: 4, description: 'Hospital-grade wound closure kit.' }
          ]
        },
        {
          id: 'narcotics_locker',
          name: 'Keypad Narcotics Vault',
          description: 'Injectable pain management and broad-spectrum antibiotics.',
          loot: [
            { id: 'antibiotics_iv', name: 'Ciprofloxacin Antibiotics', category: 'medical', quantity: 8, description: 'High-potency systemic antibiotics.' },
            { id: 'iodine_prep', name: 'Povidone-Iodine Antiseptic Scrub', category: 'medical', quantity: 2, description: 'Topical surgical disinfectant.' }
          ]
        },
        {
          id: 'doctors_lounge',
          name: 'Doctors\' Break Lounge',
          description: 'Coffee machine, bottled water cooler, and snack drawer.',
          loot: [
            { id: 'bottled_water', name: 'Cooler Water Jug', category: 'water', quantity: 3, description: 'Clean drinking water.' },
            { id: 'protein_bars', name: 'Almond Protein Bars', category: 'food', quantity: 2, description: 'Quick nutrition.' }
          ]
        }
      ]
    },
    stats: {
      medical: 9,
      crafting: 4,
      stealth: 4,
      combat: 3,
      fitness: 4
    }
  },
  {
    id: 'police',
    title: 'Patrol Officer',
    icon: '👮',
    description: 'Trained in high-stress crisis resolution, tactical firearms, and clearing rooms.',
    startingLocation: {
      name: '3rd Precinct Squad Lockup',
      type: 'Police Station',
      description: 'The dispatch radios are spitting static. Abandoned cruisers sit in the sally port with flashing beacons.',
      lootSpots: [
        {
          id: 'duty_locker',
          name: 'Patrol Officer Duty Locker',
          description: 'Service equipment, tactical vest, and utility belt.',
          loot: [
            { id: 'nightstick', name: 'Solid Polycarbonate Nightstick', category: 'weapon', quantity: 1, description: 'Heavy impact blunt weapon.', durability: 100 },
            { id: 'handcuffs', name: 'Steel Restraint Handcuffs', category: 'tool', quantity: 1, description: 'Restrains hostile survivors.' }
          ]
        },
        {
          id: 'armory_rack',
          name: 'Station Armory Reserve Bin',
          description: 'Ammunition and tactical supplies.',
          loot: [
            { id: 'glock_9mm', name: 'Glock 19 (9mm Pistol)', category: 'weapon', quantity: 1, description: 'Semi-automatic service pistol with 12 rounds.', durability: 95 },
            { id: 'tac_flashlight', name: 'Streamlight Duty Flashlight', category: 'tool', quantity: 1, description: 'Powerful beam with strobe.' }
          ]
        },
        {
          id: 'dispatch_kitchen',
          name: 'Dispatch Break Area',
          description: 'Coffee pantry and bottled emergency water.',
          loot: [
            { id: 'bottled_water', name: 'Bottled Mineral Water', category: 'water', quantity: 2, description: 'Clean drinking water.' },
            { id: 'beef_jerky', name: 'Peppered Beef Jerky', category: 'food', quantity: 2, description: 'Dry protein rations.' }
          ]
        }
      ]
    },
    stats: {
      combat: 7,
      fitness: 7,
      stealth: 4,
      medical: 3,
      crafting: 3
    }
  },
  {
    id: 'firefighter',
    title: 'Firefighter / Rescuer',
    icon: '🚒',
    description: 'Brute force specialist with forcible entry knowledge and smoke tolerance.',
    startingLocation: {
      name: 'Engine Company 9 Bay',
      type: 'Firehouse Station',
      description: 'Two massive red engines sit under buzzing neon lamps. The emergency dispatch teleprinter has run out of paper.',
      lootSpots: [
        {
          id: 'truck_tool_rig',
          name: 'Fire Engine Extrication Tool Mount',
          description: 'Forcible entry axes, prybars, and hydraulic shears.',
          loot: [
            { id: 'halligan_tool', name: 'Forged Steel Halligan Bar', category: 'weapon', quantity: 1, description: 'Heavy demolition and breaching tool.', durability: 100 },
            { id: 'work_gloves', name: 'Kevlar Firefighter Work Gloves', category: 'tool', quantity: 1, description: 'Protects hands from broken glass.' }
          ]
        },
        {
          id: 'station_bunk_closet',
          name: 'Turnout Gear Locker & First Aid',
          description: 'Oxygen masks, trauma dressings, and uniforms.',
          loot: [
            { id: 'burn_gauze', name: 'Sterile Burn & Trauma Dressing', category: 'medical', quantity: 2, description: 'Covers lacerations and stops bleeding.' },
            { id: 'duct_tape', name: 'Industrial Gorilla Tape', category: 'tool', quantity: 1, description: 'Heavy waterproof adhesive.' }
          ]
        },
        {
          id: 'firehouse_kitchen',
          name: 'Station 9 Bunkhouse Kitchen',
          description: 'Large commercial pantry stocked for 24-hour shifts.',
          loot: [
            { id: 'canned_chili', name: 'Canned Beef & Bean Chili', category: 'food', quantity: 3, description: 'Hearty canned meal.' },
            { id: 'water_gallon', name: 'Gallon of Spring Water', category: 'water', quantity: 2, description: 'Clean fresh water.' }
          ]
        }
      ]
    },
    stats: {
      fitness: 8,
      combat: 6,
      crafting: 5,
      medical: 3,
      stealth: 2
    }
  },
  {
    id: 'ranger',
    title: 'Park Ranger / Hunter',
    icon: '🌲',
    description: 'Wilderness tracker with silent footing, water finding, and tracking skills.',
    startingLocation: {
      name: 'Blackwood Ridge Ranger Cabin',
      type: 'Forest Lookout',
      description: 'Perched high in the pine ridge overlooking the county valley. The wood stove still radiates gentle warmth.',
      lootSpots: [
        {
          id: 'gun_cabinet',
          name: 'Ranger Wooden Gun Cabinet',
          description: 'Hunting rifles, hunting knives, and wilderness gear.',
          loot: [
            { id: 'hunting_knife', name: 'Kabar Fixed-Blade Combat Knife', category: 'weapon', quantity: 1, description: 'Heavy carbon steel survival knife.', durability: 100 },
            { id: 'paracord', name: '550-lb Nylon Paracord (50 ft)', category: 'tool', quantity: 1, description: 'Strong multi-use cordage.' }
          ]
        },
        {
          id: 'ranger_pantry',
          name: 'Deep Woods Supply Chest',
          description: 'Smoked meats, water canteens, and purification tabs.',
          loot: [
            { id: 'smoked_jerky', name: 'Smoked Venison Jerky', category: 'food', quantity: 3, description: 'Cured game meat.' },
            { id: 'purification_tabs', name: 'Potable Aqua Water Tablets', category: 'medical', quantity: 12, description: 'Chemical water disinfectant.' },
            { id: 'canteen_full', name: 'Stainless Military Canteen', category: 'water', quantity: 2, description: 'Fresh mountain water.' }
          ]
        },
        {
          id: 'radio_desk',
          name: 'Emergency Solar Radio Desk',
          description: 'Shortwave radio transmitter and weather monitoring gear.',
          loot: [
            { id: 'firestarter', name: 'Magnesium Fire-Striker Rod', category: 'tool', quantity: 1, description: 'Ignites tinder in wet conditions.' }
          ]
        }
      ]
    },
    stats: {
      stealth: 7,
      fitness: 6,
      combat: 5,
      crafting: 4,
      medical: 2
    }
  },
  {
    id: 'mechanic',
    title: 'Master Auto Mechanic',
    icon: '🔧',
    description: 'Industrial problem solver. Can rig engines, repair generators, and fabricate tools.',
    startingLocation: {
      name: 'Apex Auto Repair Garage',
      type: 'Automotive Shop',
      description: 'Hydraulic lifts hold sedans mid-air. The smell of 10W-30 motor oil and rubber tires is thick.',
      lootSpots: [
        {
          id: 'tool_roll_chest',
          name: 'Snap-On 72-Inch Roll Cab',
          description: 'Chrome vanadium wrenches, prybars, and air tools.',
          loot: [
            { id: 'pipe_wrench', name: 'Heavy 18-Inch Cast Iron Pipe Wrench', category: 'weapon', quantity: 1, description: 'Devastating blunt demolition tool.', durability: 100 },
            { id: 'siphon_hose', name: 'Rubber Fuel Siphon Hose & Pump', category: 'tool', quantity: 1, description: 'Silently siphons fuel from vehicles.' }
          ]
        },
        {
          id: 'parts_shelf',
          name: 'Storage Rack & Generator Fuel',
          description: 'Car batteries, spark plugs, and red gas cans.',
          loot: [
            { id: 'gas_can', name: '5-Gallon Plastic Fuel Can (Full)', category: 'resource', quantity: 1, description: 'Fresh gasoline for generators or vehicles.' },
            { id: 'duct_tape', name: 'Gorilla Industrial Tape', category: 'tool', quantity: 1, description: 'Waterproof heavy adhesive.' }
          ]
        },
        {
          id: 'waiting_room',
          name: 'Customer Waiting Lounge',
          description: 'Coffee maker and snack vending machine.',
          loot: [
            { id: 'bottled_water', name: 'Sealed Bottled Water', category: 'water', quantity: 2, description: 'Clean drinking water.' },
            { id: 'chips_snack', name: 'Vending Machine Snacks', category: 'food', quantity: 2, description: 'Pre-packaged food.' }
          ]
        }
      ]
    },
    stats: {
      crafting: 8,
      fitness: 6,
      combat: 4,
      stealth: 4,
      medical: 2
    }
  },
  {
    id: 'electrician',
    title: 'Electrician / Lineman',
    icon: '⚡',
    description: 'Wiring and power specialist. Masters car batteries, solar panels, and perimeter alarms.',
    startingLocation: {
      name: 'Municipal Power Service Van',
      type: 'Utility Vehicle & Workshop',
      description: 'Parked in an alley beside a humming electrical substation. Wire reels and ladder racks line the roof.',
      lootSpots: [
        {
          id: 'van_tool_rack',
          name: 'Insulated Tool Rack & Pliers',
          description: '1000V rated screwdrivers, strippers, and copper spools.',
          loot: [
            { id: 'heavy_pliers', name: 'Forged Linesman Pliers', category: 'weapon', quantity: 1, description: 'Sturdy steel blunt weapon and cutter.', durability: 100 },
            { id: 'copper_wire', name: 'Spool of Insulated Copper Wire', category: 'resource', quantity: 2, description: 'Used for rigging perimeter tripwires.' }
          ]
        },
        {
          id: 'van_storage_bin',
          name: 'Hardware Storage Bin',
          description: 'Fuses, lithium batteries, and electrical tape.',
          loot: [
            { id: 'batteries_aa', name: 'Box of AA Alkaline Batteries', category: 'resource', quantity: 8, description: 'Powers radios and flashlights.' },
            { id: 'electric_tape', name: 'Heavy Electrical Tape', category: 'tool', quantity: 2, description: 'Insulating tape.' }
          ]
        },
        {
          id: 'lineman_lunchbox',
          name: 'Stainless Steel Cooler Lunchbox',
          description: 'Thermos and hearty packed lunch.',
          loot: [
            { id: 'hot_soup_thermos', name: 'Thermos of Vegetable Beef Broth', category: 'food', quantity: 1, description: 'Nutritious warm soup.' },
            { id: 'bottled_water', name: 'Insulated Water Flask', category: 'water', quantity: 2, description: 'Clean water.' }
          ]
        }
      ]
    },
    stats: {
      crafting: 8,
      fitness: 6,
      stealth: 5,
      combat: 3,
      medical: 2
    }
  },
  {
    id: 'chef',
    title: 'Line Cook / Butcher',
    icon: '👨‍🍳',
    description: 'Food preservation expert. Can butcher game, cure meat, and prevent spoilage.',
    startingLocation: {
      name: 'The Rusty Anchor Restaurant Kitchen',
      type: 'Commercial Kitchen',
      description: 'Stainless steel prep tables stretch beneath hoods. The gas pilot lights still flicker blue.',
      lootSpots: [
        {
          id: 'knife_magnetic_strip',
          name: 'Magnetic Wall Knife Strip',
          description: 'Professional German chef knives, cleavers, and boning blades.',
          loot: [
            { id: 'meat_cleaver', name: 'Heavy High-Carbon Meat Cleaver', category: 'weapon', quantity: 1, description: 'Devastating chopping blade.', durability: 95 },
            { id: 'chef_knife', name: '10-Inch Wusthof Chef Knife', category: 'weapon', quantity: 1, description: 'Razor sharp cutting knife.', durability: 90 }
          ]
        },
        {
          id: 'walkin_meat_locker',
          name: 'Walk-In Refrigerated Meat Locker',
          description: 'Hanging smoked meats, cured sausages, and butter.',
          loot: [
            { id: 'cured_sausages', name: 'Hanging Cured Hard Salami', category: 'food', quantity: 3, description: 'Long-shelf-life cured protein.' },
            { id: 'cooking_oil', name: 'Gallon of Canola Oil', category: 'food', quantity: 1, description: 'Calorie-dense fat source.' }
          ]
        },
        {
          id: 'dry_pantry_shelves',
          name: 'Bulk Dry Storage Pantry',
          description: '50-lb sacks of rice, beans, and sealed gallon jugs.',
          loot: [
            { id: 'canned_tomatoes', name: 'Canned Crushed Tomatoes', category: 'food', quantity: 3, description: 'Sealed canned vegetables.' },
            { id: 'gallon_water', name: 'Gallon Jug of Purified Water', category: 'water', quantity: 2, description: 'Clean water.' }
          ]
        }
      ]
    },
    stats: {
      crafting: 6,
      combat: 5,
      fitness: 6,
      medical: 3,
      stealth: 4
    }
  },
  {
    id: 'locksmith',
    title: 'Locksmith / Ex-Burglar',
    icon: '🗝️',
    description: 'Master of silent infiltration, picking deadbolts, and bypassing security shutters.',
    startingLocation: {
      name: 'KeyMaster Mobile Service Van',
      type: 'Commercial Van',
      description: 'Parked in front of a closed bank. The back is a precision workshop filled with lock cylinders.',
      lootSpots: [
        {
          id: 'lockpick_workbench',
          name: 'Lockpick & Decoder Workbench',
          description: 'SouthOrd pick sets, tension wrenches, and bump keys.',
          loot: [
            { id: 'lockpick_set', name: 'Professional Stainless Lockpick Set', category: 'tool', quantity: 1, description: 'Silently bypasses door deadbolts and padlocks.' },
            { id: 'crowbar_mini', name: '12-Inch Forged Prybar', category: 'weapon', quantity: 1, description: 'Quiet forcible entry tool.', durability: 100 }
          ]
        },
        {
          id: 'van_drawer',
          name: 'Key Blank & Hardware Drawer',
          description: 'Heavy padlocks, chains, and drill bits.',
          loot: [
            { id: 'heavy_padlock', name: 'Hardened Steel Padlock & Key', category: 'tool', quantity: 1, description: 'Locks gates and security chains.' },
            { id: 'wd40_can', name: 'Can of WD-40 Lubricant', category: 'tool', quantity: 1, description: 'Silences squeaking hinges.' }
          ]
        },
        {
          id: 'locksmith_glovebox',
          name: 'Dash Storage & Glovebox',
          description: 'Emergency snacks and insulated drink tumbler.',
          loot: [
            { id: 'tumbler_water', name: 'Full Vacuum Water Flask', category: 'water', quantity: 1, description: 'Cold fresh water.' },
            { id: 'energy_bars', name: 'Clif Protein Energy Bars', category: 'food', quantity: 2, description: 'Fast survival food.' }
          ]
        }
      ]
    },
    stats: {
      stealth: 8,
      crafting: 6,
      fitness: 5,
      combat: 3,
      medical: 2
    }
  },
  {
    id: 'veterinarian',
    title: 'Veterinarian',
    icon: '🐾',
    description: 'Can dress wounds for both humans and guard dogs; expert in animal behavior and disease vectors.',
    startingLocation: {
      name: 'All-Paws Veterinary Clinic',
      type: 'Medical Clinic',
      description: 'The waiting room chairs are toppled. Muffled animal whimpers come from the back recovery kennels.',
      lootSpots: [
        {
          id: 'surgery_table',
          name: 'Surgical Prep Table',
          description: 'Veterinary suture kits, scalpels, and medical tape.',
          loot: [
            { id: 'vet_suture_kit', name: 'Veterinary Suture Needle & Thread', category: 'medical', quantity: 3, description: 'Stitches deep lacerations.' },
            { id: 'betadine_wash', name: 'Bottle of Betadine Surgical Wash', category: 'medical', quantity: 1, description: 'Antiseptic to cleanse dirty wounds.' }
          ]
        },
        {
          id: 'pharmacy_cage',
          name: 'Locked Animal Pharmacy Cage',
          description: 'Broad-spectrum antibiotics and tranquilizers.',
          loot: [
            { id: 'vet_antibiotics', name: 'Veterinary Amoxicillin Tablets', category: 'medical', quantity: 6, description: 'Usable on humans or animals to halt sepsis.' },
            { id: 'syringe_pack', name: 'Sterile Syringes & Needles', category: 'medical', quantity: 3, description: 'Medical fluid administration.' }
          ]
        },
        {
          id: 'reception_fridge',
          name: 'Reception Breakroom Fridge',
          description: 'Employee snacks and distilled water jugs.',
          loot: [
            { id: 'distilled_water', name: 'Jug of Distilled Water', category: 'water', quantity: 2, description: 'Clean sterile water.' },
            { id: 'canned_food', name: 'Canned Soup Rations', category: 'food', quantity: 2, description: 'Sealed food.' }
          ]
        }
      ]
    },
    stats: {
      medical: 7,
      fitness: 5,
      stealth: 5,
      crafting: 4,
      combat: 3
    }
  },
  {
    id: 'trucker',
    title: 'Long-Haul Trucker',
    icon: '🚛',
    description: 'High sleepless watch stamina, heavy vehicle handling, and highway navigation.',
    startingLocation: {
      name: 'Interstate 95 Rest Stop (Semi Cab)',
      type: 'Semi Truck Sleeper Cab',
      description: 'High in the cab of an 18-wheeler. The highway below is a solid jam of abandoned smoking vehicles.',
      lootSpots: [
        {
          id: 'sleeper_bunk',
          name: 'Sleeper Bunk Storage',
          description: 'Tire iron, heavy blankets, and duffel bag.',
          loot: [
            { id: 'tire_iron', name: 'Heavy 4-Way Forged Tire Iron', category: 'weapon', quantity: 1, description: 'Massive steel impact weapon.', durability: 100 },
            { id: 'wool_blanket', name: 'Heavy Wool Trucker Blanket', category: 'tool', quantity: 1, description: 'Prevents hypothermia.' }
          ]
        },
        {
          id: 'truck_cooler',
          name: '12-Volt Cab Refrigerator',
          description: 'Stocked with cross-country road rations.',
          loot: [
            { id: 'beef_jerky', name: 'Large Pack of Smoked Jerky', category: 'food', quantity: 3, description: 'High-protein travel food.' },
            { id: 'canned_beans', name: 'Canned Baked Beans', category: 'food', quantity: 2, description: 'Canned rations.' },
            { id: 'gallon_water', name: 'Gallon Water Jug', category: 'water', quantity: 2, description: 'Clean drinking water.' }
          ]
        },
        {
          id: 'cb_radio_rack',
          name: 'CB Radio Console & Flashlight',
          description: 'Midland 40-channel emergency radio and Maglite.',
          loot: [
            { id: 'maglite_torch', name: 'Heavy 4-D Cell Maglite Flashlight', category: 'tool', quantity: 1, description: 'Bludgeon and illumination.' }
          ]
        }
      ]
    },
    stats: {
      fitness: 7,
      crafting: 6,
      combat: 5,
      stealth: 3,
      medical: 3
    }
  },
  {
    id: 'teacher',
    title: 'High School Science Teacher',
    icon: '🧪',
    description: 'Knowledge of chemical sterilization, water purification, and improvised explosives.',
    startingLocation: {
      name: 'Room 204 Chemistry Laboratory',
      type: 'School Laboratory',
      description: 'Test tubes and fume hoods line the counters. The emergency PA speaker clicks and hums dead air.',
      lootSpots: [
        {
          id: 'reagent_cabinet',
          name: 'Hazardous Chemical Cabinet',
          description: 'Alcohols, acids, and glass beakers.',
          loot: [
            { id: 'isopropyl_alcohol', name: 'Bottle of 99% Isopropyl Alcohol', category: 'medical', quantity: 2, description: 'Powerful disinfectant and fuel.' },
            { id: 'glass_beaker', name: 'Borosilicate Glass Flask', category: 'tool', quantity: 1, description: 'Boiling water safely.' }
          ]
        },
        {
          id: 'eyewash_firstaid',
          name: 'Emergency Eyewash & First Aid Station',
          description: 'Bandages, burn creams, and saline wash bottles.',
          loot: [
            { id: 'first_aid_dressings', name: 'Industrial First Aid Bandages', category: 'medical', quantity: 3, description: 'Sterile adhesive and gauze dressings.' },
            { id: 'saline_rinse', name: 'Sterile Eye Saline Rinse (500ml)', category: 'water', quantity: 1, description: 'Pure water.' }
          ]
        },
        {
          id: 'teachers_desk',
          name: 'Teacher\'s Locking Oak Desk',
          description: 'Lunch box, utility scissors, and keys.',
          loot: [
            { id: 'packed_lunch', name: 'Tupperware Lunch Rations', category: 'food', quantity: 2, description: 'Sandwiches and fruit.' },
            { id: 'scissors', name: 'Heavy Steel Scissors', category: 'weapon', quantity: 1, description: 'Sharp piercing tool.', durability: 80 }
          ]
        }
      ]
    },
    stats: {
      crafting: 6,
      medical: 5,
      stealth: 5,
      combat: 4,
      fitness: 4
    }
  },
  {
    id: 'fitness_coach',
    title: 'Athletic Trainer / Coach',
    icon: '🏃',
    description: 'Peak physical conditioning. Superior sprint endurance, grapple breaking, and agility.',
    startingLocation: {
      name: 'High School Fieldhouse & Weight Room',
      type: 'Gymnasium & Fieldhouse',
      description: 'The vast wooden basketball court is silent. Outside the double doors, a pack of silhouettes shuffles by.',
      lootSpots: [
        {
          id: 'trainers_kit',
          name: 'Athletic Trainer\'s Field Medical Kit',
          description: 'Elastic athletic wrap, cold sprays, and suture tape.',
          loot: [
            { id: 'ace_bandage', name: 'Heavy Elastic Compression Bandage', category: 'medical', quantity: 3, description: 'Splints sprains and binds open wounds.' },
            { id: 'ice_spray', name: 'Analgesic Pain Reliever Spray', category: 'medical', quantity: 1, description: 'Numb trauma pain.' }
          ]
        },
        {
          id: 'sports_cage',
          name: 'Equipment Cage & Bats',
          description: 'Softball bats, hockey sticks, and athletic gear.',
          loot: [
            { id: 'aluminum_bat', name: 'Rawlings 33-Inch Aluminum Bat', category: 'weapon', quantity: 1, description: 'High-speed durable blunt weapon.', durability: 95 }
          ]
        },
        {
          id: 'coach_cooler',
          name: 'Gatorade Cooler & Protein Stash',
          description: 'Sports bottles and electrolyte powders.',
          loot: [
            { id: 'electrolyte_water', name: 'Large Sports Squeeze Bottle (Full)', category: 'water', quantity: 3, description: 'Clean electrolyte water.' },
            { id: 'protein_powder', name: 'Dense Protein Fuel Rations', category: 'food', quantity: 2, description: 'High-calorie survival food.' }
          ]
        }
      ]
    },
    stats: {
      fitness: 8,
      combat: 6,
      stealth: 5,
      medical: 3,
      crafting: 2
    }
  },
  {
    id: 'security_guard',
    title: 'Night Security Guard',
    icon: '🔦',
    description: 'Accustomed to graveyard shifts, flashlight discipline, and observing shadows.',
    startingLocation: {
      name: 'Centennial Tower Ground Lobby',
      type: 'Commercial High-Rise',
      description: 'The revolving doors are locked with security bike chains. CCTV monitors flicker static.',
      lootSpots: [
        {
          id: 'guard_console',
          name: 'Security Guard Reception Console',
          description: 'Maglite baton, master building keys, and logbook.',
          loot: [
            { id: 'security_baton', name: 'Steel Expandable Friction Baton', category: 'weapon', quantity: 1, description: 'Tactical striking baton.', durability: 95 },
            { id: 'building_keys', name: 'Master Ring of Facility Keys', category: 'tool', quantity: 1, description: 'Unlocks doors in corporate offices.' }
          ]
        },
        {
          id: 'lost_and_found',
          name: 'Lost & Found Storage Box',
          description: 'Umbrellas, backpacks, and lost water bottles.',
          loot: [
            { id: 'thermos_bottle', name: 'Stainless Insulated Thermos (Full)', category: 'water', quantity: 2, description: 'Clean drinking water.' },
            { id: 'pocket_knife', name: 'Swiss Multi-Tool Knife', category: 'weapon', quantity: 1, description: 'Small blades, can opener, tweezers.', durability: 90 }
          ]
        },
        {
          id: 'lobby_vending',
          name: 'Employee Vending Machine',
          description: 'Glass-front snack machine.',
          loot: [
            { id: 'vending_peanuts', name: 'Salted Peanut Packs', category: 'food', quantity: 3, description: 'High-fat calorie dense food.' },
            { id: 'bottled_water', name: 'Bottled Dasani Water', category: 'water', quantity: 1, description: 'Clean water.' }
          ]
        }
      ]
    },
    stats: {
      stealth: 6,
      combat: 6,
      fitness: 6,
      crafting: 3,
      medical: 3
    }
  },
  {
    id: 'office_drone',
    title: 'Office Worker / Freelancer',
    icon: '💼',
    description: 'Blank slate civilian with no rigid trade, granting +4 Extra Trait Points to build your own way!',
    startingLocation: {
      name: '14th Floor Cubicle & Breakroom',
      type: 'Corporate High-Rise',
      description: 'High above the burning avenues. Elevator bells chime continuously on the emergency landing floor.',
      lootSpots: [
        {
          id: 'breakroom_fridge',
          name: 'Office Breakroom Sub-Zero Refrigerator',
          description: 'Lunch containers, sandwich wraps, and bottled teas.',
          loot: [
            { id: 'canned_sparkling_water', name: 'Cans of Sparkling Water', category: 'water', quantity: 2, description: 'Canned carbonated water.' },
            { id: 'prepped_salad_chicken', name: 'Roast Chicken Salad Container', category: 'food', quantity: 2, description: 'Fresh food rations.' }
          ]
        },
        {
          id: 'supply_closet',
          name: 'Facilities Supply Closet',
          description: 'Scissors, box cutters, industrial tape, and batteries.',
          loot: [
            { id: 'heavy_box_cutter', name: 'All-Metal Utility Box Cutter', category: 'weapon', quantity: 1, description: 'Sharp razor utility knife.', durability: 85 },
            { id: 'packing_tape', name: 'Roll of Heavy Packaging Tape', category: 'tool', quantity: 1, description: 'Adhesive repair tape.' }
          ]
        },
        {
          id: 'executive_desk',
          name: 'Executive Corner Suite Desk',
          description: 'Leather briefcase, high-end first aid kit, and scotch.',
          loot: [
            { id: 'designer_firstaid', name: 'Compact Travel First Aid Tin', category: 'medical', quantity: 2, description: 'Antiseptic wipes and sterile bandages.' },
            { id: 'bourbon_bottle', name: 'Bottle of Kentucky Bourbon (80 Proof)', category: 'medical', quantity: 1, description: 'Disinfectant or sanity booster.' }
          ]
        }
      ]
    },
    stats: {
      crafting: 5,
      combat: 4,
      fitness: 5,
      stealth: 5,
      medical: 5
    }
  }
];
