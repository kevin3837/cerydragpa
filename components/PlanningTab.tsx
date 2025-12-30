
import React from 'react';
import { Server, ShieldCheck, Zap, Users, Globe, Coins } from 'lucide-react';

const PlanningTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Product Roadmap & Architecture</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Built for the next generation of digital creators using Gemini Multimodal APIs.
        </p>
      </header>

      {/* Architecture Diagram Placeholder */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 overflow-hidden">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Server className="text-indigo-600"/> ① Product Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <ArchNode title="Frontend (React)" desc="Responsive UI, Canvas editing, History management, Real-time state." color="indigo" />
          <ArchNode title="AI Controller" desc="Prompt optimization (Gemini 3), Safety filtering, Format conversion." color="purple" />
          <ArchNode title="Model Engine" desc="Gemini 2.5 Flash (Images), Veo 3.1 (Videos), Gemini 3 (Reasoning)." color="pink" />
          
          <div className="hidden md:block absolute top-1/2 left-[30%] w-[10%] border-t-2 border-dashed border-gray-300"></div>
          <div className="hidden md:block absolute top-1/2 left-[63%] w-[10%] border-t-2 border-dashed border-gray-300"></div>
        </div>
      </section>

      {/* Core Functions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="text-amber-500"/> ② Core Function Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FunctionCard 
            title="Image Workshop" 
            list={["Text-to-Image with styles", "Image-to-Image transfer", "E-commerce templates", "HD Upscaling"]} 
          />
          <FunctionCard 
            title="Video Studio" 
            list={["Veo Text-to-Video", "Long-form extensions", "Social media aspect ratios", "AI Background Music"]} 
          />
          <FunctionCard 
            title="Smart Prompting" 
            list={["Fuzzy input optimization", "Multi-language support", "Detail enrichment", "Compliance pre-check"]} 
          />
        </div>
      </section>

      {/* Technical Keys */}
      <section className="bg-gray-900 text-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
          <Globe className="text-indigo-400"/> ③ Technical Implementation Keys
        </h2>
        <div className="space-y-4">
          <TechKey label="Latency Management" value="Implementing optimistic UI and polling for long-running Veo jobs." />
          <TechKey label="Cross-Device" value="Tailwind-first mobile design ensuring 1:1 parity with desktop features." />
          <TechKey label="API Orchestration" value="Using Gemini 3 Flash for cheap, fast prompt expansion to save model tokens." />
        </div>
      </section>

      {/* Compliance & Monetization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-red-50 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
            <ShieldCheck /> ④ Compliance & Risks
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>• Built-in Gemini safety settings to block harmful content.</li>
            <li>• Automated invisible watermarking for tracking.</li>
            <li>• Copyright flagging system for sensitive outputs.</li>
          </ul>
        </div>
        <div className="bg-white rounded-3xl border border-green-50 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-600">
            <Coins /> ⑤ Business Strategy
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>• <b>Free Tier:</b> 10 images/day, SD resolution, Watermark.</li>
            <li>• <b>Pro Tier:</b> Unlimited images, Veo access, 4K, No watermark.</li>
            <li>• <b>Enterprise:</b> API integration & custom model fine-tuning.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ArchNode = ({ title, desc, color }: { title: string, desc: string, color: string }) => (
  <div className={`p-6 rounded-2xl border-2 border-${color}-100 bg-${color}-50 flex flex-col items-center text-center`}>
    <h3 className={`font-bold text-${color}-700 text-lg mb-2`}>{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

const FunctionCard = ({ title, list }: { title: string, list: string[] }) => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">{title}</h3>
    <ul className="space-y-2">
      {list.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
          <span className="text-indigo-500 font-bold mt-1">✓</span> {item}
        </li>
      ))}
    </ul>
  </div>
);

const TechKey = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-xl bg-gray-800/50">
    <span className="font-bold text-indigo-300 min-w-[150px]">{label}:</span>
    <span className="text-gray-300">{value}</span>
  </div>
);

export default PlanningTab;
