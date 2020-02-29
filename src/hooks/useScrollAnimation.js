import { useState, useEffect, useRef, useCallback } from "react";
import useSwipe from "./useSwipe";

/**
 *	useScrollAnimation scroll one page at a time, every page takes the full height of the container
 *	if no params was passed the hook will use the body
 * @param {React.ref} ref - the reference to the element
 * @returns {Array<number, function>} ReturnedArray = [index {number}, scrollTo {function}]
 */

const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const useScrollAnimation = (
  ref = document.body,
  { horizontal = false, noEvents = false, duration = 1 } = {}
) => {
  const scrolling = useRef(false);
  const time = useRef(0);
  const [index, setIndex] = useState(0);
  const element = useRef(null);
  const [height, setHeight] = useState(0);

  /**@private
   *	scroll an element smoothly
   * @param {HTMLElement} el element to be scrolled
   * @param {number} y number of pixels to be scrolled with
   * @param {"top"|"down"} d direction of scrolling
   * @param {number} s start point
   */
  const scroll = useCallback(
    (el, y, d, s) => {
      scrolling.current = true;
      const direction = d ? d : el.scrollTop < y ? "down" : "up";
      const start = s ? s : el.scrollTop;
      // reset the timing if it's the first time
      time.current = d ? time.current : 0;
      time.current += 1 / (60 * duration);
      switch (direction) {
        case "up":
          // start (start point)
          el.scrollTop = start - height * easeInOutQuad(time.current);
          if (el.scrollTop <= y) {
            el.scrollTop = y;
            return (scrolling.current = false);
          }
          break;
        case "down":
          // start (start point)
          el.scrollTop = start + height * easeInOutQuad(time.current);
          if (el.scrollTop >= y) {
            el.scrollTop = y;
            return (scrolling.current = false);
          }
          break;
        default:
          return;
      }
      return requestAnimationFrame(t => scroll(el, y, direction, start));
    },
    [height]
  );

  const scrollTo = useCallback(
    i => {
      const el = element.current,
        h = height;

      if (i >= 0 && i * h <= el.scrollHeight - h) {
        scroll(el, i * h);
        setIndex(i);
      }
    },
    [height, scroll]
  );

  useSwipe(
    noEvents ? undefined : ref,
    {
      onSwipeUp: () => scrollTo(index + 1),
      onSwipeDown: () => scrollTo(index - 1),
      onTouchMove: e => {
        element.current.scrollTop = index * height - e.y;
      },
      onDistanceLessThanDelta: () => {
        scrollTo(index);
      }
    },
    50
  );

  useEffect(() => {
    if (noEvents) return;
    const keyListener = e => {
      if (e.keyCode === 38) scrollTo(index - 1);
      else if (e.keyCode === 40) scrollTo(index + 1);
    };
    window.addEventListener("keyup", keyListener);
    return () => window.removeEventListener("keyup", keyListener);
  }, [scrollTo, index]);

  useEffect(() => {
    if (element.current) scrollTo(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, scrollTo]);

  useEffect(() => {
    if (ref && ref.current) {
      element.current = ref.current;
      setHeight(ref.current.offsetHeight);
    } else {
      element.current = document.body;
      setHeight(window.innerHeight);
    }
    element.current.style.overflowY = "hidden";
    const onScroll = e => {
      e.preventDefault();
      const direction =
        e.deltaMode === 0
          ? Math.abs(e.deltaY) >= 40
            ? e.deltaY < 0
              ? "up"
              : "down"
            : false
          : Math.abs(e.deltaY) * 20 >= 40
          ? e.deltaY < 0
            ? "up"
            : "down"
          : false;
      if (scrolling.current || !direction) return;
      if (direction === "down" && index < element.current.scrollHeight) {
        // downscroll code
        scrollTo(index + 1);
      } else if (direction === "up" && index > 0) {
        // upscroll code
        scrollTo(index - 1);
      }
    };

    const onResize = () => {
      if (ref && ref.current) setHeight(ref.current.offsetHeight);
      else setHeight(window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    if (!noEvents) element.current.addEventListener("wheel", onScroll, false);
    return () => {
      if (!noEvents) element.current.removeEventListener("wheel", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [index, ref, scrollTo]);
  return [index, scrollTo];
};

export default useScrollAnimation;
