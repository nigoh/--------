import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimerSession {
  id: string;
  title: string;
  duration: number; // 秒
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  stepNumber?: number;
}

interface TimerHistoryState {
  sessions: TimerSession[];
  currentSession: TimerSession | null;
}

interface TimerHistoryActions {
  startSession: (title: string, duration: number, stepNumber?: number) => void;
  completeSession: () => void;
  cancelSession: () => void;
  clearHistory: () => void;
  getSessions: () => TimerSession[];
  getCompletedSessions: () => TimerSession[];
  getTotalTime: () => number;
}

export type TimerHistoryStore = TimerHistoryState & TimerHistoryActions;

export const useTimerHistoryStore = create<TimerHistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,

      startSession: (title: string, duration: number, stepNumber?: number) => {
        const session: TimerSession = {
          id: `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title,
          duration,
          startTime: new Date(),
          completed: false,
          stepNumber,
        };
        
        set((state) => ({
          currentSession: session,
          sessions: [...state.sessions, session],
        }));
      },

      completeSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;

        const updatedSession = {
          ...currentSession,
          endTime: new Date(),
          completed: true,
        };

        set({
          currentSession: null,
          sessions: sessions.map(session => 
            session.id === currentSession.id ? updatedSession : session
          ),
        });
      },

      cancelSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;

        set({
          currentSession: null,
          sessions: sessions.filter(session => session.id !== currentSession.id),
        });
      },

      clearHistory: () => {
        set({
          sessions: [],
          currentSession: null,
        });
      },

      getSessions: () => {
        return get().sessions;
      },

      getCompletedSessions: () => {
        return get().sessions.filter(session => session.completed);
      },

      getTotalTime: () => {
        const completedSessions = get().getCompletedSessions();
        return completedSessions.reduce((total, session) => total + session.duration, 0);
      },
    }),
    {
      name: 'timer-history-storage',
      partialize: (state) => ({ 
        sessions: state.sessions 
      }),
    }
  )
);
