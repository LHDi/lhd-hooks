import {useState, useCallback, useEffect, useRef} from 'react';

const useIsPageLoading = (...deps) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [percentage, setPercentage] = useState(0);
	const timeOut = useRef(null);
	const interval = useRef(null);
	const parseTime = useRef(null);

	const firstTime = useRef(true);

	const loadListener = useCallback(() => {
		timeOut.current = setTimeout(function(){
			window.performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
			var timing = performance.timing || {};
			var pTime = timing.loadEventEnd - timing.responseEnd;

			parseTime.current = pTime;
			interval.current = setInterval(() => {
				setPercentage(p => p<100? p + 10:100);
			}, parseTime.current / 10);
			firstTime.current = false;
		}, 0);
	}, []);
	useEffect(() => {
		if(percentage === 100) {
			clearInterval(interval.current);
			setIsLoaded(true)
		}
	}, [percentage])


	useEffect(() => {
		window.addEventListener('load', loadListener);
		return () => {
			window.removeEventListener('load', loadListener);
			clearTimeout(timeOut.current);
			clearInterval(interval.current);
		}
	}, []);

	useEffect(() => {
		
		if(!firstTime.current) {
			setPercentage(0);
			setIsLoaded(false);
			loadListener();
		}
	}, [...deps])
	return [isLoaded, percentage];
}

export default useIsPageLoading;