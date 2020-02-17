'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var useLocalStorage = function useLocalStorage(name) {
	var _useState = (0, _react.useState)(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    ready = _useState2[0],
	    setReady = _useState2[1];

	var _useState3 = (0, _react.useState)(null),
	    _useState4 = _slicedToArray(_useState3, 2),
	    value = _useState4[0],
	    setValue = _useState4[1];

	var store = (0, _react.useRef)(null);
	(0, _react.useEffect)(function () {
		var storeObject = {};
		if (!window) return store.current = { error: new Error('You have to execute this in the Browser!') };
		var localStorage = window.localStorage;
		if (!name) {
			storeObject.set = function (name, val) {
				return localStorage.setItem(name, val);
			};
			storeObject.get = function (name) {
				return localStorage.getItem(name);
			};
			storeObject.remove = function (name) {
				return localStorage.removeItem(name);
			};
		} else {
			storeObject.set = function (val) {
				localStorage.setItem(name, val);
				setValue(storeObject.get());
			};
			storeObject.get = function () {
				return localStorage.getItem(name);
			};
			setValue(storeObject.get());
			storeObject.remove = function () {
				localStorage.removeItem(name);
				setValue(null);
			};
		}
		store.current = storeObject;
		setReady(true);
	}, []);
	if (ready) return { value: value, set: store.current.set, remove: store.current.remove, ready: ready };
	return { ready: ready };
};

exports.default = useLocalStorage;