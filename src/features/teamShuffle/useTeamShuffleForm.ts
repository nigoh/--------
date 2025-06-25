import { useState, useEffect } from 'react';
import { createTeams } from './utils';

import { useMemberList } from './useMemberList';

export interface TeamShuffleForm {
  members: string[];
  setMembers: (v: string[]) => void;
  teamCount: number;
  setTeamCount: (v: number) => void;
  teams: string[][];
  setTeams: (v: string[][]) => void;
  error: string;
  setError: (v: string) => void;
  showResult: boolean;
  setShowResult: (v: boolean) => void;
  animate: boolean;
  setAnimate: (v: boolean) => void;
  handleCreateTeams: () => string[];
  handleClear: () => void;
  loading: boolean;
}

export function useTeamShuffleForm(): TeamShuffleForm {
  const { members, setMembers, loading } = useMemberList();
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [animate, setAnimate] = useState(false);



  // チーム分け実行
  const handleCreateTeams = (): string[] => {
    if (members.length < teamCount || teamCount < 1) {
      setError('人数がチーム数より少ないか、チーム数が1未満です');
      setTeams([]);
      setShowResult(false);
      return [];
    }
    setError('');
    setShowResult(false);
    setAnimate(false);
    setTimeout(() => {
      setTeams(createTeams(members, teamCount));
      setShowResult(true);
      setAnimate(true);
    }, 200);
    return members;
  };

  // 入力クリア
  const handleClear = () => {
    setMembers([]);
    setTeams([]);
    setError('');
    setShowResult(false);
    setAnimate(false);
  };

  return {
    members: loading ? [] : members,
    setMembers,
    teamCount,
    setTeamCount,
    teams,
    setTeams,
    error,
    setError,
    showResult,
    setShowResult,
    animate,
    setAnimate,
    handleCreateTeams,
    handleClear,
    loading,
  };
}
