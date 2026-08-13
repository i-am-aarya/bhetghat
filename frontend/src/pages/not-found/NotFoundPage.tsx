import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

function NotFoundPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-background">
      {/* same grid + radial fade as the hero */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(hsl(0 0% 91%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 91%) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.5 }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, white 100%)" }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <div className="w-11 h-11 rounded-[10px] bg-primary/8 border border-primary/20 flex items-center justify-center mb-8">
          <Compass size={18} className="stroke-primary" strokeWidth={1.8} />
        </div>

        <p className="font-mono text-[0.7rem] tracking-wider text-primary uppercase mb-4">
          Room code · 404
        </p>

        {/* code-styled 404, matching the invite-code look */}
        <p className="font-mono text-[5rem] leading-none font-medium text-primary tracking-[0.28em] mb-8">
          404
        </p>

        <h1 className="font-head font-bold tracking-tight text-foreground text-2xl mb-3">
          Nobody's here
        </h1>
        <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-10">
          This code doesn't match any room. It may have expired, or you
          wandered past the edge of the map.
        </p>

        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 font-medium text-[0.9rem] text-primary-foreground bg-primary hover:opacity-85 active:scale-[0.98] transition-all px-5 py-2.5 rounded-lg no-underline">
            Back to home
          </Link>
          {user && (
            <Link to="/lobby" className="inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-foreground/70 hover:text-foreground border border-border hover:border-foreground/30 transition-all px-5 py-2.5 rounded-lg no-underline">
              Your rooms
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
