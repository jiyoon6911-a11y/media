/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home, Printer, Star, Share2, ChevronDown, Check } from 'lucide-react';

interface BreadcrumbBarProps {
  onShowToast: (msg: string) => void;
  activeSubcategory: string;
  setActiveSubcategory: (sc: string) => void;
}

export default function BreadcrumbBar({ onShowToast, activeSubcategory, setActiveSubcategory }: BreadcrumbBarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const categories = ['미디어스쿨 소개', '교과과정 안내', '알림사항', '학생활동 소식'];
  const subcategories = ['장비지원실', '공지사항', '미디어실습실 안내', 'Q&A'];

  const handlePrint = () => {
    window.print();
    onShowToast('인쇄 화면이 활성화되었습니다.');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        onShowToast('링크공사: 주소가 클립보드에 복사되었습니다!');
      })
      .catch(() => {
        onShowToast('주소 복사에 실패했습니다.');
      });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onShowToast(!isBookmarked ? '즐겨찾기에 등록되었습니다.' : '즐겨찾기에서 해제되었습니다.');
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm relative z-30 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex justify-between items-center text-sm text-gray-700">
        {/* Breadcrumb Left Items */}
        <div className="flex items-center gap-2 sm:gap-4 h-full">
          {/* Home button */}
          <button
            onClick={() => onShowToast('메인 홈화면으로 이동했습니다.')}
            className="text-gray-500 hover:text-[#006bd1] transition duration-150 p-1 cursor-pointer"
            id="home-crumb"
          >
            <Home className="w-[18px] h-[18px]" />
          </button>

          {/* Separator Line */}
          <div className="h-4 w-[1px] bg-gray-300" />

          {/* First drop-down menu: "알림사항" */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryMenu(!showCategoryMenu);
                setShowSubMenu(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition font-medium cursor-pointer"
              id="top-category-select"
            >
              <span>알림사항</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
            </button>

            {showCategoryMenu && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-40 animate-fadeIn">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setShowCategoryMenu(false);
                      onShowToast(`"${cat}" 카테고리로 변경을 처리 중입니다.`);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition text-xs font-semibold flex justify-between items-center ${
                      cat === '알림사항' ? 'text-[#006bd1] bg-slate-50' : 'text-gray-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === '알림사항' && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Separator Line */}
          <div className="h-4 w-[1px] bg-gray-300" />

          {/* Second drop-down menu: "장비지원실" with blue highlighting */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSubMenu(!showSubMenu);
                setShowCategoryMenu(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#e6f4ff] rounded text-[#006bd1] font-extrabold hover:text-[#005bb3] transition cursor-pointer"
              id="subcategory-select"
            >
              <span>{activeSubcategory}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#006bd1]-400 transition-transform ${showSubMenu ? 'rotate-180' : ''}`} />
            </button>

            {showSubMenu && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-40 animate-fadeIn">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setShowSubMenu(false);
                      setActiveSubcategory(sub);
                      onShowToast(`게시판이 "${sub}"로 전환되었습니다.`);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition text-xs font-bold flex justify-between items-center ${
                      sub === activeSubcategory ? 'text-[#006bd1] bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    <span>{sub}</span>
                    {sub === activeSubcategory && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side utilities */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Printer Icon */}
          <button
            onClick={handlePrint}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer transition duration-150"
            title="인쇄"
            id="print-btn"
          >
            <Printer className="w-[18px] h-[18px]" />
          </button>

          {/* Star Icon for Bookmarks */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full cursor-pointer transition duration-150 ${
              isBookmarked
                ? 'text-[#f59e0b] bg-amber-50 hover:bg-amber-100'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="즐겨찾기"
            id="favorite-btn"
          >
            <Star className={`w-[18px] h-[18px] ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Share/Link Icon */}
          <button
            onClick={handleShare}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer transition duration-150"
            title="공유"
            id="share-btn"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
