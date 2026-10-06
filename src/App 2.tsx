import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { ExploreView } from './components/ExploreView';
import { MarketplaceView } from './components/MarketplaceView';
import { NotificationsView } from './components/NotificationsView';
import { ChannelsView } from './components/ChannelsView';
import { SettingsView } from './components/SettingsView';
import { CreatePostModal } from './components/CreatePostModal';
import { BackendArchitectureModal } from './components/BackendArchitectureModal';
import { StoryViewerModal } from './components/StoryViewerModal';

import {
  Post,
  User,
  Story,
  Notification,
  BadgeItem,
  NeuralNode
} from './types';

import * as apiService from './services/apiService';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [feedFilter, setFeedFilter] = useState<'following' | 'foryou'>('following');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [palette, setPalette] = useState<string>('cyan');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBackendArchModalOpen, setIsBackendArchModalOpen] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  // Profile Viewing Target (either current user or clicked author)
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [suggestedCreators, setSuggestedCreators] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([]);
  const [isAlgorithmEnabled, setIsAlgorithmEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch via apiService
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [
          user,
          feedPosts,
          storyList,
          creators,
          notifs,
          badgeList,
          graphNodes,
          algoSettings
        ] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.getFeedPosts(),
          apiService.getStories(),
          apiService.getSuggestedCreators(),
          apiService.getNotifications(),
          apiService.getBadges(),
          apiService.getNeuralGraphData(),
          apiService.getAlgorithmSettings()
        ]);

        setCurrentUser(user);
        setPosts(feedPosts);
        setStories(storyList);
        setSuggestedCreators(creators);
        setNotifications(notifs);
        setBadges(badgeList);
        setNeuralNodes(graphNodes);
        setIsAlgorithmEnabled(algoSettings.enabled);
      } catch (err) {
        console.error('Error loading initial data from apiService:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Post Actions
  const handleLikePost = async (postId: string) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));

    try {
      await apiService.toggleLikePost(postId);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isBookmarked: !p.isBookmarked };
      }
      return p;
    }));

    try {
      await apiService.toggleBookmarkPost(postId);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleRepostPost = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isReposted = !p.isReposted;
        return {
          ...p,
          isReposted,
          repostsCount: isReposted ? p.repostsCount + 1 : Math.max(0, p.repostsCount - 1)
        };
      }
      return p;
    }));

    try {
      await apiService.toggleRepostPost(postId);
    } catch (err) {
      console.error('Failed to toggle repost:', err);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const newComment = await apiService.addComment(postId, content);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        stats: { ...prev.stats, postsCount: prev.stats.postsCount + 1 }
      }) : null);
    }
    setActiveTab('feed');
  };

  // Profile Actions
  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    try {
      const updated = await apiService.updateUserProfile(updatedData);
      setCurrentUser(updated);
      // Synchronize in-memory posts authored by currentUser
      setPosts(prev => prev.map(p => {
        if (p.author.id === updated.id) {
          return {
            ...p,
            author: {
              ...p.author,
              displayName: updated.displayName,
              handle: updated.handle,
              bio: updated.bio
            }
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleOpenAuthorProfile = async (username: string) => {
    try {
      const profile = await apiService.getUserProfile(username);
      if (profile) {
        setViewingUser(profile);
        setActiveTab('profile');
      }
    } catch (err) {
      console.error('Failed to get user profile:', err);
    }
  };

  // Follow Actions
  const handleToggleFollow = async (userId: string) => {
    setSuggestedCreators(prev => prev.map(c => {
      if (c.id === userId) {
        const isFollowing = !c.isFollowing;
        return {
          ...c,
          isFollowing,
          stats: {
            ...c.stats,
            followersCount: c.stats.followersCount + (isFollowing ? 1 : -1)
          }
        };
      }
      return c;
    }));

    try {
      await apiService.toggleFollowUser(userId);
    } catch (err) {
      console.error('Failed to toggle follow user:', err);
    }
  };

  // Marketplace Badges Actions
  const handlePurchaseBadge = async (badgeId: string) => {
    const res = await apiService.purchaseBadge(badgeId);
    if (res.success && currentUser) {
      const badge = badges.find(b => b.id === badgeId);
      setCurrentUser(prev => prev ? ({
        ...prev,
        sparksBalance: res.remainingSparks,
        badges: badge ? [...prev.badges, badge.name] : prev.badges
      }) : null);
      setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, isOwned: true } : b));
    }
  };

  const handleToggleEquipBadge = async (badgeId: string) => {
    const res = await apiService.toggleEquipBadge(badgeId);
    if (res.success && currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        equippedBadgeIds: res.equippedBadgeIds
      }) : null);
      setBadges(prev => prev.map(b => ({
        ...b,
        isEquipped: res.equippedBadgeIds.includes(b.id)
      })));
    }
  };

  // Algorithm Toggle
  const handleToggleAlgorithm = async () => {
    const next = !isAlgorithmEnabled;
    setIsAlgorithmEnabled(next);
    try {
      await apiService.setAlgorithmEnabled(next);
    } catch (err) {
      console.error('Failed to toggle algorithm', err);
    }
  };

  // Notifications Actions
  const handleMarkAllNotificationsAsRead = async () => {
    await apiService.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Global Search Filter
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setActiveTagFilter(null);
      return;
    }
    const clean = query.trim().replace(/^#/, '');
    setActiveTagFilter(clean);
    if (activeTab !== 'feed') {
      setActiveTab('feed');
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
        <div className="orb-glow-teal top-1/4 -left-20" />
        <div className="orb-glow-purple bottom-1/4 -right-20" />
        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.15] backdrop-blur-[24px] flex items-center justify-center text-xl shadow-[0_0_30px_rgba(0,242,254,0.3)] animate-pulse">
          🏔️
        </div>
        <div className="text-xs font-mono font-bold tracking-widest text-[#00F2FE] uppercase">
          Initializing Project Blue Mountain...
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Connecting to API Service layer (Liquid Glass HUD)
        </div>
      </div>
    );
  }

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const activeProfileUser = viewingUser || currentUser;
  const userPosts = posts.filter(p => p.author.username === activeProfileUser.username || p.author.id === activeProfileUser.id);

  return (
    <div className="min-h-screen bg-[#030303] text-[#F1F5F9] flex flex-col font-sans relative selection:bg-[#00F2FE] selection:text-black">
      
      {/* Ambient Floating 3D Neon Orbs (Spatial Depth & Lighting Anchors Behind Panels) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb-glow-teal -top-20 -left-24" />
        <div className="orb-glow-purple top-1/4 -right-32" />
        <div className="orb-glow-pink -bottom-28 left-1/4" />
        <div className="orb-glow-teal bottom-10 right-1/4 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />
      </div>

      {/* 1. Global Header Navigation */}
      <Navbar
        currentUser={currentUser}
        unreadCount={unreadNotifsCount}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenNotifications={() => setActiveTab('notifications')}
        onOpenProfile={() => {
          setViewingUser(currentUser);
          setActiveTab('profile');
        }}
        onOpenBackendArch={() => setIsBackendArchModalOpen(true)}
        onSearch={handleSearch}
        activeTab={activeTab}
      />

      {/* 2. Main Layout Frame (Sidebar + Views) */}
      <div className="relative z-10 flex-1 flex max-w-7xl mx-auto w-full pb-16 md:pb-0">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'profile') setViewingUser(currentUser);
            setActiveTab(tab);
          }}
          unreadCount={unreadNotifsCount}
          palette={palette}
          setPalette={setPalette}
          onOpenBackendArch={() => setIsBackendArchModalOpen(true)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {activeTab === 'feed' && (
            <FeedView
              posts={posts}
              currentUser={currentUser}
              stories={stories}
              suggestedCreators={suggestedCreators}
              feedFilter={feedFilter}
              setFeedFilter={setFeedFilter}
              activeTagFilter={activeTagFilter}
              setActiveTagFilter={setActiveTagFilter}
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onRepostPost={handleRepostPost}
              onAddComment={handleAddComment}
              onToggleFollow={handleToggleFollow}
              onOpenAuthorProfile={handleOpenAuthorProfile}
              onSelectStory={(story) => setViewingStory(story)}
              isAlgorithmEnabled={isAlgorithmEnabled}
              onToggleAlgorithm={handleToggleAlgorithm}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={activeProfileUser}
              currentUser={currentUser}
              userPosts={userPosts}
              onUpdateProfile={handleUpdateProfile}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onRepostPost={handleRepostPost}
              onAddComment={handleAddComment}
              onOpenMarketplace={() => setActiveTab('marketplace')}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView
              currentUser={currentUser}
              nodes={neuralNodes}
              isAlgorithmEnabled={isAlgorithmEnabled}
              onToggleAlgorithm={handleToggleAlgorithm}
              onSelectClusterTag={(tag) => {
                setActiveTagFilter(tag);
                setActiveTab('feed');
              }}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView
              badges={badges}
              currentUser={currentUser}
              onPurchaseBadge={handlePurchaseBadge}
              onToggleEquipBadge={handleToggleEquipBadge}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onNavigateToPost={(postId) => {
                setActiveTab('feed');
              }}
            />
          )}

          {activeTab === 'channels' && (
            <ChannelsView currentUser={currentUser} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              palette={palette}
              setPalette={setPalette}
            />
          )}

        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') setViewingUser(currentUser);
          setActiveTab(tab);
        }}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        unreadCount={unreadNotifsCount}
        currentUser={currentUser}
      />

      {/* 4. Post Creation Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
        onCreatePostService={apiService.createPost}
      />

      {/* 5. Backend Architecture Reference Modal */}
      <BackendArchitectureModal
        isOpen={isBackendArchModalOpen}
        onClose={() => setIsBackendArchModalOpen(false)}
      />

      {/* 6. Story Preview Modal */}
      <StoryViewerModal
        story={viewingStory}
        onClose={() => setViewingStory(null)}
        onOpenProfile={handleOpenAuthorProfile}
      />

    </div>
  );
}
