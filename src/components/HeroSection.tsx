/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
      title: '알림사항',
      subtitle: '인류를 위한 보편적 가치를 함양하고, 사회와 국가의 발전에 기여하며, 글로벌 사회와 함께 성장하는 선진인재',
      tag: 'Hallym University Media School',
    },
    {
      backgroundImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop',
      title: '미디어스쿨 실습지원실',
      subtitle: '최첨단 4K 촬영 장비, 전문 레코딩 장비, 그리고 쾌적한 제작 인프라를 바탕으로 미래 크리에이터를 양성합니다.',
      tag: 'Advanced Media Production Infrastructure',
    },
    {
      backgroundImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop',
      title: '스마트 장비 대여 엔진',
      subtitle: '학생증 인증을 통해 간편하게 장비를 신청하고 예매 승인 상태를 실시간으로 확인하세요.',
      tag: 'Seamless Resource Rental Portal',
    },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] overflow-hidden select-none" id="carousel-container">
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            id={`slide-${index}`}
          >
            {/* Dark tint overlay for pristine text contrast */}
            <div className="absolute inset-0 bg-slate-900/60 z-10" />
            
            {/* Background image style with safety parallax fit */}
            <div
              className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
            />
          </div>
        );
      })}

      {/* Slide Navigation Left/Right Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 border border-white/60 hover:border-white rounded-full flex items-center justify-center text-white/85 hover:text-white bg-slate-950/20 hover:bg-slate-950/40 cursor-pointer transition-all hover:scale-105"
        aria-label="Previous Slide"
        id="btn-prev-slide"
      >
        <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 border border-white/60 hover:border-white rounded-full flex items-center justify-center text-white/85 hover:text-white bg-slate-950/20 hover:bg-slate-950/40 cursor-pointer transition-all hover:scale-105"
        aria-label="Next Slide"
        id="btn-next-slide"
      >
        <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
      </button>

      {/* Main Slogan & Title Overlay Center */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6 sm:px-12 text-center text-white">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-cyan-300 font-semibold mb-3 tracking-widest uppercase bg-slate-900/30 px-3 py-1 rounded backdrop-blur-[2px]">
          {slides[currentSlide].tag}
        </span>
        
        <h1 className="text-[34px] sm:text-[45px] md:text-[50px] font-extrabold tracking-tight mb-4 select-text max-w-3xl drop-shadow-md">
          {slides[currentSlide].title}
        </h1>
        
        <p className="text-[13px] sm:text-[15px] md:text-[16px] text-gray-200 font-normal leading-relaxed max-w-[850px] select-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4">
          {slides[currentSlide].subtitle}
        </p>

        {/* Carousel indicator dots */}
        <div className="absolute bottom-6 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                idx === currentSlide ? 'bg-cyan-400 w-6' : 'bg-white/40 hover:bg-white/70'
              }`}
              id={`dot-${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
