/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { 
  FileDown, 
  Printer, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Undo, 
  CheckCircle2, 
  CheckSquare, 
  Square, 
  FileText, 
  ClipboardCheck, 
  Users, 
  ShieldCheck, 
  Upload, 
  X, 
  Award,
  BookOpen,
  Check,
  Flame,
  User,
  HelpCircle
} from 'lucide-react';

interface RentalFormProps {
  initialEquipment?: string;
  onShowToast: (msg: string) => void;
  loggedInUser?: { name: string; studentId: string; phone: string; department: string } | null;
  onSubmitSuccess?: (req: {
    applicantName: string;
    studentId: string;
    phone: string;
    department: string;
    advisor: string;
    purpose: string;
    rentalDate: string;
    returnDate: string;
    equipmentItemName: string;
    quantity: number;
    hasSigned: boolean;
  }) => void;
}

export default function RentalForm({ 
  initialEquipment = '', 
  onShowToast, 
  onSubmitSuccess,
  loggedInUser 
}: RentalFormProps) {
  // --- 공통 상태 및 탭 전환 ---
  const [activeFormTab, setActiveFormTab] = useState<'rental' | 'checklist' | 'assembly'>('rental');

  // --- 1. [공통 피상적 서명 패드 관리] ---
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // --- 드래그앤드롭 첨부파일 상태 ---
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // --- 2. [미디어 장비 대여 신청서 상태] ---
  const [applicant, setApplicant] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('디지털미디어콘텐츠전공');
  const [advisorName, setAdvisorName] = useState('');
  const [courseName, setCourseName] = useState('미디어스쿨 야외실습');
  const [rentalReason, setRentalReason] = useState('');
  const [startDate, setStartDate] = useState('2026-06-08');
  const [endDate, setEndDate] = useState('2026-06-10');
  const [isAdvisorStamped, setIsAdvisorStamped] = useState(false); // 교수님 온라인 도장 상태
  const [agreeRentalTerms, setAgreeRentalTerms] = useState(false);

  // 장비 대여 명세표 데이터베이스 (Image 3를 디지털화)
  const [rentalGears, setRentalGears] = useState<Array<{
    id: number;
    category: string;
    specs: string;
    assetNo: string;
    qty: number;
    charger: boolean;
    battery: boolean;
    lensCap: boolean;
    lensHood: boolean;
    checked: boolean;
  }>>([
    { id: 1, category: '캠코더 / 카메라', specs: initialEquipment || '소니 PXW-FX9 시네마 캠코더', assetNo: 'HL-MC-2024-0012', qty: 1, charger: true, battery: true, lensCap: true, lensHood: true, checked: true },
    { id: 2, category: 'SD카드 용량', specs: 'Extreme Pro 128GB', assetNo: 'A-SD802', qty: 1, charger: false, battery: false, lensCap: false, lensHood: false, checked: true },
    { id: 3, category: '삼각대', specs: '맨프로토 504HD 비디오 헤드 시스템', assetNo: 'HL-TR-0104', qty: 1, charger: false, battery: false, lensCap: false, lensHood: false, checked: true },
    { id: 4, category: '마이크 (마이크 건자산 X)', specs: '젠하이저 MKE-600 지향성 샷건', assetNo: '자산번호 없음', qty: 1, charger: false, battery: true, lensCap: false, lensHood: false, checked: false },
    { id: 5, category: '무선 리시버 / 마이크 세트', specs: '소니 UWP-D21 무선 와이어리스', assetNo: 'HL-WM-0089', qty: 1, charger: true, battery: true, lensCap: false, lensHood: false, checked: false },
    { id: 6, category: '짐벌 세트', specs: 'DJI Ronin 2 3축 짐벌 리그', assetNo: 'HL-GB-0021', qty: 1, charger: true, battery: true, lensCap: false, lensHood: false, checked: false },
    { id: 7, category: '조명 시스템', specs: 'Aputure C300d II 스튜디오 포커스', assetNo: 'HL-LT-0112', qty: 1, charger: true, battery: false, lensCap: false, lensHood: false, checked: false },
    { id: 8, category: '기타 구성품', specs: '멀티 SD카드 리더기 & 렌즈 클리너 세트', assetNo: '자산번호 없음', qty: 1, charger: false, battery: false, lensCap: false, lensHood: false, checked: false }
  ]);

  // --- 3. [미디어 장비 자가 체크리스트 상태] ---
  const [checklistDate, setChecklistDate] = useState('2026-06-08');
  const [checklistAuditor, setChecklistAuditor] = useState('이대여 조교 (장비지원실 대표)');
  const [checklistNotes, setChecklistNotes] = useState('');
  
  // 체크리스트 세부 점검 항목 (Image 1의 항목 완벽 수용)
  const [checklistStates, setChecklistStates] = useState({
    // 1) 캠코더
    camCrack: 'no',      // 깨진 부분이 있는가? (유/무)
    camStrap: 'yes',     // 가방 및 스트랩이 있는가? (있음/없음)
    camRecord: 'yes',    // RECORD 기능은 잘 되는가? (예/아니오)
    camAudio: 'yes',     // AUDIO LEVEL은 잘 뜨는가? (예/아니오)
    camZoom: 'yes',      // 줌인 줌아웃 작동여부? (예/아니오)
    camPlay: 'yes',      // 재생은 잘되는가? (예/아니오)
    camTouch: 'yes',     // 터치스크린 기능이 잘 되는가? (예/아니오)
    
    // 2) DSLR / 미러리스
    dslrCrack: 'no',     // 깨진 부분이 있는가? (유/무)
    dslrFocus: 'yes',    // 렌즈 줌 및 포커스가 부드럽게 움직이는가? (예/아니오)
    dslrShutter: 'yes',  // 셔터는 정상 작동되는가? (예/아니오)
    dslrAf: 'yes',       // AF 기능이 작동되는가? (예/아니오)

    // 3) 삼각대
    tripodCrack: 'no',   // 깨진 부분이 있는가? (있음/없음)
    tripodMove: 'yes',   // 상하조절 및 고정이 가능한가? (가능/불가능)
    tripodShoe: 'yes',   // 트라이포드 슈(플레이트)가 있는가? (있음/없음)

    // 4) 무선 / 건 마이크
    micCrack: 'no',      // 깨진 부분이 있는가? (있음/없음)
    micLevel: 'yes',     // 카메라 연결 시 오디오 LEVEL이 원활히 뜨는가? (예/아니오)
    micWind: 'yes',      // 핀마이크 윈드스크린이 포함되어 있는가? (있음/없음)
    micClip: 'yes',      // 핀마이크 옷깃 집게 클립이 포함되어 있는가? (있음/없음)

    // 5) 부속 자재
    accCrack: 'no',      // 깨진 부분이 있는가? (있음/없음)
    accWork: 'yes',      // 케이블 단자 접촉 등 정상 작동 여부? (예/아니오)
    accCables: 'yes'     // USB-C 여유 케이블 및 카드리더기 유무? (있음/없음)
  });

  // --- 4. [집회 신고서 상태] ---
  const [eventName, setEventName] = useState('');
  const [organizeGroup, setOrganizeGroup] = useState('');
  const [eventPurpose, setEventPurpose] = useState('');
  const [eventDateTime, setEventDateTime] = useState('2026-06-12 18:00 ~ 21:00');
  const [eventLocation, setEventLocation] = useState('커뮤니케이션동 2층 대강당 공용스튜디오');
  
  // 참여 인원
  const [participantStudents, setParticipantStudents] = useState(25);
  const [participantExternals, setParticipantExternals] = useState(0);
  const [participantFaculty, setParticipantFaculty] = useState(2);
  const totalParticipants = participantStudents + participantExternals + participantFaculty;

  // 장치 사용 여부
  const [useMic, setUseMic] = useState(true);
  const [useAmp, setUseAmp] = useState(true);
  const [useSound, setUseSound] = useState(true);
  const [useLighting, setUseLighting] = useState(false);
  const [useStage, setUseStage] = useState(false);

  // 안전확인사항
  const [stageSafetyCheck, setStageSafetyCheck] = useState<'이행' | '불이행' | '해당없음'>('이행');
  const [preventEduCheck, setPreventEduCheck] = useState<'실시' | '미실시'>('실시');
  const [extinguisherCheck, setExtinguisherCheck] = useState<'이행' | '불이행' | '해당없음'>('이행');
  const [agreeAssemblyTerms, setAgreeAssemblyTerms] = useState(false);

  // --- 5. [동기화 연계 및 캔버스 셋업] ---
  useEffect(() => {
    if (loggedInUser) {
      setApplicant(loggedInUser.name);
      setStudentId(loggedInUser.studentId);
      setPhone(loggedInUser.phone);
      setDepartment(loggedInUser.department);
    }
  }, [loggedInUser]);

  useEffect(() => {
    setupCanvas();
  }, [activeFormTab]);

  useEffect(() => {
    if (initialEquipment) {
      setRentalGears(prev => prev.map(item => {
        if (item.category === '캠코더 / 카메라') {
          return { ...item, specs: initialEquipment, checked: true };
        }
        return item;
      }));
    }
  }, [initialEquipment]);

  const setupCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    clearSignatureBoard();
  };

  // 마우스/터치 드로잉 기능
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCoordinates(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const clearSignatureBoard = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // --- 드래그 앤 드롭 업로드 핸들러 ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      const newFiles = files.map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onShowToast(`[${files[0].name}] 증빙 서류 파일이 성공적으로 감지 장착되었습니다.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newFiles = files.map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onShowToast(`[${files[0].name}] 파일 첨부 전송대기 등록 완료.`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    onShowToast('첨부 증빙이 제거되었습니다.');
  };

  // --- 6. [최종 전송 제출부] ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeFormTab === 'rental') {
      if (!applicant.trim() || !studentId.trim() || !phone.trim() || !advisorName.trim()) {
        onShowToast('경고: 미디어스쿨 대여자 학적정보를 모두 채워주십시오.');
        return;
      }
      if (!agreeRentalTerms) {
        onShowToast('이수동의 경고: 실습장비 대여 수칙 및 파손 보상조항에 동의하셔야 전송이 완료됩니다.');
        return;
      }
      if (!hasSigned) {
        onShowToast('수명 서명 경고: 개인정보 동의 및 대여자 하단 서명란에 직접 서명해 주시기 바랍니다.');
        return;
      }

      // 부모 콜백 연계 통지
      const activeGears = rentalGears.filter(g => g.checked);
      if (activeGears.length === 0) {
        onShowToast('경고: 명세표 목록에서 대여를 개시할 대상을 적어도 1개 이상 활성화(체크)하십시오.');
        return;
      }

      if (onSubmitSuccess) {
        activeGears.forEach(g => {
          onSubmitSuccess({
            applicantName: applicant,
            studentId,
            phone,
            department,
            advisor: advisorName + (isAdvisorStamped ? ' (온라인 결재필)' : ''),
            purpose: rentalReason || courseName,
            rentalDate: startDate,
            returnDate: endDate,
            equipmentItemName: g.specs,
            quantity: g.qty,
            hasSigned: true
          });
        });
      }
      onShowToast(`🎉 [온라인 대여 신청서 완료] 대여자명 {${applicant}}님 본부 접수 및 지도교수 승인이 통합 연동되었습니다.`);
      
    } else if (activeFormTab === 'checklist') {
      if (!applicant.trim() || !studentId.trim()) {
        onShowToast('경고: 체크리스트를 인가할 대여자 필수 성명과 학전을 입력해 주십시오.');
        return;
      }
      if (!hasSigned) {
        onShowToast('경고: 대여 전 기기 자가검증 무오류 보증을 위한 서명을 아래 완료하여 보증하십시오.');
        return;
      }
      onShowToast(`📂 [장비 체크리스트 전송성공] 대여 전 장비상태 자가검수가 완료되어 학과 서버 DB에 등록되었습니다.`);

    } else {
      // 집회 신고서 제출
      if (!eventName.trim() || !organizeGroup.trim() || !eventPurpose.trim() || !eventLocation.trim()) {
        onShowToast('경고: 교내 집회(촬영/행사) 신청 항목 및 주관단체명을 빠짐없이 메꿔주십시오.');
        return;
      }
      if (!agreeAssemblyTerms) {
        onShowToast('경고: 교내 안전 통제 지침 준수에 대한 조항에 동의하셔야 신고서 상신이 가능해집니다.');
        return;
      }
      if (!hasSigned) {
        onShowToast('경고: 안전책임 신청인 서명란에 디지털 확인 서명을 서명해 주십시오.');
        return;
      }
      onShowToast(`👮 [교내 집회신고서 정식접수] 행사명 [${eventName}]에 대한 안전 가동계획이 승인 접수대기 상태에 안착했습니다.`);
    }

    // 초기화 처리
    clearSignatureBoard();
  };

  // 장비 명세표 수량 및 체크 제어
  const toggleGearCheck = (id: number) => {
    setRentalGears(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const updateGearSpecs = (id: number, val: string) => {
    setRentalGears(prev => prev.map(item => item.id === id ? { ...item, specs: val } : item));
  };

  const updateGearAssetNo = (id: number, val: string) => {
    setRentalGears(prev => prev.map(item => item.id === id ? { ...item, assetNo: val } : item));
  };

  const updateGearQty = (id: number, qty: number) => {
    setRentalGears(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, qty) } : item));
  };

  const toggleGearOption = (id: number, field: 'charger' | 'battery' | 'lensCap' | 'lensHood') => {
    setRentalGears(prev => prev.map(item => item.id === id ? { ...item, [field]: !item[field] } : item));
  };

  return (
    <div className="w-full font-sans select-none text-slate-800 space-y-8" id="rental-forms-portal">
      
      {/* 상위 탭 네비게이터 바 (3개의 실물 서류 명칭 반영) */}
      <div className="bg-slate-100 hover:bg-slate-200/60 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1 select-none transition">
        <button
          type="button"
          onClick={() => {
            setActiveFormTab('rental');
            onShowToast('미디어 장비 대여 신청서 모드로 전환했습니다.');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFormTab === 'rental'
              ? 'bg-white text-[#006bd1] shadow-xs border border-slate-200/20'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>① 미디어 장비 대여 신청서</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveFormTab('checklist');
            onShowToast('미디어 장비 자가 체크리스트 모드로 전환했습니다.');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFormTab === 'checklist'
              ? 'bg-white text-[#006bd1] shadow-xs border border-slate-200/20'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 shrink-0" />
          <span>② 미디어 장비 자가 체크리스트</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveFormTab('assembly');
            onShowToast('교내 집회(단체 야외촬영) 신고서 모드로 전환했습니다.');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFormTab === 'assembly'
              ? 'bg-white text-[#006bd1] shadow-xs border border-slate-200/20'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>③ 교내 집회 신고서 (야외촬영)</span>
        </button>
      </div>

      {/* 실외 및 장비 가이드 경고 배너 */}
      <div className="border border-blue-100 bg-sky-50/50 rounded-2xl p-4.5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-[#006bd1]/10 flex items-center justify-center text-[#006bd1] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-xs text-slate-650 leading-relaxed font-semibold text-slate-600">
          <strong className="text-[#006bd1] font-extrabold flex items-center mb-0.5 text-sm">
            💡 한림대학교 미디어스쿨 디지털 서류 행정안내
          </strong>
          본 온라인 창단을 통해 작성 및 서명 제출하시는 서류들은 미디어스쿨 오프라인 대여명부와 100% 동일한 학칙 효력을 발휘합니다. 실습 장비 대여 48시간 엄수 및 반납 연체 페널티에 대비해 자가 체크 및 신고서를 정확한 성명으로 제출해 주시기 대여 시 권고 드립니다.
        </div>
      </div>

      {/* 메인 폼 전송 에이전트 */}
      <form onSubmit={handleFormSubmit} className="space-y-8 select-text">

        {/* ========================================================== */}
        {/* TAB 1: 미디어 장비 대여 신청서 */}
        {/* ========================================================== */}
        {activeFormTab === 'rental' && (
          <div className="space-y-6">
            
            {/* 실물 문서 디자인 헤더 카드 */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="text-center space-y-1.5 pb-4 border-b border-gray-100 relative">
                <span className="text-[10px] font-black text-slate-400 tracking-widest block uppercase">Hallym University Media School</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">미디어 장비 대여 신청서</h3>
                <div className="text-[10px] font-bold text-gray-500">장비 대여 기간은 1박 2일, 장비 대수는 1인당 1세트 원칙을 준수합니다.</div>

                {/* 우측 상단 가상 관리자 도장 */}
                <div className="absolute right-0 top-0 hidden md:flex flex-col items-center justify-center border-2 border-[#006bd1]/40 rounded-xl px-2.5 py-1 text-[#006bd1]/60 font-black text-[9px] rotate-6">
                  <span>미디어스쿨</span>
                  <span>대여전용</span>
                </div>
              </div>

              {/* 1. 신청자 기본 학적 및 장비 인가 사유 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5 uppercase">학과 (부서)</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                  >
                    <option value="디지털미디어콘텐츠전공">디지털미디어콘텐츠전공</option>
                    <option value="미디어커뮤니케이션전공">미디어커뮤니케이션전공</option>
                    <option value="언론방송콘텐츠전공">언론방송콘텐츠전공</option>
                    <option value="광고홍보학전공">광고홍보학전공</option>
                    <option value="콘텐츠크리에이터전공">콘텐츠크리에이터전공</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">학번 (사번)</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="예: 20257022"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">성명</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 김민우"
                    value={applicant}
                    onChange={(e) => setApplicant(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">연락처</label>
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">연계 교과목명</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 영상제작기초실무"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">대여 사유</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 기말 다큐멘터리 제작 주행 야외 촬영 실습"
                    value={rentalReason}
                    onChange={(e) => setRentalReason(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                  />
                </div>

                {/* 대여일시 범위 설정자 */}
                <div className="grid grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5">수령 희망 일자</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5">반납 예정 일자 (최대 48h)</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 2. 지도교수 모바일 간편 승인도장 란 (Image 3의 날인/도인 요약구조 구현) */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#006bd1] tracking-widest block uppercase">Dean Approval verification</span>
                  <div className="text-xs font-black text-slate-800">강의담당 / 지도교수 승인 확인절차</div>
                  <p className="text-[10.5px] text-slate-500 font-bold leading-normal">
                    장비 대여는 허가된 강의 수강 학생에 한정해 지도교수의 사전 확인(도장 혹은 모바일 인증)이 반드시 충족되어야 합니다.
                  </p>
                </div>

                <div className="flex items-center gap-3.5 bg-white border border-slate-200 rounded-xl p-3 shrink-0 self-start sm:self-center shadow-3xs">
                  <div className="text-right space-y-1">
                    <span className="block text-[10px] font-bold text-gray-400">교수명 기재</span>
                    <input
                      type="text"
                      required
                      placeholder="강미디 교수님"
                      value={advisorName}
                      onChange={(e) => setAdvisorName(e.target.value)}
                      className="w-24 text-[11px] font-black px-2 py-1 bg-slate-50 border border-gray-200 focus:outline-none rounded-md text-center"
                    />
                  </div>
                  
                  {/* 도장 승인 버튼 또는 실제 도장 인영 표출 */}
                  <div className="w-16 h-16 shrink-0 border border-dashed border-red-200 rounded-full flex flex-col items-center justify-center relative select-none bg-red-50/20">
                    {isAdvisorStamped ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdvisorStamped(false);
                          onShowToast('지도교수 도장 날인을 해제했습니다.');
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white/10 text-red-600 border-3 border-double border-red-500 font-extrabold text-[10.5px] rotate-12 transition transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                      >
                        <span className="text-[7.5px] leading-3">강미디</span>
                        <span className="border-t border-red-400 font-black text-[9px] leading-3">확 인</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (!advisorName.trim()) {
                            onShowToast('먼저 교과를 담당하시는 승인 교수 성명을 입력해 주세요.');
                            return;
                          }
                          setIsAdvisorStamped(true);
                          onShowToast(`[${advisorName}] 교수님 날인이 온라인으로 간편 연동 날인되었습니다.`);
                        }}
                        className="text-[9.5px] font-black text-red-500 underline decoration-dotted underline-offset-3 hover:text-red-700 transition cursor-pointer"
                      >
                        도장날인
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. 장비 대여 명세표 기입 바디 테이블 (Image 3의 복잡한 표 구조 완벽 웹앱식 치장) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">대여 희망 기기 및 세부 자재 인벤토리 명세 (기종 / 자산번호 / 구성품 체크)</h4>
                  <span className="text-[10px] font-extrabold text-[#006bd1] bg-sky-50 px-2.5 py-1 rounded-md">1박 2일 대여 기준</span>
                </div>

                <div className="overflow-x-auto border border-gray-100 rounded-2xl select-text">
                  <table className="w-full text-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-500 border-b border-gray-100 text-left">
                        <th className="py-3 px-4 w-12 text-center">선택</th>
                        <th className="py-3 px-3 w-40">장비 분류명</th>
                        <th className="py-3 px-3">기종 및 사양 구성품</th>
                        <th className="py-3 px-3 w-40">자산 분류번호</th>
                        <th className="py-3 px-3 w-28">신청수량</th>
                        <th className="py-3 px-3 w-32 hidden md:table-cell">제공 부속자재 체크</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {rentalGears.map((gear) => (
                        <tr key={gear.id} className={`hover:bg-slate-50/70 transition ${gear.checked ? 'bg-indigo-50/10' : 'opacity-60'}`}>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={gear.checked}
                              onChange={() => toggleGearCheck(gear.id)}
                              className="w-4 h-4 cursor-pointer accent-[#006bd1]"
                            />
                          </td>
                          <td className="py-3 px-3 font-black text-[11px] text-slate-800">
                            {gear.category}
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              disabled={!gear.checked}
                              value={gear.specs}
                              onChange={(e) => updateGearSpecs(gear.id, e.target.value)}
                              className="w-full text-xs font-bold px-2 py-1 border border-gray-200 bg-white/80 rounded focus:outline-none disabled:bg-slate-50/60 disabled:border-transparent"
                            />
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px]">
                            <input
                              type="text"
                              disabled={!gear.checked}
                              value={gear.assetNo}
                              onChange={(e) => updateGearAssetNo(gear.id, e.target.value)}
                              className="w-full text-[10.5px] font-semibold px-2 py-1 border border-gray-200 bg-white/80 rounded font-mono disabled:bg-slate-50/60 disabled:border-transparent"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                disabled={!gear.checked}
                                value={gear.qty}
                                onChange={(e) => updateGearQty(gear.id, parseInt(e.target.value) || 1)}
                                className="w-12 text-center text-xs font-black py-1 px-1 border border-gray-200 rounded disabled:opacity-40"
                              />
                              <span className="font-bold text-gray-400 text-[10px]">세트</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 hidden md:table-cell">
                            {/* 부속자재 수령 유무 라벨 */}
                            <div className="flex gap-2 text-[10px]">
                              {gear.category.includes('카메라') || gear.category.includes('캠코더') || gear.category.includes('와이어리스') || gear.category.includes('짐벌') || gear.category.includes('조명') ? (
                                <>
                                  <button
                                    type="button"
                                    disabled={!gear.checked}
                                    onClick={() => toggleGearOption(gear.id, 'charger')}
                                    className={`px-1.5 py-0.5 rounded border ${gear.charger ? 'bg-blue-50 text-[#006bd1] border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                  >
                                    충전기
                                  </button>
                                  <button
                                    type="button"
                                    disabled={!gear.checked}
                                    onClick={() => toggleGearOption(gear.id, 'battery')}
                                    className={`px-1.5 py-0.5 rounded border ${gear.battery ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                  >
                                    배터리
                                  </button>
                                </>
                              ) : gear.category.includes('삼각대') ? (
                                <span className="text-gray-400 font-medium">플레이트 포함</span>
                              ) : (
                                <span className="text-gray-400 font-medium">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. 장비 대여 시 서약수준 의무 동의서 조율 */}
              <div className="border border-red-100 bg-rose-50/50 rounded-2xl p-5 space-y-3.5 select-text">
                <span className="text-[11px] font-black text-rose-600 tracking-widest block uppercase">Responsibility terms</span>
                <span className="font-black text-slate-900 border-b border-rose-200/50 pb-1.5 block text-xs sm:text-xs">
                  장비 대여 시 주의사항 및 대여자 연대 배상책임 서약 (필독!)
                </span>
                
                <ul className="text-[10px] sm:text-[10.5px] text-slate-600 space-y-2 list-decimal list-inside font-bold leading-relaxed">
                  <li>장비대여 수령 시 반드시 해당 기자재의 <strong className="text-slate-800">외관 스크래치, 배터리 충하전도, 렌즈 포커스</strong> 정상 주행을 현장 지원 조교 면전에서 직접 확인해야 대여 배치가 완결됩니다.</li>
                  <li>대여 도중 사용자 부주의로 인한 파손, 침수, 분실 사고가 일어날 시, 한림대학교 미디어스쿨 학칙 의거 <strong className="text-red-600">사용자 학생 전액 현물보존 및 복구 실비 배상</strong> 책임이 엄밀히 명시됩니다.</li>
                  <li>대여 기한(최대 48시간) 연체 시, 1일 위반 경고 조치되며, <strong className="text-red-500">2일 누적 연체 시 해당 학기 미디어스쿨 전체 장비 대여 및 공용 스터디룸 출입 인가증이 60일간 정지</strong>당하게 됩니다.</li>
                  <li>온라인 날인이 어려운 경우 교수님의 허가 확인 이메일 내역을 PDF 캡처하여 아래 증빙자료 첨부 패드에 첨부해 명시해야 합니다.</li>
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    setAgreeRentalTerms(!agreeRentalTerms);
                    onShowToast(agreeRentalTerms ? '지침 동의를 취소하셨습니다.' : '대여 지침에 정령 동의하셨습니다.');
                  }}
                  className="flex items-start gap-2.5 w-full text-left p-3.5 bg-white border border-rose-100 rounded-xl hover:border-red-400 transition cursor-pointer"
                >
                  <div className="shrink-0 mt-0.5 text-red-500">
                    {agreeRentalTerms ? (
                      <CheckSquare className="w-5 h-5 fill-current text-red-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="text-xs font-black text-rose-800 leading-snug">
                    <span>상기 한림대학교 미디어스쿨 대여 규정집 주의사항을 충분히 숙지하였으며, 대여자 연대책임을 수락 이행하겠습니다.</span>
                    <span className="block text-red-500 text-[10px] font-extrabold mt-1">위 중대 규정에 확실히 전원 동의 승인합니다. [필수체크]</span>
                  </div>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: 미디어 장비 자가 체크리스트 */}
        {/* ========================================================== */}
        {activeFormTab === 'checklist' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="text-center space-y-1.5 pb-4 border-b border-gray-100 relative">
                <span className="text-[10px] font-black text-slate-400 tracking-widest block uppercase">Media Equipment Checklist</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">미디어 장비 자가 체크리스트</h3>
                <div className="text-[10px] font-bold text-gray-500">수령 후 대여 전 / 반납 전 장비의 상태를 직접 체크하여 불필요한 과실 오해를 미리 제거합니다.</div>
              </div>

              {/* 기본 요건 분석 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-1">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">체크 대여일시</label>
                  <input
                    type="date"
                    value={checklistDate}
                    onChange={(e) => setChecklistDate(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">대여자 학번</label>
                  <input
                    type="text"
                    required
                    placeholder="20257022"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">대여자 성명</label>
                  <input
                    type="text"
                    required
                    placeholder="김민우"
                    value={applicant}
                    onChange={(e) => setApplicant(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">장비 인도/확수 조교</label>
                  <input
                    type="text"
                    value={checklistAuditor}
                    onChange={(e) => setChecklistAuditor(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              {/* 본격 체크리스트 하이 테크 블록 (Image 1 양식 디지털 고밀도 가동) */}
              <div className="space-y-5 border-t border-gray-100 pt-4">
                
                {/* 1) 캡코더 */}
                <div className="bg-slate-50/50 border border-gray-100 rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-xs font-black text-[#006bd1] flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 bg-[#006bd1] rounded-full" />
                      ★ 캡코더 검수 (Sony PXW-FX9, PXW-Z190 등 크루 카메라 기종 캠)
                    </span>
                    <span className="text-[9.5px] font-black text-gray-400">대여 전 상태 자가 확인</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">1. 외형: 바디 케이스, 필터 및 깨진 조인트가 있는가?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camCrack: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camCrack === 'yes' ? 'bg-amber-100 text-amber-850 border border-amber-300' : 'bg-slate-100 text-slate-400'}`}
                        >
                          있음
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camCrack: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camCrack === 'no' ? 'bg-[#006bd1] text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          없음
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">2. 외형: 캡코더 어깨끈(스트랩) 조인트 걸이가 양호한가?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camStrap: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camStrap === 'yes' ? 'bg-[#006bd1] text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          있음
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camStrap: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camStrap === 'no' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'}`}
                        >
                          없음
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">3. 기능: RECORD 버튼 제어 및 적색 레코딩 기능 동작?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camRecord: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camRecord === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camRecord: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camRecord === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">4. 기능: XLR 마이크단자 삽입 시 AUDIO LEVEL 미터 반응?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camAudio: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camAudio === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camAudio: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camAudio === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">5. 기능: 줌인(T-W rocker) 부드러운 전동 줌 제비 작동?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camZoom: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camZoom === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camZoom: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camZoom === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">6. 기능: 뷰파인더 모니터 재생(PLAY / STOP)이 원동함?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camPlay: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camPlay === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, camPlay: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.camPlay === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2) DSLR / 미러리스 */}
                <div className="bg-slate-50/50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
                      ★ DSLR / 미러리스 검수 (소니 A7S3, FX3 등 보정용 스틸 렌즈 바디)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">1. 외형: 마운트 및 렌즈 보호필터 파손이 있는가?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrCrack: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrCrack === 'yes' ? 'bg-amber-100 text-amber-850 border border-amber-300' : 'bg-slate-100 text-slate-400'}`}
                        >
                          있음
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrCrack: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrCrack === 'no' ? 'bg-[#006bd1] text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          없음
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">2. 기능: 경통 줌 링 및 수동 초점 링 주행이 부드러운가?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrFocus: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrFocus === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrFocus: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrFocus === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">3. 기능: 릴리즈 반셔터 클릭 가압 및 고압 셔터 동작?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrShutter: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrShutter === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrShutter: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrShutter === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">4. 기능: 렌즈 오토포커싱(AF-C / Eye AF) 반응 유효성?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrAf: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrAf === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          예
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, dslrAf: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.dslrAf === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3) 삼각대 */}
                <div className="bg-slate-50/50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-xs font-black text-amber-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                      ★ 삼각대 검수 (맨프로토, 리베크 등 고중량 비디오 삼각 헤드 레그)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">1. 외형: 알루미늄 다리 조인트 및 잠금 레버 탈골이 있는가?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, tripodCrack: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.tripodCrack === 'yes' ? 'bg-amber-100 text-amber-850 border border-amber-300' : 'bg-slate-100 text-slate-400'}`}
                        >
                          있음
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, tripodCrack: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.tripodCrack === 'no' ? 'bg-[#006bd1] text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          없음
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150">
                      <span className="font-extrabold text-slate-700">2. 작동여부: 팬 바(Pan bar) 결체 및 상하 각도 고정이 원활한가?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, tripodMove: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.tripodMove === 'yes' ? 'bg-[#006bd1] text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          가능
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, tripodMove: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.tripodMove === 'no' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'}`}
                        >
                          불가능
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-150 md:col-span-2">
                      <span className="font-extrabold text-slate-700">3. 슈: 카메라 하판과 맞닿는 정품 플레이트(트라이포드 퀵 슈) 탑재?</span>
                      <div className="flex gap-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, tripodShoe: 'yes'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.tripodShoe === 'yes' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          있음
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistStates(p => ({...p, tripodShoe: 'no'}))}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${checklistStates.tripodShoe === 'no' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          없음
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="bg-slate-50/50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-xs font-black text-rose-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 bg-[#006bd1] rounded-full" />
                      ★ 마이크 / 동조자재 검수 (와이어리스, XLR 유선 붐 마이크 라인)
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold">핀마이크 보호 슬리브 파손 혹은 클립 누락이 발생하지 않았는지 가점하여 체크하십시오.</p>
                </div>

              </div>

              {/* 반납 위반 적사란 */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">장비 이상 및 부품 유실 특이 사항 (기입 불철 시 대여자 본부 과실 처리)</label>
                <textarea
                  rows={3}
                  placeholder="대여 시 기스나 먼지, 삼각대 슈 고무 헐거움 등 미세한 흠결 발생 기록을 이곳에 적어 보전하십시오..."
                  value={checklistNotes}
                  onChange={(e) => setChecklistNotes(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-slate-50 hover:bg-slate-100/40 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006bd1] transition"
                />
              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: 교내 집회 신고서 (야외촬영 공지) */}
        {/* ========================================================== */}
        {activeFormTab === 'assembly' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
              
              {/* 결재 도장 인영 그리드 (Image 2의 상단 결재 레일 시뮬레이터) */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-black text-[#006bd1] tracking-widest block uppercase">Hallym On-campus Assembly Notification</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">집회 신고서(교내 야외촬영)</h3>
                  <div className="text-[10px] font-bold text-gray-500">정규 단체 야외 촬영이나 대형 스튜디오 7인 이상 소집 시 학교 안전계에 사전 신고서 승인을 득합니다.</div>
                </div>

                {/* 결재선 그리드 박스 구조 (Image 2의 결재 사각틀 재현) */}
                <div className="flex border border-gray-200 rounded-xl overflow-hidden self-start shrink-0 font-sans text-[10px] bg-slate-50 text-slate-500 shadow-3xs">
                  <div className="flex flex-col border-r border-gray-200 text-center w-10 py-1 bg-slate-100 justify-center font-bold">
                    <span>결</span>
                    <span>재</span>
                  </div>
                  <div className="flex flex-col w-16 border-r border-gray-200 text-center py-1">
                    <span className="border-b border-gray-150 pb-1 font-bold">경유(조교)</span>
                    <span className="h-8 flex items-center justify-center text-emerald-600 font-extrabold text-[9px]">검토완료</span>
                  </div>
                  <div className="flex flex-col w-16 border-r border-gray-200 text-center py-1">
                    <span className="border-b border-gray-150 pb-1 font-bold">지도교수</span>
                    <span className="h-8 flex items-center justify-center text-red-500 font-extrabold text-[9px] scale-90">강미디(인)</span>
                  </div>
                  <div className="flex flex-col w-16 border-r border-gray-200 text-center py-1">
                    <span className="border-b border-gray-150 pb-1 font-bold">학부(과)장</span>
                    <span className="h-8 flex items-center justify-center text-[#006bd1] font-extrabold text-[9px]">자동가결</span>
                  </div>
                  <div className="flex flex-col w-16 text-center py-1">
                    <span className="border-b border-gray-150 pb-1 font-bold">학생지원팀</span>
                    <span className="h-8 flex items-center justify-center text-slate-400 font-extrabold text-[9px] animate-pulse">결재대기</span>
                  </div>
                </div>
              </div>

              {/* 입력 섹션 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">행사명 (프로젝트명)</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 미디어스쿨 캡스톤 다큐멘터리 캠퍼스 야외촬영"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">주관 단체명 (동아리/학회명)</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 미디어스쿨 다큐학회 '인장'"
                    value={organizeGroup}
                    onChange={(e) => setOrganizeGroup(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">학사 야외집회 목적</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 학부 졸업 다큐멘터리를 위해 한림대 일송기념도서관 앞 광장 야외 촬영 허가 및 소환 협력"
                    value={eventPurpose}
                    onChange={(e) => setEventPurpose(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">행사 일시 (정확한 시간 기입)</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 2026년 6월 12일 13:00 ~ 18:00 (5시간)"
                    value={eventDateTime}
                    onChange={(e) => setEventDateTime(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1.5">행사 및 소환 장소</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 일송기념도서관 앞 원형 잔디 광장 및 대학본부 데크"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 참가인원 산식 패키지 (Image 2 중간 Participant 항목 구현) */}
              <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4.5 space-y-3.5 select-text">
                <span className="text-[10px] font-black text-[#006bd1] tracking-widest block uppercase">Participant detail counts</span>
                <span className="text-xs font-black text-slate-800">참가 인원 설정 명세 (자동 합산 지원)</span>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center space-y-1">
                    <span className="text-[10px] font-bold text-gray-400">교내 재학생 수</span>
                    <input
                      type="number"
                      min="1"
                      value={participantStudents}
                      onChange={(e) => setParticipantStudents(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-black text-center border-b border-slate-200 pb-0.5 focus:outline-none focus:border-[#006bd1]"
                    />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center space-y-1">
                    <span className="text-[10px] font-bold text-gray-400">외부 참관인 수</span>
                    <input
                      type="number"
                      min="0"
                      value={participantExternals}
                      onChange={(e) => setParticipantExternals(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-black text-center border-b border-slate-200 pb-0.5 focus:outline-none focus:border-[#006bd1]"
                    />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center space-y-1">
                    <span className="text-[10px] font-bold text-gray-400">지도 교수/교직원</span>
                    <input
                      type="number"
                      min="0"
                      value={participantFaculty}
                      onChange={(e) => setParticipantFaculty(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-black text-center border-b border-slate-200 pb-0.5 focus:outline-none focus:border-[#006bd1]"
                    />
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-center flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-[#006bd1]">총 인원 합계</span>
                    <span className="text-base font-black text-[#006bd1] tracking-tight">{totalParticipants} 명</span>
                  </div>
                </div>
              </div>

              {/* 사용 유무 설비 토글 */}
              <div className="space-y-2">
                <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-widest">설비 및 마이크 사용여부 (O / X 체크)</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs select-none">
                  {[
                    { label: '🎤 마이크 설비', var: useMic, set: setUseMic },
                    { label: '🔊 대형 앰프', var: useAmp, set: setUseAmp },
                    { label: '🎵 입체 음향', var: useSound, set: setUseSound },
                    { label: '💡 야외 조명', var: useLighting, set: setUseLighting },
                    { label: '⛺ 가설 무대', var: useStage, set: setUseStage }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => item.set(!item.var)}
                      className={`flex justify-between items-center px-3.5 py-2.5 rounded-xl border font-black transition cursor-pointer ${
                        item.var 
                          ? 'bg-[#006bd1] text-white border-[#006bd1] shadow-2xs' 
                          : 'bg-slate-50 text-slate-400 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span>{item.var ? 'O' : 'X'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 안전확인사항 의무 체크사항 (Image 2 하단 규산 실리콘화) */}
              <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-black text-[#006bd1] tracking-widest block uppercase">Safety guidelines</span>
                <span className="font-black text-slate-850 block text-xs border-b border-slate-200 pb-1">
                  안전 확인 가동 사항 체크 (해당되는 곳에 라디오 선택)
                </span>

                <div className="space-y-3.5 text-xs text-slate-700">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-150">
                    <span className="font-extrabold text-slate-700">1. 행사 무대 및 촬영 장비 낙하/전도 위험 안전 점검 여부</span>
                    <div className="flex gap-1.5 shrink-0">
                      {(['이행', '불이행', '해당없음'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setStageSafetyCheck(opt)}
                          className={`px-3 py-1.5 font-bold text-[10px] rounded-lg transition border ${stageSafetyCheck === opt ? 'bg-[#006bd1] text-white border-[#006bd1]' : 'bg-slate-100 text-slate-400 border-transparent'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-150">
                    <span className="font-extrabold text-slate-700">2. 참여 학생 대상 폭력/인권 침해 방지 & 음주 예방 사전 교육 실시 여부</span>
                    <div className="flex gap-1.5 shrink-0">
                      {(['실시', '미실시'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setPreventEduCheck(opt)}
                          className={`px-3 py-1.5 font-bold text-[10px] rounded-lg transition border ${preventEduCheck === opt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-400 border-transparent'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-150">
                    <span className="font-extrabold text-slate-700">3. 가설 배선 보호 커버 트랙 및 현장 소화기(A/B/C급) 필수 소치 비치 여부</span>
                    <div className="flex gap-1.5 shrink-0">
                      {(['이행', '불이행', '해당없음'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setExtinguisherCheck(opt)}
                          className={`px-3 py-1.5 font-bold text-[10px] rounded-lg transition border ${extinguisherCheck === opt ? 'bg-[#006bd1] text-white border-[#006bd1]' : 'bg-slate-100 text-slate-400 border-transparent'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 집회 동의조항 */}
                <button
                  type="button"
                  onClick={() => setAgreeAssemblyTerms(!agreeAssemblyTerms)}
                  className="flex items-start gap-2.5 w-full text-left p-3.5 bg-white border border-gray-200 hover:border-blue-400 rounded-xl transition mt-2 cursor-pointer"
                >
                  <div className="shrink-0 mt-0.5 text-[#006bd1]">
                    {agreeAssemblyTerms ? (
                      <CheckSquare className="w-5 h-5 fill-current text-[#006bd1]" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="text-xs font-black text-slate-700 leading-snug">
                    <span>본 신청 단체는 집회(야외 대형 촬영) 중 일어나는 쓰레기 분리 배출 및 소음 소거, 화재 예방 방벽 조율에 관한 한림 학칙의 명령을 준수할 것을 다짐합니다.</span>
                    <span className="block text-blue-600 text-[10px] font-black mt-1">상기 교내 규정에 확실히 동의합니다. [필수체크]</span>
                  </div>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* [공통 서명 그리기 패키지 및 드래그앤드롭 첨부파일] */}
        {/* ========================================================== */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#006bd1] rounded-full inline-block animate-pulse" />
            ④ 디지털 서명 작성 및 첨부파일 증빙 (공통)
          </h4>

          {/* 인반 드래그앤드롭 파일 업로더 구비 (Image 1, 2, 3 요건 서류 첨부 증빙 조율) */}
          <div className="space-y-3.5 select-none">
            <span className="block text-[11px] font-black text-slate-600">
              추가 증빙 서류 첨부 레일 (지도교수 허가 메일 캡처, 외부 협조 명부 등)
            </span>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                isDragActive 
                  ? 'border-[#006bd1] bg-[#006bd1]/5' 
                  : 'border-slate-300 hover:border-[#006bd1] bg-slate-50 hover:bg-white'
              }`}
            >
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-[#006bd1] scale-110' : 'text-slate-400'} transition duration-200`} />
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold text-slate-800">마우스로 허가서류 파일을 끌어놓거나 클릭하여 수동 지정 첨부하세요.</p>
                <p className="text-[10.5px] text-gray-400 font-semibold">동작 지원 문서 리스트 : JPG, PNG, PDF, DOCX (최대 10MB 가능)</p>
              </div>
              <input
                type="file"
                id="digital-file-file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <label 
                htmlFor="digital-file-file" 
                className="text-[10px] font-black text-white bg-[#1e293b] hover:bg-slate-800 px-3.5 py-2 rounded-xl transition cursor-pointer inline-block"
              >
                디스크 파일 탐색기 열기
              </label>
            </div>

            {/* 업로드된 파일 리스트 */}
            {uploadedFiles.length > 0 && (
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-2 select-text">
                <span className="text-[10px] font-black text-slate-500 block">장착 완료 증빙 파일 명세</span>
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-white border border-gray-150 p-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#006bd1]" />
                      <span className="font-extrabold text-slate-700">{f.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">({f.size})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(i)} 
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-gray-100 pt-5">
            
            {/* 실시간 그리기 패드 장전 */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-slate-700">
                디지털 사인(서명값) 직접 쓰기 <span className="text-amber-500 font-extrabold">*</span>
              </label>
              
              <div className="relative border border-slate-300 rounded-2xl overflow-hidden bg-slate-50 h-36 mx-auto w-full max-w-[400px]">
                <canvas
                  ref={signatureCanvasRef}
                  width={380}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full block cursor-crosshair bg-white touch-none"
                  id="final-signature-draw-board"
                />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                  {hasSigned && (
                    <button
                      type="button"
                      onClick={() => {
                        clearSignatureBoard();
                        onShowToast('소인 서명이 안전히 정화되었습니다.');
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-gray-600 font-extrabold px-2 py-1 rounded-lg transition shrink-0 cursor-pointer"
                    >
                      다시 쓰기
                    </button>
                  )}
                  <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md ${
                    hasSigned ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-500'
                  }`}>
                    {hasSigned ? '인증서 가조정' : '필수 서약대기'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] border border-slate-200/50 rounded-2xl text-xs space-y-2 text-slate-650 leading-relaxed font-semibold">
              <div className="font-black text-[#006bd1] text-[13px] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>승인 이행 제출 프로세스</span>
              </div>
              <p className="font-semibold"><strong className="text-slate-800">STEP 1.</strong> 상단 탭에서 필요한 서류 목적에 맞는 행정 포맷 토글</p>
              <p className="font-semibold"><strong className="text-slate-800">STEP 2.</strong> 학번 및 성명 가점, 지도교수 도장 및 자가체크 실시</p>
              <p className="font-semibold"><strong className="text-slate-800">STEP 3.</strong> 소속 안전 서약 동의 및 공통 드로잉 서명 완료</p>
              <p className="font-semibold"><strong className="text-slate-800">STEP 4.</strong> 하단 온라인 정식 접수 전송 클릭</p>
            </div>

          </div>

        </div>

        {/* 최하단 제출 및 출력 액션 허브 레일 */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-3 select-none">
          <button
            type="button"
            onClick={() => {
              window.print();
              onShowToast('작성하신 디지털 서류 양식이 PDF 원본 해상도로 준비 전송되었습니다.');
            }}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-gray-200 active:scale-95"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>신청 행정양식 인쇄 및 PDF 저장</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#006bd1] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {activeFormTab === 'rental' && '온라인 대여 신청서 정식 상신'}
              {activeFormTab === 'checklist' && '수령전 자가 체크리스트 전송'}
              {activeFormTab === 'assembly' && '교내 집회(촬영) 계획서 상신'}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
}
