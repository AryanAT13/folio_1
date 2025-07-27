import type { EffectCallback } from "react";
import { useEffect } from "react";

// RENAMED to start with "use"
export const useUnsafeEffectOnce = (callback: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
};