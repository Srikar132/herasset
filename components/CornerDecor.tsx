import React, { forwardRef } from "react";
import Image from "next/image";

type Corner = "top-right" | "bottom-left" | "top-left" | "bottom-right";

interface CornerDecorProps {
  corner: Corner;
  zIndex?: number;
  /** Initial opacity — pass 0 when GSAP will animate it in */
  initialOpacity?: number;
  className?: string;
}

const rotationMap: Record<Corner, string> = {
  "top-right":    "",
  "bottom-left":  "-rotate-180",
  "top-left":     "-rotate-90",
  "bottom-right": "rotate-90",
};

const positionMap: Record<Corner, string> = {
  "top-right":    "absolute top-0 right-0",
  "bottom-left":  "absolute bottom-0 left-0",
  "top-left":     "absolute top-0 left-0",
  "bottom-right": "absolute bottom-0 right-0",
};

const CornerDecor = forwardRef<HTMLDivElement, CornerDecorProps>(
  ({ corner, zIndex = 3, initialOpacity = 1, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`${positionMap[corner]} pointer-events-none select-none ${className}`}
        style={{ zIndex, opacity: initialOpacity }}
      >
        <Image
          src="/corner-top-right.png"
          alt="Corner Decoration"
          width={500}
          height={500}
          className={`w-52 h-52 md:w-72 md:h-72 lg:w-96 lg:h-96 xl:w-125 xl:h-125 ${rotationMap[corner]}`}
          priority
        />
      </div>
    );
  }
);

CornerDecor.displayName = "CornerDecor";

export default CornerDecor;
