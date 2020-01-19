import React, {useRef} from 'react';
import { useSize } from '../../src';

const style = {
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
	background: 'white',
	border: '3px #aaa dashed',
	resize: 'both',
	overflow: 'auto',
	width: '50%',
	height: '50%',
	color: '#AAA',
	fontSize: '2em'
}

const UseSizeExample = () => {
	const target = useRef(null);
	//get the size of the window by passing nothing
	const [windowHeight, windowWidth] = useSize();
	//get the size of the div
	const [height, width] = useSize(target);
	return (
		<div>
			<span style={{color: '#AAA', fontSize:'2em'}}>{windowWidth} x {windowHeight}</span>
			<div ref={target} style={style} disabled>
				<span style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
					{width} x {height}
				</span>
			</div>
		</div>
	);
}

export default UseSizeExample;
