import React, {useState} from 'react';
import usePlaceholder from '../../src/hooks/usePlaceholder';
const loader = () => <img src='https://samherbert.net/svg-loaders/svg-loaders/puff.svg'/>;
const UsePlaceholderExample = () => {
	const [ready, setReady] = useState(false);
	const setContainer = usePlaceholder(ready, loader);
	return (
		<React.Fragment>
			<button onClick={() => setReady(r => !r)}>SWITCH</button>
			<div style={{background: '#eee',width: '50vw', height: '50vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} ref={setContainer}>
				
			</div>
		</React.Fragment>
	);
}

export default UsePlaceholderExample;
