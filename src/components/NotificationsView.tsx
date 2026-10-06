import React, { useState } from 'react';
import { 
  Bell, 
  Radio, 
  MessageSquare, 
  Heart, 
  UserPlus, 
  CheckCheck, 
  Sliders, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAllAsRead: () => Promise<void>;
  onNavigateToPost?: (postId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onNavigateToPost
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'mentions' | 'reactions' | 'network'>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filteredNotifs = notifications.filter(n => {
    if (unreadOnly && n.isRead) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'live') return n.type === 'broadcast' || n.type === 'announcement';
    if (activeTab === 'mentions') return n.type === 'mention';
    if (activeTab === 'reactions') return n.type === 'like' || n.type === 'sparks';
    if (activeTab === 'network') return n.type === 'follow';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Notifications Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Header Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold text-slate-900">Activity & Stream</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-bold">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <span>Unread Only</span>
                  <input
                    type="checkbox"
                    checked={unreadOnly}
                    onChange={(e) => setUnreadOnly(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                </label>

                <button
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4 text-cyan-600" />
                  <span>Mark all read</span>
                </button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'live' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live & Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('mentions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'mentions' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Mentions & Replies</span>
              </button>
              <button
                onClick={() => setActiveTab('reactions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'reactions' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Reactions</span>
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'network' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Network Growth</span>
              </button>
            </div>
          </div>

          {/* Activity Items List */}
          <div className="space-y-3">
            {filteredNotifs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
                No activity records found.
              </div>
            ) : (
              filteredNotifs.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl p-4 flex items-start justify-between gap-3 shadow-sm transition-all ${
                    !item.isRead ? 'border-cyan-400 bg-cyan-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={item.actor.avatarUrl}
                      alt={item.actor.displayName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {item.actor.displayName}
                        </span>
                        {item.badgeText && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800">
                            {item.badgeText}
                          </span>
                        )}
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-slate-400 text-xs">{item.timeAgo}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Thumbnail / Action Button */}
                  <div className="shrink-0 flex items-center gap-2">
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 hidden sm:block"
                      />
                    )}
                    {item.type === 'broadcast' && (
                      <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm">
                        Tune In
                      </button>
                    )}
                    {item.type === 'mention' && (
                      <button 
                        onClick={() => item.targetPostId && onNavigateToPost?.(item.targetPostId)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
                      >
                        Reply
                      </button>
                    )}
                    {item.type === 'follow' && (
                      <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm">
                        Follow Back
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Rail: Delivery Channels & Stats (Screenshot 4) */}
        <div className="hidden lg:block lg:col-span-4 space-y-5">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Delivery Channels
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Community Highlights</div>
                  <div className="text-slate-400 text-[11px]">Daily digest of top creator posts</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-600 rounded" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">StudioPlay Broadcasts</div>
                  <div className="text-slate-400 text-[11px]">Live sound & stream rooms</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-600 rounded" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">Desktop Push Sync</div>
                  <div className="text-slate-400 text-[11px]">Chrome notification badges</div>
                </div>
                <input type="checkbox" className="w-4 h-4 accent-cyan-600 rounded" />
              </div>
            </div>
          </div>

          {/* Activity Volume Chart widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Activity Volume
              </h3>
              <span className="text-[11px] font-bold text-emerald-600">+28% vs last week</span>
            </div>

            <div className="flex items-end gap-2 h-16 pt-2">
              <div className="flex-1 bg-cyan-100 rounded-t h-4" title="Mon" />
              <div className="flex-1 bg-cyan-100 rounded-t h-6" title="Tue" />
              <div className="flex-1 bg-cyan-200 rounded-t h-8" title="Wed" />
              <div className="flex-1 bg-cyan-200 rounded-t h-7" title="Thu" />
              <div className="flex-1 bg-cyan-300 rounded-t h-11" title="Fri" />
              <div className="flex-1 bg-cyan-400 rounded-t h-10" title="Sat" />
              <div className="flex-1 bg-cyan-500 rounded-t h-14" title="Today" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Mon</span>
              <span>Wed</span>
              <span>Today</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
