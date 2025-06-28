/**
 * Tipsコンテンツ読み込みのカスタムフック
 * 
 * ステップごとのMarkdownコンテンツの読み込み処理を分離し、
 * 非同期データ取得のロジックを管理
 */
import { useState, useEffect } from 'react';
import steps from '../meetingFlowData';

/**
 * Tipsコンテンツ読み込みのカスタムフック
 */
export const useTipsContentLoader = () => {
  const [stepTipsContent, setStepTipsContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ステップのMarkdownコンテンツを読み込み
   */
  useEffect(() => {
    const loadTips = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const tipsContent: string[] = [];
        
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          
          if (step.tipsMarkdownFile) {
            try {
              const response = await fetch(`/tips/${step.tipsMarkdownFile}`);
              
              if (response.ok) {
                const content = await response.text();
                tipsContent[i] = content;
              } else {
                console.warn(`Failed to load tips for step ${i + 1}: ${response.status}`);
                tipsContent[i] = generateFallbackTips(i + 1);
              }
            } catch (fetchError) {
              console.error(`Error fetching tips for step ${i + 1}:`, fetchError);
              tipsContent[i] = generateFallbackTips(i + 1);
            }
          } else {
            tipsContent[i] = '';
          }
        }
        
        setStepTipsContent(tipsContent);
      } catch (globalError) {
        console.error('Global error loading tips:', globalError);
        setError('Tipsコンテンツの読み込みに失敗しました');
        
        // フォールバック: 全ステップに基本的なTipsを設定
        const fallbackContent = steps.map((_, index) => generateFallbackTips(index + 1));
        setStepTipsContent(fallbackContent);
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  /**
   * フォールバック用のTipsコンテンツを生成
   */
  const generateFallbackTips = (stepNumber: number): string => {
    return `# Step ${stepNumber} のコツ\n\nTipsの情報を読み込み中にエラーが発生しました。\n\n## 基本的な進行のポイント\n\n- 参加者全員が発言できるよう配慮する\n- 時間管理を徹底する\n- 議論が脱線しないよう軌道修正する\n- 成果物を明確にする`;
  };

  /**
   * 特定ステップのTipsコンテンツを再読み込み
   */
  const reloadStepTips = async (stepIndex: number) => {
    const step = steps[stepIndex];
    
    if (!step?.tipsMarkdownFile) return;

    try {
      const response = await fetch(`/tips/${step.tipsMarkdownFile}`);
      
      if (response.ok) {
        const content = await response.text();
        setStepTipsContent(prev => {
          const newContent = [...prev];
          newContent[stepIndex] = content;
          return newContent;
        });
      }
    } catch (error) {
      console.error(`Error reloading tips for step ${stepIndex + 1}:`, error);
    }
  };

  /**
   * すべてのTipsコンテンツを再読み込み
   */
  const reloadAllTips = () => {
    setStepTipsContent([]);
    setLoading(true);
    setError(null);
    
    // useEffectが再実行される
  };

  return {
    stepTipsContent,
    loading,
    error,
    reloadStepTips,
    reloadAllTips,
  };
};

export default useTipsContentLoader;
