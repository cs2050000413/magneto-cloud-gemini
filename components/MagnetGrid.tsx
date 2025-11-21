
import React, { useMemo, useState } from 'react';
import { Magnet } from '../types';

interface MagnetGridProps {
  magnets: Magnet[];
  unlockedIds: string[];
  physicalRedeemedIds: string[];
  onMagnetClick: (magnet: Magnet) => void;
  onRedeem: (magnet: Magnet) => void;
  onPhysicalRedeem: (magnet: Magnet) => void;
}

export const MagnetGrid: React.FC<MagnetGridProps> = ({ 
    magnets, 
    unlockedIds, 
    physicalRedeemedIds,
    onMagnetClick, 
    onRedeem,
    onPhysicalRedeem 
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Extract unique series
  const allSeries = useMemo(() => {
    const seriesSet = new Set(magnets.map(m => m.series || '其他系列'));
    return ['All', ...Array.from(seriesSet)];
  }, [magnets]);

  // Group magnets by series
  const magnetsBySeries = useMemo(() => {
    const groups: Record<string, Magnet[]> = {};
    magnets.forEach(m => {
      const series = m.series || '其他系列';
      
      // Apply Filter
      if (activeFilter !== 'All' && series !== activeFilter) return;

      if (!groups[series]) groups[series] = [];
      groups[series].push(m);
    });
    return groups;
  }, [magnets, activeFilter]);

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* Header with Filter Toggle */}
      <div className="flex justify-between items-center sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-gray-100/50 transition-all">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">我的藏品</h2>
           <p className="text-xs text-slate-500">
             {activeFilter === 'All' ? '全部系列' : activeFilter}
           </p>
        </div>
        <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                showFilterMenu || activeFilter !== 'All' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 rotate-0' 
                : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
            }`}
        >
            <i className={`fas ${activeFilter !== 'All' ? 'fa-filter' : 'fa-sliders-h'}`}></i>
        </button>
      </div>

      {/* Collapsible Filter Menu */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilterMenu ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-wrap gap-2 pt-1 pb-2">
              {allSeries.map(series => (
                  <button
                    key={series}
                    onClick={() => {
                        setActiveFilter(series);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
                        activeFilter === series 
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                      {series === 'All' ? '全部' : series}
                  </button>
              ))}
          </div>
      </div>

      {/* Empty State */}
      {Object.keys(magnetsBySeries).length === 0 && (
          <div className="text-center py-12 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-search text-2xl opacity-50"></i>
              </div>
              <p>未找到相关系列的藏品</p>
              <button 
                onClick={() => setActiveFilter('All')} 
                className="mt-4 text-indigo-600 font-bold text-sm"
              >
                查看全部
              </button>
          </div>
      )}

      {Object.entries(magnetsBySeries).map(([seriesName, seriesMagnets]) => {
        // Separate regular magnets from secret rewards
        const regularMagnets = seriesMagnets.filter(m => !m.isSecret);
        const secretRewards = seriesMagnets.filter(m => m.isSecret);
        
        const unlockedInSeries = regularMagnets.filter(m => unlockedIds.includes(m.id)).length;
        const totalRegular = regularMagnets.length;
        const progress = totalRegular > 0 ? Math.round((unlockedInSeries / totalRegular) * 100) : 0;
        const isComplete = unlockedInSeries === totalRegular && totalRegular > 0;

        return (
          <div key={seriesName} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-fade-up">
             <div className="flex justify-between items-end mb-2">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800">{seriesName}</h3>
                    <p className="text-xs text-slate-400">系列收集进度</p>
                 </div>
                 <span className="text-lg font-bold text-indigo-600">{unlockedInSeries}/{totalRegular}</span>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-6 border border-gray-200">
                <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-1000 relative" 
                    style={{ width: `${progress}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-2 gap-3 mb-6">
                {regularMagnets.map((magnet) => {
                    const isUnlocked = unlockedIds.includes(magnet.id);
                    return (
                        <button
                        key={magnet.id}
                        onClick={() => isUnlocked && onMagnetClick(magnet)}
                        className={`relative aspect-square rounded-xl p-2 flex flex-col items-center justify-between transition-all duration-300 ${
                            isUnlocked 
                            ? 'bg-slate-50 shadow-sm hover:shadow-md border border-slate-100' 
                            : 'bg-slate-100 border-2 border-dashed border-slate-200'
                        }`}
                        >
                        {isUnlocked ? (
                            <>
                                <div className="w-full h-3/4 relative overflow-hidden rounded-lg">
                                    <img 
                                        src={magnet.imageUrl} 
                                        alt={magnet.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    {magnet.rarity !== 'Common' && (
                                        <div className={`absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded font-bold text-white ${magnet.rarity === 'Rare' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                                            {magnet.rarity === 'Rare' ? '稀有' : '传说'}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full text-left mt-2 px-1">
                                    <h3 className="text-xs font-bold text-slate-700 truncate">{magnet.title}</h3>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <i className="fas fa-lock text-2xl mb-2"></i>
                                <span className="text-xs">未获得</span>
                            </div>
                        )}
                        </button>
                    );
                })}
             </div>

             {/* Redemption Area */}
             {secretRewards.map(reward => {
                 const isDigitalRedeemed = unlockedIds.includes(reward.id);
                 const isPhysicalRedeemed = physicalRedeemedIds.includes(reward.id);
                 
                 if (!isComplete) {
                     return (
                        <div key={reward.id} className="w-full p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center gap-4 opacity-75">
                             <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                 <i className="fas fa-question text-gray-400 text-xl"></i>
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">隐藏奖励</p>
                                 <p className="font-bold text-gray-600 text-sm">集齐{seriesName}即可解锁</p>
                             </div>
                        </div>
                     );
                 }

                 return (
                     <div key={reward.id} className="space-y-2">
                         {!isDigitalRedeemed ? (
                             <button 
                                onClick={() => onRedeem(reward)}
                                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
                             >
                                 <i className="fas fa-gift text-xl animate-bounce"></i>
                                 <span className="font-bold text-lg">兑换限定版冰箱贴！</span>
                             </button>
                         ) : (
                             <div 
                                className="w-full p-1 bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 rounded-xl relative overflow-hidden group"
                             >
                                 <div onClick={() => onMagnetClick(reward)} className="cursor-pointer">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400 rotate-45 transform translate-x-8 -translate-y-8"></div>
                                    <div className="absolute top-2 right-2 text-white text-xs font-bold"><i className="fas fa-star"></i></div>
                                    
                                    <div className="flex items-center gap-4 p-3">
                                        <img src={reward.imageUrl} className="w-16 h-16 rounded-lg object-cover border-2 border-amber-200 shadow-sm" alt="Reward" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">限定版已拥有</p>
                                            <p className="font-bold text-slate-800">{reward.title}</p>
                                        </div>
                                        <i className="fas fa-chevron-right text-amber-400 group-hover:translate-x-1 transition-transform px-2"></i>
                                    </div>
                                 </div>

                                 {/* Physical Redemption Button/Status */}
                                 <div className="border-t border-amber-200/50 p-2 bg-amber-50/50 flex justify-between items-center">
                                     {isPhysicalRedeemed ? (
                                         <span className="text-xs font-bold text-green-600 flex items-center gap-1 ml-2">
                                             <i className="fas fa-shipping-fast"></i> 实物奖励已发货
                                         </span>
                                     ) : (
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-[10px] text-amber-700/60 ml-2">还可以领取实物周边哦!</span>
                                            <button 
                                                onClick={() => onPhysicalRedeem(reward)}
                                                className="bg-white text-amber-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-amber-100 hover:bg-amber-50 active:scale-95 transition-all"
                                            >
                                                领取实物 <span className="text-[9px] bg-amber-200 px-1 rounded text-amber-800">付运费</span>
                                            </button>
                                        </div>
                                     )}
                                 </div>
                             </div>
                         )}
                     </div>
                 );
             })}
          </div>
        );
      })}

    </div>
  );
};
