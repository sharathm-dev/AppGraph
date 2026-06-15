import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: "🏠", label: "Home", active: false },
  { icon: "🔗", label: "Graph", active: true },
  { icon: "📊", label: "Metrics", active: false },
  { icon: "🔒", label: "Security", active: false },
  { icon: "☁️", label: "Cloud", active: false },
  { icon: "🗄️", label: "Database", active: false },
];

export function LeftRail() {
  return (
    <aside className="w-12 border-r border-border bg-[oklch(0.11_0.005_270)] flex flex-col items-center py-3 gap-1 shrink-0 z-10">
      {navItems.map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-150 ${
              item.active
                ? "bg-purple-500/20 text-purple-400 shadow-sm shadow-purple-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            aria-label={item.label}
            id={`nav-${item.label.toLowerCase()}`}
          >
            {item.icon}
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ))}
    </aside>
  );
}
