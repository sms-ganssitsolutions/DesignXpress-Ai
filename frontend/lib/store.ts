import { create } from 'zustand';

export interface Scene {
  id: number | string;
  title: string;
  duration: number;
  script?: string;
  voiceoverUrl?: string;
  thumbnailUrl?: string;
  startTime?: number;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  scenes: Scene[];
  thumbnail?: string;
}

export interface AIJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
}

interface StudioState {
  // Current project in studio
  currentProject: Project | null;
  scenes: Scene[];
  selectedSceneId: string | number | null;

  // Playback
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;

  // AI
  aiJobs: AIJob[];
  isGenerating: boolean;

  // UI
  rightPanelOpen: boolean;
  activeRightTab: 'ai' | 'effects' | 'captions' | 'voice' | 'export';

  // Actions
  setCurrentProject: (project: Project | null) => void;
  setScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene) => void;
  updateScene: (id: string | number, updates: Partial<Scene>) => void;
  deleteScene: (id: string | number) => void;
  selectScene: (id: string | number | null) => void;

  // Playback
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;

  // AI
  addAIJob: (job: AIJob) => void;
  updateAIJob: (id: string, updates: Partial<AIJob>) => void;
  setIsGenerating: (val: boolean) => void;

  // UI
  toggleRightPanel: () => void;
  setActiveRightTab: (tab: StudioState['activeRightTab']) => void;

  // Reset
  resetStudio: () => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  currentProject: null,
  scenes: [
    { id: 1, title: "Opening - The Rain", duration: 12, script: "In the city that never sleeps..." },
    { id: 2, title: "The Transmission", duration: 18, script: "She receives a mysterious message..." },
    { id: 3, title: "Memory Flashback", duration: 9, script: "Fragments of a forgotten life." },
  ],
  selectedSceneId: 1,

  isPlaying: false,
  currentTime: 0,
  totalDuration: 39,

  aiJobs: [],
  isGenerating: false,

  rightPanelOpen: true,
  activeRightTab: 'ai',

  setCurrentProject: (project) => set({ currentProject: project }),

  setScenes: (scenes) => {
    const total = scenes.reduce((sum, s) => sum + s.duration, 0);
    set({ scenes, totalDuration: total });
  },

  addScene: (scene) => {
    const scenes = [...get().scenes, scene];
    const total = scenes.reduce((sum, s) => sum + s.duration, 0);
    set({ scenes, totalDuration: total });
  },

  updateScene: (id, updates) => {
    const scenes = get().scenes.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    const total = scenes.reduce((sum, s) => sum + s.duration, 0);
    set({ scenes, totalDuration: total });
  },

  deleteScene: (id) => {
    let scenes = get().scenes.filter(s => s.id !== id);
    if (scenes.length === 0) {
      scenes = [{ id: Date.now(), title: "New Scene", duration: 10 }];
    }
    const total = scenes.reduce((sum, s) => sum + s.duration, 0);
    set({ scenes, totalDuration: total, selectedSceneId: scenes[0].id });
  },

  selectScene: (id) => set({ selectedSceneId: id }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentTime: (time) => set({ currentTime: Math.max(0, Math.min(time, get().totalDuration)) }),

  seekTo: (time) => set({ currentTime: Math.max(0, Math.min(time, get().totalDuration)) }),

  addAIJob: (job) => set((state) => ({ aiJobs: [...state.aiJobs, job] })),

  updateAIJob: (id, updates) =>
    set((state) => ({
      aiJobs: state.aiJobs.map(j => j.id === id ? { ...j, ...updates } : j),
    })),

  setIsGenerating: (val) => set({ isGenerating: val }),

  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setActiveRightTab: (tab) => set({ activeRightTab: tab, rightPanelOpen: true }),

  resetStudio: () =>
    set({
      currentProject: null,
      scenes: [],
      selectedSceneId: null,
      isPlaying: false,
      currentTime: 0,
      aiJobs: [],
    }),
}));
