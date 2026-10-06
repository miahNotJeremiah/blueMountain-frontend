import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Palette, 
  Volume2, 
  Video, 
  Network, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  Zap, 
  Code, 
  AlertTriangle,
  Check,
  RefreshCw,
  Copy
} from 'lucide-react';
import { User } from '../types';
import { resetMockData } from '../services/apiService';

interface SettingsViewProps {
  currentUser: User;
  onUpdateProfile: (data: Partial<User>) => Promise<void>;
  palette: string;
  setPalette: (p: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateProfile,
  palette,
  setPalette
}) => {
  const [activeSection, setActiveSection] = useState('account');
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio);
  const [classicLayout, setClassicLayout] = useState(true);
  const [sharpEdges, setSharpEdges] = useState(false);
  const [spatialPan, setSpatialPan] = useState(true);
  const [losslessOpus, setLosslessOpus] = useState(true);
  const [rnNoise, setRnNoise] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleSave = async () => {
    await onUpdateProfile({ displayName, handle, bio });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (confirm('Reset all mock storage data back to default?')) {
      resetMockData();
      window.location.reload();
    }
  };

  const navItems = [
    { id: 'account', label: 'Identity & Account', icon: UserIcon },
    { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
    { id: 'audio', label: 'Audio & Voice DSP', icon: Volume2 },
    { id: 'video', label: 'Video & Viewport', icon: Video },
    { id: 'neural', label: 'Neural Explore Tree', icon: Network },
    { id: 'developer', label: 'Developer & API', icon: Code },
    { id: 'danger', label: 'Critical & Danger', icon: AlertTriangle },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
              CONFIGURATION v0.0.12-rev4
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">Preferences</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure runtime visual parameters, neural explore graph, audio DSP engine, and API connections.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : null}
          <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panels */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Identity & Account Credentials */}
          {(activeSection === 'account' || activeSection === 'all') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Identity & Account Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Platform Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">Bio & Manifesto</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cyan-500 font-medium resize-none"
                />
              </div>
            </div>
          )}

          {/* Appearance & Themes */}
          {(activeSection === 'appearance' || activeSection === 'all') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Appearance & Themes
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-800">Classic 2015 Hub Layout</div>
                    <div className="text-slate-400">Enables tactile shadows, crisp borders and classic YouTube density</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={classicLayout}
                    onChange={(e) => setClassicLayout(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-800">Chiseled Sharp-Edge Geometry</div>
                    <div className="text-slate-400">Reduces rounding on module envelopes to 4px for terminal precision</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={sharpEdges}
                    onChange={(e) => setSharpEdges(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                </div>

                <div>
                  <div className="font-bold text-slate-700 mb-2">Core Brand Accent Palette</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPalette('cyan')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        palette === 'cyan' ? 'border-cyan-500 bg-cyan-50 text-cyan-900' : 'border-slate-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-500" />
                      <span>Electric Cyan</span>
                    </button>
                    <button
                      onClick={() => setPalette('indigo')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        palette === 'indigo' ? 'border-slate-800 bg-slate-100 text-slate-900' : 'border-slate-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-[#1e293b]" />
                      <span>Deep Indigo</span>
                    </button>
                    <button
                      onClick={() => setPalette('green')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        palette === 'green' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                      <span>Matrix Green</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audio & Voice DSP Engine */}
          {(activeSection === 'audio' || activeSection === 'all') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Audio & Voice DSP Engine (WebRTC 48kHz / 32-Bit Float)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={spatialPan}
                    onChange={(e) => setSpatialPan(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-slate-800">3D Spatial Pan</div>
                    <div className="text-[10px] text-slate-400">Binaural HRTF rendering</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={losslessOpus}
                    onChange={(e) => setLosslessOpus(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Lossless Opus 320k</div>
                    <div className="text-[10px] text-slate-400">Pristine music streaming</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rnNoise}
                    onChange={(e) => setRnNoise(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-slate-800">RNNoise Suppression</div>
                    <div className="text-[10px] text-slate-400">Neural ML cancellation</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Developer & API */}
          {(activeSection === 'developer' || activeSection === 'all') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Developer Console & Backend Architecture
              </h2>

              <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span>PRODUCTION API TOKEN (READ/WRITE)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('bm_live_98a7cf23e110bb4290fa8');
                      setCopiedToken(true);
                      setTimeout(() => setCopiedToken(false), 2000);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedToken ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-cyan-300 select-all">
                  bm_live_98a7cf23e110bb4290fa899321c
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">NODE.JS REST</span>
                    <span className="text-emerald-400 font-bold">PORT 3000 (READY)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">REDIS CACHE</span>
                    <span className="text-cyan-400 font-bold">PORT 6379 (READY)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">POSTGRESQL</span>
                    <span className="text-purple-400 font-bold">PORT 5432 (READY)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {(activeSection === 'danger' || activeSection === 'all') && (
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-extrabold text-red-900 border-b border-red-200 pb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Danger Zone & Test Data Controls</span>
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div>
                  <div className="font-bold text-xs text-red-950">Reset Mock Database & Local Storage</div>
                  <div className="text-[11px] text-red-700">Deletes custom posts and resets user back to initial seed data.</div>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm shrink-0"
                >
                  Reset Test Data
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
