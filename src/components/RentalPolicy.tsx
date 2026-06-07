/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, Clock, HelpCircle, ShieldAlert, BookOpen } from 'lucide-react';

export default function RentalPolicy() {
  return (
    <div className="w-full font-sans select-none text-slate-800 leading-relaxed text-sm space-y-6">
      
      {/* Visual Header warning */}
      <div className="border border-red-200 bg-red-50/75 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-red-800 font-semibold space-y-1">
          <strong className="block text-red-900 font-extrabold text-[15px]">대여 규정 위반 시 일관 벌점 조치 안내</strong>
          <span>장비 반납 시간(예매 만료 기준) 지연 및 타인 양도 대행 허위 신청 발견 시 미디어스쿨 위원회 의결에 맞춰 아래와 같이 일괄 대여 거부 누적벌점이 무관용 즉시 적용됩니다.</span>
        </div>
      </div>

      {/* Grid columns of guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Working Hours box */}
        <div className="bg-slate-50 border border-gray-150 p-5 rounded-xl">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mb-3.5">
            <Clock className="w-4.5 h-4.5 text-[#006bd1]" />
            지원실 물품 인수/반납 상시 운영 시간
          </h4>
          <div className="space-y-2 text-xs font-semibold text-gray-600">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>학기중 평일 (월 ~ 금영)</span>
              <span className="text-slate-900 font-bold">오전 09:00 ~ 오후 18:00</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>점심 및 휴게 정비 브레이크</span>
              <span className="text-gray-400 font-medium">12:00 ~ 13:00 (전면 불가)</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>방학/동하계 집중 기간</span>
              <span className="text-slate-900 font-bold">오전 10:00 ~ 오후 17:00</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>주말 및 국가 공휴일</span>
              <span className="font-extrabold text-rose-500">휴무 (반납 접수 및 대여 불가)</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 font-semibold">
            * 대여 희망 영업일 최소 24시간 전에 온라인 신청서 제출을 조기 마쳐주시길 부탁드립니다.
          </p>
        </div>

        {/* Penalty table section */}
        <div className="bg-slate-50 border border-gray-150 p-5 rounded-xl">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mb-3.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
            조항별 벌점 스케일 및 조치 사안
          </h4>
          <div className="space-y-2 text-xs font-semibold text-gray-600">
            <div className="flex justify-between border-b border-gray-200 pb-2 items-center">
              <span>반납 시간 초과 (매 1시간 마다)</span>
              <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded">벌점 1점 적용</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2 items-center">
              <span>악세사리 (SD카드/배터리 리더기) 누락</span>
              <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded">벌점 3점 / 대체구매</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2 items-center">
              <span>무단 기기 교차 사용 및 불성실 검수</span>
              <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded">벌점 5점 적용</span>
            </div>
            <div className="flex justify-between text-rose-700 font-extrabold items-center">
              <span>벌점 누적 합계 10점 초과</span>
              <span className="text-white bg-rose-600 px-2 py-0.5 rounded animate-pulse">1학기 제한 블랙배정 고지</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Section details list */}
      <div className="bg-slate-50 border border-gray-100 p-5 rounded-xl space-y-4">
        <h4 className="text-sm font-extrabold text-[#006bd1] flex items-center gap-1.5 border-b border-gray-200 pb-2">
          <BookOpen className="w-4.5 h-4.5" />
          상세 실습 지원실 기자재 대여 조항 전문
        </h4>

        <div className="space-y-3.5 text-xs sm:text-sm font-semibold text-gray-600">
          <div>
            <span className="block text-slate-900 font-extrabold mb-1">제 1조. (목적 수수료)</span>
            <p className="text-gray-500 pl-4 leading-normal">
              본 대여는 한림대학교 미디어스쿨 전공 재학생의 정규 교과목 제작과 관련된 작품 활동, 공인 동아리 촬영 및 전공 학습 지원을 주 목적으로 하며, 일체의 기기 대여 수수료는 청구하지 아니합니다.
            </p>
          </div>

          <div>
            <span className="block text-slate-900 font-extrabold mb-1">제 2조. (신청 대상 요건)</span>
            <p className="text-gray-500 pl-4 leading-normal">
              신청 자격은 한림대학교 학적부에 등록된 미디어스쿨 주전공, 복수전공, 부전공 수강 재학생에 준하며, 휴학생의 경우 원칙적으로 기자재 대여가 불가능합니다.
            </p>
          </div>

          <div>
            <span className="block text-slate-900 font-extrabold mb-1">제 3조. (파손 및 도난 분실 책임)</span>
            <p className="text-gray-500 pl-4 leading-normal">
              장비를 수령한 직후부터 최종 반납확인이 이루어질 때까지 발생한 일체의 망실, 파손, 침수, 분실에 대한 전적인 민·형사상 보상 의무는 대여 신청 대표자 학생 서명인에게 영구 기속되며, 공식 서비스 센터 감정가에 따라 현물 복구 실비 보상을 완주해야 합니다.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
