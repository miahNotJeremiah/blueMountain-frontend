import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Check, 
  Search, 
  Sliders, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  Cpu, 
  FolderTree, 
  Network, 
  Zap, 
  Flame, 
  X, 
  Volume2, 
  Palette, 
  Mountain, 
  Video, 
  Activity, 
  ArrowUpRight, 
  ShieldCheck, 
  Radio, 
  Info,
  SlidersHorizontal,
  Bookmark,
  Share2,
  MapPin
} from 'lucide-react';
import { InterestTreeNode, AlgorithmSettings, NeuralNode, User } from '../types';
import * as apiService from '../services/apiService';

export const QUICK_LOCATIONS = [
  'San Francisco, CA',
  'Nordic Valley • Summit Phase IV',
  'Zurich Analog Soundcard Lab',
  'Tokyo Akihabara Creative Hub',
  'Vancouver Virtual LED Volume',
  'Berlin Modular Synth Studio',
  'Reykjavik Ambient Lab',
  'Global / Decentralized'
];

interface ExploreViewProps {
  currentUser?: User;
  nodes?: NeuralNode[];
  onSelectClusterTag: (tag: string) => void;
  isAlgorithmEnabled?: boolean;
  onToggleAlgorithm?: () => void;
}

// Domain colors and icons for the user's major interest clusters
const DOMAIN_THEMES: Record<string, {
  label: string;
  color: string;
  glow: string;
  badgeBg: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  visual: {
    label: 'Visual Arts & Shaders',
    color: '#00F2FE',
    glow: 'rgba(0, 242, 254, 0.4)',
    badgeBg: 'bg-cyan-950/70 text-[#00F2FE] border-cyan-500/40',
    borderColor: 'border-[#00F2FE]',
    icon: Palette
  },
  audio: {
    label: 'Sound Synthesis & WebAudio',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.4)',
    badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500',
    icon: Volume2
  },
  cinema: {
    label: 'Virtual Production & Cinema',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500',
    icon: Video
  },
  nature: {
    label: 'Alpine Optics & Topography',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500',
    icon: Mountain
  },
  frontier: {
    label: 'Frontier Engineering & P2P',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    badgeBg: 'bg-pink-950/70 text-pink-300 border-pink-500/40',
    borderColor: 'border-pink-500',
    icon: Cpu
  }
};

