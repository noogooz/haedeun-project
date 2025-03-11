import React, { useEffect } from "react";

export default function MouseTrail() {
  useEffect(() => {
    const trail = document.createElement("div");
    trail.className = "mouse-trail";
    document.body.appendChild(trail);

    const moveTrail = (e) => {
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveTrail);

    return () => {
      document.removeEventListener("mousemove", moveTrail);
      document.body.removeChild(trail);
    };
  }, []);

  return null;
}
