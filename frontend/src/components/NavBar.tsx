import { useAuthStore } from "@/stores/authStore";
import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/i-am-aarya/bhetghat";

export default function NavBar() {
  // const { user } = useAuth();
  const user = useAuthStore((s) => s.user);


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-white/90 backdrop-blur-md border-b border-border">
      <Link
        to="/"
        className="flex items-center gap-2 font-head font-bold text-[1.05rem] tracking-tight text-foreground no-underline"
      >
        <span className="relative flex size-2 items-center justify-center">
        <span className="absolute size-2 rounded-full bg-primary animate-ping" />
        <span className="size-2 rounded-full bg-primary" />
        </span>
        bhetghat
      </Link>

      <ul className="flex items-center gap-1 list-none m-0 p-0">
        <li>
          <a
            href="#how"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md no-underline"
          >
            How it works
          </a>
        </li>
        <li>
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md no-underline"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md no-underline"
          >
            GitHub
          </a>
        </li>

        {user ? (
          <li>
            <Link
              to="/lobby"
              className="text-sm font-medium text-primary-foreground bg-primary hover:opacity-85 transition-opacity px-4 py-1.5 rounded-md no-underline"
            >
              Go to lobby
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md no-underline"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="text-sm font-medium text-primary-foreground bg-primary hover:opacity-85 transition-opacity px-4 py-1.5 rounded-md no-underline"
              >
                Get started
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
