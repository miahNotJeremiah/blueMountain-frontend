import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  Volume2, 
  Lock, 
  Send, 
  Radio, 
  Users, 
  Sparkles, 
  Headphones, 
  Mic, 
  MicOff,
  HeadphoneOff,
  Search,
  Smile,
  Gift,
  Plus,
  Compass,
  Bell,
  Pin,
  HelpCircle,
  Inbox,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  MoreVertical,
  Play,
  Pause,
  PhoneOff,
  ScreenShare,
  MessageSquare,
  Flame,
  Zap,
  Mountain,
  Settings as SettingsIcon,
  SmilePlus,
  Check,
  Layers,
  Image as ImageIcon,
  Disc,
  Gamepad2,
  X,
  UserPlus,
  Phone,
  Video,
  UserCheck,
  UserX,
  VolumeX,
  Monitor,
  AtSign,
  FolderPlus,
  Sliders,
  ExternalLink,
  Circle,
  Moon,
  MinusCircle
} from 'lucide-react';
import { User, DiscordServer, ChannelCategory, ChannelItem, DiscordChatMessage, GuildMember } from '../types';
import * as apiService from '../services/apiService';

interface ChannelsViewProps {
  currentUser: User;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({ currentUser }) => {
  // Navigation State
  const [activeServerId, setActiveServerId] = useState<string>('pbm');
  const [activeTab, setActiveTab] = useState<'channels' | 'messages'>('channels'); // 'channels' = server channels, 'messages' = DMs & Friends
  const [activeChannelId, setActiveChannelId] = useState<string>('c_lounge');
  
  // DM & Friends State
  const [activeDMUserId, setActiveDMUserId] = useState<string | null>(null); // null = Friends Hub, or userId for 1-on-1 DM
  const [friendsTab, setFriendsTab] = useState<'online' | 'all' | 'pending' | 'blocked' | 'add'>('online');
  const [dmSearchQuery, setDmSearchQuery] = useState('');
  const [dmInputText, setDmInputText] = useState('');
  const [dmHistory, setDmHistory] = useState<DiscordChatMessage[]>([]);

  // Server & Channel Data State
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [categories, setCategories] = useState<ChannelCategory[]>([]);
  const [messages, setMessages] = useState<DiscordChatMessage[]>([]);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [friends, setFriends] = useState<GuildMember[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Voice & Audio Stage State
  const [isVoiceConnected, setIsVoiceConnected] = useState<boolean>(false);
  const [activeVoiceRoomName, setActiveVoiceRoomName] = useState<string>('Live Ambient Jam');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);
  const [isPlayingStageAudio, setIsPlayingStageAudio] = useState<boolean>(false);
  const [showStageTheater, setShowStageTheater] = useState<boolean>(false);

  // Modals & Panels State
  const [showMembersRail, setShowMembersRail] = useState<boolean>(true);
  const [showChannelDrawerMobile, setShowChannelDrawerMobile] = useState<boolean>(false);
  const [serverDropdownOpen, setServerDropdownOpen] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(false);
  const [showDiscordUserSettings, setShowDiscordUserSettings] = useState<boolean>(false);
  const [showAddServerModal, setShowAddServerModal] = useState<boolean>(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState<string>('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice' | 'stage'>('text');
  const [selectedMemberCard, setSelectedMemberCard] = useState<GuildMember | null>(null);

  // Input & Filter States
  const [inputText, setInputText] = useState<string>('');
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dmEndRef = useRef<HTMLDivElement>(null);

  // Load Initial Discord Data
  useEffect(() => {
    async function loadDiscordData() {
      try {
        const [serverList, categoryList, memberList, chatList, friendsList] = await Promise.all([
          apiService.getDiscordServers(),
          apiService.getChannelCategories('pbm'),
          apiService.getGuildMembers('pbm'),
          apiService.getChannelMessages('c_lounge'),
          apiService.getDiscordFriends()
        ]);
        setServers(serverList);
        setCategories(categoryList);
        setMembers(memberList);
        setMessages(chatList);
        setFriends(friendsList);
      } catch (e) {
        console.error('Failed to load Discord data:', e);
      }
    }
    loadDiscordData();
  }, []);

  // Fetch messages when active server channel changes
  useEffect(() => {
    async function fetchChannelMessages() {
      if (activeTab === 'channels') {
        try {
          const list = await apiService.getChannelMessages(activeChannelId);
          setMessages(list);
        } catch (e) {
          console.error('Failed to fetch messages for channel', activeChannelId, e);
        }
      }
    }
    fetchChannelMessages();
  }, [activeChannelId, activeTab]);

  // Fetch DM messages when active DM user changes
  useEffect(() => {
    async function fetchDMs() {
      if (activeTab === 'messages' && activeDMUserId) {
        try {
          const list = await apiService.getDirectMessages(activeDMUserId);
          setDmHistory(list);
        } catch (e) {
          console.error('Failed to fetch DMs for user', activeDMUserId, e);
        }
      }
    }
    fetchDMs();
  }, [activeDMUserId, activeTab]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (activeTab === 'channels') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      dmEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, dmHistory, activeTab]);

  // Active channel metadata
  const currentChannel = categories
    .flatMap(c => c.channels)
    .find(c => c.id === activeChannelId) || {
      id: 'c_lounge',
      name: 'lounge',
      type: 'text' as const,
      topic: 'Discuss design patterns, generative workflows, and real-time audio production.'
    };

  // Active DM user metadata
  const activeDMUser = friends.find(f => f.id === activeDMUserId);

  // Send channel message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    try {
      const newMsg = await apiService.sendChannelMessage(activeChannelId, text);
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Send Direct Message
  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInputText.trim() || !activeDMUserId) return;

    const text = dmInputText.trim();
    setDmInputText('');
    try {
      const newMsg = await apiService.sendDirectMessage(activeDMUserId, text);
      setDmHistory(prev => [...prev, newMsg]);

      // Simulated auto-reply after 1.2s for authentic chat feel
      setTimeout(() => {
        const replyMsg: DiscordChatMessage = {
          id: `reply_${Date.now()}`,
          channelId: `dm_${activeDMUserId}`,
          author: {
            id: activeDMUser?.id || 'usr_kai_creative',
            username: activeDMUser?.username || 'kai_creative',
            displayName: activeDMUser?.displayName || 'Kai Creative',
            avatarUrl: activeDMUser?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
            role: 'PRO CREATOR',
            isVerified: true
          },
          content: `Got your message! Let's sync this up on the next live audio session. ⚡`,
          timestamp: 'Just now',
          reactions: [{ emoji: '🔥', count: 1, hasReacted: true }]
        };
        setDmHistory(prev => [...prev, replyMsg]);
      }, 1200);
    } catch (err) {
      console.error('Failed to send DM:', err);
    }
  };

