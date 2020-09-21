import usePointerSwipe from "../../src/hooks/usePointerSwipe";
import React, { useRef, useEffect } from "react";

export default function () {
  useEffect(() => {
    if (container.current !== null)
      new usePointerSwipe(container, ".text", (direction) => {
        console.log(direction);
        alert(
          "Swiped " +
            (direction === 0 ? "nowhere" : direction === 1 ? "right" : "left")
        );
        return 0;
      });
  }, []);
  const container = useRef(null);
  return (
    <div
      ref={container}
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100vw",
        marginTop: "100px",
      }}
    >
      <div
        className="text"
        style={{ padding: "20px", borderRadius: 6, backgroundColor: "navy" }}
      >
        <p>Text to swipe right or left</p>
      </div>
    </div>
  );
}
