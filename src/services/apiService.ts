/**
 * Project Blue Mountain - Dedicated API Service Layer
 * 
 * ARCHITECTURE INTEGRATION GUIDE:
 * This file isolates all data operations from UI components.
 * To integrate with your custom Node.js backend (Port 3000), Redis (Port 6379),
 * MinIO S3 (Port 9000), and PostgreSQL (Port 5432):
 * 1. Set USE_MOCK_DATA = false
 * 2. Configure BACKEND_BASE_URL to your Node.js endpoint (e.g., 'http://localhost:3000/api/v1')
 * 3. Each function is fully typed and ready to swap internal mock logic for `fetch()` calls.
 */

import { 
  User, 
  Post, 
  Comment, 
  Story, 
  Notification, 
  BadgeItem, 
  NeuralNode, 
  InterestTreeNode,
  AlgorithmSettings,
  BackendArchInfo,
  DiscordServer,
  ChannelCategory,
  ChannelItem,
  DiscordChatMessage,
  DiscordReaction,
  GuildMember
} from '../types';

export const BACKEND_BASE_URL = 'http://localhost:3000/api/v1';
export const USE_MOCK_DATA = true;

// Helper to simulate network latency for authentic UI feedback
const delay = (ms: number = 180) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage Persistence Keys
const STORAGE_POSTS_KEY = 'pbm_feed_posts_v1';
const STORAGE_USER_KEY = 'pbm_current_user_v1';
const STORAGE_NOTIFS_KEY = 'pbm_notifications_v1';
const STORAGE_BADGES_KEY = 'pbm_badges_v1';

// Initial Mock Current User (Alex Rivera from Screenshot 2)
const INITIAL_CURRENT_USER: User = {
  id: 'usr_alex_rivera',
  username: 'alex_rivera',
  handle: 'rivera_alpha',
  displayName: 'Alex Rivera',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop',
  role: 'VIP CONTRIBUTOR',
  bio: 'Architecting decentralized knowledge nodes and high-frequency audio visualizers on Project Blue Mountain. Alpha tester #108.',
  location: 'San Francisco, CA',
  website: 'https://bluemountain.network',
  sparksBalance: 1450,
  badges: ['Cyber Aurora', 'VIP Patron', 'Alpha Genesis'],
  equippedBadgeIds: ['badge_cyber_aurora', 'badge_alpha_vanguard'],
  stats: {
    postsCount: 28,
    followersCount: 1420,
    followingCount: 389,
  },
  isVerified: true,
  joinedDate: 'Joined Nov 2024',
  uuid: 'b79a0e44-9f82-411a-b33a-14d24597ef01'
};

// Initial Seed Posts (Derived directly from Screenshot 6)
const INITIAL_POSTS: Post[] = [
  {
    id: 'post_kai_01',
    author: {
      id: 'usr_kai_creative',
      username: 'kai_creative',
      handle: 'kai_creative',
      displayName: 'kai_creative',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
      bannerUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=400&fit=crop',
      role: 'PRO CREATOR',
      bio: 'High-altitude landscape photographer & sound designer. Nordic Valley Phase IV.',
      location: 'Nordic Valley • Phase IV Summit',
      sparksBalance: 3200,
      badges: ['Alpha Pioneer', 'Audio Specialist'],
      equippedBadgeIds: ['badge_alpha_vanguard'],
      stats: { postsCount: 142, followersCount: 18400, followingCount: 230 },
      isVerified: true,
      joinedDate: 'Joined Oct 2024'
    },
    content: 'Ascended to the secondary ridge at 04:30 AM to catch the cold mist breaking over the north face. The atmosphere inside the mountain basin felt entirely unreal today. Full RAW color profile uploaded to Prism Media Stage.\n\n#bluemountain #creativeflow #alpinephotog #nordicsummit',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=85'
    ],
    gearTag: 'SONY A1 • 24MM F/1.4',
    audioTrack: {
      title: 'Summit Winds (Original Audio)',
      artist: 'kai_creative',
      duration: '02:45',
      isLive: false,
      bitrate: 'Lossless Opus 320k'
    },
    tags: ['bluemountain', 'creativeflow', 'alpinephotog', 'nordicsummit'],
    likesCount: 1482,
    isLiked: false,
    commentsCount: 84,
    repostsCount: 219,
    isReposted: false,
    isBookmarked: false,
    createdAt: '2h ago',
    locationTag: 'Nordic Valley • Phase IV Summit',
    badgeTag: 'PRO CREATOR',
    comments: [
      {
        id: 'c_01',
        postId: 'post_kai_01',
        author: {
          id: 'usr_elena_visuals',
          username: 'elena.visuals',
          displayName: 'elena.visuals',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
          isVerified: true
        },
        content: 'The chromatic separation on that frost line is absurd Kai!!',
        createdAt: '1h ago',
        likesCount: 38,
        isLiked: true
      },
      {
        id: 'c_02',
        postId: 'post_kai_01',
        author: {
          id: 'usr_marcus_raw',
          username: 'marcus.raw',
          displayName: 'Marcus Raw',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          isVerified: true,
          role: 'ADMIN'
        },
        content: 'Pinned this to the community stage showcase. The dynamic range is stellar.',
        createdAt: '45m ago',
        likesCount: 14
      }
    ]
  },
  {
    id: 'post_arc_02',
    author: {
      id: 'usr_arc_design',
      username: 'arc_design',
      handle: 'arc_design',
      displayName: 'arc_design',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
      role: 'VIP',
      bio: 'Modular design systems & computational UI architecture.',
      location: 'Prism Modular Component Library 2025',
      sparksBalance: 4100,
      badges: ['Design Master', 'Community Architect'],
      equippedBadgeIds: ['badge_community_architect'],
      stats: { postsCount: 95, followersCount: 11600, followingCount: 412 },
      isVerified: true,
      joinedDate: 'Joined Nov 2024'
    },
    content: 'Deconstructing modular grids for high-density desktop dashboards. Slide 1 introduces the 12-column adaptive rail. Complete Figma vector kits and CSS theme tokens are now public.\n\n#designsystems #uidesign #typography',
    mediaType: 'carousel',
    mediaUrls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=85'
    ],
    gearTag: 'FIGMA VECTOR ENGINE 2026',
    tags: ['designsystems', 'uidesign', 'typography'],
    likesCount: 3912,
    isLiked: true,
    commentsCount: 312,
    repostsCount: 540,
    isReposted: false,
    isBookmarked: true,
    createdAt: '4h ago',
    locationTag: 'Prism Modular Component Library 2025',
    badgeTag: 'DESIGN SYSTEM',
    comments: [
      {
        id: 'c_03',
        postId: 'post_arc_02',
        author: {
          id: 'usr_synthwave_dev',
          username: 'synthwave_dev',
          displayName: 'synthwave_dev',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
          isVerified: true
        },
        content: 'Adopted the typography tokens in our audio DSP analyzer frontend. Crisp as glass.',
        createdAt: '3h ago',
        likesCount: 22
      }
    ]
  },
  {
    id: 'post_synthwave_03',
    author: {
      id: 'usr_synthwave_dev',
      username: 'synthwave_dev',
      handle: 'synthwave_dev',
      displayName: 'synthwave_dev',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
      bannerUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=400&fit=crop',
      role: 'PRO CREATOR',
      bio: 'Analog modular synthesizers, WebAudio DSP pipelines, and hardware audio engineering.',
      location: 'Prism Audio Lab • Seattle WA',
      sparksBalance: 2900,
      badges: ['Audio Specialist', 'Night Owl'],
      equippedBadgeIds: ['badge_lossless_audiophile'],
      stats: { postsCount: 64, followersCount: 8900, followingCount: 190 },
      isVerified: true,
      joinedDate: 'Joined Dec 2024'
    },
    content: 'Fresh tube preamp routing finalized for tonight’s ambient stream. Zero latency monitor mix is singing! Hooked into the new 32-bit float WebRTC pipeline.\n\n#synthwave #modularaudio #analoggear #webaudio',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&auto=format&fit=crop&q=85'
    ],
    gearTag: 'SHURE MV7+ / SENNHEISER HD650',
    audioTrack: {
      title: 'Ambient Synthesis #44 (Live Stage)',
      artist: 'synthwave_dev',
      duration: '42:10',
      isLive: true,
      bitrate: 'Lossless Opus 320k'
    },
    tags: ['synthwave', 'modularaudio', 'analoggear', 'webaudio'],
    likesCount: 894,
    isLiked: false,
    commentsCount: 43,
    repostsCount: 78,
    isReposted: false,
    isBookmarked: false,
    createdAt: '7h ago',
    locationTag: 'Prism Audio Lab • Seattle WA',
    badgeTag: 'LIVE AUDIO RENDER',
    comments: []
  }
];

// Initial Stories
const INITIAL_STORIES: Story[] = [
  {
    id: 'story_self',
    user: {
      id: 'usr_alex_rivera',
      username: 'alex_rivera',
      displayName: 'Your Profile',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      hasUnseen: false
    }
  },
  {
    id: 'story_kai',
    user: {
      id: 'usr_kai_creative',
      username: 'kai_creative',
      displayName: '@kai_creative',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
      isLive: true,
      liveTitle: 'Live Ambient Jam',
      hasUnseen: true
    },
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop'
  },
  {
    id: 'story_elena',
    user: {
      id: 'usr_elena_visuals',
      username: 'elena.visuals',
      displayName: '@elena.visuals',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      hasUnseen: true
    },
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop'
  },
  {
    id: 'story_arc',
    user: {
      id: 'usr_arc_design',
      username: 'arc_design',
      displayName: '@arc_design',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face',
      hasUnseen: true
    },
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop'
  },
  {
    id: 'story_synth',
    user: {
      id: 'usr_synthwave_dev',
      username: 'synthwave_dev',
      displayName: '@synthwave_dev',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
      hasUnseen: false
    }
  },
  {
    id: 'story_nomad',
    user: {
      id: 'usr_nomad_lens',
      username: 'nomad_lens',
      displayName: '@nomad_lens',
      avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face',
      hasUnseen: true
    }
  },
  {
    id: 'story_solaris',
    user: {
      id: 'usr_solaris_flair',
      username: 'solaris.flair',
      displayName: '@solaris.flair',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      hasUnseen: false
    }
  },
  {
    id: 'story_marcus',
    user: {
      id: 'usr_marcus_raw',
      username: 'marcus.raw',
      displayName: '@marcus.raw',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      hasUnseen: true
    }
  }
];

