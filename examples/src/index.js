import React, {useRef, useEffect, useState} from 'react';
import { render} from 'react-dom';
import {Switch, Route, BrowserRouter, Link, HashRouter, useParams} from 'react-router-dom';
import "@babel/polyfill";
import UseSizeExample from './useSizeExample';
import UseCameraExample from './useCameraExample';
import useLoadingPercentage from '../../src/hooks/useLoadingPercentage';

const Nav = () => {
	return (
		<nav>
			<li><Link to="/useSize">useSize</Link></li>
			<li><Link to="/useCamera">useCamera</Link></li>
		</nav>
	)
}

const UseExample = () => {
	const {hook} = useParams();
	const [loaded, percentage] = useLoadingPercentage(hook);
	useEffect(() => {

	}, [percentage]);
	return(
		<React.Fragment>
			{
				!loaded&&
				<div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: '#eee'}}>
					<div style={{position: 'absolute', top: 0, transition: '.1s all ease-out', right: `${100 - percentage}%`, width: '100%', height: '3px', background: '#ff5200'}}></div>
				</div>
			}
			{(() => {
				switch(hook) {
					case 'useCamera':
						return <UseCameraExample />
					case 'useSize':
						return <UseSizeExample />
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
