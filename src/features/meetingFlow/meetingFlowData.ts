// ミーティング進行のステップデータとコツ
export interface Step {
  title: string;
  instructions: string;
  time: number;
}

const steps = [
    {
        title: 'Step 1：1人で考える',
        time: 5,
        facilitator: '● ゴールを再確認し「会社の成長とは何か」を問いかける\n● 静かな環境・タイマーを用意',
        participant: '● 付箋1枚に1アイデア（名詞＋短い説明）を書く',
        output: '個人アイデア集',
    },
    {
        title: 'Step 2：2人ペアで共有',
        time: 7,
        facilitator: '● ペアを素早く決める（隣同士など）\n● 「聞き役→話し役」を交代させる',
        participant: '● 相手のアイデアを要約しつつ自分の紙に書き加える',
        output: 'ペアで整理したメモ',
    },
    {
        title: 'Step 3：3人グループで情報共有',
        time: 10,
        facilitator: '● 3人組を指示（ペア＋1人）\n● 共通点・差分をホワイトボードに可視化',
        participant: '● 被っている案はまとめる\n● 新規案は強調マーク',
        output: '3人グループの「まとめシート」',
    },
    {
        title: 'Step 4：グループ間で意見交換（A↔B）',
        time: 15,
        facilitator: '● グループA→Bへ持ち時間3 minずつピッチ\n● Q&Aは“Clarify→Challenge→Connect”順に',
        participant: '● 他グループの良案を付箋で持ち帰る',
        output: '相互フィードバック付のシート',
    },
    {
        title: 'Step 5：自グループで統合・ブラッシュアップ',
        time: 10,
        facilitator: '● “Impact × Effort”マトリクスを配布\n● 各案を評価→4象限に貼る',
        participant: '● 高Impact・低Effortをトップ3に絞る',
        output: '最終案トップ3 + 評価理由',
    },
];

export const tips: string[] = [
  '“あと2分”アラートで締め切り効果を出す',
  'ペア・グループごとに「傾聴→要約→コメント」の三段階を必ず回す',
  '否定語を避け、質問は “より良くするには？” “背景は？” フォーマットで',
  '口頭決着させず、必ず紙 or ボードにメモして合意形成を明文化',
  'Step 5のマトリクス評価基準を先に提示し、主観ではなく合意ルールで絞り込み',
];

export default steps;
