import { useCallback, useEffect, useRef } from 'react';

type KeyCombination = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

type Callback = (event: KeyboardEvent) => void;

export function useKeyboardShortcut(
  keyCombination: KeyCombination | KeyCombination[],
  callback: Callback,
  options: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    enabled?: boolean;
  } = {}
): void {
  const {
    preventDefault = true,
    stopPropagation = true,
    enabled = true,
  } = options;

  const combinations = Array.isArray(keyCombination)
    ? keyCombination
    : [keyCombination];

  const callbackRef = useRef<Callback>(callback);
  callbackRef.current = callback;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const matchedCombination = combinations.some((combo) => {
        return (
          event.key.toLowerCase() === combo.key.toLowerCase() &&
          (combo.ctrl ?? false) === (event.ctrlKey || event.metaKey) &&
          (combo.shift ?? false) === event.shiftKey &&
          (combo.alt ?? false) === event.altKey
        );
      });

      if (matchedCombination) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callbackRef.current(event);
      }
    },
    [combinations, enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcut;
