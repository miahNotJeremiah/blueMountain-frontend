import React, { useState } from 'react';
import { 
  X, 
  Server, 
  Database, 
  HardDrive, 
  Zap, 
  Check, 
  Copy, 
  ArrowRight, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

interface BackendArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendArchitectureModal: React.FC<BackendArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const configSnippet = `// In src/services/apiService.ts:
export const BACKEND_BASE_URL = 'http://localhost:3000/api/v1';
export const USE_MOCK_DATA = false; // Connect directly to Node.js backend!`;

  const copyConfig = () => {
    navigator.clipboard.writeText(configSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm shadow">
              API
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Backend Architecture & API Integration
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Decoupled Frontend ➔ Node.js (3000) • Redis (6379) • MinIO (9000) • PostgreSQL (5432)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* 1. ASCII / Visual Diagram matching reference graph */}
          <div className="bg-slate-950 text-white p-5 rounded-xl font-mono shadow-inner border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>SYSTEM TOPOLOGY GRAPH</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ALL NODES READY
              </span>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-center">
              
              {/* Backend Node.js */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-cyan-500/50 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 font-bold">
                  <Server className="w-4 h-4" />
                  <span>Backend (Node.js)</span>
                </div>
                <div className="text-[11px] text-slate-400">REST API Gateway</div>
                <div className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  Port: 3000
                </div>
              </div>

              {/* Redis Cache */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-rose-500/40 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Redis (Cache)</span>
                </div>
                <div className="text-[11px] text-slate-400">Timeline & Like Counters</div>
                <div className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  Port: 6379
                </div>
              </div>

              {/* MinIO Storage */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
                  <HardDrive className="w-4 h-4" />
                  <span>MinIO (Storage)</span>
                </div>
                <div className="text-[11px] text-slate-400">S3 Media & Audio Stems</div>
                <div className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  Port: 9000
                </div>
              </div>

            </div>

            {/* Bottom Arrow to PostgreSQL */}
            <div className="flex flex-col items-center pt-1 text-purple-400 font-bold">
              <span>│</span>
              <span>▼</span>
              <div className="w-full md:w-1/2 p-3 rounded-lg bg-slate-900 border border-purple-500/40 text-center space-y-1 mt-1">
                <div className="flex items-center justify-center gap-1.5 text-purple-400">
                  <Database className="w-4 h-4" />
                  <span>PostgreSQL (DB)</span>
                </div>
                <div className="text-[11px] text-slate-400">Users, Posts, Comments, Badges</div>
                <div className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded inline-block">
                  Port: 5432
                </div>
              </div>
            </div>

          </div>

          {/* 2. Isolated API Service Highlights */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Clean Data Decoupling via <code className="text-cyan-700 font-mono">src/services/apiService.ts</code>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              All UI components strictly call async methods defined in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">apiService.ts</code>. No mock data is permanently hardcoded inside the layout components.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-800 mb-1">
                  1. Feed & Timeline Fetch
                </div>
                <div className="font-mono text-[11px] text-cyan-700">
                  getFeedPosts(params)
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Calls <code className="text-slate-700">GET /api/v1/posts</code> with Redis cached timeline responses.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-800 mb-1">
                  2. Post Creation & Media
                </div>
                <div className="font-mono text-[11px] text-cyan-700">
                  createPost(data) & uploadMediaFile(file)
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Uploads blobs to MinIO (Port 9000), inserts post into PostgreSQL (Port 5432).
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-800 mb-1">
                  3. Atomic Likes & Bookmarks
                </div>
                <div className="font-mono text-[11px] text-cyan-700">
                  toggleLikePost(postId)
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Increments atomic counter in Redis (Port 6379) before PostgreSQL sync.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-800 mb-1">
                  4. Profile & Badge Store
                </div>
                <div className="font-mono text-[11px] text-cyan-700">
                  updateUserProfile() & purchaseBadge()
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Modifies user state, equipped insignias, and Sparks currency balance.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Easy Toggle Snippet */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold font-mono">HOW TO ACTIVATE REAL BACKEND:</span>
              <button
                onClick={copyConfig}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono font-medium"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copied Snippet' : 'Copy Config'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-cyan-300 overflow-x-auto p-2 bg-slate-950 rounded">
              {configSnippet}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-slate-500 text-xs">
            Currently running in high-fidelity mock mode with local persistence.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
