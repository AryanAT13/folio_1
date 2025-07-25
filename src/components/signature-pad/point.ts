import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from "react";

const isTouchEvent = (
  event: any,
): event is TouchEvent | ReactTouchEvent => {
  return "touches" in event;
};

export class Point {
  public x: number;
  public y: number;
  public pressure: number;
  public timestamp: number;

  constructor(x: number, y: number, pressure?: number, timestamp?: number) {
    this.x = x;
    this.y = y;
    this.pressure = pressure ?? 0.5;
    this.timestamp = timestamp ?? Date.now();
  }

  public distanceTo(point: Point): number {
    return Math.sqrt(
      Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2),
    );
  }

  public static fromEvent(
    event:
      | ReactMouseEvent
      | ReactPointerEvent
      | ReactTouchEvent
      | MouseEvent
      | PointerEvent
      | TouchEvent,
    dpi = 1,
    el?: HTMLElement | null,
  ): Point {
    const target = el ?? event.target;

    if (!(target instanceof HTMLElement)) {
      throw new Error("Event target is not an HTMLElement.");
    }

    const { top, left } = target.getBoundingClientRect();

    let clientX, clientY, pressure;

    if (isTouchEvent(event)) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
      pressure = 0.5; // Default pressure for touch events
    } else {
      clientX = (event as PointerEvent).clientX;
      clientY = (event as PointerEvent).clientY;
      pressure = (event as PointerEvent).pressure;
    }

    const x = (clientX - left) * dpi;
    const y = (clientY - top) * dpi;

    return new Point(x, y, pressure);
  }
}