import React, { useRef, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Switch, Route, Link, HashRouter, useParams } from 'react-router-dom';
import "@babel/polyfill";
import UseSizeExample from './useSizeExample';
import UseCameraExample from './useCameraExample';
import UseSwipeExample from './useSwipeExample';
import UseLocalStorageExample from './useLocalStorageExample';

import useLoadingPercentage from '../../src/hooks/useLoadingPercentage';
import UseFormStateExample from './useFormStateExample';
import UsePortalExample from './usePortalExample';
import UsePlaceholderExample from './usePlaceholderExample';

const style = {
	topNav: {
		position: 'absolute',
		zIndex: 99,
		left: 0,
		top: 0,
		width: '100%',
		background: '#fff',
		boxShadow: '0 0 5px 0px #c77cff',
		transition: '.2s all ease-out'
	},
	trigger: {
		position: 'absolute',
		top: '100%',
		left: '50%',
		background: '#fff',
		padding: '5px 10px',
		borderRadius: '50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: 'rgb(199, 124, 255) 0px 5px 15px -5px',
		color: '#000000c7',
		cursor: 'pointer'
	},
	close: {
		transform: 'translateY(-90%)'
	}
}

const Nav = () => {
	const [open, setOpen] = useState(false);
	return (
		<nav style={Object.assign({}, style.topNav, !open && style.close)}>
			<Link to="/useSize">useSize</Link>
			<Link to="/useCamera">useCamera</Link>
			<Link to="/useSwipe">useSwipe</Link>
			<Link to="/useLocalStorage">useLocalStorage</Link>
			<Link to="/useFormState">useFormState</Link>
			<Link to="/usePortal">usePortal</Link>
			<Link to="/usePlaceholder">usePlaceHolder</Link>
			<span onClick={() => setOpen(!open)} style={style.trigger}>&#9661;</span>
		</nav>
	)
}

const UseExample = () => {
	const { hook } = useParams();
	const [loaded, percentage] = useLoadingPercentage(hook);
	
	return (
		<React.Fragment>
			{
				!loaded &&
				<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: '#eee', zIndex: 100 }}>
					<div style={{ position: 'absolute', top: 0, transition: '.1s all ease-out', right: `${100 - percentage}%`, width: '100%', height: '3px', background: '#ff5200' }}></div>
				</div>
			}
			{(() => {
				switch (hook) {
					case 'useCamera':
						return <UseCameraExample />
					case 'useSize':
						return <UseSizeExample />
					case 'useSwipe':
						return <UseSwipeExample />
					case 'useLocalStorage':
						return <UseLocalStorageExample />
					case 'useFormState':
						return <UseFormStateExample />
					case 'usePortal':
						return <UsePortalExample />
					case 'usePlaceholder':
						return <UsePlaceholderExample />
					default:
						return null;
				}
			})()}
		</React.Fragment>
	)
}
const App = () => {

	return (
		<HashRouter>
			<Nav />
			<Switch>
				<Route path="/:hook">
					<UseExample />
				</Route>
			</Switch>
		</HashRouter>
	)
};
render(<App />, document.getElementById("root"));
