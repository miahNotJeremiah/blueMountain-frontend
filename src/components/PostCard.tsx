import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  Camera, 
  Music, 
  Send, 
  MoreHorizontal, 
  Check, 
  Disc,
  Sparkles
} from 'lucide-react';
import { Post, Comment, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onRepost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onSelectTag?: (tag: string) => void;
  onOpenAuthorProfile?: (username: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onBookmark,
  onRepost,
  onAddComment,
  onSelectTag,
  onOpenAuthorProfile
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const isCarousel = post.mediaType === 'carousel' && post.mediaUrls.length > 1;

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlideIndex < post.mediaUrls.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const toggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(post.id, commentText.trim());
      setCommentText('');
      setShowComments(true);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <article className="liquid-glass rounded-[28px] overflow-hidden border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/[0.18] transition-all duration-300 group">
      
      {/* 1. Author & Metadata Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Avatar with Story / Live Ring */}
          <div 
            onClick={() => onOpenAuthorProfile?.(post.author.username)}
            className="relative cursor-pointer shrink-0 group/avatar"
          >
            <img
              src={post.author.avatarUrl}
              alt={post.author.displayName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.4)] group-hover/avatar:scale-105 transition-transform"
            />
            {post.author.role && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-black/90 text-[#00F2FE] text-[8px] font-mono font-bold rounded border border-cyan-500/40">
                {post.author.role.includes('PRO') ? 'PRO' : 'VIP'}
              </span>
            )}
          </div>

          {/* User Handle & Post Context */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenAuthorProfile?.(post.author.username)}
                className="font-extrabold text-sm text-white hover:text-[#00F2FE] transition-colors truncate tracking-wide"
              >
                {post.author.displayName}
              </button>

              <span className="text-slate-500 text-xs">·</span>
              <span className="text-slate-400 text-xs font-mono">{post.createdAt}</span>

              {post.badgeTag && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-[#00F2FE] border border-cyan-500/40">
                  {post.badgeTag}
                </span>
              )}
            </div>

            {post.locationTag && (
              <div className="text-xs text-slate-400 truncate font-mono flex items-center gap-1 mt-0.5">
                <span>{post.locationTag}</span>
              </div>
            )}
          </div>
        </div>

        {/* Post Options Menu */}
        <div className="flex items-center gap-2">
          {post.author.role === 'PRO CREATOR' && (
            <button className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-2xl ghost-btn text-[#00F2FE]">
              Join Tier
            </button>
          )}
          <button 
            className="p-2 ghost-btn rounded-xl text-slate-400 hover:text-white"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Media Section (Image / Carousel with Luminescence Wave) */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative bg-black/40 overflow-hidden select-none luminescence-wave">
          
          <div className="aspect-[4/3] sm:aspect-[16/10] w-full flex items-center justify-center relative">
            <img
              src={post.mediaUrls[currentSlideIndex]}
              alt={`Post media ${currentSlideIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
              loading="lazy"
            />

            {/* Gear Tag Pill */}
            {post.gearTag && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/15 shadow-[0_0_12px_rgba(0,0,0,0.6)]">
                <Camera className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span>{post.gearTag}</span>
              </div>
            )}

            {/* Slide Index Badge for Carousels */}
            {isCarousel && (
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/15">
                {currentSlideIndex + 1}/{post.mediaUrls.length}
              </div>
            )}

            {/* Carousel Navigation Arrows */}
            {isCarousel && (
              <>
                {currentSlideIndex > 0 && (
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full ghost-btn text-white"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {currentSlideIndex < post.mediaUrls.length - 1 && (
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full ghost-btn text-white"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 bg-black/50 backdrop-blur-md rounded-full">
                  {post.mediaUrls.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'w-5 bg-[#00F2FE] shadow-[0_0_8px_rgba(0,242,254,0.8)]' : 'w-1.5 bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Audio Track Overlay (if embedded directly on image) */}
            {post.audioTrack && (
              <div 
                onClick={toggleAudio}
                className="absolute bottom-3 right-3 max-w-[85%] flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/75 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 cursor-pointer shadow-xl transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-950 text-[#00F2FE] flex items-center justify-center shrink-0 border border-cyan-500/40">
                  {isPlayingAudio ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </div>
                <div className="truncate text-xs font-bold">
                  {post.audioTrack.title}
                </div>
                {isPlayingAudio && (
                  <div className="flex items-center gap-0.5 ml-1 shrink-0">
                    <span className="w-0.5 h-3 bg-[#00F2FE] animate-pulse" />
                    <span className="w-0.5 h-4 bg-[#00F2FE] animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-[#00F2FE] animate-pulse delay-150" />
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3. Standalone Audio Stem Player */}
      {post.audioTrack && !post.mediaUrls?.length && (
        <div className="mx-4 mt-4 p-4 rounded-2xl liquid-glass-elevated text-white flex items-center justify-between gap-3 border border-white/[0.12]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className="w-11 h-11 rounded-2xl glimmer-gradient-bg text-slate-950 flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_16px_rgba(0,242,254,0.4)]"
            >
              {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>{post.audioTrack.title}</span>
                {post.audioTrack.isLive && (
                  <span className="text-[9px] font-mono uppercase bg-rose-600 px-1.5 py-0.2 rounded font-bold shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                    LIVE
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {post.audioTrack.artist} • {post.audioTrack.bitrate || '320kbps Opus'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[4, 8, 14, 20, 12, 18, 24, 16, 10, 6, 12, 22, 18, 8].map((h, i) => (
              <span 
                key={i} 
                style={{ height: `${h}px` }} 
                className={`w-1 rounded-full transition-all ${
                  isPlayingAudio ? 'bg-[#00F2FE] animate-pulse' : 'bg-white/20'
                }`} 
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Action Bar (Likes, Comments, Repost, Share, Bookmark) */}
      <div className="px-4 sm:px-5 py-3 border-b border-white/[0.04] flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Like Button */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ghost-btn ${
              post.isLiked ? 'text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : ''
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${
              post.isLiked ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'
            }`} />
            <span className="font-mono">{post.likesCount.toLocaleString()}</span>
          </button>

          {/* Comment Toggle */}
          <button
            onClick={() => setShowComments(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold ghost-btn hover:text-[#00F2FE]"
          >
            <MessageCircle className="w-4 h-4 stroke-[2]" />
            <span className="font-mono">{post.commentsCount.toLocaleString()}</span>
          </button>

          {/* Repost Button */}
          <button
            onClick={() => onRepost(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold ghost-btn ${
              post.isReposted ? 'text-emerald-400 border-emerald-500/40' : ''
            }`}
          >
            <Repeat2 className="w-4 h-4 stroke-[2]" />
            <span className="font-mono">{post.repostsCount.toLocaleString()}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-2xl ghost-btn hover:text-[#00F2FE]"
            title="Copy share link"
          >
            {copiedShare ? (
              <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            ) : (
              <Share2 className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => onBookmark(post.id)}
          className={`p-2 rounded-2xl ghost-btn ${
            post.isBookmarked ? 'text-[#00F2FE] border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.3)]' : ''
          }`}
          title="Save post"
        >
          <Bookmark className={`w-4 h-4 stroke-[2] ${post.isBookmarked ? 'fill-[#00F2FE]' : ''}`} />
        </button>
      </div>

      {/* 5. Post Text Content & Tags */}
      <div className="p-4 sm:p-5 pt-3 space-y-2.5">
        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line tracking-wide">
          <span 
            onClick={() => onOpenAuthorProfile?.(post.author.username)}
            className="font-bold text-white hover:text-[#00F2FE] cursor-pointer mr-2"
          >
            {post.author.displayName}
          </span>
          {post.content}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag?.(tag)}
                className="text-xs font-mono font-bold text-[#00F2FE] hover:underline"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* View Comments trigger */}
        {post.commentsCount > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-xs font-mono font-bold text-slate-400 hover:text-white pt-1 block"
          >
            VIEW ALL {post.commentsCount} COMMENTS →
          </button>
        )}
      </div>

      {/* 6. Expandable Comments Section (Liquid Glass Elevated) */}
      {showComments && (
        <div className="liquid-glass-elevated m-3 p-4 space-y-3 rounded-2xl border border-white/[0.1]">
          
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {post.comments.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-2">
                No comments yet. Start the discussion!
              </div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.author.avatarUrl}
                    alt={comment.author.displayName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-white/[0.04] p-3 rounded-2xl border border-white/[0.08]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-white">
                        {comment.author.displayName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-normal">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Inline Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Add a comment as @${currentUser.handle}...`}
                className="w-full text-xs bg-white/[0.04] border border-white/[0.1] focus:border-[#00F2FE] rounded-2xl px-3.5 py-2.5 pr-14 outline-none text-white placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-mono font-bold text-[#00F2FE] hover:text-white disabled:opacity-40 uppercase"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

    </article>
  );
};
