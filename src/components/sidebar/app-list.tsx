import { useState, useMemo } from "react";
import { useApps } from "@/hooks/use-apps";
import { useAppStore } from "@/store/app-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AppList() {
  const { data: apps, isLoading, isError, refetch } = useApps();
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!apps) return [];
    if (!search.trim()) return apps;
    return apps.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [apps, search]);

  if (isLoading) {
    return (
      <div className="p-3 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-400 mb-2">Failed to load apps</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          className="text-xs"
          id="retry-apps-btn"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-foreground mb-2">Application</h3>
        <div className="flex gap-1.5">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs bg-[oklch(0.16_0.005_270)] border-border"
            id="app-search-input"
          />
          <Button
            size="sm"
            className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 shrink-0"
            id="add-app-btn"
          >
            +
          </Button>
        </div>
      </div>

      {/* App list */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-2">
        {filtered.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group ${
              selectedAppId === app.id
                ? "bg-purple-500/15 text-purple-300"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            id={`app-item-${app.id}`}
          >
            <span className="text-base shrink-0">{app.icon}</span>
            <span className="text-sm font-medium truncate flex-1">{app.name}</span>
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">›</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No apps found</p>
        )}
      </div>
    </div>
  );
}
