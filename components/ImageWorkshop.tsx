
import React, { useState } from 'react';
import { optimizePrompt, generateImage } from '../services/geminiService';
import { GenerationItem } from '../types';
import { Wand2, Download, Save, RefreshCw, AlertCircle, Maximize2, Sparkles, Image } from 'lucide-react';

interface Props {
  addHistory: (item: GenerationItem) => void;
  isVip: boolean;
}

const ImageWorkshop: React.FC<Props> = ({ addHistory, isVip }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "9:16">("1:1");
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!prompt.trim()) return;
    setOptimizing(true);
    try {
      const refined = await optimizePrompt(prompt);
      setPrompt(refined);
    } catch (e) {
      setError("Failed to optimize prompt. Try a simpler description.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setResult(imageUrl);
      addHistory({
        id: Date.now().toString(),
        type: 'image',
        url: imageUrl,
        prompt,
        timestamp: Date.now(),
        isFavorite: false,
        status: 'completed'
      });
    } catch (e: any) {
      setError(e.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Controls */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Creation Prompt</label>
              <button 
                onClick={handleOptimize}
                disabled={optimizing || !prompt}
                className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700 disabled:opacity-50"
              >
                {optimizing ? <RefreshCw className="animate-spin" size={12}/> : <Wand2 size={12}/>}
                Magic Optimize
              </button>
            </div>
            <textarea
              className="w-full h-32 p-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="A futuristic cybernetic garden at night with bioluminescent plants..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Aspect Ratio</label>
                <div className="flex flex-wrap gap-2">
                  {(["1:1", "4:3", "16:9", "9:16"] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                        aspectRatio === ratio ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Quality</label>
                <div className="text-xs py-1.5 px-3 bg-gray-100 rounded-lg inline-block font-medium">
                  {isVip ? '4K Ultra HD (VIP)' : 'Standard High Def'}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={20}/> : <Sparkles size={20}/>}
              {loading ? 'Generating...' : 'Generate Commercial Image'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={20}/>
              {error}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="flex-1 lg:max-w-md">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm aspect-square relative overflow-hidden group">
            {result ? (
              <>
                <img src={result} alt="Generated" className="w-full h-full object-contain rounded-2xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={result} download="generated-image.png" className="p-3 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform">
                    <Download size={24}/>
                  </a>
                  <button className="p-3 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform">
                    <Save size={24}/>
                  </button>
                </div>
                {!isVip && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                    GC STUDIO WATERMARK
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-indigo-600">Summoning pixels...</p>
                  </div>
                ) : (
                  <>
                    <Image size={64} strokeWidth={1}/>
                    <p className="text-sm">Your masterpiece will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Maximize2 size={18} className="text-indigo-600"/> Quick Templates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <TemplateItem label="Product Shot" style="Clean studio lighting, white background, commercial photography" />
          <TemplateItem label="3D Avatar" style="Pixar style 3D character, high detail, cute, soft lighting" />
          <TemplateItem label="Watercolor" style="Soft watercolor brush strokes, pastel colors, artistic" />
          <TemplateItem label="Neon Tech" style="Cyberpunk aesthetic, glowing neon lights, dark moody" />
          <TemplateItem label="E-commerce" style="Lifestyle product placement, natural sun shadows, professional" />
          <TemplateItem label="Social Media" style="Minimalist aesthetic, trendy color palette, flat design" />
        </div>
      </section>
    </div>
  );
};

const TemplateItem = ({ label, style }: { label: string, style: string }) => (
  <button 
    onClick={() => {}} // In real app, this would append to prompt
    className="p-4 bg-white border border-gray-100 rounded-2xl text-left hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
  >
    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      <Sparkles size={16}/>
    </div>
    <p className="text-xs font-bold text-gray-800">{label}</p>
    <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{style}</p>
  </button>
);

export default ImageWorkshop;
