import { GameState, EventDilemma } from '../types/game';
import { getCurrentLocationName } from '../data/events';

// ============================================================================
// 🔑 PASTE YOUR GEMINI API KEY HERE DIRECTLY:
// ============================================================================
export const GEMINI_API_KEY = '';
// ============================================================================

export type AIProvider = 'gemini' | 'grok' | 'openai';

export interface AISettings {
  enabled: boolean;
  provider: AIProvider;
  apiKey: string;
  model: string;
}

const SETTINGS_KEY = 'deadlife_ai_settings';

export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash'
};

export function getAISettings(): AISettings {
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  const hardcodedKey = GEMINI_API_KEY.trim() || envKey;
  if (hardcodedKey) {
    return { enabled: true, provider: 'gemini', apiKey: hardcodedKey, model: 'gemini-2.0-flash' };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.apiKey && envKey) {
        parsed.apiKey = envKey;
        parsed.enabled = true;
      }
      return { ...DEFAULT_AI_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to read AI settings', e);
  }
  if (envKey) {
    return { ...DEFAULT_AI_SETTINGS, enabled: true, apiKey: envKey };
  }
  return DEFAULT_AI_SETTINGS;
}

export function saveAISettings(settings: AISettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function testAIConnection(settings: AISettings): Promise<{ success: boolean; message: string }> {
  if (!settings.apiKey.trim()) {
    return { success: false, message: 'Please enter an API key.' };
  }

  try {
    if (settings.provider === 'gemini') {
      const model = settings.model || 'gemini-2.0-flash';
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + settings.apiKey.trim();
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK.' }] }]
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.error?.message || ('Gemini error ' + res.status) };
      }
      return { success: true, message: 'Gemini connected! Live AI storytelling is ready.' };
    }

    if (settings.provider === 'grok') {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + settings.apiKey.trim()
        },
        body: JSON.stringify({
          model: settings.model || 'grok-2-mini',
          messages: [{ role: 'user', content: 'Respond with OK.' }],
          max_tokens: 10
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.error?.message || ('Grok error ' + res.status) };
      }
      return { success: true, message: 'Grok connected! Live AI storytelling is ready.' };
    }

    if (settings.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + settings.apiKey.trim()
        },
        body: JSON.stringify({
          model: settings.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Respond with OK.' }],
          max_tokens: 10
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.error?.message || ('OpenAI error ' + res.status) };
      }
      return { success: true, message: 'OpenAI connected! Live AI storytelling is ready.' };
    }

    return { success: false, message: 'Unknown AI provider.' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Connection test failed.' };
  }
}

interface AIDilemmaRaw {
  title: string;
  description: string;
  dangerLevel?: 'low' | 'medium' | 'high' | 'critical';
  choices: Array<{
    text: string;
    requiredSkill?: { skill: 'combat' | 'medical' | 'stealth' | 'crafting' | 'fitness'; minLevel: number };
    consequenceSummary?: string;
    outcomeTitle: string;
    outcomeText: string;
    log: string;
    hpDelta?: number;
    sanityDelta?: number;
    itemFound?: { name: string; category: 'food' | 'water' | 'medical' | 'weapon' | 'tool' | 'resource'; quantity: number };
  }>;
}

