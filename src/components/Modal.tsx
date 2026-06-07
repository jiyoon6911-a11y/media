/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Eye, FileText, Download } from 'lucide-react';

interface Attachment {
  name: string;
  size: string;
  url?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author: string;
  date: string;
  views: number;
  attachments: Attachment[];
  onShowToast: (msg: string) => void;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  author,
  date,
  views,
  attachments,
  onShowToast,
  children,
}: ModalProps) {
  
  const handleDownload = (fileName: string) => {
    onShowToast(`"${fileName}" 양식 파일 다운로드를 시작합니다 (시뮬레이션).`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card content wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white w-full max-w-4xl mx-4 my-8 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            id="modal-box"
          >
            {/* Header top section */}
            <div className="bg-[#121c2c] text-white px-6 py-5 select-none relative flex justify-between items-start">
              <div className="pr-10">
                <span className="text-[10px] bg-[#006bd1] text-white font-bold px-2 py-0.5 rounded tracking-wide uppercase mb-1.5 inline-block">
                  Media School Resource
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-slate-800 rounded-full p-1.5 transition cursor-pointer shrink-0 -mt-1"
                id="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta statistics bar */}
            <div className="bg-slate-50 border-b border-gray-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 font-medium select-none">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-700 font-bold">{author}</span>
                </div>
                <div className="h-3 w-[1px] bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>작성일: <strong className="font-semibold text-gray-600">{date}</strong></span>
                </div>
                <div className="h-3 w-[1px] bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span>조회수: <strong className="font-semibold text-gray-600">{views}</strong></span>
                </div>
              </div>
            </div>

            {/* Main scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="min-h-[160px]">
                {children}
              </div>
            </div>

            {/* Attachments Footer bar */}
            {attachments.length > 0 && (
              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 select-none">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-semibold font-bold text-gray-700 mb-1">
                    <FileText className="w-4 h-4 text-[#006bd1]" />
                    <span>첨부파일 ({attachments.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {attachments.map((file, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleDownload(file.name)}
                        className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-md hover:border-[#006bd1] hover:bg-blue-50/20 transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#006bd1] shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 truncate group-hover:text-[#006bd1]">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0 select-none">
                          {file.size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
