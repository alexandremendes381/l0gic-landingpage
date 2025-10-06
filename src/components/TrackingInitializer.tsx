"use client";

import { useUrlTracking } from "@/hooks/useUrlTracking";

export function TrackingInitializer() {
  useUrlTracking();
  return null;
}