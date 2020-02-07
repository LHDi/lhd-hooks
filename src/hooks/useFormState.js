import {useState, useRef, useEffect, useCallback, useReducer} from 'react';
const SET_VALUE = 'SET_VALUE';
const SET_ERROR = 'SET_ERROR';

const formReducer = (state, {type, payload}) => {
	switch (type) {
		case SET_VALUE:
			const newState = {...state, formState: {...state.formState, ...payload}};
			for(let a in payload) delete newState.errors[a];
			return newState;
		case SET_ERROR:
			return {...state, errors: {...state.errors, ...payload}};
		default:
			return {...state}
	}
}

const useFormState = (onSubmit) => {
	const [ready, setReady] = useState(false);
	const [{formState, errors}, dispatch] = useReducer(formReducer, {formState: {}, errors: {}});
	const form = useRef(null);
	const submit = (e) => {
		e.preventDefault();
		onSubmit&&onSubmit(formState, e);
	};

	const setForm = useCallback(node => {
		if(node && node.tagName === 'FORM') {
			setReady(true);
			node.onchange = (e) => {
				dispatch({type: SET_VALUE, payload: {[e.target.name]: e.target.type !== 'checkbox'?e.target.value:e.target.checked}})
			}
			for(let child of node.children) {
				
				if(child.tagName === 'INPUT') {
					child.oninvalid = (e) => {
						const validity = {};
						for(let name in e.target.validity) {
							if(e.target.validity[name])
								validity[name] = true;
						}
						dispatch({type: SET_ERROR, payload: {[e.target.name]: validity}});
					};
				}
			}
			form.current = node;
		}
  }, [])
	useEffect(() => {
		if(!ready) return;
		form.current.addEventListener('submit', submit);
		return ()=> {
			form.current.removeEventListener('submit', submit);
		}
	}, [ready, formState]);
	return [setForm, formState, errors];
}

export default useFormState;
