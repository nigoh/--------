// ステップ内容の型定義
export interface StepContents {
    facilitator: string;
    participant: string;
    output: string;
    instructions: string;
    imageUrl?: string;
}

export interface Step {
    title: string;
    time: number;
    contents: StepContents;
    teams?: string[][];
    tipsMarkdownFile?: string; // ファイルパスを指定
}

// ミーティング進行のステップデータとコツ

const steps = [
    {
        title: 'Step 1：1人で考える',
        time: 5,
        contents: {
            facilitator: '● ゴールを再確認し「会社の成長とは何か」を問いかける\n● 静かな環境・タイマーを用意',
            participant: '自分の中で考えをまとめる作業になります。\n自分の意見を共有できるようにまとめることが重要です。',
            output: 'A4の紙に、まとめてみてください。\n紙を4つ折りにして、4つのセクションに分けておくと良いでしょう。\n右上は「会社の成長」、左上は「自分の成長」、右下は「会社の課題」、左下は「自分の課題」',
            instructions: '【進行役】\n● ゴールを再確認し「会社の成長とは何か」を問いかける\n● 静かな環境・タイマーを用意\n【参加者】\n● 付箋1枚に1アイデア（名詞＋短い説明）を書く\n【成果物】\n個人アイデア集',
            imageUrl: "/assets/image1.png", // Vite publicディレクトリ経由
        },
        tipsMarkdownFile: 'step1-tips.md'
    },
    {
        title: 'Step 2：ペアで共有',
        time: 10,
        contents: {
            facilitator: '● ペアを作り、お互いのアイデアを共有\n● 1人5分ずつでターン制',
            participant: '相手のアイデアを聞いて、自分の考えと比較してみてください。\n違いや共通点を見つけることが重要です。',
            output: '● 各ペアから1つずつ「印象的だったアイデア」を選ぶ\n● 選んだ理由も合わせて発表',
            instructions: '【進行役】\n● ペアを作り、お互いのアイデアを共有\n● 1人5分ずつでターン制\n【参加者】\n● 相手の話を聞き、印象的だったアイデアを1つ選ぶ\n【成果物】\n各ペアから選ばれたアイデア + 選択理由',
            imageUrl: "/assets/image2.png",
        },
        tipsMarkdownFile: 'step2-tips.md'
    },
    {
        title: 'Step 3：グループ議論',
        time: 15,
        contents: {
            facilitator: '● 4-6人のグループを作成\n● ペアで選んだアイデアを持ち寄り\n● 議論して上位3つに絞る',
            participant: 'ペアで選んだアイデアをグループで共有し、議論を深めます。\n多様な視点から検討し、最も価値のあるアイデアを選別してください。',
            output: '各グループから上位3アイデア\n● 選んだ理由と改善案も含める',
            instructions: '【進行役】\n● 4-6人のグループを作成\n● ペアで選んだアイデアを持ち寄り\n● 議論して上位3つに絞る\n【参加者】\n● アイデアを共有→議論→絞り込み\n【成果物】\n各グループの上位3アイデア',
            imageUrl: "/assets/image3.png",
        },
        tipsMarkdownFile: 'step3-tips.md'
    },
    {
        title: 'Step 4：グループ共有',
        time: 10,
        contents: {
            facilitator: '● 各グループが3分で発表\n● 類似アイデアをまとめ、重複を排除\n● 全体で5-7個のアイデアに統合',
            participant: '● 他グループの発表を聞き、自分たちのアイデアとの関連性を考える\n● 類似点や相違点を見つけ、より良い統合案を提案',
            output: '統合された5-7個のメインアイデア',
            instructions: '【進行役】\n● 各グループが3分で発表\n● 類似アイデアをまとめ、重複を排除\n● 全体で5-7個のアイデアに統合\n【参加者】\n● 他グループの発表を聞き、類似点を見つける\n【成果物】\n統合された5-7個のメインアイデア',
            imageUrl: "/assets/image4.png",
        },
        tipsMarkdownFile: 'step4-tips.md'
    },
    {
        title: 'Step 5：意見を醸成',
        time: 10,
        contents: {
            facilitator: '● Impact × Effort マトリクスを使用\n● 各アイデアを4象限に配置\n● 高Impact・低Effortの象限から優先的に選択',
            participant: '● 高Impact・低Effortをトップ3に絞る',
            output: '最終案トップ3 + 評価理由',
            instructions: '【進行役】\n● "Impact × Effort"マトリクスを配布\n● 各案を評価→4象限に貼る\n【参加者】\n● 高Impact・低Effortをトップ3に絞る\n【成果物】\n最終案トップ3 + 評価理由',
            imageUrl: "/assets/image5.png",
        },
        tipsMarkdownFile: 'step5-tips.md'
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
