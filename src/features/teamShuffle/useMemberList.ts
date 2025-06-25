import { useState } from 'react';

/**
 * 名簿リストをローカルstateで管理するカスタムフック
 * @returns { members, setMembers, addMember, removeMember, loading }
 */
export function useMemberList(initialMembers: string[] = []) {
  const [members, setMembers] = useState<string[]>(initialMembers);
  // loadingは将来の拡張用。現状は常にfalse
  const loading = false;

  /**
   * メンバーを追加
   */
  const addMember = (name: string) => {
    if (!name.trim() || members.includes(name)) return;
    setMembers((prev) => [...prev, name]);
  };

  /**
   * メンバーを削除
   */
  const removeMember = (name: string) => {
    setMembers((prev) => prev.filter((m) => m !== name));
  };

  return { members, setMembers, addMember, removeMember, loading };
}
