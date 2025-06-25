import { create } from 'zustand';
import steps from './meetingFlowData';

export interface MeetingFlowState {
  // ステップ関連
  activeStep: number;
  stepTimes: number[];
  stepTipsContent: string[];
  
  // タイマー関連
  timerRunning: boolean;
  showAlert: boolean;
  
  // UI関連
  sidebarOpen: boolean;
}

export interface MeetingFlowActions {
  // ステップ操作
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // タイマー操作
  setTimerRunning: (running: boolean) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  finishTimer: () => void;
  closeAlert: () => void;
  
  // 時間設定
  setStepTime: (stepIndex: number, time: number) => void;
  resetStepTime: (stepIndex: number) => void;
  
  // Tips関連
  setStepTipsContent: (content: string[]) => void;
  
  // UI操作
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // 初期化
  reset: () => void;
}

export type MeetingFlowStore = MeetingFlowState & MeetingFlowActions;

const initialState: MeetingFlowState = {
  activeStep: 0,
  stepTimes: steps.map(s => s.time),
  stepTipsContent: [],
  timerRunning: false,
  showAlert: false,
  sidebarOpen: false,
};

export const useMeetingFlowStore = create<MeetingFlowStore>((set, get) => ({
  ...initialState,
  
  // ステップ操作
  setActiveStep: (step: number) => {
    set({ activeStep: Math.max(0, Math.min(step, steps.length - 1)) });
  },
  
  nextStep: () => {
    const { activeStep, timerRunning } = get();
    set({ 
      activeStep: Math.min(activeStep + 1, steps.length - 1),
      timerRunning: false 
    });
  },
  
  prevStep: () => {
    const { activeStep, timerRunning } = get();
    set({ 
      activeStep: Math.max(activeStep - 1, 0),
      timerRunning: false 
    });
  },
  
  // タイマー操作
  setTimerRunning: (running: boolean) => set({ timerRunning: running }),
  
  startTimer: () => set({ timerRunning: true }),
  
  pauseTimer: () => set({ timerRunning: false }),
  
  finishTimer: () => set({ 
    showAlert: true,
    timerRunning: false 
  }),
  
  closeAlert: () => {
    const { activeStep, stepTimes } = get();
    const newStepTimes = [...stepTimes];
    newStepTimes[activeStep] = steps[activeStep].time;
    
    set({ 
      showAlert: false,
      timerRunning: false,
      stepTimes: newStepTimes
    });
  },
  
  // 時間設定
  setStepTime: (stepIndex: number, time: number) => {
    const { stepTimes } = get();
    const newStepTimes = [...stepTimes];
    newStepTimes[stepIndex] = Math.max(1, Math.min(120, time));
    set({ stepTimes: newStepTimes });
  },
  
  resetStepTime: (stepIndex: number) => {
    const { stepTimes } = get();
    const newStepTimes = [...stepTimes];
    newStepTimes[stepIndex] = steps[stepIndex].time;
    set({ stepTimes: newStepTimes });
  },
  
  // Tips関連
  setStepTipsContent: (content: string[]) => set({ stepTipsContent: content }),
  
  // UI操作
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },
  
  // 初期化
  reset: () => set(initialState),
}));
