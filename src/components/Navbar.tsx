import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Sparkles, 
  Server, 
  Database, 
  HardDrive, 
  Zap, 
  X,
  MessageSquare
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  unreadCount: number;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenBackendArch: () => void;
  onSearch: (query: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  unreadCount,
  onOpenCreate,
  onOpenNotifications,
  onOpenProfile,
  onOpenBackendArch,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050508]/65 backdrop-blur-[24px] saturate-[180%] border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand / Logo with Glimmer Accent */}
        <div className="flex items-center gap-3 min-w-fit">
          <div 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-2xl glimmer-gradient-bg flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-all">
              <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 19h20L12 3zm0 4l6.5 10.5h-13L12 7z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-extrabold tracking-tight text-white leading-tight">
                Project Blue Mountain
              </div>
              <div className="text-[10px] font-mono tracking-widest text-[#00F2FE] font-bold uppercase">
                HUD ALPHA 0.0.1
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search Bar in Liquid Glass wrapper */}
        <div className="flex-1 max-w-md mx-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search creators, synapses, feeds..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-14 py-2 text-xs sm:text-sm bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-white/[0.1] focus:border-[#00F2FE] focus:shadow-[0_0_20px_rgba(0,242,254,0.3)] rounded-2xl outline-none transition-all placeholder:text-slate-400 text-white backdrop-blur-[12px]"
            />
            {searchQuery ? (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); onSearch(''); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono font-medium text-slate-400 border border-white/[0.1] rounded-lg px-1.5 py-0.5 absolute right-3 top-1/2 -translate-y-1/2 bg-white/[0.03] pointer-events-none">
                Ctrl+K
              </span>
            )}
          </form>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Backend Stack Architecture Badge Button */}
          <button
            onClick={onOpenBackendArch}
            title="Backend Stack: Node.js (3000), Redis (6379), MinIO (9000), PostgreSQL (5432)"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold text-slate-300 ghost-btn rounded-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] text-white">API Stack</span>
            <span className="text-[#00F2FE] text-[10px]">:3000</span>
          </button>

          {/* Sparks Currency Chip */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl ghost-btn text-xs">
            <Zap className="w-3.5 h-3.5 text-[#00F2FE] fill-[#00F2FE]" />
            <span className="text-[11px] font-semibold tracking-wide text-slate-300">
              SPARKS:
            </span>
            <span className="font-extrabold text-[#00F2FE] font-mono">
              {currentUser.sparksBalance.toLocaleString()}
            </span>
          </div>

          {/* + Create Button with Dynamic Glimmer Gradient */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 glimmer-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_28px_rgba(0,242,254,0.6)] transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 ghost-btn rounded-2xl text-slate-300 hover:text-white"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 ghost-btn rounded-2xl text-left"
            title="Your Profile"
          >
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.4)]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-black" />
            </div>
            <div className="hidden xl:block pr-2">
              <div className="text-xs font-extrabold text-white leading-tight">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] font-mono text-[#00F2FE] font-bold">
                [{currentUser.role}]
              </div>
            </div>
          </button>

        </div>
      </div>
    </header>
  );
};