// Initial Suggested Creators (Right rail on Screenshot 6)
const INITIAL_SUGGESTED_CREATORS: User[] = [
  {
    id: 'usr_valerie_motion',
    username: 'valerie_motion',
    handle: 'valerie_motion',
    displayName: 'Valerie Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&h=400&fit=crop',
    role: 'PRO CREATOR',
    bio: 'Motion graphics director and generative title sequences.',
    location: 'Vancouver, BC',
    sparksBalance: 2400,
    badges: ['Motion Architect'],
    equippedBadgeIds: ['badge_pixel_alchemist'],
    stats: { postsCount: 78, followersCount: 14200, followingCount: 310 },
    isFollowing: false,
    isVerified: true,
    joinedDate: 'Joined Nov 2024'
  },
  {
    id: 'usr_klaus_spatial',
    username: 'klaus.spatial',
    handle: 'klaus.spatial',
    displayName: 'Klaus Brandt',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop',
    role: 'VIP',
    bio: 'Spatial UI Researcher & WebGL Raymarching specialist.',
    location: 'Berlin, DE',
    sparksBalance: 1900,
    badges: ['Neural Weaver'],
    equippedBadgeIds: ['badge_neural_weaver'],
    stats: { postsCount: 42, followersCount: 9800, followingCount: 180 },
    isFollowing: false,
    isVerified: true,
    joinedDate: 'Joined Jan 2025'
  },
  {
    id: 'usr_sora_gen',
    username: 'sora_gen',
    handle: 'sora_gen',
    displayName: 'Sora Nishida',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
    role: 'PRO CREATOR',
    bio: 'Generative video AI prompts & neural cinematic editing.',
    location: 'Tokyo, JP',
    sparksBalance: 3600,
    badges: ['Glitch Shifter'],
    equippedBadgeIds: ['badge_glitch_shifter'],
    stats: { postsCount: 110, followersCount: 22100, followingCount: 440 },
    isFollowing: false,
    isVerified: true,
    joinedDate: 'Joined Oct 2024'
  }
];

// Initial Notifications (Screenshot 4)
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    type: 'announcement',
    title: 'StudioPlay Community Announcement',
    description: 'New community spotlight published: "Generative Cinema & Spatial Dioramas" feature is now live.',
    timeAgo: '12m ago',
    isRead: false,
    actor: {
      username: 'studioplay',
      displayName: 'StudioPlay Community',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      role: 'OFFICIAL'
    },
    badgeText: 'Spotlight'
  },
  {
    id: 'notif_02',
    type: 'broadcast',
    title: 'Started broadcasting: "Hardware Synthesizer Patching & Ambient Mountain Echoes"',
    description: '1.4k listening • Audio Stream • Lossless 48kHz',
    timeAgo: '48m ago',
    isRead: false,
    actor: {
      username: 'synthwave_dev',
      displayName: 'StudioPlay • Modular Sound Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=200&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=120&fit=crop'
  },
  {
    id: 'notif_03',
    type: 'mention',
    title: 'elena.visuals mentioned you in a comment',
    description: '@alex_rivera check out this frost line! Matches the palette we mapped in Blue Mountain node #12.',
    timeAgo: '2h ago',
    isRead: false,
    actor: {
      username: 'elena.visuals',
      displayName: 'elena.visuals',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
    },
    targetPostId: 'post_kai_01',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=120&fit=crop'
  },
  {
    id: 'notif_04',
    type: 'follow',
    title: 'marcus.raw started following your feed',
    description: 'Subscribed to "Blue Mountain Alpha Logs". Shared connections: Elena, Satoru, and 8 others.',
    timeAgo: '4h ago',
    isRead: true,
    actor: {
      username: 'marcus.raw',
      displayName: 'Marcus Raw',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      role: 'ADMIN'
    }
  },
  {
    id: 'notif_05',
    type: 'like',
    title: 'klaus.spatial, sora_gen and 14 others',
    description: 'Liked your essay and moodboard: "Architectural Truths: 72pt Bold" (+3 Re-stacks, 5 Sparks)',
    timeAgo: '2d ago',
    isRead: true,
    actor: {
      username: 'klaus.spatial',
      displayName: 'klaus.spatial',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=120&fit=crop'
  }
];

// Initial Badges Catalog (Screenshot 1)
const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'badge_cyber_aurora',
    name: 'Cyber Aurora Prism',
    rarity: 'Mythic',
    category: 'Alpha Genesis',
    priceSparks: 1200,
    priceUsd: '$11.99 USD',
    description: 'The pinnacle insignia crafted for early Alpha innovators. Radiates an iridescent chromatic ring around your avatar across all community channels.',
    showsIn: 'Profile, Chat, Stages & Neural Tree',
    icon: 'Sparkles',
    accentColor: '#06b6d4',
    isEquipped: true,
    isOwned: true
  },
  {
    id: 'badge_alpha_vanguard',
    name: 'Alpha Vanguard',
    rarity: 'Mythic',
    category: 'Alpha Genesis',
    priceSparks: 1000,
    priceUsd: '$9.99',
    description: 'Exclusive golden-purple wings insignia given to pioneer node explorers. Adds permanent pulsing glow to channel handles.',
    showsIn: 'Profile, Chat & Voice Stage',
    icon: 'Shield',
    accentColor: '#8b5cf6',
    isEquipped: true,
    isOwned: true
  },
  {
    id: 'badge_lossless_audiophile',
    name: 'Lossless Audiophile',
    rarity: 'Legendary',
    category: 'Audio & Music',
    priceSparks: 800,
    priceUsd: '$7.99',
    description: 'High-fidelity soundwave emblem. Unlocks dynamic equalizer pulse animation while speaking on Live Audio Stages.',
    showsIn: 'Audio Stages & Profile Card',
    icon: 'Headphones',
    accentColor: '#06b6d4',
    isEquipped: false,
    isOwned: true
  },
  {
    id: 'badge_synthwave_pioneer',
    name: 'Synthwave Pioneer',
    rarity: 'Epic',
    category: 'Audio & Music',
    priceSparks: 600,
    priceUsd: '$5.99',
    description: 'Retro-futuristic neon gradient disc emblem with animated magenta glow during track sharing sessions.',
    showsIn: 'Chat Messages & Profile Flair',
    icon: 'Disc',
    accentColor: '#ec4899',
    isEquipped: false,
    isOwned: false
  },
  {
    id: 'badge_neural_weaver',
    name: 'Neural Weaver',
    rarity: 'Legendary',
    category: 'Tech & AI',
    priceSparks: 850,
    priceUsd: '$8.49',
    description: 'Synaptic node connector badge. Emits interlocking circuitry beams across your Explore Tree profile avatar.',
    showsIn: 'Explore Tree & Profile Chip',
    icon: 'Cpu',
    accentColor: '#6366f1',
    isEquipped: false,
    isOwned: false
  },
  {
    id: 'badge_stage_host_pro',
    name: 'Stage Host Pro',
    rarity: 'Epic',
    category: 'Creator & Host',
    priceSparks: 550,
    priceUsd: '$5.49',
    description: 'For passionate audio stage curators. Displays a gold-trimmed microphone crest next to your handle in active live rooms.',
    showsIn: 'Stage Header & Speaker Grid',
    icon: 'Mic',
    accentColor: '#f43f5e',
    isEquipped: false,
    isOwned: false
  },
  {
    id: 'badge_community_architect',
    name: 'Community Architect',
    rarity: 'Legendary',
    category: 'Guilds & Nodes',
    priceSparks: 750,
    priceUsd: '$7.49',
    description: 'Pillar of the server. Decorates channel feeds with emerald stone mason geometry and custom guild banner borders.',
    showsIn: 'Guild Lounges & User Profile',
    icon: 'Building2',
    accentColor: '#10b981',
    isEquipped: false,
    isOwned: true
  },
  {
    id: 'badge_night_owl',
    name: 'Night Owl Broadcaster',
    rarity: 'Rare',
    category: 'Activity',
    priceSparks: 350,
    priceUsd: '$3.49',
    description: 'For midnight streaming and late-night chat sessions. Shimmers a soft twilight aura between 12 AM and 5 AM.',
    showsIn: 'Chat Messages & Nameplate',
    icon: 'Moon',
    accentColor: '#3b82f6',
    isEquipped: false,
    isOwned: false
  },
  {
    id: 'badge_pixel_alchemist',
    name: 'Pixel Alchemist',
    rarity: 'Epic',
    category: 'Creative Arts',
    priceSparks: 500,
    priceUsd: '$4.99',
    description: 'For designers and media creators. Attaches an animated retro pixel wand to all original showcase posts.',
    showsIn: 'Gallery Posts & Profile',
    icon: 'Wand2',
    accentColor: '#f59e0b',
    isEquipped: false,
    isOwned: false
  },
  {
    id: 'badge_glitch_shifter',
    name: 'Glitch Shifter',
    rarity: 'Mythic',
    category: 'Cyber Anomaly',
    priceSparks: 1100,
    priceUsd: '$10.99',
    description: 'Disruptive cyber-particle badge. Creates subtle matrix distortion around your avatar and chat typography.',
    showsIn: 'Chat, Voice Grid & Profile',
    icon: 'Zap',
    accentColor: '#ec4899',
    isEquipped: false,
    isOwned: false
  },
  {
    id: 'badge_early_supporter',
    name: 'Early Supporter 2025',
    rarity: 'Rare',
    category: 'Milestone',
    priceSparks: 400,
    priceUsd: '$3.99',
    description: 'Official hallmark of the founding 2025 Blue Mountain community. Minted once and bound permanently.',
    showsIn: 'Profile Badges Row',
    icon: 'Award',
    accentColor: '#0ea5e9',
    isEquipped: false,
    isOwned: true
  },
  {
    id: 'badge_code_whisperer',
    name: 'Code Whisperer',
    rarity: 'Common',
    category: 'Dev & Scripts',
    priceSparks: 150,
    priceUsd: '$1.49',
    description: 'Brackets insignia for bot creators and extension writers. Renders mini-code glyph next to channel messages.',
    showsIn: 'Chat Messages & Profile',
    icon: 'Code2',
    accentColor: '#64748b',
    isEquipped: false,
    isOwned: false
  }
];

