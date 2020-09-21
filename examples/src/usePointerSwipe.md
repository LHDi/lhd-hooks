# usePointerSwipe

React hook that fires a callback upon swiping left or right on a given HTML element.

## Arguments

- **ref**: The container element, it is either the element that will be watched, or a parent of it. This could be a **React ref** or an **HTMLElement**

- **selector**: The CSS selector for the element to be watched.

- **callback**: Callback function fired upon swiping on the element
  - _Argument_: **direction**: -1 if left, 0 if nowhere and 1 if right
