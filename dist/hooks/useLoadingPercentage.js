"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var useIsPageLoading = function useIsPageLoading() {
  for (var _len = arguments.length, deps = Array(_len), _key = 0; _key < _len; _key++) {
    deps[_key] = arguments[_key];
  }

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isLoaded = _useState2[0],
      setIsLoaded = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      percentage = _useState4[0],
      setPercentage = _useState4[1];

  var timeOut = (0, _react.useRef)(null);
  var interval = (0, _react.useRef)(null);
  var parseTime = (0, _react.useRef)(null);

  var firstTime = (0, _react.useRef)(true);

  var loadListener = (0, _react.useCallback)(function () {
    timeOut.current = setTimeout(function () {
      window.performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
      var timing = performance.timing || {};
      var pTime = timing.loadEventEnd - timing.responseEnd;

      parseTime.current = pTime;
      interval.current = setInterval(function () {
        setPercentage(function (p) {
          return p < 100 ? p + 10 : 100;
        });
      }, parseTime.current / 10);
      firstTime.current = false;
    }, 0);
  }, []);
  (0, _react.useEffect)(function () {
    if (percentage === 100) {
      clearInterval(interval.current);
      setIsLoaded(true);
    }
  }, [percentage]);

  (0, _react.useEffect)(function () {
    window.addEventListener("load", loadListener);
    return function () {
      window.removeEventListener("load", loadListener);
      clearTimeout(timeOut.current);
      clearInterval(interval.current);
    };
  }, []);

  (0, _react.useEffect)(function () {
    if (!firstTime.current) {
      setPercentage(0);
      setIsLoaded(false);
      loadListener();
    }
  }, [].concat(deps));
  return [isLoaded, percentage];
};

exports.default = useIsPageLoading;