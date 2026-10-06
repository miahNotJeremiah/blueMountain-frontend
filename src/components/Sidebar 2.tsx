import React from 'react';
import { 
  Home, 
  Compass, 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Settings, 
  Sliders, 
  Check, 
  Sparkles,
  Radio,
  Layers,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  palette: string;
  setPalette: (palette: string) => void;
  onOpenBackendArch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  palette,
  setPalette,
  onOpenBackendArch
}) => {
  const navItems = [
    { id: 'feed', label: 'Home Feed', icon: Home, badge: null },
    { id: 'explore', label: 'Explore Tree', icon: Compass, badge: 'ALGO', badgeColor: 'text-[#00F2FE] bg-cyan-950/80 border border-cyan-500/40' },
    { id: 'notifications', label: 'Activity Stream', icon: Bell, badge: unreadCount > 0 ? unreadCount : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'channels', label: 'Channels', icon: MessageSquare, badge: 'PRO', badgeColor: 'text-purple-300 bg-purple-950/80 border border-purple-500/40' },
    { id: 'marketplace', label: 'Insignia Store', icon: ShoppingBag, badge: 'SPARKS', badgeColor: 'text-amber-300 bg-amber-950/80 border border-amber-500/40' },
    { id: 'settings', label: 'Preferences', icon: Settings, badge: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 lg:w-64 liquid-glass my-4 ml-3 p-4 justify-between h-[calc(100vh-6rem)] sticky top-20 shrink-0 select-none shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
      
      {/* Primary Navigation Links */}
      <div className="space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          MAIN INTERFACE
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                isActive 
                  ? 'bg-white/[0.08] text-white border border-[#00F2FE]/60 shadow-[0_0_24px_rgba(0,242,254,0.35)] translate-x-1' 
                  : 'ghost-btn'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#00F2FE] stroke-[2.5]' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-[#00F2FE] text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.6)]' 
                    : item.badgeColor || 'bg-white/[0.06] text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Live Audio Stages quick sub-bar */}
        <div className="pt-4 mt-3 border-t border-white/[0.08]">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>LIVE AUDIO STAGES</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          <div 
            onClick={() => setActiveTab('channels')}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white ghost-btn rounded-xl cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="truncate">Live Ambient Jam</span>
            <span className="ml-auto text-[9px] font-mono text-[#00F2FE] bg-cyan-950/80 border border-cyan-500/40 px-1.5 py-0.2 rounded font-bold">
              3 LIVE
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('channels')}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white ghost-btn rounded-xl cursor-pointer mt-1"
          >
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Dev Hangout</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Backend Architecture quick-info + Preset Palettes */}
      <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
        
        {/* Backend Stack button */}
        <button
          onClick={onOpenBackendArch}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl ghost-btn text-left group"
        >
          <div>
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              API Service Stack
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Node:3000 • Redis • MinIO
            </div>
          </div>
          <Layers className="w-4 h-4 text-slate-400 group-hover:text-[#00F2FE] transition-colors" />
        </button>

        {/* Preset Palettes Switcher */}
        <div className="px-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="uppercase text-[10px] font-bold">SPATIAL HUD</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00F2FE] shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
            <span className="w-3 h-3 rounded-full bg-[#8B5CF6] opacity-70" />
            <span className="w-3 h-3 rounded-full bg-[#EC4899] opacity-70" />
          </div>
        </div>

      </div>

    </aside>
  );
};
