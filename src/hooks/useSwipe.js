import { useRef, useCallback, useEffect } from "react";

/**
 *	useSwipe track one touch and excute the propriate callback each time
 * @param {React.Element} Element
 * @param {object} Handlers
 * @param {function} Handlers.onSwipeDown the function to excute when swipe down excute when touch is done
 * @param {function} Handlers.onSwipeUp the function to excute when swipe up excute when touch is done
 * @param {function} Handlers.onSwipeLeft the function to excute when swipe left excute when touch is done
 * @param {function} Handlers.onSwipeRight the function to excute when swipe right excute when touch is done
 * @param {function} Handlers.onDistanceLessThanDelta the function to excute when swipe less then delta
 * @param {function} Handlers.onTouchMove the function to excute when touch move
 * @param {number} [delta=30]
 */
const useSwipe = (Element, Handlers, delta = 30) => {
  const start = useRef({});
  const end = useRef({});
  const handlers = useRef(Handlers);

  useEffect(() => {
    handlers.current = Handlers;
  }, [Handlers]);
  const swipeDirection = useCallback((start, end, delta) => {
    if (start && start.x && start.y && end && end.x && end.y && delta) {
      const xDiff = end.x - start.x,
        yDiff = end.y - start.y;
      if (xDiff > yDiff && xDiff > delta) {
        return "left";
      } else if (yDiff > xDiff && yDiff > delta) {
        return "down";
      } else if (xDiff < yDiff && xDiff < -delta) {
        return "right";
      } else if (yDiff < xDiff && yDiff < -delta) {
        return "up";
      }
    }
    return false;
  }, []);
  const onTouchStart = useCallback(e => {
    const point = e.touches.length && {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    start.current = point || null;
  }, []);

  const onTouchMove = useCallback(e => {
    const distance = e.changedTouches.length && {
      x: e.changedTouches[0].clientX - start.current.x,
      y: e.changedTouches[0].clientY - start.current.y
    };
    const { onTouchMove } = handlers.current;
    if (onTouchMove) onTouchMove(distance);
  }, []);

  const onTouchEnd = useCallback(
    e => {
      const point = e.changedTouches.length && {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
      const {
        onSwipeDown,
        onSwipeUp,
        onSwipeLeft,
        onSwipeRight,
        onDistanceLessThanDelta
      } = handlers.current;
      end.current = point || null;

      switch (swipeDirection(start.current, end.current, delta)) {
        case "down":
          onSwipeDown && onSwipeDown();
          break;
        case "up":
          onSwipeUp && onSwipeUp();
          break;
        case "left":
          onSwipeLeft && onSwipeLeft();
          break;
        case "right":
          onSwipeRight && onSwipeRight();
          break;
        default:
          onDistanceLessThanDelta && onDistanceLessThanDelta();
          return;
      }
    },
    [delta, swipeDirection]
  );

  useEffect(() => {
    if (!Element || !Element.current) return;
    const { current } = Element;
    current.addEventListener("touchstart", onTouchStart);
    current.addEventListener("touchmove", onTouchMove);
    current.addEventListener("touchend", onTouchEnd);
    return () => {
      current.addEventListener("touchstart", onTouchStart);
      current.addEventListener("touchmove", onTouchMove);
      current.addEventListener("touchend", onTouchEnd);
    };
  }, [Element, onTouchStart, onTouchMove, onTouchEnd]);
};

export default useSwipe;
