import { useState, useEffect, useCallback, useReducer } from "react";
require("webrtc-adapter");

const resList = [
  [640, 480, "480p - 4:3"],
  [1280, 720, "720p - 16:9"],
  [1920, 1080, "1080p - 16:9"]
];

const getConstraints = ({ height, width }) => {
  const filtredRes = resList.filter(
    res =>
      res[0] >= width.min &&
      res[0] <= width.max &&
      res[1] >= height.min &&
      res[1] <= height.max
  );
  return filtredRes.map(res => ({
    label: res[2],
    width: res[0],
    height: res[1]
  }));
};

function hasGetUserMedia() {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}

const cameraReducer = (
  { cameraList, selectedCameraId },
  { type, id, list }
) => {
  switch (type) {
    case "SET_LIST":
      return { cameraList: list, selectedCameraId: list[0].deviceId };
    case "SELECT":
      return { cameraList: [...cameraList], selectedCameraId: id };
    default:
      return { cameraList: [...cameraList], selectedCameraId };
  }
};

const streamReducer = (
  { stream, constraints, permitted, selectedConstraint },
  { type, newstream, newConstraints, newSelectedConstraint }
) => {
  switch (type) {
    case "SET_STREAM":
      return {
        stream: newstream,
        permitted: true,
        constraints: newConstraints,
        selectedConstraint: newSelectedConstraint
      };
    case "SET_STREAM_CONS":
      stream
        .getVideoTracks()[0]
        .applyConstraints(Object.assign({}, newSelectedConstraint));
      return {
        stream,
        permitted,
        constraints,
        selectedConstraint: newSelectedConstraint
      };
    case "RESET_STREAM":
      return {
        stream: null,
        permitted: false,
        constraints: [],
        selectedConstraint: null
      };
    default:
      return { stream, permitted, constraints, selectedConstraint };
  }
};

const useCamera = () => {
  const [
    { selectedCameraId, cameraList },
    dispatchCamera
  ] = useReducer(cameraReducer, { cameraList: [], selectedCameraId: null });
  const [
    { stream, permitted, constraints, selectedConstraint },
    dispatchStream
  ] = useReducer(streamReducer, {
    stream: null,
    permitted: false,
    constraints: [],
    selectedConstraint: null
  });
  const [error, setError] = useState(null);

  const changeCamera = useCallback(id => {
    dispatchCamera({ type: "SELECT", id });
  }, []);

  const changeConstraint = useCallback(newSelectedConstraint => {
    dispatchStream({ type: "SET_STREAM_CONS", newSelectedConstraint });
  });

  const reset = useCallback(() => {
    setError(null);
    if (stream) stream.getTracks().forEach(t => t.stop());
  }, [stream]);

  useEffect(() => {
    const getCameraList = async () => {
      if (
        "mediaDevices" in navigator &&
        "enumerateDevices" in navigator.mediaDevices
      ) {
        try {
          const list = await navigator.mediaDevices.enumerateDevices();
          let camList = [];
          list.forEach(dev => {
            if (dev.kind === "videoinput") {
              const camObject = { label: dev.label, deviceId: dev.deviceId };
              camList.push(camObject);
            }
          });

          dispatchCamera({ type: "SET_LIST", list: camList });
        } catch (error) {
          setError(error);
        }
      }
    };
    getCameraList();
    return reset;
  }, [permitted]);

  useEffect(() => {
    reset();
    const SelectedCamera =
      !!cameraList.length && selectedCameraId ? selectedCameraId : undefined;

    if (!SelectedCamera) return;
    const getCameraPermission = async () => {
      if (hasGetUserMedia() && !!SelectedCamera) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: {
                exact: SelectedCamera
              }
            }
          });
          const constraints = !!stream.getTracks()[0].getCapabilities
            ? getConstraints(stream.getTracks()[0].getCapabilities())
            : [];
          const defaultConstraints = !!stream.getTracks()[0].getSettings
            ? stream.getTracks()[0].getSettings()
            : null;
          dispatchStream({
            type: "SET_STREAM",
            newstream: stream,
            newConstraints: constraints,
            newSelectedConstraint: defaultConstraints
          });
        } catch (error) {
          setError(error);
        }
      } else {
        return setError(new Error("No camera device was found!"));
      }
    };
    getCameraPermission();
    return reset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCameraId, cameraList.length]);

  return [
    stream,
    error,
    changeCamera,
    changeConstraint,
    cameraList,
    constraints,
    selectedCameraId,
    selectedConstraint
  ];
};

export default useCamera;
