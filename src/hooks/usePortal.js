import { useState, useRef, useCallback, useEffect } from "react";
import useOnClickOutside from "./useOnClickOutside";

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
  useOnClickOutside(Portal, () => closeOnClickOutside && setOpen(o => false));
  //set the ref of the element and style it
  const setPortal = useCallback(ref => {
    if (!ref) return;
    Portal.current = ref;
    Portal.current.style.cssText += `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
    `;
    Portal.current.parentElement.removeChild(Portal.current);
    open && document.body.appendChild(Portal.current);
  }, []);

  const setTrigger = useCallback(ref => {
    if (!ref) return;
    ref.addEventListener("click", () => setOpen(o => !o));
  }, []);

  useEffect(() => {
    if (open && Portal.current.parentElement !== document.body)
      document.body.appendChild(Portal.current);
    else if (!open && Portal.current.parentElement === document.body)
      document.body.removeChild(Portal.current);
  }, [open]);

  //add event list when first mount and remove when unmount
  //the event listener is for close when ESC clicked
  useEffect(() => {
    if (!closeOnESC) return;
    const closeOnESCHandler = e => {
      if (e.keyCode == 27 && closeOnESC) setOpen(false);
    };
    window.addEventListener("keyup", closeOnESCHandler);

    return () => window.addEventListener("keyup", closeOnESCHandler);
  }, []);

  return { setPortal, setTrigger, openPortal: () => setOpen(true) };
};

export default usePortal;
