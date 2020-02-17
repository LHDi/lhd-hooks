'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SET_VALUE = 'SET_VALUE';
var SET_ERROR = 'SET_ERROR';

var formReducer = function formReducer(state, _ref) {
	var type = _ref.type,
	    payload = _ref.payload;

	switch (type) {
		case SET_VALUE:
			var newState = _extends({}, state, { formState: _extends({}, state.formState, payload) });
			for (var a in payload) {
				delete newState.errors[a];
			}return newState;
		case SET_ERROR:
			return _extends({}, state, { errors: _extends({}, state.errors, payload) });
		default:
			return _extends({}, state);
	}
};

var useFormState = function useFormState(onSubmit) {
	var _useState = (0, _react.useState)(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    ready = _useState2[0],
	    setReady = _useState2[1];

	var _useReducer = (0, _react.useReducer)(formReducer, { formState: {}, errors: {} }),
	    _useReducer2 = _slicedToArray(_useReducer, 2),
	    _useReducer2$ = _useReducer2[0],
	    formState = _useReducer2$.formState,
	    errors = _useReducer2$.errors,
	    dispatch = _useReducer2[1];

	var form = (0, _react.useRef)(null);
	var submit = function submit(e) {
		e.preventDefault();
		onSubmit && onSubmit(formState, e);
	};

	var setForm = (0, _react.useCallback)(function (node) {
		if (node && node.tagName === 'FORM') {
			setReady(true);
			node.onchange = function (e) {
				dispatch({ type: SET_VALUE, payload: _defineProperty({}, e.target.name, e.target.type !== 'checkbox' ? e.target.value : e.target.checked) });
			};
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = node.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var child = _step.value;


					if (child.tagName === 'INPUT') {
						child.oninvalid = function (e) {
							var validity = {};
							for (var name in e.target.validity) {
								if (e.target.validity[name]) validity[name] = true;
							}
							dispatch({ type: SET_ERROR, payload: _defineProperty({}, e.target.name, validity) });
						};
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			form.current = node;
		}
	}, []);
	(0, _react.useEffect)(function () {
		if (!ready) return;
		form.current.addEventListener('submit', submit);
		return function () {
			form.current.removeEventListener('submit', submit);
		};
	}, [ready, formState]);
	return [setForm, formState, errors];
};

exports.default = useFormState;