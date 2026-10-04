import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 flex flex-col items-center justify-center p-0 md:p-6 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop view switcher bar (only visible on md+ screens) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-md mb-3 px-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-zinc-300">VIBE Mobile Live Preview</span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDeviceFrameMode(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              deviceFrameMode ? 'bg-purple-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone size={12} />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setDeviceFrameMode(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              !deviceFrameMode ? 'bg-purple-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor size={12} />
            <span>Expanded</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          deviceFrameMode
            ? 'max-w-md min-h-screen md:min-h-[844px] md:max-h-[92vh] md:rounded-[44px] md:border-[8px] md:border-zinc-800/90 md:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_80px_rgba(139,92,246,0.15)] bg-[#09090c] overflow-y-auto overflow-x-hidden md:ring-1 md:ring-white/10'
            : 'max-w-3xl min-h-screen md:rounded-3xl md:border border-white/10 bg-[#09090c] overflow-y-auto'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
