import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Edit3, 
  Share2, 
  Check, 
  Sparkles, 
  Layers, 
  Grid, 
  Radio, 
  Music,
  X
} from 'lucide-react';
import { User, Post } from '../types';
import { PostCard } from './PostCard';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  userPosts: Post[];
  onUpdateProfile: (updated: Partial<User>) => Promise<void>;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onOpenMarketplace: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  userPosts,
  onUpdateProfile,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  onOpenMarketplace
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'badges' | 'about'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form edit states
  const [displayName, setDisplayName] = useState(user.displayName);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [website, setWebsite] = useState(user.website || '');
  const [isSaving, setIsSaving] = useState(false);

  const isSelf = user.id === currentUser.id;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        displayName,
        handle,
        bio,
        location,
        website
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#user-${user.handle}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      
      {/* 1. Profile Header Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Banner with Canvas Edit Button */}
        <div className="relative h-44 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={user.bannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {isSelf && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-semibold border border-white/20 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Edit Canvas Banner</span>
            </button>
          )}

          {user.uuid && (
            <div className="absolute bottom-3 right-4 hidden sm:block text-[10px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              UUID: {user.uuid}
            </div>
          )}
        </div>

        {/* User Identity Details & Controls */}
        <div className="px-4 sm:px-8 pb-6 relative">
          
          {/* Avatar and Top Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            
            {/* Avatar with Glow and Badge Ring */}
            <div className="relative inline-block">
              <div className="relative p-1 rounded-full bg-white shadow-md">
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-cyan-500"
                />
              </div>
              {user.isVerified && (
                <div 
                  className="absolute bottom-1 right-1 w-7 h-7 bg-cyan-500 text-slate-950 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  title="Verified Creator"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {isSelf ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={onOpenMarketplace}
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs sm:text-sm font-bold rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    <span>Badge Wardrobe ({user.equippedBadgeIds?.length || 2}/4)</span>
                  </button>
                </>
              ) : (
                <button className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm">
                  Follow
                </button>
              )}

              <button
                onClick={handleShareProfile}
                className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                title="Share profile"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Name, Handle, Role, Sparks */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {user.displayName}
                </h1>
                {user.role && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-900 border border-cyan-200">
                    {user.role}
                  </span>
                )}
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold font-mono">
                  <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500" />
                  <span>{user.sparksBalance.toLocaleString()} Sparks</span>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-500 mt-0.5">
                @{user.handle}
              </div>
            </div>

            {/* Bio & Manifesto */}
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed whitespace-pre-line">
              {user.bio}
            </p>

            {/* Metadata (Location, Website, Joined) */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-slate-500 pt-1">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-600 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{user.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.joinedDate}</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-sm">
              <div>
                <span className="font-extrabold text-slate-900 mr-1 font-mono">
                  {userPosts.length || user.stats.postsCount}
                </span>
                <span className="text-slate-500">Posts</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 mr-1 font-mono">
                  {user.stats.followersCount.toLocaleString()}
                </span>
                <span className="text-slate-500">Followers</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 mr-1 font-mono">
                  {user.stats.followingCount.toLocaleString()}
                </span>
                <span className="text-slate-500">Following</span>
              </div>
            </div>

          </div>

        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-200 px-4 sm:px-8 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-cyan-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'media'
                ? 'border-cyan-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Media & Stems
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'badges'
                ? 'border-cyan-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Equipped Insignias ({user.equippedBadgeIds?.length || 2})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'about'
                ? 'border-cyan-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Credentials & Node Info
          </button>
        </div>

      </div>

      {/* 2. Tab Contents */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
              No posts published yet.
            </div>
          ) : (
            userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLikePost}
                onBookmark={onBookmarkPost}
                onRepost={onRepostPost}
                onAddComment={onAddComment}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userPosts
            .flatMap(p => p.mediaUrls.map(url => ({ url, title: p.content, id: p.id })))
            .map((item, idx) => (
              <div key={idx} className="aspect-square bg-slate-950 rounded-xl overflow-hidden group relative">
                <img src={item.url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white text-xs font-semibold text-center">
                  <span className="line-clamp-2">{item.title}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Equipped Profile Badges</h3>
              <p className="text-xs text-slate-500">Badges radiate live glows across chat rooms, audio stages, and feeds.</p>
            </div>
            <button
              onClick={onOpenMarketplace}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
            >
              Browse Badge Store
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/50 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-cyan-700 uppercase">MYTHIC EDITION</div>
                <div className="font-extrabold text-slate-900 text-sm">Cyber Aurora Prism</div>
                <div className="text-xs text-slate-600 mt-1">Iridescent chromatic ring bound to avatar.</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-2">Active in Slot 1</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-purple-700 uppercase">ALPHA GENESIS</div>
                <div className="font-extrabold text-slate-900 text-sm">Alpha Vanguard</div>
                <div className="text-xs text-slate-600 mt-1">Golden-purple wings insignia given to pioneer node explorers.</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-2">Active in Slot 2</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Identity & Account Credentials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">Account UUID</span>
              <span className="font-mono text-slate-800">{user.uuid || 'b79a0e44-9f82-411a-b33a-14d24597ef01'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">Primary Email</span>
              <span className="font-mono text-slate-800">alex.rivera@bluemountain.network</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">Two-Factor Authentication</span>
              <span className="text-emerald-700 font-semibold">Hardware Key / TOTP Active</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">Local Shaders & IndexDB Cache</span>
              <span className="text-slate-800 font-mono">184.2 MB Cached (Clean)</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Edit Profile Information</h2>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Platform Handle (@)</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bio & Manifesto</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
