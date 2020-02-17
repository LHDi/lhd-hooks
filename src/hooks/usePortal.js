import { useState, useRef, useCallback, useEffect } from 'react';
import useOnClickOutside from './useOnClickOutside';

/**
 *
 *
 * @param {object} [Options={}] - The options Object.
 * @param {boolean} [Options.closeOnClickOutside=true] - If true the portal will close when click outside the portal.
 * @param {boolean} [Options.closeOnESC=true] - If true the portal will close when click Escape.
 * @param {boolean} [Options.defaultOpen=false] - When true the portal will be opened when the component mount.
*/
const usePortal = ({
	closeOnClickOutside = true,
	closeOnESC = true,
	defaultOpen = false
} = {}) => {
	const Portal = useRef(null);
	const [open, setOpen] = useState(defaultOpen);
	useOnClickOutside(Portal, () => closeOnClickOutside&&setOpen(o => false));
	//set the ref of the element and style it
	const setPortal = useCallback((ref) => {
		if(!ref) return;
		Portal.current = ref
		Portal.current.style.cssText += `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			${open? 'visibility: visible; opacity: 1;': 'visibility: visible; opacity: 0;'}
			transition: .3s all ease-out
		`;
	}, [])

	const setTrigger = useCallback((ref) => {
		if(!ref) return;
		ref.addEventListener('click', () => setOpen(o => !o));
	}, [])

	useEffect(() => {
		Portal.current.style.visibility = open?'visible':'hidden'
		Portal.current.style.opacity = open?'1':'0'
	}, [open]);

	//add event list when first mount and remove when unmount
	//the event listener is for close when ESC clicked
	useEffect(() => {
		if(!closeOnESC) return;
		const closeOnESCHandler = (e) => {if(e.keyCode==27&&closeOnESC) setOpen(false);}
		window.addEventListener('keyup', closeOnESCHandler);

		return () => window.addEventListener('keyup', closeOnESCHandler);
	},[])

	return {setPortal, setTrigger};
}

export default usePortal;
