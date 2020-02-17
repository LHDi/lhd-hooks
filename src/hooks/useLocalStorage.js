import {useEffect, useRef, useState} from 'react';

const useLocalStorage = (name) => {
	const [ready, setReady] = useState(false);
	const [value, setValue] = useState(null);
	const store = useRef(null);
	useEffect(() => {
		const storeObject = {};
		if(!window) return store.current = {error: new Error('You have to execute this in the Browser!')}
		const localStorage = window.localStorage;
		if(!name) {
			storeObject.set = (name, val) => localStorage.setItem(name, val);
			storeObject.get = (name) => (localStorage.getItem(name));
			storeObject.remove = (name) => (localStorage.removeItem(name));
		} else {
			storeObject.set = (val) => {
				localStorage.setItem(name, val)
				setValue(storeObject.get());
			};
			storeObject.get = () => (localStorage.getItem(name));
			setValue(storeObject.get());
			storeObject.remove = () => {
				localStorage.removeItem(name);
				setValue(null);
			};
		}
		store.current = storeObject;
		setReady(true);
	},[])
	if(ready)
		return {value, set: store.current.set, remove: store.current.remove, ready};
	return {ready};	
}

export default useLocalStorage;
