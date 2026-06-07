/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Layers, CalendarRange, Clock, Contact, ArrowRightLeft } from 'lucide-react';
import { RentalRequest } from '../types';

interface RentalSchedulerProps {
  rentalRequests: RentalRequest[];
  onShowToast: (msg: string) => void;
  onCancelRequest?: (id: string) => void;
}

export default function RentalScheduler({ rentalRequests, onShowToast, onCancelRequest }: RentalSchedulerProps) {
  
  // 상태별 갯수 통계 산출
  const totalCount = rentalRequests.length;
  const pendingCount = rentalRequests.filter(r => r.status === 'pending').length;
  const approvedCount = rentalRequests.filter(r => r.status === 'approved').length;
  const returnedCount = r => r.status === 'returned'; // 임시 count 용
  const totalReturned = rentalRequests.filter(r => r.status === 'returned').length;

  const getStatusBadge = (status: RentalRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            승인대기
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black rounded-md bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            승인완료
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black rounded-md bg-rose-50 text-rose-600 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            반려됨
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            반납완료
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn" id="rental-scheduler-section">
      
      {/* 1. 예약현황 요약 상단 bento 통계 보드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
        {[
          { label: '누적 신청 현황', count: totalCount, icon: Layers, color: 'border-slate-200 text-slate-700 bg-slate-50' },
          { label: '승인 대기 건수', count: pendingCount, icon: Clock, color: 'border-amber-200 text-amber-700 bg-amber-50/40' },
          { label: '대여 승인 완료', count: approvedCount, icon: CheckCircle2, color: 'border-sky-200 text-sky-700 bg-sky-50/40' },
          { label: '반납 인계 처리', count: totalReturned, icon: ArrowRightLeft, color: 'border-emerald-200 text-emerald-800 bg-emerald-50/40' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 border rounded-xl flex items-center justify-between ${stat.color} shadow-xs`}>
            <div className="space-y-1">
              <span className="text-xs font-black text-gray-500 block">{stat.label}</span>
              <span className="text-xl sm:text-2xl font-black block tracking-tight">{stat.count} 건</span>
            </div>
            <stat.icon className="w-7 h-7 stroke-[1.5] opacity-80" />
          </div>
        ))}
      </div>

      {/* 2. 대여 신청 이력 테이블 리스트 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-3">
          <div className="space-y-1 select-none">
            <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <CalendarRange className="w-5 h-5 text-[#006bd1]" />
              실시간 장비 대여 현황
            </h4>
            <span className="text-xs text-gray-400 font-bold block">
              신규 작성하신 신청서는 승인 대기 상태로 이 표에 즉시 등재되며, 행정 승인이 검토됩니다.
            </span>
          </div>

          <button
            onClick={() => onShowToast('서버 데이터베이스에서 실시간 기기 동기화를 완료했습니다.')}
            className="flex items-center gap-1 text-[11px] font-black border border-gray-300 hover:border-[#006bd1] text-gray-600 hover:text-[#006bd1] bg-white px-3 py-1.5 rounded-lg cursor-pointer transition active:scale-95"
          >
            <RefreshCw className="w-3 h-3" />
            초기화 동기화
          </button>
        </div>

        {rentalRequests.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-gray-200 rounded-xl bg-slate-50/30 select-none">
            <CalendarRange className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">현재 미디어 장비 대여 및 사전 예약 현황이 존재하지 않습니다.</p>
            <p className="text-xs text-gray-400 mt-1">상단 &lsquo;대여 신청하기&rsquo; 메뉴를 눌러 신규 승인 요청을 접수할 수 있습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-xs">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-xs font-black text-gray-500 select-none">
                  <th className="py-3 px-4">신청 목적 / 예약 일자</th>
                  <th className="py-3 px-4">희망 대여 기기</th>
                  <th className="py-3 px-4">예약 피신청인 정보</th>
                  <th className="py-3 px-4 text-center">반올림 수량</th>
                  <th className="py-3 px-4 text-center">승인 서명여부</th>
                  <th className="py-3 px-4 text-center">예약상태</th>
                  {onCancelRequest && <th className="py-3 px-4 text-center">업부처리</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-xs sm:text-[13px] font-semibold text-slate-700">
                {rentalRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition duration-100">
                    
                    {/* 예약 일정 정보 */}
                    <td className="py-4 px-4 leading-normal select-text">
                      <div className="space-y-0.5">
                        <span className="text-slate-900 font-extrabold text-sm block">{req.purpose}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#006bd1] font-black">
                          <span>{req.rentalDate}</span>
                          <span className="text-gray-300 font-normal">~</span>
                          <span>{req.returnDate}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold block">
                          신청시점: {req.createdAt}
                        </span>
                      </div>
                    </td>

                    {/* 신청 기기명 */}
                    <td className="py-4 px-4 select-text font-black text-slate-900">
                      {req.equipmentItemName}
                    </td>

                    {/* 피신청 인적 사항 */}
                    <td className="py-4 px-4 leading-normal select-text">
                      <div className="space-y-0.5 font-bold">
                        <div className="flex items-center gap-1 text-slate-800">
                          <Contact className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{req.applicantName}</span>
                          <span className="text-gray-300 font-normal">/</span>
                          <span className="text-[11px] text-gray-500">{req.studentId}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 block">{req.department} ({req.phone})</span>
                      </div>
                    </td>

                    {/* 대여 수량 */}
                    <td className="py-4 px-4 text-center font-bold text-slate-800 select-none">
                      {req.quantity} 개
                    </td>

                    {/* 서명 여부 */}
                    <td className="py-4 px-4 text-center select-none font-bold">
                      {req.hasSigned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                          전자서명 날인됨
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 border border-red-100">
                          서명누락
                        </span>
                      )}
                    </td>

                    {/* 상태 정보 */}
                    <td className="py-4 px-4 text-center select-none">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* 취소 처리 구동계 */}
                    {onCancelRequest && (
                      <td className="py-4 px-4 text-center select-none">
                        {req.status === 'pending' ? (
                          <button
                            onClick={() => {
                              onCancelRequest(req.id);
                              onShowToast('대여 신청이 성공적으로 취소 회수되었습니다.');
                            }}
                            className="px-2.5 py-1 hover:bg-rose-50 text-rose-600 hover:text-rose-700 hover:border-rose-300 border border-transparent rounded text-xs font-black transition cursor-pointer active:scale-95"
                            id={`cancel-btn-${req.id}`}
                          >
                            신청취소
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300 font-bold">일정확정</span>
                        )}
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. 예약 및 반납 관리 안내 보드 */}
      <div className="bg-sky-50/50 border border-[#e2e8f0] p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start gap-4 select-none">
        <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs sm:text-xs font-black text-slate-800 block">📢 장비 반납 인계 기한 준수 및 주의의무 안내</span>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-bold">
            대여 신청서에 기재하신 반납 완료 기한을 엄격히 준수해 주십시오. 기한 초과 미반납 시 학내 마일리지 통제 및 향후 대여 예약 보류 처분 대상자가 될 수 있습니다.
            장비의 파손 이탈 등의 고장 현상은 발견 즉시 현장 담당자(각 기기별 표기된 이메일 또는 연락처)에게 제보해주셔야 보정이 가능합니다.
          </p>
        </div>
      </div>

    </div>
  );
}
