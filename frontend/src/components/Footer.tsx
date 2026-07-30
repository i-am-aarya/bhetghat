import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/i-am-aarya/bhetghat";

export default function Footer() {

  return (
    <>
      <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="font-head font-bold text-[1.45rem] tracking-tight text-foreground mb-2">
                  Open source and self-hostable.
                </h2>
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed max-w-md">
                  Bhetghat is MIT licensed. Run it on your own infrastructure, audit
                  the code, fork it, build on top of it. Deploy with{" "}
                  <code className="font-mono text-[0.8em] text-primary bg-primary/[0.08] px-1.5 py-0.5 rounded">
                    docker compose up
                  </code>{" "}
                  and you're running in minutes.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-foreground/70 hover:text-foreground border border-border hover:border-foreground/30 transition-all px-4 py-2 rounded-lg no-underline"
                >
                  View on GitHub
                </a>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-primary-foreground bg-primary hover:opacity-85 transition-opacity px-4 py-2 rounded-lg no-underline"
                >
                  Try it now
                </Link>
              </div>
            </div>
          </section>

    <footer className="border-t border-border px-6 py-5 flex items-center justify-between">
      <span className="font-head font-bold text-[0.9rem] tracking-tight text-muted-foreground">
        bhetghat
      </span>
      <span className="font-mono text-[0.7rem] text-muted-foreground">
        built with Go + React · MIT license
      </span>
    </footer>
    </>
  );
}
