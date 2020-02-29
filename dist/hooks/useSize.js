"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); //This hook use the resize Observe pollyfill to grant wide compatibility

//Here we're using resize observer pollyfill because we are not sure if it is implemented in the client browser


var _react = require("react");

var _resizeObserverPolyfill = require("resize-observer-polyfill");

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * useSize take an element reference and return is size
 *	if no params was passed the hook will return the size of the body
 * @param {React.Reference} [ref=null] a reference to the element
 * @returns {Array} [width, height] of the element or the body
 */
var useSize = function useSize() {
  var ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  //init dimentions with zeros
  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      width = _useState4[0],
      setWidth = _useState4[1];

  var isWindow = (0, _react.useRef)(null);
  var element = (0, _react.useRef)(null);
  var resizeObserver = (0, _react.useRef)(null);

  //this callback is used for resize event for the window
  var windowResizeEventCallback = (0, _react.useCallback)(function () {
    if (!isWindow.current) return;
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  }, []);

  //this callback is used for the ResizeObserver for other elements
  var elementsResizeEventCallback = (0, _react.useCallback)(function () {
    if (isWindow.current) return;
    setHeight(element.current.offsetHeight);
    setWidth(element.current.offsetWidth);
  }, [ref]);

  (0, _react.useEffect)(function () {
    if (ref && ref.current) {
      element.current = ref.current;
      setHeight(ref.current.offsetHeight);
      setWidth(ref.current.offsetWidth);
      isWindow.current = false;
    } else {
      element.current = document.body;
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
      isWindow.current = true;

      //disconnect the observer if the element have been changed from element to window
      if (resizeObserver.current) resizeObserver.current.disconnect();
    }

    if (isWindow.current) {
      window.addEventListener("resize", windowResizeEventCallback);
    } else {
      //check if the observer exist so we don't have to recreate it and just observe
      if (!resizeObserver.current) resizeObserver.current = new _resizeObserverPolyfill2.default(elementsResizeEventCallback);
      resizeObserver.current.observe(element.current);
    }

    //clean after the element have been changed
    return function () {
      if (isWindow.current) window.removeEventListener("resize", windowResizeEventCallback);else resizeObserver.current.unobserve(element.current);
    };
  }, [ref]);
  return [height, width];
};

exports.default = useSize;