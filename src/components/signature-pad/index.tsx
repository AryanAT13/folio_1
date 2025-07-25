"use client";

import { cn } from "@/lib/utils";
import { unsafe_useEffectOnce } from "@/lib/hooks/use-effect-once";
import { getStroke, type StrokeOptions } from "perfect-freehand";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSvgPathFromStroke } from "./helper";
import { Point } from "./point";

const DPI = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

export type SignaturePadProps = Omit<
  React.HTMLAttributes<HTMLCanvasElement>,
  "onChange"
> & {
  onChange?: (_signatureDataUrl: string | null) => void;
  containerClassName?: string;
  disabled?: boolean;
};

export const SignaturePad = ({
  className,
  containerClassName,
  defaultValue,
  onChange,
  disabled = false,
  ...props
}: SignaturePadProps) => {
  const $el = useRef<HTMLCanvasElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [lines, setLines] = useState<Point[][]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);

  const perfectFreehandOptions = useMemo<StrokeOptions>(() => {
    const size = $el.current
      ? Math.min($el.current.height, $el.current.width) * 0.05
      : 16;
    return {
      size,
      thinning: 0.5,
      streamline: 0.5,
      smoothing: 0.5,
      taper: 0,
      end: { taper: size * 2 },
    };
  }, []);

  const drawLines = (ctx: CanvasRenderingContext2D, linesToDraw: Point[][]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    linesToDraw.forEach((line) => {
      const stroke = getStroke(line, perfectFreehandOptions);
      const pathData = new Path2D(getSvgPathFromStroke(stroke));
      ctx.fill(pathData);
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPressed(true);
    const point = Point.fromEvent(e, DPI, $el.current);
    setCurrentLine([point]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPressed) return;
    const point = Point.fromEvent(e, DPI, $el.current);
    setCurrentLine((prev) => [...prev, point]);

    if ($el.current) {
      const ctx = $el.current.getContext("2d");
      if (ctx) drawLines(ctx, [...lines, [...currentLine, point]]);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    if (currentLine.length > 1) {
      const newLines = [...lines, currentLine];
      setLines(newLines);
      if ($el.current) onChange?.($el.current.toDataURL());
    }
    setCurrentLine([]);
  };

  const onClearClick = () => {
    if ($el.current) {
      const ctx = $el.current.getContext("2d");
      ctx?.clearRect(0, 0, $el.current.width, $el.current.height);
    }
    onChange?.(null);
    setLines([]);
    setCurrentLine([]);
  };

  useEffect(() => {
    if ($el.current) {
      $el.current.width = $el.current.clientWidth * DPI;
      $el.current.height = $el.current.clientHeight * DPI;
    }
  }, []);

  return (
    <div
      className={cn("relative block", containerClassName, {
        "pointer-events-none opacity-50": disabled,
      })}
    >
      <canvas
        ref={$el}
        className={cn("relative block dark:invert", className)}
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} // End line if cursor leaves canvas
        {...props}
      />

      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          type="button"
          className="rounded-full px-3 py-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          onClick={onClearClick}
        >
          Clear
        </button>
      </div>
    </div>
  );
};