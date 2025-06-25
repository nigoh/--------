// チーム分け・シャッフル・IndexedDBユーティリティ


export const MEMBER_KEY = 'memberText';
export const TEAM_KEY = 'teams';
export const TEAM_COUNT_KEY = 'teamCount';

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createTeams(members: string[], teamCount: number): string[][] {
  const shuffled = shuffle(members);
  const teams: string[][] = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((member, idx) => {
    teams[idx % teamCount].push(member);
  });
  return teams;
}

// メンバーの色を統一するためのカラーパレット
const MEMBER_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue  
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FFC107', // Amber
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#3F51B5', // Indigo
];

export function getMemberColor(index: number): string {
  return MEMBER_COLORS[index % MEMBER_COLORS.length];
}

export function getMemberColorByName(name: string, memberList: string[]): string {
  const index = memberList.indexOf(name);
  return index >= 0 ? getMemberColor(index) : MEMBER_COLORS[0];
}
