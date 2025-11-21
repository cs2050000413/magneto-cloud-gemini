
import React, { useState } from 'react';
import { Magnet, RedemptionRequest, DeliveryStatus } from '../types';

interface AdminDashboardProps {
  magnets: Magnet[];
  onAddMagnet: (magnet: Magnet) => void;
  onUpdateMagnet: (magnet: Magnet) => void;
  onSwitchToMobile: () => void;
  redemptionRequests: RedemptionRequest[];
  onUpdateRedemptionStatus: (id: string, status: DeliveryStatus) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    magnets, 
    onAddMagnet, 
    onUpdateMagnet,
    onSwitchToMobile,
    redemptionRequests,
    onUpdateRedemptionStatus
}) => {
  const [activeTab, setActiveTab] = useState<'magnets' | 'users' | 'logistics'>('magnets');
  const [showMagnetModal, setShowMagnetModal] = useState(false);
  const [editingMagnet, setEditingMagnet] = useState<Partial<Magnet>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showQRModal, setShowQRModal] = useState<Magnet | null>(null);

  const handleOpenAdd = () => {
      setIsEditMode(false);
      setEditingMagnet({});
      setShowMagnetModal(true);
  };

  const handleOpenEdit = (magnet: Magnet) => {
      setIsEditMode(true);
      setEditingMagnet({ ...magnet });
      setShowMagnetModal(true);
  };

  const handleOpenQR = (magnet: Magnet) => {
      setShowQRModal(magnet);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingMagnet.title && editingMagnet.artist) {
          if (isEditMode && editingMagnet.id) {
              onUpdateMagnet(editingMagnet as Magnet);
          } else {
              onAddMagnet({
                  ...editingMagnet as Magnet,
                  id: Math.random().toString(36).substr(2, 9),
                  imageUrl: editingMagnet.imageUrl || 'https://picsum.photos/400/400', // Mock image
                  rarity: editingMagnet.rarity || 'Common',
                  series: editingMagnet.series || '未分类'
              });
          }
          setShowMagnetModal(false);
          setEditingMagnet({});
      }
  };

  // Status Badge Helper
  const getStatusBadge = (status: DeliveryStatus) => {
      switch(status) {
          case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">待发货</span>;
          case 'Shipped': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">已发货</span>;
          case 'Delivered': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">已送达</span>;
          case 'Exception': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">异常</span>;
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
           <h1 className="text-xl font-bold tracking-wider flex items-center"><i className="fas fa-magnet mr-2 text-indigo-400"></i>磁力后台</h1>
           <p className="text-xs text-slate-500 mt-1">管理控制台 v1.2</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <button 
             onClick={() => setActiveTab('magnets')}
             className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'magnets' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-300'}`}
           >
             <i className="fas fa-shapes w-6"></i> 藏品管理
           </button>
           <button 
             onClick={() => setActiveTab('logistics')}
             className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'logistics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-300'}`}
           >
             <i className="fas fa-truck-fast w-6"></i> 物流管理
             {redemptionRequests.filter(r => r.status === 'Pending').length > 0 && (
                 <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                     {redemptionRequests.filter(r => r.status === 'Pending').length}
                 </span>
             )}
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-300'}`}
           >
             <i className="fas fa-users w-6"></i> 用户管理
           </button>
        </nav>
        <div className="p-4">
            <button 
              onClick={onSwitchToMobile}
              className="w-full border border-slate-700 text-slate-400 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
            >
                <i className="fas fa-mobile-alt mr-2"></i> 预览小程序
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                {activeTab === 'magnets' && <><i className="fas fa-layer-group text-indigo-500"></i> 冰箱贴库管理</>}
                {activeTab === 'logistics' && <><i className="fas fa-boxes-packing text-indigo-500"></i> 实物兑换与物流</>}
                {activeTab === 'users' && <><i className="fas fa-users-cog text-indigo-500"></i> 用户列表</>}
            </h2>
            {activeTab === 'magnets' && (
                <button 
                  onClick={handleOpenAdd}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors font-bold text-sm flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> 新增款式
                </button>
            )}
         </div>

         {/* Magnets Table */}
         {activeTab === 'magnets' && (
             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 animate-fade-up opacity-100">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">预览图</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">名称</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">系列</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">设计师</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">地点</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {magnets.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-500">#{m.id}</td>
                                <td className="px-6 py-4">
                                    <img src={m.imageUrl} alt="" className="w-10 h-10 rounded object-cover shadow-sm" />
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                    {m.title}
                                    {m.isSecret && <span className="ml-2 text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">隐藏款</span>}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{m.series || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{m.artist}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{m.location}</td>
                                <td className="px-6 py-4 text-sm space-x-3">
                                    <button onClick={() => handleOpenEdit(m)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors">
                                        <i className="fas fa-edit mr-1"></i> 编辑
                                    </button>
                                    <button onClick={() => handleOpenQR(m)} className="text-slate-600 hover:text-slate-800 font-medium text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors">
                                        <i className="fas fa-qrcode mr-1"></i> 二维码
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         )}

         {/* Logistics Table */}
         {activeTab === 'logistics' && (
             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 animate-fade-up opacity-100">
                {redemptionRequests.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <i className="fas fa-clipboard-list text-4xl mb-4 opacity-30"></i>
                        <p>暂无实物兑换申请</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">申请编号/时间</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">用户</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">兑换物品</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm w-1/3">收货地址</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">状态</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">处理</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {redemptionRequests.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-700">{req.id}</div>
                                        <div className="text-xs text-slate-400">{req.requestDate}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <div className="font-bold">{req.userName}</div>
                                        <div className="text-xs text-slate-400">ID: {req.userId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <img src={req.magnetImage} className="w-8 h-8 rounded object-cover border border-slate-200" alt="" />
                                            <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]" title={req.magnetTitle}>{req.magnetTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {req.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(req.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {req.status === 'Pending' && (
                                            <button 
                                                onClick={() => onUpdateRedemptionStatus(req.id, 'Shipped')}
                                                className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                                            >
                                                发货
                                            </button>
                                        )}
                                        {req.status === 'Shipped' && (
                                            <button 
                                                onClick={() => onUpdateRedemptionStatus(req.id, 'Delivered')}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
                                            >
                                                完成
                                            </button>
                                        )}
                                        {req.status !== 'Delivered' && req.status !== 'Exception' && (
                                            <button 
                                                onClick={() => onUpdateRedemptionStatus(req.id, 'Exception')}
                                                className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-50 transition-colors"
                                            >
                                                异常
                                            </button>
                                        )}
                                        {req.status === 'Exception' && (
                                            <button 
                                                onClick={() => onUpdateRedemptionStatus(req.id, 'Pending')}
                                                className="text-slate-400 underline text-xs hover:text-slate-600"
                                            >
                                                重置
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
         )}
      </div>

      {/* Add/Edit Modal */}
      {showMagnetModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-zoom-bounce">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                      {isEditMode ? <><i className="fas fa-edit text-indigo-500"></i> 编辑冰箱贴</> : <><i className="fas fa-plus-circle text-indigo-500"></i> 新增冰箱贴</>}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">名称</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={editingMagnet.title || ''}
                            onChange={e => setEditingMagnet({...editingMagnet, title: e.target.value})}
                            required
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">设计师/品牌</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={editingMagnet.artist || ''}
                                onChange={e => setEditingMagnet({...editingMagnet, artist: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">系列</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={editingMagnet.series || ''}
                                onChange={e => setEditingMagnet({...editingMagnet, series: e.target.value})}
                            />
                        </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">关联景点</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={editingMagnet.location || ''}
                            onChange={e => setEditingMagnet({...editingMagnet, location: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">图片 URL</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                            value={editingMagnet.imageUrl || ''}
                            onChange={e => setEditingMagnet({...editingMagnet, imageUrl: e.target.value})}
                            placeholder="https://..."
                          />
                      </div>
                      <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="isSecret"
                            checked={editingMagnet.isSecret || false}
                            onChange={e => setEditingMagnet({...editingMagnet, isSecret: e.target.checked})}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="isSecret" className="text-sm text-slate-700 font-medium">设为隐藏款 (Secret)</label>
                      </div>
                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                          <button 
                            type="button"
                            onClick={() => setShowMagnetModal(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-bold"
                          >
                              取消
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-bold shadow-lg shadow-indigo-200"
                          >
                              {isEditMode ? '保存修改' : '立即创建'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setShowQRModal(null)}>
              <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-zoom-bounce" onClick={e => e.stopPropagation()}>
                  <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-800">{showQRModal.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{showQRModal.location}</p>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-2xl inline-block shadow-inner mb-6 relative group">
                      {/* Use a placeholder div that looks like a QR code for demo, or a real API */}
                      <div className="bg-white p-2 rounded-lg">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({id: showQRModal.id, title: showQRModal.title}))}`} 
                            alt="QR Code" 
                            className="w-48 h-48"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-2xl">
                          <p className="text-white font-bold text-sm">ID: {showQRModal.id}</p>
                      </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-6 max-w-[200px] mx-auto">
                      扫描此二维码可在小程序中直接解锁该藏品
                  </p>

                  <button 
                    onClick={() => setShowQRModal(null)}
                    className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                      关闭
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
