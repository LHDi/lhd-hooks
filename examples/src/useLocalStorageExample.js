import React, { useEffect, useRef, useState } from 'react';
import useLocalStorage from '../../src/hooks/useLocalStorage';

const style = {
	input: {
		fontSize: '1.2em',
		padding: '10px',
		border: '2px solid #79afde'
	},
	button: {
		display: 'inline',
		padding: '10px',
		margin: '5px',
		background: 'white',
		border: '2px solid #79afde'
	}
}

const UseLocalStorageExample = () => {
	const input = useRef(null);
	const [value, set, remove] = useLocalStorage('example');
	return (
		<div id='localStorage'>
			<span style={{display: 'block', textAlign: 'center'}}>{value}</span>
			<input style={style.input} type="text" ref={input} />
			<div style={{textAlign: 'center'}}>
				<input style={style.button} onClick={() => {set(input.current.value)}} type="button" value={value?'update':'set'}/>
				<input style={style.button} onClick={() => {remove()}} type="button" value="remove"/>
			</div>
		</div>
	);
}

export default UseLocalStorageExample;
