import { ReactNode } from "react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Server, GitBranch, FileCode, FlaskConical, Layers } from "lucide-react";

const navItems = [
  { title: "Services", url: "/", icon: Server },
  { title: "Stub Mapping", url: "/stubs", icon: Layers },
  { title: "Rule Editor", url: "/rules", icon: FileCode },
  { title: "Rule Flow", url: "/flow", icon: GitBranch },
  { title: "Testing", url: "/testing", icon: FlaskConical },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3 mr-8">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <Server className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">VirtSvc Studio</span>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              activeClassName="bg-secondary text-foreground font-medium"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
