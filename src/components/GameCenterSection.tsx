import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Flame,
  Award,
  Clock,
  Gift
} from 'lucide-react';
import contentData from '../data/contentData.json';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

export const GameCenterSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'flappy' | 'snake'>('flappy');

  return (
    <div className="space-y-6">
      {/* Game Selector Header */}
      <div className="bg-gradient-to-r from-[#00529C] to-[#003B73] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Khu vực giải trí quầy giao dịch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {contentData.gameCenter.title}
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mt-1">
            {contentData.gameCenter.subTitle}
          </p>
        </div>

        {/* Tab switch between 2 games */}
        <div className="flex items-center p-1.5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 shrink-0">
          <button
            onClick={() => setActiveGame('flappy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeGame === 'flappy'
                ? 'bg-white text-[#00529C] shadow-md'
                : 'text-white hover:text-blue-100'
            }`}
          >
            Chờ Vui (Flappy Bird)
          </button>
          <button
            onClick={() => setActiveGame('snake')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeGame === 'snake'
                ? 'bg-white text-[#00529C] shadow-md'
                : 'text-white hover:text-blue-100'
            }`}
          >
            Snake Challenge (Rắn săn mồi)
          </button>
        </div>
      </div>

      {/* Render active game */}
      {activeGame === 'flappy' ? <FlappyBirdGame /> : <SnakeGame />}
    </div>
  );
};

