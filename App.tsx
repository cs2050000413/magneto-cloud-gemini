
import React, { useState, useEffect } from 'react';
import { INITIAL_MAGNETS } from './services/magnetData';
import { Magnet, ViewState, Address, RedemptionRequest, DeliveryStatus } from './types';
import { MobileNav } from './components/MobileNav';
import { MagnetGrid } from './components/MagnetGrid';
import { CameraScanner } from './components/CameraScanner';
import { MagnetDetail } from './components/MagnetDetail';
import { AdminDashboard } from './components/AdminDashboard';
import { Profile } from './components/Profile';
import { PhysicalRedeemModal } from './components/PhysicalRedeemModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.COLLECTION);
  const [magnets, setMagnets] = useState<Magnet[]>(INITIAL_MAGNETS);
  // Start with one magnet unlocked for demo
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['hz-001']);
  const [selectedMagnet, setSelectedMagnet] = useState<Magnet | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState<Magnet | null>(null);
  
  // Physical Redemption State
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const [physicalRedeemedIds, setPhysicalRedeemedIds] = useState<string[]>([]);
  const [showPhysicalRedeemModal, setShowPhysicalRedeemModal] = useState<Magnet | null>(null);
  
  // Admin Logistics State
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([
      // Mock initial data for demo
      {
          id: 'req-001',
          userId: 'user-001',
          userName: '张三',
          magnetId: 'hz-reward-001',
          magnetTitle: '西湖金龙·限定版',
          magnetImage: 'https://images.unsplash.com/photo-1583244532610-2a234e7c3eca?q=80&w=200&auto=format&fit=crop',
          address: '浙江省杭州市西湖区文三路 123 号',
          status: 'Pending',
          requestDate: '2023-10-25 14:30'
      }
  ]);

  // Helper to detect if screen is desktop-like width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUnlock = (magnet: Magnet) => {
    if (!unlockedIds.includes(magnet.id)) {
      setUnlockedIds(prev => [...prev, magnet.id]);
      setShowUnlockModal(magnet);
    } else {
      // Already unlocked, just show it
      setSelectedMagnet(magnet);
      setView(ViewState.DETAIL);
    }
  };

  const handleRedeem = (magnet: Magnet) => {
      if (!unlockedIds.includes(magnet.id)) {
          setUnlockedIds(prev => [...prev, magnet.id]);
          setShowUnlockModal(magnet);
      }
  };
  
  const handlePhysicalRedeemRequest = (magnet: Magnet) => {
      setShowPhysicalRedeemModal(magnet);
  };

  const confirmPhysicalRedemption = () => {
      if (showPhysicalRedeemModal && userAddress) {
          // 1. Mark as redeemed locally for user
          setPhysicalRedeemedIds(prev => [...prev, showPhysicalRedeemModal.id]);
          
          // 2. Create a redemption request for admin
          const newRequest: RedemptionRequest = {
              id: `req-${Date.now()}`,
              userId: 'current-user', // In real app this comes from auth
              userName: userAddress.name,
              magnetId: showPhysicalRedeemModal.id,
              magnetTitle: showPhysicalRedeemModal.title,
              magnetImage: showPhysicalRedeemModal.imageUrl,
              address: `${userAddress.region} ${userAddress.detail} (${userAddress.phone})`,
              status: 'Pending',
              requestDate: new Date().toLocaleString('zh-CN')
          };
          setRedemptionRequests(prev => [newRequest, ...prev]);
          
          setShowPhysicalRedeemModal(null);
      }
  };

  const handleMagnetClick = (magnet: Magnet) => {
    setSelectedMagnet(magnet);
    setView(ViewState.DETAIL);
  };

  const handleAddMagnet = (magnet: Magnet) => {
      setMagnets(prev => [...prev, magnet]);
  };

  const handleUpdateMagnet = (updatedMagnet: Magnet) => {
      setMagnets(prev => prev.map(m => m.id === updatedMagnet.id ? updatedMagnet : m));
  };

  const handleUpdateRedemptionStatus = (id: string, status: DeliveryStatus) => {
      setRedemptionRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status } : req
      ));
  };

  // Desktop Wrapper for Mobile App Simulation
  if (view !== ViewState.ADMIN && isDesktop) {
      return (
          <div className="min-h-screen bg-slate-200 flex items-center justify-center p-8">
              <div className="relative w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden ring-8 ring-slate-900/20">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-40 bg-slate-900 rounded-b-xl z-50"></div>
                  <div className="h-full overflow-y-auto no-scrollbar relative bg-gray-50">
                      <AppContent 
                        view={view} 
                        setView={setView} 
                        magnets={magnets}
                        unlockedIds={unlockedIds}
                        physicalRedeemedIds={physicalRedeemedIds}
                        handleUnlock={handleUnlock}
                        handleRedeem={handleRedeem}
                        handlePhysicalRedeemRequest={handlePhysicalRedeemRequest}
                        handleMagnetClick={handleMagnetClick}
                        selectedMagnet={selectedMagnet}
                        setSelectedMagnet={setSelectedMagnet}
                        userAddress={userAddress}
                        setUserAddress={setUserAddress}
                      />
                  </div>
                  {/* Overlay Modal for Unlock */}
                  {showUnlockModal && (
                    <UnlockModal 
                        magnet={showUnlockModal} 
                        onClose={() => {
                            setShowUnlockModal(null);
                            setSelectedMagnet(showUnlockModal);
                            setView(ViewState.DETAIL);
                        }} 
                    />
                  )}
                  {/* Overlay Modal for Physical Redeem */}
                  {showPhysicalRedeemModal && (
                      <PhysicalRedeemModal 
                          magnet={showPhysicalRedeemModal}
                          address={userAddress}
                          onConfirm={confirmPhysicalRedemption}
                          onCancel={() => setShowPhysicalRedeemModal(null)}
                          onGoToProfile={() => {
                              setShowPhysicalRedeemModal(null);
                              setView(ViewState.PROFILE);
                          }}
                      />
                  )}
              </div>
              
              {/* Switch to Admin Button */}
              <div className="absolute top-8 right-8">
                  <button 
                    onClick={() => setView(ViewState.ADMIN)}
                    className="bg-white text-slate-900 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-slate-100 transition-colors"
                  >
                      进入后台管理系统 <i className="fas fa-arrow-right ml-2"></i>
                  </button>
              </div>
          </div>
      );
  }

  if (view === ViewState.ADMIN) {
      return (
        <AdminDashboard 
            magnets={magnets} 
            onAddMagnet={handleAddMagnet} 
            onUpdateMagnet={handleUpdateMagnet}
            onSwitchToMobile={() => setView(ViewState.COLLECTION)}
            redemptionRequests={redemptionRequests}
            onUpdateRedemptionStatus={handleUpdateRedemptionStatus}
        />
      );
  }

  // Mobile View (Direct)
  return (
    <div className="min-h-screen bg-gray-50 relative max-w-md mx-auto shadow-lg overflow-hidden">
        <AppContent 
            view={view} 
            setView={setView} 
            magnets={magnets}
            unlockedIds={unlockedIds}
            physicalRedeemedIds={physicalRedeemedIds}
            handleUnlock={handleUnlock}
            handleRedeem={handleRedeem}
            handlePhysicalRedeemRequest={handlePhysicalRedeemRequest}
            handleMagnetClick={handleMagnetClick}
            selectedMagnet={selectedMagnet}
            setSelectedMagnet={setSelectedMagnet}
            userAddress={userAddress}
            setUserAddress={setUserAddress}
        />
        {showUnlockModal && (
            <UnlockModal 
                magnet={showUnlockModal} 
                onClose={() => {
                    setShowUnlockModal(null);
                    setSelectedMagnet(showUnlockModal);
                    setView(ViewState.DETAIL);
                }} 
            />
        )}
        {showPhysicalRedeemModal && (
            <PhysicalRedeemModal 
                magnet={showPhysicalRedeemModal}
                address={userAddress}
                onConfirm={confirmPhysicalRedemption}
                onCancel={() => setShowPhysicalRedeemModal(null)}
                onGoToProfile={() => {
                    setShowPhysicalRedeemModal(null);
                    setView(ViewState.PROFILE);
                }}
            />
        )}
    </div>
  );
};

