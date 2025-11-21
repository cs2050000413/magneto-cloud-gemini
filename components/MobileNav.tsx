
import React from 'react';
import { ViewState } from '../types';

interface MobileNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewState.COLLECTION, icon: 'fa-layer-group', label: '藏品' },
    { view: ViewState.SCANNER, icon: 'fa-qrcode', label: '扫描', isMain: true },
    { view: ViewState.PROFILE, icon: 'fa-user', label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-20 flex items-center justify-around z-50 pb-2 rounded-t-2xl border-t border-gray-100">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => setView(item.view)}
          className={`flex flex-col items-center justify-center w-16 relative ${
            item.isMain ? '-mt-10' : ''
          }`}
        >
          {item.isMain ? (
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 transform transition-transform active:scale-95 text-white border-4 border-gray-50">
              <i className={`fas ${item.icon} text-2xl`}></i>
            </div>
          ) : (
            <>
                <i
                className={`fas ${item.icon} text-xl mb-1 transition-colors ${
                    currentView === item.view ? 'text-indigo-600' : 'text-gray-300'
                }`}
                ></i>
                <span
                    className={`text-[10px] font-medium transition-colors ${
                    currentView === item.view ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                >
                    {item.label}
                </span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};
