'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DailyIframe, { DailyCall, DailyParticipant } from '@daily-co/daily-js';
import { sessions } from '@/lib/api';
import { Button } from '@/components/ui/Button';

// ─── Types ───────────────────────────────────────────────────────
interface SessionData {
  id: string;
  subject: string;
  level: string;
  scheduledAt: string;
  durationMins: number;
  status: string;
  sessionType: string;
  meetingLink?: string;
  student?: { firstName: string; lastName: string };
  tutor?: { User?: { firstName: string; lastName: string } };
}

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: Date;
  isLocal: boolean;
}

type CallState = 'loading' | 'lobby' | 'joining' | 'in-call' | 'ended' | 'error';

// ─── Icons (inline SVGs) ────────────────────────────────────────
const MicIcon = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    {muted ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    ) : (
      <>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    )}
  </svg>
);

const CameraIcon = ({ off }: { off: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    {off ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
      </>
    ) : (
      <>
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    )}
  </svg>
);

const ScreenShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <polyline points="8 10 12 6 16 10" />
    <line x1="12" y1="6" x2="12" y2="14" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PhoneOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── Video tile (top-level to preserve identity across re-renders) ──
function VideoTile({ participant, isLocal, className }: { participant: DailyParticipant; isLocal: boolean; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const track = participant.tracks?.video;
    if (track?.state === 'playable' && track.persistentTrack && videoRef.current) {
      const stream = new MediaStream([track.persistentTrack]);
      videoRef.current.srcObject = stream;
      setHasVideo(true);
    } else {
      setHasVideo(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [participant.tracks?.video?.state, participant.tracks?.video?.persistentTrack]);

  const isSpeaking = participant.tracks?.audio?.state === 'playable';
  const name = participant.user_name || (isLocal ? 'You' : 'Participant');
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gray-900 h-full ${isSpeaking && !isLocal ? 'ring-2 ring-[#2D9B6E]' : ''} ${className || ''}`}>
      {/* Always render video element so ref is available */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`absolute inset-0 w-full h-full object-cover ${isLocal ? 'transform scale-x-[-1]' : ''} ${hasVideo ? '' : 'hidden'}`}
      />
      {/* Avatar placeholder when no video */}
      {!hasVideo && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800">
          <div className="w-20 h-20 rounded-full bg-[#2D9B6E] flex items-center justify-center text-white text-3xl font-semibold">
            {initial}
          </div>
        </div>
      )}
      {/* Name overlay */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg">
        {isLocal ? `${name} (You)` : name}
      </div>
      {/* Muted indicator */}
      {participant.tracks?.audio?.state !== 'playable' && !isLocal && (
        <div className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-sm p-1.5 rounded-full">
          <MicIcon muted />
        </div>
      )}
    </div>
  );
}

// ─── Screen share tile (top-level) ──────────────────────────────
function ScreenShareTile({ participant }: { participant: DailyParticipant }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const track = participant.tracks?.screenVideo;
    if (track?.state === 'playable' && track.persistentTrack && videoRef.current) {
      const stream = new MediaStream([track.persistentTrack]);
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [participant.tracks?.screenVideo?.state, participant.tracks?.screenVideo?.persistentTrack]);

  const name = participant.user_name || (participant.local ? 'You' : 'Participant');

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg flex items-center gap-2">
        <ScreenShareIcon />
        <span>{name}&apos;s screen</span>
      </div>
    </div>
  );
}

// ─── Audio element for remote participants (top-level) ───────────
function RemoteAudio({ participant }: { participant: DailyParticipant }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const track = participant.tracks?.audio;
    if (track?.state === 'playable' && track.persistentTrack && audioRef.current) {
      const stream = new MediaStream([track.persistentTrack]);
      audioRef.current.srcObject = stream;
    }
  }, [participant.tracks?.audio?.state, participant.tracks?.audio?.persistentTrack]);

  return <audio ref={audioRef} autoPlay playsInline />;
}

// ─── Main Component ──────────────────────────────────────────────
export default function SessionVideoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;

  // Demo mode: skip auth when token + room query params are present
  const demoToken = searchParams.get('token');
  const demoRoom = searchParams.get('room');
  const isDemo = !!(demoToken && demoRoom);

  const [session, setSession] = useState<SessionData | null>(null);
  const [callState, setCallState] = useState<CallState>('loading');
  const [error, setError] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [participants, setParticipants] = useState<Record<string, DailyParticipant>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const callRef = useRef<DailyCall | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const joinTimeRef = useRef<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isChatOpenRef = useRef(false);

  // Keep ref in sync with state for use in event handlers
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    if (isChatOpen) setUnreadCount(0);
  }, [isChatOpen]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Derive screen share participant
  const screenShareParticipant = Object.values(participants).find(
    (p) => p.tracks?.screenVideo?.state === 'playable'
  );
  const isScreenSharing = Object.values(participants).some(
    (p) => p.local && p.tracks?.screenVideo?.state === 'playable'
  );

  // Fetch session data
  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      // Demo mode — skip API, use synthetic session data
      if (isDemo) {
        setSession({
          id: sessionId,
          subject: 'FindGrinds Demo',
          level: '',
          scheduledAt: new Date().toISOString(),
          durationMins: 60,
          status: 'CONFIRMED',
          sessionType: 'VIDEO',
        });
        setCallState('lobby');
        return;
      }

      try {
        const res = await sessions.getById(sessionId);
        if (cancelled) return;
        if (!res.success) {
          setError('Session not found');
          setCallState('error');
          return;
        }
        setSession(res.data);

        if (res.data.sessionType !== 'VIDEO') {
          setError('This is not a video session');
          setCallState('error');
          return;
        }

        if (res.data.status === 'CANCELLED') {
          setError('This session has been cancelled');
          setCallState('error');
          return;
        }

        setCallState('lobby');
      } catch {
        if (cancelled) return;
        setError('Failed to load session. Please check you are logged in.');
        setCallState('error');
      }
    }
    loadSession();

    return () => { cancelled = true; };
  }, [sessionId, isDemo]);

  // Setup local video preview in lobby
  useEffect(() => {
    if (callState !== 'lobby') return;

    let stream: MediaStream | null = null;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Camera access denied — that's fine, user can still join
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [callState]);

  // Timer for in-call elapsed time
  useEffect(() => {
    if (callState === 'in-call') {
      joinTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - joinTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Join the call
  const joinCall = useCallback(async () => {
    if (!session) return;
    setCallState('joining');

    try {
      // Resolve room URL + token (demo mode uses query params, normal mode uses API)
      let joinUrl: string;
      let joinToken: string;

      if (isDemo && demoToken && demoRoom) {
        joinUrl = demoRoom;
        joinToken = demoToken;
      } else {
        const tokenRes = await sessions.getToken(sessionId);

        if (!tokenRes.success) {
          setError('Failed to get meeting access');
          setCallState('error');
          return;
        }

        if (tokenRes.data.provider === 'zoom' && tokenRes.data.meetingLink) {
          window.open(tokenRes.data.meetingLink, '_blank');
          setCallState('lobby');
          return;
        }

        joinUrl = tokenRes.data.roomUrl!;
        joinToken = tokenRes.data.token!;
      }

      // Create Daily call object
      const callObject = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: true,
      });

      callRef.current = callObject;

      // Listen for participant updates
      callObject.on('participant-joined', (ev) => {
        if (ev?.participant) {
          setParticipants((prev) => ({ ...prev, [ev.participant.session_id]: ev.participant }));
        }
      });

      callObject.on('participant-updated', (ev) => {
        if (ev?.participant) {
          setParticipants((prev) => ({ ...prev, [ev.participant.session_id]: ev.participant }));
        }
      });

      callObject.on('participant-left', (ev) => {
        if (ev?.participant) {
          setParticipants((prev) => {
            const next = { ...prev };
            delete next[ev.participant.session_id];
            return next;
          });
        }
      });

      callObject.on('left-meeting', () => {
        setCallState('ended');
      });

      callObject.on('error', (ev) => {
        console.error('Daily error:', ev);
        setError('Video call error. Please try refreshing the page.');
        setCallState('error');
      });

      // Chat message listener
      callObject.on('app-message', (ev: any) => {
        if (ev?.data?.text) {
          setChatMessages((prev) => [
            ...prev,
            {
              sender: ev.data.sender || 'Participant',
              text: ev.data.text,
              timestamp: new Date(),
              isLocal: false,
            },
          ]);
          if (!isChatOpenRef.current) {
            setUnreadCount((c) => c + 1);
          }
        }
      });

      // Join the room
      await callObject.join({
        url: joinUrl,
        token: joinToken,
      });

      // Configure send settings for screen share quality
      await callObject.updateSendSettings({
        screenVideo: 'detail-optimized',
      });

      // Get initial participants
      const allParticipants = callObject.participants();
      setParticipants(allParticipants as Record<string, DailyParticipant>);

      setCallState('in-call');
    } catch (err) {
      console.error('Failed to join call:', err);
      setError('Failed to join the video call. Please try again.');
      setCallState('error');
    }
  }, [session, sessionId, isDemo, demoToken, demoRoom]);

  // Leave the call
  const leaveCall = useCallback(async () => {
    if (callRef.current) {
      await callRef.current.leave();
      callRef.current.destroy();
      callRef.current = null;
    }
    setCallState('ended');
  }, []);

  // Toggle mic
  const toggleMic = useCallback(() => {
    if (callRef.current) {
      callRef.current.setLocalAudio(isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (callRef.current) {
      callRef.current.setLocalVideo(isCameraOff);
      setIsCameraOff(!isCameraOff);
    }
  }, [isCameraOff]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (!callRef.current) return;

    if (isScreenSharing) {
      callRef.current.stopScreenShare();
    } else {
      try {
        callRef.current.startScreenShare({
          displayMediaOptions: {
            video: {
              width: { ideal: 1920, max: 1920 },
              height: { ideal: 1080, max: 1080 },
            },
          },
        });
      } catch {
        // User cancelled screen share dialog
      }
    }
  }, [isScreenSharing]);

  // Send chat message
  const sendChatMessage = useCallback(() => {
    if (!chatInput.trim() || !callRef.current) return;
    const localP = callRef.current.participants().local;
    const sender = localP?.user_name || 'You';
    callRef.current.sendAppMessage({ text: chatInput.trim(), sender }, '*');
    setChatMessages((prev) => [
      ...prev,
      { sender, text: chatInput.trim(), timestamp: new Date(), isLocal: true },
    ]);
    setChatInput('');
  }, [chatInput]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callRef.current) {
        callRef.current.leave();
        callRef.current.destroy();
      }
    };
  }, []);

  // Get session info
  const otherName = session?.tutor?.User
    ? `${session.tutor.User.firstName} ${session.tutor.User.lastName}`
    : session?.student
    ? `${session.student.firstName} ${session.student.lastName}`
    : 'Participant';

  const sessionTime = session?.scheduledAt
    ? new Date(session.scheduledAt).toLocaleString('en-IE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // ─── Render ────────────────────────────────────────────────────
  // Loading state
  if (callState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#2D9B6E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (callState === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Unable to Join Session</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/dashboard/student">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Pre-call lobby
  if (callState === 'lobby' || callState === 'joining') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* FindGrinds branding */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white">Find<span className="text-[#2D9B6E]">Grinds</span></span>
            </Link>
          </div>

          {/* Camera preview */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video mb-6">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {/* Camera/mic toggles on preview */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'}`}
              >
                <MicIcon muted={isMuted} />
              </button>
              <button
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'}`}
              >
                <CameraIcon off={isCameraOff} />
              </button>
            </div>
          </div>

          {/* Session info card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">{session?.subject} — {session?.level}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">With</span>
                <p className="text-gray-200">{otherName}</p>
              </div>
              <div>
                <span className="text-gray-500">Scheduled</span>
                <p className="text-gray-200">{sessionTime}</p>
              </div>
              <div>
                <span className="text-gray-500">Duration</span>
                <p className="text-gray-200">{session?.durationMins} minutes</p>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <p className="text-gray-200">{session?.status}</p>
              </div>
            </div>
          </div>

          {/* Join button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base py-4"
            onClick={joinCall}
            isLoading={callState === 'joining'}
          >
            {callState === 'joining' ? 'Connecting...' : 'Join Session'}
          </Button>
        </div>
      </div>
    );
  }

  // In-call view
  if (callState === 'in-call') {
    const participantList = Object.values(participants);
    const localParticipant = participantList.find((p) => p.local);
    const remoteParticipants = participantList.filter((p) => !p.local);

    return (
      <div className="h-screen bg-gray-950 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">Find<span className="text-[#2D9B6E]">Grinds</span></span>
            <span className="text-gray-500 text-xs">|</span>
            <span className="text-gray-400 text-sm">{session?.subject}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-gray-300 text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 p-4 flex gap-4 min-h-0">
          {screenShareParticipant ? (
            // Screen share active — screen share as main, cameras in sidebar
            <div className="flex-1 flex gap-4 min-h-0">
              {/* Main: screen share */}
              <div className="flex-1 min-h-0">
                <ScreenShareTile participant={screenShareParticipant} />
              </div>
              {/* Sidebar: camera tiles */}
              <div className="w-48 flex flex-col gap-3 min-h-0">
                {remoteParticipants.map((p) => (
                  <div key={p.session_id} className="h-36">
                    <VideoTile participant={p} isLocal={false} />
                  </div>
                ))}
                {localParticipant && (
                  <div className="h-36">
                    <VideoTile participant={localParticipant} isLocal />
                  </div>
                )}
              </div>
            </div>
          ) : remoteParticipants.length === 0 ? (
            // Solo — waiting for other participant
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 rounded-2xl bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-[#2D9B6E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Waiting for {otherName} to join...</p>
                </div>
              </div>
              {/* Self view (small) */}
              {localParticipant && (
                <div className="mt-4 w-48 h-36 self-end">
                  <VideoTile participant={localParticipant} isLocal />
                </div>
              )}
            </div>
          ) : (
            // Normal: camera tiles side by side
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 relative">
              {remoteParticipants.map((p) => (
                <div key={p.session_id} className="flex-1 min-h-0">
                  <VideoTile participant={p} isLocal={false} />
                </div>
              ))}
              {/* Self view (picture-in-picture) */}
              {localParticipant && (
                <div className="absolute bottom-4 right-4 w-48 h-36 z-10 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
                  <VideoTile participant={localParticipant} isLocal />
                </div>
              )}
            </div>
          )}

          {/* Chat panel */}
          {isChatOpen && (
            <div className="w-80 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col min-h-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <h3 className="text-white font-semibold text-sm">Chat</h3>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                {chatMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm text-center">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-gray-500 mb-0.5 px-1">
                        {msg.isLocal ? 'You' : msg.sender}
                      </span>
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                          msg.isLocal
                            ? 'bg-[#2D9B6E] text-white rounded-br-sm'
                            : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-600 mt-0.5 px-1">
                        {msg.timestamp.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-[#2D9B6E] focus:outline-none placeholder-gray-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim()}
                    className="p-2 rounded-lg bg-[#2D9B6E] text-white hover:bg-[#258a5e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Remote audio elements */}
        {remoteParticipants.map((p) => (
          <RemoteAudio key={`audio-${p.session_id}`} participant={p} />
        ))}

        {/* Toolbar */}
        <div className="px-4 py-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleMic}
              className={`p-3.5 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <MicIcon muted={isMuted} />
            </button>
            <button
              onClick={toggleCamera}
              className={`p-3.5 rounded-full transition-all ${isCameraOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
            >
              <CameraIcon off={isCameraOff} />
            </button>
            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-full transition-all ${isScreenSharing ? 'bg-[#2D9B6E] text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <ScreenShareIcon />
            </button>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-3.5 rounded-full transition-all relative ${isChatOpen ? 'bg-[#2D9B6E] text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title="Toggle chat"
            >
              <ChatIcon />
              {unreadCount > 0 && !isChatOpen && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div className="w-px h-8 bg-gray-700 mx-1" />
            <button
              onClick={leaveCall}
              className="px-6 py-3.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2 font-medium"
              title="Leave session"
            >
              <PhoneOffIcon />
              <span className="text-sm">Leave</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Post-call / ended state
  if (callState === 'ended') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#2D9B6E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2D9B6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Session Complete</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Subject</span>
                <p className="text-gray-200">{session?.subject}</p>
              </div>
              <div>
                <span className="text-gray-500">Duration</span>
                <p className="text-gray-200">{formatTime(elapsedTime)}</p>
              </div>
              <div>
                <span className="text-gray-500">With</span>
                <p className="text-gray-200">{otherName}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/student">
              <Button variant="primary">Return to Dashboard</Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Don&apos;t forget to leave a review from your dashboard!
          </p>
        </div>
      </div>
    );
  }

  return null;
}
