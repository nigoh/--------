// Markdownファイルを動的に読み込むためのユーティリティ関数

/**
 * ステップのtipsMarkdownファイルを動的に読み込む
 * @param stepNumber ステップ番号（1-5）
 * @returns Promise<string> Markdownコンテンツ
 */
export async function loadStepTips(stepNumber: number): Promise<string> {
  try {
    // 動的importを使用してMarkdownファイルを読み込み
    const response = await fetch(`/src/features/meetingFlow/tips/step${stepNumber}-tips.md`);
    if (!response.ok) {
      throw new Error(`Failed to load tips for step ${stepNumber}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading tips for step ${stepNumber}:`, error);
    return `# Step ${stepNumber} のコツ\n\nコツの情報を読み込み中にエラーが発生しました。`;
  }
}

/**
 * 全ステップのtipsMarkdownを事前に読み込む
 * @returns Promise<string[]> 各ステップのMarkdownコンテンツの配列
 */
export async function loadAllStepTips(): Promise<string[]> {
  const tips: string[] = [];
  for (let i = 1; i <= 5; i++) {
    tips.push(await loadStepTips(i));
  }
  return tips;
}
