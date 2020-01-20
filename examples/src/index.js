import React, {useRef} from 'react';
import { render} from 'react-dom';
import "@babel/polyfill";
import UseSizeExample from './useSizeExample';
import UseCameraExample from './useCameraExample';

const App = () => {
	
	return (
		<UseCameraExample />
	)
};
render(<App />, document.getElementById("root"));
