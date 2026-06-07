/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BreadcrumbBar from './components/BreadcrumbBar';
import EquipmentViewer from './components/EquipmentViewer';
import RentalForm from './components/RentalForm';
import RentalScheduler from './components/RentalScheduler';
import HallymLogin from './components/HallymLogin';
import CurriculumViewer from './components/CurriculumViewer';
import { RentalRequest } from './types';
import { ArrowUp, MapPin, Phone, Mail, HelpCircle, CheckCircle, Info, Layers, ClipboardEdit, CalendarRange, BookOpen } from 'lucide-react';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('기기예약');
  const [activeSubcategory, setActiveSubcategory] = useState('대여 가능 장비보기');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 한림 통합 로그인 인증 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{
    name: string;
    studentId: string;
    phone: string;
    department: string;
  } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [targetTabAfterLogin, setTargetTabAfterLogin] = useState<string | null>(null);

  // 선택된 대여 희망 기기 자동 바인딩을 위한 상태값
  const [initialEquipment, setInitialEquipment] = useState('');

  // 실시간 대여 신청 내역 관리 세션 상태
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([
    {
      id: 'req-01',
      applicantName: '김지윤',
      studentId: '202315024',
      phone: '010-2483-3104',
      department: '미디어스쿨',
      advisor: '이미디어 교수님',
      purpose: '다큐멘터리 가을 색채 수치 6K 시네마토그래피 야외 실습',
      rentalDate: '2026-06-08',
      returnDate: '2026-06-10',
      equipmentItemName: '소니 PXW-FX9 시네마 캠코더',
      quantity: 1,
      status: 'approved',
      createdAt: '2026-06-06 14:24',
      hasSigned: true,
    },
    {
      id: 'req-02',
      applicantName: '정재인',
      studentId: '202214112',
      phone: '010-3455-1191',
      department: '미디어스쿨',
      advisor: '박크리에이티브 교수님',
      purpose: '졸업작품 상업 단편영화 야간 4.5K HDR 연출 세션 수집',
      rentalDate: '2026-06-12',
      returnDate: '2026-06-15',
      equipmentItemName: '아리 알렉사 미니 LF',
      quantity: 1,
      status: 'pending',
      createdAt: '2026-06-07 09:12',
      hasSigned: true,
    }
  ]);

  // Scroll tracking to trigger the "TOP" circular button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 240) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('맨 위로 스크롤되었습니다.');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 한림 통합 로그인 콜백 제어부
  const handleLoginSuccess = (user: { name: string; studentId: string; phone: string; department: string }) => {
    setIsLoggedIn(true);
    setLoggedInUser(user);
    setShowLoginModal(false);
    
    // 만약 신청하기 등 이동하려던 대상이 지정되어 있었다면 거기로 바로 활성화 스위치
    if (targetTabAfterLogin) {
      setActiveSubcategory(targetTabAfterLogin);
      setTargetTabAfterLogin(null);
    }
    showToast(`통합 로그인 성공! 어서오세요, ${user.name}님.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setActiveSubcategory('대여 가능 장비보기');
    setInitialEquipment('');
    showToast('안전하게 로그아웃 되었습니다.');
  };

  const handleLoginTrigger = () => {
    setTargetTabAfterLogin(null);
    setShowLoginModal(true);
    showToast('통합정보 로그인 화면을 호출합니다.');
  };

  // 장비 뷰어에서 [신청하기] 클릭 시 본 가이더로 위임 자동 탑재 가동
  const handleSelectEquipmentForForm = (eqName: string) => {
    if (!isLoggedIn) {
      setInitialEquipment(eqName);
      setTargetTabAfterLogin('대여 신청하기');
      setShowLoginModal(true);
      showToast('경고: 장비 대여 신청 기능을 이용하시려면 통합 로그인이 필요합니다.');
      return;
    }
    setInitialEquipment(eqName);
    setActiveSubcategory('대여 신청하기');
    showToast(`"${eqName}" 기기가 대여 신청 양식에 성공적으로 바인딩되었습니다.`);
  };

  // 신규 대여 신청 접수 성공 시 글로벌 리스트 추가 및 탭 전환
  const handleSubmitSuccess = (newReq: Omit<RentalRequest, 'id' | 'createdAt' | 'status'>) => {
    const fullReq: RentalRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setRentalRequests((prev) => [fullReq, ...prev]);
    
    // 수집 완료 후 대여 현황보기 탭으로 자동 전진
    setActiveSubcategory('대여 현황보기');
    setActiveMenu('기기예약');
  };

  const handleCancelRequest = (id: string) => {
    setRentalRequests((prev) => prev.filter(r => r.id !== id));
  };

  // 3대 핵심 탭에 따른 라우터 컴포넌트 렌더링
  const renderCoreTabContent = () => {
    // 탭 보호 필터링 바인딩
    if (activeSubcategory !== '대여 가능 장비보기' && !isLoggedIn) {
      return (
        <div className="py-6 scale-95 transition-all">
          <HallymLogin
            onLoginSuccess={handleLoginSuccess}
            onClose={() => {
              setActiveSubcategory('대여 가능 장비보기');
              showToast('통합 로그인이 완료되지 않아 자산목록 조회 탭으로 스키마 회귀 조치되었습니다.');
            }}
          />
        </div>
      );
    }

    switch (activeSubcategory) {
      case '대여 가능 장비보기':
        return (
          <EquipmentViewer
            onSelectEquipmentForForm={handleSelectEquipmentForForm}
            onShowToast={showToast}
            activeSubcategory={activeSubcategory}
          />
        );
      case '대여 신청하기':
        return (
          <RentalForm
            initialEquipment={initialEquipment}
            onShowToast={showToast}
            onSubmitSuccess={handleSubmitSuccess}
            loggedInUser={loggedInUser}
          />
        );
      case '대여 현황보기':
        return (
          <RentalScheduler
            rentalRequests={rentalRequests}
            onShowToast={showToast}
            onCancelRequest={handleCancelRequest}
          />
        );
      default:
        return (
          <EquipmentViewer
            onSelectEquipmentForForm={handleSelectEquipmentForForm}
            onShowToast={showToast}
            activeSubcategory={activeSubcategory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between font-sans relative">
      <div className="w-full">
        {/* Top Header */}
        <Header 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu}
          isLoggedIn={isLoggedIn}
          loggedInUser={loggedInUser}
          onLogout={handleLogout}
          onLoginTrigger={handleLoginTrigger}
        />

        {/* Hero Section Banner */}
        <HeroSection />

        {/* 3대 핵심 네비게이션 탭 시스템 (대여 가능 장비보기 / 대여 신청하기 / 대여 현황보기) */}
        <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
              
              {/* 이미지 1 예시처럼 "보유기기(전체)" 서식을 본떠만든 현재 상태 바 */}
              <div className="space-y-1 select-none">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-extrabold tracking-wide uppercase">
                  <span>통합 기자재 대여 포털</span>
                  <span>&gt;</span>
                  <span className="text-[#006bd1]">{activeSubcategory}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeSubcategory === '대여 가능 장비보기' && '보유기기(전체) 현황조회'}
                  {activeSubcategory === '대여 신청하기' && '온라인 장비대여 신청서 작성'}
                  {activeSubcategory === '대여 현황보기' && '실시간 기기예약 및 대여현황'}
                </h2>
              </div>

              {/* 아주 직관적인 3대 대형 핵심 탭 컨트롤러 */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto gap-0.5 select-none">
                {[
                  { id: '대여 가능 장비보기', title: '대여 가능 장비보기', icon: Layers },
                  { id: '대여 신청하기', title: '대여 신청하기', icon: ClipboardEdit },
                  { id: '대여 현황보기', title: '대여 현황보기', icon: CalendarRange }
                ].map((tab) => {
                  const isActive = activeSubcategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id !== '대여 가능 장비보기' && !isLoggedIn) {
                          setTargetTabAfterLogin(tab.id);
                          setShowLoginModal(true);
                          showToast('경고: 해당 탭 서비스는 로그인이 필요하여 통합 로그인 화면으로 연계합니다.');
                          return;
                        }
                        setActiveSubcategory(tab.id);
                        showToast(`"${tab.title}" 업무 화면으로 스위치 전환되었습니다.`);
                      }}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs sm:text-xs font-black px-4 py-2.5 rounded-lg whitespace-nowrap transition duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#1b3b6f] shadow-sm'
                          : 'text-gray-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      id={`core-tab-${tab.id}`}
                    >
                      <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#006bd1]' : 'text-gray-400'}`} />
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* 메인 라우터 영역 구조 */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeMenu === '기기예약' ? (
            <div className="animate-fadeIn">
              {renderCoreTabContent()}
            </div>
          ) : activeMenu === '교과과정' ? (
            <div className="animate-fadeIn">
              <CurriculumViewer onShowToast={showToast} />
            </div>
          ) : (
            // 혹시 '기기예약' 외에 다른 상단 대메뉴 선택 시에 대한 안전장치
            <div className="py-20 text-center select-none bg-white rounded-2xl border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-12 h-12 bg-blue-50 text-[#006bd1] rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5">"{activeMenu}" 디렉토리</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                선택하신 {activeMenu} 세부 파트는 현재 신규 대여 포털 개편으로 인해 <strong className="text-[#006bd1]">기기예약</strong> 포털 내부로 집중 일원화가 완료되었습니다.
              </p>
              <button
                onClick={() => {
                  setActiveMenu('기기예약');
                  setActiveSubcategory('대여 가능 장비보기');
                  showToast('기기예약 포털로 환원되었습니다.');
                }}
                className="bg-[#006bd1] hover:bg-[#005bb3] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg transition tracking-wide cursor-pointer shadow-md"
              >
                기시예약 및 보유기기 조회 탭으로 가기
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modern Academic Portal Web Footer */}
      <footer className="w-full bg-[#111926] text-gray-400 mt-20 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo brand info */}
          <div className="flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 select-none">
              <svg
                className="w-8 h-8 fill-current text-white/90"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 50 15 C 38 15 28 22 25 32 C 32 25 45 23 52 28 C 58 32 55 42 45 46 C 30 52 25 65 35 78 C 38 82 45 85 50 85 C 65 85 75 75 78 60 C 72 70 60 75 52 70 C 45 65 50 55 60 52 C 72 48 78 35 70 22 C 65 18 58 15 50 15 Z" />
              </svg>
              <div className="flex flex-col">
                <span className="font-extrabold text-[#fafafa] text-sm tracking-wider uppercase">HALLYM UNIVERSITY</span>
                <span className="text-[10px] text-gray-400 font-bold -mt-1 tracking-wider uppercase">Media School Center</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-normal max-w-xs mt-2 font-semibold">
              본 웹사이트는 한림대학교 미디어스쿨 학부 공무 및 촬영 기자재 자원 대여 서비스 일원화를 위한 온라인 실증 데모 프레임워크입니다.
            </p>
          </div>

          {/* Location / contacts details */}
          <div className="space-y-2 select-text font-semibold text-xs text-gray-400">
            <span className="block font-bold text-white uppercase text-[11px] tracking-widest mb-3 text-cyan-400">CONTACT ADDR</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <span>강원특별자치도 춘천시 한림대학길 1 한림대학교 일송기념관 지하 1층 B108호 미디어스쿨 기자재지원실</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>Tel: 033-248-2200, Fax: 033-248-2201</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>Email: media@hallym.ac.kr</span>
            </div>
          </div>

          {/* Guidelines / copyright */}
          <div className="space-y-2 select-none text-xs text-gray-500 flex flex-col justify-between">
            <div>
              <span className="block font-bold text-white uppercase text-[11px] tracking-widest mb-3 text-cyan-400">RESOURCES</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-bold">
                <a href="https://www.hallym.ac.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">한림대학교 홈</a>
                <div className="w-[1px] h-3 bg-gray-800 self-center" />
                <a href="#top" className="hover:text-white transition">미디어스쿨 오피셜</a>
                <div className="w-[1px] h-3 bg-gray-800 self-center" />
                <button onClick={() => showToast('대여 규정동의 파일이 연계되었습니다(시뮬레이션).')} className="hover:text-white transition cursor-pointer text-left">개인정보 취급방침</button>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 font-bold select-text mt-4">
              COPYRIGHT © 2026 HALLYM UNIVERSITY MEDIA SCHOOL. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </footer>

      {/* Floating TOP Scroll back button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          type="button"
          className="fixed bottom-6 right-6 z-40 bg-zinc-800 hover:bg-[#006bd1] text-white hover:text-white rounded-full w-12 h-12 flex flex-col items-center justify-center shadow-2xl transition cursor-pointer hover:scale-105 active:scale-95 group focus:outline-none"
          title="페이지 상단으로 이동"
          id="btn-scroll-top"
        >
          <ArrowUp className="w-4 h-4 mb-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[9px] font-extrabold tracking-tighter uppercase leading-none">TOP</span>
        </button>
      )}

      {/* Global Toast Alert Box */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/95 border border-[#006bd1]/40 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2.5 animate-bounce backdrop-blur">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 한림대학교 통합 로그인 전면 오버레이 (데모 테스트용 취소 Close 지원) */}
      {showLoginModal && (
        <HallymLogin
          onLoginSuccess={handleLoginSuccess}
          onClose={() => {
            setShowLoginModal(false);
            showToast('통합 로그인이 취소되었습니다.');
          }}
        />
      )}
    </div>
  );
}