  // Message Reaction toggle
  const handleReactionClick = async (messageId: string, emoji: string) => {
    try {
      const updated = await apiService.toggleMessageReaction(activeChannelId, messageId, emoji);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: updated } : m));
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const joinVoiceStage = (channel: ChannelItem) => {
    setActiveVoiceRoomName(channel.name);
    setIsVoiceConnected(true);
    setIsPlayingStageAudio(true);
  };

  const disconnectVoice = () => {
    setIsVoiceConnected(false);
    setIsPlayingStageAudio(false);
    setShowStageTheater(false);
  };

  // Create Channel Handler
  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const formattedName = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');
    const newChan: ChannelItem = {
      id: `c_${Date.now()}`,
      name: formattedName,
      type: newChannelType,
      topic: `Official channel for #${formattedName}`
    };

    setCategories(prev => prev.map((cat, idx) => {
      if (idx === 1) { // Add under text channels
        return { ...cat, channels: [...cat.channels, newChan] };
      }
      return cat;
    }));

    setActiveChannelId(newChan.id);
    setShowCreateChannelModal(false);
    setNewChannelName('');
  };

  const filteredMembers = members.filter(m => 
    m.displayName.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.username.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const filteredMessages = chatSearchQuery.trim()
    ? messages.filter(m => m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()) || m.author.displayName.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : messages;

  const filteredFriends = friends.filter(f => {
    const matchesSearch = f.displayName.toLowerCase().includes(dmSearchQuery.toLowerCase()) || f.username.toLowerCase().includes(dmSearchQuery.toLowerCase());
    if (friendsTab === 'online') return matchesSearch && f.status !== 'offline';
    if (friendsTab === 'all') return matchesSearch;
    if (friendsTab === 'pending') return false; // simulated empty
    if (friendsTab === 'blocked') return false;
    return matchesSearch;
  });

  // Render Status Dot Helper
  const renderStatusDot = (status: GuildMember['status']) => {
    if (status === 'online') {
      return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shrink-0" title="Online" />;
    }
    if (status === 'idle') {
      return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shrink-0" title="Idle" />;
    }
    if (status === 'dnd') {
      return <span className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shrink-0" title="Do Not Disturb" />;
    }
    return <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white shrink-0" title="Offline" />;
  };

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex overflow-hidden bg-[#F8FAFC] select-none text-slate-900 border-x border-slate-200">
      
      {/* ========================================================================= */}
      {/* 1. DISCORD GUILD / SERVER RAIL (Far Left, 72px width) */}
      {/* ========================================================================= */}
      <div className="w-[68px] sm:w-[72px] bg-[#E5EEFF] border-r border-slate-200 flex flex-col items-center py-3 shrink-0 justify-between z-20">
        
        {/* Top: Home / DMs Bubble */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="relative group flex items-center justify-center w-full">
            {/* Active Pill Indicator */}
            {activeTab === 'messages' && (
              <span className="absolute left-0 w-1 h-10 bg-cyan-600 rounded-r-full transition-all" />
            )}
            
            <button
              onClick={() => {
                setActiveTab('messages');
                setShowChannelDrawerMobile(false);
              }}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center relative shadow-sm ${
                activeTab === 'messages'
                  ? 'bg-cyan-500 text-slate-950 rounded-[16px] shadow-cyan-500/20'
                  : 'bg-white text-cyan-700 hover:bg-cyan-500 hover:text-slate-950'
              }`}
              title="Direct Messages & Friends"
            >
              <MessageSquare className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                3
              </span>
            </button>
          </div>

          {/* Separator */}
          <div className="w-8 h-[2px] bg-slate-300/80 rounded-full my-1" />

          {/* Server 1: Project Blue Mountain (Primary Emblem) */}
          <div className="relative group flex items-center justify-center w-full">
            {activeServerId === 'pbm' && activeTab === 'channels' && (
              <span className="absolute left-0 w-1 h-10 bg-cyan-600 rounded-r-full transition-all" />
            )}
            <button
              onClick={() => {
                setActiveServerId('pbm');
                setActiveTab('channels');
                setShowChannelDrawerMobile(false);
              }}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center font-extrabold text-sm relative shadow-sm ${
                activeServerId === 'pbm' && activeTab === 'channels'
                  ? 'bg-cyan-500 text-slate-950 rounded-[16px] ring-2 ring-cyan-400'
                  : 'bg-slate-900 text-cyan-400 hover:bg-slate-800'
              }`}
              title="Project Blue Mountain"
            >
              <Mountain className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* Server 2: Generative Cinema (GC) */}
          <div className="relative group flex items-center justify-center w-full">
            {activeServerId === 'gc' && activeTab === 'channels' && (
              <span className="absolute left-0 w-1 h-10 bg-cyan-600 rounded-r-full transition-all" />
            )}
            <button
              onClick={() => {
                setActiveServerId('gc');
                setActiveTab('channels');
              }}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center font-mono font-bold text-xs shadow-sm ${
                activeServerId === 'gc' && activeTab === 'channels'
                  ? 'bg-cyan-500 text-slate-950 rounded-[16px]'
                  : 'bg-white text-slate-700 hover:bg-cyan-100 hover:text-cyan-900'
              }`}
              title="Generative Cinema Lab"
            >
              GC
            </button>
          </div>

          {/* Server 3: Modular Audio Stages */}
          <div className="relative group flex items-center justify-center w-full">
            {activeServerId === 'audio' && activeTab === 'channels' && (
              <span className="absolute left-0 w-1 h-10 bg-cyan-600 rounded-r-full transition-all" />
            )}
            <button
              onClick={() => {
                setActiveServerId('audio');
                setActiveTab('channels');
              }}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center shadow-sm relative ${
                activeServerId === 'audio' && activeTab === 'channels'
                  ? 'bg-cyan-500 text-slate-950 rounded-[16px]'
                  : 'bg-white text-slate-700 hover:bg-cyan-100 hover:text-cyan-900'
              }`}
              title="Modular Audio Stages"
            >
              <Disc className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>

          {/* Server 4: WebGPU Guild */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              onClick={() => {
                setActiveServerId('gpu');
                setActiveTab('channels');
              }}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center shadow-sm ${
                activeServerId === 'gpu' && activeTab === 'channels'
                  ? 'bg-cyan-500 text-slate-950 rounded-[16px]'
                  : 'bg-white text-slate-700 hover:bg-cyan-100'
              }`}
              title="WebGPU Shader Guild"
            >
              <Gamepad2 className="w-5 h-5" />
            </button>
          </div>

          {/* Server 5: Code & Scripts */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              onClick={() => {
                setActiveServerId('code');
                setActiveTab('channels');
              }}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center shadow-sm ${
                activeServerId === 'code' && activeTab === 'channels'
                  ? 'bg-cyan-500 text-slate-950 rounded-[16px]'
                  : 'bg-white text-slate-700 hover:bg-cyan-100'
              }`}
              title="Code & Scripts"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>

          {/* Add Server Button */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              onClick={() => setShowAddServerModal(true)}
              className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-white text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
              title="Add a Server"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Explore Discoverable Public Servers */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              onClick={() => alert('Explore 24+ Public Creative Guilds & Stages')}
              className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-white text-slate-600 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center justify-center shadow-sm"
              title="Explore Public Servers"
            >
              <Compass className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bottom Guild Rail Telemetry: RTC Voice Status */}
        <div className="w-full flex flex-col items-center gap-1.5 pt-3">
          <div className="flex flex-col items-center text-[10px] font-mono font-bold text-cyan-800">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse mb-0.5" />
            <span>RTC</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CHANNELS OR DIRECT MESSAGES SIDEBAR (Middle Left, 240px width) */}
      {/* ========================================================================= */}
      <div className={`
        ${showChannelDrawerMobile ? 'fixed inset-y-0 left-[68px] sm:left-[72px] z-30 shadow-2xl flex' : 'hidden md:flex'}
        w-60 lg:w-64 bg-[#F1F5F9] border-r border-slate-200 flex-col shrink-0 justify-between select-none
      `}>
        
        {/* Top Header of Sidebar */}
        {activeTab === 'channels' ? (
          /* Server Dropdown Header */
          <div className="flex flex-col border-b border-slate-200 relative bg-white">
            <button
              onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
              className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                  BM
                </span>
                <span className="font-extrabold text-sm text-slate-900 truncate">
                  Project Blue Mountain
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 shrink-0">
                <ChevronDown className={`w-4 h-4 transition-transform ${serverDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Server Settings Dropdown Menu */}
            {serverDropdownOpen && (
              <div className="absolute top-14 left-2 right-2 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 text-xs space-y-1">
                <button 
                  onClick={() => { alert('Invite link copied: https://bluemountain.network/join-alpha'); setServerDropdownOpen(false); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-cyan-700 hover:bg-cyan-50 font-bold"
                >
                  <span>Invite People</span>
                  <UserPlus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setShowCreateChannelModal(true); setServerDropdownOpen(false); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <span>Create Channel</span>
                  <Plus className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={() => { setShowDiscordUserSettings(true); setServerDropdownOpen(false); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <span>Server Settings</span>
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button 
                  onClick={() => { alert('Server Notifications set to: Mentions Only'); setServerDropdownOpen(false); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <span>Notification Settings</span>
                  <Bell className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* DM Search Header */
          <div className="h-14 px-3.5 border-b border-slate-200 bg-white flex items-center">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dmSearchQuery}
                onChange={(e) => setDmSearchQuery(e.target.value)}
                placeholder="Find or start a conversation"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs border border-slate-200 rounded-lg outline-none text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Sidebar Middle List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-semibold custom-scrollbar">
          
          {activeTab === 'channels' ? (
            /* SERVER CHANNELS LIST */
            categories.map((cat) => {
              const isCollapsed = collapsedCategories[cat.id];

              return (
                <div key={cat.id} className="space-y-1">
                  
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategoryCollapse(cat.id)}
                    className="flex items-center justify-between px-1.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-slate-800 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? '-rotate-90 text-slate-400' : ''}`} />
                      <span>{cat.name}</span>
                    </div>
                    {cat.badge && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-100 text-cyan-800 font-bold">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Channel Items */}
                  {!isCollapsed && (
                    <div className="space-y-0.5">
                      {cat.channels.map((ch) => {
                        const isActive = activeChannelId === ch.id;

                        // STAGE / AUDIO CHANNEL
                        if (ch.type === 'stage' || ch.type === 'voice') {
                          return (
                            <div key={ch.id} className="space-y-1">
                              <button
                                onClick={() => {
                                  setActiveChannelId(ch.id);
                                  joinVoiceStage(ch);
                                  setShowChannelDrawerMobile(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all group ${
                                  isActive
                                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                                    : 'text-slate-700 hover:bg-white hover:text-slate-950'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Volume2 className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-600'}`} />
                                  <span className="truncate">{ch.name}</span>
                                </div>
                                {ch.badge && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold animate-pulse">
                                    {ch.badge}
                                  </span>
                                )}
                              </button>

                              {/* Active Stage Listeners Mini Avatars Row */}
                              {ch.activeListenersAvatars && (
                                <div className="pl-6 pr-2 py-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <div className="flex -space-x-1.5 overflow-hidden">
                                    {ch.activeListenersAvatars.map((url, i) => (
                                      <img
                                        key={i}
                                        src={url}
                                        alt="listener"
                                        className="w-4 h-4 rounded-full border border-white object-cover"
                                      />
                                    ))}
                                  </div>
                                  <span className="font-semibold text-slate-600">
                                    +{ch.activeListenersCount || 12} listening
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        // LOCKED PRO CHANNEL
                        if (ch.isLocked) {
                          return (
                            <button
                              key={ch.id}
                              onClick={() => alert(`Pro Tier channel: #${ch.name} requires Creator VIP badge.`)}
                              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 hover:bg-slate-200/50 transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Lock className="w-3.5 h-3.5" />
                                <span className="truncate">{ch.name}</span>
                              </div>
                              <span className="text-[9px] font-mono px-1 rounded bg-slate-200 text-slate-600 font-bold">
                                PRO
                              </span>
                            </button>
                          );
                        }

                        // STANDARD TEXT / ANNOUNCEMENT CHANNEL
                        return (
                          <button
                            key={ch.id}
                            onClick={() => {
                              setActiveChannelId(ch.id);
                              setShowChannelDrawerMobile(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${
                              isActive
                                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                                : 'text-slate-700 hover:bg-white hover:text-slate-950'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Hash className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                              <span className="truncate">{ch.name}</span>
                            </div>

                            {ch.unreadCount && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                                isActive ? 'bg-slate-900 text-white' : 'bg-cyan-100 text-cyan-800'
                              }`}>
                                {ch.unreadCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            /* DIRECT MESSAGES & FRIENDS NAVIGATION SIDEBAR */
            <div className="space-y-3">
              {/* Friends Main Tab Item */}
              <button
                onClick={() => setActiveDMUserId(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeDMUserId === null 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Friends</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900/10 font-bold">
                  {friends.length}
                </span>
              </button>

              {/* Nitro / Sparks Store Item */}
              <button
                onClick={() => alert('Sparks Boost Store: Unlock 1080p 60fps streaming & custom flairs')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-white transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Nitro Sparks</span>
              </button>

              {/* Shop / Badges Item */}
              <button
                onClick={() => alert('Official Discord Badge Showcase')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-white transition-colors"
              >
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Insignia Shop</span>
              </button>

              {/* Separator */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>DIRECT MESSAGES</span>
                  <button onClick={() => alert('Start DM Modal')} className="hover:text-slate-800">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* DM Friends list */}
                <div className="space-y-0.5">
                  {friends.map((friend) => {
                    const isDMActive = activeDMUserId === friend.id;

                    return (
                      <button
                        key={friend.id}
                        onClick={() => {
                          setActiveDMUserId(friend.id);
                          setShowChannelDrawerMobile(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all group ${
                          isDMActive
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                            : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={friend.avatarUrl}
                              alt={friend.displayName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5">
                              {renderStatusDot(friend.status)}
                            </span>
                          </div>

                          <div className="min-w-0 text-left">
                            <div className="text-xs font-bold truncate">
                              {friend.displayName}
                            </div>
                            <div className={`text-[10px] truncate ${isDMActive ? 'text-slate-900/80 font-mono' : 'text-slate-400'}`}>
                              {friend.activity || `@${friend.username}`}
                            </div>
                          </div>
                        </div>

                        {friend.badge && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900/10 font-bold shrink-0">
                            {friend.badge.split(' ')[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Section: Voice Connected Bar (If active) + Current User Audio Controls */}
        <div className="flex flex-col border-t border-slate-200 bg-white">
          
          {/* Active Voice Stage Connection status banner */}
          {isVoiceConnected && (
            <div className="p-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs">
              <div 
                onClick={() => setShowStageTheater(true)}
                className="flex items-center gap-2 min-w-0 cursor-pointer group"
                title="Click to open full Voice Stage Theater"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="font-extrabold text-emerald-950 text-[11px] truncate flex items-center gap-1 group-hover:text-cyan-700">
                    <span>Voice Connected</span>
                    <ExternalLink className="w-3 h-3 text-emerald-700" />
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono truncate">
                    {activeVoiceRoomName} / RTC 48kHz
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('Screen Share Simulator: Streaming 1080p 60fps')}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-emerald-100 rounded transition-colors"
                  title="Share Screen"
                >
                  <ScreenShare className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={disconnectVoice}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Disconnect from stage"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* User Voice/Mic/Audio bar (Bottom of channel sidebar) */}
          <div className="h-14 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                  AR
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-slate-900 truncate">
                  {currentUser.displayName}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  #0001
                </div>
              </div>
            </div>

            {/* Mute, Deafen, Settings Buttons */}
            <div className="flex items-center gap-0.5 text-slate-500">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                  isMuted ? 'text-red-500 bg-red-50' : ''
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                  isDeafened ? 'text-red-500 bg-red-50' : ''
                }`}
                title={isDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
              >
                {isDeafened ? <HeadphoneOff className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowDiscordUserSettings(true)}
                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Discord User Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CENTRAL VIEW: SERVER CHAT OR DIRECT MESSAGES / FRIENDS HUB */}
      {/* ========================================================================= */}
      {activeTab === 'channels' ? (
        /* ================= A. SERVER CHAT WINDOW ================= */
        <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0 relative">
          
          {/* Channel Top Header Bar */}
          <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setShowChannelDrawerMobile(!showChannelDrawerMobile)}
                className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Hash className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <Hash className="w-5 h-5 text-slate-500 stroke-[2.2]" />
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                  {currentChannel.name}
                </h2>
                {currentChannel.topic && (
                  <>
                    <span className="hidden lg:inline text-slate-300 text-sm">|</span>
                    <span className="hidden lg:inline text-xs text-slate-500 truncate max-w-md font-medium">
                      {currentChannel.topic}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Header Tool Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                  showPinnedMessages ? 'text-cyan-600 bg-cyan-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Pinned Messages"
              >
                <Pin className="w-4 h-4" />
              </button>

              <button
                onClick={() => alert('Channel notification settings: All Messages')}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
                title="Notification Settings"
              >
                <Bell className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowMembersRail(!showMembersRail)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showMembersRail ? 'text-cyan-600 bg-cyan-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Toggle Member List"
              >
                <Users className="w-4 h-4" />
              </button>

              {/* Search Channel Input */}
              <div className="relative hidden md:block">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  placeholder={`Search #${currentChannel.name}`}
                  className="pl-8 pr-3 py-1 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs border border-slate-200 focus:border-cyan-500 rounded-md outline-none w-36 lg:w-44 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Active Voice / Stage Floating Banner if listening */}
          {isVoiceConnected && (
            <div className="px-4 py-2 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-extrabold">{activeVoiceRoomName}</span>
                <span className="text-[10px] font-mono bg-cyan-900 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                  32-BIT STAGE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingStageAudio(!isPlayingStageAudio)}
                  className="px-2.5 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-md flex items-center gap-1"
                >
                  {isPlayingStageAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingStageAudio ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => setShowStageTheater(true)}
                  className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-md"
                >
                  Open Stage Theater
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            
            {/* Channel Welcome Banner Header */}
            <div className="space-y-2 pt-4 pb-2 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-sm">
                <Hash className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome to #{currentChannel.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {currentChannel.topic || `This is the start of the #${currentChannel.name} channel. Discuss design patterns, generative workflows, and real-time audio production.`}
              </p>
            </div>

            {/* Date Separator Pill */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative px-3 py-1 bg-white text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full shadow-sm">
                TODAY • NOVEMBER 14
              </span>
            </div>

            {/* Discord Messages */}
            <div className="space-y-5">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="group relative flex items-start gap-3 sm:gap-4 p-2 sm:p-2.5 -mx-2 sm:-mx-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={msg.author.avatarUrl}
                    alt={msg.author.displayName}
                    onClick={() => {
                      const member = members.find(m => m.username === msg.author.username);
                      if (member) setSelectedMemberCard(member);
                    }}
                    className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-slate-200 group-hover:ring-cyan-500 transition-all cursor-pointer"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        onClick={() => {
                          const member = members.find(m => m.username === msg.author.username);
                          if (member) setSelectedMemberCard(member);
                        }}
                        className="font-extrabold text-sm text-slate-900 hover:text-cyan-600 cursor-pointer"
                      >
                        {msg.author.displayName}
                      </span>

                      {msg.author.role && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          msg.author.role === 'ADMIN'
                            ? 'bg-slate-900 text-cyan-400'
                            : 'bg-cyan-500 text-slate-950'
                        }`}>
                          {msg.author.role}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-medium">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Discord Rich Embed */}
                    {msg.attachment && (
                      <div className="mt-2.5 max-w-xl rounded-xl bg-slate-50 border border-slate-200 border-l-4 border-l-cyan-500 p-4 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                            <Radio className="w-4 h-4 text-cyan-600" />
                            <span>{msg.attachment.title}</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded uppercase">
                            {msg.attachment.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {msg.attachment.desc}
                        </p>

                        {msg.attachment.stats && (
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                            <span className="truncate">{msg.attachment.stats}</span>
                            <button
                              onClick={() => {
                                const ch = categories.flatMap(c => c.channels).find(x => x.type === 'stage');
                                if (ch) joinVoiceStage(ch);
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold shrink-0 ml-2"
                            >
                              Listen Live Stage
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Discord Reaction Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleReactionClick(msg.id, r.emoji)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                            r.hasReacted
                              ? 'bg-cyan-100 text-cyan-900 border border-cyan-300 ring-1 ring-cyan-400'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}

                      <button
                        onClick={() => handleReactionClick(msg.id, '🔥')}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Add Reaction"
                      >
                        <SmilePlus className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute right-3 top-2 hidden group-hover:flex items-center bg-white border border-slate-200 rounded-lg shadow-sm p-0.5 text-slate-500">
                    <button
                      onClick={() => handleReactionClick(msg.id, '⚡')}
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                      title="React ⚡"
                    >
                      ⚡
                    </button>
                    <button
                      onClick={() => handleReactionClick(msg.id, '🏔️')}
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                      title="React 🏔️"
                    >
                      🏔️
                    </button>
                    <button
                      onClick={() => setInputText(`Replying to @${msg.author.username}: `)}
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                      title="Reply"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

          </div>

          {/* Bottom Message Input Composer */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500 border border-slate-200 rounded-xl px-3 py-2 transition-all"
            >
              <button
                type="button"
                onClick={() => alert('Simulate MinIO media/audio attachment upload')}
                className="w-7 h-7 rounded-full bg-slate-300 hover:bg-slate-400 text-slate-700 flex items-center justify-center shrink-0 transition-colors"
                title="Add File"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${currentChannel.name}...`}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() => alert('Tip Sparks in Chat: Send 50 Sparks to channel')}
                className="p-1.5 text-slate-400 hover:text-cyan-600 transition-colors"
                title="Gift Sparks"
              >
                <Gift className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => alert('GIF Selector opened')}
                className="px-1.5 py-0.5 rounded text-[11px] font-mono font-extrabold text-slate-500 hover:text-slate-900 transition-colors"
                title="Select GIF"
              >
                GIF
              </button>

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-transform active:scale-95 shadow-sm"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 right-6 bg-white border border-slate-200 rounded-xl p-3 shadow-2xl flex items-center gap-2 text-lg z-30">
                {['🔥', '⚡', '🏔️', '🚀', '✨', '💎', '🎧', '👾'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : activeDMUserId === null ? (
        /* ================= B. DISCORD FRIENDS HUB (Default View when clicking DMs) ================= */
        <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
          
          {/* Friends Hub Top Header */}
          <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200 text-slate-700 font-extrabold text-sm">
                <Users className="w-5 h-5" />
                <span>Friends</span>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setFriendsTab('online')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    friendsTab === 'online' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Online ({friends.filter(f => f.status !== 'offline').length})
                </button>
                <button
                  onClick={() => setFriendsTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    friendsTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All ({friends.length})
                </button>
                <button
                  onClick={() => setFriendsTab('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    friendsTab === 'pending' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Pending (2)
                </button>
                <button
                  onClick={() => setFriendsTab('blocked')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    friendsTab === 'blocked' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Blocked
                </button>
                <button
                  onClick={() => alert('Add Friend: Enter a Username#0000')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold ml-2 shadow-sm"
                >
                  Add Friend
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert('New Group DM')}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="New Group DM"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={() => alert('Inbox: Mentions & Unreads')}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="Inbox"
              >
                <Inbox className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Friends Hub Body (List on left, Active Now on right) */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Friends List Column */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {friendsTab.toUpperCase()} FRIENDS — {filteredFriends.length}
              </div>

              <div className="space-y-1">
                {filteredFriends.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setActiveDMUserId(f.id)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={f.avatarUrl}
                          alt={f.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5">
                          {renderStatusDot(f.status)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900 group-hover:text-cyan-600 truncate">
                          <span>{f.displayName}</span>
                          <span className="text-xs font-normal text-slate-400">#{f.username}</span>
                          {f.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-bold ml-1">
                              {f.badge}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 truncate font-medium">
                          {f.activity || (f.status === 'offline' ? 'Offline' : 'Online')}
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDMUserId(f.id);
                        }}
                        className="p-2 rounded-full bg-slate-100 hover:bg-cyan-500 hover:text-slate-950 text-slate-600 transition-colors"
                        title="Direct Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Calling ${f.displayName}...`);
                        }}
                        className="p-2 rounded-full bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-600 transition-colors"
                        title="Voice Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMemberCard(f);
                        }}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Now Right Column */}
            <div className="hidden lg:flex flex-col w-80 border-l border-slate-200 bg-[#F8FAFC] p-4 space-y-4 shrink-0 overflow-y-auto custom-scrollbar">
              <h3 className="font-extrabold text-base text-slate-900">
                Active Now
              </h3>

              {/* Active Now Card 1 */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"
                    alt="Kai"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Kai Creative</div>
                    <div className="text-[10px] text-slate-500 font-mono">Playing Ableton Live 12</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-white space-y-1">
                  <div className="text-[11px] font-bold text-cyan-400">Ambient Synthesis #44</div>
                  <div className="text-[10px] text-slate-400 font-mono">Stage: Live Ambient Jam • 2h elapsed</div>
                </div>
              </div>

              {/* Active Now Card 2 */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop"
                    alt="Elena"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Elena V.</div>
                    <div className="text-[10px] text-slate-500 font-mono">Streaming WebGPU Shaders</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                  Raymarched volumetric fog demo • 120 FPS on WebGPU
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ================= C. 1-ON-1 DIRECT MESSAGE CHAT WINDOW ================= */
        <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
          
          {/* DM Header */}
          <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activeDMUser?.avatarUrl}
                  alt={activeDMUser?.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5">
                  {activeDMUser && renderStatusDot(activeDMUser.status)}
                </span>
              </div>

              <div className="min-w-0">
                <div className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                  {activeDMUser?.displayName}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  @{activeDMUser?.username} • {activeDMUser?.activity || 'Active Now'}
                </div>
              </div>
            </div>

            {/* Header Tools */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => alert(`Starting Voice Call with ${activeDMUser?.displayName}...`)}
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg"
                title="Start Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => alert(`Starting Video Call with ${activeDMUser?.displayName}...`)}
                className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-slate-100 rounded-lg"
                title="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="Pinned Messages"
              >
                <Pin className="w-4 h-4" />
              </button>

              <button
                onClick={() => activeDMUser && setSelectedMemberCard(activeDMUser)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="View Profile"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DM Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
            {/* User Intro Banner */}
            <div className="space-y-2 pt-4 pb-2 border-b border-slate-100">
              <img
                src={activeDMUser?.avatarUrl}
                alt={activeDMUser?.displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-cyan-500/20"
              />
              <h2 className="text-2xl font-extrabold text-slate-900">
                {activeDMUser?.displayName}
              </h2>
              <p className="text-xs text-slate-500">
                This is the beginning of your direct message history with @{activeDMUser?.username}.
              </p>
            </div>

            {/* DM Messages */}
            {dmHistory.map((msg) => (
              <div
                key={msg.id}
                className="group relative flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <img
                  src={msg.author.avatarUrl}
                  alt={msg.author.displayName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {msg.author.displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {msg.attachment && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 border-l-4 border-l-cyan-500 text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-cyan-600" />
                        <span>{msg.attachment.title}</span>
                      </div>
                      <p className="text-slate-600">{msg.attachment.desc}</p>
                      {msg.attachment.stats && (
                        <div className="text-[10px] font-mono text-slate-400 pt-1">
                          {msg.attachment.stats}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 pt-1">
                      {msg.reactions.map((r, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-xs font-mono font-bold">
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={dmEndRef} />
          </div>

          {/* DM Input Composer */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={handleSendDM}
              className="flex items-center gap-2 bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500 border border-slate-200 rounded-xl px-3 py-2 transition-all"
            >
              <button
                type="button"
                onClick={() => alert('Simulate sending media attachment')}
                className="w-7 h-7 rounded-full bg-slate-300 hover:bg-slate-400 text-slate-700 flex items-center justify-center shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <input
                type="text"
                value={dmInputText}
                onChange={(e) => setDmInputText(e.target.value)}
                placeholder={`Message @${activeDMUser?.displayName}...`}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
              />

              <button
                type="submit"
                disabled={!dmInputText.trim()}
                className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RIGHT MEMBER LIST RAIL (240px width, only on Server Channel mode) */}
      {/* ========================================================================= */}
      {showMembersRail && activeTab === 'channels' && (
        <div className="hidden xl:flex flex-col w-60 lg:w-64 bg-[#F8FAFC] border-l border-slate-200 shrink-0 justify-between select-none">
          
          {/* Members Search Input Header */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Search members"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs border border-slate-200 focus:border-cyan-500 rounded-lg outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Members Groups Scroll Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
            
            {/* Group 1: ADMIN / CORE TEAM */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
                ADMIN / CORE TEAM • 2
              </div>
              {filteredMembers
                .filter(m => m.roleGroup === 'ADMIN / CORE TEAM')
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMemberCard(m)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white transition-colors cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <img src={m.avatarUrl} alt={m.displayName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5">
                        {renderStatusDot(m.status)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 font-extrabold text-xs text-slate-900 group-hover:text-cyan-600 truncate">
                        <span>{m.displayName}</span>
                        {m.badge && <span className="text-[9px] px-1 rounded bg-slate-200">{m.badge.split(' ')[0]}</span>}
                      </div>
                      {m.activity && (
                        <div className="text-[10px] text-slate-500 truncate font-medium">
                          {m.activity}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Group 2: PRO CREATORS */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
                PRO CREATORS • 5
              </div>
              {filteredMembers
                .filter(m => m.roleGroup === 'PRO CREATORS')
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMemberCard(m)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white transition-colors cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <img src={m.avatarUrl} alt={m.displayName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5">
                        {renderStatusDot(m.status)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-800 group-hover:text-cyan-600 truncate">
                        {m.displayName}
                      </div>
                      {m.activity && (
                        <div className="text-[10px] text-slate-500 truncate font-medium">
                          {m.activity}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Group 3: ONLINE */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
                ONLINE • 18
              </div>
              {filteredMembers
                .filter(m => m.roleGroup === 'ONLINE')
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMemberCard(m)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white transition-colors cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img src={m.avatarUrl} alt={m.displayName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5">
                        {renderStatusDot(m.status)}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-700 truncate">
                      {m.displayName}
                    </div>
                  </div>
                ))}
            </div>

            {/* Group 4: OFFLINE */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
                OFFLINE • 142
              </div>
              {filteredMembers
                .filter(m => m.roleGroup === 'OFFLINE')
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMemberCard(m)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img src={m.avatarUrl} alt={m.displayName} className="w-8 h-8 rounded-full object-cover grayscale" />
                      <span className="absolute -bottom-0.5 -right-0.5">
                        {renderStatusDot('offline')}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-600 truncate">
                      {m.displayName}
                    </div>
                  </div>
                ))}
            </div>

          </div>

          {/* Bottom Dock: NOW BROADCASTING */}
          <div className="p-3 bg-slate-900 text-white rounded-xl m-2 space-y-1.5 shadow-md">
            <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider flex items-center justify-between">
              <span>NOW BROADCASTING</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="font-extrabold text-xs text-white">Ambient Synthesis #44</div>
            <div className="text-[10px] text-slate-400 font-mono">Stage: Live Ambient Jam</div>

            <div className="flex items-center gap-1 pt-1">
              {[4, 10, 16, 8, 14, 20, 12, 6, 18, 10].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 bg-cyan-400 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: STAGE THEATER MODE (Discord Expanded Voice/Video Room) */}
      {/* ========================================================================= */}
      {showStageTheater && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div>
                <h2 className="text-lg font-extrabold">{activeVoiceRoomName}</h2>
                <div className="text-xs text-cyan-400 font-mono">Stage Active • 32-Bit WebRTC Float DSP • 18 Listeners</div>
              </div>
            </div>
            <button 
              onClick={() => setShowStageTheater(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stage Speakers Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 items-center justify-center max-w-5xl mx-auto w-full">
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500 shadow-2xl flex flex-col items-center text-center space-y-3 relative">
              <img src={currentUser.avatarUrl} alt="Speaker" className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500 animate-pulse" />
              <div>
                <div className="font-extrabold text-base text-white">{currentUser.displayName}</div>
                <div className="text-xs text-emerald-400 font-mono">Speaking • 48.0 kHz</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-3">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" alt="Speaker" className="w-24 h-24 rounded-full object-cover" />
              <div>
                <div className="font-extrabold text-base text-white">Kai Creative</div>
                <div className="text-xs text-slate-400 font-mono">Stage Host • Ableton Live</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Speaker" className="w-24 h-24 rounded-full object-cover" />
              <div>
                <div className="font-extrabold text-base text-white">Arc Design</div>
                <div className="text-xs text-slate-400 font-mono">Synthesizer Lead</div>
              </div>
            </div>
          </div>

          {/* Bottom Stage Control Bar */}
          <div className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl max-w-xl mx-auto w-full">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-3 rounded-full ${isDeafened ? 'bg-red-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
              title={isDeafened ? 'Undeafen' : 'Deafen'}
            >
              {isDeafened ? <HeadphoneOff className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
            </button>

            <button
              onClick={() => alert('Screen Share toggled')}
              className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700"
              title="Share Screen"
            >
              <ScreenShare className="w-5 h-5" />
            </button>

            <button
              onClick={disconnectVoice}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Leave Stage</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: MEMBER PROFILE CARD POPOVER */}
      {/* ========================================================================= */}
      {selectedMemberCard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl space-y-4">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-r from-cyan-600 to-blue-700 relative">
              <button 
                onClick={() => setSelectedMemberCard(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-black/40 hover:bg-black/70 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar & Header */}
            <div className="px-5 -mt-12 space-y-3">
              <div className="relative inline-block">
                <img
                  src={selectedMemberCard.avatarUrl}
                  alt={selectedMemberCard.displayName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-900"
                />
                <span className="absolute bottom-1 right-1">
                  {renderStatusDot(selectedMemberCard.status)}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-1.5">
                  <span>{selectedMemberCard.displayName}</span>
                  {selectedMemberCard.isVerified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                </h3>
                <div className="text-xs font-mono text-slate-400">@{selectedMemberCard.username}</div>
              </div>

              {selectedMemberCard.activity && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">ACTIVITY</div>
                  <div className="font-semibold text-white">{selectedMemberCard.activity}</div>
                </div>
              )}

              {/* Roles */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">ROLES</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                    {selectedMemberCard.roleGroup}
                  </span>
                  {selectedMemberCard.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                      {selectedMemberCard.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 pb-5">
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    setActiveDMUserId(selectedMemberCard.id);
                    setSelectedMemberCard(null);
                  }}
                  className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Send Message
                </button>
                <button
                  onClick={() => alert(`Calling ${selectedMemberCard.displayName}...`)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: DISCORD USER SETTINGS MODAL */}
      {/* ========================================================================= */}
      {showDiscordUserSettings && (
        <div className="fixed inset-0 z-50 bg-[#1E1F22]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 text-slate-200">
          <div className="bg-[#2B2D31] border border-slate-700 rounded-3xl max-w-4xl w-full h-[620px] flex overflow-hidden shadow-2xl">
            
            {/* Settings Sidebar */}
            <div className="w-56 bg-[#1E1F22] p-4 space-y-4 border-r border-slate-800 shrink-0 text-xs font-bold">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">
                USER SETTINGS
              </div>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800 text-white">
                My Account
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
                Profiles
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
                Privacy & Safety
              </button>

              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 pt-3">
                APP SETTINGS
              </div>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
                Appearance
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
                Voice & Video (RTC 48kHz)
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
                Notifications
              </button>
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 relative custom-scrollbar">
              <button
                onClick={() => setShowDiscordUserSettings(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="ESC to Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h2 className="text-xl font-extrabold text-white">My Account</h2>
                <p className="text-xs text-slate-400">Configure your identity, custom tags, and high-fidelity audio devices.</p>
              </div>

              {/* Profile Card Preview */}
              <div className="bg-[#1E1F22] rounded-2xl overflow-hidden border border-slate-700">
                <div className="h-20 bg-cyan-600" />
                <div className="p-4 flex items-center justify-between -mt-8">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-4 ring-[#1E1F22]" />
                    <div className="mt-6">
                      <div className="font-extrabold text-white text-base">{currentUser.displayName}</div>
                      <div className="text-xs font-mono text-slate-400">@{currentUser.handle}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Edit User Profile Modal')}
                    className="mt-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Edit User Profile
                  </button>
                </div>
              </div>

              {/* Voice & Video settings snippet */}
              <div className="space-y-3 bg-[#1E1F22] p-4 rounded-2xl border border-slate-700 text-xs">
                <h4 className="font-extrabold text-white text-sm">Voice & Audio Engine Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">INPUT DEVICE</label>
                    <select className="w-full bg-slate-800 p-2 rounded-xl text-white outline-none border border-slate-700">
                      <option>Default - MacBook Pro Microphone (48kHz)</option>
                      <option>USB Audio Interface (Scarlett 2i2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">OUTPUT DEVICE</label>
                    <select className="w-full bg-slate-800 p-2 rounded-xl text-white outline-none border border-slate-700">
                      <option>Default - Studio Monitors (32-Bit Float)</option>
                      <option>Headphones (External DAC)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: CREATE CHANNEL MODAL */}
      {/* ========================================================================= */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Create Channel</h3>
              <button onClick={() => setShowCreateChannelModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannelSubmit} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-2">
                <label className="text-slate-700 font-bold">CHANNEL TYPE</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewChannelType('text')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                      newChannelType === 'text' ? 'border-cyan-500 bg-cyan-50 text-cyan-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Hash className="w-5 h-5 text-cyan-600" />
                    <span>Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewChannelType('voice')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                      newChannelType === 'voice' ? 'border-cyan-500 bg-cyan-50 text-cyan-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Volume2 className="w-5 h-5 text-cyan-600" />
                    <span>Voice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewChannelType('stage')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                      newChannelType === 'stage' ? 'border-cyan-500 bg-cyan-50 text-cyan-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Radio className="w-5 h-5 text-cyan-600" />
                    <span>Stage</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">CHANNEL NAME</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">#</span>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="new-channel"
                    className="w-full pl-7 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-sm"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: ADD SERVER MODAL */}
      {/* ========================================================================= */}
      {showAddServerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <h3 className="font-extrabold text-xl text-slate-900">Create Your Server</h3>
            <p className="text-xs text-slate-500">
              Your server is where you and your friends hang out. Make yours and start talking.
            </p>

            <div className="space-y-2 text-left pt-2">
              <button
                onClick={() => {
                  alert('Created custom community server!');
                  setShowAddServerModal(false);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 flex items-center justify-between text-xs font-bold transition-colors"
              >
                <span>Create My Own Server</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  alert('Joined via Invite Link');
                  setShowAddServerModal(false);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 flex items-center justify-between text-xs font-bold transition-colors"
              >
                <span>Join a Server (Enter Invite Code)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <button
              onClick={() => setShowAddServerModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Back
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
