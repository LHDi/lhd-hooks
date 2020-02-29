import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import useCamera from "../../src/hooks/useCamera";
import Style from "./css/cameraControle.module.css";
import useLoadingPercentage from "../../src/hooks/useLoadingPercentage";

const Select = ({ children, onChange, value }) => {
  const [valueState, setValueState] = useState(value);
  return (
    <div className={Style.Select}>
      {children.map(child => {
        const { props, key } = child;
        const newProps = Object.assign({}, props);
        newProps.className =
          props.value === valueState
            ? [Style.Option, Style.Selected].join(" ")
            : Style.Option;
        newProps.onClick = () => {
          setValueState(props.value);
          onChange(props.value);
        };
        return (
          <span key={key} {...newProps}>
            {props.children}
          </span>
        );
      })}
    </div>
  );
};

const CameraListControle = ({ cameraList, selectedCameraId, selectCamera }) => {
  if (!cameraList.length) return null;
  return (
    <Select
      className={Style.select}
      value={selectedCameraId}
      onChange={e => selectCamera(e)}
    >
      {cameraList.map(cam => {
        return (
          <option key={cam.deviceId} value={cam.deviceId}>
            {cam.label}
          </option>
        );
      })}
    </Select>
  );
};

const StreamResControle = ({
  constraints,
  selectedConstraint,
  selectConstraint
}) => {
  if (!constraints.length) return null;
  return (
    <Select
      className={Style.select}
      value={constraints.findIndex(e => e.width === selectedConstraint.width)}
      onChange={e => selectConstraint(constraints[e])}
    >
      {constraints.map((res, i) => {
        return (
          <option key={res.label} value={i}>
            {res.label}
          </option>
        );
      })}
    </Select>
  );
};

const CameraControle = ({ streamProps, cameraProps }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={[Style.container, isOpen ? Style.Open : Style.Close].join(" ")}
    >
      <div style={{ display: "inline-block", maxWidth: "100%" }}>
        <CameraListControle {...cameraProps} />
        <StreamResControle {...streamProps} />
      </div>
      <span className={Style.collapse} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg className={Style.svg} viewBox="0 0 20 20">
            <path
              fill="none"
              d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
            ></path>
          </svg>
        ) : (
          <svg className={Style.svg} viewBox="0 0 20 20">
            <path
              fill="none"
              d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"
            ></path>
          </svg>
        )}
      </span>
    </div>
  );
};

const UseCameraExample = () => {
  const [
    stream,
    error,
    changeCamera,
    changeConstraint,
    cameraList,
    constraints,
    selectedCameraId,
    selectedConstraint
  ] = useCamera();
  const monitor = useRef(null);
  useLayoutEffect(() => {
    if (!stream) return;
    monitor.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}
    >
      <CameraControle
        cameraProps={{
          cameraList,
          selectedCameraId,
          selectCamera: changeCamera
        }}
        streamProps={{
          constraints,
          selectedConstraint,
          selectConstraint: changeConstraint
        }}
      />
      <video ref={monitor} autoPlay style={{ position: "absolute" }}></video>
    </div>
  );
};

export default UseCameraExample;
