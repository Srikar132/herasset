declare module "scroll-lock" {
  export function disablePageScroll(target?: Element | null): void;
  export function enablePageScroll(target?: Element | null): void;
  export function getScrollState(): boolean;
  export function clearQueueScrollLocks(): void;
}
