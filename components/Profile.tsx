
import React, { useState } from 'react';
import { Magnet, Address, ViewState } from '../types';
import { MobileNav } from './MobileNav';

interface ProfileProps {
  address: Address | null;
  onSaveAddress: (address: Address) => void;
  magnets: Magnet[];
  unlockedIds: string[];
  setView: (view: ViewState) => void;
  currentView: ViewState;
}

export const Profile: React.FC<ProfileProps> = ({ 
  address, 
  onSaveAddress, 
  magnets, 
  unlockedIds, 
  setView,
  currentView
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState<Address>(
    address || { name: '', phone: '', region: '', detail: '' }
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAddress(formData);
    setIsEditingAddress(false);
  };

  const collectionRate = magnets.length > 0 ? Math.round((unlockedIds.length / magnets.length) * 100) : 0;

  return (
    <div className="h-full flex flex-col pb-20 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white pt-10 pb-20 px-6 rounded-b-[3rem] shadow-xl mb-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-10 -mr-10 blur-3xl"></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-20 h-20 rounded-full border-4 border-white/30 shadow-md overflow-hidden">
                     <img src="https://picsum.photos/id/64/200/200" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">旅行者小王</h2>
                    <div className="flex items-center gap-2 text-indigo-100 text-sm bg-indigo-800/30 px-2 py-1 rounded-lg backdrop-blur-sm w-fit mt-1">
                        <i className="fas fa-crown text-yellow-400"></i>
                        <span>Lv.5 收藏家</span>
                    </div>
                </div>
             </div>
        </div>

        <div className="px-6 -mt-16 relative z-10 space-y-6 flex-1 overflow-y-auto no-scrollbar">
            
            {/* Stats Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between text-sm text-slate-600 mb-2 font-bold">
                    <span>当前收集进度</span>
                    <span className="text-indigo-600">{collectionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{width: `${collectionRate}%`}}></div>
                </div>
                <div className="flex justify-between mt-4 text-center divide-x divide-gray-100">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400">已获得</p>
                        <p className="text-xl font-bold text-slate-800">{unlockedIds.length}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400">总藏品</p>
                        <p className="text-xl font-bold text-slate-800">{magnets.length}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400">限定版</p>
                        <p className="text-xl font-bold text-amber-500">
                            {magnets.filter(m => m.isSecret && unlockedIds.includes(m.id)).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-indigo-500"></i> 收货地址
                    </h3>
                    {!isEditingAddress && address && (
                        <button onClick={() => setIsEditingAddress(true)} className="text-xs text-indigo-600 font-bold">
                            编辑
                        </button>
                    )}
                </div>
                
                <div className="p-5">
                    {!isEditingAddress ? (
                        address ? (
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-slate-800">{address.name}</span>
                                    <span className="text-slate-600">{address.phone}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {address.region} {address.detail}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-slate-400 mb-3">暂无收货地址，兑换实物前请先设置</p>
                                <button 
                                    onClick={() => setIsEditingAddress(true)}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                                >
                                    <i className="fas fa-plus mr-1"></i> 添加地址
                                </button>
                            </div>
                        )
                    ) : (
                        <form onSubmit={handleSave} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">联系人</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="姓名"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">电话</label>
                                    <input 
                                        required
                                        type="tel" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        placeholder="手机号"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">所在地区</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.region}
                                    onChange={e => setFormData({...formData, region: e.target.value})}
                                    placeholder="省 / 市 / 区"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">详细地址</label>
                                <textarea 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
                                    value={formData.detail}
                                    onChange={e => setFormData({...formData, detail: e.target.value})}
                                    placeholder="街道、楼牌号等"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditingAddress(false)}
                                    className="flex-1 py-2 border border-gray-200 text-slate-600 rounded-lg text-sm font-bold"
                                >
                                    取消
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-200"
                                >
                                    保存
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
        
        <MobileNav currentView={currentView} setView={setView} />
    </div>
  );
};
