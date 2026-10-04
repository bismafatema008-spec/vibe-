import React from 'react';
import { Home, Sparkles, Users, TrendingUp, User } from 'lucide-react';
import { TabType } from '../../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTaskCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTaskCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'vibe' as TabType, label: 'Vibe', icon: Sparkles },
    { id: 'rooms' as TabType, label: 'Rooms', icon: Users },
    { id: 'progress' as TabType, label: 'Progress', icon: TrendingUp },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-6 pt-2 pointer-events-none">
      <div className="glass-panel rounded-2xl p-1.5 flex items-center justify-around pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-xl bg-[#101015]/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/10" />
              )}
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 text-purple-400' : ''
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {tab.id === 'home' && pendingTaskCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#101015]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-zinc-100 font-semibold' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
