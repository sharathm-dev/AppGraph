import { useQuery } from "@tanstack/react-query";
import type { AppInfo } from "@/types";

interface AppsResponse {
  data: AppInfo[];
}

async function fetchApps(): Promise<AppInfo[]> {
  const res = await fetch("/api/apps");
  if (!res.ok) {
    throw new Error(`Failed to fetch apps: ${res.status}`);
  }
  const json = (await res.json()) as AppsResponse;
  return json.data;
}

export function useApps() {
  return useQuery({
    queryKey: ["apps"],
    queryFn: fetchApps,
    staleTime: 60_000,
    retry: 1,
  });
}
