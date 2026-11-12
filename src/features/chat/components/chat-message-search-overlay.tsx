import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { ChatMessageSearchResult } from '../types/chat.dto';
import { ChatMessageSearch } from './chat-message-search';

interface ChatMessageSearchOverlayProps {
  open: boolean;
  value: string;
  debouncedValue: string;
  results: ChatMessageSearchResult[];
  isLoading: boolean;
  isError: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onSelect: (result: ChatMessageSearchResult) => void;
}

export const ChatMessageSearchOverlay = (props: ChatMessageSearchOverlayProps) => {
  const reducedMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {props.open && (
        <m.div
          className="absolute inset-0 z-10 flex flex-col"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : 4, pointerEvents: 'none', transition: { duration: 0.12 } }}
        >
          <ChatMessageSearch
            value={props.value}
            results={props.results}
            isLoading={props.isLoading || props.value.trim() !== props.debouncedValue}
            isError={props.isError}
            isLoadingMore={props.isLoadingMore}
            hasMore={props.hasMore}
            onChange={props.onChange}
            onClose={props.onClose}
            onRetry={props.onRetry}
            onLoadMore={props.onLoadMore}
            onSelect={props.onSelect}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
};
