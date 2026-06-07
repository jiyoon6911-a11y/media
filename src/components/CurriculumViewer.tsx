import { useState, useMemo } from 'react';
import { 
  Printer, 
  Star, 
  Share2, 
  Search, 
  Award, 
  Tv, 
  FileText, 
  Megaphone, 
  GraduationCap, 
  Sparkles, 
  Undo,
  Info,
  Layers,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface CurriculumViewerProps {
  onShowToast: (msg: string) => void;
}

// 5대 커리어 로드맵 트랙 정의
const careerTracks = [
  {
    id: 'news',
    title: '신문저널리즘',
    icon: FileText,
    color: 'border-blue-500 text-blue-600 bg-blue-50/50 hover:bg-blue-50',
    badgeColor: 'bg-blue-600',
    textColor: 'text-blue-900',
    tagline: '교내외 뉴스 매체 게재를 목표로 한 전방위 취재/보도 실무 중심 교육',
    details: [
      '교내외 매체 게재를 전제로 한 고강도 실무 연습',
      '현장실습 및 미디어사 인턴 의무화를 통한 필드 감각 유지',
      '기사 작성, 보도 사진, 편집 능력을 모두 아우르는 다면 포트폴리오 축적'
    ],
    recommendedCourses: ['209378', '209379', '209373', '209719', '300034', '300001', '300009', '209388', '300020']
  },
  {
    id: 'broadcast-journalism',
    title: '방송저널리즘',
    icon: Tv,
    color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50',
    badgeColor: 'bg-emerald-600',
    textColor: 'text-emerald-900',
    tagline: '실시간 방송 매체 및 뉴미디어 저널 전 영역 송출/납품 정밀 실습',
    details: [
      '교내외 주요 방송 미디어 채널 프로그램 납품을 연계한 실질 제작 수업',
      '정규 학기 연계 미디어 그룹 인턴십 의무 가동 보조',
      '취재 보도, 앵커 브리핑, 영상 편집 3박자 융합 포트폴리오 완성'
    ],
    recommendedCourses: ['300035', '300036', '300029', '209301', '209374', '209390', '300012', '209389', '209387']
  },
  {
    id: 'broadcast-contents',
    title: '방송콘텐츠 제작',
    icon: Award,
    color: 'border-indigo-500 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50',
    badgeColor: 'bg-indigo-600',
    textColor: 'text-indigo-900',
    tagline: '글로벌 경쟁력을 갖춘 고품격 교양, 다큐멘터리, 영화 예술 프로덕션 구축',
    details: [
      '국내외 메이저 영상 공모전 출품 및 페스티벌 수상을 연계한 실전 지향 전개',
      '방송국, 독립 프로덕션 및 OTT 플랫폼 현장 실무 인턴 프로그램 결합',
      '창의적 시나리오 집필력부터 시네마 카메라 운용, 고도의 음향/편집 기법 패키징'
    ],
    recommendedCourses: ['300029', '209571', '300015', '209393', '300037', '209570', '209387', '300038', '300028']
  },
  {
    id: 'advertising',
    title: '복수전공 추천 : 광고',
    icon: Megaphone,
    color: 'border-amber-500 text-amber-600 bg-amber-50/50 hover:bg-amber-50',
    badgeColor: 'bg-amber-600',
    textColor: 'text-amber-900',
    tagline: '저널리즘 기반의 논리적 스토리텔링과 현대 크리에이티브 설득 마케팅의 대융합',
    details: [
      '국가 행정기관, 탑클래스 기업, 종합 광고대행사 타겟 특화 마케팅 지식 접목',
      '광고홍보학과 복수전공을 통한 더블 시너지 학위 포도망 완비',
      '본 전공의 팩트 기반 스토리텔링 지적 자산과 설득 공공 마케팅 공론 규율 획득'
    ],
    recommendedCourses: ['300007', '209554', '209802', '209702', '209407', '300013', '300014', '300031', '300021']
  },
  {
    id: 'grad-school',
    title: '대학원 진학',
    icon: GraduationCap,
    color: 'border-purple-500 text-purple-600 bg-purple-50/50 hover:bg-purple-50',
    badgeColor: 'bg-purple-600',
    textColor: 'text-purple-950',
    tagline: '고도의 오피니언 리서처, 데이터 수치 과학자 및 차세대 학계 정예 연구 인재 배양',
    details: [
      '정부출연 연구소, 대형 조사업체 및 학술 단체 진출을 위한 사회과학 분석 설계 실무',
      '미디어스쿨 최고 권위 교수진과의 공동 R&D 학술 프로젝트 상시 서포터 참여',
      '미국, 유럽 등 글로벌 선진 미디어 명문 대학과의 우호적 교환학생 기회 우선 제공'
    ],
    recommendedCourses: ['209304', '209301', '209554', '209702', '300001', '300009', '300013', '209364', '209600', '209629']
  }
];

// 개설 교과목 원자 데이터 정의 (수준 I, II, III / 학기 1, 2)
interface Course {
  code: string;
  name: string;
  type: string; // "3-3-0" 형태
  level: 'I' | 'II' | 'III';
  semester: 1 | 2;
  note?: string;
  desc?: string;
}

const courseDatabase: Course[] = [
  // --- 수준 I ---
  // 1학기
  { code: '209803', name: 'AI와 뉴스의 미래', type: '3-3-0', level: 'I', semester: 1, desc: '인공지능 기술이 뉴스 생산, 소비 전반에 미치는 패러다임 변화를 조망하고 생성형 AI를 활용한 보도 실천 방법을 연습합니다.' },
  { code: '209378', name: '뉴스작성기초1', type: '3-3-0', level: 'I', semester: 1, desc: '스트레이트 기사의 기본 요건인 6하원칙에 입각한 정보 취합 법과 정확하고 객관적인 문장 표현 기법에 집중합니다.' },
  { code: '209304', name: '한국언론사', type: '3-3-0', level: 'I', semester: 1, desc: '구한말에서 현대에 이르는 한국 신문, 방송, 잡지 등 매체의 변천 과정을 사회 구조와 수용자 관점에서 고찰합니다.' },
  { code: '300023', name: '미디어평론글쓰기1', type: '3-3-0', level: 'I', semester: 1, desc: '대중 미디어 콘텐츠를 학술적, 사회 문화적 관점으로 분석하여 심층적이고 설득력 있는 비평 에세이를 도출합니다.' },
  { code: '209373', name: '보도사진', type: '3-2-2', level: 'I', semester: 1, desc: '디지털 DSLR 카메라 조정 원리부터 현장 뉴스를 한 컷의 강력한 영상 프레임 안에 함축해 내는 시각 저널리즘 실습입니다.' },
  { code: '300034', name: '뉴스리터러시와젠더', type: '3-3-0', level: 'I', semester: 1, desc: '현대 뉴스 미디어가 젠더 이슈를 표상하는 방식과 고정관념을 다각적으로 해독해 내어 미디어 리터러시 역량을 함양합니다.' },
  { code: '209719', name: '소셜뉴스-캡스톤디자인', type: '3-3-0', level: 'I', semester: 1, desc: '모바일 소셜미디어 특화 숏폼, 텍스트 카드뉴스 등 SNS 확산형 실시간 시사 콘텐츠를 직접 기획 및 배급 연계합니다.' },
  { code: '300035', name: '방송진행실습1-MC(외 스포츠캐스터)', type: '3-3-0', level: 'I', semester: 1, desc: '뉴스 앵커, 종합 예능 토크쇼 MC, 스포츠 위성 중계 캐스트 등 카메라 앞 스피치 톤과 현장 리액션을 고도화합니다.' },
  { code: '300036', name: '방송진행실습2-리포터(외 교통, 기상캐스터)', type: '3-3-0', level: 'I', semester: 1, desc: '날씨 정보, 출퇴근 교통 정보, 로케이션 예능 리포팅 등 시청자에게 밀착형 생활 정보를 빠르고 에너지 있게 전달하는 기법입니다.' },
  { code: '300029', name: '영상매체기초: 연출과 촬영', type: '3-2-2', level: 'I', semester: 1, desc: '영상 연출의 시각적 문법과 셔터 스피드, 조리개, ISO 등 기본적인 카메라 촬영 매커니즘을 몸소 체험하며 익히는 기초 코스입니다.' },
  // 2학기
  { code: '209373', name: '보도사진', type: '3-2-2', level: 'I', semester: 2, desc: '디지털 DSLR 카메라 조정 원리부터 현장 뉴스를 한 컷의 강력한 영상 프레임 안에 함축해 내는 시각 저널리즘 실습입니다.' },
  { code: '209378', name: '뉴스작성기초1', type: '3-3-0', level: 'I', semester: 2, desc: '스트레이트 기사의 기본 요건인 6하원칙에 입각한 정보 취합 법과 정확하고 객관적인 문장 표현 기법에 집중합니다.' },
  { code: '209379', name: '뉴스작성기초2', type: '3-3-0', level: 'I', semester: 2, desc: '뉴스작성기초1의 상급 코스로서 피처스토리, 기획/고발 탐사 심층 기사 수립 및 편집 레이아웃 편제 구도를 이수합니다.' },
  { code: '300023', name: '미디어평론글쓰기1', type: '3-3-0', level: 'I', semester: 2, desc: '대중 미디어 콘텐츠를 학술적, 사회 문화적 관점으로 분석하여 심층적이고 설득력 있는 비평 에세이를 도출합니다.' },
  { code: '300029', name: '영상매체기초: 연출과 촬영', type: '3-2-2', level: 'I', semester: 2, desc: '영상 연출의 시각적 문법과 셔터 스피드, 조리개, ISO 등 기본적인 카메라 촬영 매커니즘을 몸소 체험하며 익히는 기초 코스입니다.' },
  { code: '209301', name: '저널리즘의 역사와 현황', type: '3-3-0', level: 'I', semester: 2, desc: '언론 자유의 사상적 기원과 민주주의 사회에서 신뢰도 확보를 위한 윤리 강령, 글로벌 미디어가 직면한 가짜뉴스 현주소를 다룹니다.' },
  { code: '300007', name: '미디어스피치와 발표', type: '3-2-2', level: 'I', semester: 2, desc: '학부 성과 발표회, 사내 프리젠테이션 등 공식 석상에서 청중을 매료시키는 올바른 호흡, 발성 및 설득적인 스피치 보이스 설계.' },
  { code: '209554', name: '미디어산업의 이해', type: '3-3-0', level: 'I', semester: 2, desc: '방송국, OTT, 포털 플랫폼, 광고대행사 등 미디어 콘텐츠 비즈니스의 역사적 자본 구조와 수익 창출 알고리즘 패러다임을 넓게 조망합니다.' },
  { code: '209571', name: '시놉시스 구상', type: '3-2-2', level: 'I', semester: 2, desc: '모든 훌륭한 이야기의 시작이 되는 기획 의도 설정, 주인공 캐릭터 메이킹 및 1장 분량의 핵심 로그라인과 시놉시스 전개 전략.' },
  { code: '300039', name: '로컬크리에이터 : \'책임있는춘천\'스토리텔링과개발', type: '3-2-2', level: 'I', semester: 2, desc: '춘천 지역 소상공인, 역사 공간, 특수 식재료 등을 연계한 다채로운 다큐멘터리식 로컬 영상 스토리 및 브랜드 굿즈 가상 기획.' },

  // --- 수준 II ---
  // 1학기
  { code: '209802', name: 'AI와 그래픽인포메이션', type: '3-3-0', level: 'II', semester: 1, desc: '다차원 복합 수치와 사회적 사실들을 한눈에 알아보기 쉽게 도식화하는 인포그래픽 원리와 생성형 일러스트레이터 활용 실습.' },
  { code: '300015', name: '시나리오 작성', type: '3-2-2', level: 'II', semester: 1, desc: '드라마, 광고, 단편 극영화 수립을 위한 씬(Scene) 구성법과 인물 간의 갈등을 가시화하는 유려한 대사 및 행동 수치 트리거 설계.' },
  { code: '209393', name: '방송영상콘텐츠제작1-캡스톤디자인', type: '3-2-2', level: 'II', semester: 1, desc: '실전 방송용 포맷의 다큐, 미니 드라마, 버라이어티 포맷을 팀별로 구성 후 완결성 있는 한 편의 영상 파일로 마무리 출하합니다.' },
  { code: '209702', name: '미디어산업과정책', type: '3-3-0', level: 'II', semester: 1, desc: '정부의 미디어 규제 프레임워크, 망 사용료 갈등, 공영방송 지배 구조 등 방송통신 정책의 중대 글로벌 쟁점을 토론합니다.' },
  { code: '209374', name: 'TV 뉴스의 미래와 제작', type: '3-2-2', level: 'II', semester: 1, desc: '메인 뉴스 데스크 진행 매뉴얼 체득, 야외 심층 ENG 취재 및 부조정실 기술 파트(TD, 오디오, 자막) 협업 속 전방위 가상 뉴스 시뮬레이션.' },
  { code: '300001', name: '데이터저널리즘-캡스톤디자인', type: '3-2-2', level: 'II', semester: 1, desc: '파이썬(Python) 등을 활용한 웹 데이터 스크래핑부터 정량적 도출 시각화 도구(D3, Tableau)를 접목한 디지털 인텔리전스 보도 실태.' },
  { code: '300037', name: '단편 미디어 스토리의 구상과 집필', type: '3-2-2', level: 'II', semester: 1, desc: '모바일 및 웹 기반 숏폼 드라마, 웹툰, 브랜드 바이럴 광고 전용의 15분 안팎 함축적인 단편 스토리 텔링의 완결형 설계 집필.' },
  { code: '209103', name: 'AI미디어프로그래밍기초실습', type: '3-2-2', level: 'II', semester: 1, desc: '미디어 저널리스트와 크리에이터에게 필수가 된 데이터 수집용 초급 프로그래밍 기초(웹 크롤링 및 텍스트 마이닝 맛보기).' },
  { code: '209370', name: '스튜디오사진', type: '3-2-2', level: 'II', semester: 1, desc: '정교한 실내 조명(동조 플래시, 소프트박스, 반사판) 제어로 인물 포트레이트 및 정적 상업 디자인 광고 제품을 고해상 수치화 촬영.' },
  { code: '209407', name: '공공 설득의 전략과 기술', type: '3-3-0', level: 'II', semester: 1, desc: '정부 홍보, 사회적 공익 캠페인, 리스크 매니지먼트에서 여론 설득에 동원되는 심리학적 미디어 전략 원리와 다양한 실무 대안 수립.' },
  // 2학기
  { code: '209804', name: '디지털기술과국제개발협력', type: '3-3-0', level: 'II', semester: 2, desc: '글로벌 개발도상국 현지의 디지털 정보 격차 극복과 미디어 교육, 유네스코 등 NGO와의 연계 국제개발 트렌드를 연구합니다.' },
  { code: '300002', name: '영상미학과비평', type: '3-3-0', level: 'II', semester: 2, desc: '몽타주 이론, 미장센 기법, 현대 포스트모더니즘 영상 미학의 대가들의 영화 분석을 통해 영상 예술을 한층 더 깊이 있게 감상 비평.' },
  { code: '209362', name: '헬스저널리즘입문', type: '3-2-2', level: 'II', semester: 2, desc: '공공 보건 위기, 의학 소식, 정신 건강과 웰빙 관련 전문 지식을 대중에게 신속정확하고 객관적으로 뉴싱하는 보건 미디어 특화 코스.' },
  { code: '209370', name: '스튜디오사진', type: '3-2-2', level: 'II', semester: 2, desc: '정교한 실내 조명(동조 플래시, 소프트박스, 반사판) 제어로 인물 포트레이트 및 정적 상업 디자인 광고 제품을 고해상 수치화 촬영.' },
  { code: '209374', name: 'TV 뉴스의 미래와 제작', type: '3-2-2', level: 'II', semester: 2, desc: '메인 뉴스 데스크 진행 매뉴얼 체득, 야외 심층 ENG 취재 및 부조정실 기술 파트(TD, 오디오, 자막) 협업 속 전방위 가상 뉴스 시뮬레이션.' },
  { code: '209390', name: '텔레비전뉴스-캡스톤디자인', type: '3-2-2', level: 'II', semester: 2, desc: 'TV 보도 현안에 정밀 매칭하는 5분 분량의 야외 뉴스 리포트물과 부조정실 내 앵커 및 대담 포맷 복합 생방송 팩 구축 실무.' },
  { code: '209570', name: '영상콘텐츠기획', type: '3-2-2', level: 'II', semester: 2, desc: '프로덕션 출범 전 마켓 타당성, 관객 니즈, 플랫폼별 유통 구도 및 상세 예산안(Line-Item Budget)을 논리적으로 짜는 투자 유치 기획.' },
  { code: '209709', name: '편집디자인프로젝트', type: '3-2-2', level: 'II', semester: 2, desc: '어도비 인디자인 및 최신 타이포그래피 규칙을 기동하여 인쇄 미디어, 태블릿 전용 고급 디지털 매거진을 조판 인쇄 디자인.' },
  { code: '300009', name: '대통령과 언론 : 이슈 관리', type: '3-3-0', level: 'II', semester: 2, desc: '행정부 부서 대변인실 운영 매커니즘, 프레스 브리핑 테크닉, 리스크 터졌을 때의 효과적인 여론 및 언론 릴레이션즈 미세 연구.' },
  { code: '300012', name: '인터뷰실습', type: '3-2-2', level: 'II', semester: 2, desc: '사전 취재, 핵심 래포(Rapport) 형성 노하우, 상대방의 숨은 이야기를 이끌어 내는 고단수 인터뷰 기법 및 기사화 편집술.' },
  { code: '300013', name: '문화산업의 역사', type: '3-3-0', level: 'II', semester: 2, desc: '글로벌 엔터테인먼트, 케이팝(K-POP), 애니메이션, 게임 산출물의 발전 사적 계보와 문명사적 가치 창출 흐름 도출 학술 강론.' },
  { code: '300014', name: 'AI와 뉴팩션 스토리텔링', type: '3-2-2', level: 'II', semester: 2, desc: '논픽션 사실 수집물과 인공지능이 생성한 예측 가상 서사를 정교히 블렌딩하여 완전히 새로운 장래 다차원 저널/영상 콘텐츠 포맷 개발.' },

  // --- 수준 III ---
  // 1학기
  { code: '209364', name: 'History of the America Press', type: '3-3-0', level: 'III', semester: 1, desc: '영문 원전 교재를 교보하며 현대 미국 탐사 비평 저널리즘과 뉴욕타임스, 워싱턴포스트의 중대 사적 필두 활약상을 연구.' },
  { code: '209389', name: '뉴스 실습', type: '3-3-0', level: 'III', semester: 1, desc: '기획 특집 르포르타주 작성의 모든 것. 현장 밀착 수사형 관점과 오랜 기간 밀도를 가해 팩트를 발굴 정제 보도 완성하는 엘리트 취재 실전.' },
  { code: '209387', name: '시사다큐멘터리제작-캡스톤디자인', type: '3-2-2', level: 'III', semester: 1, desc: '소외 이웃, 사회 안전망 갈등, 역사 보존 등 묵직한 어젠다를 최소 15~20분 가량의 시네마 다큐멘터리 영상 패키지로 촬영 감독 제작.' },
  { code: '209666', name: 'AI콘텐츠프로젝트', type: '3-2-2', level: 'III', semester: 1, desc: '대형 언어 모델 및 영상 생성 수치 인공지능 API를 탑재하여 하나의 고유한 웹 인터랙티브 미디어아트 제품군을 기획 구현하는 융합 창작부.' },
  { code: '300021', name: '데이터기반콘텐츠 기획실습', type: '3-2-2', level: 'III', semester: 1, desc: '공공 오픈 클라우드 빅데이터, 소셜 버즈 데이터 통계치를 일일 분석 및 패턴 채취를 거쳐 대중이 흥미를 끌 시각 인디케이터 서비스 제품 설계.' },
  { code: '300031', name: 'AI서비스사용자경험', type: '3-2-2', level: 'III', semester: 1, desc: '현대인들이 인공지능 인터페이스와 소통하고 상호 작용할 때 발생하는 심리적, 인지적 마인드 패턴을 조사하고 최상의 UX/UI 대안 프로토타이핑.' },
  { code: '300040', name: '영화분석세미나', type: '3-2-2', level: 'III', semester: 1, desc: '장르별 대담 영화사의 획을 그은 명화에 녹아있는 내러티브 철학, 씬 구성 문법, 이중 비유적 연출 장치를 분석 발제하는 상급 대학원 준비급 토론.' },
  { code: '209600', name: 'International Media Survey', type: '3-3-0', level: 'III', semester: 1, desc: '글로벌 탑 미디어 환경과 국내 환경을 상호 정밀 비교하여 향후 메이저 국외 파견 기자나 특파원 진출을 꿈꾸는 학생에게 교두보가 되는 영문 진행 강좌.' },
  { code: '300029', name: '스튜디오 연출과 촬영', type: '3-2-2', level: 'III', semester: 1, desc: '상급 시네마 조팅 구도와 다기능 ENG 무대 현장 생중계, 헬리캠/슬라이더 특수 그립 제어를 망라한 촬영과 현장 지휘 최고급 연소.' },
  // 2학기
  { code: '209364', name: 'History of the America Press', type: '3-3-0', level: 'III', semester: 2, desc: '영문 원전 교재를 교보하며 현대 미국 탐사 비평 저널리즘과 뉴욕타임스, 워싱턴포스트의 중대 사적 필두 활약상을 연구.' },
  { code: '209388', name: '탐사저널리즘-캡스톤디자인', type: '3-3-0', level: 'III', semester: 2, desc: '공권력 부패, 환경 범죄, 장기간 은폐된 구조적 모순을 파헤치기 위해 다각도로 심층 문헌 추척, 잠 복 조율, 미행 추적 없는 과학 탐사 보도.' },
  { code: '209629', name: '디지털미디어법제', type: '3-3-0', level: 'III', semester: 2, desc: '인터넷 공간의 저작권법 분쟁, 초상권과 명예훼손의 한선, 가짜뉴스 공익 규제, 미디어 규제 개혁에 관한 대학교 최고 학년 필수 법제 지식.' },
  { code: '209394', name: '스튜디오 연출과 촬영', type: '3-2-2', level: 'III', semester: 2, desc: '대규모 방송사 예능 스튜디오 녹화 혹은 버추얼 프로덕션 크로마키 무대 위 실시간 모션 캡쳐 추적 카메라를 운용해 보는 최첨단 기술 중심의 연출.' },
  { code: '300028', name: '글로벌엔터테인먼트산업분석', type: '3-3-0', level: 'III', semester: 2, desc: '할리우드, 넷플릭스 등 글로벌 콘텐츠의 유통 배급 사설과 한국 K-콘텐츠 시장과의 상호 협력 구조를 통해 본 전략적 한계점 극복 방향.' },
  { code: '300038', name: '단편 다큐멘터리 제작(나와 다큐멘터리)-캡스톤디자인', type: '3-2-2', level: 'III', semester: 2, desc: '외부 자산이 아닌 바로 나 자신, 가족, 우리 교내 동아리의 자전적 성찰을 1인 제작 단독 모듈 포맷으로 아주 깊은 연민과 서사로 빚어내는 걸작 제작.' },
  { code: '300020', name: '탐사피처콘텐츠제작', type: '3-2-2', level: 'III', semester: 2, desc: '복합 취재를 바탕으로 긴 길이의 스토리를 멀티미디어 인터랙티브 웹페이지 혹은 대형 스페셜 방송 특집 형태로 디자인 배급하는 통합실전 프로젝트.' }
];

export default function CurriculumViewer({ onShowToast }: CurriculumViewerProps) {
  const [activeLevel, setActiveLevel] = useState<'I' | 'II' | 'III'>('I');
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // 로드맵 트랙 선택/해제 핸들러
  const handleTrackSelect = (trackId: string) => {
    if (activeTrack === trackId) {
      setActiveTrack(null);
      onShowToast('권장 코스 필터가 초기화되었습니다. 전체 과목이 보입니다.');
    } else {
      setActiveTrack(trackId);
      const trackName = careerTracks.find(t => t.id === trackId)?.title || '';
      onShowToast(`"${trackName}" 트랙 전용 권장 교과목들에 하이라이트가 가동되었습니다.`);
    }
  };

  const handlePrint = () => {
    onShowToast('교과과정 인쇄용 레이아웃 포맷 출력을 시작합니다(실제 기기용 프린터 대화상자 연동).');
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '한림대학교 미디어스쿨 전공교과과정',
        text: '한림대학교 미디어커뮤니케이션전공 혁신 커리큘럼 로드맵 가이드',
        url: window.location.href
      }).then(() => {
        onShowToast('공유하기 링크 전파가 성공리에 연동되었습니다.');
      }).catch(() => {
        onShowToast('공유하기 동작이 임시 제외 및 복사 완료로 조치되었습니다.');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('미디어스쿨 교과과정 URL 주소가 클립보드로 안전전송 완료되었습니다!');
    }
  };

  const handleSaveFavorite = () => {
    onShowToast('즐겨찾기에 등록되었습니다. 마이 브라우저 쿠키 연동이 승인되었습니다.');
  };

  // 수준(학년)별로 나눈 후 검색어 필터링 가동 (1학기, 2학기)
  const filteredCourses1st = useMemo(() => {
    return courseDatabase.filter(c => {
      if (c.level !== activeLevel || c.semester !== 1) return false;
      
      const matchesSearch = searchQuery.trim() === '' || 
                            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.code.includes(searchQuery);
      
      return matchesSearch;
    });
  }, [activeLevel, searchQuery]);

  const filteredCourses2nd = useMemo(() => {
    return courseDatabase.filter(c => {
      if (c.level !== activeLevel || c.semester !== 2) return false;
      
      const matchesSearch = searchQuery.trim() === '' || 
                            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.code.includes(searchQuery);
      
      return matchesSearch;
    });
  }, [activeLevel, searchQuery]);

  // 해당 과목이 활성화된 트랙에 추천되는 과목인지 식별
  const trackRecommendedCodes = useMemo(() => {
    if (!activeTrack) return [];
    return careerTracks.find(t => t.id === activeTrack)?.recommendedCourses || [];
  }, [activeTrack]);

  const activeTrackInfo = useMemo(() => {
    if (!activeTrack) return null;
    return careerTracks.find(t => t.id === activeTrack) || null;
  }, [activeTrack]);

  return (
    <div className="w-full space-y-12 animate-fadeIn select-none" id="curriculum-viewer-root">
      
      {/* 1. 상위 가상 브레드크럼 및 소셜액션 제어레일 */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-extrabold tracking-wide uppercase">
          <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>홈</span>
          <span className="text-gray-300">&gt;</span>
          <span>교과과정</span>
          <span className="text-gray-300">&gt;</span>
          <span>미디어커뮤니케이션</span>
          <span className="text-gray-300">&gt;</span>
          <span className="text-[#006bd1] underline underline-offset-4 decoration-2">커리큘럼</span>
        </div>
        
        {/* 우측 3대 아이콘 액션바 */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-gray-200 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
            title="교과과정 인쇄하기"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">화면 출력</span>
          </button>
          <button
            onClick={handleSaveFavorite}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-amber-600 bg-slate-50 hover:bg-slate-100 border border-gray-200 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
            title="관심 커리큘럼 보관"
          >
            <Star className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">즐겨찾기</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-gray-200 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
            title="친구에게 공유"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">공유하기</span>
          </button>
        </div>
      </div>

      {/* 2. 한림 로고 및 대제목 장치 */}
      <div className="text-center space-y-3 py-4 select-none">
        <div className="flex justify-center items-center gap-2">
          {/* Hallym original wing vector representation */}
          <svg
            className="w-10 h-10 fill-current text-[#006bd1]"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 50 15 C 38 15 28 22 25 32 C 32 25 45 23 52 28 C 58 32 55 42 45 46 C 30 52 25 65 35 78 C 38 82 45 85 50 85 C 65 85 75 75 78 60 C 72 70 60 75 52 70 C 45 65 50 55 60 52 C 72 48 78 35 70 22 C 65 18 58 15 50 15 Z" />
          </svg>
          <span className="font-extrabold text-[12px] tracking-widest text-[#006bd1] block uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-100">Hallym Media curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight select-none">
          전공 교육과정 로드맵
        </h1>
        <div className="w-16 h-1 bg-[#006bd1] mx-auto rounded-full" />
      </div>

      {/* 3. 전공 교육 개념도 비주얼 박스 */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm select-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-60" />
        
        <div className="flex items-center gap-2 select-none">
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded-full bg-[#006bd1] animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-cyan-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">전공 교육 개념도</h2>
        </div>
        
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
          언론 / 방송인에 필요한 <strong className="text-[#006bd1] font-bold border-b-2 border-[#006bd1]/20 pb-0.5">글쓰기, 말하기, 영상으로 이야기 하는 능력</strong>을 기름으로써 매체 종사자는 물론 다양한 직종에도 적응할 수 있는 고도화된 기능적 기초체력을 완비하도록 돕습니다.
        </p>

        {/* 잠재력 극대화 슬로건 플레이트 */}
        <div className="bg-[#1b3b6f] text-white p-6 sm:p-8 rounded-2xl select-text border border-slate-700/50 shadow-md relative group">
          <div className="absolute top-3 right-3 text-white/5 opacity-50 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-[120px] h-[120px] fill-current" viewBox="0 0 100 100">
              <path d="M 50 15 C 38 15 28 22 25 32 C 32 25 45 23 52 28 C 58 32 55 42 45 46 C 30 52 25 65 35 78 C 38 82 45 85 50 85 C 65 85 75 75 78 60 C 72 70 60 75 52 70 C 45 65 50 55 60 52 C 72 48 78 35 70 22 C 65 18 58 15 50 15 Z" />
            </svg>
          </div>
          <div className="relative space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-black tracking-widest text-[#00b0ff] uppercase block">Hallym Vision Core</span>
            <h3 className="text-base sm:text-lg font-black leading-snug tracking-tight text-white">
              잠재력을 극대화할 "실무 능력 절대 우위"의 학과 육성설계
            </h3>
            <p className="text-sky-100 text-xs sm:text-sm leading-relaxed font-semibold opacity-90 max-w-2xl">
              실무와 역동적 이론을 치밀하게 결합한 미디어스쿨 전용 교육으로 직무 경쟁력을 비약적으로 끌어올립니다. 지루한 암기식 수업은 배제하고, 현업 기획서 연동식 시뮬레이션으로 재미있고 압도적 실재감을 지닌 혁신 과정입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 4. [인터랙티브 개선점] 5대 전공 커리어 코스 로드맵 */}
      <div className="space-y-6" id="career-tracks-roadmap">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 select-none">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              미디어스쿨 5대 특성화 Career 코스맵
            </h3>
            <p className="text-xs text-gray-500 font-bold">원하는 트랙 카드를 터치/클릭하시면 해해당 트랙 맞춤 교과목들이 하단 개설표에서 반짝여 비추어집니다.</p>
          </div>
          {activeTrack && (
            <button
              onClick={() => {
                setActiveTrack(null);
                onShowToast('추천 코스 하이라이트 필터를 해제했습니다.');
              }}
              className="text-xs font-black text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1 select-none transition shrink-0 cursor-pointer"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>하이라이트 전체해제</span>
            </button>
          )}
        </div>

        {/* 5대 트랙 카드 그리드 구도 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 select-none">
          {careerTracks.map((track) => {
            const isSelected = activeTrack === track.id;
            const IconComponent = track.icon;
            
            return (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(track.id)}
                className={`text-left p-5 border rounded-2xl flex flex-col justify-between gap-4 transition duration-300 relative group cursor-pointer ${
                  isSelected 
                    ? `border-blue-600 shadow-lg ring-2 ring-blue-500/20 bg-blue-50/50` 
                    : `border-gray-200 bg-white hover:border-slate-400 hover:shadow-md`
                }`}
              >
                {/* 상단 부분 */}
                <div className="space-y-3 w-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 ${
                    isSelected ? 'bg-[#006bd1] text-white' : 'bg-slate-50 text-slate-700 group-hover:bg-slate-100'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-[#111926] text-sm tracking-tight">
                    {track.title}
                  </h4>
                </div>

                {/* 선택된 상태 가시 시각물 */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block select-all ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-gray-500'
                }`}>
                  {isSelected ? '선택 활성' : '트랙 매칭'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 선택된 트랙 상세 브리핑 플레이트 */}
        {activeTrackInfo && (
          <div className="bg-[#f0f7ff] border-l-4 border-[#006bd1] rounded-r-2xl p-6 space-y-4 animate-slideUp select-text">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-white bg-[#006bd1] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Selected Course Track
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {activeTrackInfo.title} 양성 상세 로드맵
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
                권장교과목 총 {activeTrackInfo.recommendedCourses.length}개 편성
              </span>
            </div>

            <p className="text-slate-700 text-xs sm:text-sm font-semibold max-w-4xl">
              🎯 <strong className="text-slate-900">핵심 가이드:</strong> {activeTrackInfo.tagline}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeTrackInfo.details.map((detail, index) => (
                <li key={index} className="bg-white/80 p-3.5 rounded-xl border border-blue-100 flex gap-2 text-xs text-slate-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#006bd1] shrink-0 mt-0.5" />
                  <span className="leading-normal">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5. 학년(수준)별 및 학기 분할 검색형 테이블 */}
      <div className="space-y-6">
        
        {/* 제어 패널 */}
        <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-xs select-none">
          
          {/* 학년(수준) 탭 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-0.5 select-none shrink-0 border border-slate-200/40">
            {[
              { id: 'I', title: '수준 I (기초 과정)' },
              { id: 'II', title: '수준 II (심화 과정)' },
              { id: 'III', title: '수준 III (실무/캡스톤)' }
            ].map((lvl) => {
              const active = activeLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    setActiveLevel(lvl.id as 'I' | 'II' | 'III');
                    onShowToast(`학년 교과과정 수준 [${lvl.title}] 개설표로 스위칭되었습니다.`);
                  }}
                  className={`flex-1 sm:flex-none text-xs font-black px-4 py-2.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    active 
                      ? 'bg-[#006bd1] text-white shadow-xs' 
                      : 'text-gray-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lvl.title}
                </button>
              );
            })}
          </div>

          {/* 과목 실시간 검색 인풋 장치 */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="교과목명 또는 사코드 6자리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006bd1] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onShowToast('검색창이 리셋되었습니다.');
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-slate-900 text-[11px] font-bold cursor-pointer"
              >
                지우기
              </button>
            )}
          </div>

        </div>

        {/* 1학기 vs 2학기 테이블 대조 배치 그리드구도 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
          
          {/* 1학기 패널 테이블 */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="bg-[#1b3b6f] text-white px-5 py-4 flex justify-between items-center select-none border-b border-slate-700">
                <span className="text-sm font-black tracking-tight">1학기 개설 과목</span>
                <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded-full select-text">
                  검색결과: {filteredCourses1st.length}개 과목
                </span>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-left border-collapse select-none">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
                      <th className="py-3 px-4 w-24">교과목 번호</th>
                      <th className="py-3 px-4">과목명</th>
                      <th className="py-3 px-4 w-28">학점-강의-실습</th>
                      <th className="py-3 px-4 w-20 text-center">선택조회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses1st.length > 0 ? (
                      filteredCourses1st.map((course) => {
                        const isRecommended = trackRecommendedCodes.includes(course.code);
                        const isHighlight = activeTrack && isRecommended;
                        
                        return (
                          <tr 
                            key={course.code}
                            className={`text-xs hover:bg-slate-50/50 transition cursor-pointer group ${
                              isHighlight ? 'bg-blue-50/70 hover:bg-blue-100/50 ring-1 ring-inset ring-blue-200' : ''
                            }`}
                            onClick={() => setSelectedCourse(course)}
                          >
                            <td className="py-3.5 px-4 font-mono font-medium text-gray-400 select-text">
                              {course.code}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                <span>{course.name}</span>
                                {isHighlight && (
                                  <span className="bg-sky-500 text-white text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded-md animate-pulse">
                                    추천
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-600 font-semibold">
                              {course.type}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCourse(course);
                                }}
                                className="text-[10px] font-black text-blue-600 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition cursor-pointer"
                              >
                                설명보기
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 px-4 text-center text-xs font-semibold text-gray-400">
                          해당 조건에 부합하는 1학기 개설 과목이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 2학기 패널 테이블 */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="bg-[#1b3b6f] text-white px-5 py-4 flex justify-between items-center select-none border-b border-slate-700">
                <span className="text-sm font-black tracking-tight">2학기 개설 과목</span>
                <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded-full select-text">
                  검색결과: {filteredCourses2nd.length}개 과목
                </span>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-left border-collapse select-none">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
                      <th className="py-3 px-4 w-24">교과목 번호</th>
                      <th className="py-3 px-4">과목명</th>
                      <th className="py-3 px-4 w-28">학점-강의-실습</th>
                      <th className="py-3 px-4 w-20 text-center">선택조회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses2nd.length > 0 ? (
                      filteredCourses2nd.map((course) => {
                        const isRecommended = trackRecommendedCodes.includes(course.code);
                        const isHighlight = activeTrack && isRecommended;
                        
                        return (
                          <tr 
                            key={course.code}
                            className={`text-xs hover:bg-slate-50/50 transition cursor-pointer group ${
                              isHighlight ? 'bg-blue-50/70 hover:bg-blue-100/50 ring-1 ring-inset ring-blue-200' : ''
                            }`}
                            onClick={() => setSelectedCourse(course)}
                          >
                            <td className="py-3.5 px-4 font-mono font-medium text-gray-400 select-text">
                              {course.code}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                <span>{course.name}</span>
                                {isHighlight && (
                                  <span className="bg-sky-500 text-white text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded-md animate-pulse">
                                    추천
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-600 font-semibold">
                              {course.type}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCourse(course);
                                }}
                                className="text-[10px] font-black text-blue-600 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition cursor-pointer"
                              >
                                설명보기
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 px-4 text-center text-xs font-semibold text-gray-400">
                          해당 조건에 부합하는 2학기 개설 과목이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* 6. 전공간 코드쉐어 뱃지 레일 표시 */}
        <div className="bg-amber-50 hover:bg-amber-100/60 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none transition">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full shrink-0" />
            <span className="text-xs font-black text-slate-800">
              학칙 교과 인정 공지 : <span className="text-[#006bd1]">코드쉐어 부서 지정제</span>
            </span>
          </div>
          <span className="text-[10.5px] font-extrabold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-lg tracking-wide shrink-0">
            디지털미디어콘텐츠전공과 미디어커뮤니케이션전공 상호 100% 교과목 이수 학점 상호 동일인정
          </span>
        </div>

      </div>

      {/* 7. 과목 상세 개별 설명 모달 팝업 가시 영역 */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={() => setSelectedCourse(null)}>
          <div 
            className="bg-white w-full max-w-lg rounded-3xl border border-gray-200 overflow-hidden shadow-2xl relative select-text" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상부 배너 */}
            <div className="bg-[#1b3b6f] text-white p-6 select-none flex justify-between items-start border-b border-slate-700">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-[#00b0ff] uppercase block">
                  Course syllabus summary
                </span>
                <h4 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  {selectedCourse.name}
                </h4>
              </div>
              <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md text-sky-200 font-bold select-text">
                사_코드: {selectedCourse.code}
              </span>
            </div>

            {/* 교안 내용 */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 select-none">
                <div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block">개설 레벨</span>
                  <span className="text-xs font-extrabold text-[#006bd1] block">
                    {selectedCourse.level === 'I' && '수준 I (1-2학년 권장 기초지식)'}
                    {selectedCourse.level === 'II' && '수준 II (2-3학년 권장 심화실무)'}
                    {selectedCourse.level === 'III' && '수준 III (3-4학년 실전/캡스톤)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block">학점 및 이수 배분</span>
                  <span className="text-xs font-mono font-black text-slate-800 block">
                    {selectedCourse.type} (학점-강의-실습)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block">개설 학기</span>
                  <span className="text-xs font-extrabold text-emerald-600 block">
                    매 학년도 {selectedCourse.semester}학기 정규과정
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block">설계 자격</span>
                  <span className="text-xs font-extrabold text-amber-600 block">
                    전공필수 선행권장
                  </span>
                </div>
              </div>

              {/* 상세설명 해독 */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block select-none">교과목 강의 개요</span>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl whitespace-pre-line">
                  {selectedCourse.desc || '미디어스쿨 특화 교육 실습과정입니다. 세부 강의 교수 및 주차별 교안 세부 항목은 수강신청 전 한림대학교 성적종합포털 통합강의계획서 조회 기능을 연계 참조하여 주십시오.'}
                </p>
              </div>
            </div>

            {/* 하부 조작 레일 */}
            <div className="bg-slate-50 border-t border-gray-100 p-4 flex justify-between items-center select-none">
              <span className="text-[10.5px] font-bold text-gray-400">
                한림대학교 미디어스쿨 전공주임교수 수여 규정
              </span>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="bg-slate-800 hover:bg-slate-900 hover:text-white text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                조회완료 닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