// Sub-components to clean up the render method
const AppContent: React.FC<any> = ({ 
    view, setView, magnets, unlockedIds, physicalRedeemedIds, handleUnlock, handleRedeem, handlePhysicalRedeemRequest, handleMagnetClick, selectedMagnet, userAddress, setUserAddress 
}) => {
    switch (view) {
        case ViewState.COLLECTION:
            return (
                <div className="pb-20 pt-6">
                    <header className="px-6 mb-2">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">Magneto 磁力</h1>
                    </header>
                    <MagnetGrid 
                        magnets={magnets} 
                        unlockedIds={unlockedIds}
                        physicalRedeemedIds={physicalRedeemedIds} 
                        onMagnetClick={handleMagnetClick} 
                        onRedeem={handleRedeem}
                        onPhysicalRedeem={handlePhysicalRedeemRequest}
                    />
                    <MobileNav currentView={view} setView={setView} />
                </div>
            );
        case ViewState.SCANNER:
            return (
                <div className="h-full pb-20">
                    <CameraScanner allMagnets={magnets} onUnlock={handleUnlock} />
                    <MobileNav currentView={view} setView={setView} />
                </div>
            );
        case ViewState.DETAIL:
            if (!selectedMagnet) return null;
            return (
                <MagnetDetail 
                    magnet={selectedMagnet} 
                    onBack={() => setView(ViewState.COLLECTION)} 
                />
            );
        case ViewState.PROFILE:
            return (
                <Profile 
                    address={userAddress}
                    onSaveAddress={setUserAddress}
                    magnets={magnets}
                    unlockedIds={unlockedIds}
                    setView={setView}
                    currentView={view}
                />
            );
        default:
            return <div>Unknown View</div>;
    }
};

