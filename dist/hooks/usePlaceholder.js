"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 *	usePlaceholder show the loader while the ready parameter is false
 *	show the component when it's ready.
 * @param {boolean} ready
 * @param {React.Component} [Loader=null]
 * @param {string} [style='']
 * 	@returns {function} function to set the container reference.
 */
var usePlaceholder = function usePlaceholder(ready) {
  var Loader =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var style =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  var container = (0, _react.useRef)(null);
  var placeholder = (0, _react.useRef)(null);

  var setContainer = (0, _react.useCallback)(function(ref) {
    container.current = ref;
    placeholder.current = document.createElement("span");
    placeholder.current.style.cssText +=
      "\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tbackground: #4791b4;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t";
    placeholder.current.style.cssText += style;
    Loader &&
      (0, _reactDom.render)(
        _react2.default.createElement(Loader, null),
        placeholder.current
      );
    if (!ready) container.current.appendChild(placeholder.current);
  }, []);

  (0, _react.useEffect)(
    function() {
      if (!container.current || !placeholder.current) return;
      if (!ready) container.current.appendChild(placeholder.current);
      else if (ready) container.current.removeChild(placeholder.current);
    },
    [ready]
  );

  return setContainer;
};

exports.default = usePlaceholder;
