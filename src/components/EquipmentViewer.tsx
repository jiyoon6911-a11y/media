/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Search, FileSpreadsheet, CalendarDays, CheckCircle2, AlertCircle, Info, ChevronRight, CornerDownRight, ArrowLeft } from 'lucide-react';
import { Equipment } from '../types';

interface ExtendedEquipment extends Equipment {
  productName: string;      // 품명 (예: LCD모니터)
  standard: string;         // 규격 (예: 3D모니터 SDM-080 SDI)
  rentLevel: string;        // 대여등급 (예: 교육이수자(담당자확인))
  rentLocation: string;     // 대여장소 (예: 교무팀 창작지원실...)
  guideNotice: string;      // 기자재 사용안내
  thumbnails: string[];     // 좌측 하단 썸네일 이미지 목록
}

interface EquipmentViewerProps {
  onSelectEquipmentForForm: (name: string) => void;
  onShowToast: (msg: string) => void;
  activeSubcategory: string;
}

export default function EquipmentViewer({ onSelectEquipmentForForm, onShowToast }: EquipmentViewerProps) {
  const [selectedDept, setSelectedDept] = useState<'all' | 'bio' | 'efficacy' | 'maker' | 'etc'>('all');
  const [selectedHangul, setSelectedHangul] = useState<string>('전체');
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 상세로 보기 선택한 특정 기기 ID 관리
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  
  // 상세 보기 화면에서 선택되어 있는 썸네일 이미지 임시 상태
  const [activeDetailThumbnail, setActiveDetailThumbnail] = useState<string | null>(null);

  // 이미지 예시에 완전 밀착한 대여 기자재 및 입체 영상 기자재 인벤토리 배열
  const defaultInventory: ExtendedEquipment[] = [
    {
      id: 'eq-z01',
      nameKo: '3D모니터 SDM-080 SDI',
      nameEn: '3D Monitor SDM-080 SDI (Redrover)',
      zeusNo: 'NFEC-2025-11-310028',
      abbr: '3DM',
      deptCategory: 'bio',
      managerName: '정재인',
      managerPhone: '033-248-3104',
      managerEmail: 'dlswowjd@naver.com',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
      specs: [
        '3D 입체 편광 이중 패널 스크린 특허 탑재',
        'SDI/HDMI 하드웨어 이중 신호 인터페이스 수용',
        '실시간 시차 수평/수직 정렬 확인 다이어그램 출력 기능',
        '융합 미디어 영상 제작 실무 전습 선도 장비'
      ],
      productName: 'LCD모니터',
      standard: '3D모니터 SDM-080 SDI',
      rentLevel: '교육이수자(담당자확인)',
      rentLocation: '교무팀 창작지원실 (영상관 2층 3203호)',
      guideNotice: '* 기자재 신청기간\n● 수업용 : 전일부터 수업당일\n● 실습용 : 신청일 반출일을 포함한 3일 이내 온라인 선약 접수',
      thumbnails: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z02',
      nameKo: 'SDC-S200 (Redrover)',
      nameEn: 'Stereoscopic Rig Module SDC-S200',
      zeusNo: 'NFEC-2009-10-074188',
      abbr: 'RED',
      deptCategory: 'bio',
      managerName: '정재인',
      managerPhone: '033-248-3104',
      managerEmail: 'dlswowjd@naver.com',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
      specs: [
        '이중 동조 카메라 정밀 합치를 위한 프로 입체 리그 구동계',
        'Redrover 정적 시차 제어 보정 보조 조향 리글 암 장착',
        '범용 스플레이트 나사선 체결 방식으로 다양한 숏포커스 카메라 결속 가능'
      ],
      productName: '입체카메라 리그',
      standard: 'SDC-S200 (Redrover)',
      rentLevel: '교육이수자(담당자확인)',
      rentLocation: '교무팀 창작지원실 (영상관 2층 3203호)',
      guideNotice: '* 기자재 신청기간\n● 수업용 : 전일부터 수업당일\n● 실습용 : 최대 3박4일 이내 보존 서약 작성 수령',
      thumbnails: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z03',
      nameKo: '소형직교리그 RB-100',
      nameEn: 'Orthogonal Micro Rig Compact RB-100',
      zeusNo: 'NFEC-2025-11-310048',
      abbr: 'RB100',
      deptCategory: 'bio',
      managerName: '정재인',
      managerPhone: '033-248-3104',
      managerEmail: 'dlswowjd@naver.com',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
      specs: [
        '소형 렌즈 및 본체 결합형 직각 빔 분할 3D 고정 마운트',
        '정밀 마이크로 스케일 제어 노브 탑재(보정값 오차 0.01mm 이내)',
        '마그네슘 초경량 다이캐스팅 바디 구조로 뛰어난 전동 이동성'
      ],
      productName: '소형직교리그',
      standard: '소형직교리그 RB-100',
      rentLevel: '교육이수자(담당자확인)',
      rentLocation: '교무팀 창작지원실 (영상관 2층 3203호)',
      guideNotice: '* 기자재 신청기간\n● 강습 수업 및 자습 실습 공용 가능\n● 전용 완충 운송용 무충격 하드 케이스 패키징 반출',
      thumbnails: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z04',
      nameKo: '수평리그 3D SXS RIG (micro)',
      nameEn: 'Horizontal side-by-side 3D SXS RIG (micro)',
      zeusNo: 'NFEC-2015-11-210452',
      abbr: 'XS-M',
      deptCategory: 'efficacy',
      managerName: '윤하나',
      managerPhone: '033-248-3455',
      managerEmail: 'hnyoon@hallym.ac.kr',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
      specs: [
        '사이드 바이 사이드 평행 입체 촬영용 초미세 고하중 리거 암',
        '초정밀 레이저 식각 수치 제어 보드 장착',
        '경량 알루미늄 및 카본 파이버 튜브 지지 프레임 결합 구조'
      ],
      productName: '수평 3D 리그',
      standard: '수평리그 3D SXS RIG (micro)',
      rentLevel: '교육이수자(담당자확인)',
      rentLocation: '교무팀 창작지원실 (영상관 2층 3203호)',
      guideNotice: '* 3D 모션 촬영 장비 전공 입문자의 경우 대여 전 시연 실습을 이수하셔야 합니다.',
      thumbnails: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z05',
      nameKo: '직교(수평 겸용)리그 Hurricane 3D RIG (Genus)',
      nameEn: 'Genus Hurricane 3D Orthoganol & Horizontal RIG',
      zeusNo: 'NFEC-2022-09-299102',
      abbr: 'HR-3D',
      deptCategory: 'efficacy',
      managerName: '윤하나',
      managerPhone: '033-248-3455',
      managerEmail: 'hnyoon@hallym.ac.kr',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop',
      specs: [
        '직교형 빔 스플리터와 평행형 수평 레일을 신속히 전환하는 가변형 통합 리그',
        'Genus 오리지널 하프 실버 코팅 광학 빔 스플리터 반투과 미러 장치 내장',
        '동축성 정렬을 위한 상하좌우 자이로 지지축 미세 스태빌라이저 완비'
      ],
      productName: '직교/수평 겸용 리그',
      standard: 'Hurricane 3D RIG (Genus)',
      rentLevel: '교육이수자(담당자확인)',
      rentLocation: '교무팀 창작지원실 (영상관 2층 3203호)',
      guideNotice: '* 미러 부위 접촉 및 이물질 주입 절대 엄금 (수리 비용 변상 동의서 지참)',
      thumbnails: [
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z06',
      nameKo: '소니 PXW-FX9 시네마 캠코더',
      nameEn: 'Sony PXW-FX9 Full-Frame Cinema Camera',
      zeusNo: 'NFEC-2025-11-310028',
      abbr: 'FX9',
      deptCategory: 'maker',
      managerName: '박창작',
      managerPhone: '033-248-2890',
      managerEmail: 'creativepark@hallym.ac.kr',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1620626011160-9928f1b2b634?q=80&w=600&auto=format&fit=crop',
      specs: [
        '6K 풀프레임 센서 및 고감도 이중 네이티브 ISO (800 / 4000) 지원',
        '고속 하이브리드 AF 시스템 및 리얼타임 피사체 추적 기능 탑재',
        '15스톱+ 다이내믹 레인지와 화려한 S-Cinetone 색상 과학 탑재'
      ],
      productName: '풀프레임 시네마 카메라',
      standard: 'PXW-FX9 Dual Base ISO System',
      rentLevel: '연구원 및 책임교수 연장',
      rentLocation: '영상관 2층 창작지원 기자재 보관실 (3203호)',
      guideNotice: '* 콘텐츠제작 전공 또는 방송영상 실습 과목 수강생만 대여 승인이 정규 인정됩니다.',
      thumbnails: [
        'https://images.unsplash.com/photo-1620626011160-9928f1b2b634?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z07',
      nameKo: '아리 알렉사 미니 LF',
      nameEn: 'ARRI ALEXA Mini LF Cinema Camera',
      zeusNo: 'NFEC-2015-11-210452',
      abbr: 'ARRI-LF',
      deptCategory: 'maker',
      managerName: '박창작',
      managerPhone: '033-248-2890',
      managerEmail: 'creativepark@hallym.ac.kr',
      status: '정상',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop',
      specs: [
        '라지 포맷 4.5K 액티브 센서 고화질 디테일 시네마 이미지 수집',
        'ARRIRAW 내부 고독 도트 레이트 녹화 지원 및 실시간 LBUS 제어 포트 완비',
        '드라마, 영화, 고품격 광고 영상 프로덕션 핵심 규격 사양 장비'
      ],
      productName: '라지포맷 시네마 카메라',
      standard: 'ARRI ALEXA Mini LF Gold Mount',
      rentLevel: '융합학과 교육이수 대학원생',
      rentLocation: '영상관 2층 창작지원 기자재 보관실 (3203호)',
      guideNotice: '* 최고가 장비이므로, 반드시 책임지도교수 동행 자필 승인 서약 및 전용 대여 보험서류 제출이 완료되어야 반출 가능합니다.',
      thumbnails: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop'
      ]
    },
    {
      id: 'eq-z08',
      nameKo: '디제이아이 로닌 4D 짐벌 카메라',
      nameEn: 'DJI Ronin 4D 4-Axis Gimbal Camera System',
      zeusNo: 'NFEC-2019-12-110056',
      abbr: 'RONIN4D',
      deptCategory: 'etc',
      managerName: '김연구원',
      managerPhone: '033-248-1191',
      managerEmail: 'mediakim@hallym.ac.kr',
      status: '점검중',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop',
      specs: [
        '풀프레임 Zenmuse X9 8K 카메라 및 4축 액티브 헤드 안정화 시스템',
        'LiDAR 레이저 핀포인트 초점 조향 실시간 연동 및 자동 3D 연속 팔로우 포커싱',
        'O3 Pro 고대역 무선 영상 송수신 모니터 세트 통합 연동 조향 세션 구성'
      ],
      productName: '4축 일체형 짐벌 카메라',
      standard: 'DJI Ronin 4D 8K Combo',
      rentLevel: '융합연구원 담당 수료생',
      rentLocation: '영상관 2층 창작지원 기자재 보관실 (3203호)',
      guideNotice: '* 현재 4축 틸트 제어 노브 정밀 보정 작업 및 LiDAR 스캐너 펌웨어 업데이트 출하 캘리브레이션 테스트 중으로 일시 중단 상태입니다.',
      thumbnails: [
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300&auto=format&fit=crop'
      ]
    }
  ];

  // 한글 초성 추출 헬퍼 함수
  const getConsonant = (str: string) => {
    const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const charCode = str.charCodeAt(0) - 44032;
    if (charCode < 0 || charCode > 11171) return '';
    return consonants[Math.floor(charCode / 588)];
  };

  const handleExcelDownload = () => {
    onShowToast('엑셀 규격 리스트가 클라이언트 환경으로 내보내기 되었습니다. (기자재_보유_전체_리스트.xlsx)');
  };

  // 필터링 메커니즘
  const filteredInventory = defaultInventory.filter((item) => {
    // 1. 소속분류 필터링
    if (selectedDept !== 'all' && item.deptCategory !== selectedDept) return false;

    // 2. 한글 초성 필터링
    if (selectedHangul !== '전체') {
      const cho = getConsonant(item.nameKo);
      if (cho !== selectedHangul) return false;
    }

    // 3. 영문 알파벳 필터링
    if (selectedAlphabet !== 'ALL') {
      const firstChar = item.nameEn.charAt(0).toUpperCase();
      if (firstChar !== selectedAlphabet) return false;
    }

    // 4. 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchNameKo = item.nameKo.toLowerCase().includes(query);
      const matchNameEn = item.nameEn.toLowerCase().includes(query);
      const matchZeus = item.zeusNo.toLowerCase().includes(query);
      const matchSpecs = item.specs.some(s => s.toLowerCase().includes(query));

      if (!matchNameKo && !matchNameEn && !matchZeus && !matchSpecs) return false;
    }

    return true;
  });

  // 2026-06 기준 요일 및 수업용 대여달력 데이터 실시간 조립
  const generateJuneCalendar = () => {
    const weekdayNames = ['월', '화', '수', '목', '금', '토', '일'];
    return Array.from({ length: 30 }, (_, idx) => {
      const day = idx + 1;
      // 2026년 6월 1일은 월요일
      const weekdayIndex = idx % 7;
      const weekday = weekdayNames[weekdayIndex];
      const isWeekend = weekday === '토' || weekday === '일';

      // 가상의 가능수량 분할 대조표 작성 (주말은 대여 불가, 평일은 2~4개 임의 예약 상태)
      let capacity: number | null = 4;
      if (isWeekend) {
        capacity = null; // 대여 비대상 일자
      } else if (day === 3 || day === 12 || day === 17 || day === 24) {
        capacity = 0; // 마감 상태 의미
      } else if (day % 3 === 0) {
        capacity = 2; // 일부 예약됨
      } else if (day % 5 === 0) {
        capacity = 3;
      }

      return {
        day,
        weekday,
        isWeekend,
        capacity
      };
    });
  };

  const daysInJune = generateJuneCalendar();


  // 상세 보기 페이지 컴포넌트 렌더링 구동
  const renderDetailView = (item: ExtendedEquipment) => {
    // 썸네일 클릭 시 보여줄 대형 활성 이미지 타겟
    const shownBigImage = activeDetailThumbnail || item.image;

    return (
      <div className="w-full bg-white rounded-xl animate-fadeIn space-y-8 select-text" id="equipment-detail-view-container">
        
        {/* 상단 타임라인 안내 브레드크럼 및 뒤로가기 제어 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-3">
          <div className="flex items-center gap-2 select-none">
            <span className="text-[11px] font-black uppercase text-[#006bd1] tracking-widest bg-sky-50 px-2 py-1 rounded">
              {item.deptCategory.toUpperCase()} 자산
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-xs font-bold text-gray-500">통합 기자재 상세 정보</span>
          </div>

          <button
            onClick={() => {
              setSelectedEquipmentId(null);
              setActiveDetailThumbnail(null);
              onShowToast('목록 화면으로 돌아왔습니다.');
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 hover:border-slate-800 text-gray-700 hover:text-slate-900 rounded-lg text-xs font-black bg-white transition cursor-pointer hover:shadow-xs active:scale-95"
            id="detail-back-to-list-top-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>이전 기기목록</span>
          </button>
        </div>

        {/* 1. 이미지 및 상세 규격 테이블 (기자재 상설 세팅부) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 큰 이미지 영역 & 하단 썸네일 전개 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="w-full aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-slate-50 relative shadow-xs">
              
              {/* 이미지 우상단 "교육 이수자" 오리지널 명패 제작 및 탑재 */}
              <div className="absolute top-0 right-0 z-10 w-20 h-20 overflow-hidden pointer-events-none select-none">
                <div className="absolute top-3 -right-6 py-1 w-24 text-center bg-[#006bd1] text-white text-[9px] sm:text-[10px] font-extrabold rotate-45 tracking-tighter shadow-sm flex items-center justify-center gap-0.5">
                  <span>교육</span>
                  <span className="-mt-1 font-normal">이수자</span>
                </div>
              </div>

              <img
                src={shownBigImage}
                alt={item.nameKo}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* 좌측 하단 작은 썸네일 그리드 */}
            {item.thumbnails && item.thumbnails.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {item.thumbnails.map((thumbUrl, idx) => {
                  const isCurrentActive = shownBigImage === thumbUrl;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveDetailThumbnail(thumbUrl)}
                      className={`w-16 h-12 sm:w-20 sm:h-15 rounded-lg overflow-hidden border transition duration-150 cursor-pointer ${
                        isCurrentActive
                          ? 'ring-2 ring-[#006bd1] border-transparent scale-105'
                          : 'border-gray-200 opacity-70 hover:opacity-100 hover:scale-[1.02]'
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`${item.nameKo} thumb ${idx}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 우측: 정밀 세부 규격 표 테이블 렌더(이미지 4와 완전 합치) */}
          <div className="lg:col-span-7">
            <div className="border border-gray-250 rounded-xl overflow-hidden shadow-xs bg-white text-xs sm:text-[13px] font-semibold text-slate-700">
              <table className="w-full border-collapse">
                <tbody>
                  
                  {/* 품명 */}
                  <tr className="border-b border-gray-200">
                    <td className="w-1/4 py-4 px-4 bg-slate-50 font-black text-slate-800 border-r border-gray-200 text-center">품명</td>
                    <td className="w-3/4 py-4 px-5 text-slate-900 font-extrabold leading-normal select-text">{item.productName}</td>
                  </tr>

                  {/* 규격 */}
                  <tr className="border-b border-gray-200">
                    <td className="w-1/4 py-4 px-4 bg-slate-50 font-black text-slate-800 border-r border-gray-200 text-center">규격</td>
                    <td className="w-3/4 py-4 px-5 text-indigo-900 font-extrabold leading-normal select-text">
                      <div className="space-y-0.5">
                        <span className="text-slate-900 font-extrabold block text-sm sm:text-base">{item.standard}</span>
                        <span className="text-xs text-gray-400 font-bold block">ZEUS 자산식별: {item.zeusNo}</span>
                      </div>
                    </td>
                  </tr>

                  {/* 대여등급 */}
                  <tr className="border-b border-gray-200">
                    <td className="w-1/4 py-4 px-4 bg-slate-50 font-black text-slate-800 border-r border-gray-200 text-center">대여등급</td>
                    <td className="w-3/4 py-4 px-5 text-[#006bd1] font-black leading-normal select-text">{item.rentLevel}</td>
                  </tr>

                  {/* 대여장소 */}
                  <tr className="border-b border-gray-200">
                    <td className="w-1/4 py-4 px-4 bg-slate-50 font-black text-slate-800 border-r border-gray-200 text-center">대여장소</td>
                    <td className="w-3/4 py-4 px-5 text-slate-900 font-extrabold leading-normal select-text">{item.rentLocation}</td>
                  </tr>

                  {/* 기자재 사용안내 */}
                  <tr className="border-b border-gray-200">
                    <td className="w-1/4 py-4 px-4 bg-slate-50 font-black text-slate-800 border-r border-gray-200 text-center">기자재 사용안내</td>
                    <td className="w-3/4 py-4 px-5 text-slate-600 font-bold leading-relaxed whitespace-pre-wrap select-text">{item.guideNotice}</td>
                  </tr>

                  {/* 기자재 특성 */}
                  <tr>
                    <td className="w-1/4 py-4 px-4 bg-slate-50 font-black text-slate-800 border-r border-gray-200 text-center">기자재 특성</td>
                    <td className="w-3/4 py-4 px-5 text-slate-800 font-bold leading-relaxed select-text">
                      <ul className="space-y-2 list-none pl-0">
                        {item.specs.map((spec, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs text-stone-700">
                            <CornerDownRight className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* 테이블 우측 바로 하단의 목록 이동 버튼 */}
            <div className="flex justify-end gap-3 mt-4 select-none">
              <button
                onClick={() => {
                  setSelectedEquipmentId(null);
                  setActiveDetailThumbnail(null);
                  onShowToast('목록 화면으로 돌아왔습니다.');
                }}
                className="px-6 py-2.5 bg-[#006bd1] hover:bg-[#0052a3] text-white font-extrabold rounded text-xs sm:text-xs transition shadow-md cursor-pointer hover:shadow-lg active:scale-95"
                id="detail-back-to-list-bottom-btn"
              >
                목록
              </button>
            </div>
          </div>

        </div>

        {/* 2. 수업용 대여달력 일자별 조견표 (하단부 빌드) */}
        <div className="w-full bg-[#fafcff] border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 space-y-4" id="detail-june-rental-calendar">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 gap-3 select-none">
            <div className="space-y-0.5">
              <span className="text-[10px] bg-red-100 text-rose-700 font-black px-2 py-0.5 rounded tracking-wide align-middle inline-block mb-1">
                주간 통합 스케줄 현황
              </span>
              <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase">
                2026-06 수업용 대여달력
              </h5>
            </div>

            {/* 연월 조절 화살표 시물레이션 */}
            <div className="flex items-center gap-1">
              <button onClick={() => onShowToast('이전 달은 대여 마감되어 조회가 허가되지 않습니다.')} className="bg-white border border-gray-300 hover:bg-slate-50 text-gray-500 font-bold w-7 h-7 flex items-center justify-center rounded text-xs cursor-pointer active:scale-95">&lt;</button>
              <span className="text-xs sm:text-xs font-black text-slate-800 px-2 font-mono">2026-06</span>
              <button onClick={() => onShowToast('다음 달 일정 조율 오픈 전입니다.')} className="bg-white border border-gray-300 hover:bg-slate-50 text-gray-500 font-bold w-7 h-7 flex items-center justify-center rounded text-xs cursor-pointer active:scale-95">&gt;</button>
            </div>
          </div>

          {/* 이미지 4의 횡스크롤 장비대여 가능수량 리스트 재현 */}
          <div className="overflow-x-auto w-full border border-gray-200 rounded-xl bg-white shadow-inner select-none">
            <table className="w-full border-collapse text-center text-[11px] sm:text-xs">
              <thead>
                
                {/* 1행: 요일 표시줄 */}
                <tr className="bg-slate-50 text-slate-700 font-black border-b border-gray-200">
                  <th className="py-3 px-3 min-w-[90px] bg-slate-100 text-slate-800 font-extrabold border-r border-gray-200 text-center">요일</th>
                  {daysInJune.map((item) => (
                    <td 
                      key={`day-head-${item.day}`}
                      className={`py-2 px-2 min-w-[38px] border-r border-gray-150 ${
                        item.isWeekend 
                          ? 'text-red-500 font-black bg-red-50/20' 
                          : item.weekday === '수' 
                            ? 'text-[#006bd1] font-black' 
                            : 'text-gray-600 font-bold'
                      }`}
                    >
                      <div className="text-[9px] uppercase opacity-70 mb-0.5">{item.weekday}</div>
                      <div className="text-xs font-mono">{item.day}</div>
                    </td>
                  ))}
                </tr>

              </thead>
              <tbody>
                
                {/* 2행: 가능 수량 표시줄 */}
                <tr className="text-xs font-semibold text-slate-700">
                  <td className="py-3.5 px-3 min-w-[90px] bg-slate-100 text-slate-800 font-extrabold border-r border-gray-200 text-center">가능수량</td>
                  {daysInJune.map((item) => {
                    const isWeekend = item.isWeekend;
                    const isClosed = item.capacity === 0;
                    
                    return (
                      <td 
                        key={`day-cap-${item.day}`}
                        onClick={() => {
                          if (isWeekend) {
                            onShowToast('경고: 주말 및 공휴일은 미디어 수령 장비실 휴무로 불가합니다.');
                          } else if (isClosed) {
                            onShowToast('경고: 해당 일자는 이미 전공 예약이 가득 차 반출량이 남아있지 않습니다.');
                          } else {
                            onShowToast(`2026-06-${item.day < 10 ? '0' + item.day : item.day} 대여 가용 수량: ${item.capacity}개 남음`);
                          }
                        }}
                        className={`py-3.5 px-1.5 border-r border-gray-150 font-black cursor-pointer transition ${
                          isWeekend 
                            ? 'bg-[#555] text-transparent hover:bg-slate-600 border-gray-700' 
                            : isClosed 
                              ? 'bg-rose-50/80 text-rose-600 hover:bg-rose-100/50' 
                              : 'text-emerald-700 hover:bg-emerald-50 text-xs font-mono'
                        }`}
                      >
                        {isWeekend ? '' : item.capacity}
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400 font-semibold select-none pt-2">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-700 rounded-sm inline-block" /> 가용 반출수량 잔여</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-200 rounded-sm inline-block" /> 예약 마감 (0개)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#555] rounded-sm inline-block" /> 토/일 주말 (대여불가)</span>
            </div>
            <span>• 날짜/숫자를 클릭하시면 당일 가변 수량 메시지가 조회됩니다.</span>
          </div>
        </div>

        {/* 3. 본 기기로 즉시 신청서 생성하는 하단 CTA 연계 버튼 */}
        <div className="p-5 bg-sky-50 border border-sky-100 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
          <div className="space-y-1 text-center sm:text-left">
            <h6 className="text-[14px] font-black text-slate-800">
              확인하신 &ldquo;{item.nameKo}&rdquo; 사양으로 곧장 대여 신청 접수
            </h6>
            <p className="text-[11px] text-gray-500 font-bold">
              아래 우측의 신청하기 버튼을 연계하여 누르시면 해당 품목명이 자동 작성부에 바인딩되어 시간 절약에 매우 유용합니다.
            </p>
          </div>

          <button
            onClick={() => {
              if (item.status !== '정상') {
                onShowToast(`경고: "${item.nameKo}" 장비는 현재 기기 점검 상태로 인해 예약이 시스템 통제 중입니다.`);
                return;
              }
              onSelectEquipmentForForm(item.nameKo);
            }}
            disabled={item.status !== '정상'}
            className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black text-white shadow-md active:scale-95 transition flex items-center gap-1.5 cursor-pointer ${
              item.status === '정상'
                ? 'bg-[#1b3b6f] hover:bg-[#005bb3]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none'
            }`}
          >
            <span>이 기기로 신청서 작성 가기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    );
  };


  // 만약 특정 기기의 디테일 조회가 선택된 상태라면 이 대안 뷰로 넘긴다 (이미지 4)
  if (selectedEquipmentId !== null) {
    const targetItem = defaultInventory.find(eq => eq.id === selectedEquipmentId);
    if (targetItem) {
      return renderDetailView(targetItem);
    }
  }


  // 여기서부터는 일반 메인 리스트 뷰 (그리드 카드 형태, 이미지 3)
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 animate-fadeIn" id="equipment-view-section">
      
      {/* 타이틀 및 이용안내 검색부 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-200 gap-4">
        <div className="space-y-1 select-none">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>입체영상기자재 종합인벤토리</span>
          </h2>
          <p className="text-xs text-gray-400 font-bold">
            이용자 교육 이수자 한정 대여 권한이 제공되는 융합 하이테크 영상 미디어 기자재 일람입니다.
          </p>
        </div>

        {/* 상단 검색바 구조와 이용안내 가이드 링크 제공 (이미지 3 합치) */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 select-none">
          <div className="flex items-center bg-slate-100 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full sm:w-60 focus-within:ring-1 focus-within:ring-[#006bd1]">
            <input
              type="text"
              placeholder="기자재 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 placeholder-gray-400 focus:outline-none w-full"
            />
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
          </div>

          <button
            onClick={() => onShowToast('기자재 종합 대여 안전 수칙 및 이용 지침 문장을 열람합니다.')}
            className="px-3 py-2 bg-[#d80053] hover:bg-rose-700 text-white text-xs font-black rounded-lg transition shrink-0 cursor-pointer shadow-xs"
          >
            이용안내
          </button>
        </div>
      </div>

      {/* 1. 소속분류 필터 탭 (전체기기, 의료, 바이오 등) */}
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-gray-100 pb-4 select-none">
        {[
          { key: 'all', title: '전체기기' },
          { key: 'bio', title: '의료·바이오융합연구원' },
          { key: 'efficacy', title: '효능평가부' },
          { key: 'maker', title: '메이커스페이스' },
          { key: 'etc', title: '기타' }
        ].map((dept) => (
          <button
            key={dept.key}
            onClick={() => {
              setSelectedDept(dept.key as any);
              onShowToast(`분류가 "${dept.title}" 로 필터링되었습니다.`);
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition duration-150 cursor-pointer ${
              selectedDept === dept.key
                ? 'bg-[#1b3b6f] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-slate-900'
            }`}
            id={`dept-filter-${dept.key}`}
          >
            {dept.title}
          </button>
        ))}
      </div>

      {/* 2. 한글 초성 필터 */}
      <div className="flex flex-wrap items-center gap-1 mb-3 bg-[#f8fafc] border border-gray-100 rounded-lg p-2.5 select-none" id="hangul-cho-bar">
        <span className="text-xs font-black text-gray-400 mr-2 shrink-0">초성검색 :</span>
        <div className="flex flex-wrap gap-1">
          {['전체', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'].map((char) => (
            <button
              key={char}
              onClick={() => {
                setSelectedHangul(char);
                setSelectedAlphabet('ALL'); // 알파벳 필터 초기화
                onShowToast(`초성 "${char}" 필터가 작동되었습니다.`);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[11px] sm:text-xs font-bold rounded-md transition duration-150 cursor-pointer ${
                selectedHangul === char
                  ? 'bg-[#006bd1] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200/60'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 영문 알파벳 필터 */}
      <div className="flex flex-wrap items-center gap-1 mb-5 bg-[#f8fafc] border border-gray-100 rounded-lg p-2.5 select-none" id="alphabet-cho-bar">
        <span className="text-xs font-black text-gray-400 mr-2 shrink-0">ALPHABET :</span>
        <div className="flex flex-wrap gap-1">
          {['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((char) => (
            <button
              key={char}
              onClick={() => {
                setSelectedAlphabet(char);
                setSelectedHangul('전체'); // 초성 필터 초기화
                onShowToast(`알파벳 "${char}" 필터가 작동되었습니다.`);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-md transition duration-150 cursor-pointer ${
                selectedAlphabet === char
                  ? 'bg-[#006bd1] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200/60'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 전체 갱신/서치 및 엑셀 다운로드 바 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-slate-50 border border-gray-200 p-4 rounded-xl mb-6">
        <div className="text-xs text-slate-500 font-extrabold flex items-center gap-1 select-none">
          <Info className="w-4 h-4 text-[#006bd1]" />
          <span>아래 카드 리스트에서 희망 장비를 선택하시면 세부 사명 정보 및 수업용 대여 예약 달력을 볼 수 있습니다.</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExcelDownload}
            className="w-full sm:w-auto justify-center px-4 py-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            id="equipment-excel-download-btn"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 5. 격자형 디스플레이 리스트 영역 (이미지 3을 완벽 스타일링) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="equipment-grid-layout">
        {filteredInventory.map((item) => {
          const isNormal = item.status === '정상';
          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedEquipmentId(item.id);
                // 상세 내부 썸네일 변수도 초기화
                setActiveDetailThumbnail(null);
                onShowToast(`"${item.nameKo}" 기기의 사양 및 가용 대여 달력을 호출합니다.`);
              }}
              className="group flex flex-col bg-white border border-gray-250 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer scale-100 hover:scale-102 flex-1 relative"
              id={`equipment-card-${item.id}`}
            >
              
              {/* 이미지 3 에 나오는 우상단 삼각형 교육이수자(담당자확인) 뱃지 구현 */}
              <div className="absolute top-0 right-0 z-10 w-16 h-16 overflow-hidden pointer-events-none select-none">
                <div className="absolute top-2.5 -right-5 py-1 w-20 text-center bg-[#4682b4] text-white text-[9px] font-black rotate-45 tracking-tighter opacity-95">
                  교육이수자
                </div>
              </div>

              {/* 기기 실사 이미지 영역 */}
              <div className="w-full aspect-[4/3] bg-slate-50 border-b border-gray-200 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.nameKo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* 점검중인 기기는 위에 반투명 블라인드 마크 가설 */}
                {!isNormal && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-black select-none gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>장비 점검중 (일시 불가)</span>
                  </div>
                )}
              </div>

              {/* 이미지 3 예시처럼 파란색 바닥띠 띠지 디자인 가공 */}
              <div className="bg-[#005fb3] text-white p-3.5 text-center font-extrabold text-xs sm:text-[13px] tracking-wide select-none group-hover:bg-[#004e94] transition duration-200 flex flex-col justify-center min-h-[56px]">
                <span className="line-clamp-1">{item.nameKo}</span>
                {item.abbr && (
                  <span className="text-[10px] text-sky-200/90 font-mono mt-0.5 tracking-wider font-bold">({item.nameEn})</span>
                )}
              </div>

            </div>
          );
        })}

        {filteredInventory.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 select-none font-extrabold bg-slate-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="flex flex-col items-center justify-center gap-2">
              <Info className="w-10 h-10 text-gray-300" />
              <span>현재 필터 및 검색어 조건에 만족하는 입체 격자형 기기가 인벤토리에 존재하지 않습니다.</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
