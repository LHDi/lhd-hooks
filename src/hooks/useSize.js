//This hook use the resize Observe pollyfill to grant wide compatibility

import { useEffect, useState, useRef, useCallback } from 'react';
//Here we're using resize observer pollyfill because we are not sure if it is implemented in the client browser
import ResizeObserver from 'resize-observer-polyfill';

const useSize = (ref) => {
	//init dimentions with zeros
	const [height, setHeight] = useState(0);
	const [width, setWidth] = useState(0);
	const isWindow = useRef(null);
	const element = useRef(null);
	const resizeObserver = useRef(null);

	//this callback is used for resize event for the window
	const windowResizeEventCallback = useCallback(() => {
		if(!isWindow.current) return;
		setHeight(window.innerHeight);
		setWidth(window.innerWidth);
	}, []);

	//this callback is used for the ResizeObserver for other elements
	const elementsResizeEventCallback = useCallback(() => {
		if(isWindow.current) return;
		setHeight(element.current.offsetHeight);
		setWidth(element.current.offsetWidth);
	}, [ref]);

	useEffect(() => {
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
			if(resizeObserver.current)
				resizeObserver.current.disconnect();
		};

		if(isWindow.current) {
			window.addEventListener('resize', windowResizeEventCallback);
		} else {
			//check if the observer exist so we don't have to recreate it and just observe
			if(!resizeObserver.current)
				resizeObserver.current = new ResizeObserver(elementsResizeEventCallback);
			resizeObserver.current.observe(element.current);
		}

		//clean after the element have been changed
		return () => {
			if(isWindow.current)
				window.removeEventListener('resize', windowResizeEventCallback);
			else
				resizeObserver.current.unobserve(element.current);
		}
	}, [ref]);
	return [height, width];
}

export default useSize;