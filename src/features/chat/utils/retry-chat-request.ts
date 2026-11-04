import { isAxiosError } from 'axios';
import { CHAT_SEND_ATTEMPT_LIMIT, CHAT_SEND_RETRY_DELAY_MS } from '../constants/chat.constants';

const isTransientError = (error: unknown) =>
  isAxiosError(error) && (!error.response || error.response.status === 408 || error.response.status >= 500);

const abortError = () => new DOMException('Chat send was cancelled', 'AbortError');

const wait = (signal: AbortSignal, milliseconds: number) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const timer = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, milliseconds);
    const handleAbort = () => {
      window.clearTimeout(timer);
      reject(abortError());
    };
    signal.addEventListener('abort', handleAbort, { once: true });
  });

const waitForNetwork = (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const handleOnline = () => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    };
    const handleAbort = () => {
      window.removeEventListener('online', handleOnline);
      reject(abortError());
    };
    window.addEventListener('online', handleOnline, { once: true });
    signal.addEventListener('abort', handleAbort, { once: true });
    if (navigator.onLine) handleOnline();
  });

export const retryChatRequest = async <T>(
  request: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
): Promise<T> => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await request(signal);
    } catch (error) {
      if (signal.aborted || !isTransientError(error) || attempt >= CHAT_SEND_ATTEMPT_LIMIT - 1) throw error;
      if (!navigator.onLine) await waitForNetwork(signal);
      else await wait(signal, CHAT_SEND_RETRY_DELAY_MS * 2 ** attempt);
    }
  }
};
