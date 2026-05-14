import { useState, useCallback } from "react";

const MESSAGES = [
  "汪！今天打卡了吗？🐾",
  "嗷呜~~~ 加油！",
  "主人最棒了！❤️",
  "坚持就是胜利！",
  "嘿嘿，摸摸头~",
  "汪！别忘了打卡哦~",
  "好开心见到你！🦴",
  "嗷~ 今天状态不错！",
  "一起努力吧！💪",
  "汪星人给你力量！✨",
];

type ActionType = "idle" | "bark" | "jump" | "spin" | "hearts" | "excited";

interface Heart {
  id: number;
  x: number;
  delay: number;
}

export default function HuskyPet() {
  const [action, setAction] = useState<ActionType>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [starParticles, setStarParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  const handleClick = useCallback(() => {
    const actions: ActionType[] = ["bark", "jump", "spin", "hearts", "excited"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

    setAction(randomAction);

    if (randomAction === "bark") {
      setMessage(randomMsg);
      setTimeout(() => setMessage(null), 2200);
    } else if (randomAction === "hearts") {
      const newHearts = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        delay: i * 0.12,
      }));
      setHearts(newHearts);
      setTimeout(() => setHearts([]), 2000);
    } else if (randomAction === "spin") {
      const particles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        delay: i * 0.08,
      }));
      setStarParticles(particles);
      setTimeout(() => setStarParticles([]), 1500);
    } else if (randomAction === "jump") {
      setMessage(randomMsg);
      setTimeout(() => setMessage(null), 1500);
    } else if (randomAction === "excited") {
      setMessage(randomMsg);
      setTimeout(() => setMessage(null), 2000);
    }

    const duration = randomAction === "spin" ? 1000 : randomAction === "jump" ? 600 : 800;
    setTimeout(() => setAction("idle"), duration);
  }, []);

  return (
    <>
    <div className="relative flex items-center justify-center" style={{ minHeight: "160px" }}>
      {/* Speech Bubble */}
      {message && (
        <div
          className="absolute z-10 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-md animate-bubble-in text-sm text-slate-700 font-medium whitespace-nowrap"
          style={{ top: "0", left: "50%", transform: "translateX(-50%)" }}
        >
          {message}
          <div
            className="absolute w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"
            style={{ bottom: "-7px", left: "50%", marginLeft: "-6px" }}
          />
        </div>
      )}

      {/* Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-xl pointer-events-none animate-heart-float"
          style={{
            left: `calc(50% + ${h.x}px)`,
            bottom: "50%",
            animationDelay: `${h.delay}s`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Star Particles */}
      {starParticles.map((p) => (
        <div
          key={p.id}
          className="absolute text-lg pointer-events-none animate-star-burst"
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            animationDelay: `${p.delay}s`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Husky Container */}
      <div
        onClick={handleClick}
        className={`cursor-pointer select-none transition-transform duration-150 hover:scale-105 active:scale-95 ${
          action === "jump" ? "animate-husky-jump" : ""
        } ${action === "spin" ? "animate-husky-spin" : ""} ${
          action === "excited" ? "animate-husky-excited" : ""
        }`}
        title="点我点我！"
      >
        <div className={`husky-body ${action === "bark" ? "husky-bark" : ""}`}>
          {/* Left Ear */}
          <div className="husky-ear husky-ear-left">
            <div className="husky-ear-inner" />
          </div>
          {/* Right Ear */}
          <div className="husky-ear husky-ear-right">
            <div className="husky-ear-inner" />
          </div>

          {/* Head */}
          <div className="husky-head">
            {/* Face Marking - center white stripe */}
            <div className="husky-face-stripe" />
            {/* Left eye */}
            <div className="husky-eye husky-eye-left">
              <div className="husky-eye-shine" />
            </div>
            {/* Right eye */}
            <div className="husky-eye husky-eye-right">
              <div className="husky-eye-shine" />
            </div>
            {/* Nose */}
            <div className="husky-nose" />
            {/* Mouth */}
            <div className="husky-mouth" />
            {/* Cheek blush left */}
            <div className="husky-blush husky-blush-left" />
            {/* Cheek blush right */}
            <div className="husky-blush husky-blush-right" />
          </div>

          {/* Body */}
          <div className="husky-torso">
            <div className="husky-chest" />
            {/* Left paw */}
            <div className="husky-paw husky-paw-left" />
            {/* Right paw */}
            <div className="husky-paw husky-paw-right" />
          </div>

          {/* Tail */}
          <div className="husky-tail" />
        </div>
      </div>
    </div>

      <style>{`
        .husky-body {
          position: relative;
          width: 120px;
          height: 140px;
          animation: husky-breathe 3s ease-in-out infinite;
        }

        @keyframes husky-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes husky-breathe-tail {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }

        @keyframes husky-ear-twitch-left {
          0%, 90%, 100% { transform: rotate(-5deg); }
          95% { transform: rotate(-20deg); }
        }

        @keyframes husky-ear-twitch-right {
          0%, 92%, 100% { transform: rotate(5deg); }
          96% { transform: rotate(20deg); }
        }

        @keyframes husky-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        /* Ears */
        .husky-ear {
          position: absolute;
          top: -8px;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 32px solid #6b7280;
          z-index: 1;
        }
        .husky-ear-left {
          left: 18px;
          transform: rotate(-10deg);
          animation: husky-ear-twitch-left 4s ease-in-out infinite;
        }
        .husky-ear-right {
          right: 18px;
          transform: rotate(10deg);
          animation: husky-ear-twitch-right 4.5s ease-in-out infinite;
        }
        .husky-ear-inner {
          position: absolute;
          top: 8px;
          left: -8px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 22px solid #f9a8d4;
        }

        /* Head */
        .husky-head {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 72px;
          background: linear-gradient(180deg, #e5e7eb 0%, #f3f4f6 40%, #ffffff 60%, #ffffff 100%);
          border-radius: 45% 45% 48% 48%;
          z-index: 2;
          overflow: hidden;
        }

        .husky-face-stripe {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 100%;
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%);
          border-radius: 0 0 8px 8px;
          z-index: 1;
        }

        /* Eyes */
        .husky-eye {
          position: absolute;
          top: 22px;
          width: 14px;
          height: 15px;
          background: #60a5fa;
          border-radius: 50%;
          z-index: 3;
          animation: husky-blink 5s ease-in-out infinite;
        }
        .husky-eye-left {
          left: 14px;
        }
        .husky-eye-right {
          right: 14px;
        }
        .husky-eye-shine {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 5px;
          height: 5px;
          background: #ffffff;
          border-radius: 50%;
        }

        /* Nose */
        .husky-nose {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 9px;
          background: #1e293b;
          border-radius: 50%;
          z-index: 3;
        }

        /* Mouth */
        .husky-mouth {
          position: absolute;
          top: 42px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 12px;
          border-bottom: 2.5px solid #64748b;
          border-radius: 0 0 50% 50%;
          z-index: 3;
        }

        /* Blush */
        .husky-blush {
          position: absolute;
          top: 42px;
          width: 14px;
          height: 9px;
          background: rgba(251, 191, 194, 0.5);
          border-radius: 50%;
          z-index: 2;
        }
        .husky-blush-left {
          left: 6px;
        }
        .husky-blush-right {
          right: 6px;
        }

        /* Body / Torso */
        .husky-torso {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: 68px;
          height: 50px;
          background: linear-gradient(180deg, #d1d5db 0%, #e5e7eb 50%, #f3f4f6 100%);
          border-radius: 35% 35% 40% 40%;
          z-index: 1;
        }

        .husky-chest {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 38px;
          height: 28px;
          background: #ffffff;
          border-radius: 30% 30% 50% 50%;
        }

        /* Paws */
        .husky-paw {
          position: absolute;
          bottom: -12px;
          width: 22px;
          height: 18px;
          background: #f3f4f6;
          border-radius: 40% 40% 45% 45%;
          z-index: 0;
        }
        .husky-paw-left {
          left: 8px;
        }
        .husky-paw-right {
          right: 8px;
        }

        /* Tail */
        .husky-tail {
          position: absolute;
          right: -8px;
          top: 50px;
          width: 24px;
          height: 36px;
          background: linear-gradient(180deg, #9ca3af 0%, #d1d5db 40%, #f3f4f6 100%);
          border-radius: 50% 50% 50% 40%;
          transform-origin: bottom center;
          animation: husky-breathe-tail 2.5s ease-in-out infinite;
          z-index: 0;
        }
        .husky-tail::after {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
        }

        /* Bark animation */
        .husky-bark {
          animation: husky-bark-shake 0.3s ease-in-out !important;
        }
        @keyframes husky-bark-shake {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-4px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-2px); }
        }

        /* Jump animation */
        @keyframes husky-jump {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-30px) scale(1.05); }
          50% { transform: translateY(-35px) scale(1.08); }
          70% { transform: translateY(-15px) scale(0.95); }
          85% { transform: translateY(5px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-husky-jump {
          animation: husky-jump 0.6s ease-in-out !important;
        }

        /* Spin animation */
        @keyframes husky-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(360deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-husky-spin {
          animation: husky-spin 0.9s ease-in-out !important;
        }

        /* Excited shake */
        @keyframes husky-excited {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-6px) rotate(-3deg); }
          20% { transform: translateX(6px) rotate(3deg); }
          30% { transform: translateX(-5px) rotate(-2deg); }
          40% { transform: translateX(5px) rotate(2deg); }
          50% { transform: translateX(-3px) rotate(-1deg); }
          60% { transform: translateX(3px) rotate(1deg); }
          70% { transform: translateX(-2px) rotate(0deg); }
          80% { transform: translateX(2px) rotate(0deg); }
          90% { transform: translateX(0) rotate(0deg); }
        }
        .animate-husky-excited {
          animation: husky-excited 0.7s ease-in-out !important;
        }

        /* Bubble in animation */
        @keyframes bubble-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .animate-bubble-in {
          animation: bubble-in 0.3s ease-out;
        }

        /* Heart float */
        @keyframes heart-float {
          0% { opacity: 1; transform: translateY(0) scale(0.5); }
          30% { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-90px) scale(0.6); }
        }
        .animate-heart-float {
          animation: heart-float 1.5s ease-out forwards;
        }

        /* Star burst */
        @keyframes star-burst {
          0% { opacity: 1; transform: translate(0, 0) scale(0); }
          50% { opacity: 1; transform: translate(0, 0) scale(1.2); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.3); }
        }
        .animate-star-burst {
          animation: star-burst 1.2s ease-out forwards;
        }
      `}</style>
  </>
  );
}
