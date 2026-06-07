/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { FileDown, Printer, AlertCircle, Edit, Trash2, Undo, CheckCircle2, CheckSquare, Square } from 'lucide-react';

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
  // Signature Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Form Fields State
  const [applicant, setApplicant] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('미디어스쿨');
  const [advisor, setAdvisor] = useState('');
  const [purpose, setPurpose] = useState('');
  const [rentalDate, setRentalDate] = useState('2026-06-08');
  const [returnDate, setReturnDate] = useState('2026-06-10');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Selected Equipment Rows
  const [selectedGears, setSelectedGears] = useState<Array<{ name: string; qty: number }>>([
    { name: initialEquipment || '소니 PXW-FX9 시네마 캠코더', qty: 1 }
  ]);

  // Synchronize initial equipment if passed down
  useEffect(() => {
    if (initialEquipment) {
      const alreadyListed = selectedGears.find(g => g.name === initialEquipment);
      if (!alreadyListed) {
        setSelectedGears([{ name: initialEquipment, qty: 1 }]);
      }
    }
  }, [initialEquipment]);

  // Synchronize applicant form inputs with logged in session
  useEffect(() => {
    if (loggedInUser) {
      setApplicant(loggedInUser.name);
      setStudentId(loggedInUser.studentId);
      setPhone(loggedInUser.phone);
      setDepartment(loggedInUser.department);
    }
  }, [loggedInUser]);

  // Signature board canvas setup & actions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard high-DPI scaling
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
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

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    onShowToast('서명이 초기화되었습니다.');
  };

  // Add equipment slot
  const handleAddEquipmentRow = () => {
    setSelectedGears([...selectedGears, { name: '소니 PXW-FX9 시네마 캠코더', qty: 1 }]);
  };

  // Modify slot
  const handleUpdateGearName = (index: number, name: string) => {
    const updated = [...selectedGears];
    updated[index].name = name;
    setSelectedGears(updated);
  };

  const handleUpdateGearQty = (index: number, qty: number) => {
    const updated = [...selectedGears];
    updated[index].qty = Math.max(1, qty);
    setSelectedGears(updated);
  };

  const handleRemoveGearRow = (index: number) => {
    const updated = selectedGears.filter((_, i) => i !== index);
    setSelectedGears(updated.length ? updated : [{ name: '소니 PXW-FX9 시네마 캠코더', qty: 1 }]);
  };

  // Submit Application
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicant.trim() || !studentId.trim() || !phone.trim() || !advisor.trim()) {
      onShowToast('경고: 필수 학적 항목들을 모두 정확하게 기입해 주세요.');
      return;
    }

    if (!agreeTerms) {
      onShowToast('오류: 미디어 실습 대여 규정 사항 준수 동의를 선택하셔야 제출이 가능합니다.');
      return;
    }

    if (!hasSigned) {
      onShowToast('경고: 서명란에 학생 서명 작성을 완료해 주세요.');
      return;
    }

    // 부모에 전달
    if (onSubmitSuccess) {
      selectedGears.forEach((gear) => {
        onSubmitSuccess({
          applicantName: applicant,
          studentId,
          phone,
          department,
          advisor,
          purpose: purpose || '융합 이미징 장비 실습',
          rentalDate,
          returnDate,
          equipmentItemName: gear.name,
          quantity: gear.qty,
          hasSigned: true,
        });
      });
      onShowToast(`🎉 대여 신청 완료! [${applicant}님]의 대여 접수가 승인 대기 상태로 활성화되었습니다.`);
    }
  };

  return (
    <div className="w-full font-sans select-none text-slate-800">
      <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-750 text-slate-700 leading-relaxed font-semibold">
          <strong className="text-amber-700 font-extrabold flex items-center mb-0.5">대여 전 필수 지침 사항</strong>
          대여를 원하시는 모든 장비는 본 신청서에 작성된 항목에 한하여 대여 및 수령이 가능합니다. 임의 장비 무단 교체가 발견될 경우 다음 학기 미디어스쿨 센터 이용이 전면 금지되오니 유의해주시기 바랍니다.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Student Metadata Inform */}
        <div className="bg-slate-50 border border-gray-100 rounded-xl p-5 shadow-xs">
          <h4 className="text-sm font-extrabold text-[#006bd1] tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#006bd1] rounded-full inline-block" />
            1. 신청 학적 정보 입력
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Applicant Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                신청자명 <span className="text-amber-500 font-extrabold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 홍길동"
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                학번 (Student ID) <span className="text-amber-500 font-extrabold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 20242201"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
              />
            </div>

            {/* Phone contact */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                연락처 <span className="text-amber-500 font-extrabold">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="예: 010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">소속 학과</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
              >
                <option>미디어스쿨 (Media School)</option>
                <option>콘텐츠크리에이터전공</option>
                <option>디지털미디어콘텐츠전공</option>
                <option>언론방송콘텐츠전공</option>
                <option>광고홍보학전공</option>
              </select>
            </div>

            {/* Advisor Signature approval */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                지도교수 정보 <span className="text-amber-500 font-extrabold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 강미디 교수님"
                value={advisor}
                onChange={(e) => setAdvisor(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
              />
            </div>

            {/* Rental Date picker ranges */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">대여 희망 날짜</label>
                <input
                  type="date"
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-2 bg-white border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">반납 예정 날짜</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-2 bg-white border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">제작 목적 / 수업 과제 명칭</label>
            <input
              type="text"
              placeholder="예: 미디어제작기초 단편 영화 기말과제 실습 촬영"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
            />
          </div>
        </div>

        {/* Step 2: Equipment Picker table list */}
        <div className="bg-slate-50 border border-gray-100 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-extrabold text-[#006bd1] tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#006bd1] rounded-full inline-block" />
              2. 대여 신청 기기 및 수량 지정
            </h4>
            <button
              type="button"
              onClick={handleAddEquipmentRow}
              className="text-xs bg-[#006bd1]/10 text-[#006bd1] hover:bg-[#006bd1]/20 font-bold px-3 py-1.5 rounded-lg transition overflow-hidden cursor-pointer shrink-0"
            >
              + 항목 추가
            </button>
          </div>

          <div className="space-y-2.5">
            {selectedGears.map((gear, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-white border border-gray-200 p-2 rounded-lg">
                <div className="flex-1">
                  <select
                    value={gear.name}
                    onChange={(e) => handleUpdateGearName(idx, e.target.value)}
                    className="w-full text-xs font-bold px-2 py-1.5 bg-slate-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#006bd1]"
                  >
                    <option>소니 PXW-FX9 시네마 캠코더</option>
                    <option>아리 알렉사 미니 LF</option>
                    <option>디제이아이 로닌 4D 짐벌 카메라</option>
                    <option>소형직교리그 RB-100</option>
                    <option>수평리그 3D SXS RIG (micro)</option>
                    <option>직교(수평 겸용)리그 Hurricane 3D RIG (Genus)</option>
                    <option>3D모니터 SDM-080 SDI</option>
                    <option>SDC-S200 (Redrover)</option>
                  </select>
                </div>

                <div className="w-24 shrink-0 flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={gear.qty}
                    onChange={(e) => handleUpdateGearQty(idx, parseInt(e.target.value) || 1)}
                    className="w-14 text-center text-xs font-bold px-1.5 py-1.5 border border-gray-200 bg-slate-50 rounded"
                  />
                  <span className="text-xs font-semibold text-gray-500">대</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveGearRow(idx)}
                  className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded cursor-pointer transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Signature Canvas box drawing */}
        <div className="bg-slate-50 border border-gray-100 rounded-xl p-5 shadow-xs">
          <h4 className="text-sm font-extrabold text-[#006bd1] tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#006bd1] rounded-full inline-block" />
            3. 서약 확인 및 디지털 소속 서명
          </h4>

          {/* Terms Agreement checklist button styled nicely */}
          <button
            type="button"
            onClick={() => setAgreeTerms(!agreeTerms)}
            className="flex items-start gap-2.5 w-full text-left p-3.5 bg-white border border-gray-200 rounded-lg hover:border-[#006bd1] transition mb-5 cursor-pointer"
          >
            <div className="shrink-0 mt-0.5 text-[#006bd1]">
              {agreeTerms ? (
                <CheckSquare className="w-5 h-5 fill-current text-[#006bd1]" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
              <span>본인은 한림대학교 미디어스쿨 실습 장비 대여 기한(최대 48시간)과 반납 위반 벌점 규정을 명확하게 수지하였으며, 대여 중 파손이 발생할 시 부가되는 복구 실비 보상에 적극 협조할 것을 엄숙히 선언합니다.</span>
              <span className="block text-amber-600 text-xs font-extrabold mt-1.5">위 조항에 명확히 동의합니다 (필수체크)</span>
            </div>
          </button>

          {/* Canvas Board drawing component setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                서명 패드 그리기 <span className="text-amber-500 font-extrabold">*</span>
              </label>
              <p className="text-[11px] text-gray-400 mb-2 font-medium leading-normal">
                서명란 영역 안에 마우스 버튼이나 터치 펜/손가락을 대고 직접 서명(싸인)을 그려 입력하십시오.
              </p>
              
              <div className="relative border border-slate-300 rounded-lg overflow-hidden bg-white shadow-inner select-none h-40">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={158}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full block cursor-crosshair touch-none"
                  id="signature-canvas"
                />

                {/* Status indicator on canvas absolute absolute */}
                <div className="absolute top-2 right-2 flex gap-1.5 z-10 select-none">
                  {hasSigned && (
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-gray-600 font-extrabold px-2 py-1 rounded transition cursor-pointer"
                    >
                      지우기
                    </button>
                  )}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    hasSigned ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-500'
                  }`}>
                    {hasSigned ? '서명입력완료' : '서명 전'}
                  </span>
                </div>
              </div>
            </div>

            {/* Guide details panel */}
            <div className="p-4 bg-white/60 border border-gray-100 rounded-lg text-xs leading-relaxed text-gray-500 select-none space-y-1.5">
              <span className="font-extrabold text-[#006bd1] text-[13px] flex items-center mb-1">접수 이행 절차</span>
              <p className="font-semibold"><strong className="text-gray-700">STEP 1.</strong> 기기 인벤토리 조회 및 자동 지정 서식 기입</p>
              <p className="font-semibold"><strong className="text-gray-700">STEP 2.</strong> 지도교수 승인 메일 캡처본 또는 신청 명부 일치화</p>
              <p className="font-semibold"><strong className="text-gray-700">STEP 3.</strong> 지원실(지하 1층)에서 전원 구동 및 스크래치 조인트 확인 수령</p>
              <p className="font-semibold"><strong className="text-gray-700">STEP 4.</strong> 기한 만료 시간 정오 전 청결 상태 고지 후 원위치 반납</p>
            </div>
          </div>
        </div>

        {/* Action Hub row footer */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2">
          {/* Print button */}
          <button
            type="button"
            onClick={() => {
              window.print();
              onShowToast('인쇄 미리보기 및 작성 문서 영수증 서식이 생성되었습니다.');
            }}
            className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            id="btn-print-doc"
          >
            <Printer className="w-4 h-4" />
            <span>신청서 한글/PDF 서식 인쇄</span>
          </button>

          {/* Submit Action button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-[#006bd1] hover:bg-[#005bb3] text-white font-extrabold rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
            id="btn-submit-form"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>온라인 장비대여 신청서 접수</span>
          </button>
        </div>
      </form>
    </div>
  );
}
