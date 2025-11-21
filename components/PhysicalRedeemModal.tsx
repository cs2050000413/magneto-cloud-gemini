
import React, { useState } from 'react';
import { Magnet, Address } from '../types';

interface PhysicalRedeemModalProps {
  magnet: Magnet;
  address: Address | null;
  onConfirm: () => void;
  onCancel: () => void;
  onGoToProfile: () => void;
}

export const PhysicalRedeemModal: React.FC<PhysicalRedeemModalProps> = ({
  magnet,
  address,
  onConfirm,
  onCancel,
  onGoToProfile
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const shippingFee = 12.00;

  const handlePayAndRedeem = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-zoom-bounce">
        
        {/* Header Image */}
        <div className="relative h-32 bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl"></div>
             <img src={magnet.imageUrl} alt={magnet.title} className="w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-white transform rotate-3" />
             <div className="absolute bottom-2 right-3 text-[10px] font-bold text-amber-600 bg-white/60 px-2 py-1 rounded-full backdrop-blur">
                实物兑换
             </div>
        </div>

        <div className="p-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{magnet.title}</h3>
                <p className="text-sm text-slate-500">纯金浮雕工艺 · 限量纪念版</p>
            </div>

            <div className="space-y-4 mb-6">
                {/* Address Preview */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-map-marker-alt text-indigo-500 text-sm"></i>
                        </div>
                        {address ? (
                            <div className="flex-1 text-sm">
                                <div className="font-bold text-slate-800 mb-1">
                                    {address.name} <span className="text-slate-500 font-normal ml-1">{address.phone}</span>
                                </div>
                                <p className="text-slate-500 leading-snug text-xs">{address.region} {address.detail}</p>
                            </div>
                        ) : (
                            <div className="flex-1 py-1">
                                <p className="text-sm font-bold text-slate-400">暂无收货地址</p>
                                <button onClick={onGoToProfile} className="text-indigo-600 text-xs font-bold mt-1">
                                    前往设置 <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="flex justify-between items-center px-2">
                    <span className="text-slate-600 text-sm">商品价格</span>
                    <span className="font-bold text-slate-800">¥0.00 <span className="text-xs bg-amber-100 text-amber-600 px-1 py-0.5 rounded ml-1">赠品</span></span>
                </div>
                <div className="flex justify-between items-center px-2">
                    <span className="text-slate-600 text-sm">运费 (快递)</span>
                    <span className="font-bold text-slate-800">¥{shippingFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center px-2">
                    <span className="font-bold text-slate-800">合计应付</span>
                    <span className="text-xl font-black text-indigo-600">¥{shippingFee.toFixed(2)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button 
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-slate-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                    取消
                </button>
                <button 
                    onClick={handlePayAndRedeem}
                    disabled={!address || isProcessing}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                        !address || isProcessing 
                        ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200 active:scale-95'
                    }`}
                >
                    {isProcessing ? (
                        <><i className="fas fa-spinner fa-spin"></i> 处理中...</>
                    ) : (
                        <><i className="fas fa-check-circle"></i> 支付运费并兑换</>
                    )}
                </button>
            </div>
            {!address && (
                 <p className="text-center text-xs text-red-400 mt-3">请先完善收货地址</p>
            )}
        </div>
      </div>
    </div>
  );
};
