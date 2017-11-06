'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _dom = require('./dom.js');

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// heavily inspired by https://github.com/Khan/react-components/blob/master/js/layered-component-mixin.jsx
var RenderToLayer = function (_Component) {
	_inherits(RenderToLayer, _Component);

	function RenderToLayer() {
		_classCallCheck(this, RenderToLayer);

		return _possibleConstructorReturn(this, (RenderToLayer.__proto__ || Object.getPrototypeOf(RenderToLayer)).apply(this, arguments));
	}

	_createClass(RenderToLayer, [{
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			this.renderLayer(nextProps.open, nextProps.render, nextProps.parentComponent);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.renderLayer(this.props.open, this.props.render, this.props.parentComponent);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps, nextState) {
			if (nextProps.open !== this.props.open) {
				this.renderLayer(nextProps.open, nextProps.render, nextProps.parentComponent);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.unrenderLayer();
		}
	}, {
		key: 'onClickAway',
		value: function onClickAway(event) {
			if (event.defaultPrevented) {
				return;
			}

			if (this.props && !this.props.componentClickAway) {
				return;
			}

			if (this.props && !this.props.open) {
				return;
			}

			var el = this.layer;
			if (event.target !== el && event.target === window || document.documentElement.contains(event.target) && !_dom2.default.isDescendant(el, event.target)) {
				if (this.props) {
					this.props.componentClickAway(event);
				}
			}
		}
	}, {
		key: 'getLayer',
		value: function getLayer() {
			return this.layer;
		}
	}, {
		key: 'unrenderLayer',
		value: function unrenderLayer() {
			if (!this.layer) {
				return;
			}

			if (this.props.useLayerForClickAway) {
				this.layer.style.position = 'relative';
				this.layer.removeEventListener('touchstart', this.onClickAway);
				this.layer.removeEventListener('click', this.onClickAway);
			} else {
				window.removeEventListener('touchstart', this.onClickAway);
				window.removeEventListener('click', this.onClickAway);
			}

			(0, _reactDom.unmountComponentAtNode)(this.layer);
			document.body.removeChild(this.layer);
			this.layer = null;
		}

		/**
   * By calling this method in componentDidMount() and
   * componentDidUpdate(), you're effectively creating a "wormhole" that
   * funnels React's hierarchical updates through to a DOM node on an
   * entirely different part of the page.
   */

	}, {
		key: 'renderLayer',
		value: function renderLayer(open, render, parentComponent) {

			if (open) {
				if (!this.layer) {
					this.layer = document.createElement('div');
					document.body.appendChild(this.layer);

					var rect = _reactDom2.default.findDOMNode(parentComponent).getBoundingClientRect();

					this.layer.addEventListener('touchstart', this.onClickAway);
					this.layer.addEventListener('click', this.onClickAway);
					this.layer.style.position = 'fixed';
					this.layer.style.top = Math.max(0, rect.bottom) + 'px';
					this.layer.style.left = Math.max(0, rect.left) + 'px';
					this.layer.style.width = Math.max(0, rect.width) + 'px';
					this.layer.style.zIndex = 10000;
				}
				var layerElement = render;
				this.layerElement = (0, _reactDom.unstable_renderSubtreeIntoContainer)(this, layerElement, this.layer);
			} else {
				this.unrenderLayer();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return RenderToLayer;
}(_react.Component);

exports.default = RenderToLayer;