// Initial Neural Interest Tree Nodes (Screenshot 5 / Image 9.jpeg)
const INITIAL_NEURAL_NODES: NeuralNode[] = [
  // Tree Root Pedestal
  { id: 'node_root', label: '@ALEX', category: 'roots', x: 500, y: 580, connectedTo: ['node_trunk_mid'], count: 128, description: 'User Core (Root Anchor) — Central stem of your personal knowledge tree' },
  
  // High Canopy: AI & Generative (Coral / Red)
  { id: 'node_video_ai', label: 'Generative Video AI', category: 'discovered', x: 500, y: 150, connectedTo: ['node_virtual_stage', 'node_soundscapes'], count: 42, description: 'AI diffusion models, latent space traversal & camera trajectory controls' },
  { id: 'node_virtual_stage', label: 'Unreal 5 Virtual Stage', category: 'discovered', x: 420, y: 210, connectedTo: ['node_neural_bci', 'node_cinema'], count: 31, description: 'Real-time LED volume projection and parallax camera tracking' },
  { id: 'node_neural_bci', label: 'Neural Implants & BCI', category: 'undiscovered', x: 430, y: 160, connectedTo: [], count: 6, description: 'Direct synaptic bio-sensing interfaces for audio control' },
  { id: 'node_cinema', label: 'Generative Cinema', category: 'discovered', x: 380, y: 260, connectedTo: [], count: 28, description: 'Prompt-engineered cinematic sequences and frame-consistent grading' },
  
  { id: 'node_soundscapes', label: 'Algorithmic Soundscapes', category: 'active', x: 580, y: 210, connectedTo: ['node_synthwave', 'node_synth_bio', 'node_preamp'], count: 35, description: 'Generative ambient textures, cellular automata harmony, and microtonal pads' },
  { id: 'node_synth_bio', label: 'Synthetic Biology', category: 'undiscovered', x: 550, y: 160, connectedTo: [], count: 4, description: 'Biomolecular computing and generative DNA sonic algorithms' },
  { id: 'node_preamp', label: 'Vintage Modular Preamp', category: 'discovered', x: 660, y: 210, connectedTo: ['node_interplanetary'], count: 19, description: 'Discrete tube circuitry, analog saturation, and tape loop delays' },
  { id: 'node_interplanetary', label: 'Interplanetary Propulsion', category: 'undiscovered', x: 730, y: 190, connectedTo: [], count: 7, description: 'Relativistic ion engines and plasma magnetosphere simulations' },
  { id: 'node_synthwave', label: 'Synthwave & Outrun', category: 'active', x: 610, y: 260, connectedTo: [], count: 64, description: 'Analog hardware synthesizers, neon aesthetics, and 80s arpeggios' },

  // Mid-Upper Left: Retro Web & Optics (Electric Cyan)
  { id: 'node_skeuo', label: '2015 Retro UI Web', category: 'active', x: 360, y: 310, connectedTo: ['node_skeuo_glass', 'node_quantum'], count: 52, description: 'Tactile desktop density, skeuomorphic bevels, and chrome borders' },
  { id: 'node_skeuo_glass', label: 'Skeuo Glass Design', category: 'active', x: 300, y: 290, connectedTo: ['node_cyberpunk'], count: 30, description: 'Frosted materials, light refraction shaders, and micro-shadows' },
  { id: 'node_cyberpunk', label: 'Cyberpunk Visuals', category: 'discovered', x: 240, y: 330, connectedTo: [], count: 21, description: 'Dystopian terminal typography, scanlines, and high-contrast signage' },
  { id: 'node_quantum', label: 'Quantum Photonics', category: 'undiscovered', x: 270, y: 250, connectedTo: ['node_waveguides'], count: 9, description: 'Optical quantum computing and photon interference lattices' },
  { id: 'node_waveguides', label: 'Non-linear Waveguides', category: 'undiscovered', x: 240, y: 220, connectedTo: [], count: 5, description: 'Optical fiber non-linearities and soliton wave dynamics' },

  // Mid-Upper Right: Shaders & Raymarching (Electric Cyan)
  { id: 'node_raymarching', label: 'Neural Shaders (WebGPU)', category: 'active', x: 650, y: 310, connectedTo: ['node_glsl', 'node_lagrange'], count: 26, description: 'Hardware-accelerated fragment compute shaders and volume rendering' },
  { id: 'node_glsl', label: 'GLSL Raymarching', category: 'active', x: 720, y: 290, connectedTo: [], count: 18, description: 'Signed distance fields, ambient occlusion, and raymarched fractals' },
  { id: 'node_lagrange', label: 'Lagrange Orbit Dynamics', category: 'undiscovered', x: 750, y: 240, connectedTo: [], count: 8, description: 'Three-body orbital mechanics and gravitational saddle points' },

  // Lower Left: Cinema & Directing (Amber Gold Roots)
  { id: 'node_cinema_directing', label: 'Cinema & Directing', category: 'roots', x: 330, y: 390, connectedTo: ['node_scifi', 'node_pop_culture'], count: 22, description: 'Anamorphic lens rendering, aspect ratios, and visual storytelling' },
  { id: 'node_scifi', label: 'Indie Sci-Fi', category: 'roots', x: 280, y: 380, connectedTo: ['node_ancient'], count: 15, description: 'Hard science fiction, speculative futures, and practical FX' },
  { id: 'node_ancient', label: 'Ancient Civilizations', category: 'undiscovered', x: 240, y: 400, connectedTo: [], count: 6, description: 'Megalithic acoustics and forgotten astronomical alignments' },
  { id: 'node_pop_culture', label: 'Pop Culture (Sign-up Root)', category: 'roots', x: 350, y: 460, connectedTo: ['node_tv_series'], count: 27, description: 'Sign-up interest root: Nostalgic media archives and visual tropes' },
  { id: 'node_tv_series', label: 'TV Series Breakdown', category: 'roots', x: 320, y: 530, connectedTo: ['node_screenwriting'], count: 14, description: 'Prestige television pacing, act structures, and character arcs' },
  { id: 'node_screenwriting', label: 'Screenwriting Craft', category: 'roots', x: 300, y: 560, connectedTo: [], count: 12, description: 'Dialogue rhythm, thematic subtext, and scene economy' },

  // Lower Right: Sports & Analytics (Amber Gold Roots)
  { id: 'node_sports', label: 'Sports Cluster (Sign-up Root)', category: 'roots', x: 660, y: 460, connectedTo: ['node_basketball', 'node_mma'], count: 48, description: 'Sign-up interest root: High-frequency athletic highlight feeds' },
  { id: 'node_basketball', label: 'Basketball (NBA)', category: 'roots', x: 700, y: 400, connectedTo: ['node_dunk', 'node_nba_analytics', 'node_hadopelagic'], count: 31, description: 'Playbook breakdowns, spatial shot charts, and shoe design' },
  { id: 'node_dunk', label: 'High-Flying Dunk', category: 'roots', x: 760, y: 350, connectedTo: [], count: 18, description: 'Kinematic verticality and rim-rattling athletic finishes' },
  { id: 'node_nba_analytics', label: 'NBA Analytics', category: 'roots', x: 740, y: 380, connectedTo: [], count: 16, description: 'Shot quality tracking, expected possession value, and spatial EPV' },
  { id: 'node_hadopelagic', label: 'Hadopelagic (Deep Sea)', category: 'undiscovered', x: 770, y: 420, connectedTo: [], count: 3, description: 'Trench exploration, hydrothermal vents, and bioluminescence' },
  { id: 'node_mma', label: 'MMA & Combat', category: 'roots', x: 680, y: 540, connectedTo: [], count: 16, description: 'Striking distance management, grappling leverage, and fight mechanics' }
];

// Cache Initializer Helpers
function getStoredPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_POSTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load posts from storage', e);
  }
  return INITIAL_POSTS;
}

function saveStoredPosts(posts: Post[]) {
  try {
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to storage', e);
  }
}

function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user from storage', e);
  }
  return INITIAL_CURRENT_USER;
}

function saveStoredUser(user: User) {
  try {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to storage', e);
  }
}

function getStoredBadges(): BadgeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_BADGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load badges from storage', e);
  }
  return INITIAL_BADGES;
}

function saveStoredBadges(badges: BadgeItem[]) {
  try {
    localStorage.setItem(STORAGE_BADGES_KEY, JSON.stringify(badges));
  } catch (e) {
    console.error('Failed to save badges to storage', e);
  }
}

function getStoredNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notifications from storage', e);
  }
  return INITIAL_NOTIFICATIONS;
}

function saveStoredNotifications(notifs: Notification[]) {
  try {
    localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications to storage', e);
  }
}

// ============================================================================
// PUBLIC API SERVICE METHODS
// ============================================================================

/**
 * Fetch all feed posts with optional filtering and pagination.
 * 
 * PROD BACKEND:
 * GET /api/v1/posts?filter={filter}&tag={tag}&page={page}&limit={limit}
 * Served via Redis cache (key: `feed:timeline:${userId}`) with PostgreSQL fallback.
 */
export async function getFeedPosts(params?: {
  filter?: 'following' | 'foryou' | 'trending';
  tag?: string;
  page?: number;
  limit?: number;
}): Promise<Post[]> {
  await delay(200);

  if (!USE_MOCK_DATA) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${BACKEND_BASE_URL}/posts?${query}`);
    if (!res.ok) throw new Error('Failed to fetch feed posts');
    return res.json();
  }

  const posts = getStoredPosts();
  let filtered = [...posts];

  if (params?.tag) {
    filtered = filtered.filter(p => p.tags.some(t => t.toLowerCase() === params.tag?.toLowerCase()));
  }

  if (params?.filter === 'following') {
    // Show creators user follows
    filtered = filtered.filter(p => p.author.username !== 'unknown');
  }

  return filtered;
}

/**
 * Retrieve a single post by ID.
 * 
 * PROD BACKEND:
 * GET /api/v1/posts/:postId
 */
export async function getPostById(postId: string): Promise<Post | null> {
  await delay(120);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/posts/${postId}`);
    if (!res.ok) return null;
    return res.json();
  }

  const posts = getStoredPosts();
  return posts.find(p => p.id === postId) || null;
}

