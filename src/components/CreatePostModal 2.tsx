import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Music, 
  Camera, 
  MapPin, 
  Tag, 
  Sparkles, 
  UploadCloud, 
  Trash2, 
  Check, 
  Globe, 
  Lock,
  Layers
} from 'lucide-react';
import { User, Post } from '../types';
import { uploadMediaFile } from '../services/apiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPostCreated: (newPost: Post) => void;
  onCreatePostService: (data: {
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
  }) => Promise<Post>;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  onCreatePostService
}) => {
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [gearTag, setGearTag] = useState('');
  const [hasAudio, setHasAudio] = useState(false);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioArtist, setAudioArtist] = useState(currentUser.displayName);
  const [locationTag, setLocationTag] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['bluemountain', 'creativeflow']);
  const [audience, setAudience] = useState<'public' | 'pro' | 'subscribers'>('public');

  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Sample quick images for rapid testing (hotlinked high quality images)
  const SAMPLE_IMAGES = [
    { label: 'Alpine Summit', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=85' },
    { label: 'Prism UI Design', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=85' },
    { label: 'Synth Studio Lab', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&auto=format&fit=crop&q=85' },
    { label: 'Frost Shaders', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=85' }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const res = await uploadMediaFile(files[i]);
        setMediaUrls(prev => [...prev, res.url]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSampleImage = (url: string) => {
    if (!mediaUrls.includes(url)) {
      setMediaUrls(prev => [...prev, url]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags(prev => [...prev, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;

    setIsPublishing(true);
    try {
      const created = await onCreatePostService({
        content: content.trim(),
        mediaUrls,
        mediaType: mediaUrls.length > 1 ? 'carousel' : (mediaUrls.length === 1 ? 'image' : (hasAudio ? 'audio' : 'text')),
        gearTag: gearTag.trim() || undefined,
        audioTrack: hasAudio && audioTitle.trim() ? {
          title: audioTitle.trim(),
          artist: audioArtist.trim() || currentUser.displayName,
          duration: '03:15'
        } : undefined,
        tags,
        locationTag: locationTag.trim() || undefined
      });

      onPostCreated(created);
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Post</h2>
              <p className="text-[11px] text-slate-500 font-mono">
                MinIO Storage :9000 • Node.js REST :3000
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Author info & Audience Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {currentUser.displayName}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  @{currentUser.handle}
                </div>
              </div>
            </div>

            {/* Audience Segment */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setAudience('public')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  audience === 'public' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'
                }`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setAudience('pro')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  audience === 'pro' ? 'bg-white text-cyan-800 shadow-sm font-bold' : 'hover:text-slate-900'
                }`}
              >
                Pro Tier
              </button>
            </div>
          </div>

          {/* Post Text Input */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are you building, capturing, or synthesizing? Share audio, visual stem, or thought..."
              className="w-full p-3 text-sm text-slate-900 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl outline-none resize-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Attached Media Previews */}
          {mediaUrls.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Attached Media ({mediaUrls.length})</span>
                <span className="text-slate-400 font-normal">
                  {mediaUrls.length > 1 ? 'Will display as swipeable Carousel' : 'Single Media Showcase'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {mediaUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group bg-slate-950">
                    <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Sample Media Hotlink Chips */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Hotlink Assets (Direct CDN)</span>
              <span className="text-[10px] text-cyan-600 font-mono">MinIO S3 Ready</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  type="button"
                  key={sample.url}
                  onClick={() => handleAddSampleImage(sample.url)}
                  className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-cyan-50 hover:border-cyan-300 border border-slate-200 rounded-md text-slate-700 transition-colors"
                >
                  + {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gear / Camera Hardware Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <span>Gear & Setup Hardware</span>
              </label>
              <input
                type="text"
                value={gearTag}
                onChange={(e) => setGearTag(e.target.value)}
                placeholder="e.g. SONY A1 • 24MM F/1.4 or FIGMA 2026"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location Tag</span>
                </span>
                {locationTag && (
                  <button
                    type="button"
                    onClick={() => setLocationTag('')}
                    className="text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </label>
              <input
                type="text"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="e.g. Nordic Valley • Phase IV Summit"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-lg outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  'Nordic Valley • Phase IV',
                  'San Francisco Lab',
                  'Tokyo Akihabara Hub',
                  'Zurich Analog Stage'
                ].map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocationTag(loc)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 border border-slate-200 transition-colors"
                  >
                    + {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Audio Stem Attachment */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Music className="w-4 h-4 text-cyan-600" />
                <span>Attach Audio Track / Stem</span>
              </div>
              <input
                type="checkbox"
                id="toggleAudio"
                checked={hasAudio}
                onChange={(e) => setHasAudio(e.target.checked)}
                className="w-4 h-4 accent-cyan-600 rounded"
              />
            </div>

            {hasAudio && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                  placeholder="Track Title (e.g. Summit Winds)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-cyan-500 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={audioArtist}
                  onChange={(e) => setAudioArtist(e.target.value)}
                  placeholder="Artist (e.g. kai_creative)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-cyan-500 rounded-lg outline-none"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tags (Press Enter to add)</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-900"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-cyan-700 hover:text-cyan-950"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="flex-1 min-w-[100px] text-xs bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-cyan-600" />
              <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPublishing || (!content.trim() && mediaUrls.length === 0)}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all"
            >
              {isPublishing ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
