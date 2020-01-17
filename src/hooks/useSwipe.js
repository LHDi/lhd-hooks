import {useRef, useCallback, useEffect} from 'react';

/**
 * useSwipe hook
 * 
 * @param {
 * 	HTMLElement: ReactRef,
 * 	Handlers: {onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, onTouchMove},
 * 	delta: number
 * }
 * @returns {void}
 */

const useSwipe = (Element, Handlers, delta = 30) => {
	const start = useRef({});
	const end = useRef({});
	const handlers = useRef(Handlers);

	useEffect(() => {
		handlers.current = Handlers;
	}, [Handlers]);
	const swipeDirection = useCallback((start, end, delta) => {
		if(start && start.x && start.y && end && end.x && end.y && delta) {
			const xDiff = end.x - start.x, yDiff = end.y - start.y;
			if(xDiff > yDiff && xDiff > delta) {
				return 'left';
			}	else if (yDiff > xDiff && yDiff > delta) {
				return 'down';
			} else if (xDiff < yDiff && xDiff < -delta) {
				return 'right';
			} else if (yDiff < xDiff && yDiff < -delta) {
				return 'up';
			}
		}
		return false;
	}, []);
	const onTouchStart = useCallback((e) => {
		const point = e.touches.length && {x: e.touches[0].clientX, y: e.touches[0].clientY};
		start.current = point||null;
	}, []);

	const onTouchMove = useCallback((e) => {
		const distance = e.changedTouches.length && {x: e.changedTouches[0].clientX - start.current.x, y: e.changedTouches[0].clientY - start.current.y}
		const {onTouchMove} = handlers.current;
		if(onTouchMove)
			onTouchMove(distance);
	}, []);

	const onTouchEnd = useCallback((e) => {
		const point = e.changedTouches.length && {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
		const {onSwipeDown, onSwipeUp, onSwipeLeft, onSwipeRight, onDistanceLessThanDelta} = handlers.current;
		end.current = point||null;

		switch(swipeDirection(start.current, end.current, delta)) {
			case 'down':
				onSwipeDown&&onSwipeDown();
				break;
			case 'up':
				onSwipeUp&&onSwipeUp();
				break;
			case 'left':
				onSwipeLeft&&onSwipeLeft();
				break;
			case 'right':
				onSwipeRight&&onSwipeRight();
				break;
			default:
				onDistanceLessThanDelta&&onDistanceLessThanDelta();
				return ;
		}
	}, [delta, swipeDirection]);

	useEffect(() => {
		const {current} = Element;
		if(!current) return;		
		current.addEventListener("touchstart", onTouchStart);
		current.addEventListener("touchmove", onTouchMove);
		current.addEventListener("touchend", onTouchEnd);
		return () => {
			current.addEventListener("touchstart", onTouchStart);
			current.addEventListener("touchmove", onTouchMove);
			current.addEventListener("touchend", onTouchEnd);
		};
	}, [Element, onTouchStart, onTouchMove, onTouchEnd]);
}

export default useSwipe;