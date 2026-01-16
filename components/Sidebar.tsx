
import React from 'react';
import { AgeGroup, AgeLabels } from '../types';

interface SidebarProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sourceImage: string | null;
  age: AgeGroup;
  onAgeChange: (age: AgeGroup) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onImageUpload, 
  sourceImage,
  age, 
  onAgeChange, 
  onGenerate, 
  isGenerating,
  hasImage
}) => {
  const ageGroups: AgeGroup[] = ['Baby', 'Child', 'Teen', 'Adult', 'Elderly'];

  return (
    <div className="w-full md:w-80 bg-white border-r border-pink-100 h-full p-5 md:p-6 flex flex-col gap-5 md:gap-8 shadow-sm z-20 overflow-hidden shrink-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3 shrink-0">
          <i className="fas fa-face-grin-stars text-xl md:text-2xl"></i>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-pink-600 tracking-tight leading-none">마이캐릭3D</h1>
          <p className="text-[9px] md:text-[11px] text-pink-300 font-bold uppercase tracking-widest mt-1">Premium AI Maker</p>
        </div>
      </div>

      {/* Image Upload Section - Expanded height for mobile */}
      <section className="flex flex-col gap-2 flex-1 min-h-0">
        <label className="text-[11px] md:text-sm font-bold text-pink-400 flex items-center gap-2 px-1">
          <span className="bg-pink-100 w-4 h-4 rounded-full flex items-center justify-center text-[9px] md:text-[10px]">1</span>
          사진 업로드
        </label>
        <div className="relative group flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <div className={`border-2 border-dashed rounded-3xl h-full transition-all flex flex-col items-center justify-center gap-2 text-center overflow-hidden relative ${
            hasImage ? 'border-pink-400 bg-white shadow-inner' : 'border-pink-100 bg-pink-50/20 group-hover:border-pink-300'
          }`}>
            {sourceImage ? (
              <>
                <img src={sourceImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <i className="fas fa-camera-rotate text-white text-2xl mb-2"></i>
                  <span className="text-white text-xs font-bold bg-pink-500/80 px-3 py-1 rounded-full backdrop-blur-sm">사진 교체하기</span>
                </div>
                <div className="absolute top-3 right-3 bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10 border-2 border-white">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
              </>
            ) : (
              <div className="p-4 flex flex-col items-center">
                <div className="w-14 h-14 bg-pink-100/50 rounded-2xl flex items-center justify-center text-pink-300 mb-3 group-hover:scale-110 transition-transform">
                  <i className="fas fa-image text-3xl"></i>
                </div>
                <span className="text-sm md:text-base text-pink-500 font-black">이곳을 눌러 사진 선택</span>
                <p className="text-[10px] md:text-xs text-pink-300 mt-2 font-medium">얼굴이 잘 나온 사진이 좋아요! ✨</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Age Selection Section */}
      <section className="flex flex-col gap-2">
        <label className="text-[11px] md:text-sm font-bold text-pink-400 flex items-center gap-2 px-1">
          <span className="bg-pink-100 w-4 h-4 rounded-full flex items-center justify-center text-[9px] md:text-[10px]">2</span>
          캐릭터 연령대
        </label>
        <div className="grid grid-cols-5 md:grid-cols-2 gap-2">
          {ageGroups.map((group) => (
            <button
              key={group}
              onClick={() => onAgeChange(group)}
              className={`py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold transition-all border-2 ${
                age === group 
                ? 'bg-pink-500 text-white border-pink-500 shadow-md transform scale-[1.02]' 
                : 'bg-white text-pink-300 border-pink-50 hover:border-pink-200'
              }`}
            >
              {AgeLabels[group]}
            </button>
          ))}
        </div>
      </section>

      {/* Generate Button - More prominent on mobile */}
      <div className="mt-2 md:mt-4 flex flex-col gap-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !hasImage}
          className={`w-full py-4 md:py-5 rounded-2xl font-black text-base md:text-xl text-white shadow-xl flex items-center justify-center gap-3 transition-all ${
            isGenerating || !hasImage
            ? 'bg-pink-200 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:brightness-110 hover:shadow-pink-200 active:scale-95 shadow-pink-100'
          }`}
        >
          {isGenerating ? (
            <><i className="fas fa-spinner fa-spin"></i> 마법 부리는 중...</>
          ) : (
            <><i className="fas fa-wand-magic-sparkles"></i> 캐릭터 만들기</>
          )}
        </button>
        {!hasImage && !isGenerating && (
          <p className="text-[10px] md:text-xs text-center text-pink-400 font-bold animate-pulse">
             먼저 사진을 한 장 올려주세요! ✨
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
