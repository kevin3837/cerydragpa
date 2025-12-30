
import React, { useState } from 'react';
import { GenerationItem } from '../types';
import { Search, Filter, Trash2, Heart, ExternalLink, Download, Grid } from 'lucide-react';

interface Props {
  history: GenerationItem[];
}

const Gallery: React.FC<Props> = ({ history }) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Creative Library</h2>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search by prompt..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Assets</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Generated" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted loop onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                )}
                <div className="absolute top-2 right-2 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <button className="p-2 bg-white/90 backdrop-blur rounded-full text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-colors">
                    <Heart size={16}/>
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur rounded-full text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </div>
                {item.type === 'video' && (
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                    0:06
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 italic">"{item.prompt}"</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                    <Download size={14}/> Save
                  </button>
                  <button className="py-2 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                    <ExternalLink size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400 space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Grid size={48} strokeWidth={1} className="opacity-50"/>
          <p className="text-lg font-medium">No creations yet...</p>
          <p className="text-sm">Start by heading to the Image Workshop or Video Studio!</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
