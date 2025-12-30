
import React, { useState, useEffect } from 'react';
import { AppTab, GenerationItem, UserProfile } from './types';
import ImageWorkshop from './components/ImageWorkshop';
import VideoStudio from './components/VideoStudio';
import Gallery from './components/Gallery';
import PlanningTab from './components/PlanningTab';
import { Image, Video, Grid, User, Layout, Crown, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.IMAGE_WORKSHOP);
  const [history, setHistory] = useState<GenerationItem[]>([]);
  const [user, setUser] = useState<UserProfile>({
    name: 'Creative Pro',
    isVip: false,
    credits: 20,
    avatar: 'https://picsum.photos/seed/user/100/100'
  });

  useEffect(() => {
    const saved = localStorage.getItem('creative_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('creative_history', JSON.stringify(history));
  }, [history]);

  const addHistory = (item: GenerationItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const toggleVip = () => setUser(prev => ({ ...prev, isVip: !prev.isVip }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-indigo-600" />
            GC Studio
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem active={activeTab === AppTab.PLANNING} onClick={() => setActiveTab(AppTab.PLANNING)} icon={<Layout size={20}/>} label="Product Overview" />
          <div className="my-4 border-t border-gray-100"></div>
          <NavItem active={activeTab === AppTab.IMAGE_WORKSHOP} onClick={() => setActiveTab(AppTab.IMAGE_WORKSHOP)} icon={<Image size={20}/>} label="Image Workshop" />
          <NavItem active={activeTab === AppTab.VIDEO_STUDIO} onClick={() => setActiveTab(AppTab.VIDEO_STUDIO)} icon={<Video size={20}/>} label="Video Studio" />
          <NavItem active={activeTab === AppTab.GALLERY} onClick={() => setActiveTab(AppTab.GALLERY)} icon={<Grid size={20}/>} label="My Assets" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Credits</span>
              <span className="text-indigo-600 font-bold">{user.credits}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{width: '40%'}}></div>
            </div>
            <button 
              onClick={toggleVip}
              className="w-full mt-3 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1"
            >
              <Crown size={14}/> {user.isVip ? 'VIP Member' : 'Upgrade to Pro'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar"/>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">Starter Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50">
        <MobileNavItem active={activeTab === AppTab.PLANNING} onClick={() => setActiveTab(AppTab.PLANNING)} icon={<Layout size={24}/>} />
        <MobileNavItem active={activeTab === AppTab.IMAGE_WORKSHOP} onClick={() => setActiveTab(AppTab.IMAGE_WORKSHOP)} icon={<Image size={24}/>} />
        <MobileNavItem active={activeTab === AppTab.VIDEO_STUDIO} onClick={() => setActiveTab(AppTab.VIDEO_STUDIO)} icon={<Video size={24}/>} />
        <MobileNavItem active={activeTab === AppTab.GALLERY} onClick={() => setActiveTab(AppTab.GALLERY)} icon={<Grid size={24}/>} />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {activeTab === AppTab.PLANNING && <PlanningTab />}
        {activeTab === AppTab.IMAGE_WORKSHOP && <ImageWorkshop addHistory={addHistory} isVip={user.isVip} />}
        {activeTab === AppTab.VIDEO_STUDIO && <VideoStudio addHistory={addHistory} isVip={user.isVip} />}
        {activeTab === AppTab.GALLERY && <Gallery history={history} />}
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavItem = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl transition-all ${active ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
  >
    {icon}
  </button>
);

export default App;
