import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { AppealResponseDto, AppealSubmitRequestDto } from '../types/moderation.dto';

export const useSubmitAppealMutation = (options?: MutationHookOptions<AppealResponseDto, AppealSubmitRequestDto>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AppealSubmitRequestDto) => moderationApi.submitMyAppeal(body),
    ...options,
    onSettled: (...args) => {
      // A 409 (already pending, cooldown) also means the page shows a stale state.
      void queryClient.invalidateQueries({ queryKey: MODERATION_QUERY_KEYS.MY_APPEAL });
      return options?.onSettled?.(...args);
    },
  });
};
