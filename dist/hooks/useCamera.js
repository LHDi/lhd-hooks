"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    }
  };
})();

var _react = require("react");

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step("next", value);
            },
            function(err) {
              step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

require("webrtc-adapter");

var resList = [
  [640, 480, "480p - 4:3"],
  [1280, 720, "720p - 16:9"],
  [1920, 1080, "1080p - 16:9"]
];

var getConstraints = function getConstraints(_ref) {
  var height = _ref.height,
    width = _ref.width;

  var filtredRes = resList.filter(function(res) {
    return (
      res[0] >= width.min &&
      res[0] <= width.max &&
      res[1] >= height.min &&
      res[1] <= height.max
    );
  });
  return filtredRes.map(function(res) {
    return {
      label: res[2],
      width: res[0],
      height: res[1]
    };
  });
};

function hasGetUserMedia() {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}

var cameraReducer = function cameraReducer(_ref2, _ref3) {
  var cameraList = _ref2.cameraList,
    selectedCameraId = _ref2.selectedCameraId;
  var type = _ref3.type,
    id = _ref3.id,
    list = _ref3.list;

  switch (type) {
    case "SET_LIST":
      return { cameraList: list, selectedCameraId: list[0].deviceId };
    case "SELECT":
      return {
        cameraList: [].concat(_toConsumableArray(cameraList)),
        selectedCameraId: id
      };
    default:
      return {
        cameraList: [].concat(_toConsumableArray(cameraList)),
        selectedCameraId: selectedCameraId
      };
  }
};

var streamReducer = function streamReducer(_ref4, _ref5) {
  var stream = _ref4.stream,
    constraints = _ref4.constraints,
    permitted = _ref4.permitted,
    selectedConstraint = _ref4.selectedConstraint;
  var type = _ref5.type,
    newstream = _ref5.newstream,
    newConstraints = _ref5.newConstraints,
    newSelectedConstraint = _ref5.newSelectedConstraint;

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
        stream: stream,
        permitted: permitted,
        constraints: constraints,
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
      return {
        stream: stream,
        permitted: permitted,
        constraints: constraints,
        selectedConstraint: selectedConstraint
      };
  }
};

var useCamera = function useCamera() {
  var _useReducer = (0, _react.useReducer)(cameraReducer, {
      cameraList: [],
      selectedCameraId: null
    }),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    _useReducer2$ = _useReducer2[0],
    selectedCameraId = _useReducer2$.selectedCameraId,
    cameraList = _useReducer2$.cameraList,
    dispatchCamera = _useReducer2[1];

  var _useReducer3 = (0, _react.useReducer)(streamReducer, {
      stream: null,
      permitted: false,
      constraints: [],
      selectedConstraint: null
    }),
    _useReducer4 = _slicedToArray(_useReducer3, 2),
    _useReducer4$ = _useReducer4[0],
    stream = _useReducer4$.stream,
    permitted = _useReducer4$.permitted,
    constraints = _useReducer4$.constraints,
    selectedConstraint = _useReducer4$.selectedConstraint,
    dispatchStream = _useReducer4[1];

  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];

  var changeCamera = (0, _react.useCallback)(function(id) {
    dispatchCamera({ type: "SELECT", id: id });
  }, []);

  var changeConstraint = (0, _react.useCallback)(function(
    newSelectedConstraint
  ) {
    dispatchStream({
      type: "SET_STREAM_CONS",
      newSelectedConstraint: newSelectedConstraint
    });
  });

  var reset = (0, _react.useCallback)(
    function() {
      setError(null);
      if (stream)
        stream.getTracks().forEach(function(t) {
          return t.stop();
        });
    },
    [stream]
  );

  (0, _react.useEffect)(
    function() {
      var getCameraList = (function() {
        var _ref6 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var list, camList;
            return regeneratorRuntime.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      if (
                        !(
                          "mediaDevices" in navigator &&
                          "enumerateDevices" in navigator.mediaDevices
                        )
                      ) {
                        _context.next = 13;
                        break;
                      }

                      _context.prev = 1;
                      _context.next = 4;
                      return navigator.mediaDevices.enumerateDevices();

                    case 4:
                      list = _context.sent;
                      camList = [];

                      list.forEach(function(dev) {
                        if (dev.kind === "videoinput") {
                          var camObject = {
                            label: dev.label,
                            deviceId: dev.deviceId
                          };
                          camList.push(camObject);
                        }
                      });

                      dispatchCamera({ type: "SET_LIST", list: camList });
                      _context.next = 13;
                      break;

                    case 10:
                      _context.prev = 10;
                      _context.t0 = _context["catch"](1);

                      setError(_context.t0);

                    case 13:
                    case "end":
                      return _context.stop();
                  }
                }
              },
              _callee,
              undefined,
              [[1, 10]]
            );
          })
        );

        return function getCameraList() {
          return _ref6.apply(this, arguments);
        };
      })();
      getCameraList();
      return reset;
    },
    [permitted]
  );

  (0, _react.useEffect)(
    function() {
      reset();
      var SelectedCamera =
        !!cameraList.length && selectedCameraId ? selectedCameraId : undefined;

      if (!SelectedCamera) return;
      var getCameraPermission = (function() {
        var _ref7 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee2() {
            var _stream, _constraints, defaultConstraints;

            return regeneratorRuntime.wrap(
              function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      if (!(hasGetUserMedia() && !!SelectedCamera)) {
                        _context2.next = 15;
                        break;
                      }

                      _context2.prev = 1;
                      _context2.next = 4;
                      return navigator.mediaDevices.getUserMedia({
                        video: {
                          deviceId: {
                            exact: SelectedCamera
                          }
                        }
                      });

                    case 4:
                      _stream = _context2.sent;
                      _constraints = !!_stream.getTracks()[0].getCapabilities
                        ? getConstraints(
                            _stream.getTracks()[0].getCapabilities()
                          )
                        : [];
                      defaultConstraints = !!_stream.getTracks()[0].getSettings
                        ? _stream.getTracks()[0].getSettings()
                        : null;

                      dispatchStream({
                        type: "SET_STREAM",
                        newstream: _stream,
                        newConstraints: _constraints,
                        newSelectedConstraint: defaultConstraints
                      });
                      _context2.next = 13;
                      break;

                    case 10:
                      _context2.prev = 10;
                      _context2.t0 = _context2["catch"](1);

                      setError(_context2.t0);

                    case 13:
                      _context2.next = 16;
                      break;

                    case 15:
                      return _context2.abrupt(
                        "return",
                        setError(new Error("No camera device was found!"))
                      );

                    case 16:

                    case 17:
                    case "end":
                      return _context2.stop();
                  }
                }
              },
              _callee2,
              undefined,
              [[1, 10]]
            );
          })
        );

        return function getCameraPermission() {
          return _ref7.apply(this, arguments);
        };
      })();
      getCameraPermission();
      return reset;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [selectedCameraId, cameraList.length]
  );

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

exports.default = useCamera;
