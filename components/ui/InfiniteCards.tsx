"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    translation?: string;
    name: string;
    title: string;
    image?: string;
    instagram?: string; // 🔗 new field for Instagram link
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[90vw] max-w-full relative rounded-2xl border border-b-0 border-slate-800 p-5 md:p-16 md:w-[60vw]"
            style={{
              background:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
          >
            <blockquote>
              {/* Original quote */}
              <span className="relative z-20 block text-sm md:text-lg leading-[1.6] text-white font-normal">
                {item.quote}
              </span>

              {/* Translation if available */}
              {item?.translation && (
                <span className="relative z-20 block mt-2 text-sm md:text-base leading-[1.6] text-slate-300 italic">
                  Translated: {item.translation}
                </span>
              )}

              {/* Author info */}
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <div className="me-3">
                  <img
                    src={item.image ?
                      `/photos/${item.image}`
                      : "/profile.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <span className="flex flex-col gap-1">
                  {item.instagram ? (
                    <a
                      href={item.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold leading-[1.6] text-white underline hover:text-emerald-400 transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-xl font-bold leading-[1.6] text-white">
                      {item.name}
                    </span>
                  )}
                  <span className="text-sm leading-[1.6] text-slate-200 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