/**
 * Create a new post.
 * 
 * PROD BACKEND:
 * POST /api/v1/posts
 * Body: { content, mediaUrls, mediaType, gearTag, audioTrack, tags, locationTag }
 * Stored in PostgreSQL `posts` table, invalidates Redis feed cache, writes activity event.
 */
export async function createPost(postData: {
  content: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | 'audio' | 'carousel' | 'text';
  gearTag?: string;
  audioTrack?: {
    title: string;
    artist: string;
    duration: string;
  };
  tags?: string[];
  locationTag?: string;
  badgeTag?: string;
  tier?: 'public' | 'pro' | 'subscribers';
}): Promise<Post> {
  await delay(300);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  }

  const currentUser = getStoredUser();
  const posts = getStoredPosts();

  const newPost: Post = {
    id: `post_${Date.now()}`,
    author: currentUser,
    content: postData.content,
    mediaType: postData.mediaType || (postData.mediaUrls && postData.mediaUrls.length > 1 ? 'carousel' : (postData.mediaUrls && postData.mediaUrls.length === 1 ? 'image' : 'text')),
    mediaUrls: postData.mediaUrls || [],
    gearTag: postData.gearTag,
    audioTrack: postData.audioTrack,
    tags: postData.tags || [],
    likesCount: 0,
    isLiked: false,
    commentsCount: 0,
    repostsCount: 0,
    isReposted: false,
    isBookmarked: false,
    createdAt: 'Just now',
    comments: [],
    locationTag: postData.locationTag || currentUser.location,
    badgeTag: postData.badgeTag || (currentUser.role === 'VIP CONTRIBUTOR' ? 'VIP CONTRIBUTOR' : undefined),
    tier: postData.tier || 'public'
  };

  const updatedPosts = [newPost, ...posts];
  saveStoredPosts(updatedPosts);

  // Increment user's post count
  const updatedUser: User = {
    ...currentUser,
    stats: {
      ...currentUser.stats,
      postsCount: currentUser.stats.postsCount + 1
    }
  };
  saveStoredUser(updatedUser);

  return newPost;
}

/**
 * Toggle like status on a post.
 * 
 * PROD BACKEND:
 * POST /api/v1/posts/:postId/like
 * Handled via atomic Redis increment and deferred PostgreSQL write-behind.
 */
export async function toggleLikePost(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
  await delay(100);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/posts/${postId}/like`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  }

  const posts = getStoredPosts();
  let result = { isLiked: false, likesCount: 0 };

  const updated = posts.map(p => {
    if (p.id === postId) {
      const willBeLiked = !p.isLiked;
      const count = willBeLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
      result = { isLiked: willBeLiked, likesCount: count };
      return {
        ...p,
        isLiked: willBeLiked,
        likesCount: count
      };
    }
    return p;
  });

  saveStoredPosts(updated);
  return result;
}

/**
 * Toggle bookmark status on a post.
 * 
 * PROD BACKEND:
 * POST /api/v1/posts/:postId/bookmark
 */
export async function toggleBookmarkPost(postId: string): Promise<{ isBookmarked: boolean }> {
  await delay(100);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/posts/${postId}/bookmark`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  }

  const posts = getStoredPosts();
  let isBookmarked = false;

  const updated = posts.map(p => {
    if (p.id === postId) {
      isBookmarked = !p.isBookmarked;
      return { ...p, isBookmarked };
    }
    return p;
  });

  saveStoredPosts(updated);
  return { isBookmarked };
}

/**
 * Toggle repost status on a post.
 * 
 * PROD BACKEND:
 * POST /api/v1/posts/:postId/repost
 */
export async function toggleRepostPost(postId: string): Promise<{ isReposted: boolean; repostsCount: number }> {
  await delay(120);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/posts/${postId}/repost`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle repost');
    return res.json();
  }

  const posts = getStoredPosts();
  let result = { isReposted: false, repostsCount: 0 };

  const updated = posts.map(p => {
    if (p.id === postId) {
      const isReposted = !p.isReposted;
      const repostsCount = isReposted ? p.repostsCount + 1 : Math.max(0, p.repostsCount - 1);
      result = { isReposted, repostsCount };
      return { ...p, isReposted, repostsCount };
    }
    return p;
  });

  saveStoredPosts(updated);
  return result;
}

/**
 * Add a comment to a post.
 * 
 * PROD BACKEND:
 * POST /api/v1/posts/:postId/comments
 * Body: { content }
 */
export async function addComment(postId: string, content: string): Promise<Comment> {
  await delay(200);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
  }

  const currentUser = getStoredUser();
  const posts = getStoredPosts();

  const newComment: Comment = {
    id: `c_${Date.now()}`,
    postId,
    author: {
      id: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      isVerified: currentUser.isVerified,
      role: currentUser.role
    },
    content,
    createdAt: 'Just now',
    likesCount: 0,
    isLiked: false
  };

  const updated = posts.map(p => {
    if (p.id === postId) {
      return {
        ...p,
        commentsCount: p.commentsCount + 1,
        comments: [...p.comments, newComment]
      };
    }
    return p;
  });

  saveStoredPosts(updated);
  return newComment;
}

/**
 * Retrieve the current authenticated user.
 * 
 * PROD BACKEND:
 * GET /api/v1/auth/me
 */
export async function getCurrentUser(): Promise<User> {
  await delay(120);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/me`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }

  return getStoredUser();
}

/**
 * Update the user's profile information.
 * 
 * PROD BACKEND:
 * PATCH /api/v1/users/me
 * Body: { displayName, bio, location, website, handle, avatarUrl, bannerUrl }
 */
export async function updateUserProfile(data: Partial<User>): Promise<User> {
  await delay(250);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  }

  const current = getStoredUser();
  const updated: User = {
    ...current,
    ...data,
    stats: {
      ...current.stats,
      ...(data.stats || {})
    }
  };

  saveStoredUser(updated);

  // Sync author profile across existing posts by this user
  const posts = getStoredPosts();
  const syncedPosts = posts.map(p => {
    if (p.author.id === current.id) {
      return {
        ...p,
        author: {
          ...p.author,
          displayName: updated.displayName,
          handle: updated.handle,
          avatarUrl: updated.avatarUrl,
          bio: updated.bio
        }
      };
    }
    return p;
  });
  saveStoredPosts(syncedPosts);

  return updated;
}

/**
 * Retrieve a user's public profile by handle or username.
 * 
 * PROD BACKEND:
 * GET /api/v1/users/:username
 */
export async function getUserProfile(username: string): Promise<User | null> {
  await delay(150);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/users/${username}`);
    if (!res.ok) return null;
    return res.json();
  }

  const currentUser = getStoredUser();
  if (currentUser.username === username || currentUser.handle === username) {
    return currentUser;
  }

  const suggested = INITIAL_SUGGESTED_CREATORS.find(c => c.username === username || c.handle === username);
  if (suggested) return suggested;

  const postAuthor = INITIAL_POSTS.find(p => p.author.username === username || p.author.handle === username)?.author;
  return postAuthor || null;
}

/**
 * Retrieve all posts authored by a specific user.
 * 
 * PROD BACKEND:
 * GET /api/v1/users/:userId/posts
 */
export async function getUserPosts(userId: string): Promise<Post[]> {
  await delay(150);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/users/${userId}/posts`);
    if (!res.ok) throw new Error('Failed to fetch user posts');
    return res.json();
  }

  const posts = getStoredPosts();
  return posts.filter(p => p.author.id === userId || p.author.username === userId);
}

/**
 * Retrieve active stories row.
 * 
 * PROD BACKEND:
 * GET /api/v1/stories
 */
export async function getStories(): Promise<Story[]> {
  await delay(120);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/stories`);
    if (!res.ok) throw new Error('Failed to fetch stories');
    return res.json();
  }

  return INITIAL_STORIES;
}

/**
 * Retrieve suggested creators to follow.
 * 
 * PROD BACKEND:
 * GET /api/v1/creators/suggested
 */
export async function getSuggestedCreators(): Promise<User[]> {
  await delay(150);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/creators/suggested`);
    if (!res.ok) throw new Error('Failed to fetch suggested creators');
    return res.json();
  }

  return INITIAL_SUGGESTED_CREATORS;
}

/**
 * Toggle follow status for a creator.
 * 
 * PROD BACKEND:
 * POST /api/v1/users/:userId/follow
 */
export async function toggleFollowUser(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
  await delay(150);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/users/${userId}/follow`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle follow');
    return res.json();
  }

  const creator = INITIAL_SUGGESTED_CREATORS.find(c => c.id === userId);
  if (creator) {
    creator.isFollowing = !creator.isFollowing;
    creator.stats.followersCount += creator.isFollowing ? 1 : -1;
    return {
      isFollowing: creator.isFollowing,
      followersCount: creator.stats.followersCount
    };
  }

  return { isFollowing: true, followersCount: 1 };
}

/**
 * Retrieve notifications stream with filter.
 * 
 * PROD BACKEND:
 * GET /api/v1/notifications?filter={filter}
 */
export async function getNotifications(filter?: string): Promise<Notification[]> {
  await delay(150);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/notifications?filter=${filter || 'all'}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  }

  const notifs = getStoredNotifications();
  if (!filter || filter === 'all') return notifs;
  if (filter === 'unread') return notifs.filter(n => !n.isRead);
  if (filter === 'mentions') return notifs.filter(n => n.type === 'mention');
  if (filter === 'broadcasts') return notifs.filter(n => n.type === 'broadcast');
  if (filter === 'reactions') return notifs.filter(n => n.type === 'like');

  return notifs;
}

/**
 * Mark all notifications as read.
 * 
 * PROD BACKEND:
 * POST /api/v1/notifications/mark-read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await delay(120);

  if (!USE_MOCK_DATA) {
    await fetch(`${BACKEND_BASE_URL}/notifications/mark-read`, { method: 'POST' });
    return;
  }

  const notifs = getStoredNotifications();
  const updated = notifs.map(n => ({ ...n, isRead: true }));
  saveStoredNotifications(updated);
}

/**
 * Retrieve marketplace insignias & badges.
 * 
 * PROD BACKEND:
 * GET /api/v1/marketplace/badges
 */
export async function getBadges(): Promise<BadgeItem[]> {
  await delay(150);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/marketplace/badges`);
    if (!res.ok) throw new Error('Failed to fetch badges');
    return res.json();
  }

  return getStoredBadges();
}

