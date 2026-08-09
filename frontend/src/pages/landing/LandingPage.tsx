import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Video,
  MessageSquare,
  Clock,
  Lock,
  Server,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import OssStrip from "@/components/OssStrip";
// import useAuth from "@/hooks/useAuth";

// ─── GitHub mark ──────────────────────────────────────────────────────────────
// lucide-react no longer ships brand/logo icons, so this is inlined once and
// reused everywhere the GitHub link appears.

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const GITHUB_URL = "https://github.com/i-am-aarya/bhetghat";

// ─── Proximity canvas animation ───────────────────────────────────────────────

function ProximityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;
    const CRIMSON = "#d91656";
    const WHITE_DOT = "rgba(15,15,15,0.7)";
    const ORBIT_R = 38;
    const PROXIMITY = 52;

    const dots = [
      { angle: 0, speed: 0.008 },
      { angle: Math.PI, speed: 0.011 },
    ];

    let rafId: number;

    function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
      return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      dots.forEach((d) => {
        d.angle += d.speed;
      });

      const positions = dots.map((d) => ({
        x: CX + Math.cos(d.angle) * ORBIT_R,
        y: CY + Math.sin(d.angle) * ORBIT_R,
      }));

      const d = dist(positions[0], positions[1]);
      const near = d < PROXIMITY;
      const proximity = Math.max(0, 1 - d / PROXIMITY);

      // Orbit ring
      ctx!.beginPath();
      ctx!.arc(CX, CY, ORBIT_R + 14, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(0,0,0,0.06)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Glow when near
      if (near) {
        const grd = ctx!.createRadialGradient(CX, CY, 0, CX, CY, PROXIMITY);
        grd.addColorStop(0, `rgba(217,22,86,${0.08 * proximity})`);
        grd.addColorStop(1, "rgba(217,22,86,0)");
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(CX, CY, PROXIMITY, 0, Math.PI * 2);
        ctx!.fill();

        // Connecting line
        ctx!.beginPath();
        ctx!.moveTo(positions[0].x, positions[0].y);
        ctx!.lineTo(positions[1].x, positions[1].y);
        ctx!.strokeStyle = `rgba(217,22,86,${0.45 * proximity})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }

      // Dots
      positions.forEach((p) => {
        if (near) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 5 + 3 * proximity, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(217,22,86,${0.12 * proximity})`;
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx!.fillStyle = near ? CRIMSON : WHITE_DOT;
        ctx!.fill();
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={180}
      aria-hidden="true"
      className="block rounded-full"
    />
  );
}

// ─── Proximity pill ────────────────────────────────────────────────────────────

