import {useEffect, useState} from 'react';

export function useTimer(ms: number) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [, setTimeElapsed] = useState(0);
  useEffect(() => {
    if (timer === null) {
      const intervalID = setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, ms);
      setTimer(intervalID);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer, ms]);
}
