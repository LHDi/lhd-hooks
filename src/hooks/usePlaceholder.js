import React, {useRef, useCallback, useEffect} from 'react';
import { render } from 'react-dom';

/**
 *	usePlaceholder show the loader while the ready parameter is false
 *	show the component when it's ready.
 * @param {boolean} ready
 * @param {React.Component} [Loader=null]
 * @param {string} [style='']
 * 	@returns {function} function to set the container reference.
 */
const usePlaceholder = (ready, Loader = null, style = '') => {

	const container = useRef(null);
	const placeholder = useRef(null);

	const setContainer = useCallback((ref) => {
		container.current = ref;
		placeholder.current = document.createElement('span');
		placeholder.current.style.cssText += `
			display: flex;
			align-items: center;
			justify-content: center;
			background: #4791b4;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		`;
		placeholder.current.style.cssText += style;
		Loader&&render(<Loader />, placeholder.current);
		if(!ready)
			container.current.appendChild(placeholder.current);
	}, []);

	useEffect(() => {
		if(!container.current || !placeholder.current) return;
		if(!ready)
			container.current.appendChild(placeholder.current);
		else if(ready)
			container.current.removeChild(placeholder.current);
	}, [ready]);

	return setContainer;
}

export default usePlaceholder;
