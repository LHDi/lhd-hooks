import {
	useState,
	useEffect,
	useRef,
	useCallback
} from 'react';
import useSwipe from './useSwipe';

const useScrollAnimation = (ref) => {
	const scrolling = useRef(false);
	const step = useRef(0);
	const [index, setIndex] = useState(0);
	const element = useRef(null);
	const [height, setHeight] = useState(0);
	const scroll = useCallback((el, y, d) => {		
		const direction = d ? d : el.scrollTop < y ? "down" : "up";
		switch (direction) {
			case "up":
				el.scrollTop -= ++step.current;
				if (el.scrollTop <= y) {
					step.current = 0;
					return el.scrollTop = y;
				}
				break;
			case "down":
				el.scrollTop += ++step.current;
				if (el.scrollTop >= y) {
					step.current = 0;
					return el.scrollTop = y;
				}
				break;
			default:
				return;
		}
		return requestAnimationFrame(() => scroll(el, y, direction));
	}, []);

	

	const scrollTo = useCallback((i) => {
		if (scrolling.current) return;
		scrolling.current = true;
		const el = element.current,
		h = height;
		
		if (i >= 0 && i * h <= (el.scrollHeight - h)) {
			scroll(el, i * h);
			setIndex(i);
		}
		scrolling.current = false;
	}, [height, scroll])

	useSwipe(ref, {
		onSwipeUp: () => scrollTo(index + 1),
		onSwipeDown: () => scrollTo(index - 1),
		onTouchMove: (e) =>  {
			element.current.scrollTop = index * height - e.y;
		},
		onDistanceLessThanDelta: () => {
			scrollTo(index);
		}
	}, 50)

	useEffect(() => {
		const keyListener = (e) => {
			if(e.keyCode === 38)
				scrollTo(index - 1);
			else if(e.keyCode === 40)
				scrollTo(index + 1);
		};
		window.addEventListener('keyup', keyListener);
		return () => window.removeEventListener('keyup', keyListener);
	}, [scrollTo, index])

	useEffect(() => {
		if (element.current)
			scrollTo(index);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [height, scrollTo]);

	useEffect(() => {
		if (ref && ref.current) {
			element.current = ref.current;
			setHeight(ref.current.offsetHeight)
		} else {
			element.current = document.body;
			setHeight(window.innerHeight);
		};

		const onScroll = (e) => {
			e.preventDefault();
			if (e.deltaY > 0 && index < element.current.scrollHeight) {
				// downscroll code
				scrollTo(index + 1);
			} else if (e.deltaY < 0 && index > 0) {
				// upscroll code
				scrollTo(index - 1);
			}
		}

		const onResize = () => {
			if (ref && ref.current)
				setHeight(ref.current.offsetHeight)
			else
				setHeight(window.innerHeight);
		}

		window.addEventListener('resize', onResize);
		element.current.addEventListener('wheel', onScroll);
		return () => {
			element.current.removeEventListener('wheel', onScroll);
			window.removeEventListener('resize', onResize);
		}
	}, [index, ref, scrollTo])
	return [index, scrollTo];
}

export default useScrollAnimation;