
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type AgeGroup = 'Baby' | 'Child' | 'Teen' | 'Adult' | 'Elderly';

const AgeLabels: Record<AgeGroup, string> = {
  Baby: '아기',
  Child: '어린이',
  Teen: '청소년',
  Adult: '성인',
  Elderly: '노년'
};

interface AppState {
  sourceImage: string | null;
  resultImage: string | null;
  ageGroup: AgeGroup;
  isGenerating: boolean;
  error: string | null;
}

// --- Services ---
const generate3DCharacter = async (
  imageBase64: string, 
  age: AgeGroup
): Promise<string> => {
  // 매 요청마다 새로운 인스턴스 생성 (보안 및 최신 키 반영 권장 사항)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Transform the person in this image into a premium, extremely adorable 3D character in the style of high-end animation studios like Pixar or Disney.

  CORE REQUIREMENTS:
  1. FULL BODY VIEW: Render the character from head to toe. Ensure the entire body silhouette is visible.
  2. CHARACTER STYLE: Extremely adorable, soft rounded shapes, pastel colors, oversized eyes, chibi-like proportions. High-end toy aesthetic.
  3. AGE APPEARANCE: Target age looks like a ${AgeLabels[age]}.
  4. VISUAL FIDELITY: 4K resolution rendering, professional studio lighting, subsurface scattering on skin for a soft glow, and high-detail fabric textures.
  5. COMPOSITION: Center the character with generous padding from all edges. No part of the character should be cropped.
  6. BACKGROUND: A clean, simple, and slightly blurry aesthetic background that complements the character's colors.

  Keep the original person's key features (hair color, skin tone, general facial structure) but translate them into this highly stylized 3D toy/animation aesthetic. Make it look professional and 'collectible' like a high-quality figurine.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('캐릭터 생성에 실패했습니다. 다시 시도해 주세요.');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('이미지 데이터를 찾을 수 없습니다.');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// --- Components ---

const Sidebar: React.FC<{
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sourceImage: string | null;
  age: AgeGroup;
  onAgeChange: (age: AgeGroup) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}> = ({ onImageUpload, sourceImage, age, onAgeChange, onGenerate, isGenerating }) => {
  const ageGroups: AgeGroup[] = ['Baby', 'Child', 'Teen', 'Adult', 'Elderly'];

  return (
    <div className="w-full md:w-80 bg-white border-r border-pink-100 h-full p-6 flex flex-col gap-8 shadow-sm z-20 overflow-y-auto shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
          <i className="fas fa-face-grin-stars text-2xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black text-pink-600 tracking-tight leading-none">마이캐릭3D</h1>
          <p className="text-[11px] text-pink-300 font-bold uppercase tracking-widest mt-1">Premium AI Maker</p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-bold text-pink-400 flex items-center gap-2 px-1">
          <span className="bg-pink-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
          사진 업로드
        </label>
        <div className="relative group aspect-square md:aspect-auto md:h-64">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <div className={`border-2 border-dashed rounded-3xl h-full transition-all flex flex-col items-center justify-center gap-2 text-center overflow-hidden relative ${
            sourceImage ? 'border-pink-400 bg-white shadow-inner' : 'border-pink-100 bg-pink-50/20 group-hover:border-pink-300'
          }`}>
            {sourceImage ? (
              <>
                <img src={sourceImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <i className="fas fa-camera-rotate text-white text-2xl mb-2"></i>
                  <span className="text-white text-xs font-bold bg-pink-500/80 px-3 py-1 rounded-full backdrop-blur-sm">사진 교체하기</span>
                </div>
              </>
            ) : (
              <div className="p-4">
                <div className="w-16 h-16 bg-pink-100/50 rounded-2xl flex items-center justify-center text-pink-300 mx-auto mb-3">
                  <i className="fas fa-image text-3xl"></i>
                </div>
                <span className="text-sm text-pink-500 font-black">사진 선택</span>
                <p className="text-[10px] text-pink-300 mt-2 font-medium">얼굴이 선명한 사진이 좋아요!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-bold text-pink-400 flex items-center gap-2 px-1">
          <span className="bg-pink-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
          캐릭터 연령대
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ageGroups.map((group) => (
            <button
              key={group}
              onClick={() => onAgeChange(group)}
              className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
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

      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !sourceImage}
          className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 transition-all ${
            isGenerating || !sourceImage
            ? 'bg-pink-200 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:brightness-110 active:scale-95 shadow-pink-100'
          }`}
        >
          {isGenerating ? (
            <><i className="fas fa-spinner fa-spin"></i> 마법 부리는 중...</>
          ) : (
            <><i className="fas fa-wand-magic-sparkles"></i> 캐릭터 만들기</>
          )}
        </button>
      </div>
    </div>
  );
};

const CharacterPreview: React.FC<{
  resultImage: string | null;
  isGenerating: boolean;
  onDownload: () => void;
  onClear: () => void;
}> = ({ resultImage, isGenerating, onDownload, onClear }) => {
  if (!isGenerating && !resultImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-8 animate-in fade-in duration-1000 bg-[#fffcfd]">
        <div className="relative">
          <div className="w-40 h-40 bg-pink-100 rounded-full flex items-center justify-center">
            <i className="fas fa-face-smile-wink text-7xl text-pink-400"></i>
          </div>
          <div className="absolute -top-4 -right-4 bg-rose-400 text-white w-12 h-12 rounded-full flex items-center justify-center border-4 border-white animate-bounce shadow-lg">
            <i className="fas fa-heart"></i>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl font-black text-pink-600 mb-4 tracking-tight leading-tight">나만의 귀여운<br/>3D 캐릭터 메이커</h2>
          <p className="text-pink-400 font-bold text-lg leading-relaxed">
            사진 한 장으로 Pixar 스타일의<br/>사랑스러운 캐릭터를 만나보세요! ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-12 flex flex-col h-full bg-[#fffcfd] overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full gap-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-pink-600 flex items-center gap-2">
            {isGenerating ? (
              <><i className="fas fa-magic animate-pulse"></i> 변신 중...</>
            ) : (
              <><i className="fas fa-star text-yellow-400"></i> 완성!</>
            )}
          </h2>
          {!isGenerating && (
            <button 
              onClick={onClear}
              className="px-5 py-2 bg-pink-50 text-pink-500 rounded-full font-bold transition-all hover:bg-pink-100 text-sm flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-rotate-right"></i>
              다시 하기
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 bg-white rounded-[3rem] border-8 border-pink-50 overflow-hidden shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-pink-50 via-white to-rose-50">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-24 h-24 border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
              <div className="space-y-1">
                <span className="text-pink-600 font-black text-2xl italic">Kawaii Magic...</span>
                <p className="text-sm text-pink-300 font-bold">캐릭터를 예쁘게 렌더링하고 있어요 ✨</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full p-8 flex items-center justify-center">
              <img 
                src={resultImage!} 
                alt="Generated Character" 
                className="max-w-full max-h-full object-contain animate-in zoom-in fade-in duration-700 drop-shadow-[0_20px_50px_rgba(244,114,182,0.3)]"
              />
            </div>
          )}
        </div>
        
        {!isGenerating && resultImage && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom duration-500 pb-4">
            <button 
              onClick={onDownload}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 shadow-lg shadow-pink-100"
            >
              <i className="fas fa-download"></i>
              이미지 저장하기
            </button>
            <p className="text-center text-pink-300 text-xs font-bold">
               이미지를 길게 누르면 바로 저장할 수 있어요! 💖
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

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
      if (file.size > 10 * 1024 * 1024) {
        setState(prev => ({ ...prev, error: '사진 용량이 너무 커요! 10MB 이하로 올려주세요.' }));
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
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.sourceImage) return;
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generate3DCharacter(state.sourceImage, state.ageGroup);
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: '앗! 캐릭터를 만드는 중에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.' 
      }));
    }
  };

  const handleDownload = useCallback(() => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `my-cute-character-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.resultImage]);

  const handleClear = () => {
    setState(prev => ({ ...prev, resultImage: null, error: null }));
  };

  const showResultOnMobile = state.isGenerating || !!state.resultImage;

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[#fffcfd]">
      {/* Sidebar - Mobile: hide when result is shown */}
      <div className={`${showResultOnMobile ? 'hidden md:block' : 'block'} h-full`}>
        <Sidebar 
          onImageUpload={handleImageUpload}
          sourceImage={state.sourceImage}
          age={state.ageGroup}
          onAgeChange={(age) => setState(p => ({...p, ageGroup: age}))}
          onGenerate={handleGenerate}
          isGenerating={state.isGenerating}
        />
      </div>
      
      <main className="flex-1 relative overflow-hidden flex flex-col h-full">
        {state.error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 bg-rose-50 border-2 border-rose-100 text-rose-500 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500 shadow-2xl z-50">
            <i className="fas fa-circle-exclamation text-xl"></i>
            <span className="font-bold text-sm flex-1">{state.error}</span>
            <button onClick={() => setState(p => ({...p, error: null}))} className="text-rose-300 hover:text-rose-500">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <CharacterPreview 
          resultImage={state.resultImage}
          isGenerating={state.isGenerating}
          onDownload={handleDownload}
          onClear={handleClear}
        />

        {/* Floating Credit */}
        <div className="absolute bottom-6 right-8 hidden md:block">
           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-pink-100 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Gemini 2.5 Engine Active</span>
           </div>
        </div>
      </main>
    </div>
  );
};

// --- Render ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
