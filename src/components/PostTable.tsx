/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Paperclip, ChevronDown, Rss, ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight, Megaphone, Check } from 'lucide-react';
import { Post } from '../types';
import Modal from './Modal';
import EquipmentList from './EquipmentList';
import RentalForm from './RentalForm';
import RentalPolicy from './RentalPolicy';

interface PostTableProps {
  onShowToast: (msg: string) => void;
  activeSubcategory: string;
}

export default function PostTable({ onShowToast, activeSubcategory }: PostTableProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<'title' | 'author'>('title');
  const [showCriteriaDropdown, setShowCriteriaDropdown] = useState(false);
  const [activeEquipmentForForm, setActiveEquipmentForForm] = useState('');

  // Built list of posts modeled EXACTLY on the images provided
  const mockPosts: Post[] = [
    {
      id: 'post-1',
      index: 3,
      isPinned: true,
      title: '[25년 9월 24일 변경] 미디어스쿨 장비지원실 대여 가능 장비리스트 (일송 지하 1층)',
      author: '미디어스쿨 장비지원실',
      date: '2025-09-24',
      views: 1379,
      contentType: 'equipment',
      attachmentsList: [
        { name: '2025_미디어스쿨_대여가능_기기총계표.pdf', size: '241 KB' }
      ]
    },
    {
      id: 'post-2',
      index: 2,
      isPinned: true,
      title: '[미디어스쿨 장비지원실] 장비 대여 신청서, 체크리스트, 집회신고서 양식',
      author: '미디어스쿨 장비지원실',
      date: '2025-01-01',
      views: 6441,
      contentType: 'form',
      attachmentsList: [
        { name: '장비_대여_신청서_서식_신규.hwp', size: '42 KB' },
        { name: '대여_전_기기자가_체크리스트.docx', size: '18 KB' },
        { name: '야간_및_공휴일_미디어관_지하실습실_사용집회신고서.hwp', size: '31 KB' }
      ]
    },
    {
      id: 'post-3',
      index: 1,
      isPinned: true,
      title: '[ 미디어스쿨 장비지원실 ] 장비 대여 기준, 미디어스쿨 실습실 대여 기준',
      author: '미디어스쿨 장비지원실',
      date: '2025-01-01',
      views: 5888,
      contentType: 'policy',
      attachmentsList: []
    }
  ];

  // Concatenate Pinned announcements and standard rows to represent the list exactly as shown in Image 2
  // Pinned items are shown topped by a megaphone icon, and below are the same elements with their actual index numbers
  const allRows = [
    // Pinned rows at the top
    ...mockPosts.map(p => ({ ...p, isRowPin: true })),
    // Numeric index rows directly below
    ...mockPosts.map(p => ({ ...p, isRowPin: false }))
  ];

  const filteredRows = allRows.filter((row) => {
    if (!searchQuery) return true;
    if (searchCriteria === 'title') {
      return row.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return row.author.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  const handleRowClick = (row: Post) => {
    setSelectedPost(row);
    onShowToast(`"${row.title.substring(0, 20)}..." 안내문 공시가 활성화되었습니다.`);
  };

  // Helper when clicking an equipment "Rent" in Equipment list to feed directly into the digital application form
  const handleSelectEquipmentForForm = (equipmentModel: string) => {
    setActiveEquipmentForForm(equipmentModel);
    // Find form post to transition modal content directly
    const formPost = mockPosts.find(p => p.contentType === 'form');
    if (formPost) {
      setSelectedPost(formPost);
    }
  };

  return (
    <div className="w-full bg-white py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Large stylized Center header: Seagull Wing Blue Logo topped with bold "장비지원실" title */}
        <div className="flex flex-col items-center justify-center mb-10 text-center select-none" id="board-logo-title-holder">
          <svg
            className="w-8 h-8 fill-current text-[#006bd1] mb-2"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 50 15 C 38 15 28 22 25 32 C 32 25 45 23 52 28 C 58 32 55 42 45 46 C 30 52 25 65 35 78 C 38 82 45 85 50 85 C 65 85 75 75 78 60 C 72 70 60 75 52 70 C 45 65 50 55 60 52 C 72 48 78 35 70 22 C 65 18 58 15 50 15 Z" />
          </svg>
          <h2 className="text-[28px] sm:text-[34px] font-extrabold text-slate-900 tracking-tight" id="board-main-title">
            장비지원실
          </h2>
          <div className="w-12 h-[2px] bg-[#006bd1] mt-3" />
        </div>

        {/* Board Search and Metrics Control bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4 border-b border-[#033B76]/10 pb-4 select-none">
          {/* Left statistics info metrics */}
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-[#f59e0b] text-white rounded-md shrink-0 flex items-center justify-center shadow-xs">
              <Rss className="w-4 h-4" />
            </span>
            <div className="text-xs sm:text-xs font-bold text-gray-500 tracking-tight flex items-center gap-1.5">
              <span>총 게시물 : <strong className="text-rose-500 font-extrabold">{filteredRows.filter(r=>!r.isRowPin).length}</strong></span>
              <div className="h-3 w-[1px] bg-gray-300" />
              <span>페이지 : <strong className="text-slate-800 font-extrabold">1</strong>/1</span>
            </div>
          </div>

          {/* Right Search Input tool area */}
          <div className="flex items-center border border-gray-300 bg-white rounded-lg px-2 py-1 relative shadow-xs max-w-sm w-full self-end sm:self-auto">
            {/* Search Criteria selector drop down */}
            <div className="relative border-r border-gray-200 pr-1 shrink-0">
              <button
                onClick={() => setShowCriteriaDropdown(!showCriteriaDropdown)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                id="search-criteria-btn"
              >
                <span>{searchCriteria === 'title' ? '제목' : '작성자'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showCriteriaDropdown && (
                <div className="absolute left-0 mt-2 w-28 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-40 animate-fadeIn text-xs font-bold">
                  <button
                    onClick={() => {
                      setSearchCriteria('title');
                      setShowCriteriaDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-gray-700 flex justify-between items-center"
                  >
                    <span>제목</span>
                    {searchCriteria === 'title' && <Check className="w-3 h-3 text-[#006bd1]" />}
                  </button>
                  <button
                    onClick={() => {
                      setSearchCriteria('author');
                      setShowCriteriaDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-gray-700 flex justify-between items-center"
                  >
                    <span>작성자</span>
                    {searchCriteria === 'author' && <Check className="w-3 h-3 text-[#006bd1]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Main Search Input */}
            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs font-semibold px-3 py-1.5 focus:outline-none placeholder-gray-400 text-gray-700"
              id="main-board-search-input"
            />

            {/* Quick search button */}
            <button
              onClick={() => onShowToast(`"${searchQuery || '전체'}" 검색을 완료했습니다.`)}
              className="p-1.5 text-slate-800 hover:text-[#006bd1] transition cursor-pointer"
              id="main-board-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Board main table list */}
        <div className="w-full border-t-[2px] border-slate-900 border-b border-gray-200 overflow-x-auto shadow-xs rounded-b-lg">
          <table className="w-full text-left border-collapse min-w-[800px]" id="board-table">
            
            {/* Headers row exactly matching image styling */}
            <thead>
              <tr className="bg-slate-50 text-slate-800 font-extrabold text-[13px] border-b border-gray-250 border-gray-200">
                <th className="py-3 px-4 text-center w-16">번호</th>
                <th className="py-3 px-4 text-left">제목</th>
                <th className="py-3 px-4 text-left w-48">작성자</th>
                <th className="py-3 px-4 text-center w-28">첨부파일</th>
                <th className="py-3 px-4 text-center w-28">작성일</th>
                <th className="py-3 px-4 text-center w-20">조회</th>
              </tr>
            </thead>

            {/* Body rows */}
            <tbody className="divide-y divide-gray-200 text-xs sm:text-[13px] font-semibold text-gray-700 select-text">
              {filteredRows.map((row, index) => {
                const isPin = row.isRowPin;
                return (
                  <tr
                    key={`${row.id}-${isPin ? 'pin' : 'norm'}`}
                    onClick={() => handleRowClick(row)}
                    className={`hover:bg-[#f6faff]/70 cursor-pointer transition duration-150 ${
                      isPin ? 'bg-[#f7fafc]' : 'bg-white'
                    }`}
                  >
                    
                    {/* Index column No. with Pin Megaphone Icon matching Image Column */}
                    <td className="py-3 px-4 text-center select-none font-bold">
                      {isPin ? (
                        <div className="flex justify-center items-center">
                          <span className="bg-[#006bd1]/15 text-[#006bd1] rounded p-1" title="공지">
                            {/* Blue Megaphone megaphone symbol */}
                            <Megaphone className="w-3.5 h-3.5 fill-current rotate-[-10deg]" />
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-bold">{row.index}</span>
                      )}
                    </td>

                    {/* Post Title Column Column */}
                    <td className="py-3 px-4 text-left group-hover:text-[#006bd1] transition font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="hover:underline tracking-tight select-text">
                          {row.title}
                        </span>
                      </div>
                    </td>

                    {/* Author column */}
                    <td className="py-3 px-4 text-left select-none text-gray-500 font-bold">
                      {row.author}
                    </td>

                    {/* Files Attachment Symbol icon column */}
                    <td className="py-3 px-4 text-center select-none">
                      {row.attachmentsList.length > 0 ? (
                        <div className="flex justify-center items-center relative inline-block">
                          <Paperclip className="w-3.5 h-3.5 text-[#006bd1]" />
                          {row.attachmentsList.length > 1 && (
                            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                              {row.attachmentsList.length}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    {/* Timestamp column */}
                    <td className="py-3 px-4 text-center select-none text-gray-400 font-bold">
                      {row.date}
                    </td>

                    {/* Views counter column */}
                    <td className="py-3 px-4 text-center select-none text-gray-400 font-bold">
                      {row.views}
                    </td>

                  </tr>
                );
              })}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 select-none font-semibold bg-slate-50/50">
                    등록되어 있거나 조건에 맞는 알림사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Board footer pagination controls */}
        <div className="mt-8 flex justify-center items-center gap-1.5 select-none" id="board-pagination">
          {/* Double Left arrows */}
          <button
            onClick={() => onShowToast('처음 페이지입니다.')}
            className="w-8 h-8 rounded border border-gray-250 hover:bg-slate-50 flex items-center justify-center text-gray-400 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          
          {/* Single Left arrow */}
          <button
            onClick={() => onShowToast('이전 페이지가 없습니다.')}
            className="w-8 h-8 rounded border border-gray-250 hover:bg-slate-50 flex items-center justify-center text-gray-400 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5 rotate-90" />
          </button>

          {/* Core Page indicator link */}
          <button className="w-8 h-8 rounded bg-[#006bd1] text-white font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-sm shadow-blue-500/25">
            1
          </button>

          {/* Single Right arrow */}
          <button
            onClick={() => onShowToast('다음 페이지가 없습니다.')}
            className="w-8 h-8 rounded border border-gray-250 hover:bg-slate-50 flex items-center justify-center text-gray-400 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>

          {/* Double Right arrows */}
          <button
            onClick={() => onShowToast('마지막 페이지입니다.')}
            className="w-8 h-8 rounded border border-gray-250 hover:bg-slate-50 flex items-center justify-center text-gray-400 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Modal View content mapping injection */}
        {selectedPost && (
          <Modal
            isOpen={selectedPost !== null}
            onClose={() => {
              setSelectedPost(null);
              // Clear equipment feed state if closing modal
              setActiveEquipmentForForm('');
            }}
            title={selectedPost.title}
            author={selectedPost.author}
            date={selectedPost.date}
            views={selectedPost.views}
            attachments={selectedPost.attachmentsList}
            onShowToast={onShowToast}
          >
            {/* Inject proper sub module component based on clicked row data */}
            {selectedPost.contentType === 'equipment' && (
              <EquipmentList
                onSelectEquipment={handleSelectEquipmentForForm}
                onShowToast={onShowToast}
              />
            )}
            
            {selectedPost.contentType === 'form' && (
              <RentalForm
                initialEquipment={activeEquipmentForForm}
                onShowToast={onShowToast}
              />
            )}

            {selectedPost.contentType === 'policy' && (
              <RentalPolicy />
            )}
          </Modal>
        )}

      </div>
    </div>
  );
}