/**
 * Purchase a badge with Sparks currency.
 * 
 * PROD BACKEND:
 * POST /api/v1/marketplace/badges/:badgeId/purchase
 */
export async function purchaseBadge(badgeId: string): Promise<{ success: boolean; remainingSparks: number }> {
  await delay(250);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/marketplace/badges/${badgeId}/purchase`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to purchase badge');
    return res.json();
  }

  const currentUser = getStoredUser();
  const badges = getStoredBadges();
  const badge = badges.find(b => b.id === badgeId);

  if (!badge) throw new Error('Badge not found');
  if (currentUser.sparksBalance < badge.priceSparks) {
    throw new Error('Insufficient Sparks balance');
  }

  const remainingSparks = currentUser.sparksBalance - badge.priceSparks;
  const updatedUser: User = {
    ...currentUser,
    sparksBalance: remainingSparks,
    badges: Array.from(new Set([...currentUser.badges, badge.name]))
  };
  saveStoredUser(updatedUser);

  const updatedBadges = badges.map(b => b.id === badgeId ? { ...b, isOwned: true } : b);
  saveStoredBadges(updatedBadges);

  return { success: true, remainingSparks };
}

/**
 * Equip or unequip a badge in the user's active showcase.
 * 
 * PROD BACKEND:
 * POST /api/v1/users/me/badges/:badgeId/equip
 */
export async function toggleEquipBadge(badgeId: string): Promise<{ success: boolean; equippedBadgeIds: string[] }> {
  await delay(180);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/users/me/badges/${badgeId}/equip`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to equip badge');
    return res.json();
  }

  const currentUser = getStoredUser();
  const badges = getStoredBadges();
  const badge = badges.find(b => b.id === badgeId);
  if (!badge) throw new Error('Badge not found');

  let equipped = [...currentUser.equippedBadgeIds];
  const isCurrentlyEquipped = equipped.includes(badgeId);

  if (isCurrentlyEquipped) {
    equipped = equipped.filter(id => id !== badgeId);
  } else {
    // Max 4 equipped badges allowed
    if (equipped.length >= 4) {
      equipped.shift(); // Remove oldest
    }
    equipped.push(badgeId);
  }

  const updatedUser: User = { ...currentUser, equippedBadgeIds: equipped };
  saveStoredUser(updatedUser);

  const updatedBadges = badges.map(b => ({
    ...b,
    isEquipped: equipped.includes(b.id)
  }));
  saveStoredBadges(updatedBadges);

  return { success: true, equippedBadgeIds: equipped };
}

/**
 * Retrieve neural explore tree data.
 * 
 * PROD BACKEND:
 * GET /api/v1/explore/neural-tree
 */
export async function getNeuralGraphData(): Promise<NeuralNode[]> {
  await delay(120);

  if (!USE_MOCK_DATA) {
    const res = await fetch(`${BACKEND_BASE_URL}/explore/neural-tree`);
    if (!res.ok) throw new Error('Failed to fetch neural graph');
    return res.json();
  }

  return INITIAL_NEURAL_NODES;
}

/**
 * Upload media file (simulates MinIO Object Storage Port 9000 upload).
 * 
 * PROD BACKEND:
 * POST /api/v1/media/upload
 * Multipart form data -> streams directly into MinIO S3 bucket, returns public CDN URL.
 */
