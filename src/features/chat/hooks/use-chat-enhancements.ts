import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useSocket } from '@/features/realtime/hooks/use-socket';
import { useAuthStore } from '@/stores/auth-store';
import {
  CHAT_SEARCH_DEBOUNCE_MS,
  CHAT_TYPING_EXPIRE_MS,
  CHAT_TYPING_THROTTLE_MS,
  CHAT_SOCKET_EVENTS,
} from '../constants/chat.constants';
import { useMessageSearchQuery } from './use-chat-queries';
import type { ChatMessageSearchResult } from '../types/chat.dto';
import { isTypingEvent } from '../utils/chat-message.guard';

export const useChatEnhancements = (conversationId?: string) => {
  const { socket } = useSocket();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [anchorSequence, setAnchorSequence] = useState<string>();
  const [highlightedMessageId, setHighlightedMessageId] = useState<string>();
  const [typingExpiries, setTypingExpiries] = useState<Record<string, number>>({});
  const lastTypingSent = useRef(0);
  const isLocalTyping = useRef(false);
  const debouncedSearch = useDebounce(searchInput, CHAT_SEARCH_DEBOUNCE_MS, true).trim();
  const search = useMessageSearchQuery(conversationId, debouncedSearch, { enabled: searchOpen });

  const stopTyping = useCallback(() => {
    if (socket && conversationId && isLocalTyping.current) {
      socket.emit(CHAT_SOCKET_EVENTS.TYPING, { conversationId, isTyping: false });
    }
    isLocalTyping.current = false;
    lastTypingSent.current = 0;
  }, [conversationId, socket]);

  const sendTyping = useCallback(
    (value: string) => {
      if (!socket || !conversationId || !socket.connected || !value.trim()) {
        stopTyping();
        return;
      }
      const now = Date.now();
      if (now - lastTypingSent.current < CHAT_TYPING_THROTTLE_MS) return;
      socket.emit(CHAT_SOCKET_EVENTS.TYPING, { conversationId, isTyping: true });
      isLocalTyping.current = true;
      lastTypingSent.current = now;
    },
    [conversationId, socket, stopTyping],
  );

  useEffect(() => {
    if (!socket || !conversationId) return;
    const onTyping = (value: unknown) => {
      if (!isTypingEvent(value) || value.conversationId !== conversationId || value.userId === currentUserId) return;
      setTypingExpiries((current) => {
        const next = { ...current };
        if (value.isTyping) next[value.userId] = Date.now() + CHAT_TYPING_EXPIRE_MS;
        else delete next[value.userId];
        return next;
      });
    };
    const onDisconnect = () => setTypingExpiries({});
    socket.on(CHAT_SOCKET_EVENTS.TYPING, onTyping);
    socket.on('disconnect', onDisconnect);
    const timer = window.setInterval(() => {
      const now = Date.now();
      setTypingExpiries((current) => {
        if (Object.values(current).every((expiry) => expiry > now)) return current;
        return Object.fromEntries(Object.entries(current).filter(([, expiry]) => expiry > now));
      });
    }, 1000);
    return () => {
      stopTyping();
      window.clearInterval(timer);
      socket.off(CHAT_SOCKET_EVENTS.TYPING, onTyping);
      socket.off('disconnect', onDisconnect);
    };
  }, [conversationId, currentUserId, socket, stopTyping]);

  const selectSearchResult = (result: ChatMessageSearchResult) => {
    setAnchorSequence(result.sequence);
    setHighlightedMessageId(result.id);
    setSearchOpen(false);
  };
  const jumpToMessage = (id: string, sequence?: string) => {
    if (sequence) setAnchorSequence(sequence);
    setHighlightedMessageId(id);
    setSearchOpen(false);
  };
  const backToLatest = () => {
    setAnchorSequence(undefined);
    setHighlightedMessageId(undefined);
  };

  return {
    search,
    searchOpen,
    searchInput,
    debouncedSearch,
    setSearchOpen,
    setSearchInput,
    selectSearchResult,
    anchorSequence,
    highlightedMessageId,
    jumpToMessage,
    backToLatest,
    typingUserIds: Object.keys(typingExpiries),
    sendTyping,
    stopTyping,
  };
};
