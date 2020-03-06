import React, { useRef } from "react";
import { useScrollAnimation } from "../../src";

const UseScrollAnimationExample = () => {
  const slider = useRef(null);
  const [, scrollTo] = useScrollAnimation(slider);
  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={slider}>
      <button style={{position:'absolute'}} onClick={() => scrollTo(2)}>scroll to 3</button>
      <div style={{ height: "100vh", background: "#e0f" }}>1</div>
      <div style={{ height: "100vh", background: "#fae" }}>2</div>
      <div style={{ height: "100vh", background: "#0ee" }}>3</div>
    </div>
  );
};

export default UseScrollAnimationExample;
