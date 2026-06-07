/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff, RefreshCw, HelpCircle } from 'lucide-react';

interface HallymLoginProps {
  onLoginSuccess: (user: { name: string; studentId: string; phone: string; department: string }) => void;
  onClose?: () => void;
}

export default function HallymLogin({ onLoginSuccess, onClose }: HallymLoginProps) {
  const [userId, setUserId] = useState(''); // 빈 값으로 시작
  const [password, setPassword] = useState(''); // 빈 값으로 시작
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMessage('ID(학번/교번)를 입력해 주세요.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    // 로그인 데모 데이터
    // 학번에 따라 이름 매칭하거나, 입력값 그대로 연계
    let name = '김지윤';
    let dept = '미디어스쿨 (콘텐츠제작전공)';
    let phone = '010-2483-3104';

    if (userId === '202214112') {
      name = '정재인';
      dept = '미디어스쿨 (방송영상전공)';
      phone = '010-3455-1191';
    } else if (userId.length > 0 && userId !== '202315024') {
      name = '사용자';
      dept = '미디어스쿨';
      phone = '010-1234-5678';
    }

    onLoginSuccess({
      name,
      studentId: userId,
      phone,
      department: dept
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 select-none bg-cover bg-center overflow-y-auto animate-fadeIn"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.55)), url('https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=1600&auto=format&fit=crop')`
      }}
      id="hallym-unified-login-overlay"
    >
      {/* 1. 최상단 헤더: 한림대 우측 상단 로고 */}
      <div className="w-full flex justify-end items-center px-4 pt-2">
        <div className="flex items-center gap-2 select-none cursor-pointer scale-90 sm:scale-100">
          <svg
            className="w-[120px] h-[36px] text-white fill-current"
            viewBox="0 0 200 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 갈매기 로고와 한문/영문 자막 조합의 융합 로고 그래픽 */}
            <path d="M 30 10 C 22 10 15 15 13 22 C 18 17 26 16 31 19 C 35 22 33 28 27 31 C 18 35 15 44 21 52 C 23 55 27 57 30 57 C 39 57 45 50 47 40 C 43 47 36 50 31 47 C 27 44 30 37 36 35 C 43 32 47 23 42 15 C 39 12 35 10 30 10 Z" fill="#2fdde6" />
            <path d="M 30 17 C 27 17 24 19 23 21 C 24 20 27 19 29 20 C 31 21 30 24 28 25 C 24 26 23 29 25 32 C 26 33 28 34 30 34 C 34 34 36 32 37 29 C 35 31 32 32 31 31 C 29 30 30 27 32 26 C 35 25 37 23 35 20 C 34 19 32 17 30 17 Z" fill="#ffffff" />
            
            <text x="56" y="27" fontSize="13" fontWeight="900" fill="#ffffff" letterSpacing="0.1em">한림대학교</text>
            <text x="56" y="42" fontSize="9" fontWeight="700" fill="#2fdde6" letterSpacing="0.05em">HALLYM UNIVERSITY</text>
          </svg>
        </div>
      </div>

      {/* 2. 중앙부: 카드 컨테이너 (좌측 파란색 안내판 / 우측 흰색 로그인 컨트롤러) */}
      <div className="w-full flex items-center justify-center my-auto py-6">
        <div 
          className="w-full max-w-[920px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[460px] md:min-h-[500px]"
          id="login-dialog-card-panel"
        >
          {/* A. 좌측 블루 패널: K-University of the Future */}
          <div className="w-full md:w-[48%] bg-gradient-to-br from-[#0c4083] via-[#0c59a3] to-[#01a6b2] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            
            {/* 배경의 은은한 물결 갈매기 일러스트 SVG */}
            <div className="absolute inset-x-0 bottom-0 top-1/3 opacity-20 pointer-events-none select-none">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white/50">
                <path d="M 0 60 C 30 40 70 80 100 60 L 100 100 L 0 100 Z" />
                <path d="M 0 80 C 40 60 60 90 100 75 L 100 100 L 0 100 Z" className="opacity-60" />
              </svg>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2 select-none">
                <h1 className="text-3xl sm:text-[40px] leading-tight font-extralight tracking-tight font-sans drop-shadow-sm">
                  The New Hallym,<br />
                  <span className="font-semibold block mt-1">K-University</span>
                  of the Future
                </h1>
              </div>
            </div>

            <div className="relative z-10 pt-16 md:pt-0">
              <p className="text-[15px] sm:text-[17px] font-black tracking-wide text-sky-100 flex items-center gap-2">
                한림대학교 통합 로그인
              </p>
            </div>
          </div>

          {/* B. 우측 로그인 폼 패널 */}
          <div className="w-full md:w-[52%] bg-white p-6 sm:p-10 md:p-12 flex flex-col justify-between relative">
            
            {/* 언어 선택 세그먼트 (KOR / ENG) */}
            <div className="flex justify-end items-center gap-1.5 text-xs text-gray-400 font-bold select-none mb-6">
              <button 
                type="button"
                onClick={() => setLanguage('ko')}
                className={`transition ${language === 'ko' ? 'text-[#01a8b5]' : 'hover:text-gray-600'}`}
              >
                한국어
              </button>
              <span>|</span>
              <button 
                type="button"
                onClick={() => setLanguage('en')}
                className={`transition ${language === 'en' ? 'text-[#01a8b5]' : 'hover:text-gray-600'}`}
              >
                English
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6 my-auto">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-black rounded-lg border border-red-100 select-text animate-headShake">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                {/* ID 인풋 */}
                <div className="w-full relative">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="ID"
                    className="w-full py-3.5 px-6 rounded-full border border-gray-300 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#00b2be]/20 focus:border-[#00b2be] transition-all bg-white"
                    id="login-input-id"
                  />
                  {userId && (
                    <button 
                      type="button"
                      onClick={() => setUserId('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 rounded-full text-xs font-black"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* 비밀번호 인풋 */}
                <div className="w-full relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="비밀번호"
                    className="w-full py-3.5 px-6 pr-12 rounded-full border border-gray-300 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#00b2be]/20 focus:border-[#00b2be] transition-all bg-white"
                    id="login-input-pw"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ID 기억하기 체크박스 */}
              <div className="flex items-center justify-between select-none p-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-[13px] text-gray-500 font-bold">
                  <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={(e) => setRememberId(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-gray-300 text-[#00b2be] focus:ring-[#00b2be] cursor-pointer"
                  />
                  <span>ID 기억하기</span>
                </label>
              </div>

              {/* 로그인 액션 버튼 (그라데이션 색감 매칭) */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#005fb3] to-[#00b2be] hover:from-[#004e94] hover:to-[#009ca6] text-white font-extrabold rounded-full text-sm sm:text-base transition duration-200 active:scale-98 shadow-md hover:shadow-lg cursor-pointer text-center tracking-wider block"
                id="login-action-btn"
              >
                로그인
              </button>
            </form>

            {/* 하단 링크모음: 비밀번호 초기화 | 도움말 */}
            <div className="flex items-center justify-center gap-5 pt-8 border-t border-gray-100 text-xs text-gray-400 font-black">
              <button
                type="button"
                onClick={() => alert('본교 포털(한림통합정보시스템오피스) 연락처 033-248-2898 편으로 문의 부탁드립니다.')}
                className="hover:text-slate-800 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>비밀번호 초기화</span>
              </button>
              <span className="text-gray-200">|</span>
              <button
                type="button"
                onClick={() => alert('학번 미발급 및 특별 대여등급 가드는 교무팀 창작과정 담당 조교에게 직접 신청 및 자필서명 승인을 득하셔야 합니다.')}
                className="hover:text-slate-800 flex items-center gap-1 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>도움말</span>
              </button>
            </div>

            {/* 비회원 임시 닫기 버튼(대여 예약 카테고리 뒤로가기) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-3 -right-3 md:top-4 md:right-4 w-8 h-8 rounded-full bg-black/5 text-gray-400 hover:bg-black/10 hover:text-gray-700 font-black text-sm flex items-center justify-center transition border border-gray-150 shadow-xs cursor-pointer"
              >
                &times;
              </button>
            )}

          </div>
        </div>
      </div>

      {/* 3. 하단 저작권 텍스트 오리지널 재현 */}
      <div className="w-full text-center pb-2 select-none">
        <p className="text-[10px] sm:text-[11px] text-white/50 tracking-wider uppercase font-semibold">
          COPYRIGHT© 2025 HALLYM UNIVERSITY. ALL RIGHTS RESERVED.
        </p>
      </div>

    </div>
  );
}