// ==========================================
// GAME 1: FLAPPY BIRD VOUCHER GAME
// ==========================================
const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Configuration constants specified in PDF
  const WIN_SCORE = 20;
  const GRAVITY = 0.28;
  const JUMP_FORCE = -5.8;
  const PIPE_SPEED = 2.2;
  const PIPE_GAP = 145; // wide enough for comfortable casual play
  const VOUCHER_TEXT = "Voucher 2 lít xăng";
  const BRAND_NAME = "VietinBank";
  const GAME_TITLE = "Chờ vui – Chơi hay – Nhận quà liền tay";

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_flappy_highscore') || '0', 10);
  });
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [savedVoucher, setSavedVoucher] = useState<string>(() => {
    return localStorage.getItem('vb_flappy_last_voucher') || '';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // References for game loop
  const birdRef = useRef({
    x: 70,
    y: 180,
    vy: 0,
    radius: 16,
    rotation: 0
  });

  const pipesRef = useRef<Array<{
    x: number;
    topHeight: number;
    bottomY: number;
    passed: boolean;
  }>>([]);

  const animationFrameRef = useRef<number | null>(null);
  const lastPipeSpawnRef = useRef<number>(0);

  // Sound generator using Web Audio API (no external sound files required)
  const playBeep = (freq: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  };

  const generateVoucherCode = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetGame = () => {
    birdRef.current = {
      x: 70,
      y: 180,
      vy: 0,
      radius: 16,
      rotation: 0
    };
    pipesRef.current = [];
    lastPipeSpawnRef.current = 0;
    setScore(0);
    setGameState('playing');
  };

  const startGame = () => {
    resetGame();
  };

  const jump = () => {
    if (gameState === 'playing') {
      birdRef.current.vy = JUMP_FORCE;
      playBeep(420, 0.08);
    } else if (gameState === 'idle') {
      startGame();
    }
  };

  const endGame = (finalScore: number) => {
    setGameState('lost');
    playBeep(180, 0.25);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_flappy_highscore', finalScore.toString());
    }
    if (window.onFlappyVoucherLose) {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  };

  const winGame = () => {
    setGameState('won');
    const newVoucher = generateVoucherCode();
    setVoucherCode(newVoucher);
    setSavedVoucher(newVoucher);
    localStorage.setItem('vb_flappy_last_voucher', newVoucher);
    localStorage.setItem('vb_flappy_highscore', '20');
    setHighScore(20);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    playBeep(880, 0.4);

    if (window.onFlappyVoucherWin) {
      window.onFlappyVoucherWin({
        score: 20,
        voucherCode: newVoucher,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Encouragement text dynamically changing by score
  const getMotivationText = (sc: number) => {
    if (sc < 5) return 'Khởi động nhẹ nhàng!';
    if (sc <= 9) return 'Tốt lắm, tiếp tục nào!';
    if (sc <= 14) return 'Một nửa chặng đường rồi!';
    if (sc <= 19) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Sky Gradient & subtle background clouds/VietinBank pillars
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background city/branch skyline
      ctx.fillStyle = '#93C5FD44';
      ctx.fillRect(40, canvas.height - 110, 45, 70);
      ctx.fillRect(110, canvas.height - 140, 60, 100);
      ctx.fillRect(200, canvas.height - 90, 50, 50);
      ctx.fillRect(280, canvas.height - 130, 55, 90);
      ctx.fillRect(360, canvas.height - 100, 50, 60);

      // Floor ground
      const groundH = 40;
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, canvas.height - groundH, canvas.width, 6);
      ctx.fillStyle = '#0369A1';
      ctx.fillRect(0, canvas.height - groundH + 6, canvas.width, groundH - 6);

      // 2. Game logic if playing
      if (gameState === 'playing') {
        // Physics for bird
        birdRef.current.vy += GRAVITY;
        birdRef.current.y += birdRef.current.vy;
        birdRef.current.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdRef.current.vy * 0.08));

        // Spawn pipes
        if (timestamp - lastPipeSpawnRef.current > 1900) {
          lastPipeSpawnRef.current = timestamp;
          const minPipe = 50;
          const maxPipe = canvas.height - groundH - PIPE_GAP - minPipe;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          pipesRef.current.push({
            x: canvas.width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            passed: false
          });
        }

        // Move pipes & collision check
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          const pipeW = 54;
          const bird = birdRef.current;

          // Check if passed for score
          if (!pipe.passed && pipe.x + pipeW < bird.x) {
            pipe.passed = true;
            localScore += 1;
            setScore(localScore);
            playBeep(520, 0.06);

            if (localScore >= WIN_SCORE) {
              winGame();
              return;
            }
          }

          // Check collision with top pipe or bottom pipe
          const inX = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeW;
          const hitTop = bird.y - bird.radius < pipe.topHeight;
          const hitBottom = bird.y + bird.radius > pipe.bottomY;

          if (inX && (hitTop || hitBottom)) {
            endGame(localScore);
            return;
          }

          // Remove out of screen pipes
          if (pipe.x + pipeW < -10) {
            pipesRef.current.splice(i, 1);
          }
        }

        // Collision with floor or ceiling
        if (birdRef.current.y + birdRef.current.radius >= canvas.height - groundH) {
          endGame(localScore);
          return;
        }
        if (birdRef.current.y - birdRef.current.radius <= 0) {
          birdRef.current.y = birdRef.current.radius;
          birdRef.current.vy = 0;
        }
      }

      // 3. Draw Pipes (VietinBank Blue columns with gold rim)
      pipesRef.current.forEach((pipe) => {
        const pipeW = 54;
        // Top pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeW, 0);
        topGrad.addColorStop(0, '#00529C');
        topGrad.addColorStop(0.6, '#0284C7');
        topGrad.addColorStop(1, '#003B73');
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, 0, pipeW, pipe.topHeight);
        // Top pipe collar
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 14, pipeW + 6, 14);

        // Bottom pipe
        const bottomH = canvas.height - groundH - pipe.bottomY;
        const bottomGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeW, 0);
        bottomGrad.addColorStop(0, '#00529C');
        bottomGrad.addColorStop(0.6, '#0284C7');
        bottomGrad.addColorStop(1, '#003B73');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(pipe.x, pipe.bottomY, pipeW, bottomH);
        // Bottom pipe collar
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(pipe.x - 3, pipe.bottomY, pipeW + 6, 14);
      });

      // 4. Draw Character (VietinBank Mascot Bird with Gold Coin)
      const b = birdRef.current;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);

      // Body - VietinBank Blue with Red Crest
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00529C';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Belly
      ctx.beginPath();
      ctx.arc(4, 5, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();

      // Eye
      ctx.beginPath();
      ctx.arc(7, -5, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8.5, -5, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      // Wing (Red CTG accent)
      ctx.beginPath();
      ctx.ellipse(-6, 2, 8, 4.5, Math.PI / 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ED1C24';
      ctx.fill();

      // Beak
      ctx.beginPath();
      ctx.moveTo(12, -2);
      ctx.lineTo(20, 1);
      ctx.lineTo(12, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      ctx.restore();

      // Next frame
      if (gameState === 'playing') {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (gameState === 'playing') {
      animationFrameRef.current = requestAnimationFrame(render);
    } else {
      // Just render static backdrop
      render(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState]);

  // Spacebar key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div id="flappy-voucher-game" className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Game Bar with Title and Sounds */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#00529C]">
            {GAME_TITLE}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
            Vượt qua {WIN_SCORE} thử thách để nhận voucher 2 lít xăng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 text-[#00529C] border-blue-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Bật/tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Bật' : 'Tắt'} âm</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Motivation Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Điểm số:</span>
            <span className="text-xl font-extrabold text-[#00529C] font-mono tabular-nums">
              {score} / {WIN_SCORE}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          <div className="text-xs font-bold text-slate-600">
            Kỷ lục: <span className="font-mono text-[#ED1C24]">{highScore}</span>
          </div>
        </div>

        {/* Motivation text */}
        <div className="text-xs sm:text-sm font-bold text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 flex items-center gap-1.5 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{getMotivationText(score)}</span>
        </div>

        {/* Progress bar (0 to 20) */}
        <div className="w-full sm:w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#00529C] to-emerald-500 h-full transition-all duration-200"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Canvas Playfield Area */}
      <div className="relative mx-auto max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-xl select-none touch-none">
        <canvas
          ref={canvasRef}
          width={420}
          height={525}
          onClick={jump}
          className="w-full h-full block cursor-pointer"
        />

        {/* Idle Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00529C] to-[#ED1C24] flex items-center justify-center shadow-lg mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black mb-2">{GAME_TITLE}</h4>
            <p className="text-sm text-blue-100 font-medium mb-6 max-w-xs">
              Vượt qua 20 thử thách để nhận voucher 2 lít xăng
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-base shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Bắt đầu chơi
            </button>
            <p className="text-xs text-slate-300 mt-4 flex items-center gap-1.5">
              <span>Chạm màn hình hoặc nhấn <strong>Space</strong> để bay</span>
            </p>
          </div>
        )}

        {/* Lost Overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-7 h-7" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold mb-1">Rất tiếc!</h4>
            <p className="text-sm text-slate-200 mb-1">
              Bạn đã vượt qua <strong className="text-amber-300">{score}/{WIN_SCORE}</strong> thử thách
            </p>
            <p className="text-xs text-slate-300 font-medium mb-6">
              Chỉ còn một chút nữa thôi, hãy thử lại nhé!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 px-5 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Chơi lại
              </button>
              <button
                onClick={() => setGameState('idle')}
                className="flex-1 py-3 px-5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Won Screen Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#00529C]/90 to-[#003B73]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-amber-300 mb-1">Chúc mừng!</h4>
            <p className="text-sm text-blue-100 max-w-xs mb-4">
              Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>{VOUCHER_TEXT}</strong>.
            </p>

            {/* Voucher Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 w-full max-w-xs shadow-xl border-2 border-amber-300 space-y-2 mb-4">
              <span className="text-2xs uppercase tracking-widest font-extrabold text-slate-400 block">
                MÃ VOUCHER NHẬN QUÀ
              </span>
              <div className="font-mono text-2xl font-black text-[#ED1C24] tracking-widest py-1 bg-red-50 rounded-lg border border-red-200">
                {voucherCode}
              </div>
              <p className="text-2xs text-slate-500 font-medium">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>
            </div>

            <div className="flex gap-2 w-full max-w-xs">
              <button
                onClick={() => copyVoucherCode(voucherCode)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>
              <button
                onClick={startGame}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Voucher if any from previous win */}
      {savedVoucher && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">Mã quà tặng gần nhất của bạn:</span>
              <span className="font-mono font-black text-sm text-[#ED1C24]">{savedVoucher}</span>
              <span className="text-xs text-slate-500 ml-2">(Voucher 2 lít xăng)</span>
            </div>
          </div>
          <button
            onClick={() => copyVoucherCode(savedVoucher)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Sao chép</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// GAME 2: VIETINBANK SNAKE CHALLENGE
// ==========================================
const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GRID_SIZE = 20;
  const SPEED = 115; // ms per tick

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_snake_highscore') || '0', 10);
  });
  const [rewardTier, setRewardTier] = useState<string>('');
  const [completionTime, setCompletionTime] = useState<string>('');
  const [lastNotice, setLastNotice] = useState<string>('');

  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const scoreRef = useRef<number>(0);
  const reached20Ref = useRef<boolean>(false);
  const reached40Ref = useRef<boolean>(false);

  const spawnFood = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cols = Math.floor(canvas.width / GRID_SIZE);
    const rows = Math.floor(canvas.height / GRID_SIZE);

    let newFood: { x: number; y: number };
    let onSnake = true;
    while (onSnake) {
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      };
      onSnake = snakeRef.current.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    }
    foodRef.current = newFood!;
  };

  const startGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    reached20Ref.current = false;
    reached40Ref.current = false;
    setScore(0);
    setLastNotice('');
    setRewardTier('');
    spawnFood();
    setGameState('playing');
  };

  const finishGame = () => {
    setGameState('ended');
    const finalScore = scoreRef.current;
    setCompletionTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }));

    if (finalScore >= 40) {
      setRewardTier("02 voucher xăng (mỗi voucher 2 lít)");
      try {
        confetti({ particleCount: 100, spread: 80 });
      } catch {
        // safe
      }
    } else if (finalScore >= 20) {
      setRewardTier("01 voucher xăng trị giá 2 lít");
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {
        // safe
      }
    } else {
      setRewardTier("Chưa đạt mốc nhận quà");
    }

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_snake_highscore', finalScore.toString());
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const { x, y } = dirRef.current;
      if (e.key === 'ArrowUp' && y === 0) {
        e.preventDefault();
        nextDirRef.current = { x: 0, y: -1 };
      } else if (e.key === 'ArrowDown' && y === 0) {
        e.preventDefault();
        nextDirRef.current = { x: 0, y: 1 };
      } else if (e.key === 'ArrowLeft' && x === 0) {
        e.preventDefault();
        nextDirRef.current = { x: -1, y: 0 };
      } else if (e.key === 'ArrowRight' && x === 0) {
        e.preventDefault();
        nextDirRef.current = { x: 1, y: 0 };
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Touch control handlers
  const handleDirectionChange = (dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    const { x, y } = dirRef.current;
    if (dx !== 0 && x === 0) {
      nextDirRef.current = { x: dx, y: 0 };
    } else if (dy !== 0 && y === 0) {
      nextDirRef.current = { x: 0, y: dy };
    }
  };

  // Game tick interval
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cols = Math.floor(canvas.width / GRID_SIZE);
      const rows = Math.floor(canvas.height / GRID_SIZE);

      dirRef.current = nextDirRef.current;
      const head = { ...snakeRef.current[0] };
      head.x += dirRef.current.x;
      head.y += dirRef.current.y;

      // Wall collision
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        finishGame();
        return;
      }

      // Self collision
      if (snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y)) {
        finishGame();
        return;
      }

      snakeRef.current.unshift(head);

      // Eat food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 1;
        const newScore = scoreRef.current;
        setScore(newScore);

        if (newScore === 20 && !reached20Ref.current) {
          reached20Ref.current = true;
          setLastNotice("Chúc mừng Quý khách đã đạt 20 điểm! Nhận được 01 voucher xăng 2 lít.");
        } else if (newScore === 40 && !reached40Ref.current) {
          reached40Ref.current = true;
          setLastNotice("Xuất sắc! Quý khách đã đạt 40 điểm! Nhận được 02 voucher xăng (mỗi voucher 2 lít).");
        }

        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      // Render
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear & draw grid background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid lines
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Food (Golden VietinBank CTG Coin)
      const fx = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
      const fy = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
      ctx.beginPath();
      ctx.arc(fx, fy, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FEF08A';
      ctx.stroke();

      // Food Inner Symbol
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₫', fx, fy);

      // Draw Snake
      snakeRef.current.forEach((seg, i) => {
        const sx = seg.x * GRID_SIZE;
        const sy = seg.y * GRID_SIZE;
        if (i === 0) {
          // Head (VietinBank Blue)
          ctx.fillStyle = '#00529C';
          ctx.fillRect(sx + 1, sy + 1, GRID_SIZE - 2, GRID_SIZE - 2);
          // Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(sx + 4, sy + 4, 3, 3);
          ctx.fillRect(sx + 13, sy + 4, 3, 3);
        } else {
          // Body gradient
          ctx.fillStyle = i % 2 === 0 ? '#0284C7' : '#38BDF8';
          ctx.fillRect(sx + 2, sy + 2, GRID_SIZE - 4, GRID_SIZE - 4);
        }
      });
    }, SPEED);

    return () => clearInterval(interval);
  }, [gameState]);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#00529C]">
            VietinBank Snake Challenge
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
            Chơi vui tại quầy – Săn voucher xăng hấp dẫn
          </p>
        </div>

        {/* Milestone Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#00529C] font-bold">
            Mốc 20đ: 1 Voucher (2L)
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-[#ED1C24] font-bold">
            Mốc 40đ: 2 Voucher (4L)
          </div>
        </div>
      </div>

      {/* Score Dashboard */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block">Điểm hiện tại</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">{score}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block">Mốc thưởng</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400">
              {score >= 40 ? '2 Voucher 2L xăng' : score >= 20 ? '1 Voucher 2L xăng' : 'Chưa đạt mốc (cần 20đ)'}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-300">
          Kỷ lục: <strong className="text-amber-400 font-mono">{highScore}</strong>
        </div>
      </div>

      {/* Real-time milestone notification without game interruption */}
      {lastNotice && gameState === 'playing' && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lastNotice}</span>
        </div>
      )}

      {/* Canvas Screen */}
      <div className="relative mx-auto max-w-[400px] aspect-square rounded-2xl overflow-hidden border-4 border-slate-900 shadow-xl select-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full block bg-slate-950"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <Flame className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-xl font-black mb-1">VietinBank Snake Challenge</h4>
            <p className="text-xs text-slate-300 max-w-xs mb-6">
              Dùng phím mũi tên hoặc các nút điều khiển để giúp rắn ăn đồng xu tài lộc.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition-colors cursor-pointer"
            >
              Bắt đầu chơi
            </button>
          </div>
        )}

        {/* Ended / Gift Receipt Slip Modal */}
        {gameState === 'ended' && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white animate-in zoom-in-95 duration-200">
            <div className="bg-white text-slate-900 rounded-2xl p-5 w-full max-w-xs shadow-2xl border-2 border-[#00529C] space-y-3">
              <div className="text-center border-b border-slate-200 pb-2">
                <span className="text-2xs font-extrabold uppercase tracking-widest text-[#00529C]">
                  PHIẾU XÁC NHẬN QUÀ TẶNG
                </span>
                <h5 className="font-bold text-slate-800 text-sm">VietinBank Kiosk</h5>
              </div>

              <div className="space-y-1.5 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm cuối cùng:</span>
                  <span className="font-bold font-mono text-base text-[#00529C]">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mức quà đạt được:</span>
                  <span className="font-bold text-[#ED1C24] text-right">{rewardTier}</span>
                </div>
                <div className="flex justify-between items-center text-2xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Thời gian:</span>
                  </span>
                  <span>{completionTime}</span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl text-2xs text-[#00529C] font-semibold text-center border border-blue-200">
                Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
              </div>

              <button
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Mobile D-Pad Controls */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <button
          onClick={() => handleDirectionChange(0, -1)}
          className="w-14 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-[#00529C] active:text-white flex items-center justify-center font-bold text-slate-700 shadow-xs cursor-pointer"
          aria-label="Lên"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleDirectionChange(-1, 0)}
            className="w-14 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-[#00529C] active:text-white flex items-center justify-center font-bold text-slate-700 shadow-xs cursor-pointer"
            aria-label="Trái"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDirectionChange(0, 1)}
            className="w-14 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-[#00529C] active:text-white flex items-center justify-center font-bold text-slate-700 shadow-xs cursor-pointer"
            aria-label="Xuống"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDirectionChange(1, 0)}
            className="w-14 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-[#00529C] active:text-white flex items-center justify-center font-bold text-slate-700 shadow-xs cursor-pointer"
            aria-label="Phải"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
