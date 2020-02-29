import React from "react";
import usePortal from "../../src/hooks/usePortal";

const UsePortalExample = () => {
  const { setPortal, setTrigger } = usePortal();
  return (
    <React.Fragment>
      <span
        style={{
          padding: "10px",
          fontSize: "1.3em",
          background: "#fa8",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer"
        }}
        ref={setTrigger}
      >
        OPEN
      </span>
      <div
        style={{
          width: "50vw",
          padding: "30vh",
          background: "#af6",
          textAlign: "center"
        }}
        ref={setPortal}
      >
        usePortal();
      </div>
    </React.Fragment>
  );
};

export default UsePortalExample;
