/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Camera, Mic, Sun, ShieldCheck, HeartPulse, Hammer, Search, SlidersHorizontal, Check } from 'lucide-react';

interface LocalEquipment {
  id: string;
  name: string;
  model: string;
  category: 'camera' | 'audio' | 'lighting' | 'support' | 'accessory';
  total: number;
  available: number;
  image: string;
  specs: string[];
}

interface EquipmentListProps {
  onSelectEquipment?: (eqName: string) => void;
  onShowToast: (msg: string) => void;
}

export default function EquipmentList({ onSelectEquipment, onShowToast }: EquipmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'camera' | 'audio' | 'lighting' | 'support'>('all');

  const equipmentInventory: LocalEquipment[] = [
    {
      id: 'eq-01',
      name: '[미디어스쿨] 시네마 바디 S-1',
      model: 'Sony FX3',
      category: 'camera',
      total: 5,
      available: 3,
      image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229b8?q=80&w=300&auto=format&fit=crop',
      specs: ['4K 120p 지원', 'Full-Frame Exmor R CMOS', 'S-Cinetone 프로파일 내장', 'Dual SLR Mount'],
    },
    {
      id: 'eq-02',
      name: '[미디어스쿨] 고감도 비디오 카메라',
      model: 'Sony Alpha 7S III',
      category: 'camera',
      total: 8,
      available: 4,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop',
      specs: ['12.1 MP 초고감도 센서', 'ISO 409600 지원', '10-bit 4:2:2 녹화', '내부 active 크롭 방지'],
    },
    {
      id: 'eq-03',
      name: '[미디어스쿨] 하프 시네마 캠코더',
      model: 'Sony FX30 (Super35)',
      category: 'camera',
      total: 6,
      available: 2,
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300&auto=format&fit=crop',
      specs: ['6K 오버샘플링 4K 가공', 'Dual Base ISO (800 / 2500)', 'S-Log3 인코딩 매핑', 'XLR 핸들 유닛 패키지'],
    },
    {
      id: 'eq-04',
      name: '[미디어스쿨] 고음질 무선 동시 녹음기',
      model: 'Rode Wireless PRO 키트',
      category: 'audio',
      total: 10,
      available: 7,
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=300&auto=format&fit=crop',
      specs: ['32-bit Float 자체 백업 저장', '최대 260m 무선 송수신', '듀얼 마이크 라발리에 키트', '시간지연 매핑 서포트'],
    },
    {
      id: 'eq-05',
      name: '[미디어스쿨] 초지향성 붐마이크 세트',
      model: 'Sennheiser MKH416 + 데드캣',
      category: 'audio',
      total: 4,
      available: 1,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
      specs: ['RF 콘덴서 지향성 튜브형 마이크', '야외 다큐멘터리 특화 방풍 패키지', 'XLR 연결 라인 포함', 'Rycote 인비지블 그립'],
    },
    {
      id: 'eq-06',
      name: '[미디어스쿨] 대광량 COB 지속광 조명',
      model: 'Aputure Amaran 200d',
      category: 'lighting',
      total: 6,
      available: 3,
      image: 'https://images.unsplash.com/photo-1522108745914-413701637b1d?q=80&w=300&auto=format&fit=crop',
      specs: ['200W 데이라이트 LED', '소프트박스/그리드 확장 패키지', 'Sidus Link 앱 제어 지원', 'C-Stand 전용 헤드포함'],
    },
    {
      id: 'eq-07',
      name: '[미디어스쿨] 풀스펙 RGB 스틱형 조명',
      model: 'Nanlite Pavotube II 30C 듀얼킷',
      category: 'lighting',
      total: 5,
      available: 0,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
      specs: ['RGBWW 색상 정밀 복합 제어', '빌트인 특수 조명 이펙트 탑재', '충전식 내장 배터리 지원', '듀얼 수납 파우치 제공'],
    },
    {
      id: 'eq-08',
      name: '[미디어스쿨] 프로 전동 3축 짐벌',
      model: 'DJI RS3 Pro Combo',
      category: 'support',
      total: 4,
      available: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop',
      specs: ['탄소섬유 연장 암 프레임', 'LiDAR 오토포커스 모터 모듈 탑재', '최고 적재 무게 4.5kg 서포트', 'RavenEye 영상 무선 전송기'],
    },
    {
      id: 'eq-09',
      name: '[미디어스쿨] 카본 유압 모노 유압 삼각대',
      model: 'Sachtler Flowtech 75 HD + 원 터치락',
      category: 'support',
      total: 7,
      available: 4,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop',
      specs: ['초경량 카본 파이버 퀵릴리즈 다리', '액티브 허체형 유압 헤더 조절', '그라운드 스프레더 일체형', '지상 1.7m 풀서포트'],
    },
  ];

  const handleApplyClick = (item: LocalEquipment) => {
    if (item.available === 0) {
      onShowToast(`오류: "${item.model}" 장비는 현재 모두 대여 중입니다.`);
      return;
    }
    if (onSelectEquipment) {
      onSelectEquipment(item.model);
      onShowToast(`"${item.model}"이(가) 신청서 장비 항목에 자동 배정되었습니다!`);
    } else {
      onShowToast(`"${item.model}" 장비가 선택되었습니다. 대여 신청 양식을 열어 진행해 주세요!`);
    }
  };

  const filteredInventory = equipmentInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full font-sans select-none text-slate-800">
      {/* Visual notice about inventory status */}
      <div className="bg-[#e6f4ff]/50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-[#0c4a6e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 font-bold">
          <ShieldCheck className="w-5 h-5 text-[#006bd1]" />
          <span>모든 미디어스쿨 기기는 사용 전 반드시 대여 신청서를 승인받은 후 지하 1층에서 수령해야 합니다.</span>
        </div>
        <div className="text-xs bg-white border border-[#b3e0ff] text-[#006bd1] font-extrabold px-2.5 py-1 rounded select-none shrink-0">
          실시간 반납 인벤토리 현황
        </div>
      </div>

      {/* Filter and search layout row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-5">
        {/* Categories toggler tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
          {(['all', 'camera', 'audio', 'lighting', 'support'] as const).map((cat) => {
            const labels = {
              all: '전체장비',
              camera: '촬영기기',
              audio: '음향/레코딩',
              lighting: '스튜디오조명',
              support: '삼각대/안정기',
            };
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-md cursor-pointer transition ${
                  activeCategory === cat
                    ? 'bg-white text-[#006bd1] shadow-xs'
                    : 'text-slate-505 text-gray-500 hover:text-slate-800'
                }`}
                id={`cat-tab-${cat}`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="장비 및 스펙을 직접 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006bd1] focus:bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid view of gears */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInventory.map((item) => {
          const isOut = item.available === 0;
          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group ${
                isOut ? 'border-gray-100 saturate-50' : 'border-gray-200 hover:border-slate-800'
              }`}
              id={`eq-card-${item.id}`}
            >
              {/* Product Thumbnail image */}
              <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.model}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category tag badge */}
                <span className="absolute top-2.5 left-2.5 text-[9px] bg-slate-900/80 backdrop-blur-xs text-white uppercase px-2 py-0.5 rounded tracking-wider font-semibold font-mono">
                  {item.category}
                </span>

                {/* Live count status */}
                <div className={`absolute bottom-2.5 right-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow-sm ${
                  isOut 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-emerald-500 text-white'
                }`}>
                  {isOut ? '대여불가' : `대여가능: ${item.available} / ${item.total}대`}
                </div>
              </div>

              {/* Description body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs text-gray-400 font-bold tracking-tight mb-0.5">
                    {item.name}
                  </h4>
                  <h5 className="text-[15px] text-slate-900 font-extrabold tracking-tight mb-3">
                    {item.model}
                  </h5>

                  {/* Bullet Tech specs */}
                  <ul className="text-[11px] text-gray-550 text-gray-500 font-semibold space-y-1 mb-4">
                    {item.specs.map((spec, sidx) => (
                      <li key={sidx} className="flex items-start gap-1">
                        <span className="text-[#006bd1] font-bold select-none shrink-0">•</span>
                        <span className="line-clamp-2 leading-tight">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Rental trigger btn */}
                <button
                  type="button"
                  disabled={isOut}
                  onClick={() => handleApplyClick(item)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isOut
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-[#004b93] active:scale-[0.98]'
                  }`}
                  id={`btn-rent-${item.id}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isOut ? '대여불가 (재고없음)' : '대여신청 자동입력'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredInventory.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 select-none border border-dashed border-gray-200 rounded-xl bg-slate-50">
            검색 결과에 맞는 장비가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
