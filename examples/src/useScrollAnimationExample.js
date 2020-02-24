import React, {useRef} from 'react';
import { useScrollAnimation } from '../../src';

const UseScrollAnimationExample = () => {
	const slider = useRef(null);
	useScrollAnimation()
	return (
		<div style={{width: '100vw', height: '100vh'}} ref={slider}>
			<div style={{height: '100vh', background: '#e0f'}}>1</div>
			<div style={{height: '100vh', background: '#fae'}}>2</div>
			<div style={{height: '100vh', background: '#0ee'}}>3</div>
		</div>
	);
}

export default UseScrollAnimationExample;
