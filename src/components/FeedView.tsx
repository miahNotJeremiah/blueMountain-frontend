import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Image as ImageIcon, 
  Music, 
  Filter, 
  ArrowRight,
  TrendingUp,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { Post, User, Story } from '../types';
import { PostCard } from './PostCard';

interface FeedViewProps {
  posts: Post[];
  currentUser: User;
  stories: Story[];
  suggestedCreators: User[];
  feedFilter: 'following' | 'foryou';
  setFeedFilter: (f: 'following' | 'foryou') => void;
  activeTagFilter: string | null;
  setActiveTagFilter: (t: string | null) => void;
  onOpenCreate: () => void;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onToggleFollow: (userId: string) => void;
  onOpenAuthorProfile: (username: string) => void;
  onSelectStory: (story: Story) => void;
  isAlgorithmEnabled?: boolean;
  onToggleAlgorithm?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  stories,
  suggestedCreators,
  feedFilter,
  setFeedFilter,
  activeTagFilter,
  setActiveTagFilter,
  onOpenCreate,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  onToggleFollow,
  onOpenAuthorProfile,
  onSelectStory,
  isAlgorithmEnabled = true,
  onToggleAlgorithm
}) => {
  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Feed Column (8 cols on large screens) */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          
          {/* 1. Horizontal Stories Tray (Liquid Glass Surface) */}
          <div className="liquid-glass p-3.5 sm:p-4.5 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => onSelectStory(story)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group select-none"
                >
                  <div className="relative">
                    {/* Glowing Liquid Glass Ring */}
                    <div className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                      story.user.isLive 
                        ? 'glimmer-gradient-bg ring-2 ring-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.6)] animate-pulse'
                        : story.user.hasUnseen 
                          ? 'bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] p-0.5' 
                          : 'bg-white/[0.1]'
                    }`}>
                      <img
                        src={story.user.avatarUrl}
                        alt={story.user.displayName}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-black"
                      />
                    </div>

                    {/* Live Badge */}
                    {story.user.isLive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-mono font-bold rounded uppercase tracking-wider shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                        LIVE
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-300 max-w-[70px] truncate text-center group-hover:text-[#00F2FE]">
                    {story.user.displayName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Feed Tabs & Quick Composer Bar (Liquid Glass Surface) */}
          <div className="liquid-glass p-4 sm:p-5 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
            
            {/* Feed Segment Tabs */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setFeedFilter('following')}
                  className={`relative text-xs sm:text-sm font-extrabold pb-2 transition-all tracking-wide ${
                    feedFilter === 'following' 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Following</span>
                  {feedFilter === 'following' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F2FE] rounded-full shadow-[0_0_12px_rgba(0,242,254,0.8)]" />
                  )}
                </button>

                <button
                  onClick={() => setFeedFilter('foryou')}
                  className={`relative text-xs sm:text-sm font-extrabold pb-2 transition-all tracking-wide ${
                    feedFilter === 'foryou' 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>For You</span>
                  {feedFilter === 'foryou' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F2FE] rounded-full shadow-[0_0_12px_rgba(0,242,254,0.8)]" />
                  )}
                </button>
              </div>

              {/* Algorithm Status & Active Filter */}
              <div className="flex items-center gap-2">
                {onToggleAlgorithm && (
                  <button
                    onClick={onToggleAlgorithm}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-mono font-bold transition-all ghost-btn ${
                      isAlgorithmEnabled
                        ? 'border-[#00F2FE]/50 text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                        : 'text-slate-400'
                    }`}
                    title={isAlgorithmEnabled ? 'Click to disable algorithm and use chronological feed' : 'Click to enable algorithm'}
                  >
                    <span className={`w-2 h-2 rounded-full ${isAlgorithmEnabled ? 'bg-[#00F2FE] animate-ping' : 'bg-slate-500'}`} />
                    <span>{isAlgorithmEnabled ? 'ALGO: ACTIVE' : 'ALGO: OFF'}</span>
                  </button>
                )}

                {/* Active tag indicator */}
                {activeTagFilter && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">Filtered:</span>
                    <span className="font-bold text-[#00F2FE] bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-lg">
                      #{activeTagFilter}
                    </span>
                    <button
                      onClick={() => setActiveTagFilter(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Composer Trigger */}
            <div 
              onClick={onOpenCreate}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.4)] shrink-0"
              />
              <div className="flex-1 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] focus-within:border-[#00F2FE] rounded-2xl text-xs sm:text-sm text-slate-400 transition-all">
                What's resonating? Broadcast audio patch, GLSL shader stem, or manifesto...
              </div>
              <button
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 glimmer-gradient-bg text-slate-950 text-xs font-extrabold rounded-2xl shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>

          </div>

          {/* 3. Posts Stream */}
          <div className="space-y-5 sm:space-y-6">
            {posts.length === 0 ? (
              <div className="liquid-glass p-12 text-center space-y-3">
                <p className="text-slate-400 text-sm">No posts found matching this filter.</p>
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className="px-4 py-2 glimmer-gradient-bg text-slate-950 font-bold text-xs rounded-2xl shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={onLikePost}
                  onBookmark={onBookmarkPost}
                  onRepost={onRepostPost}
                  onAddComment={onAddComment}
                  onSelectTag={(tag) => setActiveTagFilter(tag)}
                  onOpenAuthorProfile={onOpenAuthorProfile}
                />
              ))
            )}
          </div>

          {/* 4. "You're All Caught Up" Milestone Banner */}
          <div className="liquid-glass p-6 sm:p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[#00F2FE] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,242,254,0.4)]">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              You're All Caught Up
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              You've seen all new broadcasts, audio stages, and releases across your spatial network.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-bold text-slate-300 ghost-btn rounded-2xl"
              >
                Browse Older Feed
              </button>
              <button
                onClick={() => setFeedFilter('foryou')}
                className="px-4 py-2 text-xs font-extrabold text-slate-950 glimmer-gradient-bg rounded-2xl shadow-[0_0_16px_rgba(0,242,254,0.4)]"
              >
                Explore New Pioneers
              </button>
            </div>
          </div>

        </div>

        {/* Right Rail: Suggested Creators & Community Info (Desktop only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-5 sticky top-20">
          
          {/* Suggested Creators Box (Liquid Glass Surface) */}
          <div className="liquid-glass p-5 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                PIONEERS TO FOLLOW
              </h3>
              <button className="text-[11px] font-bold text-[#00F2FE] hover:underline font-mono">
                SEE ALL
              </button>
            </div>

            <div className="space-y-3.5">
              {suggestedCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between gap-3">
                  <div 
                    onClick={() => onOpenAuthorProfile(creator.username)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                  >
                    <img
                      src={creator.avatarUrl}
                      alt={creator.displayName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-white/[0.1] group-hover:ring-[#00F2FE] transition-all"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-[#00F2FE] truncate">
                        {creator.displayName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate font-mono">
                        @{creator.handle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFollow(creator.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-2xl transition-all ${
                      creator.isFollowing
                        ? 'ghost-btn text-slate-300'
                        : 'glimmer-gradient-bg text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.3)] hover:scale-105'
                    }`}
                  >
                    {creator.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Meta Info */}
          <div className="px-3 text-[11px] text-slate-500 space-y-2 leading-relaxed font-mono">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <a href="#" className="hover:text-slate-300">ABOUT</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">BLUE MOUNTAIN</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">SPATIAL HUD</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">PRIVACY</a>
            </div>
            <div>
              Project Blue Mountain © 2026. Liquid Glass HUD Engine.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
