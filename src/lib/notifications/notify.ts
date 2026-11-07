import { createElement, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { toast } from 'sonner';

export interface NotifyOptions {
  id?: string | number;
  duration?: number;
}

export interface CustomNotifyOptions extends NotifyOptions {
  onClick?: () => void;
}

/** Shared transient UI notification API. Persistent business notifications use the notifications feature/API. */
export const notify = {
  success: (message: ReactNode, options?: NotifyOptions) => toast.success(message, options),
  error: (message: ReactNode, options?: NotifyOptions) => toast.error(message, options),
  info: (message: ReactNode, options?: NotifyOptions) => toast.info(message, options),
  warning: (message: ReactNode, options?: NotifyOptions) => toast.warning(message, options),
  custom: (render: (id: string | number) => ReactElement, options?: CustomNotifyOptions) => {
    const { onClick, ...toastOptions } = options ?? {};
    return toast.custom((id) => {
      const content = render(id);
      if (!onClick) return content;

      const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onClick();
        toast.dismiss(id);
      };

      return createElement(
        'div',
        {
          role: 'button',
          tabIndex: 0,
          className:
            'cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-rentify-primary',
          onClick: () => {
            onClick();
            toast.dismiss(id);
          },
          onKeyDown: handleKeyDown,
        },
        content,
      );
    }, toastOptions);
  },
  dismiss: (id?: string | number) => toast.dismiss(id),
};
