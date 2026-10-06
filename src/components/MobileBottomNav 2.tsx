import React from 'react';
import { Home, Compass, Plus, Bell, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreate: () => void;
  unreadCount: number;
  currentUser: User;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreate,
  unreadCount,
  currentUser
}) => {
  return (
    <div className="md:hidden fixed bottom-2 left-3 right-3 z-40 liquid-glass-elevated border border-white/[0.12] rounded-[28px] safe-area-bottom shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        
        {/* Home Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'feed' ? 'text-[#00F2FE] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-mono mt-0.5 font-bold">Home</span>
        </button>

        {/* Explore Neural Tree */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'explore' ? 'text-[#00F2FE] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-mono mt-0.5 font-bold">Tree</span>
        </button>

        {/* Center + Create Action with Glimmer Gradient */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenCreate}
            className="w-11 h-11 rounded-2xl glimmer-gradient-bg hover:scale-105 active:scale-95 text-slate-950 flex items-center justify-center shadow-[0_0_24px_rgba(0,242,254,0.5)] transition-all"
            aria-label="Create Post"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`relative flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'notifications' ? 'text-[#00F2FE] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-mono mt-0.5 font-bold">Alerts</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-black animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'profile' ? 'text-[#00F2FE] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt="Profile"
              className={`w-5 h-5 rounded-full object-cover ${
                activeTab === 'profile' ? 'ring-2 ring-[#00F2FE]' : ''
              }`}
            />
          </div>
          <span className="text-[9px] font-mono mt-0.5 font-bold">Profile</span>
        </button>

      </div>
    </div>
  );
};
