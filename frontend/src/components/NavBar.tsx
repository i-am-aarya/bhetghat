import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";

const GITHUB_URL = "https://github.com/i-am-aarya/bhetghat";

export default function NavBar() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-2 sm:px-6 sm:pr-20 h-14 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="flex gap-3 items-center">
        <Button
          onClick={() => {
            navigate(-1);
          }}
          variant={"secondary"}
        >
          <ArrowLeftIcon className="size-7 text-muted-foreground" />
        </Button>
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
      </div>

      <ul className="flex items-center gap-1 list-none m-0 p-0">
        {user ? (
          <li>
            <UserMenu />
          </li>
        ) : (
          <>
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
