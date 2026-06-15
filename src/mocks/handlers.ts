import { http, HttpResponse, delay } from "msw";
import { getMockApps, getMockGraph } from "./data";

const SHOULD_ERROR_RANDOMLY = false;
const ERROR_RATE = 0.1;

function maybeError(): boolean {
  return SHOULD_ERROR_RANDOMLY && Math.random() < ERROR_RATE;
}

export const handlers = [
  http.get("/api/apps", async () => {
    await delay(300);
    if (maybeError()) {
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    return HttpResponse.json({ data: getMockApps() });
  }),

  http.get("/api/apps/:appId/graph", async ({ params }) => {
    await delay(500);
    if (maybeError()) {
      return HttpResponse.json(
        { error: "Failed to fetch graph" },
        { status: 500 }
      );
    }
    const appId = params.appId as string;
    const graph = getMockGraph(appId);
    if (!graph) {
      return HttpResponse.json({ error: "App not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: graph });
  }),
];
