import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Headphones } from 'lucide-react';

export const FocusSoundscape: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<'brown' | 'rain' | 'lofi'>('brown');
  const [volume, setVolume] = useState(0.4);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const presets = [
    { id: 'brown' as const, label: 'Deep Brown Noise', desc: 'ADHD focus & noise cancellation' },
    { id: 'rain' as const, label: 'Midnight Rain', desc: 'Gentle raindrops & soft storm' },
    { id: 'lofi' as const, label: 'Lofi Chords Drone', desc: 'Warm analog synthesizer resonance' },
  ];

  const stopAudio = () => {
    if (noiseNodeRef.current) {
      try {
        // @ts-ignore
        noiseNodeRef.current.stop?.();
        noiseNodeRef.current.disconnect();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
  };

  const startAudio = (type: 'brown' | 'rain' | 'lofi') => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    } else if (type === 'rain') {
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = white * (Math.random() > 0.3 ? 0.35 : 0.05);
      }
    } else {
      // Warm lofi harmonic drone
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        output[i] =
          Math.sin(2 * Math.PI * 110 * t) * 0.3 +
          Math.sin(2 * Math.PI * 164.81 * t) * 0.2 +
          Math.sin(2 * Math.PI * 220 * t) * 0.15;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm it up
    const filter = ctx.createBiquadFilter();
    filter.type = type === 'rain' ? 'bandpass' : 'lowpass';
    filter.frequency.value = type === 'rain' ? 800 : 400;

    whiteNoise.connect(filter);
    filter.connect(gainNode);

    whiteNoise.start(0);
    noiseNodeRef.current = whiteNoise;
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(activePreset);
      setIsPlaying(true);
    }
  };

  const handlePresetSelect = (preset: 'brown' | 'rain' | 'lofi') => {
    setActivePreset(preset);
    if (isPlaying) {
      startAudio(preset);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="p-4 rounded-2xl glass-card border-white/[0.08] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Headphones size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display">
              Focus Soundscape
            </h4>
            <p className="text-[10px] text-zinc-400">
              Noise mask to drown out distractions
            </p>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all active:scale-95 ${
            isPlaying
              ? 'bg-purple-600 text-white shadow-purple-600/30'
              : 'bg-zinc-800 text-zinc-300 hover:text-white border border-white/10'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={12} />
              <span>Playing</span>
            </>
          ) : (
            <>
              <Play size={12} />
              <span>Play</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset.id)}
            className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
              activePreset === preset.id
                ? 'bg-purple-950/40 border-purple-500/50 text-white'
                : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <p className="font-semibold truncate">{preset.label}</p>
          </button>
        ))}
      </div>

      {/* Volume Slider */}
      {isPlaying && (
        <div className="flex items-center gap-2 pt-1 text-zinc-400 text-xs">
          <button
            onClick={() => setVolume((v) => (v === 0 ? 0.4 : 0))}
            className="hover:text-white"
          >
            {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-purple-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