const UnlockModal: React.FC<{ magnet: Magnet; onClose: () => void }> = ({ magnet, onClose }) => {
    
    useEffect(() => {
        // Automatically close and navigate after animation (3.5 seconds)
        const timer = setTimeout(() => {
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isLegendary = magnet.rarity === 'Legendary';

    return (
        <div 
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden"
            onClick={onClose} // Allow clicking to skip
        >
            {/* Rotating Rays Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                 <div className={`w-[200%] h-[100%] aspect-square bg-[conic-gradient(var(--tw-gradient-stops))] ${
                     isLegendary 
                     ? 'from-amber-300/0 via-amber-500/30 to-amber-300/0' 
                     : 'from-indigo-300/0 via-purple-500/30 to-indigo-300/0'
                 } animate-spin-slow`}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center w-full px-8">
                
                {/* Animated Text */}
                <div className="mb-8 animate-fade-up">
                     <h2 className={`text-3xl font-black tracking-widest mb-2 uppercase drop-shadow-lg ${
                         isLegendary ? 'text-amber-400' : 'text-white'
                     }`}>
                        {isLegendary ? '传说降临' : '解锁成功'}
                     </h2>
                     <p className="text-white/80 font-bold text-lg">{magnet.title}</p>
                </div>

                {/* Bouncing Card Image */}
                <div className="animate-zoom-bounce relative group">
                    {/* Glow behind card */}
                    <div className={`absolute -inset-4 rounded-full blur-2xl opacity-70 ${
                        isLegendary ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}></div>
                    
                    {/* The Card */}
                    <div className={`relative w-64 h-64 rounded-3xl p-2 bg-white/10 backdrop-blur-md border-2 shadow-2xl transform transition-transform ${
                        isLegendary ? 'border-amber-300/50' : 'border-white/30'
                    }`}>
                        <img 
                            src={magnet.imageUrl} 
                            alt="Unlocked" 
                            className="w-full h-full object-cover rounded-2xl shadow-inner" 
                        />
                        {/* Sheen effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none"></div>
                    </div>
                </div>

                {/* Instructions */}
                <p className="mt-12 text-white/40 text-sm animate-pulse font-medium">
                    即将前往详情页...
                </p>
            </div>
        </div>
    );
};

export default App;