function ProximityPill() {
  return (
    <div className="relative inline-block mb-8">
      <div className="inline-flex items-center gap-2.5 bg-background border border-border rounded-full px-3 py-2 pr-4 shadow-sm">
        {/* Avatars */}
        <div className="flex">
          {[
            { initials: "A", bg: "bg-primary" },
            { initials: "B", bg: "bg-blue-500" },
            { initials: "C", bg: "bg-emerald-600" },
          ].map((a, i) => (
            <div
              key={i}
              className={`
                w-6 h-6 rounded-full border-2 border-white flex items-center
                justify-center text-white text-[0.55rem] font-semibold
                font-head
                ${a.bg} ${i !== 0 ? "-ml-1.5" : ""}
              `}
            >
              {a.initials}
            </div>
          ))}
        </div>
        <span className="font-mono text-[0.7rem] text-foreground/70">
          <span className="text-primary font-medium">3 players</span> in
          proximity — call started
        </span>
      </div>
      {/* Pulse dot */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-ping" />
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
    </div>
  );
}
// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 91%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 91%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.5,
        }}
      />
      {/* Radial fade over grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, white 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Animated canvas */}
        <div className="mb-10">
          <ProximityCanvas />
        </div>

        {/* Proximity pill */}
        <ProximityPill />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-wider text-primary bg-primary/[0.08] border border-primary/20 rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Proximity-based collaboration
        </div>

        {/* Headline */}
        <h1
          className="font-head font-bold leading-[1.08] tracking-tighter text-foreground mb-5"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 4.5rem)" }}
        >
          Walk around.
          <br />
          Talk when you're{" "}
          <em className="not-italic text-primary">close enough.</em>
        </h1>

        {/* Sub */}
        <p className="text-[1.05rem] text-muted-foreground max-w-md leading-relaxed mb-8">
          A 2D virtual space where video calls start the moment you walk near
          someone. No buttons, no invites. Just proximity.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-5">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 font-medium text-[0.9rem] text-primary-foreground bg-primary hover:opacity-85 active:scale-[0.98] transition-all px-5 py-2.5 rounded-lg no-underline"
          >
            Create a room
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-foreground/70 hover:text-foreground border border-border hover:border-foreground/30 transition-all px-5 py-2.5 rounded-lg no-underline"
          >
            View source
          </a>
        </div>

        <p className="font-mono text-[0.7rem] text-muted-foreground/60 tracking-wide">
          Open source · Self-hostable · No credit card
        </p>
      </div>
    </section>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    icon: (
      <svg
        className="w-[18px] h-[18px] stroke-primary fill-none"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    title: "Create a room",
    desc: "One click generates a private 6-character code. Share it with whoever belongs in the space.",
  },
  {
    num: "02",
    icon: (
      <svg
        className="w-[18px] h-[18px] stroke-primary fill-none"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: "Pick your character",
    desc: "Choose an avatar and step into the 2D world. Your team joins with the same code.",
  },
  {
    num: "03",
    icon: (
      <svg
        className="w-[18px] h-[18px] stroke-primary fill-none"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14" />
        <rect x="3" y="7" width="12" height="10" rx="2" />
      </svg>
    ),
    title: "Walk and talk",
    desc: "Step within range of someone and a call opens automatically. Walk away and it closes. That's it.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-muted/40 border-y border-border py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[0.7rem] tracking-wider text-primary uppercase mb-3">
          How it works
        </p>
        <h2
          className="font-head font-bold tracking-tight text-foreground mb-14"
          style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)" }}
        >
          Three steps. Then you're there.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STEPS.map((s) => (
            <div key={s.num} className="flex flex-col gap-3.5">
              <span className="font-mono text-[0.68rem] tracking-widest text-primary">
                {s.num}
              </span>
              <div className="w-10 h-10 rounded-[10px] bg-primary/[0.08] border border-primary/20 flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="font-head font-semibold text-[0.95rem] tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Video size={16} className="stroke-primary" strokeWidth={1.8} />,
    title: "Proximity video",
    desc: "Calls start when you enter range. No button, no dialog. The space handles it.",
  },
  {
    icon: (
      <MessageSquare size={16} className="stroke-primary" strokeWidth={1.8} />
    ),
    title: "Room chat",
    desc: "A shared text channel for everyone. Good for links and announcements that don't need a call.",
  },
  {
    icon: <Clock size={16} className="stroke-primary" strokeWidth={1.8} />,
    title: "Event scheduler",
    desc: "Set a timer and everyone in the room gets notified when it fires. Great for standups.",
  },
  {
    icon: <Lock size={16} className="stroke-primary" strokeWidth={1.8} />,
    title: "Private rooms",
    desc: "No public list. No strangers. A 6-character code is all that gets someone in.",
  },
  {
    icon: <Server size={16} className="stroke-primary" strokeWidth={1.8} />,
    title: "Self-hostable",
    desc: "MIT licensed. Run it on your own server. One command and you're running.",
  },
  {
    icon: <Zap size={16} className="stroke-primary" strokeWidth={1.8} />,
    title: "Built for speed",
    desc: "Go backend with goroutine-per-client architecture. Hundreds of concurrent connections handled cleanly.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[0.7rem] tracking-wider text-primary uppercase mb-3">
          Features
        </p>
        <h2
          className="font-head font-bold tracking-tight text-foreground mb-12"
          style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)" }}
        >
          Everything a virtual space needs.
          <br />
          Nothing it doesn't.
        </h2>

        {/* Grid — 1px gap technique using parent bg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-background hover:bg-muted/40 transition-colors p-7"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/[0.08] border border-primary/20 flex items-center justify-center mb-3.5">
                {f.icon}
              </div>
              <h3 className="font-head font-semibold text-[0.9rem] tracking-tight text-foreground mb-1.5">
                {f.title}
              </h3>
              <p className="text-[0.84rem] text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Room code section ────────────────────────────────────────────────────────

function RoomCodeSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("a3f9b2");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-muted/40 border-y border-border py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Text */}
        <div>
          <p className="font-mono text-[0.7rem] tracking-wider text-primary uppercase mb-3">
            Invite-only
          </p>
          <h2
            className="font-head font-bold tracking-tight text-foreground mb-4"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)" }}
          >
            A code. A room.
            <br />
            Your people.
          </h2>
          <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-3">
            Create a room and you get a unique code. Send it in Slack, drop it
            in a group chat, paste it anywhere. Whoever has it can join. Nobody
            else can.
          </p>
          <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
            Rooms are private by design. No discovery, no public list, no random
            strangers walking in.
          </p>
        </div>

        {/* Card */}
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase mb-2">
            Room code
          </p>
          <p className="font-mono text-[2.1rem] font-medium text-primary tracking-[0.28em] mb-5">
            a3f9b2
          </p>

          <div className="h-px bg-border mb-5" />

          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[0.78rem] text-muted-foreground">
              3 players online
            </span>
            <span className="font-mono text-[0.68rem] text-primary bg-primary/[0.08] border border-primary/20 px-2 py-0.5 rounded">
              active
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 text-[0.85rem] font-medium text-foreground/70 hover:text-foreground bg-muted/60 hover:bg-muted border border-border hover:border-foreground/20 transition-all py-2.5 rounded-lg cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="stroke-primary" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy invite code
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <Features />
      <RoomCodeSection />
      <OssStrip/>
    </div>
  );
}

export default LandingPage;
