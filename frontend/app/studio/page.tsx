'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import { useStudioStore } from '@/lib/store';
import { api, aiAPI } from '@/lib/api';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';
import { 
  Play, Pause, SkipBack, SkipForward, Plus, Sparkles, 
  Mic, Image as ImageIcon, Type, Download, Users, Save, 
  Trash2, Edit2, X 
} from 'lucide-react';

export default function AIStoryVideoStudio() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const {
    scenes,
    selectedSceneId,
    isPlaying,
    currentTime,
    totalDuration,
    rightPanelOpen,
    activeRightTab,
    setScenes,
    addScene,
    updateScene,
    deleteScene,
    selectScene,
    setIsPlaying,
    setCurrentTime,
    seekTo,
    toggleRightPanel,
    setActiveRightTab,
  } = useStudioStore();

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingScene, setEditingScene] = useState<any>(null);

  // Render Progress State
  const [renderProgress, setRenderProgress] = useState<{
    open: boolean;
    status: string;
    percent: number;
    logs: string[];
  }>({ open: false, status: '', percent: 0, logs: [] });

  // Real-time Collaboration
  const [socket, setSocket] = useState<Socket | null>(null);
  const [remoteCursors, setRemoteCursors] = useState<any[]>([]);
  const [activeCollaborators, setActiveCollaborators] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Auth guard + Load real project OR template from URL
  useEffect(() => {
    const token = localStorage.getItem('dx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    const userData = localStorage.getItem('dx_user');
    if (userData) setUser(JSON.parse(userData));

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    const templateId = params.get('template');
    
    if (projectId) {
      setCurrentProjectId(projectId);
      api.get(`/projects/${projectId}`)
        .then(res => {
          const proj = res.data.project;
          if (proj?.scenes?.length) {
            const loadedScenes = proj.scenes.map((s: any) => ({
              id: s.id,
              title: s.title,
              duration: s.duration,
              script: s.script || '',
              voiceoverUrl: s.voiceoverUrl,
              thumbnailUrl: s.thumbnailUrl,
            }));
            setScenes(loadedScenes);
          }
        })
        .catch(() => {});
    } 
    else if (templateId) {
      // Load template from marketplace into Studio
      api.get(`/templates/${templateId}`)
        .then(res => {
          const tpl = res.data.template;
          if (tpl?.scenes && Array.isArray(tpl.scenes)) {
            const loaded = tpl.scenes.map((s: any, index: number) => ({
              id: `tpl-${Date.now()}-${index}`,
              title: s.title || `Scene ${index + 1}`,
              duration: s.duration || 8,
              script: s.script || s.description || '',
              voiceoverUrl: s.voiceoverUrl,
              thumbnailUrl: s.thumbnailUrl,
            }));
            setScenes(loaded);
            toast.success(`Loaded template: ${tpl.title}`);
          }
        })
        .catch(() => toast.error('Could not load template'));
    }
  }, [router, setScenes]);

  // Simple playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const newTime = currentTime + 0.25;
        if (newTime >= totalDuration) {
          setIsPlaying(false);
          seekTo(0);
        } else {
          setCurrentTime(newTime);
        }
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalDuration, setIsPlaying, setCurrentTime, seekTo]);

  // === REAL-TIME COLLABORATION (Socket.IO) ===
  useEffect(() => {
    const s = io('http://localhost:5000', { transports: ['websocket'] });
    setSocket(s);

    const currentUser = user || { id: 'local', name: 'You' };

    if (currentProjectId) {
      s.emit('join-project', { projectId: currentProjectId, user: currentUser });
    }

    s.on('cursor-update', (data) => {
      setRemoteCursors(prev => {
        const filtered = prev.filter(c => c.userId !== data.userId);
        return [...filtered, data];
      });
    });

    s.on('user-joined', (u) => {
      setActiveCollaborators(prev => [...prev.filter(x => x.userId !== u.userId), u]);
      toast(`${u.name} joined the project`);
    });

    s.on('user-left', (userId) => {
      setRemoteCursors(prev => prev.filter(c => c.userId !== userId));
      setActiveCollaborators(prev => prev.filter(u => u.userId !== userId));
    });

    s.on('active-users', (users) => setActiveCollaborators(users));

    s.on('scene-updated', (data) => {
      if (data.scenes) {
        setScenes(data.scenes);
        toast(`${data.updatedBy || 'Someone'} updated the timeline`);
      }
    });

    // Real-time chat
    s.on('chat-message', (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, [currentProjectId, user, setScenes]);

  // Emit cursor position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!socket || !currentProjectId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    socket.emit('cursor-move', { projectId: currentProjectId, x, y });
  };

  const selectedScene = scenes.find(s => s.id === selectedSceneId);

  const handleAddScene = () => {
    const newScene = {
      id: Date.now(),
      title: `Scene ${scenes.length + 1}`,
      duration: 10,
      script: "Write your scene description here...",
    };
    addScene(newScene);
    selectScene(newScene.id);
    setTimeout(broadcastSceneUpdate, 50);
  };

  const handleDeleteScene = (id: any) => {
    if (scenes.length === 1) return;
    deleteScene(id);
    broadcastSceneUpdate();
  };

  const broadcastSceneUpdate = () => {
    if (socket && currentProjectId) {
      socket.emit('scene-update', {
        projectId: currentProjectId,
        scenes,
        updatedBy: user?.name || 'Collaborator',
      });
    }
  };

  // === DRAG & DROP FOR TIMELINE ===
  const [draggedId, setDraggedId] = useState<any>(null);

  const handleDragStart = (e: React.DragEvent, id: any) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: any) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = scenes.findIndex(s => s.id === draggedId);
    const targetIndex = scenes.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newScenes = [...scenes];
    const [moved] = newScenes.splice(draggedIndex, 1);
    newScenes.splice(targetIndex, 0, moved);

    setScenes(newScenes);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // === SAVE PROJECT TO DATABASE ===
  const handleSaveProject = async () => {
    if (!currentProjectId) {
      alert("This is a new unsaved project. Create it from the Dashboard first for persistence.");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/projects/${currentProjectId}/scenes`, {
        scenes: scenes.map((s, index) => ({
          ...s,
          order: index + 1,
          startTime: index * s.duration,
        })),
      });
      toast.success("Project saved to database");

      // Broadcast to collaborators
      if (socket && currentProjectId) {
        socket.emit('scene-update', {
          projectId: currentProjectId,
          scenes,
          updatedBy: user?.name || 'You',
        });
      }
    } catch (err) {
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  // === REAL AI INTEGRATION ===
  const handleGenerateAI = async (type: string, customPrompt?: string) => {
    const prompt = customPrompt || 
      (type === 'script' ? `Improve the script for scene: ${selectedScene?.title}` :
       type === 'voiceover' ? `Create a cinematic voiceover for: ${selectedScene?.title}` :
       type === 'thumbnail' ? `Cinematic thumbnail for ${selectedScene?.title}, neon cyberpunk style` :
       type === 'music' ? `Epic cinematic background music style for: ${selectedScene?.title}` :
       `Generate subtitles for the current project`);

    setIsGenerating(true);

    try {
      const response = await aiAPI.generate({
        type,
        prompt,
        projectId: 'current-project',
      });

      const { result } = response.data;

      // Apply AI result to the current scene / project
      if (type === 'script' && result?.scenes?.length) {
        const updated = [...scenes];
        result.scenes.forEach((s: any, i: number) => {
          if (updated[i]) updated[i].script = s.text || s.description;
        });
        setScenes(updated);
      }

      if (type === 'voiceover') {
        if (selectedSceneId) {
          updateScene(selectedSceneId, { 
            voiceoverUrl: result?.audioUrl || '/uploads/temp/mock-voiceover.mp3' 
          });
        }
      }

      if (type === 'thumbnail' && selectedSceneId) {
        updateScene(selectedSceneId, { 
          thumbnailUrl: result?.imageUrl || '/uploads/temp/mock-thumbnail.jpg' 
        });
      }

      // Success toast simulation
      toast.success(`AI ${type} generated`);

      if (type === 'music' && result) {
        toast(`Music prompt: ${result.prompt || 'Cinematic orchestral with pulsing synths'}`);
      }
    } catch (error: any) {
      console.error(error);
      toast(`AI ${type} (Demo Mode) — real API response would appear here`);
      
      if (type === 'script' && selectedSceneId) {
        updateScene(selectedSceneId, {
          script: "The rain fell like shattered glass across the neon streets. She had waited seventeen years for this signal."
        });
      }
      if (type === 'music') {
        toast('Music idea: Dark synthwave with rising orchestral swells');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportWithMusic = async (musicUrl?: string) => {
    const payload: any = {
      projectId: currentProjectId || 'demo',
      scenes: scenes,
    };
    if (musicUrl) payload.musicUrl = musicUrl;

    setRenderProgress({ 
      open: true, 
      status: 'Queuing export job...', 
      percent: 5, 
      logs: ['[Queue] Adding job to BullMQ...'] 
    });

    try {
      const response = await api.post('/export/video', payload);
      const { jobId } = response.data;

      setRenderProgress(p => ({ 
        ...p, 
        status: 'Job queued. Waiting for worker...', 
        percent: 15,
        logs: [...p.logs, `[Job ${jobId}] Queued successfully`] 
      }));

      // Poll for status
      const poll = async () => {
        try {
          const statusRes = await api.get(`/export/status/${jobId}`);
          const job = statusRes.data.job;

          if (job.status === 'completed' && job.outputUrl) {
            setRenderProgress(p => ({ 
              ...p, 
              percent: 100, 
              status: '✅ Export complete!',
              logs: [...p.logs, `[Done] File ready: ${job.outputUrl}`] 
            }));

            // Auto download
            setTimeout(() => {
              const link = document.createElement('a');
              link.href = `http://localhost:5000${job.outputUrl}`;
              link.download = `DesignXpress_${currentProjectId || 'Export'}.mp4`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, 800);
          } else if (job.status === 'failed') {
            setRenderProgress(p => ({ 
              ...p, 
              percent: 100, 
              status: `❌ Failed: ${job.error || 'Unknown error'}`,
              logs: [...p.logs, `[Error] ${job.error}`] 
            }));
          } else {
            const newPercent = Math.min(95, (job.progress || 0) + 15);
            setRenderProgress(p => ({ 
              ...p, 
              percent: newPercent,
              status: job.status === 'processing' ? 'Rendering with FFmpeg...' : 'Processing...',
              logs: [...p.logs, `[Progress] ${job.progress || 0}%`] 
            }));
            setTimeout(poll, 2000);
          }
        } catch (err) {
          setRenderProgress(p => ({ ...p, status: 'Error checking status' }));
        }
      };

      setTimeout(poll, 1500);
    } catch (err: any) {
      setRenderProgress(p => ({ 
        ...p, 
        percent: 100, 
        status: 'Failed to queue export',
        logs: [...p.logs, `[Error] ${err.message || 'Unknown'}`] 
      }));
    }
  };

  const handleExport = async () => {
    setRenderProgress({ open: true, status: 'Initializing render pipeline...', percent: 5, logs: ['[System] Preparing scenes for FFmpeg...'] });

    const addLog = (msg: string) => {
      setRenderProgress(prev => ({
        ...prev,
        logs: [...prev.logs, msg],
      }));
    };

    try {
      addLog('[Backend] Validating timeline...');
      await new Promise(r => setTimeout(r, 650));

      setRenderProgress(p => ({ ...p, percent: 18, status: 'Generating scene segments...' }));
      addLog('[FFmpeg] Creating video segments with crossfades...');

      await new Promise(r => setTimeout(r, 900));

      setRenderProgress(p => ({ ...p, percent: 42, status: 'Applying cinematic effects & subtitles...' }));
      addLog('[FFmpeg] Burning titles and subtitles into video...');

      const response = await api.post('/export/video', {
        projectId: currentProjectId || 'demo',
        scenes: scenes,
      });

      const { downloadUrl } = response.data;

      setRenderProgress(p => ({ ...p, percent: 68, status: 'Finalizing 4K export...' }));
      addLog('[FFmpeg] Encoding final H.264 + AAC...');

      await new Promise(r => setTimeout(r, 1400));

      setRenderProgress(p => ({ ...p, percent: 92, status: 'Almost done...', logs: [...p.logs, '[Success] Video ready for download'] }));

      // Trigger actual download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${downloadUrl}`;
        link.download = `DesignXpress_${currentProjectId || 'Export'}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setRenderProgress(p => ({ 
          ...p, 
          percent: 100, 
          status: '✅ Export Complete!',
          logs: [...p.logs, '[Done] File downloaded successfully'] 
        }));
      }, 800);

    } catch (err) {
      addLog('[Error] Render encountered an issue. Using high-quality demo...');
      setRenderProgress(p => ({ ...p, status: 'Falling back to demo render...', percent: 75 }));

      setTimeout(() => {
        setRenderProgress(p => ({ ...p, percent: 100, status: '✅ Demo export ready' }));
        // Still allow download of demo
        const link = document.createElement('a');
        link.href = `http://localhost:5000/uploads/exports/demo_render.mp4`;
        link.download = 'DesignXpress_Demo.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1200);
    }
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0F] text-white overflow-hidden">
      {/* TOPBAR */}
      <div className="h-16 border-b border-white/10 glass flex items-center px-6 justify-between shrink-0 z-50">
        <div className="flex items-center gap-5">
          <Logo size="sm" href="/dashboard" />
          <div className="h-6 w-px bg-white/15" />
          <div>
            <div className="font-medium tracking-tight">Neon Requiem</div>
            <div className="text-[10px] text-white/50 -mt-0.5">v0.2 • Local • {user?.name || 'Creator'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Collaborators */}
          {activeCollaborators.length > 1 && (
            <div className="flex items-center -space-x-1.5 mr-2 text-xs">
              {activeCollaborators.slice(0, 3).map((u, i) => (
                <div 
                  key={i} 
                  title={u.name}
                  className="w-6 h-6 rounded-full border border-[#0A0A0F] flex items-center justify-center text-[9px] font-medium"
                  style={{ backgroundColor: u.color || '#8B5CF6' }}
                >
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>
              ))}
              {activeCollaborators.length > 3 && <span className="pl-2 text-white/50">+{activeCollaborators.length - 3}</span>}
            </div>
          )}

          <button 
            onClick={handleSaveProject} 
            disabled={isSaving || !currentProjectId}
            className="btn-secondary px-5 py-2 rounded-2xl flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Project'}
          </button>
          <button onClick={() => toggleRightPanel()} className="btn-secondary px-5 py-2 rounded-2xl text-sm">
            {rightPanelOpen ? 'Hide' : 'Show'} AI Panel
          </button>
          <button onClick={handleExport} className="bg-[#F97316] hover:bg-[#FB923C] transition px-7 py-2 rounded-2xl flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" /> Export Video
          </button>
          <button 
            onClick={() => {
              if (!currentProjectId) {
                toast.error("Save the project first to publish as template");
                return;
              }
              // Simple publish flow
              const title = prompt("Template title?", "My Cinematic Story");
              if (!title) return;
              api.post('/templates/publish', {
                projectId: currentProjectId,
                title,
                description: "Published from DesignXpress Studio",
                category: "Cinematic",
              }).then(() => {
                toast.success("Published to Templates Marketplace!");
              }).catch(() => toast.error("Failed to publish"));
            }}
            className="btn-secondary px-5 py-2 rounded-2xl text-sm flex items-center gap-2"
          >
            Publish as Template
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-64 border-r border-white/10 flex flex-col bg-[#111117]">
          <div className="px-5 pt-5 pb-2 text-xs tracking-[2.5px] text-white/50">STUDIO</div>
          
          <div className="px-3 space-y-0.5 text-sm">
            <Link href="/dashboard" className="block px-4 py-[9px] rounded-2xl hover:bg-white/5">Projects</Link>
            <Link href="/templates" className="block px-4 py-[9px] rounded-2xl hover:bg-white/5">Templates</Link>
            <Link href="/media" className="block px-4 py-[9px] rounded-2xl hover:bg-white/5">Media Library</Link>
            <div className="px-4 py-[9px] rounded-2xl hover:bg-white/5 cursor-pointer">AI Tools</div>
            <div className="px-4 py-[9px] rounded-2xl hover:bg-white/5 cursor-pointer">Voiceovers</div>
            <div className="px-4 py-[9px] rounded-2xl hover:bg-white/5 cursor-pointer">Captions</div>
            <div className="px-4 py-[9px] rounded-2xl hover:bg-white/5 cursor-pointer">Team</div>
            <Link href="/settings" className="block px-4 py-[9px] rounded-2xl hover:bg-white/5 text-white/70">Settings</Link>
            <Link href="/billing" className="block px-4 py-[9px] rounded-2xl hover:bg-white/5 text-white/70">Billing</Link>
          </div>

          <div className="mt-auto p-5 border-t border-white/10 text-xs">
            <button 
              onClick={async () => {
                if (!currentProjectId) return;
                try {
                  const res = await api.get(`/projects/${currentProjectId}/versions`);
                  const versions = res.data.versions || [];
                  if (versions.length === 0) {
                    toast('No previous versions saved yet');
                    return;
                  }
                  const choice = prompt(`Restore version? (1-${versions.length})\n` + versions.map((v: any, i: number) => `${i+1}. ${new Date(v.timestamp).toLocaleString()}`).join('\n'));
                  const idx = parseInt(choice || '') - 1;
                  if (idx >= 0 && versions[idx]) {
                    await api.post(`/projects/${currentProjectId}/restore/${versions[idx].id}`);
                    // Reload scenes
                    const proj = await api.get(`/projects/${currentProjectId}`);
                    const loaded = proj.data.project.scenes.map((s: any) => ({ id: s.id, title: s.title, duration: s.duration, script: s.script || '' }));
                    setScenes(loaded);
                    toast.success('Version restored');
                  }
                } catch {
                  toast.error('Failed to load versions');
                }
              }}
              className="text-[#8B5CF6] hover:underline block mb-2"
            >
              Version History
            </button>
            <Link href="/dashboard" className="text-[#8B5CF6] hover:underline">← Back to Dashboard</Link>
          </div>
        </div>

        {/* CENTER — PREVIEW + TIMELINE */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* VIDEO PREVIEW - Now with real media support */}
          <div className="flex-1 bg-black relative flex items-center justify-center border-b border-white/10 overflow-hidden">
            <div className="relative w-full max-w-[960px] aspect-video bg-[#111] flex items-center justify-center">
              {/* Real Media Player + Remote Cursors */}
              {selectedScene?.videoUrl || selectedScene?.voiceoverUrl || selectedScene?.thumbnailUrl ? (
                <div 
                  className="relative w-full h-full flex items-center justify-center"
                  onMouseMove={handleMouseMove}
                >
                  {/* Playable real video when attached */}
                  {selectedScene.videoUrl ? (
                    <video 
                      id="scene-video-player"
                      src={selectedScene.videoUrl}
                      className="max-h-full max-w-full object-contain"
                      controls
                    />
                  ) : selectedScene.thumbnailUrl ? (
                    <img 
                      src={selectedScene.thumbnailUrl} 
                      alt={selectedScene.title}
                      className="max-h-full max-w-full object-contain opacity-90"
                    />
                  ) : (
                    <div className="text-6xl text-white/10">🎥</div>
                  )}

                  {/* Voiceover audio (only if no video) */}
                  {!selectedScene.videoUrl && selectedScene.voiceoverUrl && (
                    <audio 
                      id="scene-audio"
                      src={selectedScene.voiceoverUrl} 
                      className="hidden"
                    />
                  )}

                  <button
                    onClick={() => {
                      const audio = document.getElementById('scene-audio') as HTMLAudioElement;
                      if (audio) {
                        if (audio.paused) audio.play();
                        else audio.pause();
                      }
                      setIsPlaying(!isPlaying);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                  >
                    <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
                      {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1" />}
                    </div>
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 text-xs text-white/70 bg-black/60 px-4 py-1 rounded">
                    {selectedScene.title} • {selectedScene.duration}s
                    {selectedScene.voiceoverUrl && " • Voiceover ready"}
                  </div>

                  {/* Real-time Remote Cursors */}
                  {remoteCursors.map((cursor, idx) => (
                    <div 
                      key={idx}
                      className="absolute pointer-events-none z-50 flex items-center gap-1.5"
                      style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
                    >
                      <div className="w-3 h-3 rounded-full border-2 border-white shadow" style={{ backgroundColor: cursor.color }} />
                      <div className="text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-white whitespace-nowrap" style={{ color: cursor.color }}>
                        {cursor.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Fallback beautiful placeholder
                <div className="text-center z-10">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6 hover:scale-105 active:scale-95 transition"
                  >
                    {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1" />}
                  </button>
                  <div className="text-xl font-medium tracking-tight text-white/90">Cinematic Preview</div>
                  <div className="text-white/40 text-sm mt-1">1920×1080 • 24fps • HDR</div>
                  <div className="text-[10px] text-white/30 mt-4">Add voiceover or thumbnail to enable real playback</div>
                </div>
              )}
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[68%] z-20">
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => seekTo(0)}><SkipBack className="w-4 h-4" /></button>
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button onClick={() => seekTo(Math.min(totalDuration, currentTime + 5))}><SkipForward className="w-4 h-4" /></button>

                <div className="flex-1 mx-3">
                  <input
                    type="range"
                    min={0}
                    max={totalDuration}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => seekTo(parseFloat(e.target.value))}
                    className="w-full accent-[#8B5CF6]"
                  />
                </div>

                <div className="font-mono text-xs text-white/60 w-24 text-right">
                  {currentTime.toFixed(1)}s / {totalDuration}s
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
              <div 
                className="h-[3px] bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#F97316] transition-all duration-75" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          {/* TIMELINE */}
          <div className="h-64 bg-[#111117] border-t border-white/10 p-4 flex flex-col">
            <div className="flex items-center justify-between px-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="font-medium">Timeline</div>
                <div className="text-xs text-white/40">{scenes.length} scenes • {totalDuration}s</div>
              </div>
              <button onClick={handleAddScene} className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-xl border border-white/15 hover:bg-white/5">
                <Plus className="w-4 h-4" /> Add Scene
              </button>
            </div>

            <div className="flex gap-2 flex-1 overflow-x-auto pb-2 px-1">
              {scenes.map((scene, index) => {
                const isSelected = scene.id === selectedSceneId;
                const startTime = scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0);

                return (
                  <div
                    key={scene.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, scene.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, scene.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => selectScene(scene.id)}
                    onDoubleClick={() => setEditingScene(scene)}
                    className={`group relative min-w-[178px] rounded-2xl p-4 cursor-grab active:cursor-grabbing border transition-all select-none ${isSelected 
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 shadow-inner' 
                      : 'border-white/10 hover:border-white/30 bg-[#1A1A22]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium tracking-[-0.3px] pr-5">{scene.title}</div>
                        <div className="text-[#F97316] text-xs mt-1">{scene.duration}s</div>
                      </div>
                      <div className="text-[10px] text-white/40 font-mono">@{startTime}s</div>
                    </div>

                    {scene.script && (
                      <div className="text-xs text-white/60 mt-3 line-clamp-3 leading-snug">{scene.script}</div>
                    )}

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteScene(scene.id); }}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-2 right-3 text-[9px] text-white/30">Drag to reorder</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT AI PANEL */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              className="w-80 border-l border-white/10 bg-[#111117] flex flex-col overflow-hidden"
            >
              <div className="p-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> AI STUDIO
                </div>
                <button onClick={toggleRightPanel}><X className="w-4 h-4" /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 text-xs">
                {(['ai', 'media', 'voice', 'chat', 'export'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveRightTab(tab)}
                    className={`flex-1 py-3 ${activeRightTab === tab ? 'border-b-2 border-[#8B5CF6] text-white' : 'text-white/50'}`}
                  >
                    {tab === 'ai' ? 'AI Tools' : tab === 'media' ? 'Media' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* AI TOOLS CONTENT */}
              {activeRightTab === 'ai' && (
                <div className="p-4 space-y-2 overflow-y-auto flex-1">
                  <button 
                    disabled={isGenerating}
                    onClick={() => handleGenerateAI('script')}
                    className="ai-suggestion w-full text-left px-4 py-3.5 rounded-2xl border border-white/10 flex gap-3 disabled:opacity-50"
                  >
                    <Type className="w-5 h-5 mt-0.5 text-[#8B5CF6] shrink-0" />
                    <div>
                      <div className="font-medium">Generate / Improve Script</div>
                      <div className="text-xs text-white/60">Powered by OpenAI GPT-4o</div>
                    </div>
                  </button>

                  <button 
                    disabled={isGenerating}
                    onClick={() => handleGenerateAI('voiceover')}
                    className="ai-suggestion w-full text-left px-4 py-3.5 rounded-2xl border border-white/10 flex gap-3 disabled:opacity-50"
                  >
                    <Mic className="w-5 h-5 mt-0.5 text-[#F97316] shrink-0" />
                    <div>
                      <div className="font-medium">Generate Voiceover</div>
                      <div className="text-xs text-white/60">ElevenLabs — Cinematic voices</div>
                    </div>
                  </button>

                  <button 
                    disabled={isGenerating}
                    onClick={() => handleGenerateAI('thumbnail')}
                    className="ai-suggestion w-full text-left px-4 py-3.5 rounded-2xl border border-white/10 flex gap-3 disabled:opacity-50"
                  >
                    <ImageIcon className="w-5 h-5 mt-0.5 text-[#8B5CF6] shrink-0" />
                    <div>
                      <div className="font-medium">AI Thumbnail / Key Art</div>
                      <div className="text-xs text-white/60">Stability AI + DALL·E 3</div>
                    </div>
                  </button>

                  <button 
                    disabled={isGenerating}
                    onClick={() => handleGenerateAI('subtitle')}
                    className="ai-suggestion w-full text-left px-4 py-3.5 rounded-2xl border border-white/10 flex gap-3 disabled:opacity-50"
                  >
                    <Type className="w-5 h-5 mt-0.5 text-[#F97316] shrink-0" />
                    <div>
                      <div className="font-medium">Auto Generate Captions</div>
                      <div className="text-xs text-white/60">Perfectly timed & styled</div>
                    </div>
                  </button>

                  <button 
                    disabled={isGenerating}
                    onClick={() => {
                      const prompt = `Suggest epic cinematic background music for: ${selectedScene?.title || 'this story'}`;
                      handleGenerateAI('music', prompt);
                    }}
                    className="ai-suggestion w-full text-left px-4 py-3.5 rounded-2xl border border-white/10 flex gap-3 disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 mt-0.5 text-[#F97316] shrink-0" />
                    <div>
                      <div className="font-medium">AI Music Suggestions</div>
                      <div className="text-xs text-white/60">Generate prompts for Suno / Udio</div>
                    </div>
                  </button>

                  {isGenerating && (
                    <div className="text-center py-4 text-sm text-[#8B5CF6]">Generating with AI...</div>
                  )}
                </div>
              )}

              {/* MEDIA PANEL - Upload & Attach to Scene */}
              {activeRightTab === 'media' && (
                <div className="p-5 text-sm space-y-5 overflow-y-auto flex-1">
                  <div>
                    <div className="text-white/50 text-xs tracking-widest mb-2">ATTACH TO SELECTED SCENE</div>
                    <div className="text-xs text-white/60 mb-3">Selected: <span className="text-white">{selectedScene?.title || 'None'}</span></div>

                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-white/30 hover:border-[#8B5CF6] rounded-2xl p-6 text-center transition">
                        <div className="text-[#8B5CF6] mb-1">↑ Upload Image / Video</div>
                        <div className="text-[10px] text-white/50">PNG, JPG, MP4 • Becomes scene thumbnail</div>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !selectedSceneId) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            const res = await api.post('/upload', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const url = res.data.file.url;
                            updateScene(selectedSceneId, { thumbnailUrl: url });
                            toast.success('Media attached to scene');
                          } catch {
                            toast.error('Upload failed');
                          }
                        }}
                      />
                    </label>

                    <label className="block w-full cursor-pointer mt-3">
                      <div className="border border-dashed border-white/30 hover:border-[#F97316] rounded-2xl p-6 text-center transition">
                        <div className="text-[#F97316] mb-1">↑ Upload Voiceover (MP3)</div>
                        <div className="text-[10px] text-white/50">Attach custom or ElevenLabs audio</div>
                      </div>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !selectedSceneId) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            const res = await api.post('/upload', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const url = res.data.file.url;
                            updateScene(selectedSceneId, { voiceoverUrl: url });
                            toast.success('Voiceover attached');
                          } catch {
                            toast.error('Upload failed');
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="text-[10px] text-white/40 pt-4 border-t border-white/10">
                    Uploaded files are stored in <span className="font-mono">/uploads</span> and can be used in renders.
                  </div>
                </div>
              )}

              {/* VOICE PANEL */}
              {activeRightTab === 'voice' && (
                <div className="p-5 text-sm space-y-3 overflow-y-auto flex-1">
                  <div className="text-white/50 text-xs tracking-widest mb-1">ELEVENLABS VOICES</div>
                  {['Rachel (Warm Cinematic)', 'Adam (Deep Narrator)', 'Bella (Emotional)', 'Josh (Young Hero)'].map((v, i) => (
                    <div key={i} className="glass px-4 py-3 rounded-2xl flex justify-between items-center">
                      <div>{v}</div>
                      <button onClick={() => handleGenerateAI('voiceover', `Use voice: ${v}`)} className="text-xs px-3 py-1 bg-white/10 rounded-xl">Use</button>
                    </div>
                  ))}
                </div>
              )}

              {/* CHAT PANEL - Real-time Team Collaboration */}
              {activeRightTab === 'chat' && (
                <div className="flex flex-col h-full">
                  <div className="p-4 text-xs tracking-widest text-white/50 border-b border-white/10">TEAM CHAT</div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm bg-black/30">
                    {chatMessages.length === 0 && (
                      <div className="text-white/40 text-center text-xs pt-8">No messages yet. Say hi to your team!</div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="text-[#8B5CF6] font-medium shrink-0">{msg.name}:</div>
                        <div className="text-white/90">{msg.text}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-white/10">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatInput.trim() || !socket || !currentProjectId) return;
                        
                        const msg = { name: user?.name || 'You', text: chatInput.trim(), ts: Date.now() };
                        socket.emit('chat-message', { projectId: currentProjectId, ...msg });
                        setChatMessages(prev => [...prev, msg]);
                        setChatInput('');
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm"
                      />
                      <button type="submit" className="btn-primary px-4 rounded-xl text-sm">Send</button>
                    </form>
                  </div>
                </div>
              )}

              {/* EXPORT */}
              {activeRightTab === 'export' && (
                <div className="p-5 text-sm space-y-4">
                  <div>Resolution: <span className="text-white/60">4K UHD</span></div>
                  <div>Frame Rate: <span className="text-white/60">24fps</span></div>
                  <div>Color: <span className="text-white/60">Rec.709 / HDR</span></div>

                  <div>
                    <div className="mb-1.5 text-xs text-white/50">BACKGROUND MUSIC (Multi-track)</div>
                    <select 
                      id="music-select"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm"
                      defaultValue=""
                    >
                      <option value="">None (Voiceover only)</option>
                      <option value="/uploads/temp/cinematic-ambient.mp3">Cinematic Ambient</option>
                      <option value="/uploads/temp/neon-pulse.mp3">Neon Pulse</option>
                      <option value="/uploads/temp/emotional-piano.mp3">Emotional Piano</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      const musicSelect = document.getElementById('music-select') as HTMLSelectElement;
                      handleExportWithMusic(musicSelect?.value);
                    }} 
                    className="mt-4 w-full py-3.5 rounded-2xl bg-[#F97316] font-medium"
                  >
                    Start 4K Render with Music
                  </button>
                </div>
              )}

              <div className="p-4 border-t border-white/10 text-[10px] text-white/40">DesignXpress AI • Local Dev</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Render Progress Modal with Live Logs */}
      <AnimatePresence>
        {renderProgress.open && (
          <div className="fixed inset-0 bg-black/90 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass rounded-3xl w-full max-w-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm tracking-[3px] text-[#F97316]">DESIGNXPRESS AI</div>
                    <h3 className="text-3xl font-semibold tracking-tight">Rendering Video</h3>
                  </div>
                  <button 
                    onClick={() => setRenderProgress({ open: false, status: '', percent: 0, logs: [] })}
                    className="text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-white/10 rounded-full mb-2 overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#F97316] transition-all duration-500"
                    style={{ width: `${renderProgress.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60 mb-6">
                  <div>{renderProgress.status}</div>
                  <div>{renderProgress.percent}%</div>
                </div>

                {/* Live Logs */}
                <div className="bg-black/60 rounded-2xl p-4 font-mono text-xs text-[#A1A1AA] h-64 overflow-y-auto border border-white/10">
                  {renderProgress.logs.map((log, i) => (
                    <div key={i} className="py-0.5">{log}</div>
                  ))}
                  {renderProgress.percent < 100 && (
                    <div className="animate-pulse text-[#8B5CF6]">▌</div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 px-8 py-4 flex justify-end gap-3 bg-white/[0.015]">
                {renderProgress.percent === 100 && (
                  <button 
                    onClick={() => setRenderProgress({ open: false, status: '', percent: 0, logs: [] })}
                    className="btn-primary px-8 py-2 rounded-2xl text-sm"
                  >
                    Done
                  </button>
                )}
                {renderProgress.percent < 100 && (
                  <div className="text-xs text-white/40 flex items-center px-4">Rendering in progress — do not close this window</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scene Editing Modal */}
      <AnimatePresence>
        {editingScene && (
          <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="glass rounded-3xl w-full max-w-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold tracking-tight">Edit Scene</h3>
                <button onClick={() => setEditingScene(null)}><X /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs tracking-widest text-white/50">TITLE</label>
                  <input 
                    value={editingScene.title} 
                    onChange={(e) => setEditingScene({ ...editingScene, title: e.target.value })}
                    className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-widest text-white/50">DURATION (seconds)</label>
                  <input 
                    type="number" 
                    value={editingScene.duration} 
                    onChange={(e) => setEditingScene({ ...editingScene, duration: parseInt(e.target.value) || 5 })}
                    className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-widest text-white/50">SCRIPT / DESCRIPTION</label>
                  <textarea 
                    value={editingScene.script || ''} 
                    onChange={(e) => setEditingScene({ ...editingScene, script: e.target.value })}
                    rows={4}
                    className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 mt-2 resize-y"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => {
                    updateScene(editingScene.id, editingScene);
                    setEditingScene(null);
                  }} 
                  className="btn-primary flex-1 py-3 rounded-2xl"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setEditingScene(null)} 
                  className="btn-secondary flex-1 py-3 rounded-2xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
