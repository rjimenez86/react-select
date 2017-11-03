import ReactDOM from 'react-dom';
import { Component } from 'react';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom';

import Dom from './dom.js';

// heavily inspired by https://github.com/Khan/react-components/blob/master/js/layered-component-mixin.jsx
class RenderToLayer extends Component {


	componentWillUpdate(nextProps, nextState) {
		this.renderLayer(nextProps.open, nextProps.render, nextProps.parentComponent);
	}

	componentDidUpdate() {
		this.renderLayer(this.props.open, this.props.render, this.props.parentComponent);
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.open !== this.props.open) {
			this.renderLayer(nextProps.open, nextProps.render, nextProps.parentComponent);
		}
	}

	componentWillUnmount() {
		this.unrenderLayer();
	}

	onClickAway (event) {
		if (event.defaultPrevented) {
			return;
		}

		if (this.props && !this.props.componentClickAway) {
			return;
		}

		if (this.props && !this.props.open) {
			return;
		}

		const el = this.layer;
		if (event.target !== el && event.target === window ||
			(document.documentElement.contains(event.target) && !Dom.isDescendant(el, event.target))) {
			if (this.props) {
				this.props.componentClickAway(event);
			}
		}
	}

	getLayer() {
		return this.layer;
	}

	unrenderLayer() {
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

		unmountComponentAtNode(this.layer);
		document.body.removeChild(this.layer);
		this.layer = null;
	}

	/**
	 * By calling this method in componentDidMount() and
	 * componentDidUpdate(), you're effectively creating a "wormhole" that
	 * funnels React's hierarchical updates through to a DOM node on an
	 * entirely different part of the page.
	 */
	renderLayer(open, render, parentComponent) {

		if (open) {
			if (!this.layer) {
				this.layer = document.createElement('div');
				document.body.appendChild(this.layer);

				let rect = ReactDOM.findDOMNode(parentComponent).getBoundingClientRect();

				this.layer.addEventListener('touchstart', this.onClickAway);
				this.layer.addEventListener('click', this.onClickAway);
				this.layer.style.position = 'fixed';
				this.layer.style.top = `${Math.max(0, rect.bottom)}px`;
				this.layer.style.left = `${Math.max(0, rect.left)}px`;
				this.layer.style.width = `${Math.max(0, rect.width)}px`;
			}
			const layerElement = render;
			this.layerElement = unstable_renderSubtreeIntoContainer(this, layerElement, this.layer);
		} else {
			this.unrenderLayer();
		}
	}

	render() {
		return null;
	}
}

export default RenderToLayer;
