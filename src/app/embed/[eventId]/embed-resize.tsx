"use client";

import { useEffect } from "react";

export function EmbedResize() {
  useEffect(() => {
    function sendHeight() {
      if (typeof window === "undefined" || window === window.parent) return;
      const root = document.getElementById("embed-root");
      const height = root ? root.scrollHeight + 32 : document.body.scrollHeight;
      window.parent.postMessage(
        { type: "hubstream-embed-resize", height },
        "*"
      );
    }

    sendHeight();
    const t = setTimeout(sendHeight, 100);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(sendHeight);
    });
    const root = document.getElementById("embed-root");
    if (root) observer.observe(root);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return null;
}
