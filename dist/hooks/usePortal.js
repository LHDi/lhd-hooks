"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _useOnClickOutside = require("./useOnClickOutside");

var _useOnClickOutside2 = _interopRequireDefault(_useOnClickOutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 *
 * @param {object} [Options={}] - The options Object.
 * @param {boolean} [Options.closeOnClickOutside=true] - If true the portal will close when click outside the portal.
 * @param {boolean} [Options.closeOnESC=true] - If true the portal will close when click Escape.
 * @param {boolean} [Options.defaultOpen=false] - When true the portal will be opened when the component mount.
 */
var usePortal = function usePortal() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$closeOnClickOuts = _ref.closeOnClickOutside,
      closeOnClickOutside = _ref$closeOnClickOuts === undefined ? true : _ref$closeOnClickOuts,
      _ref$closeOnESC = _ref.closeOnESC,
      closeOnESC = _ref$closeOnESC === undefined ? true : _ref$closeOnESC,
      _ref$defaultOpen = _ref.defaultOpen,
      defaultOpen = _ref$defaultOpen === undefined ? false : _ref$defaultOpen;

  var Portal = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(defaultOpen),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  (0, _useOnClickOutside2.default)(Portal, function () {
    return closeOnClickOutside && setOpen(function (o) {
      return false;
    });
  });
  //set the ref of the element and style it
  var setPortal = (0, _react.useCallback)(function (ref) {
    if (!ref) return;
    Portal.current = ref;
    Portal.current.style.cssText += "\n\t\t\tposition: fixed;\n\t\t\ttop: 50%;\n\t\t\tleft: 50%;\n\t\t\ttransform: translate(-50%, -50%);\n    ";
    Portal.current.parentElement.removeChild(Portal.current);
    open && document.body.appendChild(Portal.current);
  }, []);

  var setTrigger = (0, _react.useCallback)(function (ref) {
    if (!ref) return;
    ref.addEventListener("click", function () {
      return setOpen(function (o) {
        return !o;
      });
    });
  }, []);

  (0, _react.useEffect)(function () {
    if (open && Portal.current.parentElement !== document.body) document.body.appendChild(Portal.current);else if (!open && Portal.current.parentElement === document.body) document.body.removeChild(Portal.current);
  }, [open]);

  //add event list when first mount and remove when unmount
  //the event listener is for close when ESC clicked
  (0, _react.useEffect)(function () {
    if (!closeOnESC) return;
    var closeOnESCHandler = function closeOnESCHandler(e) {
      if (e.keyCode == 27 && closeOnESC) setOpen(false);
    };
    window.addEventListener("keyup", closeOnESCHandler);

    return function () {
      return window.addEventListener("keyup", closeOnESCHandler);
    };
  }, []);

  return { setPortal: setPortal, setTrigger: setTrigger };
};

exports.default = usePortal;