export async function uploadMediaFile(file: File): Promise<{ url: string; fileKey: string }> {
  await delay(400);

  if (!USE_MOCK_DATA) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BACKEND_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload media to MinIO');
    return res.json();
  }

  // Convert File to data URL for instantaneous in-browser preview & persistence
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        url: reader.result as string,
        fileKey: `minio_blob_${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Check backend architecture status for reference graph
 * Node.js (3000) <-> Redis (6379), MinIO (9000), PostgreSQL (5432)
 */
export async function getBackendStatus(): Promise<BackendArchInfo> {
  await delay(100);
  return {
    server: {
      status: 'online',
      runtime: 'Node.js Express v4.21.2',
      port: 3000
    },
    redis: {
      status: 'connected',
      port: 6379,
      hitsRate: '99.4% cache hit'
    },
    minio: {
      status: 'connected',
      port: 9000,
      bucket: 'pbm-media-assets'
    },
    postgres: {
      status: 'connected',
      port: 5432,
      tables: ['users', 'posts', 'comments', 'likes', 'badges', 'neural_nodes', 'sessions']
    }
  };
}

/**
 * Reset local test storage back to initial state
 */
export function resetMockData() {
  localStorage.removeItem(STORAGE_POSTS_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_NOTIFS_KEY);
  localStorage.removeItem(STORAGE_BADGES_KEY);
  localStorage.removeItem('pbm_channel_messages_v1');
}

// ============================================================================
// DISCORD INTERFACE ENDPOINTS (FOR CHANNELS VIEW)
// ============================================================================

const STORAGE_MESSAGES_KEY = 'pbm_channel_messages_v1';

const INITIAL_SERVERS: DiscordServer[] = [
  { id: 'pbm', name: 'Project Blue Mountain', shortName: 'BM', hasAudioStage: true },
  { id: 'gc', name: 'Generative Cinema Lab', shortName: 'GC' },
  { id: 'audio', name: 'Modular Audio Stages', shortName: 'AUD', unreadCount: 3, hasAudioStage: true },
  { id: 'gpu', name: 'WebGPU Shader Guild', shortName: 'GPU' },
  { id: 'code', name: 'Code & Scripts', shortName: '</>' },
];

const INITIAL_CATEGORIES: ChannelCategory[] = [
  {
    id: 'cat_welcome',
    name: 'WELCOME & INFO',
    channels: [
      { id: 'c_announcements', name: 'announcements', type: 'announcement', unreadDot: true, topic: 'Official release notes and Alpha announcements' },
      { id: 'c_rules', name: 'rules-and-roles', type: 'text', topic: 'Server guidelines and creator role badges' }
    ]
  },
  {
    id: 'cat_general',
    name: 'GENERAL',
    channels: [
      { id: 'c_lounge', name: 'lounge', type: 'text', unreadCount: '9+', topic: 'Discuss design patterns, generative workflows, and real-time audio production.' },
      { id: 'c_show_work', name: 'show-your-work', type: 'text', topic: 'Showcase your shaders, Figma systems, and audio stems' },
      { id: 'c_feedback', name: 'feedback-critique', type: 'text', topic: 'Peer feedback on typography, color palettes, and UX' }
    ]
  },
  {
    id: 'cat_audio',
    name: 'AUDIO & STAGES',
    channels: [
      { 
        id: 'c_ambient_jam', 
        name: 'Live Ambient Jam', 
        type: 'stage', 
        badge: '3 LIVE', 
        activeListenersCount: 15,
        activeListenersAvatars: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        ],
        topic: '32-bit float WebAudio stage featuring ambient synth jams' 
      },
      { id: 'c_dev_hangout', name: 'Dev Hangout', type: 'voice', topic: 'Casual voice chat for alpha contributors and developers' }
    ]
  },
  {
    id: 'cat_pro',
    name: 'PRO TIER CHANNELS',
    badge: 'PRO',
    channels: [
      { id: 'c_pro_lounge', name: 'pro-creators-lounge', type: 'locked', isLocked: true, badge: 'PRO', topic: 'Exclusive lounge for verified Pro Creators' },
      { id: 'c_early_releases', name: 'early-releases', type: 'locked', isLocked: true, badge: 'PRO', topic: 'Pre-release firmware and WebRTC test builds' }
    ]
  }
];

const INITIAL_CHANNEL_MESSAGES: Record<string, DiscordChatMessage[]> = {
  c_lounge: [
    {
      id: 'msg_01',
      channelId: 'c_lounge',
      author: {
        id: 'usr_marcus_raw',
        username: 'marcus.raw',
        displayName: 'marcus.raw',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        role: 'ADMIN',
        isVerified: true
      },
      content: 'Hey everyone! We just dropped the v0.0.1 alpha update for Project Blue Mountain. The new low-latency spatial audio engine is live in the Live Ambient Jam channel right now. Join in if you want to test the multi-track buffers!',
      timestamp: '10:42 AM',
      attachment: {
        title: 'Spatial Audio Engine Patch v0.0.1',
        type: 'BROADCAST LIVE',
        desc: 'WebAudio pipeline refactored with SIMD-accelerated FFT filters. Zero dropouts under 12 concurrent creator nodes.',
        stats: 'Listen Live Stage • Latency: 8.4ms • Opus 128kbps',
        isAudioStage: true
      },
      reactions: [
        { emoji: '🔥', count: 14, hasReacted: false },
        { emoji: '⚡', count: 8, hasReacted: true },
        { emoji: '🏔️', count: 22, hasReacted: false }
      ]
    },
    {
      id: 'msg_02',
      channelId: 'c_lounge',
      author: {
        id: 'usr_kai_creative',
        username: 'kai_creative',
        displayName: 'kai_creative',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
        role: 'PRO CREATOR',
        isVerified: true
      },
      content: 'Tested the stem isolation node with an ambient tape loop recording. Cleanest mid-range warmth I’ve heard in an in-browser stage.',
      timestamp: '11:03 AM',
      reactions: [
        { emoji: '✨', count: 6, hasReacted: false }
      ]
    }
  ],
  c_announcements: [
    {
      id: 'msg_ann_01',
      channelId: 'c_announcements',
      author: {
        id: 'usr_marcus_raw',
        username: 'marcus.raw',
        displayName: 'marcus.raw',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        role: 'ADMIN',
        isVerified: true
      },
      content: '📢 Project Blue Mountain Alpha 0.0.1 is officially open for pioneer node onboarding. Check your Sparks balances in preferences!',
      timestamp: 'Yesterday at 9:00 AM',
      reactions: [
        { emoji: '🚀', count: 45, hasReacted: true }
      ]
    }
  ]
};

const INITIAL_MEMBERS: GuildMember[] = [
  // Admin / Core Team
  {
    id: 'mem_alex',
    username: 'alex_rivera',
    displayName: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'ADMIN / CORE TEAM',
    status: 'online',
    activity: 'Working on Alpha 0.0.1',
    isVerified: true,
    badge: '👑'
  },
  {
    id: 'mem_marcus',
    username: 'marcus.raw',
    displayName: 'marcus.raw',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'ADMIN / CORE TEAM',
    status: 'online',
    activity: 'Playing: Live Ambient Jam',
    isVerified: true,
    badge: '⚡'
  },

  // Pro Creators
  {
    id: 'mem_kai',
    username: 'kai_creative',
    displayName: 'kai_creative',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'online',
    activity: 'Figma / MountainUI',
    isSpeaking: true,
    isVerified: true
  },
  {
    id: 'mem_elena',
    username: 'elena.visuals',
    displayName: 'elena.visuals',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'online',
    activity: 'Blender 4.2 Pro',
    isVerified: true
  },
  {
    id: 'mem_synthwave',
    username: 'synthwave_dev',
    displayName: 'synthwave_dev',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'idle',
    activity: 'Away',
    isSpeaking: true,
    isVerified: true
  },

  // Online
  {
    id: 'mem_aura',
    username: 'AuraOperative',
    displayName: 'AuraOperative',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'ONLINE',
    status: 'online'
  },
  {
    id: 'mem_pixel',
    username: 'PixelPilot_99',
    displayName: 'PixelPilot_99',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'ONLINE',
    status: 'online'
  },

  // Offline
  {
    id: 'mem_neotokyo',
    username: 'NeoTokyo_Synth',
    displayName: 'NeoTokyo_Synth',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'OFFLINE',
    status: 'offline'
  },
  {
    id: 'mem_cyberranger',
    username: 'CyberRanger',
    displayName: 'CyberRanger',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face',
    roleGroup: 'OFFLINE',
    status: 'offline'
  }
];

function getStoredChannelMessages(): Record<string, DiscordChatMessage[]> {
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load channel messages', e);
  }
  return INITIAL_CHANNEL_MESSAGES;
}

function saveStoredChannelMessages(data: Record<string, DiscordChatMessage[]>) {
  try {
    localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save channel messages', e);
  }
}

/**
 * Retrieve all Discord servers on the guild rail.
 * PROD BACKEND: GET /api/v1/discord/servers
 */
export async function getDiscordServers(): Promise<DiscordServer[]> {
  await delay(100);
  return INITIAL_SERVERS;
}

/**
 * Retrieve channel categories for a server.
 * PROD BACKEND: GET /api/v1/discord/servers/:serverId/channels
 */
export async function getChannelCategories(serverId: string): Promise<ChannelCategory[]> {
  await delay(120);
  return INITIAL_CATEGORIES;
}

/**
 * Retrieve messages for a given channel.
 * PROD BACKEND: GET /api/v1/discord/channels/:channelId/messages
 */
export async function getChannelMessages(channelId: string): Promise<DiscordChatMessage[]> {
  await delay(150);
  const store = getStoredChannelMessages();
  return store[channelId] || [];
}

/**
 * Send a message into a Discord channel.
 * PROD BACKEND: POST /api/v1/discord/channels/:channelId/messages
 */
export async function sendChannelMessage(channelId: string, content: string): Promise<DiscordChatMessage> {
  await delay(180);
  const currentUser = getStoredUser();
  const store = getStoredChannelMessages();
  const currentList = store[channelId] || [];

  const newMsg: DiscordChatMessage = {
    id: `msg_${Date.now()}`,
    channelId,
    author: {
      id: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      role: 'ADMIN',
      isVerified: currentUser.isVerified
    },
    content,
    timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: []
  };

  store[channelId] = [...currentList, newMsg];
  saveStoredChannelMessages(store);
  return newMsg;
}

/**
 * Toggle a reaction on a message.
 * PROD BACKEND: POST /api/v1/discord/messages/:messageId/reactions
 */
export async function toggleMessageReaction(channelId: string, messageId: string, emoji: string): Promise<DiscordReaction[]> {
  await delay(80);
  const store = getStoredChannelMessages();
  const list = store[channelId] || [];

  let updatedReactions: DiscordReaction[] = [];

  store[channelId] = list.map(msg => {
    if (msg.id === messageId) {
      const existing = msg.reactions.find(r => r.emoji === emoji);
      let newReactions = [...msg.reactions];
      if (existing) {
        if (existing.hasReacted) {
          newReactions = newReactions.map(r => r.emoji === emoji ? { ...r, count: Math.max(1, r.count - 1), hasReacted: false } : r);
        } else {
          newReactions = newReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, hasReacted: true } : r);
        }
      } else {
        newReactions.push({ emoji, count: 1, hasReacted: true });
      }
      updatedReactions = newReactions;
      return { ...msg, reactions: newReactions };
    }
    return msg;
  });

  saveStoredChannelMessages(store);
  return updatedReactions;
}

/**
 * Retrieve members for a guild.
 * PROD BACKEND: GET /api/v1/discord/servers/:serverId/members
 */
export async function getGuildMembers(serverId: string): Promise<GuildMember[]> {
  await delay(120);
  return INITIAL_MEMBERS;
}

// =========================================================================
// ALGORITHM SETTINGS & NEURAL INTEREST TREE ENGINE
// =========================================================================

const STORAGE_ALGORITHM_KEY = 'pbm_algorithm_settings_v1';
const STORAGE_INTEREST_TREE_KEY = 'pbm_interest_tree_v2';
const STORAGE_DISCORD_DMS_KEY = 'pbm_discord_dms_v1';

export const INITIAL_ALGORITHM_SETTINGS: AlgorithmSettings = {
  enabled: true,
  explorationRate: 70, // 70% Serendipity / Discovery
  recencyWeight: 45,
  personalizationStrength: 85,
  discoveryMode: 'balanced',
  autoClustering: true,
  interestDecayDays: 14
};

export const INITIAL_INTEREST_TREE: InterestTreeNode = {
  id: 'root_alex',
  label: '@ALEX (Core Nexus)',
  category: 'root',
  depth: 0,
  count: 148,
  affinityScore: 100,
  location: 'San Francisco, CA',
  description: 'Primary root anchor of your personalized knowledge graph and feed recommendation model.',
  isExpanded: true,
  isEnabled: true,
  children: [
    {
      id: 'branch_visual',
      label: 'Visual Arts & Shaders',
      category: 'active',
      depth: 1,
      count: 62,
      affinityScore: 94,
      location: 'SF Creative Tech Lab',
      description: 'Hardware accelerated WebGPU pipelines, procedural generation, GLSL math, and tactile interfaces.',
      isExpanded: true,
      isEnabled: true,
      children: [
        {
          id: 'sub_shaders',
          label: 'WebGPU & Shader Computing',
          category: 'active',
          depth: 2,
          count: 36,
          affinityScore: 96,
          location: 'San Francisco, CA',
          description: 'High-density computational canvas techniques and real-time fragment raymarching.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_glsl',
              label: 'GLSL Raymarching',
              category: 'active',
              depth: 3,
              count: 18,
              affinityScore: 96,
              description: 'Distance fields, volumetric lighting, and mathematical ray intersections.',
              isEnabled: true,
              tags: ['#glsl', '#raymarching', '#math']
            },
            {
              id: 'leaf_sdf',
              label: 'Signed Distance Fields (SDF)',
              category: 'discovered',
              depth: 3,
              count: 14,
              affinityScore: 91,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Inferred: Frequently bookmarked shader repositories and Arc Design posts.',
              description: 'Smooth minimum blending, fractal domain repetition, and volumetric modeling.',
              isEnabled: true,
              tags: ['#sdf', '#procedural']
            },
            {
              id: 'leaf_wgsl',
              label: 'Compute Shaders (WGSL)',
              category: 'undiscovered',
              depth: 3,
              count: 8,
              affinityScore: 78,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Predicted: High affinity cluster linked to your WebGPU Guild activity.',
              description: 'GPU thread dispatching, particle simulations, and memory atomic operations.',
              isEnabled: true,
              tags: ['#wgsl', '#webgpu']
            }
          ]
        },
        {
          id: 'sub_tactile_ui',
          label: 'Tactile UI & Glassmorphism',
          category: 'active',
          depth: 2,
          count: 26,
          affinityScore: 88,
          description: 'Modern tactile surfaces, frosted glass shaders, and ultra-crisp information density.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_retro_web',
              label: '2015 Retro UI Web',
              category: 'active',
              depth: 3,
              count: 52,
              affinityScore: 92,
              description: 'Skeuomorphic bevels, metallic trims, and responsive desktop workstation density.',
              isEnabled: true,
              tags: ['#retroui', '#skeuo', '#webdesign']
            },
            {
              id: 'leaf_glass_materials',
              label: 'Refractive Glass Materials',
              category: 'active',
              depth: 3,
              count: 30,
              affinityScore: 84,
              description: 'Chromatic aberration, internal reflections, and frosted backdrops.',
              isEnabled: true,
              tags: ['#glassmorphism', '#shaders']
            },
            {
              id: 'leaf_cyberpunk',
              label: 'Cyberpunk Typography',
              category: 'discovered',
              depth: 3,
              count: 21,
              affinityScore: 82,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Inferred: High interaction with dark neon palette and terminal code cards.',
              description: 'Monospaced glyphs, matrix status readouts, and glowing accent badges.',
              isEnabled: true,
              tags: ['#cyberpunk', '#typography']
            }
          ]
        }
      ]
    },
    {
      id: 'branch_audio',
      label: 'Sound Synthesis & Web Audio',
      category: 'active',
      depth: 1,
      count: 78,
      affinityScore: 98,
      description: 'Eurorack modular hardware, 32-bit float audio stages, DSP algorithms, and ambient generative drone.',
      isExpanded: true,
      isEnabled: true,
      children: [
        {
          id: 'sub_modular',
          label: 'Modular & Hardware Synthesis',
          category: 'active',
          depth: 2,
          count: 42,
          affinityScore: 97,
          description: 'Patch cable logic, analog oscillators, resonant lowpass filters, and voltage control.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_synthwave',
              label: 'Synthwave & Outrun',
              category: 'active',
              depth: 3,
              count: 64,
              affinityScore: 97,
              description: 'Analog poly synths, arpeggiated basslines, gated snares, and vintage aesthetics.',
              isEnabled: true,
              tags: ['#synthwave', '#outrun', '#analog']
            },
            {
              id: 'leaf_preamp',
              label: 'Vintage Modular Preamp',
              category: 'discovered',
              depth: 3,
              count: 19,
              affinityScore: 89,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Inferred: Correlated with listening history in Live Ambient Jam stages.',
              description: 'Vacuum tube saturation curves, transformer harmonic distortion, and tape flutter.',
              isEnabled: true,
              tags: ['#preamp', '#tubes', '#hardware']
            },
            {
              id: 'leaf_eurorack',
              label: 'Eurorack Control Voltage',
              category: 'undiscovered',
              depth: 3,
              count: 11,
              affinityScore: 74,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Predicted: 91% co-occurrence with modular synth hobbyists.',
              description: 'Gate sequencers, clock dividers, LFO modulation buses, and VCA circuits.',
              isEnabled: true,
              tags: ['#eurorack', '#cv']
            }
          ]
        },
        {
          id: 'sub_dsp',
          label: 'Algorithmic Soundscapes & DSP',
          category: 'active',
          depth: 2,
          count: 36,
          affinityScore: 93,
          description: 'Generative cellular automata, spatial convolution, and real-time WebRTC soundcard pipelines.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_soundscapes',
              label: 'Generative Cellular Automata',
              category: 'active',
              depth: 3,
              count: 35,
              affinityScore: 93,
              description: 'Rule-based algorithmic melodies and evolving harmonic drone textures.',
              isEnabled: true,
              tags: ['#generative', '#ambient', '#drone']
            },
            {
              id: 'leaf_spatial_dsp',
              label: 'Spatial Audio DSP (WebRTC)',
              category: 'discovered',
              depth: 3,
              count: 44,
              affinityScore: 94,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Inferred: Active listener in Project Blue Mountain 32-bit Audio Stage.',
              description: 'Head-related transfer functions (HRTF), ambisonics, and binaural panners.',
              isEnabled: true,
              tags: ['#spatialaudio', '#webaudio', '#dsp']
            },
            {
              id: 'leaf_fft',
              label: 'Fast Fourier Transform Visualizers',
              category: 'active',
              depth: 3,
              count: 22,
              affinityScore: 86,
              description: 'Real-time frequency bin analysis, spectrograms, and reactive canvas shaders.',
              isEnabled: true,
              tags: ['#fft', '#visualizer']
            }
          ]
        }
      ]
    },
    {
      id: 'branch_cinema',
      label: 'Cinema & Visual Storytelling',
      category: 'roots',
      depth: 1,
      count: 45,
      affinityScore: 84,
      description: 'Sign-up interest root: Speculative indie sci-fi, act structures, worldbuilding, and AI filmmaking.',
      isExpanded: true,
      isEnabled: true,
      children: [
        {
          id: 'sub_gen_cinema',
          label: 'Generative Cinema & Virtual Stage',
          category: 'discovered',
          depth: 2,
          count: 28,
          affinityScore: 89,
          isAlgorithmic: true,
          inferredReason: 'Algorithm Inferred: Cross-domain correlation between GLSL visuals and AI diffusion models.',
          description: 'Temporal consistency, latent camera paths, and LED volume in-camera visual effects.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_diffusion_video',
              label: 'Generative Video Diffusion',
              category: 'discovered',
              depth: 3,
              count: 42,
              affinityScore: 90,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Inferred: Frequent shares from Kai Creative generative reel.',
              description: 'Video diffusion checkpoints, controlnet pose sequences, and temporal upscaling.',
              isEnabled: true,
              tags: ['#genai', '#cinema', '#video']
            },
            {
              id: 'leaf_unreal',
              label: 'Unreal 5 Virtual Stage',
              category: 'discovered',
              depth: 3,
              count: 31,
              affinityScore: 85,
              isAlgorithmic: true,
              description: 'Lumen real-time global illumination and virtual production camera frustums.',
              isEnabled: true,
              tags: ['#unreal5', '#virtualproduction']
            }
          ]
        },
        {
          id: 'sub_screenwriting',
          label: 'Narrative Craft & Speculative Fiction',
          category: 'roots',
          depth: 2,
          count: 17,
          affinityScore: 78,
          description: 'Hard science fiction, character arcs, visual subtext, and dystopian world lore.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_scifi',
              label: 'Indie Sci-Fi Worldbuilding',
              category: 'roots',
              depth: 3,
              count: 15,
              affinityScore: 81,
              description: 'Speculative technologies, solarpunk futures, and cybernetic philosophy.',
              isEnabled: true,
              tags: ['#scifi', '#worldbuilding']
            },
            {
              id: 'leaf_anamorphic',
              label: 'Anamorphic Lens Ratios',
              category: 'roots',
              depth: 3,
              count: 22,
              affinityScore: 76,
              description: '2.39:1 widescreen framing, horizontal lens flares, and elliptical bokeh.',
              isEnabled: true,
              tags: ['#cinematography', '#optics']
            }
          ]
        }
      ]
    },
    {
      id: 'branch_sports',
      label: 'Sports & Kinematic Analytics',
      category: 'roots',
      depth: 1,
      count: 38,
      affinityScore: 76,
      description: 'Sign-up interest root: NBA spatial tracking, kinematic verticality, and athletic mechanics.',
      isExpanded: true,
      isEnabled: true,
      children: [
        {
          id: 'sub_basketball',
          label: 'Basketball & Spatial Tracking',
          category: 'roots',
          depth: 2,
          count: 28,
          affinityScore: 78,
          description: 'Expected possession value (EPV), spatial shot heatmaps, and highlight reels.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_nba_analytics',
              label: 'NBA Spatial Analytics',
              category: 'roots',
              depth: 3,
              count: 16,
              affinityScore: 79,
              description: 'Court coordinate tracking, pick-and-roll defensive coverage metrics.',
              isEnabled: true,
              tags: ['#nba', '#analytics', '#sports']
            },
            {
              id: 'leaf_dunks',
              label: 'High-Flying Dunk Kinematics',
              category: 'roots',
              depth: 3,
              count: 18,
              affinityScore: 75,
              description: 'Vertical takeoff impulse, hang-time physics, and rim-rattling finishes.',
              isEnabled: true,
              tags: ['#basketball', '#dunks']
            }
          ]
        },
        {
          id: 'sub_combat',
          label: 'MMA & Striking Dynamics',
          category: 'roots',
          depth: 2,
          count: 10,
          affinityScore: 68,
          description: 'Range management, striking velocity, and ground control leverage.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_combat',
              label: 'Striking Leverage & Angles',
              category: 'roots',
              depth: 3,
              count: 16,
              affinityScore: 70,
              description: 'Counter-punching trajectories and kinetic chain mechanics.',
              isEnabled: true,
              tags: ['#mma', '#combat']
            }
          ]
        }
      ]
    },
    {
      id: 'branch_frontier',
      label: 'Frontier Synapses & Undiscovered',
      category: 'undiscovered',
      depth: 1,
      count: 18,
      affinityScore: 58,
      description: 'Frontier exploration nodes awaiting deeper user interactions and neural recommendation activation.',
      isExpanded: true,
      isEnabled: true,
      children: [
        {
          id: 'sub_quantum',
          label: 'Quantum Photonics & Waveguides',
          category: 'undiscovered',
          depth: 2,
          count: 9,
          affinityScore: 60,
          description: 'Optical quantum states, photon interference arrays, and nonlinear waveguides.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_waveguides',
              label: 'Non-linear Waveguides',
              category: 'undiscovered',
              depth: 3,
              count: 5,
              affinityScore: 56,
              isAlgorithmic: true,
              inferredReason: 'Algorithm Emerging: High potential overlap with audio wave propagation.',
              description: 'Soliton dynamics and high-speed optical information routing.',
              isEnabled: true,
              tags: ['#quantum', '#physics']
            },
            {
              id: 'leaf_quantum_lattice',
              label: 'Quantum Photonics Lattices',
              category: 'undiscovered',
              depth: 3,
              count: 9,
              affinityScore: 52,
              isAlgorithmic: true,
              description: 'Entangled photon generation and integrated optical chipsets.',
              isEnabled: true,
              tags: ['#photonics']
            }
          ]
        },
        {
          id: 'sub_bio_deepsea',
          label: 'Deep Sea & Synthetic Bio',
          category: 'undiscovered',
          depth: 2,
          count: 9,
          affinityScore: 54,
          description: 'Hadopelagic ocean acoustics and DNA algorithmic computing.',
          isExpanded: true,
          isEnabled: true,
          children: [
            {
              id: 'leaf_hadopelagic',
              label: 'Hadopelagic Trench Acoustics',
              category: 'undiscovered',
              depth: 3,
              count: 3,
              affinityScore: 48,
              isAlgorithmic: true,
              description: 'Hydrothermal vent low-frequency rumble and pressure propagation.',
              isEnabled: true,
              tags: ['#ocean', '#acoustics']
            },
            {
              id: 'leaf_synth_bio',
              label: 'Synthetic DNA Sonification',
              category: 'undiscovered',
              depth: 3,
              count: 4,
              affinityScore: 46,
              isAlgorithmic: true,
              description: 'Translating nucleotide sequences into harmonic polyphonic progressions.',
              isEnabled: true,
              tags: ['#synbio', '#sound']
            }
          ]
        }
      ]
    }
  ]
};

function getStoredAlgorithmSettings(): AlgorithmSettings {
  try {
    const raw = localStorage.getItem(STORAGE_ALGORITHM_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load algorithm settings', e);
  }
  return INITIAL_ALGORITHM_SETTINGS;
}

function saveStoredAlgorithmSettings(settings: AlgorithmSettings) {
  try {
    localStorage.setItem(STORAGE_ALGORITHM_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save algorithm settings', e);
  }
}

function getStoredInterestTree(): InterestTreeNode {
  try {
    const raw = localStorage.getItem(STORAGE_INTEREST_TREE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load interest tree', e);
  }
  return INITIAL_INTEREST_TREE;
}

function saveStoredInterestTree(tree: InterestTreeNode) {
  try {
    localStorage.setItem(STORAGE_INTEREST_TREE_KEY, JSON.stringify(tree));
  } catch (e) {
    console.error('Failed to save interest tree', e);
  }
}

/**
 * Retrieve current recommendation algorithm configuration.
 * PROD BACKEND: GET /api/v1/algorithm/settings
 */
export async function getAlgorithmSettings(): Promise<AlgorithmSettings> {
  await delay(80);
  return getStoredAlgorithmSettings();
}

/**
 * Toggle or update algorithm settings.
 * PROD BACKEND: PUT /api/v1/algorithm/settings
 */
export async function updateAlgorithmSettings(settings: Partial<AlgorithmSettings>): Promise<AlgorithmSettings> {
  await delay(120);
  const current = getStoredAlgorithmSettings();
  const updated = { ...current, ...settings };
  saveStoredAlgorithmSettings(updated);
  return updated;
}

/**
 * Explicit toggle for the recommendation algorithm.
 * PROD BACKEND: POST /api/v1/algorithm/toggle
 */
export async function setAlgorithmEnabled(enabled: boolean): Promise<AlgorithmSettings> {
  await delay(100);
  const current = getStoredAlgorithmSettings();
  const updated = { ...current, enabled };
  saveStoredAlgorithmSettings(updated);
  return updated;
}

/**
 * Retrieve hierarchical interest tree.
 * PROD BACKEND: GET /api/v1/interests/tree
 */
export async function getInterestTree(): Promise<InterestTreeNode> {
  await delay(120);
  return getStoredInterestTree();
}

/**
 * Toggle enable/disable on a specific interest tree node.
 */
export async function toggleInterestTreeNode(nodeId: string, enabled: boolean): Promise<InterestTreeNode> {
  await delay(90);
  const tree = getStoredInterestTree();

  function updateNode(node: InterestTreeNode): InterestTreeNode {
    if (node.id === nodeId) {
      return { ...node, isEnabled: enabled };
    }
    if (node.children) {
      return { ...node, children: node.children.map(updateNode) };
    }
    return node;
  }

  const updatedTree = updateNode(tree);
  saveStoredInterestTree(updatedTree);
  return updatedTree;
}

/**
 * Update the user affinity weight for an interest node (0 - 100%).
 */
export async function updateInterestNodeWeight(nodeId: string, weight: number): Promise<InterestTreeNode> {
  await delay(80);
  const tree = getStoredInterestTree();

  function updateNode(node: InterestTreeNode): InterestTreeNode {
    if (node.id === nodeId) {
      return { ...node, affinityScore: Math.max(0, Math.min(100, weight)) };
    }
    if (node.children) {
      return { ...node, children: node.children.map(updateNode) };
    }
    return node;
  }

  const updatedTree = updateNode(tree);
  saveStoredInterestTree(updatedTree);
  return updatedTree;
}

/**
 * Add a new interest node directly into the tree under a specified parent branch.
 */
export async function addInterestNode(
  parentId: string,
  label: string,
  category: 'roots' | 'discovered' | 'active' | 'undiscovered',
  description: string,
  location?: string
): Promise<InterestTreeNode> {
  await delay(120);
  const tree = getStoredInterestTree();

  const newNode: InterestTreeNode = {
    id: `leaf_${Date.now()}_${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    label,
    category,
    depth: 3,
    count: 1,
    affinityScore: 80,
    description,
    location: location?.trim() || undefined,
    isEnabled: true,
    tags: [`#${label.toLowerCase().replace(/[^a-z0-9]/g, '')}`]
  };

  function insertNode(node: InterestTreeNode): InterestTreeNode {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode]
      };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(insertNode)
      };
    }
    return node;
  }

  const updatedTree = insertNode(tree);
  saveStoredInterestTree(updatedTree);
  return updatedTree;
}

