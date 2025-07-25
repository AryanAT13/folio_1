import type { EffectCallback } from "react";
import { useEffect } from "react";

/**
 * Dangerously runs an effect "once" by ignoring the depedencies of a given effect.
 * DANGER: The effect will run twice in concurrent react and development environments.
 */
export const unsafe_useEffectOnce = (callback: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
};