
import React, { useState } from 'react';
import { Magnet } from '../types';
import { generateMagnetStory } from '../services/geminiService';

interface MagnetDetailProps {
  magnet: Magnet;
  onBack: () => void;
}

export const MagnetDetail: React.FC<MagnetDetailProps> = ({ magnet, onBack }) => {
  const [story, setStory] = useState<string | null>(magnet.aiStory || null);
  const [loadingStory, setLoadingStory] = useState(false);

  const handleGenerateStory = async () => {
    setLoadingStory(true);
    const newStory = await generateMagnetStory(magnet.title, magnet.location);
    setStory(newStory);
    setLoadingStory(false);
  };

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* Header Image */}
      <div className="relative h-80 w-full bg-gray-200">
        <img 
          src={magnet.imageUrl} 
          alt={magnet.title} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-slate-800"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
           {magnet.series && (
               <span className="inline-block px-2 py-1 mb-2 rounded bg-indigo-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-indigo-400/30">
                   {magnet.series} 系列
               </span>
           )}
           <h2 className="text-white text-3xl font-bold mb-1">{magnet.title}</h2>
           <p className="text-white/90 text-sm flex items-center"><i className="fas fa-map-marker-alt mr-2 text-red-400"></i>{magnet.location}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-6 rounded-t-3xl -mt-6 bg-white relative z-10">
        {/* Info Cards */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           <div className="bg-slate-50 p-3 rounded-2xl min-w-[100px] border border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">设计师/品牌</p>
              <p className="text-sm font-bold text-slate-800">{magnet.artist}</p>
           </div>
           <div className={`p-3 rounded-2xl min-w-[100px] border ${magnet.rarity === 'Legendary' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
              <p className={`text-xs uppercase font-bold mb-1 ${magnet.rarity === 'Legendary' ? 'text-amber-500' : 'text-slate-400'}`}>稀有度</p>
              <p className={`text-sm font-bold ${magnet.rarity === 'Legendary' ? 'text-amber-700' : 'text-slate-800'}`}>
                  {magnet.rarity === 'Common' ? '普通' : magnet.rarity === 'Rare' ? '稀有' : '传说'}
              </p>
           </div>
           <div className="bg-slate-50 p-3 rounded-2xl min-w-[100px] border border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">获取日期</p>
              <p className="text-sm font-bold text-slate-800">2023-10-24</p>
           </div>
        </div>

        {/* Description */}
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">藏品故事</h3>
            <p className="text-slate-600 leading-relaxed text-sm text-justify">{magnet.description}</p>
        </div>

        {/* AI Story Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
           
           <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="font-bold text-lg flex items-center"><i className="fas fa-sparkles text-yellow-300 mr-2"></i>Gemini 灵感故事</h3>
              {!story && !loadingStory && (
                  <button 
                    onClick={handleGenerateStory}
                    className="bg-white/20 hover:bg-white/30 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors border border-white/30 backdrop-blur-sm"
                  >
                    生成故事
                  </button>
              )}
           </div>

           {loadingStory ? (
               <div className="flex items-center justify-center py-4">
                   <i className="fas fa-spinner fa-spin text-2xl opacity-80"></i>
               </div>
           ) : story ? (
               <p className="text-sm leading-relaxed opacity-95 font-medium tracking-wide">"{story}"</p>
           ) : (
               <p className="text-sm opacity-70">点击生成，让 AI 为这枚冰箱贴编织一段奇妙的童话...</p>
           )}
        </div>
      </div>
      
      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
};
