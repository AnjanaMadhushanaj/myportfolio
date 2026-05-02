"use client";

import { useState, useEffect } from "react";

export default function PageContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
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
