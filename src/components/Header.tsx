/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bell, Menu, ChevronDown, Globe, LogIn } from 'lucide-react';

interface HeaderProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Header({ activeMenu, setActiveMenu }: HeaderProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const menuItems = [
    '기기예약',
    '미디어스쿨',
    '교과과정',
    '학생활동',
    '알림사항',
    '대학원',
  ];

  const handleMenuClick = (item: string) => {
    setActiveMenu(item);
    showToast(`"${item}" 메뉴로 이동하였습니다.`);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <header className="w-full text-white bg-[#0e1726] border-b border-gray-800">
      {/* Top utility row */}
      <div className="w-full border-b border-gray-800/60 bg-[#0a101d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex justify-between items-center text-xs font-medium">
          {/* Left sides */}
          <div className="flex h-full items-center">
            <a
              href="https://www.hallym.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0b4d9c] hover:bg-[#093d7c] px-4 h-full flex items-center transition duration-150 font-bold shrink-0"
              id="top-hallym"
            >
              한림대학교
            </a>
            <a
              href="https://admission.hallym.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#006bd1] hover:bg-[#005bb3] px-4 h-full flex items-center transition duration-150 font-semibold shrink-0"
              id="top-admission"
            >
              입학안내
            </a>
          </div>

          {/* Right sides */}
          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={() => showToast('로그인 버튼이 클릭되었습니다.')}
              className="hover:text-white flex items-center gap-1.5 cursor-pointer text-[11px]"
              id="top-login"
            >
              <LogIn className="w-3.5 h-3.5" />
              로그인
            </button>
            <div className="h-3 w-[1px] bg-gray-800" />
            <div className="flex items-center gap-1 hover:text-white cursor-pointer text-[11px] group">
              <Globe className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
              <span>언어선택</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="w-full bg-[#121c2c] h-[82px] flex items-center shadow-lg">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo brand */}
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => handleMenuClick('기기예약')}>
            {/* Hallym University Seagull Wing stylized logo */}
            <div className="relative flex items-center gap-3">
              <svg
                id="hallym-logo"
                className="w-[45px] h-[45px] fill-current text-white cursor-pointer"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 50 15 C 38 15 28 22 25 32 C 32 25 45 23 52 28 C 58 32 55 42 45 46 C 30 52 25 65 35 78 C 38 82 45 85 50 85 C 65 85 75 75 78 60 C 72 70 60 75 52 70 C 45 65 50 55 60 52 C 72 48 78 35 70 22 C 65 18 58 15 50 15 Z" fill="#ffffff" />
                <path d="M 50 25 C 45 25 40 28 38 32 C 40 30 45 29 48 31 C 52 33 50 37 46 39 C 40 41 38 46 42 51 C 44 53 47 54 50 54 C 56 54 60 50 61 45 C 59 48 54 50 51 48 C 48 46 50 42 54 41 C 59 39 61 35 58 30 C 56 28 53 25 50 25 Z" fill="#006bd1" />
              </svg>
              <div className="h-10 w-[1px] bg-gray-700 mx-1 hidden sm:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[15px] sm:text-[18px] tracking-wider text-white">한림대학교</span>
                </div>
                <div className="flex items-center gap-1 -mt-1">
                  <span className="font-bold text-[12px] sm:text-[13px] text-gray-300">미디어스쿨</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-normal tracking-tight font-mono ml-1">Media School</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menus list for desktop */}
          <nav className="hidden lg:flex items-center gap-[30px] xl:gap-[45px]">
            {menuItems.map((item) => {
              const isActive = activeMenu === item;
              return (
                <button
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  className={`relative text-[16px] font-bold py-2 px-1 cursor-pointer transition duration-150 tracking-wide ${
                    isActive ? 'text-white font-extrabold' : 'text-gray-300 hover:text-white'
                  }`}
                  id={`nav-${item}`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-[-10px] left-0 right-0 h-[3px] bg-[#006bd1] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotification(!showNotification);
                  if (showNotification) {
                    showToast('알림패널을 닫았습니다.');
                  } else {
                    showToast('알림 보관함이 비어있습니다.');
                  }
                }}
                className="p-1.5 hover:bg-slate-800 rounded-full transition relative text-gray-300 hover:text-white cursor-pointer"
                id="bell-icon"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#f43f5e] text-white text-[9px] font-bold rounded-full w-[17px] h-[17px] flex items-center justify-center border-2 border-[#121c2c] animate-bounce">
                  0
                </span>
              </button>

              {/* Notification Box */}
              {showNotification && (
                <div className="absolute right-0 mt-3 w-80 bg-[#162235] border border-gray-700 rounded-lg shadow-2xl py-4 px-4 z-50 animate-fadeIn text-sm text-gray-300">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006bd1]" />
                      장비지원실 알림사항
                    </span>
                    <button
                      onClick={() => setShowNotification(false)}
                      className="text-gray-400 hover:text-white text-xs cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>
                  <div className="py-4 text-center text-xs text-gray-400">
                    현재 새로운 실시간 알림이 없습니다.
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger for mobile drawer */}
            <button
              onClick={() => showToast('전체 메뉴 서랍이 클릭되었습니다 (데모).')}
              className="p-1 text-gray-300 hover:text-white cursor-pointer"
              id="hamburger-btn"
            >
              <Menu className="w-[32px] h-[32px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast Alert Box */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0d1522]/95 border border-[#006bd1]/60 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2.5 animate-bounce backdrop-blur">
          <div className="w-2 h-2 rounded-full bg-[#00b0ff] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
}
