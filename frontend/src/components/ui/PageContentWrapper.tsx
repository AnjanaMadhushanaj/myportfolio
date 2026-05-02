"use client";

import { useState, useEffect } from "react";

export default function PageContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsVisible(true);
    };

    window.addEventListener("preloaderComplete", handleComplete);
    return () => window.removeEventListener("preloaderComplete", handleComplete);
  }, []);

  return (
    <div
      className={`transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 select-none pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
