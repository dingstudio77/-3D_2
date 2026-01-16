
import React from 'react';

interface CharacterPreviewProps {
  sourceImage: string | null;
  resultImage: string | null;
  isGenerating: boolean;
  onDownload: () => void;
  onClear: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  sourceImage,
  resultImage,
  isGenerating,
  onDownload,
  onClear
}) => {
  if (!isGenerating && !resultImage) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center gap-8 animate-in fade-in duration-1000">
        <div className="relative">
          <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
            <i className="fas fa-face-smile-wink text-6xl text-pink-400"></i>
          </div>
          <div className="absolute -top-2 -right-2 bg-rose-400 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white animate-bounce">
            <i className="fas fa-heart text-xs"></i>
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-black text-pink-600 mb-4 tracking-tight leading-tight">세상에서 가장 귀여운<br/>나만의 3D 캐릭터</h1>
          <p className="text-pink-400 font-bold text-lg leading-relaxed">
            사진 한 장으로 Pixar 스타일의<br/>전신 3D 캐릭터를 만들어보세요! 🍬
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 md:p-8 flex flex-col h-full bg-[#fffcfd] overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-full gap-2 md:gap-6">
        
        {/* Result Header - Slimmer on mobile */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-base md:text-2xl font-black text-pink-600 flex items-center gap-1.5">
            {isGenerating ? (
              <><i className="fas fa-wand-sparkles animate-pulse"></i> 변신 중...</>
            ) : (
              <><i className="fas fa-star text-yellow-400"></i> 완성!</>
            )}
          </h2>
          {!isGenerating && (
            <button 
              onClick={onClear}
              className="px-2.5 py-1 md:px-4 md:py-2 bg-pink-50 text-pink-500 rounded-full font-bold transition-all hover:bg-pink-100 text-[10px] md:text-sm flex items-center gap-1 shadow-sm"
            >
              <i className="fas fa-rotate-right"></i>
              다시 하기
            </button>
          )}
        </div>

        {/* Big Result Card - Maximum space usage */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl md:rounded-[3rem] border-2 md:border-8 border-pink-50 overflow-hidden shadow-xl flex items-center justify-center relative bg-gradient-to-br from-pink-50 via-white to-rose-50">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <div className="w-12 h-12 md:w-24 md:h-24 border-4 md:border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-pink-600 font-black text-base md:text-2xl italic">Kawaii Magic...</span>
                <p className="text-[9px] md:text-sm text-pink-300 font-bold">캐릭터를 렌더링하고 있어요 ✨</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full p-1.5 md:p-4 flex items-center justify-center">
              <img 
                src={resultImage!} 
                alt="Generated Character" 
                className="max-w-full max-h-full object-contain animate-in zoom-in fade-in duration-700 drop-shadow-[0_10px_30px_rgba(244,114,182,0.2)]"
              />
            </div>
          )}
        </div>
        
        {/* Action Buttons - Very compact on mobile */}
        {!isGenerating && resultImage && (
          <div className="flex flex-col gap-1 animate-in slide-in-from-bottom duration-500 pb-1">
            <button 
              onClick={onDownload}
              className="w-full py-3 md:py-5 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl md:rounded-[2rem] font-black text-base md:text-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg shadow-pink-100"
            >
              <i className="fas fa-download"></i>
              이미지 저장
            </button>
            <p className="text-center text-pink-300 text-[8px] md:text-xs font-bold">
               길게 눌러서 저장도 가능해요! 💖
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterPreview;
