import React from 'react';
import { GameState } from '../types/game';
import { 
  Biohazard, Shield, HeartPulse, Flame, 
  CheckCircle2, Pill, Activity, X, Droplet
} from 'lucide-react';

interface Props {
  state: GameState;
  onClose: () => void;
  onTreatInfection: (treatmentType: 'antibiotics' | 'bandage' | 'cauterize') => void;
}

export const InfectionModal: React.FC<Props> = ({ state, onClose, onTreatInfection }) => {
  const { player, mutationStrain, inventory } = state;
  const infection = player.infectionRisk || 0;
  const isBitten = player.isBitten || infection > 0;
  const daysInfected = player.infectionDays || 0;

  // Inventory supplies check
  const antibioticItem = inventory.find(i => 
    i.id.includes('antibiotic') || i.name.toLowerCase().includes('antibiotic')
  );
  const antibioticCount = antibioticItem ? antibioticItem.quantity : 0;

  const bandageItem = inventory.find(i => 
    i.id.includes('bandage') || i.id.includes('first_aid') || i.name.toLowerCase().includes('bandage')
  );
  const bandageCount = bandageItem ? bandageItem.quantity : 0;

  // Determine stage info
  const getStageInfo = (pct: number) => {
    if (pct === 0) {
      return {
        stage: 'Pristine / Uninfected',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/20',
        barColor: 'bg-emerald-500',
        description: 'No active viral load or foreign necrosis detected. Cellular antibodies are functioning at full capacity.',
        symptoms: 'Normal body temperature (37°C), steady heart rate, no cognitive impairment.'
      };
    }
    if (pct < 25) {
      return {
        stage: 'Stage I: Latent Incubation',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/20',
        barColor: 'bg-amber-500',
        description: 'Viral replication is localizing around the wound margins. Puncture tissues are inflamed with low-grade fever.',
        symptoms: 'Throbbing puncture, mild fever (38°C), night sweats, localized burning sensation.'
      };
    }
    if (pct < 50) {
      return {
        stage: 'Stage II: Vascular Sepsis',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/20',
        barColor: 'bg-orange-500',
        description: 'Pathogen has breached lymph barriers and entered the bloodstream. Dark necrotic discoloration radiating through veins.',
        symptoms: 'Nausea, cold chills, dark vein spiderwebbing, persistent headache (-5% HP daily).'
      };
    }
    if (pct < 75) {
      return {
        stage: 'Stage III: Neuro-Delirium',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/20',
        barColor: 'bg-rose-500 animate-pulse',
        description: 'Pathogen crossing the blood-brain barrier. Neurological inflammation causing intense fever spikes and cognitive distortions.',
        symptoms: 'Spiking fever (41°C), auditory hallucinations, photophobia, motor disorientation (-10% HP daily).'
      };
    }
    return {
      stage: 'Stage IV: Terminal Mutation',
      color: 'text-red-500',
      bgColor: 'bg-red-500/20 border-red-500/40',
      barColor: 'bg-red-600 animate-pulse',
      description: 'Host central nervous system under severe viral takeover. Full cellular transformation imminent unless suppressed immediately.',
      symptoms: 'Involuntary muscle tremors, black ocular veins, cognitive blackouts (-15% HP daily). Brainstem failure at 100%.'
    };
  };

  const stageInfo = getStageInfo(infection);

  // Daily progression forecast
  const getProgressionRate = () => {
    let rate = 4;
    if (mutationStrain) {
      if (mutationStrain.id === 'crimson_rabies') rate += 5;
      else if (mutationStrain.id === 'toxic_spore_bloom') rate += 3;
      else if (mutationStrain.id === 'glacial_stasis') rate += 3;
      else if (mutationStrain.id === 'necrotic_carapace') rate -= 1;
    }
    if (player.biteTreated) rate -= 2;
    if (player.traits && player.traits.some(t => t.id === 'thick_skinned' || t.id === 'stoic')) rate -= 1;
    return Math.max(1, rate);
  };

  const dailyRate = getProgressionRate();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 my-auto relative text-zinc-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl border ${stageInfo.bgColor}`}>
              <Biohazard className={`w-6 h-6 ${stageInfo.color}`} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Viral Infection Diagnosis
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                {mutationStrain ? `${mutationStrain.name} (${mutationStrain.codeName})` : 'Pathogen Telemetry'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viral Progress Card */}
        <div className={`p-4 rounded-2xl border ${stageInfo.bgColor} space-y-3`}>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Current Viral Load
              </span>
              <div className={`text-3xl font-black font-mono ${stageInfo.color}`}>
                {infection}%
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${stageInfo.bgColor} ${stageInfo.color}`}>
                {stageInfo.stage}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-white/5 relative">
              <div
                className={`h-full transition-all duration-500 ${stageInfo.barColor}`}
                style={{ width: `${Math.max(infection === 0 ? 0 : 4, infection)}%` }}
              />
              {/* Threshold markers */}
              <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                <span className="border-r border-white h-full" style={{ left: '25%' }} />
                <span className="border-r border-white h-full" style={{ left: '50%' }} />
                <span className="border-r border-white h-full" style={{ left: '75%' }} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5">
              <span>0% Clean</span>
              <span>25% Incubation</span>
              <span>50% Sepsis</span>
              <span>75% Delirium</span>
              <span>100% Turn</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {stageInfo.description}
          </p>

          <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 text-[11px] space-y-1">
            <div className="text-zinc-400 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              <strong>Active Clinical Signs:</strong>
            </div>
            <p className="text-zinc-300 pl-5">
              {stageInfo.symptoms}
            </p>
          </div>
        </div>

        {/* Wound & Exposure Intel */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-white/5 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-400" /> Exposure Status
            </span>
            <span className={isBitten ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isBitten ? 'Bite Contamination' : 'Clean'}
            </span>
          </div>

          {isBitten ? (
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500 block">Wound Site:</span>
                <span className="font-medium text-zinc-200 capitalize">{player.infectionLocation || 'Forearm Bite'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Time Infected:</span>
                <span className="font-medium text-zinc-200">{daysInfected} Days</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Wound Dressing:</span>
                <span className={player.biteTreated ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                  {player.biteTreated ? 'Sterile Dressing Applied' : 'Untreated Open Puncture'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Progression Rate:</span>
                <span className="font-medium text-rose-400">+{dailyRate}% per day</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-400 text-[11px] leading-relaxed flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Skin intact. No zombie bites, animal punctures, or necrotic tissue detected.</span>
            </div>
          )}
        </div>

        {/* Active Strain Special Vectors */}
        {mutationStrain && (
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-rose-300 font-bold text-[11px]">
              <span className="flex items-center gap-1">
                <Biohazard className="w-3.5 h-3.5" /> {mutationStrain.name} Characteristics
              </span>
              <span className="font-mono text-[10px] text-zinc-400">{mutationStrain.codeName}</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-snug">
              {mutationStrain.ruleSummary}
            </p>
          </div>
        )}

        {/* Treatments & Triage */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
            <span>Emergency Medical Triage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Take Antibiotics */}
            <button
              type="button"
              disabled={antibioticCount === 0 || infection === 0}
              onClick={() => onTreatInfection('antibiotics')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                antibioticCount > 0 && infection > 0
                  ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-white active:scale-95'
                  : 'bg-white/[0.02] border-white/5 text-zinc-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                  <Pill className="w-3.5 h-3.5" /> Take Antibiotics
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/5">
                  {antibioticCount} left
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                -25% Viral Load
              </span>
            </button>

            {/* Sterilize & Dress Wound */}
            <button
              type="button"
              disabled={bandageCount === 0 || !isBitten || player.biteTreated}
              onClick={() => onTreatInfection('bandage')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                bandageCount > 0 && isBitten && !player.biteTreated
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-white active:scale-95'
                  : 'bg-white/[0.02] border-white/5 text-zinc-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                  <Shield className="w-3.5 h-3.5" /> Sterilize Wound
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/5">
                  {bandageCount} left
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                -10% Load & Halves Growth
              </span>
            </button>

            {/* Cauterize Bite */}
            <button
              type="button"
              disabled={infection < 20}
              onClick={() => onTreatInfection('cauterize')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                infection >= 20
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-white active:scale-95'
                  : 'bg-white/[0.02] border-white/5 text-zinc-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5 text-rose-300">
                  <Flame className="w-3.5 h-3.5" /> Cauterize Bite
                </span>
                <span className="text-[10px] font-mono text-rose-400">
                  -15 HP
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                -20% Viral Load
              </span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs active:scale-98 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
