import { useState, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ANIMATION_SRC =
  "https://assets-v2.lottiefiles.com/a/1ae6a4ce-ab48-4d73-bf3c-1822291d84c4/tLDveTkAUG.lottie";

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
  const [starParticles, setStarParticles] = useState<
    { id: number; x: number; y: number; delay: number }[]
  >([]);

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

    const duration =
      randomAction === "spin" ? 1000 : randomAction === "jump" ? 600 : 800;
    setTimeout(() => setAction("idle"), duration);
  }, []);

  const getContainerClass = () => {
    switch (action) {
      case "jump":
        return "animate-pet-jump";
      case "spin":
        return "animate-pet-spin";
      case "excited":
        return "animate-pet-excited";
      case "bark":
        return "animate-pet-bark";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className="relative flex items-center justify-center"
        style={{ minHeight: "160px" }}
      >
        {/* Speech Bubble */}
        {message && (
          <div
            className="absolute z-10 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-md animate-bubble-in text-sm text-slate-700 font-medium whitespace-nowrap"
            style={{
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {message}
            <div
              className="absolute w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"
              style={{
                bottom: "-7px",
                left: "50%",
                marginLeft: "-6px",
              }}
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

        {/* Pet Container */}
        <div
          onClick={handleClick}
          className={`cursor-pointer select-none transition-transform duration-150 hover:scale-105 active:scale-95 ${getContainerClass()}`}
          title="点我点我！"
        >
          <DotLottieReact
            src={ANIMATION_SRC}
            loop
            autoplay
            speed={action === "jump" ? 1.5 : 1}
            style={{ width: "140px", height: "140px" }}
          />
        </div>
      </div>

      <style>{`
        /* Bark shake */
        @keyframes pet-bark-shake {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-4px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-2px); }
        }
        .animate-pet-bark {
          animation: pet-bark-shake 0.3s ease-in-out;
        }

        /* Jump */
        @keyframes pet-jump {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-30px) scale(1.05); }
          50% { transform: translateY(-35px) scale(1.08); }
          70% { transform: translateY(-15px) scale(0.95); }
          85% { transform: translateY(5px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-pet-jump {
          animation: pet-jump 0.6s ease-in-out;
        }

        /* Spin */
        @keyframes pet-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(360deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-pet-spin {
          animation: pet-spin 0.9s ease-in-out;
        }

        /* Excited shake */
        @keyframes pet-excited {
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
        .animate-pet-excited {
          animation: pet-excited 0.7s ease-in-out;
        }

        /* Bubble in */
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