export const ExploreView: React.FC<ExploreViewProps> = ({ 
  currentUser,
  onSelectClusterTag,
  isAlgorithmEnabled: externalAlgorithmEnabled,
  onToggleAlgorithm: externalToggleAlgorithm
}) => {
  // Algorithm State
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(apiService.INITIAL_ALGORITHM_SETTINGS);
  const [isAlgorithmToggling, setIsAlgorithmToggling] = useState(false);
  const [showAlgorithmDrawer, setShowAlgorithmDrawer] = useState(false);
  const [isRecomputing, setIsRecomputing] = useState(false);

  // Interest Tree State
  const [treeData, setTreeData] = useState<InterestTreeNode>(apiService.INITIAL_INTEREST_TREE);
  const [selectedNode, setSelectedNode] = useState<InterestTreeNode | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'constellation' | 'tree' | 'dna'>('constellation');
  
  // Canvas View Controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Node Expansion Map for Tree View
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root_alex': true,
    'branch_visual': true,
    'sub_shaders': true,
    'sub_tactile_ui': true,
    'branch_audio': true,
    'sub_modular': true,
    'sub_dsp': true,
    'branch_cinema': true,
    'sub_gen_cinema': true,
    'branch_sports': true,
    'branch_frontier': true
  });

  // Modal State for Adding Custom Interest
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addParentId, setAddParentId] = useState<string>('branch_visual');
  const [newInterestLabel, setNewInterestLabel] = useState('');
  const [newInterestCategory, setNewInterestCategory] = useState<'roots' | 'discovered' | 'active' | 'undiscovered'>('active');
  const [newInterestDesc, setNewInterestDesc] = useState('');
  const [newInterestLocation, setNewInterestLocation] = useState('');

  // Location Management State
  const [userLocation, setUserLocation] = useState('San Francisco, CA');
  const [isEditingUserLocation, setIsEditingUserLocation] = useState(false);
  const [tempUserLocation, setTempUserLocation] = useState('San Francisco, CA');
  const [isEditingNodeLocation, setIsEditingNodeLocation] = useState(false);
  const [nodeLocationInput, setNodeLocationInput] = useState('');

  // Fallback user if not passed from props
  const user = currentUser || {
    id: 'usr_alex_rivera',
    username: 'alex_rivera',
    handle: 'rivera_alpha',
    displayName: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop',
    role: 'VIP CONTRIBUTOR',
    sparksBalance: 1450,
    isVerified: true
  };

  // Sync external algorithm flag if provided
  useEffect(() => {
    if (externalAlgorithmEnabled !== undefined && externalAlgorithmEnabled !== algorithmSettings.enabled) {
      setAlgorithmSettings(prev => ({ ...prev, enabled: externalAlgorithmEnabled }));
    }
  }, [externalAlgorithmEnabled]);

  // Load Tree & Algorithm from API Service
  useEffect(() => {
    async function loadData() {
      try {
        const [algo, tree] = await Promise.all([
          apiService.getAlgorithmSettings(),
          apiService.getInterestTree()
        ]);
        setAlgorithmSettings(algo);
        setTreeData(tree);
        // Default select a high-affinity leaf
        const defaultSelected = tree.children?.[0]?.children?.[0]?.children?.[0] || tree;
        setSelectedNode(defaultSelected);
      } catch (err) {
        console.error('Failed to load explore tree data:', err);
      }
    }
    loadData();
  }, []);

  // Algorithm Toggle Handler
  const handleToggleAlgorithm = async () => {
    if (externalToggleAlgorithm) {
      externalToggleAlgorithm();
      return;
    }
    setIsAlgorithmToggling(true);
    try {
      const nextState = !algorithmSettings.enabled;
      const updated = await apiService.setAlgorithmEnabled(nextState);
      setAlgorithmSettings(updated);
    } catch (e) {
      console.error('Failed to toggle algorithm', e);
    } finally {
      setIsAlgorithmToggling(false);
    }
  };

  // Algorithm Parameters Update
  const handleUpdateAlgoParam = async (param: keyof AlgorithmSettings, value: any) => {
    const updated = await apiService.updateAlgorithmSettings({ [param]: value });
    setAlgorithmSettings(updated);
  };

  // Recompute Synapses Simulation
  const handleRecomputeSynapses = async () => {
    setIsRecomputing(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const tree = await apiService.getInterestTree();
      setTreeData(tree);
    } finally {
      setIsRecomputing(false);
    }
  };

  // Node Expansion Toggle
  const toggleNodeExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allIds: Record<string, boolean> = {};
    function traverse(node: InterestTreeNode) {
      allIds[node.id] = true;
      node.children?.forEach(traverse);
    }
    traverse(treeData);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes({ 'root_alex': true });
  };

  // Toggle interest node active in recommendations
  const handleToggleNodeEnabled = async (nodeId: string, enabled: boolean) => {
    const updated = await apiService.toggleInterestTreeNode(nodeId, enabled);
    setTreeData(updated);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, isEnabled: enabled } : null);
    }
  };

  // Update interest affinity score
  const handleUpdateWeight = async (nodeId: string, weight: number) => {
    const updated = await apiService.updateInterestNodeWeight(nodeId, weight);
    setTreeData(updated);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, affinityScore: weight } : null);
    }
  };

  // Add custom interest node with optional location
  const handleAddInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestLabel.trim()) return;
    try {
      const updated = await apiService.addInterestNode(
        addParentId,
        newInterestLabel.trim(),
        newInterestCategory,
        newInterestDesc.trim() || `User interest: ${newInterestLabel}`,
        newInterestLocation.trim() || undefined
      );
      setTreeData(updated);
      setExpandedNodes(prev => ({ ...prev, [addParentId]: true }));
      setIsAddModalOpen(false);
      setNewInterestLabel('');
      setNewInterestDesc('');
      setNewInterestLocation('');
    } catch (err) {
      console.error('Failed to add interest node:', err);
    }
  };

  // Update location anchor on selected interest node
  const handleSaveNodeLocation = async () => {
    if (!selectedNode) return;
    try {
      const updated = await apiService.updateInterestNodeLocation(selectedNode.id, nodeLocationInput);
      setTreeData(updated);
      setSelectedNode(prev => prev ? { ...prev, location: nodeLocationInput.trim() || undefined } : null);
      setIsEditingNodeLocation(false);
    } catch (err) {
      console.error('Failed to update node location:', err);
    }
  };

  // Update primary user location anchor
  const handleSaveUserLocation = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tempUserLocation.trim()) return;
    const finalLoc = tempUserLocation.trim();
    setUserLocation(finalLoc);
    setIsEditingUserLocation(false);
    try {
      await apiService.updateUserProfile({ location: finalLoc });
    } catch (err) {
      console.error('Failed to update user profile location:', err);
    }
  };

  // Prune interest node
  const handlePruneNode = async (nodeId: string) => {
    if (nodeId === 'root_alex') return;
    try {
      const updated = await apiService.pruneInterestNode(nodeId);
      setTreeData(updated);
      if (selectedNode?.id === nodeId) {
        setSelectedNode(treeData);
      }
    } catch (err) {
      console.error('Failed to prune node:', err);
    }
  };

  // Flattened nodes list for metrics and search
  const allNodesList = useMemo(() => {
    const list: InterestTreeNode[] = [];
    function collect(node: InterestTreeNode) {
      list.push(node);
      node.children?.forEach(collect);
    }
    collect(treeData);
    return list;
  }, [treeData]);

  // Filtered nodes by search or category
  const filteredNodesList = useMemo(() => {
    return allNodesList.filter(n => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLabel = n.label.toLowerCase().includes(q);
        const matchesDesc = n.description?.toLowerCase().includes(q);
        const matchesTag = n.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesLabel && !matchesDesc && !matchesTag) return false;
      }
      if (activeCategoryFilter !== 'all') {
        if (activeCategoryFilter === 'roots' && n.category !== 'roots' && n.category !== 'root') return false;
        if (activeCategoryFilter === 'algorithmic' && !n.isAlgorithmic) return false;
        if (activeCategoryFilter === 'active' && n.category !== 'active') return false;
      }
      return true;
    });
  }, [allNodesList, searchQuery, activeCategoryFilter]);

  // Overall User Affinity Average
  const averageAffinity = useMemo(() => {
    const scored = allNodesList.filter(n => n.affinityScore && n.affinityScore > 0);
    if (!scored.length) return 92;
    const sum = scored.reduce((acc, curr) => acc + (curr.affinityScore || 0), 0);
    return Math.round(sum / scored.length);
  }, [allNodesList]);

  // Algorithmic Inferences count
  const algorithmicCount = useMemo(() => {
    return allNodesList.filter(n => n.isAlgorithmic).length;
  }, [allNodesList]);

  // Root / Pinned Passions count
  const pinnedCount = useMemo(() => {
    return allNodesList.filter(n => !n.isAlgorithmic && n.id !== 'root_alex').length;
  }, [allNodesList]);

  // =========================================================================
  // CONSTELLATION GRAPH COORDINATES (Radial Orbital Showcase for Alex's Mindspace)
  // =========================================================================
  const constellationData = useMemo(() => {
    const centerX = 500;
    const centerY = 400;

    // Center Root (Alex Rivera)
    const centerNode = {
      id: treeData.id,
      label: user.displayName,
      handle: `@${user.handle || user.username}`,
      role: user.role,
      avatarUrl: user.avatarUrl,
      x: centerX,
      y: centerY,
      radius: 46,
      isRoot: true,
      originalNode: treeData,
      theme: DOMAIN_THEMES.visual
    };

    // Major Domain Branches (Orbit 1, Radius 195px)
    const branches = treeData.children || [];
    const orbit1Radius = 195;
    const domainNodes: any[] = [];
    const leafNodes: any[] = [];
    const connectionLines: any[] = [];

    branches.forEach((branch, i) => {
      // Angular spacing around the circle
      const angle = (i / branches.length) * (2 * Math.PI) - Math.PI / 2;
      const bx = centerX + orbit1Radius * Math.cos(angle);
      const by = centerY + orbit1Radius * Math.sin(angle);

      // Determine theme based on branch id
      let theme = DOMAIN_THEMES.visual;
      if (branch.id.includes('audio')) theme = DOMAIN_THEMES.audio;
      else if (branch.id.includes('cinema')) theme = DOMAIN_THEMES.cinema;
      else if (branch.id.includes('nature') || branch.id.includes('sports')) theme = DOMAIN_THEMES.nature;
      else if (branch.id.includes('frontier')) theme = DOMAIN_THEMES.frontier;

      const dNode = {
        id: branch.id,
        label: branch.label,
        affinity: branch.affinityScore || 90,
        count: branch.count || 24,
        x: bx,
        y: by,
        radius: 34,
        theme,
        originalNode: branch,
        isBranch: true
      };
      domainNodes.push(dNode);

      // Line from Alex to Domain Branch
      connectionLines.push({
        sourceX: centerX,
        sourceY: centerY,
        targetX: bx,
        targetY: by,
        color: theme.color,
        strokeWidth: 2,
        isPulse: true,
        sourceNode: treeData,
        targetNode: branch
      });

      // Granular sub-interests & leaves (Orbit 2, radius 340px)
      const subNodes = branch.children || [];
      subNodes.forEach((sub, j) => {
        // Collect concrete leaves under sub
        const leaves = sub.children && sub.children.length > 0 ? sub.children : [sub];
        leaves.forEach((leaf, k) => {
          const leafSubIndex = j * 2 + k;
          const spreadAngle = 0.38; // wedge per branch
          const leafAngle = angle + (leafSubIndex - (leaves.length * subNodes.length) / 2) * (spreadAngle / Math.max(1, leaves.length));
          const leafDist = 345 + (leafSubIndex % 2) * 45;
          const lx = centerX + leafDist * Math.cos(leafAngle);
          const ly = centerY + leafDist * Math.sin(leafAngle);

          const isAlgo = Boolean(leaf.isAlgorithmic);
          const isEnabled = leaf.isEnabled !== false;

          const lNode = {
            id: leaf.id,
            label: leaf.label,
            affinity: leaf.affinityScore || 85,
            count: leaf.count || 12,
            tags: leaf.tags || [],
            location: leaf.location,
            x: lx,
            y: ly,
            radius: 24,
            theme,
            isAlgorithmic: isAlgo,
            isEnabled,
            originalNode: leaf,
            inferredReason: leaf.inferredReason
          };
          leafNodes.push(lNode);

          // Connection from domain branch to leaf
          connectionLines.push({
            sourceX: bx,
            sourceY: by,
            targetX: lx,
            targetY: ly,
            color: theme.color,
            strokeWidth: isAlgo ? 1.5 : 1,
            isDashed: isAlgo && !algorithmSettings.enabled,
            isPulse: isAlgo && algorithmSettings.enabled,
            sourceNode: branch,
            targetNode: leaf
          });
        });
      });
    });

    return {
      centerNode,
      domainNodes,
      leafNodes,
      connectionLines,
      width: 1000,
      height: 800
    };
  }, [treeData, user, algorithmSettings.enabled]);

  // Canvas Drag Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCanvas(true);
    setDragStartPos({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCanvas) return;
    setPanOffset({
      x: e.clientX - dragStartPos.x,
      y: e.clientY - dragStartPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 p-3 sm:p-5 lg:p-6 space-y-5 max-w-7xl mx-auto w-full">
      
      {/* ========================================================================= */}
      {/* 1. EPICENTER HERO: ALEX RIVERA'S INTEREST SHOWCASE & ALGORITHM TOGGLE */}
      {/* ========================================================================= */}
      <section className="liquid-glass p-5 sm:p-6 rounded-[28px] border border-white/[0.08] relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
        
        {/* Ambient Top Light Beam */}
        <div className="absolute -top-24 left-1/4 w-96 h-48 bg-[#00F2FE]/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -top-24 right-1/4 w-96 h-48 bg-[#A855F7]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* User Identity & Core Interest Graph Badge */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#00F2FE] shadow-[0_0_24px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-900 flex items-center justify-center text-[10px] text-[#00F2FE] font-mono font-bold shadow-[0_0_8px_rgba(0,242,254,0.6)]">
                AI
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>{user.displayName}&apos;s Interest Graph</span>
                  <ShieldCheck className="w-5 h-5 text-[#00F2FE]" />
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[#00F2FE]">
                  VIP KNOWLEDGE NEXUS
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Personalized interest constellation mapping your creative passions, procedural shader algorithms, WebAudio stages, and feed recommendation weights.
              </p>

              {/* Key Metrics Strip */}
              <div className="flex items-center gap-3 sm:gap-4 mt-3 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">Total Interests:</span>
                  <span className="text-white font-bold">{allNodesList.length}</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <Zap className="w-3.5 h-3.5 text-[#00F2FE]" />
                  <span className="text-slate-400">Affinity Index:</span>
                  <span className="text-[#00F2FE] font-bold">{averageAffinity}%</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-400">AI Inferred:</span>
                  <span className="text-purple-300 font-bold">{algorithmicCount}</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-400">User Pinned:</span>
                  <span className="text-emerald-300 font-bold">{pinnedCount}</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white font-bold">{userLocation}</span>
                  <button
                    onClick={() => {
                      setTempUserLocation(userLocation);
                      setIsEditingUserLocation(true);
                    }}
                    className="ml-1 text-[10px] text-[#00F2FE] hover:underline cursor-pointer"
                    title="Change your primary location anchor"
                  >
                    [Change]
                  </button>
                </div>
              </div>

              {/* Location Quick Edit Banner */}
              {isEditingUserLocation && (
                <div className="mt-3 p-3 rounded-2xl liquid-glass-elevated border border-[#00F2FE]/40 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Set Primary Location Anchor for Interest Graph</span>
                    </span>
                    <button 
                      onClick={() => setIsEditingUserLocation(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempUserLocation}
                      onChange={(e) => setTempUserLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA or Nordic Valley"
                      className="flex-1 px-3 py-1.5 bg-white/[0.06] border border-white/15 text-white rounded-xl text-xs outline-none focus:border-[#00F2FE]"
                    />
                    <button
                      onClick={handleSaveUserLocation}
                      className="px-3 py-1.5 glimmer-gradient-bg text-slate-950 font-bold text-xs rounded-xl shadow-sm"
                    >
                      Save Location
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {QUICK_LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setTempUserLocation(loc);
                          setUserLocation(loc);
                          setIsEditingUserLocation(false);
                          apiService.updateUserProfile({ location: loc });
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.05] hover:bg-[#00F2FE]/20 hover:text-[#00F2FE] text-slate-300 border border-white/10 transition-colors"
                      >
                        📍 {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Master Algorithm Engine Switcher & Tuning Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            
            {/* The Master Algorithm Toggle Pill */}
            <div 
              onClick={handleToggleAlgorithm}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between sm:justify-start gap-4 ${
                algorithmSettings.enabled
                  ? 'bg-cyan-950/40 border-[#00F2FE]/50 shadow-[0_0_24px_rgba(0,242,254,0.25)] hover:border-[#00F2FE]'
                  : 'bg-white/[0.03] border-white/[0.1] hover:border-amber-400/50'
              }`}
              title="Click to toggle Algorithm Engine on or off"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  algorithmSettings.enabled
                    ? 'glimmer-gradient-bg text-slate-950 shadow-[0_0_14px_rgba(0,242,254,0.5)]'
                    : 'bg-white/[0.08] text-slate-400'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Algorithm Engine</span>
                    {algorithmSettings.enabled ? (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        OFF (ROOTS ONLY)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {algorithmSettings.enabled
                      ? `${algorithmSettings.explorationRate}% Curiosity • Personalizing feed`
                      : 'Showing only user-pinned organic roots'}
                  </div>
                </div>
              </div>

              {/* Styled Switch Knob */}
              <div className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                algorithmSettings.enabled ? 'bg-[#00F2FE]' : 'bg-slate-700'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  algorithmSettings.enabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Tune Parameters Trigger */}
            <button
              onClick={() => setShowAlgorithmDrawer(prev => !prev)}
              className={`px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                showAlgorithmDrawer
                  ? 'bg-white/[0.12] text-white border border-[#00F2FE]'
                  : 'ghost-btn text-slate-300'
              }`}
              title="Tune Algorithm Parameters"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#00F2FE]" />
              <span className="hidden sm:inline">Tune Engine</span>
            </button>

            {/* Re-cluster Action */}
            {algorithmSettings.enabled && (
              <button
                onClick={handleRecomputeSynapses}
                disabled={isRecomputing}
                className="px-3.5 py-3 rounded-2xl text-xs font-bold ghost-btn text-cyan-400 flex items-center justify-center gap-2 hover:border-[#00F2FE]"
                title="Re-compute and refresh interest clusters"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecomputing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRecomputing ? 'Clustering...' : 'Re-cluster'}</span>
              </button>
            )}

          </div>

        </div>

        {/* Collapsible Algorithm Tuning Drawer (Liquid Glass) */}
        {showAlgorithmDrawer && (
          <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
            {/* Exploration Rate */}
            <div className="space-y-1.5 liquid-glass-elevated p-3.5 rounded-2xl border border-white/[0.08]">
              <div className="flex justify-between font-mono font-bold">
                <span className="text-slate-300">Curiosity / Serendipity</span>
                <span className="text-[#00F2FE]">{algorithmSettings.explorationRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={algorithmSettings.explorationRate}
                disabled={!algorithmSettings.enabled}
                onChange={(e) => handleUpdateAlgoParam('explorationRate', Number(e.target.value))}
                className="w-full accent-[#00F2FE] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Discovers adjacent fields outside your primary domain (e.g. quantum code, deep-sea bio).
              </p>
            </div>

            {/* Personalization Strength */}
            <div className="space-y-1.5 liquid-glass-elevated p-3.5 rounded-2xl border border-white/[0.08]">
              <div className="flex justify-between font-mono font-bold">
                <span className="text-slate-300">Interaction Weight</span>
                <span className="text-purple-300">{algorithmSettings.personalizationStrength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={algorithmSettings.personalizationStrength}
                disabled={!algorithmSettings.enabled}
                onChange={(e) => handleUpdateAlgoParam('personalizationStrength', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Prioritizes topics from your saved posts, likes, and audio stage attendance.
              </p>
            </div>

            {/* Mode Strategy */}
            <div className="space-y-1.5 liquid-glass-elevated p-3.5 rounded-2xl border border-white/[0.08]">
              <div className="font-mono font-bold text-slate-300">
                Recommendation Strategy
              </div>
              <select
                value={algorithmSettings.discoveryMode}
                disabled={!algorithmSettings.enabled}
                onChange={(e) => handleUpdateAlgoParam('discoveryMode', e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.12] text-white rounded-xl p-2 outline-none font-semibold text-xs cursor-pointer focus:border-[#00F2FE]"
              >
                <option value="balanced" className="bg-slate-900 text-white">Balanced Exploration & Depth</option>
                <option value="deep_rabbit_hole" className="bg-slate-900 text-white">Deep Rabbit Hole (Niche focus)</option>
                <option value="high_serendipity" className="bg-slate-900 text-white">High Serendipity (Diverse frontiers)</option>
                <option value="organic_roots_only" className="bg-slate-900 text-white">Organic Roots Only (Zero AI)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Determines how deep the algorithm branches into specialized sub-topics.
              </p>
            </div>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 2. GRAPH CONTROL BAR (View Switcher, Search, Filter Pills, Add Interest) */}
      {/* ========================================================================= */}
      <div className="liquid-glass p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-2xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode('constellation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'constellation'
                  ? 'bg-white/[0.12] text-white shadow-[0_0_16px_rgba(0,242,254,0.3)] border border-[#00F2FE]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Constellation Orbit</span>
            </button>

            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'tree'
                  ? 'bg-white/[0.12] text-white shadow-[0_0_16px_rgba(0,242,254,0.3)] border border-[#00F2FE]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
              <span>Hierarchical Tree</span>
            </button>

            <button
              onClick={() => setViewMode('dna')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'dna'
                  ? 'bg-white/[0.12] text-white shadow-[0_0_16px_rgba(0,242,254,0.3)] border border-[#00F2FE]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Interest DNA & Matrix</span>
            </button>
          </div>
        </div>

        {/* Right: Search, Filter, Add Custom Interest */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passions & tags..."
              className="pl-9 pr-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.1] text-xs border border-white/[0.1] focus:border-[#00F2FE] rounded-xl outline-none w-44 sm:w-56 text-white placeholder:text-slate-500 transition-all"
            />
          </div>

          {/* Add Interest Action */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold glimmer-gradient-bg text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-[0_0_14px_rgba(0,242,254,0.4)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Passion</span>
          </button>

          {/* Canvas Zoom Controls (For Constellation mode) */}
          {viewMode === 'constellation' && (
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] p-1 rounded-xl">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
                className="p-1 hover:bg-white/[0.1] text-slate-300 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
                className="p-1 hover:bg-white/[0.1] text-slate-300 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
                className="p-1 hover:bg-white/[0.1] text-slate-300 rounded transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Expand/Collapse for Tree Mode */}
          {viewMode === 'tree' && (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={expandAll}
                className="px-2.5 py-1 ghost-btn text-slate-300 rounded-lg text-[11px] font-bold"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-2.5 py-1 ghost-btn text-slate-300 rounded-lg text-[11px] font-bold"
              >
                Collapse
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: GRAPH SHOWCASE + DETAILED SYNAPSE INSPECTOR */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left/Center 8 cols: The Visual Graph Display */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
              DOMAINS:
            </span>
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-white/[0.15] text-white border border-[#00F2FE]'
                  : 'ghost-btn text-slate-400'
              }`}
            >
              All ({allNodesList.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('roots')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeCategoryFilter === 'roots'
                  ? 'bg-white/[0.15] text-white border border-emerald-400'
                  : 'ghost-btn text-slate-400'
              }`}
            >
              Pinned Roots ({pinnedCount})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('algorithmic')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeCategoryFilter === 'algorithmic'
                  ? 'bg-white/[0.15] text-white border border-purple-400'
                  : 'ghost-btn text-slate-400'
              }`}
            >
              Algorithmic Discoveries ({algorithmicCount})
            </button>
          </div>

          {/* VIEW MODE 1: CONSTELLATION ORBIT VIEW (Alex at the epicenter) */}
          {viewMode === 'constellation' && (
            <div className="liquid-glass rounded-[28px] border border-white/[0.08] overflow-hidden relative shadow-[0_16px_48px_0_rgba(0,0,0,0.7)] h-[580px] sm:h-[640px] select-none">
              
              {/* Subtle Grid & Radial Rings */}
              <div 
                className="w-full h-full cursor-grab active:cursor-grabbing relative"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <svg
                  className="w-full h-full pointer-events-none"
                  viewBox="0 0 1000 800"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: '500px 400px',
                    transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  <defs>
                    {/* Glowing Filters */}
                    <filter id="glowTeal" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glowPurple" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Gradients */}
                    <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#A855F7" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Orbital Rings radiating from Alex Rivera */}
                  <circle cx="500" cy="400" r="195" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
                  <circle cx="500" cy="400" r="345" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 6" />
                  <circle cx="500" cy="400" r="390" fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 6" />

                  {/* Connection Lines */}
                  {constellationData.connectionLines.map((link, idx) => {
                    const isSelected = selectedNode && (selectedNode.id === link.sourceNode.id || selectedNode.id === link.targetNode.id);
                    return (
                      <g key={`link-${idx}`}>
                        <line
                          x1={link.sourceX}
                          y1={link.sourceY}
                          x2={link.targetX}
                          y2={link.targetY}
                          stroke={isSelected ? '#00F2FE' : link.color}
                          strokeWidth={isSelected ? 3 : link.strokeWidth}
                          strokeOpacity={isSelected ? 0.9 : 0.4}
                          strokeDasharray={link.isDashed ? '4 4' : undefined}
                        />
                        {/* Synaptic Light Pulse along edges when algorithm active */}
                        {link.isPulse && (
                          <circle r={isSelected ? 3.5 : 2} fill="#FFFFFF">
                            <animateMotion
                              path={`M${link.sourceX},${link.sourceY} L${link.targetX},${link.targetY}`}
                              dur={`${3 + (idx % 3)}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* HTML Interactive Nodes on top of SVG */}
                <div
                  className="absolute inset-0 pointer-events-auto"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: '500px 400px',
                    transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  {/* 1. Epicenter: Alex Rivera Center Node */}
                  <div
                    onClick={() => setSelectedNode(treeData)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                    style={{ left: `${constellationData.centerNode.x}px`, top: `${constellationData.centerNode.y}px` }}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Aura Ring */}
                      <div className="w-24 h-24 rounded-full absolute -inset-2 bg-gradient-to-r from-[#00F2FE] via-[#A855F7] to-[#EC4899] opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
                      
                      <div className="w-20 h-20 rounded-full bg-slate-950 p-1 relative z-10 border-2 border-white shadow-[0_0_30px_rgba(0,242,254,0.6)] group-hover:scale-105 transition-transform overflow-hidden">
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>

                      <div className="mt-2 text-center pointer-events-none">
                        <div className="text-xs font-extrabold text-white tracking-wide flex items-center gap-1 justify-center">
                          <span>{user.displayName}</span>
                          <span className="text-[10px] text-[#00F2FE] font-mono">(You)</span>
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400">
                          {user.handle ? `@${user.handle}` : `@${user.username}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Level 1 Major Domain Nodes */}
                  {constellationData.domainNodes.map((d) => {
                    const isSelected = selectedNode?.id === d.id;
                    const IconComponent = d.theme.icon;

                    return (
                      <div
                        key={d.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(d.originalNode);
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        style={{ left: `${d.x}px`, top: `${d.y}px` }}
                      >
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'scale-110 shadow-[0_0_28px_rgba(0,242,254,0.7)] border-2 border-white' 
                                : 'hover:scale-105 border border-white/20'
                            }`}
                            style={{
                              backgroundColor: 'rgba(10, 10, 15, 0.85)',
                              boxShadow: isSelected ? `0 0 24px ${d.theme.glow}` : `0 0 14px ${d.theme.glow}`
                            }}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>

                          <div className="mt-1 text-center max-w-[130px] pointer-events-none">
                            <div className="text-[11px] font-extrabold text-white leading-tight">
                              {d.label}
                            </div>
                            <div className="text-[9px] font-mono font-bold text-slate-400">
                              {d.affinity}% Affinity
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 3. Level 2 Specialized Leaves & Algorithmic Discoveries */}
                  {constellationData.leafNodes.map((leaf) => {
                    const isSelected = selectedNode?.id === leaf.id;
                    const isMuted = !leaf.isEnabled || (!algorithmSettings.enabled && leaf.isAlgorithmic);

                    return (
                      <div
                        key={leaf.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(leaf.originalNode);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-all ${
                          isMuted ? 'opacity-40 grayscale hover:opacity-80 hover:grayscale-0' : 'opacity-100'
                        }`}
                        style={{ left: `${leaf.x}px`, top: `${leaf.y}px` }}
                      >
                        <div className="flex items-center gap-1.5 p-1 rounded-xl group-hover:scale-105 transition-transform">
                          
                          {/* Dot / Pill */}
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                              isSelected 
                                ? 'ring-2 ring-white scale-110 shadow-[0_0_16px_rgba(0,242,254,0.8)]' 
                                : 'border border-white/15'
                            }`}
                            style={{
                              backgroundColor: leaf.isAlgorithmic ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0, 242, 254, 0.25)',
                              color: leaf.isAlgorithmic ? '#C084FC' : '#00F2FE'
                            }}
                          >
                            {leaf.isAlgorithmic ? (
                              <Sparkles className="w-3.5 h-3.5" />
                            ) : (
                              <Zap className="w-3.5 h-3.5" />
                            )}
                          </div>

                          {/* Label Chip */}
                          <div className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold tracking-tight whitespace-nowrap transition-colors flex items-center gap-1 ${
                            isSelected 
                              ? 'bg-white text-slate-950 font-bold shadow-md' 
                              : 'bg-black/75 text-slate-200 border border-white/10 group-hover:border-cyan-400'
                          }`}>
                            <span>{leaf.label}</span>
                            {leaf.location && (
                              <span className="text-[9px] text-rose-400 font-normal" title={leaf.location}>
                                📍
                              </span>
                            )}
                            {leaf.affinity && (
                              <span className="text-[9px] opacity-75 font-mono">
                                {leaf.affinity}%
                              </span>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* Floating Canvas Guide Pill at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 flex items-center gap-2 p-2 rounded-xl liquid-glass text-[11px] font-mono text-slate-300 pointer-events-none">
                  <div className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
                  <span>Click any passion to inspect · Drag canvas to pan</span>
                </div>

              </div>
            </div>
          )}

          {/* VIEW MODE 2: HIERARCHICAL TREE VIEW */}
          {viewMode === 'tree' && (
            <div className="liquid-glass rounded-[28px] border border-white/[0.08] p-5 space-y-4 shadow-[0_16px_48px_0_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#00F2FE]" />
                    <span>Alex Rivera&apos;s Taxonomy Knowledge Tree</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hierarchical structure showing core roots, domain branches, and active leaf interests.
                  </p>
                </div>
              </div>

              {/* Recursive Render of Tree Data */}
              <div className="space-y-2">
                {treeData.children?.map(branch => (
                  <div key={branch.id} className="liquid-glass-elevated rounded-2xl p-3 border border-white/[0.08] space-y-2">
                    <div 
                      onClick={() => toggleNodeExpand(branch.id)}
                      className="flex items-center justify-between cursor-pointer hover:text-[#00F2FE] select-none"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        {expandedNodes[branch.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span>{branch.label}</span>
                        <span className="text-[10px] font-mono text-slate-400">({branch.count} posts)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#00F2FE] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                        {branch.affinityScore}% Affinity
                      </span>
                    </div>

                    {expandedNodes[branch.id] && branch.children && (
                      <div className="pl-6 space-y-2 border-l border-white/10 ml-2">
                        {branch.children.map(sub => (
                          <div key={sub.id} className="space-y-1.5 pt-1">
                            <div 
                              onClick={() => toggleNodeExpand(sub.id)}
                              className="flex items-center justify-between text-xs text-slate-300 font-semibold cursor-pointer hover:text-white"
                            >
                              <div className="flex items-center gap-1.5">
                                {sub.children ? (
                                  expandedNodes[sub.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                                ) : <div className="w-3.5 h-3.5" />}
                                <span>{sub.label}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">{sub.affinityScore}%</span>
                            </div>

                            {expandedNodes[sub.id] && sub.children && (
                              <div className="pl-5 space-y-1 border-l border-white/10 ml-1.5">
                                {sub.children.map(leaf => (
                                  <div
                                    key={leaf.id}
                                    onClick={() => setSelectedNode(leaf)}
                                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                                      selectedNode?.id === leaf.id
                                        ? 'bg-white/[0.12] text-white border border-[#00F2FE]'
                                        : 'hover:bg-white/[0.05] text-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {leaf.isAlgorithmic ? (
                                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                      ) : (
                                        <Zap className="w-3.5 h-3.5 text-[#00F2FE]" />
                                      )}
                                      <span className="font-medium">{leaf.label}</span>
                                      {leaf.location && (
                                        <span className="text-[10px] text-rose-300 font-mono flex items-center gap-0.5">
                                          <MapPin className="w-2.5 h-2.5 text-rose-400" />
                                          {leaf.location}
                                        </span>
                                      )}
                                      {leaf.isAlgorithmic && (
                                        <span className="text-[9px] font-mono text-purple-300 bg-purple-950/80 px-1 rounded">
                                          INFERRED
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 font-mono text-[10px]">
                                      <span className="text-slate-400">{leaf.count} items</span>
                                      <span className="text-[#00F2FE] font-bold">{leaf.affinityScore}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 3: INTEREST DNA & MATRIX BREAKDOWN */}
          {viewMode === 'dna' && (
            <div className="liquid-glass rounded-[28px] border border-white/[0.08] p-5 space-y-5 shadow-[0_16px_48px_0_rgba(0,0,0,0.7)]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Alex Rivera&apos;s Affinity DNA & Interaction Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Telemetry weights derived from user actions, saved shaders, WebAudio hours, and upvotes.
                </p>
              </div>

              {/* Domain Distribution Bars */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Domain Distribution Profile
                </div>
                {[
                  { name: 'Sound Synthesis & Web Audio', pct: 36, color: '#A855F7', icon: Volume2 },
                  { name: 'Visual Arts & WebGPU Shaders', pct: 30, color: '#00F2FE', icon: Palette },
                  { name: 'Virtual Production & Unreal 5', pct: 18, color: '#F59E0B', icon: Video },
                  { name: 'Frontier Engineering & P2P', pct: 10, color: '#EC4899', icon: Cpu },
                  { name: 'Alpine Optics & Topography', pct: 6, color: '#10B981', icon: Mountain }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-mono text-slate-400 font-bold">{item.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interaction Sources Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.08] text-xs">
                <div className="liquid-glass-elevated p-3 rounded-2xl space-y-1">
                  <div className="text-slate-400 font-mono text-[10px]">BOOKMARKS & SAVES</div>
                  <div className="text-lg font-bold text-white font-mono">54.2%</div>
                  <p className="text-[11px] text-slate-400">Primary driver for GLSL shader & raymarching clusters.</p>
                </div>
                <div className="liquid-glass-elevated p-3 rounded-2xl space-y-1">
                  <div className="text-slate-400 font-mono text-[10px]">AUDIO STAGE TIME</div>
                  <div className="text-lg font-bold text-purple-300 font-mono">28.5%</div>
                  <p className="text-[11px] text-slate-400">Listening in Live Ambient Jam #04 triggered Eurorack synapses.</p>
                </div>
                <div className="liquid-glass-elevated p-3 rounded-2xl space-y-1">
                  <div className="text-slate-400 font-mono text-[10px]">UPVOTES & REPOSTS</div>
                  <div className="text-lg font-bold text-amber-300 font-mono">17.3%</div>
                  <p className="text-[11px] text-slate-400">Continuous interaction with @kai_creative mountain posts.</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right 4 cols: Interactive Selected Synapse Inspector */}
        <div className="lg:col-span-4 space-y-4">
          
          {selectedNode ? (
            <div className="liquid-glass-elevated p-5 rounded-[28px] border border-white/[0.12] space-y-4 shadow-[0_16px_48px_0_rgba(0,0,0,0.8)] sticky top-24">
              
              {/* Header with Icon and Affinity Badge */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#00F2FE]/15 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shadow-[0_0_16px_rgba(0,242,254,0.3)] shrink-0">
                    {selectedNode.isAlgorithmic ? (
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    ) : (
                      <Flame className="w-6 h-6 text-[#00F2FE]" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                      {selectedNode.isAlgorithmic ? 'ALGORITHMIC INFERENCE' : 'USER PASSION CLUSTER'}
                    </div>
                    <h2 className="text-base font-extrabold text-white leading-tight">
                      {selectedNode.label}
                    </h2>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-[#00F2FE]">
                    {selectedNode.affinityScore || 90}%
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase">
                    AFFINITY
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description || 'Core user interest mapping active in your personalized Blue Mountain feed.'}
              </p>

              {/* Location Anchor */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold font-mono">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>LOCATION ANCHOR:</span>
                  </div>
                  <button
                    onClick={() => {
                      setNodeLocationInput(selectedNode.location || '');
                      setIsEditingNodeLocation(prev => !prev);
                    }}
                    className="text-[10px] font-mono font-bold text-[#00F2FE] hover:underline cursor-pointer"
                  >
                    {selectedNode.location ? 'Change' : '+ Add Location'}
                  </button>
                </div>

                {isEditingNodeLocation ? (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nodeLocationInput}
                        onChange={(e) => setNodeLocationInput(e.target.value)}
                        placeholder="e.g. Nordic Valley, SF Tech Lab"
                        className="flex-1 p-2 bg-white/[0.08] border border-white/15 text-white rounded-xl text-xs outline-none focus:border-[#00F2FE]"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNodeLocation}
                        className="px-3 py-1 bg-[#00F2FE] text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        Save
                      </button>
                    </div>
                    {/* Quick location chips */}
                    <div className="flex flex-wrap gap-1">
                      {QUICK_LOCATIONS.map(loc => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setNodeLocationInput(loc)}
                          className="text-[9px] px-1.5 py-0.5 rounded-lg bg-white/[0.06] text-slate-300 hover:text-[#00F2FE] hover:bg-white/[0.1] border border-white/10"
                        >
                          📍 {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : selectedNode.location ? (
                  <div className="text-xs text-white font-medium flex items-center gap-1.5">
                    <span className="text-slate-200">{selectedNode.location}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    No physical studio or field location set. Click &ldquo;+ Add Location&rdquo; to geo-anchor this topic.
                  </div>
                )}
              </div>

              {/* Inferred Reason (If algorithmic) */}
              {selectedNode.isAlgorithmic && selectedNode.inferredReason && (
                <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{selectedNode.inferredReason}</span>
                </div>
              )}

              {/* Interactive Affinity Tuning Slider */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Tune Recommendation Weight:</span>
                  <span className="text-[#00F2FE] font-bold">{selectedNode.affinityScore || 90}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={selectedNode.affinityScore || 90}
                  onChange={(e) => handleUpdateWeight(selectedNode.id, Number(e.target.value))}
                  className="w-full accent-[#00F2FE] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Less in feed</span>
                  <span>More in feed</span>
                </div>
              </div>

              {/* Related Tags */}
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    MATCHING TAGS:
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedNode.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => onSelectClusterTag(tag)}
                        className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-white/[0.06] hover:bg-[#00F2FE] hover:text-slate-950 text-slate-200 border border-white/10 transition-all flex items-center gap-1"
                      >
                        <span>{tag}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Actions */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                
                {/* Explore in Feed CTA */}
                <button
                  onClick={() => {
                    const tag = selectedNode.tags?.[0] || selectedNode.label.toLowerCase().replace(/[^a-z0-9]/g, '');
                    onSelectClusterTag(tag);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold glimmer-gradient-bg text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Explore Matching Posts in Feed</span>
                </button>

                {/* Sub-Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleNodeEnabled(selectedNode.id, !selectedNode.isEnabled)}
                    className="flex-1 py-2 px-3 ghost-btn rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5"
                  >
                    {selectedNode.isEnabled !== false ? 'Silence in Feed' : 'Activate in Feed'}
                  </button>

                  {selectedNode.id !== 'root_alex' && (
                    <button
                      onClick={() => handlePruneNode(selectedNode.id)}
                      className="p-2 ghost-btn rounded-xl text-rose-400 hover:text-rose-300 hover:border-rose-500/50"
                      title="Prune interest node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="liquid-glass p-6 rounded-[28px] border border-white/[0.08] text-center space-y-3">
              <Compass className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-xs font-bold text-white">No Interest Selected</div>
              <p className="text-xs text-slate-400">
                Click any passion or leaf node in the constellation orbit to inspect its telemetry and adjust recommendation weights.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD CUSTOM INTEREST NODE */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-modal p-6 border border-white/20 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00F2FE]" />
                <h3 className="text-sm font-bold text-white">Add Custom Interest to Alex&apos;s Graph</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddInterestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent Domain</label>
                <select
                  value={addParentId}
                  onChange={(e) => setAddParentId(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl outline-none focus:border-[#00F2FE]"
                >
                  <option value="branch_visual" className="bg-slate-900">Visual Arts & Shaders</option>
                  <option value="branch_audio" className="bg-slate-900">Sound Synthesis & WebAudio</option>
                  <option value="branch_cinema" className="bg-slate-900">Virtual Production & Cinema</option>
                  <option value="branch_sports" className="bg-slate-900">Alpine Optics & Topography</option>
                  <option value="branch_frontier" className="bg-slate-900">Frontier Engineering & P2P</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Interest Label</label>
                <input
                  type="text"
                  placeholder="e.g. Granular Synthesis, NeRF Reconstruction"
                  value={newInterestLabel}
                  onChange={(e) => setNewInterestLabel(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl outline-none focus:border-[#00F2FE] placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe this topic and why you want to track it..."
                  value={newInterestDesc}
                  onChange={(e) => setNewInterestDesc(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl outline-none focus:border-[#00F2FE] placeholder:text-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Location / Studio Anchor (Optional)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Geo-tag this passion</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nordic Valley • Phase IV, SF Tech Lab, Tokyo Studio"
                  value={newInterestLocation}
                  onChange={(e) => setNewInterestLocation(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.06] border border-white/10 text-white rounded-xl outline-none focus:border-[#00F2FE] placeholder:text-slate-500"
                />
                {/* Preset quick location pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK_LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setNewInterestLocation(loc)}
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-white/[0.05] hover:bg-[#00F2FE]/20 hover:text-[#00F2FE] text-slate-300 border border-white/10 transition-colors"
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 ghost-btn rounded-xl font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 glimmer-gradient-bg text-slate-950 font-bold rounded-xl shadow-[0_0_14px_rgba(0,242,254,0.4)]"
                >
                  Add to Graph
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
