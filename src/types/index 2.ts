export interface User {
  id: string;
  username: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  role: 'VIP' | 'ADMIN' | 'PRO CREATOR' | 'MEMBER' | 'VIP CONTRIBUTOR';
  bio: string;
  location: string;
  website?: string;
  sparksBalance: number;
  badges: string[];
  equippedBadgeIds: string[];
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowing?: boolean;
  isVerified?: boolean;
  joinedDate: string;
  uuid?: string;
}

export interface AudioTrack {
  title: string;
  artist: string;
  duration: string;
  isLive?: boolean;
  bitrate?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified?: boolean;
    role?: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaType: 'image' | 'video' | 'audio' | 'carousel' | 'text';
  mediaUrls: string[];
  gearTag?: string;
  audioTrack?: AudioTrack;
  tags: string[];
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  repostsCount: number;
  isReposted: boolean;
  isBookmarked: boolean;
  createdAt: string;
  comments: Comment[];
  locationTag?: string;
  badgeTag?: string;
  tier?: 'public' | 'pro' | 'subscribers';
}

export interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isLive?: boolean;
    hasUnseen: boolean;
    liveTitle?: string;
  };
  mediaUrl?: string;
  previewColor?: string;
}

export interface Notification {
  id: string;
  type: 'mention' | 'like' | 'follow' | 'broadcast' | 'sparks' | 'announcement';
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  actor: {
    username: string;
    displayName: string;
    avatarUrl: string;
    role?: string;
  };
  targetPostId?: string;
  thumbnailUrl?: string;
  badgeText?: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  rarity: 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | 'Common';
  category: string;
  priceSparks: number;
  priceUsd: string;
  description: string;
  showsIn: string;
  icon: string;
  accentColor: string;
  isEquipped: boolean;
  isOwned: boolean;
}

export interface NeuralNode {
  id: string;
  label: string;
  category: 'roots' | 'discovered' | 'active' | 'undiscovered';
  x: number;
  y: number;
  connectedTo: string[];
  count?: number;
  description: string;
  affinity?: number;
  parentId?: string;
  isAlgorithmic?: boolean;
  depth?: number;
}

export interface InterestTreeNode {
  id: string;
  label: string;
  category: 'root' | 'roots' | 'discovered' | 'active' | 'undiscovered';
  description: string;
  count: number;
  affinityScore: number; // 0 - 100%
  inferredReason?: string;
  isAlgorithmic?: boolean;
  isExpanded?: boolean;
  isEnabled?: boolean;
  parentId?: string | null;
  children?: InterestTreeNode[];
  iconName?: string;
  tags?: string[];
  depth: number;
  location?: string;
}

export interface AlgorithmSettings {
  enabled: boolean;
  explorationRate: number; // 0 - 100%
  recencyWeight: number; // 0 - 100%
  personalizationStrength: number; // 0 - 100%
  discoveryMode: 'balanced' | 'deep_rabbit_hole' | 'high_serendipity' | 'organic_roots_only';
  autoClustering: boolean;
  interestDecayDays: number;
}

export interface BackendArchInfo {
  server: {
    status: 'online' | 'ready';
    runtime: string;
    port: number;
  };
  redis: {
    status: 'connected';
    port: number;
    hitsRate: string;
  };
  minio: {
    status: 'connected';
    port: number;
    bucket: string;
  };
  postgres: {
    status: 'connected';
    port: number;
    tables: string[];
  };
}

export interface DiscordServer {
  id: string;
  name: string;
  shortName: string;
  iconUrl?: string;
  unreadCount?: number;
  hasAudioStage?: boolean;
}

export interface ChannelItem {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'stage' | 'announcement' | 'locked';
  unreadCount?: number | string;
  unreadDot?: boolean;
  topic?: string;
  activeListenersCount?: number;
  activeListenersAvatars?: string[];
  isLocked?: boolean;
  badge?: string;
}

export interface ChannelCategory {
  id: string;
  name: string;
  badge?: string;
  channels: ChannelItem[];
}

export interface DiscordReaction {
  emoji: string;
  count: number;
  hasReacted?: boolean;
}

export interface DiscordAttachment {
  title: string;
  type: string;
  desc: string;
  stats?: string;
  url?: string;
  isAudioStage?: boolean;
}

export interface DiscordChatMessage {
  id: string;
  channelId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role?: 'ADMIN' | 'PRO CREATOR' | 'VIP' | 'MEMBER';
    isVerified?: boolean;
  };
  content: string;
  timestamp: string;
  attachment?: DiscordAttachment;
  reactions: DiscordReaction[];
}

export interface GuildMember {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  roleGroup: 'ADMIN / CORE TEAM' | 'PRO CREATORS' | 'ONLINE' | 'OFFLINE';
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activity?: string;
  isSpeaking?: boolean;
  isVerified?: boolean;
  badge?: string;
}

