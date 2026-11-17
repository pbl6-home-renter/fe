import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { roommateApi } from '../api/roommate.api';
import { ROOMMATE_QUERY_KEYS } from '../constants/roommate.constants';
import type { MyRoommateProfileDto, RoommateProfileSaveRequestDto } from '../types/roommate.dto';
import type { MutationHookOptions } from '@/lib/query/types';
import { notify } from '@/lib/notifications/notify';

export const useSaveRoommateProfileMutation = (
  options?: MutationHookOptions<MyRoommateProfileDto, RoommateProfileSaveRequestDto>,
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('roommates');

  return useMutation({
    mutationFn: (payload: RoommateProfileSaveRequestDto) => roommateApi.saveMyProfile(payload),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(ROOMMATE_QUERY_KEYS.myProfile(), data);
      void queryClient.invalidateQueries({ queryKey: ROOMMATE_QUERY_KEYS.myProfile() });
      void queryClient.invalidateQueries({ queryKey: ROOMMATE_QUERY_KEYS.all });
      notify.success(t('profile.saveSuccess'));
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
};
