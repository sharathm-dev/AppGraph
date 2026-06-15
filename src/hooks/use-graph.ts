import { useQuery } from "@tanstack/react-query";
import type { AppGraph } from "@/types";

interface GraphResponse {
  data: AppGraph;
}

async function fetchGraph(appId: string): Promise<AppGraph> {
  const res = await fetch(`/api/apps/${appId}/graph`);
  if (!res.ok) {
    throw new Error(`Failed to fetch graph: ${res.status}`);
  }
  const json = (await res.json()) as GraphResponse;
  return json.data;
}

export function useGraph(appId: string | null) {
  return useQuery({
    queryKey: ["graph", appId],
    queryFn: () => fetchGraph(appId!),
    enabled: !!appId,
    staleTime: 30_000,
    retry: 1,
  });
}
