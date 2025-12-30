
import React, { useState } from 'react';
import { generateVideoVeo, optimizePrompt } from '../services/geminiService';
import { GenerationItem } from '../types';
import { Video, Play, RefreshCw, Key, AlertTriangle, Wand2, Info } from 'lucide-react';

interface Props {
  addHistory: (item: GenerationItem) => void;
  isVip: boolean;
}

const VideoStudio: React.FC<Props> = ({ addHistory, isVip }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [needsKey, setNeedsKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = async () => {
    // Note: window.aistudio is a mock/injected global for key selection in this environment
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      setNeedsKey(true);
      return false;
    }
    return true;
  };

  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setNeedsKey(false);
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) return;
    setOptimizing(true);
    try {
      const refined = await optimizePrompt(prompt);
      setPrompt(refined);
    } catch (e) {
      setError("Prompt optimization failed.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check key requirement for Veo models
    const hasKey = await checkApiKey();
    if (!hasKey) return;

    setLoading(true);
    setError(null);
    try {
      const url = await generateVideoVeo(prompt, aspectRatio);
      setVideoUrl(url);
      addHistory({
        id: Date.now().toString(),
        type: 'video',
        url: url,
        prompt,
        timestamp: Date.now(),
        isFavorite: false,
        status: 'completed'
      });
    } catch (e: any) {
      if (e.message.includes("not found")) {
        setError("API Session expired. Please re-select your API key.");
        setNeedsKey(true);
      } else {
        setError(e.message || "Video generation timed out. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-indigo-200">
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Video className="text-indigo-200"/> Veo Studio
          </h2>
          <p className="text-indigo-100 opacity-90">
            Generate high-quality cinematic videos up to 1080p. 
            Perfect for social media reels, ads, and visual storytelling.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs uppercase font-bold opacity-70">Power Mode</p>
            <p className="text-xl font-bold">Veo 3.1 Fast</p>
          </div>
          <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center">
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Video Script/Prompt</label>
              <button 
                onClick={handleOptimize}
                disabled={optimizing || !prompt}
                className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700 disabled:opacity-50"
              >
                {optimizing ? <RefreshCw className="animate-spin" size={12}/> : <Wand2 size={12}/>}
                Enhance Script
              </button>
            </div>
            <textarea
              className="w-full h-40 p-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Describe the motion: A cinematic tracking shot of a high-speed train traveling through snowy mountains..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="flex items-center gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Aspect Ratio</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio("16:9")}
                    className={`px-4 py-2 text-xs rounded-lg border transition-all flex items-center gap-2 ${
                      aspectRatio === "16:9" ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    onClick={() => setAspectRatio("9:16")}
                    className={`px-4 py-2 text-xs rounded-lg border transition-all flex items-center gap-2 ${
                      aspectRatio === "9:16" ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    9:16 Portrait
                  </button>
                </div>
              </div>
            </div>

            {needsKey ? (
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0" size={24}/>
                  <div>
                    <h4 className="font-bold text-amber-900">API Key Required</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Veo video generation requires a paid Google Cloud project API key. 
                      You can select yours securely through AI Studio.
                    </p>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] underline mt-1 block">Learn about billing</a>
                  </div>
                </div>
                <button
                  onClick={handleSelectKey}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Key size={18}/> Select Billing API Key
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full py-5 bg-gray-900 hover:bg-black disabled:opacity-50 text-white rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={24}/> : <Video size={24}/>}
                {loading ? 'Crafting your video (takes ~2 mins)...' : 'Start Video Generation'}
              </button>
            )}
            
            {error && (
              <p className="text-red-500 text-xs font-medium text-center">{error}</p>
            )}

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
              <Info className="text-indigo-500 shrink-0 mt-0.5" size={16}/>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Note: Video generation is a compute-intensive process. Please do not refresh the page. 
                Completed videos will automatically be saved to your "My Assets" gallery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:max-w-md">
          <div className="bg-black rounded-3xl overflow-hidden aspect-[9/16] relative flex items-center justify-center border-4 border-white shadow-2xl">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center px-8 space-y-4">
                {loading ? (
                  <div className="space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Processing Frames</h4>
                      <p className="text-gray-400 text-xs">Simulating lighting, motion vectors, and temporal consistency...</p>
                    </div>
                    {/* Simulated loading steps */}
                    <div className="space-y-2">
                      <LoadingStep label="Analyzing script" done />
                      <LoadingStep label="Initializing base models" done />
                      <LoadingStep label="Generating keyframes" active />
                      <LoadingStep label="Upscaling & Final touch" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video size={40} className="text-gray-600" />
                    </div>
                    <h3 className="text-white font-bold text-xl">Cinematic Viewport</h3>
                    <p className="text-gray-500 text-sm">Input your script and hit generate to see the magic happen.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingStep = ({ label, done, active }: { label: string, done?: boolean, active?: boolean }) => (
  <div className="flex items-center gap-2 justify-center">
    <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-green-400' : active ? 'bg-indigo-400 animate-pulse' : 'bg-gray-700'}`}></div>
    <span className={`text-[10px] ${done ? 'text-green-400' : active ? 'text-indigo-400' : 'text-gray-600'}`}>
      {label} {done && "✓"}
    </span>
  </div>
);

export default VideoStudio;
