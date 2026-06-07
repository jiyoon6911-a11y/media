import { useEffect, useRef } from 'react';
import { Sparkles, Compass, Award, Brain, BookOpen, Send, User, Undo, Info } from 'lucide-react';

interface AiRoadmapSectionProps {
  admissionType: 'transfer' | 'freshman' | 'double-major';
  setAdmissionType: (val: 'transfer' | 'freshman' | 'double-major') => void;
  chatMessages: Array<{sender: 'bot' | 'user', text: string}>;
  chatInput: string;
  setChatInput: (val: string) => void;
  isTyping: boolean;
  handleSendChatMessage: (text: string) => void;
  selectedJob: string;
  activeUser: {
    name: string;
    studentId: string;
    typeLabel: string;
    typeLabelShort: string;
  };
  roadmapData: Array<{
    title: string;
    tagline: string;
    courses: string[];
    aiComment: string;
  }>;
  getCourseObj: (code: string) => any;
  setSelectedCourse: (course: any) => void;
  onShowToast: (msg: string) => void;
  setCurriculumTab: (tab: 'standard' | 'ai-roadmap') => void;
}

export default function AiRoadmapSection({
  admissionType,
  setAdmissionType,
  chatMessages,
  chatInput,
  setChatInput,
  isTyping,
  handleSendChatMessage,
  selectedJob,
  activeUser,
  roadmapData,
  getCourseObj,
  setSelectedCourse,
  onShowToast,
  setCurriculumTab,
}: AiRoadmapSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  return (
    <div className="space-y-8 animate-fadeIn" id="ai-roadmap-tab-viewport">
      
      {/* 3.1 웰컴 인사 및 핵심 플랜 선택기 */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2 rounded-full h-5 bg-[#006bd1]" />
            <span className="text-[10px] font-black tracking-widest text-[#006bd1] uppercase">Welcome Back</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug select-text">
            👋 {activeUser.name}님, 미디어스쿨 합류를 진심으로 환영합니다!
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed select-text">
            미디어스쿨에서 마스터로 거듭나는 귀하의 커리어 여정을 AI 지능형 매칭 어드바이저가 완전히 밀착하여 가이드합니다. 아래에서 원하시는 진로 맞춤 필터를 토글 전환하여 이에 부합하는 학기별 교과 배치를 정밀 조회해 보세요.
          </p>
          
          {/* 수강 대상 토글러 */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'transfer', label: '편입생 (3학년 시작)' },
              { id: 'freshman', label: '신입생 (1학년 시작)' },
              { id: 'double-major', label: '융합부전공자' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setAdmissionType(type.id as any);
                  onShowToast(`학업 목표가 [${type.label}] 테마로 변경되어 인바디 로드맵을 다시 빌드했습니다.`);
                }}
                className={`text-[11px] font-black px-3.5 py-1.5 rounded-xl border transition cursor-pointer select-none ${
                  admissionType === type.id
                    ? 'bg-[#006bd1] text-white border-[#006bd1] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 우측 학생 정보 스냅샷 */}
        <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 shrink-0 flex flex-col justify-between space-y-4 md:w-56 shadow-2xs">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-full bg-[#006bd1]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#006bd1]" />
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">이수분석 완료</span>
          </div>
          <div className="space-y-0.5 select-text">
            <div className="text-[10px] font-bold text-gray-400">한림대학교 미디어스쿨</div>
            <h4 className="text-sm font-black text-slate-900">{activeUser.name}</h4>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 font-bold">
              <span>학번: {activeUser.studentId}</span>
              <span>|</span>
              <span>{activeUser.typeLabelShort}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3.2 AI 추천 핵심 카테고리 태깅 */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest select-none">AI 추천 핵심 속성 태깅</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1) 진로 기반 추천 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 transition group hover:border-[#006bd1] hover:shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">진로 기반 추천</span>
              <div className="w-5 h-5 rounded-md bg-blue-50/50 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 select-text">
              {admissionType === 'transfer' ? (
                ['#PD/감독', '#콘텐츠기획', '#미디어창업', '#시네마연출'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-[#006bd1] bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              ) : admissionType === 'freshman' ? (
                ['#저널리스트', '#방송기자', '#방송국PD', '#다큐멘터리'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-[#006bd1] bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              ) : (
                ['#AI미디어제품', '#인터랙션개발', '#UX기획자', '#미디어아티스트'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-[#006bd1] bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              )}
            </div>
          </div>

          {/* 2) 흥미 기반 추천 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 transition group hover:border-emerald-500 hover:shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">흥미 기반 추천</span>
              <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 select-text">
              {admissionType === 'transfer' ? (
                ['#영상제작', '#스토리텔링', '#크리에이티브', '#다큐영화'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              ) : admissionType === 'freshman' ? (
                ['#기사보도', '#현장취재', '#논평비평', '#카메라조명'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              ) : (
                ['#AI코드제어', '#웹UI구축', '#인포그래픽', '#영상미학'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              )}
            </div>
          </div>

          {/* 3) 적성 기반 추천 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 transition group hover:border-amber-500 hover:shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">적성 기반 추천</span>
              <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 select-text">
              {admissionType === 'transfer' ? (
                ['#분석형', '#창의형', '#소통형', '#데이터융합'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-amber-600 bg-amber-50/50 border border-amber-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              ) : admissionType === 'freshman' ? (
                ['#집요한탐구', '#신속기동', '#팩트체크', '#대담한질문'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-amber-600 bg-amber-50/50 border border-amber-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              ) : (
                ['#알고리즘이해', '#제품디자인', '#융복합지능', '#사용자관찰'].map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] font-extrabold text-amber-600 bg-amber-50/50 border border-amber-100 px-2 py-0.5 rounded-lg">{tag}</span>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3.3 로드맵 학기별 타임라인 플로우 */}
      <div className="space-y-6">
        
        {/* 학기별 가이드 */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center select-none">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{activeUser.typeLabel} 추천 커리큘럼 로드맵</h4>
              <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hidden sm:flex">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>과목 버튼을 누르시면 세부 강의계획서 요약 팝업이 바로 가동됩니다.</span>
              </div>
            </div>

            <div className="space-y-4">
              {roadmapData.map((sem, idx) => (
                <div key={idx} className="bg-white border border-gray-100 hover:border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-5 transition duration-200">
                  
                  {/* 학기 요약 */}
                  <div className="md:w-52 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
                    <div>
                      <span className="text-[11px] font-black text-slate-800 bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-lg inline-block select-none">
                        {sem.title}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight mt-2.5 leading-tight font-sans">
                        {sem.tagline}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-[#006bd1] mt-3 block select-none">
                      💡 AI 코멘터 매칭 완료
                    </span>
                  </div>

                  {/* 추천 수강 과목 슬롯 */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {sem.courses.map((code) => {
                        const course = getCourseObj(code);
                        if (!course) return null;
                        return (
                          <button
                            key={code}
                            onClick={() => {
                              setSelectedCourse(course);
                              onShowToast(`[${course.name}] 실무 교과목의 세부 통합교안 가이드를 호출했습니다.`);
                            }}
                            className="text-xs font-extrabold text-slate-700 hover:text-white bg-slate-50 hover:bg-[#006bd1] border border-slate-200 hover:border-[#006bd1] px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs select-text"
                          >
                            <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-50" />
                            <span>{course.name}</span>
                            <span className="text-[10.5px] font-extrabold text-slate-400 font-mono">({code})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* AI Comment */}
                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 flex items-start gap-2.5 select-text">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#006bd1] to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs select-none">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        <span className="font-extrabold text-[#006bd1]">AI 가이드:</span> {sem.aiComment}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* 졸업 후 AI 추천 커리어 도달 방향 */}
          <div className="space-y-3 pt-4 select-none">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">AI가 추천하는 미디어 커리어 도달 방향</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-gray-100 hover:border-[#006bd1]/20 rounded-2xl p-4 space-y-2 text-center transition hover:shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-600 font-bold">크</div>
                <h5 className="text-xs font-black text-slate-800">콘텐츠 크리에이터</h5>
                <p className="text-[10px] text-gray-400 font-semibold font-sans">영상, 숏폼, 브랜딩 콘텐츠 제작 기획</p>
              </div>

              <div className="bg-white border border-gray-100 hover:border-[#006bd1]/20 rounded-2xl p-4 space-y-2 text-center transition hover:shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 font-bold">P</div>
                <h5 className="text-xs font-black text-slate-800">PD / 연출가</h5>
                <p className="text-[10px] text-gray-400 font-semibold font-sans">방송 기획, 연출, 전송 제작 총괄</p>
              </div>

              <div className="bg-white border border-gray-100 hover:border-[#006bd1]/20 rounded-2xl p-4 space-y-2 text-center transition hover:shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-600 font-bold font-mono">M</div>
                <h5 className="text-xs font-black text-slate-800">미디어 마케터</h5>
                <p className="text-[10px] text-gray-400 font-semibold font-sans">기업 브랜드, SNS, 바이럴 홍보 전략</p>
              </div>

              <div className="bg-white border border-gray-100 hover:border-[#006bd1]/20 rounded-2xl p-4 space-y-2 text-center transition hover:shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-pink-600 font-bold">스</div>
                <h5 className="text-xs font-black text-slate-800">미디어 스타트업</h5>
                <p className="text-[10px] text-gray-400 font-semibold font-sans">플랫폼 창업, 창작 서비스 사업기획</p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* AI 로드맵 내의 목록 뒤로가기 보조레일 */}
      <div className="flex justify-center pt-8 border-t border-gray-100 select-none">
        <button
          onClick={() => {
            setCurriculumTab('standard');
            onShowToast('일반 전공 교육과목 목록 가이드로 돌아갑니다.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-center gap-2 text-xs font-black text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-gray-200 px-5 py-3 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Undo className="w-4 h-4 text-gray-500" />
          <span>전체 교과목 가이드 목록으로 돌아가기</span>
        </button>
      </div>

    </div>
  );
}
