"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _useSwipe = require("./useSwipe");

var _useSwipe2 = _interopRequireDefault(_useSwipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	useScrollAnimation scroll one page at a time, every page takes the full height of the container
 *	if no params was passed the hook will use the body
 * @param {React.ref} ref - the reference to the element
 * @returns {Array<number, function>} ReturnedArray = [index {number}, scrollTo {function}]
 */

var easeInOutQuad = function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

var useScrollAnimation = function useScrollAnimation() {
  var ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$horizontal = _ref.horizontal,
      horizontal = _ref$horizontal === undefined ? false : _ref$horizontal,
      _ref$noEvents = _ref.noEvents,
      noEvents = _ref$noEvents === undefined ? false : _ref$noEvents,
      _ref$duration = _ref.duration,
      duration = _ref$duration === undefined ? 1 : _ref$duration;

  var scrolling = (0, _react.useRef)(false);
  var time = (0, _react.useRef)(0);

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      index = _useState2[0],
      setIndex = _useState2[1];

  var element = (0, _react.useRef)(null);

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      height = _useState4[0],
      setHeight = _useState4[1];

  /**@private
   *	scroll an element smoothly
   * @param {HTMLElement} el element to be scrolled
   * @param {number} y number of pixels to be scrolled with
   * @param {"top"|"down"} d direction of scrolling
   * @param {number} s start point
   */


  var scroll = (0, _react.useCallback)(function (el, y, d, s) {
    scrolling.current = true;
    var direction = d ? d : el.scrollTop < y ? "down" : "up";
    var start = s ? s : el.scrollTop;
    // reset the timing if it's the first time
    time.current = d ? time.current : 0;
    time.current += 1 / (60 * duration);
    switch (direction) {
      case "up":
        // start (start point)
        el.scrollTop = start - height * easeInOutQuad(time.current);
        if (el.scrollTop <= y) {
          el.scrollTop = y;
          return scrolling.current = false;
        }
        break;
      case "down":
        // start (start point)
        el.scrollTop = start + height * easeInOutQuad(time.current);
        if (el.scrollTop >= y) {
          el.scrollTop = y;
          return scrolling.current = false;
        }
        break;
      default:
        return;
    }
    return requestAnimationFrame(function (t) {
      return scroll(el, y, direction, start);
    });
  }, [height]);

  var scrollTo = (0, _react.useCallback)(function (i) {
    var el = element.current,
        h = height;

    if (i >= 0 && i * h <= el.scrollHeight - h) {
      scroll(el, i * h);
      setIndex(i);
    }
  }, [height, scroll]);

  (0, _useSwipe2.default)(noEvents ? undefined : ref, {
    onSwipeUp: function onSwipeUp() {
      return scrollTo(index + 1);
    },
    onSwipeDown: function onSwipeDown() {
      return scrollTo(index - 1);
    },
    onTouchMove: function onTouchMove(e) {
      element.current.scrollTop = index * height - e.y;
    },
    onDistanceLessThanDelta: function onDistanceLessThanDelta() {
      scrollTo(index);
    }
  }, 50);

  (0, _react.useEffect)(function () {
    if (noEvents) return;
    var keyListener = function keyListener(e) {
      if (e.keyCode === 38) scrollTo(index - 1);else if (e.keyCode === 40) scrollTo(index + 1);
    };
    window.addEventListener("keyup", keyListener);
    return function () {
      return window.removeEventListener("keyup", keyListener);
    };
  }, [scrollTo, index]);

  (0, _react.useEffect)(function () {
    if (element.current) scrollTo(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, scrollTo]);

  (0, _react.useEffect)(function () {
    if (ref && ref.current) {
      element.current = ref.current;
      setHeight(ref.current.offsetHeight);
    } else {
      element.current = document.body;
      setHeight(window.innerHeight);
    }
    element.current.style.overflowY = "hidden";
    var onScroll = function onScroll(e) {
      e.preventDefault();
      var direction = e.deltaMode === 0 ? Math.abs(e.deltaY) >= 40 ? e.deltaY < 0 ? "up" : "down" : false : Math.abs(e.deltaY) * 20 >= 40 ? e.deltaY < 0 ? "up" : "down" : false;
      if (scrolling.current || !direction) return;
      if (direction === "down" && index < element.current.scrollHeight) {
        // downscroll code
        scrollTo(index + 1);
      } else if (direction === "up" && index > 0) {
        // upscroll code
        scrollTo(index - 1);
      }
    };

    var onResize = function onResize() {
      if (ref && ref.current) setHeight(ref.current.offsetHeight);else setHeight(window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    if (!noEvents) element.current.addEventListener("wheel", onScroll, false);
    return function () {
      if (!noEvents) element.current.removeEventListener("wheel", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [index, ref, scrollTo]);
  return [index, scrollTo];
};

exports.default = useScrollAnimation;