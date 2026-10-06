import React, { useEffect, useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, Send, Heart } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
  onOpenProfile: (username: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
  onOpenProfile
}) => {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div 
        className="relative w-full max-w-md h-[85vh] max-h-[750px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image */}
        <img
          src={story.mediaUrl || story.user.avatarUrl}
          alt="Story background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />

        {/* Top Progress Bar & Header */}
        <div className="relative z-10 p-4 space-y-3">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div 
              onClick={() => {
                onClose();
                onOpenProfile(story.user.username);
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img
                src={story.user.avatarUrl}
                alt={story.user.displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>{story.user.displayName}</span>
                  {story.user.isLive && (
                    <span className="text-[9px] font-mono uppercase bg-red-600 px-1 rounded font-bold text-white">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/70">
                  {story.user.liveTitle || 'Stream Broadcast'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Reaction & Quick Reply Bar */}
        <div className="relative z-10 p-4 space-y-2">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setReplyText('');
              alert('Reply sent!');
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${story.user.displayName}...`}
              className="flex-1 text-xs bg-white/20 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 rounded-full px-4 py-2.5 outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:text-red-400"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            {replyText && (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
