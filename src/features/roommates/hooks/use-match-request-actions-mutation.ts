import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { roommateApi } from '../api/roommate.api';
import { ROOMMATE_QUERY_KEYS } from '../constants/roommate.constants';
import type { MatchRequestDto } from '../types/roommate.dto';
import type { MutationHookOptions } from '@/lib/query/types';
import { notify } from '@/lib/notifications/notify';

export const useAcceptMatchRequestMutation = (options?: MutationHookOptions<MatchRequestDto, string>) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('roommates');

  return useMutation({
    mutationFn: (id: string) => roommateApi.acceptMatchRequest(id),
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: ROOMMATE_QUERY_KEYS.all });
      notify.success(t('requests.acceptSuccess'));
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
};

export const useRejectMatchRequestMutation = (options?: MutationHookOptions<MatchRequestDto, string>) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('roommates');

  return useMutation({
    mutationFn: (id: string) => roommateApi.rejectMatchRequest(id),
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: ROOMMATE_QUERY_KEYS.all });
      notify.info(t('requests.rejectSuccess'));
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
};

export const useWithdrawMatchRequestMutation = (options?: MutationHookOptions<MatchRequestDto, string>) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('roommates');

  return useMutation({
    mutationFn: (id: string) => roommateApi.withdrawMatchRequest(id),
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: ROOMMATE_QUERY_KEYS.all });
      notify.info(t('requests.withdrawSuccess'));
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
};
