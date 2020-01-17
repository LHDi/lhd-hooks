import React, {useRef} from 'react';
import { render} from 'react-dom';
import {useSwipe} from '../../src';
const App = () => {
	const swipedElement = useRef(null);
	useSwipe(swipedElement, {
		onSwipeUp: () => swipedElement.current.style.background = 'red',
		onSwipeDown: () => swipedElement.current.style.background = 'green',
		onSwipeLeft: () => swipedElement.current.style.background = 'blue',
		onSwipeRight: () => swipedElement.current.style.background = 'black',
	})
	return (
    <div ref={swipedElement} style={{height: '100vh', background: 'red', transition: '.3s all ease-in-out'}}/>
	)
};
render(<App />, document.getElementById("root"));
