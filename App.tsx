
import React, { useState, useCallback } from 'react';
import { AppState, AgeGroup } from './types';
import Sidebar from './components/Sidebar';
import CharacterPreview from './components/CharacterPreview';
import { generate3DCharacter } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    sourceImage: null,
    resultImage: null,
    ageGroup: 'Adult',
    isGenerating: false,
    error: null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setState(prev => ({ ...prev, error: '사진 용량이 너무 커요! 5MB 이하로 부탁드려요.' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          sourceImage: reader.result as string,
          resultImage: null,
          error: null 
        }));
      };
      reader.onerror = () => {
        setState(prev => ({ ...prev, error: '사진을 읽어오는데 실패했어요. 다시 시도해볼까요?' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (age: AgeGroup) => {
    setState(prev => ({ ...prev, ageGroup: age }));
  };

  const handleGenerate = async () => {
    if (!state.sourceImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generate3DCharacter(
        state.sourceImage, 
        state.ageGroup
      );
      setState(prev => ({ 
        ...prev, 
        resultImage: result, 
        isGenerating: false 
      }));
    } catch (err: any) {
      console.error('Generation Error:', err);
      let errorMessage = '어라! 캐릭터를 만드는 도중에 문제가 생겼어요. 다시 한 번 시도해볼까요? ✨';
      
      if (err?.message?.includes('API key')) {
        errorMessage = 'API 키 설정에 문제가 있는 것 같아요. 확인이 필요해요!';
      }
      
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: errorMessage 
      }));
    }
  };

  const handleDownload = useCallback(() => {
    if (!state.resultImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = state.resultImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        try {
          const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.href = jpgUrl;
          link.download = `my-3d-character-${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error("Download failed:", e);
          setState(prev => ({ ...prev, error: '저장에 실패했습니다. 이미지를 길게 눌러 저장해보세요!' }));
        }
      }
    };
  }, [state.resultImage]);

  const handleClear = () => {
    setState({
      sourceImage: state.sourceImage, // 원본 이미지는 유지하여 다시 생성하기 쉽게 함
      resultImage: null,
      ageGroup: state.ageGroup,
      isGenerating: false,
      error: null
    });
  };

  // 모바일에서 결과 화면일 때 사이드바를 숨길지 여부
  const isShowResult = state.isGenerating || !!state.resultImage;

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[#fffcfd] text-slate-900">
      {/* 결과 화면이 아닐 때만 혹은 데스크탑에서만 사이드바 노출 */}
      <div className={`${isShowResult ? 'hidden md:block' : 'block'} flex-shrink-0`}>
        <Sidebar 
          onImageUpload={handleImageUpload}
          sourceImage={state.sourceImage}
          age={state.ageGroup}
          onAgeChange={handleAgeChange}
          onGenerate={handleGenerate}
          isGenerating={state.isGenerating}
          hasImage={!!state.sourceImage}
        />
      </div>
      
      <main className={`flex-1 relative overflow-hidden flex flex-col ${isShowResult ? 'w-full h-full' : ''}`}>
        {state.error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 bg-rose-50 border-2 border-rose-100 text-rose-500 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500 shadow-xl z-50">
            <i className="fas fa-triangle-exclamation text-xl"></i>
            <span className="font-bold text-sm flex-1">{state.error}</span>
            <button onClick={() => setState(p => ({...p, error: null}))} className="text-rose-300 hover:text-rose-500 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <CharacterPreview 
          sourceImage={state.sourceImage}
          resultImage={state.resultImage}
          isGenerating={state.isGenerating}
          onDownload={handleDownload}
          onClear={handleClear}
        />

        {/* Floating Decoration */}
        <div className="absolute bottom-6 right-6 hidden md:flex flex-col items-center gap-2">
           <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-pink-100 shadow-sm">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-tighter">Powered by Gemini AI</span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