/**
 * Update or set location anchor on an existing interest node.
 */
export async function updateInterestNodeLocation(nodeId: string, location: string): Promise<InterestTreeNode> {
  await delay(80);
  const tree = getStoredInterestTree();

  function updateNode(node: InterestTreeNode): InterestTreeNode {
    if (node.id === nodeId) {
      return { ...node, location: location.trim() || undefined };
    }
    if (node.children) {
      return { ...node, children: node.children.map(updateNode) };
    }
    return node;
  }

  const updatedTree = updateNode(tree);
  saveStoredInterestTree(updatedTree);
  return updatedTree;
}

/**
 * Prune / remove an interest node from the tree.
 */
export async function pruneInterestNode(nodeId: string): Promise<InterestTreeNode> {
  await delay(100);
  const tree = getStoredInterestTree();

  function removeNode(node: InterestTreeNode): InterestTreeNode {
    if (!node.children) return node;
    return {
      ...node,
      children: node.children
        .filter(c => c.id !== nodeId)
        .map(removeNode)
    };
  }

  const updatedTree = removeNode(tree);
  saveStoredInterestTree(updatedTree);
  return updatedTree;
}

// =========================================================================
// DISCORD DIRECT MESSAGES & FRIENDS SERVICE
// =========================================================================

export const INITIAL_DISCORD_FRIENDS: GuildMember[] = [
  {
    id: 'usr_kai_creative',
    username: 'kai_creative',
    displayName: 'Kai Creative',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'online',
    activity: 'Playing Ableton Live 12',
    isSpeaking: true,
    isVerified: true,
    badge: 'Stage Host Pro'
  },
  {
    id: 'usr_arc_design',
    username: 'arc_design',
    displayName: 'Arc Design',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'online',
    activity: 'In Voice: Live Ambient Jam',
    isSpeaking: false,
    isVerified: true,
    badge: 'Neural Weaver'
  },
  {
    id: 'usr_elena_v',
    username: 'elena_v',
    displayName: 'Elena V.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'idle',
    activity: 'Streaming WebGPU Shaders',
    isSpeaking: false,
    isVerified: true,
    badge: 'Pixel Alchemist'
  },
  {
    id: 'usr_sarah_chen',
    username: 'sarah_c',
    displayName: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    roleGroup: 'ADMIN / CORE TEAM',
    status: 'online',
    activity: 'Developing Redis Cluster',
    isSpeaking: false,
    isVerified: true,
    badge: 'Community Architect'
  },
  {
    id: 'usr_synthwave_dev',
    username: 'synthwave_dev',
    displayName: 'Synthwave Dev',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    roleGroup: 'PRO CREATORS',
    status: 'dnd',
    activity: 'Listening to Synthwave & Outrun',
    isSpeaking: false,
    isVerified: true,
    badge: 'Synthwave Pioneer'
  },
  {
    id: 'usr_marcus_vance',
    username: 'mvance',
    displayName: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    roleGroup: 'ONLINE',
    status: 'offline',
    activity: 'Offline for 4h',
    isSpeaking: false,
    isVerified: false
  }
];

