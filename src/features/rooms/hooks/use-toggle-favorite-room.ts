import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomPublicListItemDto } from '../types/room.dto';
import type { Paginated } from '@/types/api';
import type { MutationHookOptions } from '@/lib/query/types';
import { getApiErrorCode, getErrorMessage } from '@/lib/api/errors';
import { notify } from '@/lib/notifications/notify';

export interface ToggleFavoriteRoomVariables {
  roomId: string;
  isFavorited: boolean;
}

export const useToggleFavoriteRoom = (options?: MutationHookOptions<void, ToggleFavoriteRoomVariables>) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('rooms');

  const mutation = useMutation({
    mutationFn: async ({ roomId, isFavorited }: ToggleFavoriteRoomVariables): Promise<void> => {
      if (isFavorited) {
        await roomApi.removeFavoriteRoom(roomId);
      } else {
        await roomApi.addFavoriteRoom(roomId);
      }
    },
    onMutate: async ({ roomId, isFavorited }: ToggleFavoriteRoomVariables) => {
      await queryClient.cancelQueries({ queryKey: ROOM_QUERY_KEYS.ALL });

      const previousQueries = queryClient.getQueriesData<Paginated<RoomPublicListItemDto>>({
        queryKey: ROOM_QUERY_KEYS.ALL,
      });

      const nextIsFavorited = !isFavorited;

      // Optimistically flip isFavorited in public list queries
      queryClient.setQueriesData<Paginated<RoomPublicListItemDto>>({ queryKey: ['rooms', 'public-list'] }, (old) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((room) => (room.id === roomId ? { ...room, isFavorited: nextIsFavorited } : room)),
        };
      });

      // Optimistically update favorite list queries
      queryClient.setQueriesData<Paginated<RoomPublicListItemDto>>({ queryKey: ['rooms', 'favorite-list'] }, (old) => {
        if (!old?.items) return old;
        if (!nextIsFavorited) {
          return {
            ...old,
            items: old.items.filter((room) => room.id !== roomId),
            pagination: old.pagination
              ? {
                  ...old.pagination,
                  totalItems: Math.max(0, old.pagination.totalItems - 1),
                }
              : old.pagination,
          };
        }
        return old;
      });

      return { previousQueries };
    },
    onError: (error, variables, onMutateResult, context) => {
      const is409 =
        (axios.isAxiosError(error) && error.response?.status === 409) || getApiErrorCode(error) === 'ALREADY_FAVORITED';
      const is404 =
        (axios.isAxiosError(error) && error.response?.status === 404) ||
        getApiErrorCode(error) === 'RESOURCE_NOT_FOUND';

      if (is409) {
        // 409 when saving -> consider already saved, do not rollback and do not alert error
        return;
      }

      // Rollback optimistic update
      if (onMutateResult?.previousQueries) {
        onMutateResult.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (is404) {
        notify.error(t('favorite.roomNoLongerAvailable'));
      } else {
        notify.error(getErrorMessage(error));
      }

      options?.onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      if (!variables.isFavorited) {
        notify.success(t('favorite.saveSuccess'));
      } else {
        notify.success(t('favorite.removeSuccess'));
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      options?.onSettled?.(data, error, variables, onMutateResult, context);
    },
  });

  return {
    toggleFavorite: mutation.mutate,
    toggleFavoriteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutation,
  };
};