export async function generateAIDilemma(state: GameState): Promise<EventDilemma | null> {
  const settings = getAISettings();
  if (!settings.enabled || !settings.apiKey.trim()) {
    return null;
  }

  const loc = getCurrentLocationName(state);
  const recentLogs = state.logs.slice(-4).map(l => '[Day ' + l.day + ' ' + l.timestamp + ']: ' + l.text).join('\n');
  const itemsSummary = state.inventory.map(i => i.name + ' (x' + i.quantity + ')').join(', ') || 'Empty pockets';

  const systemPrompt = 'You are the AI Game Master for DeadLife, a post-apocalyptic zombie survival simulator.\n' +
    'Current Situation:\n' +
    '- Survivor: ' + state.player.name + ', Age ' + state.player.age + ', Job: ' + state.player.profession + '\n' +
    '- Current Location: ' + loc + ' (' + (!state.startingLocation.hasLeftStartingSpot ? 'Initial spawn workplace' : state.shelter.isEstablished ? 'Fortified Base' : 'Roaming in ruins') + ')\n' +
    '- Day: ' + state.day + ', Weather: ' + state.weather + ', Temp: ' + state.temperatureCelsius + 'C\n' +
    '- Vitals: HP ' + state.player.health + '%, Hunger ' + state.player.hunger + '%, Thirst ' + state.player.thirst + '%, Sanity ' + state.player.sanity + '%\n' +
    '- Injuries: ' + (state.player.statusEffects.map(e => e.name).join(', ') || 'Healthy') + '\n' +
    '- Supplies: ' + itemsSummary + '\n' +
    '- Recent History:\n' + recentLogs + '\n\n' +
    'Write a unique survival dilemma happening right now specifically at ' + loc + '.\n' +
    'Rules:\n' +
    '1. Ground it specifically in ' + loc + '. Do not assume a suburban house.\n' +
    '2. Use simple, natural English. No military jargon.\n' +
    '3. Provide 2 or 3 choices with consequences.\n' +
    '4. Return ONLY a valid JSON object matching this structure:\n' +
    '{\n' +
    '  "title": "Short Title",\n' +
    '  "description": "2-3 sentences explaining what dilemma happened at ' + loc + '",\n' +
    '  "dangerLevel": "medium",\n' +
    '  "choices": [\n' +
    '    {\n' +
    '      "text": "Action to take",\n' +
    '      "consequenceSummary": "Hint of risk/reward",\n' +
    '      "outcomeTitle": "Outcome Title",\n' +
    '      "outcomeText": "2 sentences of what happened",\n' +
    '      "log": "1 sentence chronicle log",\n' +
    '      "hpDelta": 0,\n' +
    '      "sanityDelta": 0\n' +
    '    }\n' +
    '  ]\n' +
    '}';

  try {
    let jsonText = '';

    if (settings.provider === 'gemini') {
      const model = settings.model || 'gemini-2.0-flash';
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + settings.apiKey.trim();
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!res.ok) return null;
      const data = await res.json();
      jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      const endpoint = settings.provider === 'grok'
        ? 'https://api.x.ai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      const model = settings.provider === 'grok'
        ? (settings.model || 'grok-2-mini')
        : (settings.model || 'gpt-4o-mini');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + settings.apiKey.trim()
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You respond only in raw JSON.' },
            { role: 'user', content: systemPrompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!res.ok) return null;
      const data = await res.json();
      jsonText = data.choices?.[0]?.message?.content || '';
    }

    if (!jsonText) return null;
    const parsed: AIDilemmaRaw = JSON.parse(jsonText.replace(/```json/g, '').replace(/```/g, '').trim());
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.choices) || parsed.choices.length === 0) {
      return null;
    }

    const dilemma: EventDilemma = {
      id: 'ai_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      title: parsed.title,
      category: 'discovery',
      dangerLevel: parsed.dangerLevel || 'medium',
      description: parsed.description,
      choices: parsed.choices.map((c, idx) => ({
        id: 'ai_choice_' + idx + '_' + Date.now(),
        text: c.text,
        requiredSkill: c.requiredSkill,
        consequenceSummary: c.consequenceSummary,
        execute: (currentState: GameState) => {
          let hp = currentState.player.health;
          let san = currentState.player.sanity;
          let isFatal = false;
          let deathCause = currentState.player.deathCause;

          if (c.hpDelta) {
            hp = Math.max(0, Math.min(100, hp + c.hpDelta));
            if (hp <= 0) {
              isFatal = true;
              deathCause = 'killed during encounter: ' + c.outcomeTitle;
            }
          }
          if (c.sanityDelta) {
            san = Math.max(0, Math.min(100, san + c.sanityDelta));
          }

          let inv = [...currentState.inventory];
          if (c.itemFound && c.itemFound.name) {
            const itemId = c.itemFound.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const ex = inv.find(i => i.id === itemId || i.name === c.itemFound!.name);
            if (ex) {
              inv = inv.map(i => (i.id === ex.id ? { ...i, quantity: i.quantity + (c.itemFound!.quantity || 1) } : i));
            } else {
              inv.push({
                id: itemId,
                name: c.itemFound.name,
                category: c.itemFound.category || 'food',
                quantity: c.itemFound.quantity || 1,
                description: 'Found during encounter.'
              });
            }
          }

          return {
            state: {
              ...currentState,
              inventory: inv,
              player: {
                ...currentState.player,
                health: hp,
                sanity: san,
                isDead: isFatal,
                deathCause
              }
            },
            log: c.log || c.outcomeTitle,
            outcomeTitle: c.outcomeTitle,
            outcomeText: c.outcomeText,
            isFatal
          };
        }
      }))
    };

    return dilemma;
  } catch (e) {
    console.warn('AI dilemma generation failed, falling back to local events:', e);
    return null;
  }
}
