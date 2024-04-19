import React from "react";
type Props = {
  options?: {
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    asyncCallback?: boolean;
  };
  callback: () => unknown | (() => Promise<unknown>);
  key: string;
};
export function useKeyboardShortCut({
  options = {
    ctrlKey: true,
    altKey: false,
    metaKey: false,
    asyncCallback: false,
  },
  callback,
  key,
}: Props) {
  React.useEffect(() => {
    const listener = async (event: KeyboardEvent) => {
      const combinations: boolean | undefined =
        (options?.ctrlKey && event.ctrlKey) ||
        (options?.altKey && event.altKey) ||
        (options?.metaKey && event.metaKey);
      if (combinations && event.key === key) {
        if (options?.asyncCallback) {
          await callback();
          return;
        }
        callback();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [options, key, callback]);
}
