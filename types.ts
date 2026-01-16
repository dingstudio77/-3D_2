
export type AgeGroup = 'Baby' | 'Child' | 'Teen' | 'Adult' | 'Elderly';

export const AgeLabels: Record<AgeGroup, string> = {
  Baby: '아기',
  Child: '어린이',
  Teen: '청소년',
  Adult: '성인',
  Elderly: '노년'
};

export interface AppState {
  sourceImage: string | null;
  resultImage: string | null;
  ageGroup: AgeGroup;
  isGenerating: boolean;
  error: string | null;
}
