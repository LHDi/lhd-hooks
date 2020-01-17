'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.useScrollAnimation = exports.useSwipe = exports.useOnClickOutside = undefined;

var _useOnClickOutside = require('./hooks/useOnClickOutside');

var _useOnClickOutside2 = _interopRequireDefault(_useOnClickOutside);

var _useScrollAnimation = require('./hooks/useScrollAnimation');

var _useScrollAnimation2 = _interopRequireDefault(_useScrollAnimation);

var _useSwipe = require('./hooks/useSwipe');

var _useSwipe2 = _interopRequireDefault(_useSwipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.useOnClickOutside = _useOnClickOutside2.default;
exports.useSwipe = _useSwipe2.default;
exports.useScrollAnimation = _useScrollAnimation2.default;