const INITIAL_DIRECT_MESSAGES: Record<string, DiscordChatMessage[]> = {
  usr_kai_creative: [
    {
      id: 'dm_1',
      channelId: 'dm_kai',
      author: {
        id: 'usr_kai_creative',
        username: 'kai_creative',
        displayName: 'Kai Creative',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
        role: 'PRO CREATOR',
        isVerified: true
      },
      content: 'Hey Alex! Did you check out the new spatial audio patch I pushed to the Stage? The low-end resonance at 48Hz is sublime.',
      timestamp: 'Today at 10:14 AM',
      attachment: {
        title: 'Spatial Audio Patch v0.0.1 (WebRTC DSP)',
        type: 'AUDIO PATCH',
        desc: '32-Bit Float HRTF convolution stage tuned for ambient drone jams and low-latency monitoring.',
        stats: '48.0 kHz • 2 Ch • 320 kbps Opus • 14ms Latency',
        isAudioStage: true
      },
      reactions: [{ emoji: '🔥', count: 4, hasReacted: true }, { emoji: '🎧', count: 3 }]
    },
    {
      id: 'dm_2',
      channelId: 'dm_kai',
      author: {
        id: 'usr_alex_rivera',
        username: 'alex_rivera',
        displayName: 'Alex Rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        role: 'ADMIN',
        isVerified: true
      },
      content: 'Listening right now on my studio monitors. The stereo separation is incredible. Let me hook up my Eurorack clock divider to it!',
      timestamp: 'Today at 10:18 AM',
      reactions: [{ emoji: '⚡', count: 2 }]
    }
  ],
  usr_arc_design: [
    {
      id: 'dm_3',
      channelId: 'dm_arc',
      author: {
        id: 'usr_arc_design',
        username: 'arc_design',
        displayName: 'Arc Design',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        role: 'PRO CREATOR',
        isVerified: true
      },
      content: 'Alex, take a look at this raymarched distance field shader! Works at 120 FPS on WebGPU.',
      timestamp: 'Yesterday at 8:40 PM',
      reactions: [{ emoji: '🏔️', count: 5 }]
    }
  ]
};

function getStoredDMs(): Record<string, DiscordChatMessage[]> {
  try {
    const raw = localStorage.getItem(STORAGE_DISCORD_DMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load DMs', e);
  }
  return INITIAL_DIRECT_MESSAGES;
}

function saveStoredDMs(dms: Record<string, DiscordChatMessage[]>) {
  try {
    localStorage.setItem(STORAGE_DISCORD_DMS_KEY, JSON.stringify(dms));
  } catch (e) {
    console.error('Failed to save DMs', e);
  }
}

/**
 * Retrieve Discord Friends List.
 * PROD BACKEND: GET /api/v1/discord/friends
 */
export async function getDiscordFriends(): Promise<GuildMember[]> {
  await delay(100);
  return INITIAL_DISCORD_FRIENDS;
}

/**
 * Retrieve 1-on-1 Direct Messages with a friend.
 * PROD BACKEND: GET /api/v1/discord/dms/:friendId
 */
export async function getDirectMessages(friendId: string): Promise<DiscordChatMessage[]> {
  await delay(110);
  const store = getStoredDMs();
  return store[friendId] || [];
}

/**
 * Send a 1-on-1 Direct Message.
 * PROD BACKEND: POST /api/v1/discord/dms/:friendId
 */
export async function sendDirectMessage(friendId: string, content: string): Promise<DiscordChatMessage> {
  await delay(130);
  const currentUser = getStoredUser();
  const store = getStoredDMs();
  const currentList = store[friendId] || [];

  const newMsg: DiscordChatMessage = {
    id: `dm_${Date.now()}`,
    channelId: `dm_${friendId}`,
    author: {
      id: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      role: 'ADMIN',
      isVerified: currentUser.isVerified
    },
    content,
    timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: []
  };

  store[friendId] = [...currentList, newMsg];
  saveStoredDMs(store);
  return newMsg;
}

