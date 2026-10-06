import React, { useState } from 'react';
import { 
  Sparkles, 
  Shield, 
  Headphones, 
  Disc, 
  Cpu, 
  Mic, 
  Building2, 
  Moon, 
  Wand2, 
  Zap, 
  Crown, 
  Radio, 
  Award, 
  Code2, 
  Check, 
  AlertCircle,
  Package,
  Layers
} from 'lucide-react';
import { BadgeItem, User } from '../types';

interface MarketplaceViewProps {
  badges: BadgeItem[];
  currentUser: User;
  onPurchaseBadge: (badgeId: string) => Promise<void>;
  onToggleEquipBadge: (badgeId: string) => Promise<void>;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  badges,
  currentUser,
  onPurchaseBadge,
  onToggleEquipBadge
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [previewingBadge, setPreviewingBadge] = useState<BadgeItem | null>(badges[0] || null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Map icon strings to Lucide icons
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Shield': return Shield;
      case 'Headphones': return Headphones;
      case 'Disc': return Disc;
      case 'Cpu': return Cpu;
      case 'Mic': return Mic;
      case 'Building2': return Building2;
      case 'Moon': return Moon;
      case 'Wand2': return Wand2;
      case 'Zap': return Zap;
      case 'Crown': return Crown;
      case 'Award': return Award;
      default: return Code2;
    }
  };

  const filteredBadges = badges.filter(badge => {
    const matchRarity = selectedRarity === 'all' || badge.rarity.toLowerCase() === selectedRarity.toLowerCase();
    const matchCategory = activeCategory === 'all' || 
      (activeCategory === 'audio' && badge.category.includes('Audio')) ||
      (activeCategory === 'genesis' && badge.category.includes('Genesis')) ||
      (activeCategory === 'creator' && badge.category.includes('Creator'));
    return matchRarity && matchCategory;
  });

  const handlePurchase = async (badge: BadgeItem) => {
    if (isProcessing) return;
    setIsProcessing(badge.id);
    try {
      await onPurchaseBadge(badge.id);
    } catch (err: any) {
      alert(err?.message || 'Failed to purchase badge');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEquip = async (badge: BadgeItem) => {
    if (isProcessing) return;
    setIsProcessing(badge.id);
    try {
      await onToggleEquipBadge(badge.id);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      
      {/* 1. Header Banner & Digital Goods Notice */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>OFFICIAL PROJECT BLUE MOUNTAIN BADGE STORE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Equip Insignias, Chat Flair & Emblems
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Equip exclusive profile insignias, animated chat flair, and channel nameplate emblems. Display your verified status and identity across Blue Mountain.
        </p>

        {/* Notice Callout */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-left flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Non-Refundable Digital Goods Notice: </span>
            Badges and insignias are digital cosmetics bound permanently to your account UUID upon purchase.
          </div>
        </div>
      </div>

      {/* 2. Spotlight of the Week: Cyber Aurora Prism (Screenshot 1) */}
      <div className="bg-[#0f1e33] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white text-[11px] font-mono font-bold uppercase">
                MYTHIC EDITION
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 text-[11px] font-mono font-bold uppercase">
                SPOTLIGHT OF THE WEEK
              </span>
              <span className="text-xs text-emerald-400 font-medium">● Live Season 1</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cyber Aurora Prism
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              The pinnacle insignia crafted for early Alpha innovators. Radiates an iridescent chromatic ring around your avatar across all community channels, dynamic audio stages, and the Explore Tree map.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-medium text-slate-200">
                ✦ Animated Gradient Profile Border
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-medium text-slate-200">
                ✦ Glowing Chat Insignia in Channels
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-medium text-slate-200">
                ✦ Particle Ring in Explore Tree
              </span>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-900/80 border border-slate-700 p-5 rounded-xl text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white font-mono">
                1,200 Sparks
              </div>
              <div className="text-xs text-slate-400">or $11.99 USD</div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  const b = badges.find(x => x.id === 'badge_cyber_aurora');
                  if (b) handlePurchase(b);
                }}
                disabled={isProcessing === 'badge_cyber_aurora'}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md"
              >
                {badges.find(x => x.id === 'badge_cyber_aurora')?.isOwned ? 'Owned In Wardrobe' : 'Purchase Badge'}
              </button>
              <button
                onClick={() => {
                  const b = badges.find(x => x.id === 'badge_cyber_aurora');
                  if (b) handleEquip(b);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors"
              >
                {badges.find(x => x.id === 'badge_cyber_aurora')?.isEquipped ? 'Equipped (Slot 1)' : 'Equip Preview'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Catalog Showcase Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Available Insignias & Badges</h3>
            <p className="text-xs text-slate-500">Select an insignia to preview in your profile showcase or purchase directly.</p>
          </div>

          {/* Sparks Balance Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-950 font-mono text-xs font-bold">
            <Zap className="w-4 h-4 text-cyan-600 fill-cyan-500" />
            <span>Balance: {currentUser.sparksBalance.toLocaleString()} Sparks</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            onClick={() => setActiveCategory('audio')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'audio' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Audio & Music
          </button>
          <button
            onClick={() => setActiveCategory('genesis')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'genesis' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Alpha Genesis
          </button>
          <button
            onClick={() => setActiveCategory('creator')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'creator' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Creator & Verified
          </button>

          {/* Rarity Dropdown */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Rarity:</span>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none"
            >
              <option value="all">All Rarities</option>
              <option value="mythic">Mythic</option>
              <option value="legendary">Legendary</option>
              <option value="epic">Epic</option>
              <option value="rare">Rare</option>
              <option value="common">Common</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.icon);
          const isOwned = badge.isOwned || currentUser.badges?.includes(badge.name);
          const isEquipped = badge.isEquipped || currentUser.equippedBadgeIds?.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`bg-white border rounded-xl p-4 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${
                isEquipped ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Rarity & Category Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    badge.rarity === 'Mythic' ? 'bg-purple-100 text-purple-700' :
                    badge.rarity === 'Legendary' ? 'bg-amber-100 text-amber-800' :
                    badge.rarity === 'Epic' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {badge.rarity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                    {badge.category}
                  </span>
                </div>

                {/* Badge Icon Emblem */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center mx-auto shadow-md">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* Title & Description */}
                <div className="text-center">
                  <h4 className="font-extrabold text-sm text-slate-900">{badge.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Shows In Tag */}
                <div className="text-[10px] text-slate-400 text-center font-medium bg-slate-50 py-1 rounded">
                  Shows in: {badge.showsIn}
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 font-mono">
                      {badge.priceSparks} Sparks
                    </div>
                    <div className="text-[10px] text-slate-400">({badge.priceUsd})</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Non-refundable</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreviewingBadge(badge)}
                    className="py-1.5 px-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Preview
                  </button>

                  {isOwned ? (
                    <button
                      onClick={() => handleEquip(badge)}
                      disabled={isProcessing === badge.id}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-colors ${
                        isEquipped
                          ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isEquipped ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(badge)}
                      disabled={isProcessing === badge.id || currentUser.sparksBalance < badge.priceSparks}
                      className="py-1.5 px-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition-colors"
                    >
                      {isProcessing === badge.id ? '...' : 'Buy Badge'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 5. Live Equip Preview Simulator (Screenshot 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-900">Equip Preview Simulator</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Currently Simulating: <strong className="text-cyan-600">{previewingBadge?.name || 'Cyber Aurora Prism'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Surface 1: Profile Popover */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Surface 1: Profile Popover
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500"
              />
              <div>
                <div className="font-bold text-slate-900">{currentUser.displayName} [VIP]</div>
                <div className="text-[10px] text-cyan-600 font-semibold flex items-center gap-1">
                  <span>✦ {previewingBadge?.name}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Equipped badges auto-sort by highest rarity on your public card.
            </p>
          </div>

          {/* Surface 2: Channel Chat Flair */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Surface 2: Channel Chat Flair
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-900">
                <span>{currentUser.displayName}</span>
                <span className="text-[10px] text-cyan-600 font-mono">[{previewingBadge?.rarity || 'MYTHIC'}]</span>
                <span className="text-[10px] text-slate-400 font-normal">Today at 4:21 PM</span>
              </div>
              <p className="text-slate-700">The lossless stage audio sounds incredible with the new soundcard node! 🚀</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Chat insignias display immediately beside your username handle.
            </p>
          </div>

          {/* Surface 3: Voice Stage Speaker */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Surface 3: Voice Stage Speaker
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{currentUser.displayName}</div>
                <div className="text-[10px] text-slate-500">Speaker • 320kbps • HOST PRO</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Speaker badges illuminate during active voice transmission.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
